import React from 'react';
import { useNavigate } from 'react-router-dom';
import { StoreOffer } from '../../types/retail';
import { useRetailStore } from '../../store/useRetailStore';
import { ProductImage } from '../common/ProductImage';

interface OfferCardProps {
  offer: StoreOffer;
}

export const OfferCard: React.FC<OfferCardProps> = ({ offer }) => {
  const navigate = useNavigate();
  const {
    products,
    openMiniMapDrawer,
    addToCart,
    updateCartQuantity,
    cartItems,
    setSelectedProduct
  } = useRetailStore();

  const matchingProduct = products.find((p) => p.id === offer.productId) || products[0];

  const cartItem = cartItems.find((i) => i.product.id === matchingProduct.id);
  const cartQty = cartItem ? cartItem.quantity : 0;

  const handleLocate = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setSelectedProduct(matchingProduct.id);
    openMiniMapDrawer(
      offer.title,
      `${offer.aisle} • ${offer.shelf} (${offer.bay})`,
      `Distance: ${offer.distanceMeters}m away`,
      matchingProduct.id
    );
  };

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    addToCart(matchingProduct);
  };

  const handleIncrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    updateCartQuantity(matchingProduct.id, 1);
  };

  const handleDecrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    updateCartQuantity(matchingProduct.id, -1);
  };

  return (
    <article className="bg-white rounded-2xl border border-[#E8ECF4] hover:border-[#16A34A]/50 hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] transition-all duration-200 flex flex-col justify-between overflow-hidden group relative">
      <div className="p-3 sm:p-3.5 flex flex-col gap-2.5">
        {/* Top Badges Row */}
        <div className="flex items-center justify-between gap-1.5 min-h-[22px]">
          <span className="bg-[#E53E3E] text-white text-[10px] font-extrabold px-1.5 py-0.5 rounded shadow-xs uppercase tracking-wider">
            {offer.discountBadge}
          </span>

          <button
            type="button"
            onClick={handleLocate}
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-[#2563EB] text-[10px] font-bold border border-slate-200/80 transition-colors"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A] animate-pulse" />
            <span>{offer.aisle} • {offer.distanceMeters}m</span>
          </button>
        </div>

        {/* Product Visual */}
        <div
          onClick={() => navigate(`/products/${matchingProduct.id}`)}
          className="relative w-full h-36 sm:h-40 rounded-xl bg-white flex items-center justify-center p-2 overflow-hidden cursor-pointer"
        >
          <ProductImage
            src={offer.image}
            alt={offer.title}
            category={offer.category}
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
          />

          {/* Instamart Soft Tag on image */}
          <div className="absolute bottom-1.5 left-1.5 bg-slate-900/80 backdrop-blur-sm text-white text-[9px] font-bold px-2 py-0.5 rounded flex items-center gap-1">
            <span className="material-symbols-outlined text-[11px] text-blue-400">near_me</span>
            <span>{offer.shelf}</span>
          </div>
        </div>

        {/* Instamart Timing Badge */}
        <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-[#FFF8E7] text-[#8A5800] border border-[#FFE7A8] text-[10px] font-bold w-fit">
          <span className="material-symbols-outlined text-[12px]">schedule</span>
          <span>{offer.validUntil}</span>
        </div>

        {/* Title & Unit rate */}
        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            {offer.category}
          </span>
          <h3
            onClick={() => navigate(`/products/${matchingProduct.id}`)}
            className="font-bold text-[13px] sm:text-[14px] text-[#1C1C1C] line-clamp-2 leading-snug group-hover:text-[#0C831F] transition-colors mt-0.5 cursor-pointer"
          >
            {offer.title}
          </h3>
          <span className="text-[11px] text-slate-500 font-medium mt-0.5">
            {offer.unitRateText}
          </span>
        </div>
      </div>

      {/* Bottom Pricing & ADD Row */}
      <div className="p-3 sm:p-3.5 pt-0 border-t border-slate-100 mt-1 flex items-center justify-between gap-2">
        <div className="flex flex-col">
          <div className="flex items-baseline gap-1.5">
            <span className="text-base sm:text-[17px] font-extrabold text-[#1C1C1C]">
              ₹{offer.offerPrice}
            </span>
            <span className="text-xs text-slate-400 line-through font-medium">
              ₹{offer.originalPrice}
            </span>
          </div>
          <span className="text-[10px] text-emerald-700 font-bold">
            {offer.savingsText}
          </span>
        </div>

        {/* Stepper or ADD Button */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={handleLocate}
            className="w-8 h-8 rounded-lg border border-slate-200 text-slate-500 hover:text-[#2563EB] hover:bg-blue-50 hover:border-blue-200 flex items-center justify-center transition-colors"
            title="Locate on Floor Map"
          >
            <span className="material-symbols-outlined text-[17px]">near_me</span>
          </button>

          {cartQty > 0 ? (
            <div className="flex items-center bg-[#0C831F] text-white rounded-lg px-1.5 py-1 gap-1.5 shadow-xs font-bold text-xs select-none">
              <button
                type="button"
                onClick={handleDecrement}
                className="w-5 h-5 rounded hover:bg-emerald-700 flex items-center justify-center text-sm transition-colors active:scale-90"
              >
                −
              </button>
              <span className="min-w-[16px] text-center font-extrabold text-xs">{cartQty}</span>
              <button
                type="button"
                onClick={handleIncrement}
                className="w-5 h-5 rounded hover:bg-emerald-700 flex items-center justify-center text-sm transition-colors active:scale-90"
              >
                +
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleAdd}
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
