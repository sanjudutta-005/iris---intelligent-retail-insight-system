import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useRetailStore } from '../store/useRetailStore';
import { ProductImage } from '../components/common/ProductImage';

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    products,
    selectedProductId,
    setSelectedProduct,
    activeVariantMap,
    setActiveVariant,
    startNavigationToProduct,
    triggerFlashEslTag,
    flashingEslTag,
    addToCart,
    updateCartQuantity,
    cartItems,
    setBarcodeScannerOpen
  } = useRetailStore();

  const product = products.find((p) => p.id === (id || selectedProductId)) || products[0];

  const currentVariantId = activeVariantMap[product.id] || product.selectedVariantId;
  const currentVariant = product.variants.find((v) => v.id === currentVariantId) || product.variants[0];

  const cartItem = cartItems.find((i) => i.product.id === product.id && i.variant.id === currentVariant.id);
  const cartQty = cartItem ? cartItem.quantity : 0;

  const [isSaved, setIsSaved] = useState(false);
  const isFlashing = flashingEslTag === product.location.eslTagId;

  const handleSelectVariant = (varId: string) => {
    setActiveVariant(product.id, varId);
  };

  const handleNavigateToShelf = () => {
    setSelectedProduct(product.id);
    startNavigationToProduct(product);
    navigate('/map');
  };

  const handleFlashLed = () => {
    triggerFlashEslTag(product.location.eslTagId);
  };

  const handleAddToCart = () => {
    addToCart(product, currentVariant);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-6">
      {/* Interactive Breadcrumbs & Location Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium overflow-x-auto">
          <Link to="/" className="hover:text-[#2563EB]">Supermart</Link>
          <span className="material-symbols-outlined text-[14px]">chevron_right</span>
          <Link to="/products" className="hover:text-[#2563EB]">{product.department}</Link>
          <span className="material-symbols-outlined text-[14px]">chevron_right</span>
          <span className="text-[#0F172A] font-bold">{product.category}</span>
        </div>

        <div className="flex items-center gap-2 bg-[#F1F5F9] px-3 py-1.5 rounded-full border border-slate-200">
          <span className="material-symbols-outlined text-[#2563EB] text-[16px]">share_location</span>
          <span className="text-xs font-bold text-[#0F172A]">You are at Aisle 4, Bay 2</span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A]" />
          <span className="text-[11px] text-slate-500">{product.location.eslTagId}</span>
        </div>
      </div>

      {/* Main PDP Grid: Image + Details (Left), Shelf Coordinates & Navigation (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Product Information & Variant Selector (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {/* Main Visual Box */}
          <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-6 relative overflow-hidden flex flex-col items-center">
            {/* Top Overlay Badge */}
            <div className="w-full flex items-center justify-between z-10">
              <span className="px-3 py-1 rounded-full bg-[#2563EB] text-white text-xs font-bold shadow-xs flex items-center gap-1">
                <span className="material-symbols-outlined text-[15px]">near_me</span>
                <span>{product.location.distanceMeters}m away • {product.location.aisle}</span>
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsSaved(!isSaved)}
                  className={`w-9 h-9 rounded-full flex items-center justify-center border transition-colors ${
                    isSaved ? 'bg-red-50 text-red-600 border-red-200' : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'
                  }`}
                  title="Bookmark item"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {isSaved ? 'favorite' : 'favorite_border'}
                  </span>
                </button>
              </div>
            </div>

            {/* Product Packshot Image */}
            <div className="w-full h-64 sm:h-72 flex items-center justify-center my-3 relative">
              <ProductImage
                src={product.image}
                alt={product.name}
                category={product.category}
                className="max-h-full max-w-full object-contain drop-shadow-md"
              />
              <div className="absolute bottom-1 right-2 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/90 backdrop-blur-sm border border-slate-200 shadow-xs">
                <span className="material-symbols-outlined text-[15px] text-amber-500" style={{ fontVariationSettings: "'FILL' 1" }}>
                  star
                </span>
                <span className="text-xs font-bold text-[#0F172A]">{product.rating}</span>
                <span className="text-xs text-slate-400">({product.reviewCount} reviews)</span>
              </div>
            </div>

            {/* Shelf Stock Confirmation Strip */}
            <div className="w-full bg-[#F8FAFC] border border-slate-200 px-3.5 py-2.5 rounded-xl flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#16A34A]" />
                <span className="font-bold text-[#0F172A]">Available in Store</span>
              </div>
              <span className="text-slate-600 font-medium">
                {currentVariant.stock} units on shelf • {product.location.shelf} ({product.location.bin})
              </span>
            </div>
          </div>

          {/* Product Header & Pricing */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#2563EB] uppercase tracking-wider">
                {product.brand} • {product.category}
              </span>
              {currentVariant.discountPercent && (
                <span className="px-2.5 py-0.5 rounded-full bg-red-100 text-red-600 font-bold text-xs border border-red-200">
                  {currentVariant.discountPercent}% OFF
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] leading-tight">
              {product.name}
            </h1>

            <p className="text-sm text-slate-600 leading-relaxed">{product.description}</p>
          </div>

          {/* Pricing & Unit Cost Normalization Box */}
          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-4 shadow-xs flex flex-col gap-3">
            <div className="flex items-baseline justify-between">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-extrabold text-[#0F172A]">₹{currentVariant.price}</span>
                {currentVariant.originalPrice > currentVariant.price && (
                  <span className="text-base text-slate-400 line-through">₹{currentVariant.originalPrice}</span>
                )}
              </div>
              {currentVariant.discountPercent && (
                <div className="text-right">
                  <span className="text-xs font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                    Save ₹{currentVariant.originalPrice - currentVariant.price}
                  </span>
                  <span className="block text-[11px] text-emerald-600 font-semibold mt-0.5">
                    Store Special ESL Price
                  </span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
              <div className="flex items-center gap-1.5 text-slate-500 font-medium">
                <span className="material-symbols-outlined text-[16px] text-[#2563EB]">scale</span>
                <span>Normalized Unit Rate:</span>
              </div>
              <span className="font-bold text-sm text-[#2563EB]">{currentVariant.unitPriceText}</span>
            </div>
          </div>

          {/* Variant Selector Matrix */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-[#0F172A]">Select Size & Compare Unit Cost</h2>
              <span className="text-xs text-[#2563EB] font-semibold">Smart In-Store Optimizer</span>
            </div>

            {/* Grid of Variants */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {product.variants.map((v) => {
                const isSelected = v.id === currentVariant.id;
                return (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => handleSelectVariant(v.id)}
                    className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all relative ${
                      isSelected
                        ? 'border-[#2563EB] bg-blue-50/60 shadow-sm ring-2 ring-[#2563EB]/20'
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-[#2563EB] text-white flex items-center justify-center shadow-xs">
                        <span className="material-symbols-outlined text-[14px]">check</span>
                      </div>
                    )}
                    <div className="flex items-start justify-between">
                      <span className="text-sm font-bold text-[#0F172A]">{v.size}</span>
                      {v.isBestValue && (
                        <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded">
                          BEST VALUE
                        </span>
                      )}
                    </div>
                    <div className="mt-2">
                      <span className="text-base font-bold text-[#0F172A]">₹{v.price}</span>
                      <div className="text-[11px] text-slate-500 font-medium">{v.unitPriceText}</div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Pro Tip */}
            <div className="bg-blue-50 border border-blue-200 p-3 rounded-xl flex items-center gap-2.5 text-xs text-slate-700">
              <span className="material-symbols-outlined text-[#2563EB] text-[20px] shrink-0">lightbulb</span>
              <p>
                <strong className="text-[#2563EB]">Pro Tip:</strong> 200g pack saves ₹17.50 / 100g compared to the 50g starter pack. Both are placed together on {product.location.shelf}.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Physical Shelf Locator Card & Navigation (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {/* Signature IRIS Shelf Locator Card */}
          <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-md p-5 flex flex-col gap-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="px-2.5 py-0.5 rounded-full bg-[#0F172A] text-white text-xs font-bold">
                  {product.location.aisle} • {product.location.shelf} • {product.location.bin}
                </span>
                <h3 className="text-base font-bold text-[#0F172A] mt-1.5">{product.location.tier} Display</h3>
                <span className="text-xs text-slate-500">3rd rack from floor level • Face forward</span>
              </div>
              <div className="w-10 h-10 rounded-full bg-blue-50 text-[#2563EB] flex items-center justify-center border border-blue-200">
                <span className="material-symbols-outlined text-[24px]">view_in_ar</span>
              </div>
            </div>

            {/* Mini Supermarket Floor Plan Vector Preview */}
            <div className="relative w-full h-36 rounded-xl bg-[#F8FAFC] border border-slate-200 overflow-hidden p-3 flex flex-col justify-between">
              <svg className="absolute inset-0 w-full h-full opacity-60" viewBox="0 0 320 144">
                <rect x="16" y="16" width="60" height="24" rx="4" fill="#DAE2FD" />
                <rect x="96" y="16" width="60" height="24" rx="4" fill="#DAE2FD" />
                <rect x="176" y="16" width="60" height="24" rx="4" fill="#2563EB" fillOpacity="0.4" />
                <rect x="256" y="16" width="50" height="24" rx="4" fill="#DAE2FD" />
                <rect x="16" y="72" width="60" height="24" rx="4" fill="#DAE2FD" />
                <rect x="96" y="72" width="60" height="24" rx="4" fill="#DAE2FD" />
                <rect x="176" y="72" width="60" height="24" rx="4" fill="#DAE2FD" />
                <rect x="256" y="72" width="50" height="24" rx="4" fill="#DAE2FD" />
                <path d="M 66 120 L 66 52 L 206 52 L 206 40" stroke="#2563EB" strokeWidth="3" strokeDasharray="4 4" strokeLinecap="round" />
              </svg>

              <div className="relative z-10 flex items-center justify-between text-xs">
                <span className="bg-white/90 px-2 py-0.5 rounded font-semibold text-[#0F172A] border border-slate-200">
                  Cart #BC-882 (Aisle 4)
                </span>
                <span className="text-slate-500 font-medium">
                  {product.location.distanceMeters} meters away (~1 min)
                </span>
              </div>

              <div className="relative z-10 flex items-end justify-between">
                <span className="px-2 py-0.5 rounded-full bg-[#2563EB] text-white text-[11px] font-bold animate-bounce flex items-center gap-1 shadow-sm">
                  <span className="material-symbols-outlined text-[12px]">location_on</span>
                  <span>Target {product.location.shelf}</span>
                </span>
                <span className="text-[11px] text-slate-500 bg-white/80 px-2 py-0.5 rounded border border-slate-200">
                  Floor 1: Supermart
                </span>
              </div>
            </div>

            {/* Hardware CTA Buttons */}
            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={handleNavigateToShelf}
                className="w-full h-12 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white text-sm font-bold flex items-center justify-center gap-2 shadow-sm transition-all active:scale-[0.98]"
              >
                <span className="material-symbols-outlined text-[20px]">turn_right</span>
                <span>Plot In-Store Turn-by-Turn Route</span>
              </button>

              <button
                type="button"
                onClick={handleFlashLed}
                className={`w-full h-11 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border transition-all ${
                  isFlashing
                    ? 'bg-cyan-400 text-slate-900 border-cyan-500 animate-pulse'
                    : 'bg-blue-50 text-[#2563EB] border-blue-200 hover:bg-blue-100'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">wb_twilight</span>
                <span>{isFlashing ? 'Shelf LED Blinking Cyan (30s)...' : 'Flash Shelf ESL Tag Light'}</span>
              </button>
            </div>

            {/* Micro Tools: Scan Tag & Add to Cart */}
            <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setBarcodeScannerOpen(true)}
                className="p-2.5 rounded-xl bg-[#F8FAFC] border border-slate-200 hover:bg-slate-100 flex items-center gap-2 text-left"
              >
                <span className="material-symbols-outlined text-[#2563EB] text-[20px]">barcode_scanner</span>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-[#0F172A]">Scan Shelf</span>
                  <span className="text-[10px] text-slate-500">Verify Price & Tag</span>
                </div>
              </button>

              <button
                type="button"
                onClick={handleAddToCart}
                className="p-2.5 rounded-xl bg-[#F8FAFC] border border-slate-200 hover:bg-slate-100 flex items-center gap-2 text-left"
              >
                <span className="material-symbols-outlined text-[#16A34A] text-[20px]">add_shopping_cart</span>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-[#0F172A]">Add to Cart</span>
                  <span className="text-[10px] text-slate-500">Sync with Trip</span>
                </div>
              </button>
            </div>
          </div>

          {/* Products Also on Shelf B (Adjacent Pairings) */}
          {product.pairedProducts && product.pairedProducts.length > 0 && (
            <div className="bg-white rounded-2xl border border-[#E2E8F0] p-4 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">
                  Also on {product.location.shelf} ({product.category})
                </h3>
                <span className="text-xs text-[#2563EB] font-semibold cursor-pointer">Explore Bay</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {product.pairedProducts.map((paired) => (
                  <div
                    key={paired.id}
                    className="p-2.5 rounded-xl bg-[#F8FAFC] border border-slate-200 flex flex-col justify-between hover:border-blue-300 transition-colors"
                  >
                    <div className="w-full h-20 bg-white rounded-lg flex items-center justify-center overflow-hidden mb-1.5 p-1">
                      <ProductImage src={paired.image} alt={paired.name} className="h-full object-contain" />
                    </div>
                    <span className="text-xs font-bold text-[#0F172A] truncate">{paired.name}</span>
                    <span className="text-[10px] text-slate-500">{paired.relation}</span>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs font-bold text-[#0F172A]">₹{paired.price}</span>
                      <button
                        type="button"
                        onClick={() => {
                          const p = products.find(prod => prod.id === paired.id);
                          if (p) addToCart(p);
                        }}
                        className="w-6 h-6 rounded-full bg-blue-100 text-[#2563EB] flex items-center justify-center hover:bg-[#2563EB] hover:text-white transition-colors"
                      >
                        <span className="material-symbols-outlined text-[14px]">add</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Sticky Bottom Interactive Navigation Strip (Blinkit / Instamart style) */}
      <div className="fixed bottom-16 md:bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] p-3 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-sm font-extrabold text-[#1C1C1C] truncate">
                {product.name} ({currentVariant.size})
              </span>
              <span className="text-base font-extrabold text-[#0C831F]">₹{currentVariant.price}</span>
            </div>
            <span className="text-xs text-emerald-700 font-bold truncate">
              {currentVariant.discountPercent ? `Save ₹${currentVariant.originalPrice - currentVariant.price} with store offer` : `In Stock at ${product.location.aisle}`}
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Blinkit ADD Stepper */}
            {cartQty > 0 ? (
              <div className="flex items-center bg-[#0C831F] text-white rounded-xl px-2 py-1.5 gap-2 font-extrabold text-sm shadow-xs">
                <button
                  type="button"
                  onClick={() => updateCartQuantity(product.id, -1)}
                  className="w-6 h-6 rounded hover:bg-emerald-700 flex items-center justify-center transition-colors active:scale-90"
                >
                  −
                </button>
                <span className="min-w-[18px] text-center">{cartQty}</span>
                <button
                  type="button"
                  onClick={() => updateCartQuantity(product.id, 1)}
                  className="w-6 h-6 rounded hover:bg-emerald-700 flex items-center justify-center transition-colors active:scale-90"
                >
                  +
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => addToCart(product, currentVariant)}
                className="h-11 px-4 sm:px-5 rounded-xl border border-[#0C831F] bg-[#F7FFF9] hover:bg-[#0C831F] text-[#0C831F] hover:text-white font-extrabold text-xs sm:text-sm flex items-center gap-1.5 shadow-xs transition-all active:scale-95"
              >
                <span>ADD</span>
                <span className="text-base font-bold">+</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleNavigateToShelf}
              className="h-11 px-4 sm:px-5 rounded-xl bg-[#0C831F] hover:bg-[#0A701A] text-white text-xs sm:text-sm font-extrabold flex items-center gap-1.5 shadow-xs active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-[18px]">turn_sharp_right</span>
              <span>Go to Shelf ({product.location.distanceMeters}m)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
