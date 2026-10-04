import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Product } from '../../types/retail';
import { useRetailStore } from '../../store/useRetailStore';
import { ProductImage } from '../common/ProductImage';

interface ProductCardProps {
  product: Product;
  onLocate?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onLocate }) => {
  const navigate = useNavigate();
  const {
    activeVariantMap,
    setActiveVariant,
    openMiniMapDrawer,
    addToCart,
    updateCartQuantity,
    cartItems,
    startNavigationToProduct,
    setSelectedProduct
  } = useRetailStore();

  const currentVariantId = activeVariantMap[product.id] || product.selectedVariantId;
  const currentVariant = product.variants.find((v) => v.id === currentVariantId) || product.variants[0];

  const cartItem = cartItems.find(
    (i) => i.product.id === product.id && i.variant.id === currentVariant.id
  );
  const cartQty = cartItem ? cartItem.quantity : 0;

  const [showVariantMenu, setShowVariantMenu] = useState(false);

  const handleLocateClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (onLocate) {
      onLocate(product);
    } else {
      setSelectedProduct(product.id);
      openMiniMapDrawer(
        product.name,
        `${product.location.aisle} • ${product.location.shelf} (${product.location.tier}, ${product.location.bin})`,
        `Walking time: ${product.location.walkingTimeText} (${product.location.distanceMeters}m)`,
        product.id
      );
    }
  };

  const handleDirectNavigate = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setSelectedProduct(product.id);
    startNavigationToProduct(product);
    navigate('/map');
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    addToCart(product, currentVariant);
  };

  const handleIncrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    updateCartQuantity(product.id, 1);
  };

  const handleDecrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    updateCartQuantity(product.id, -1);
  };

  const isOutOfStock = product.outOfStock || !currentVariant.inStock;

  return (
    <article className="bg-white rounded-2xl border border-[#E8ECF4] hover:border-[#16A34A]/50 hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] transition-all duration-200 flex flex-col justify-between overflow-hidden group relative">
      <div className="p-3 sm:p-3.5 flex flex-col gap-2.5">
        {/* Top Badges Bar: Discount Pill & In-Store Beacon Location */}
        <div className="flex items-center justify-between gap-1.5 min-h-[22px]">
          {product.offerBadge ? (
            <span className="bg-[#2563EB] text-white text-[10px] font-extrabold px-1.5 py-0.5 rounded shadow-xs uppercase tracking-wider">
              {product.offerBadge}
            </span>
          ) : isOutOfStock ? (
            <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded">
              Restock 4 PM
            </span>
          ) : (
            <span className="bg-slate-100 text-slate-600 text-[10px] font-semibold px-2 py-0.5 rounded">
              {product.category}
            </span>
          )}

          {/* Blinkit-style In-Store Aisle Pill */}
          <button
            type="button"
            onClick={handleLocateClick}
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-[#2563EB] text-[10px] font-bold border border-slate-200/80 transition-colors"
            title="View Shelf Location"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A] animate-pulse" />
            <span>{product.location.aisle} • {product.location.distanceMeters}m</span>
          </button>
        </div>

        {/* Product Visual Area */}
        <Link
          to={`/products/${product.id}`}
          className="relative w-full h-36 sm:h-40 rounded-xl bg-white flex items-center justify-center p-2 overflow-hidden cursor-pointer"
        >
          <ProductImage
            src={product.image}
            alt={product.name}
            category={product.category}
            className={`w-full h-full object-contain group-hover:scale-105 transition-transform duration-300 ${
              isOutOfStock ? 'grayscale-[60%] opacity-75' : ''
            }`}
          />

          {isOutOfStock && (
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[1px] flex items-center justify-center p-2 rounded-xl">
              <span className="bg-white px-2.5 py-1 rounded-full text-[11px] font-bold text-red-600 shadow-sm">
                Out of Stock
              </span>
            </div>
          )}
        </Link>

        {/* Instamart-style Walking Time & Shelf Pill */}
        <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-[#FFF8E7] text-[#8A5800] border border-[#FFE7A8] text-[10px] font-bold w-fit">
          <span className="material-symbols-outlined text-[12px]">schedule</span>
          <span>{product.location.walkingTimeText} walk</span>
          <span className="text-[#FFE7A8]">•</span>
          <span className="font-semibold text-slate-700">{product.location.shelf}</span>
        </div>

        {/* Product Name & Brand */}
        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            {product.brand}
          </span>
          <Link
            to={`/products/${product.id}`}
            className="font-bold text-[13px] sm:text-[14px] text-[#1C1C1C] line-clamp-2 leading-snug group-hover:text-[#0C831F] transition-colors mt-0.5"
          >
            {product.name}
          </Link>
        </div>

        {/* Variant Selector (Blinkit style) */}
        {product.variants.length > 1 ? (
          <div className="relative">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                setShowVariantMenu(!showVariantMenu);
              }}
              className="w-full flex items-center justify-between px-2 py-1 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 text-[11px] font-semibold text-slate-700 transition-colors"
            >
              <span className="font-bold text-[#1C1C1C]">{currentVariant.size}</span>
              <span className="flex items-center gap-1 text-[10px] text-slate-500">
                <span>{currentVariant.unitPriceText}</span>
                <span className="material-symbols-outlined text-[14px]">arrow_drop_down</span>
              </span>
            </button>

            {showVariantMenu && (
              <div
                className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-xl z-30 p-1 flex flex-col gap-0.5 animate-in fade-in zoom-in-95"
                onClick={(e) => e.stopPropagation()}
              >
                {product.variants.map((v) => (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => {
                      setActiveVariant(product.id, v.id);
                      setShowVariantMenu(false);
                    }}
                    className={`px-2 py-1.5 text-left text-xs rounded-lg flex items-center justify-between transition-colors ${
                      v.id === currentVariant.id
                        ? 'bg-emerald-50 text-[#0C831F] font-bold'
                        : 'hover:bg-slate-50 text-slate-700 font-medium'
                    }`}
                  >
                    <span>{v.size}</span>
                    <span className="font-bold">₹{v.price}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="text-[11px] text-slate-500 font-medium">
            {currentVariant.size} • <span className="text-slate-400">{currentVariant.unitPriceText}</span>
          </div>
        )}
      </div>

      {/* Bottom Pricing & Blinkit ADD Button Row */}
      <div className="p-3 sm:p-3.5 pt-0 border-t border-slate-100 mt-1 flex items-center justify-between gap-2">
        {/* Prices */}
        <div className="flex flex-col">
          <div className="flex items-baseline gap-1.5">
            <span className="text-base sm:text-[17px] font-extrabold text-[#1C1C1C]">
              ₹{currentVariant.price}
            </span>
            {currentVariant.originalPrice > currentVariant.price && (
              <span className="text-xs text-slate-400 line-through font-medium">
                ₹{currentVariant.originalPrice}
              </span>
            )}
          </div>
          <span className="text-[10px] text-emerald-700 font-semibold">
            {currentVariant.discountPercent ? `${currentVariant.discountPercent}% OFF` : 'Best Price'}
          </span>
        </div>

        {/* Action Controls: Blinkit ADD/Stepper + Quick Map Button */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={handleLocateClick}
            className="w-8 h-8 rounded-lg border border-slate-200 text-slate-500 hover:text-[#2563EB] hover:bg-blue-50 hover:border-blue-200 flex items-center justify-center transition-colors"
            title="Locate on Floor Map"
          >
            <span className="material-symbols-outlined text-[17px]">near_me</span>
          </button>

          {isOutOfStock ? (
            <button
              disabled
              className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-400 text-xs font-bold uppercase cursor-not-allowed"
            >
              Sold Out
            </button>
          ) : cartQty > 0 ? (
            /* Blinkit Signature Green Stepper */
            <div className="flex items-center bg-[#0C831F] text-white rounded-lg px-1.5 py-1 gap-1.5 shadow-xs font-bold text-xs select-none">
              <button
                type="button"
                onClick={handleDecrement}
                className="w-5 h-5 rounded hover:bg-emerald-700 flex items-center justify-center text-sm transition-colors active:scale-90"
                title="Decrease"
              >
                −
              </button>
              <span className="min-w-[16px] text-center font-extrabold text-xs">{cartQty}</span>
              <button
                type="button"
                onClick={handleIncrement}
                className="w-5 h-5 rounded hover:bg-emerald-700 flex items-center justify-center text-sm transition-colors active:scale-90"
                title="Increase"
              >
                +
              </button>
            </div>
          ) : (
            /* Blinkit Signature Green ADD Button */
            <button
              type="button"
              onClick={handleAddToCart}
              className="px-3.5 sm:px-4 py-1.5 rounded-lg border border-[#0C831F] bg-[#F7FFF9] hover:bg-[#0C831F] text-[#0C831F] hover:text-white font-extrabold text-xs transition-all uppercase tracking-wider shadow-xs hover:shadow-sm active:scale-95 flex items-center gap-1"
            >
              <span>ADD</span>
              <span className="text-sm font-bold leading-none">+</span>
            </button>
          )}
        </div>
      </div>
    </article>
  );
};
