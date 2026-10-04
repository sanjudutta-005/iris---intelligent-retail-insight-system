import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { useRetailStore } from '../store/useRetailStore';
import { ProductImage } from '../components/common/ProductImage';

export const TripOptimizerPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    cartItems,
    toggleItemCollected,
    updateCartQuantity,
    removeFromCart,
    isColdChainLockEnabled,
    setColdChainLock,
    triggerFlashEslTag,
    flashingEslTag,
    startNavigationToProduct,
    setSelectedProduct
  } = useRetailStore();

  const [activeStep, setActiveStep] = useState(1);
  const [isNavigatingLive, setIsNavigatingLive] = useState(false);

  const allCompleted = cartItems.length > 0 && cartItems.every((item) => item.isCollected);
  const collectedCount = cartItems.filter((i) => i.isCollected).length;

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.variant.price * item.quantity,
    0
  );
  const totalOriginal = cartItems.reduce(
    (acc, item) => acc + (item.variant.originalPrice || item.variant.price) * item.quantity,
    0
  );
  const totalSavings = totalOriginal > subtotal ? totalOriginal - subtotal : 0;

  const handleToggleCollected = (productId: string) => {
    toggleItemCollected(productId);
    const updated = cartItems.map((item) =>
      item.product.id === productId ? { ...item, isCollected: !item.isCollected } : item
    );
    if (updated.every((item) => item.isCollected)) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  const handleStartWayfinding = () => {
    setIsNavigatingLive(true);
    const firstUncollected = cartItems.find((item) => !item.isCollected) || cartItems[0];
    if (firstUncollected) {
      setSelectedProduct(firstUncollected.product.id);
      startNavigationToProduct(firstUncollected.product);
      navigate('/map');
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-6 pb-32">
      {/* Top Navigation & Path Header Bar */}
      <section className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="w-9 h-9 rounded-full flex items-center justify-center text-slate-500 hover:text-[#1C1C1C] hover:bg-slate-100 transition-colors"
          >
            <span className="material-symbols-outlined text-[22px]">arrow_back</span>
          </button>
          <div className="flex items-center gap-1.5 bg-white px-3 py-1 rounded-full border border-slate-200 text-xs font-bold shadow-xs">
            <span className="material-symbols-outlined text-[#0C831F] text-[15px]">storefront</span>
            <span className="text-[#1C1C1C]">Floor 1 • Grocery & FMCG Aisles</span>
          </div>
          <div className="w-9" />
        </div>

        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1C1C1C] tracking-tight">
              Shopping Route Optimizer
            </h1>
            <span className="bg-emerald-100 text-[#0C831F] text-xs font-extrabold px-2.5 py-0.5 rounded-full">
              Zero Backtracking
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5 font-medium">
            {cartItems.length} stops mapped • Optimal single-pass walking path from your current cart position
          </p>
        </div>
      </section>

      {/* Instamart-style Route Efficiency Index Card */}
      <section className="bg-white rounded-2xl p-5 border border-[#E8ECF4] shadow-xs relative overflow-hidden">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#0C831F] text-white flex items-center justify-center shadow-xs">
              <span className="material-symbols-outlined text-[20px]">route</span>
            </div>
            <div>
              <span className="text-xs font-bold text-[#1C1C1C] block leading-tight">Route Efficiency Score</span>
              <span className="text-xs text-[#0C831F] font-extrabold flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">bolt</span>
                56% Less Walking Distance
              </span>
            </div>
          </div>

          <span className="bg-emerald-50 text-[#0C831F] border border-emerald-200 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-xs">
            <span className="material-symbols-outlined text-[14px]">timer</span>
            Saves ~8.5 mins
          </span>
        </div>

        {/* Distance Benchmark Matrix */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3">
          <div className="p-2.5 bg-slate-50 rounded-xl flex flex-col">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Unplanned Walk</span>
            <span className="text-base font-extrabold text-slate-500 line-through">380 meters</span>
          </div>
          <div className="p-2.5 bg-emerald-50 rounded-xl flex flex-col border border-emerald-100">
            <span className="text-[10px] text-emerald-800 font-bold uppercase tracking-wider">IRIS Guided Path</span>
            <span className="text-base font-extrabold text-[#0C831F]">165 meters</span>
          </div>
          <div className="p-2.5 bg-slate-50 rounded-xl flex flex-col">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Items Collected</span>
            <span className="text-base font-extrabold text-[#1C1C1C]">
              {collectedCount} / {cartItems.length}
            </span>
          </div>
          <div className="p-2.5 bg-slate-50 rounded-xl flex flex-col">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total Bill</span>
            <span className="text-base font-extrabold text-[#1C1C1C]">₹{subtotal}</span>
          </div>
        </div>
      </section>

      {/* Main Stops Sequence Feed */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-extrabold text-[#1C1C1C]">
            Turn-by-Turn Waypoint Stops
          </h2>
          <span className="text-xs text-slate-500 font-medium">Sorted for shortest physical path</span>
        </div>

        {/* Stops Feed */}
        <div className="flex flex-col gap-3">
          {cartItems.map((item, index) => {
            const isFlashing = flashingEslTag === item.product.location.eslTagId;
            const stopNum = index + 1;

            return (
              <article
                key={item.product.id}
                className={`bg-white rounded-2xl p-4 border transition-all duration-200 ${
                  item.isCollected
                    ? 'border-emerald-200 bg-emerald-50/40 opacity-80'
                    : 'border-[#E8ECF4] shadow-xs hover:border-emerald-300'
                }`}
              >
                <div className="flex items-start gap-3">
                  {/* Sequence Step Marker */}
                  <div className="flex flex-col items-center shrink-0 pt-0.5">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-extrabold ${
                        item.isCollected
                          ? 'bg-[#0C831F] text-white'
                          : 'bg-[#1C1C1C] text-white'
                      }`}
                    >
                      {item.isCollected ? '✓' : stopNum}
                    </div>
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-1.5">
                      <span className="text-[11px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">
                        Stop #{stopNum} • {item.product.location.distanceMeters}m away
                      </span>

                      <button
                        type="button"
                        onClick={() => triggerFlashEslTag(item.product.location.eslTagId)}
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-bold border transition-colors ${
                          isFlashing
                            ? 'bg-cyan-100 text-cyan-800 border-cyan-300 animate-pulse'
                            : 'bg-slate-50 text-slate-600 hover:text-[#0C831F] border-slate-200'
                        }`}
                        title="Flash Shelf LED"
                      >
                        <span className="material-symbols-outlined text-[16px]">lightbulb</span>
                        <span className="text-[10px]">Flash LED</span>
                      </button>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 rounded-xl bg-[#F8FAFC] border border-slate-200 shrink-0 p-1 flex items-center justify-center">
                        <ProductImage
                          src={item.product.image}
                          alt={item.product.name}
                          category={item.product.category}
                          className="w-full h-full object-contain"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-sm text-[#1C1C1C] truncate">
                          {item.product.name}
                        </h3>
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
                          <span className="bg-[#1C1C1C] text-white text-[10px] px-1.5 py-0.2 rounded font-bold">
                            {item.product.location.aisle}
                          </span>
                          <span className="font-semibold text-slate-700">
                            {item.product.location.shelf} ({item.variant.size})
                          </span>
                        </div>
                      </div>

                      {/* Stepper Controls in Trip Optimizer */}
                      <div className="flex items-center bg-slate-100 rounded-lg px-1.5 py-1 gap-1.5 text-xs font-bold shrink-0">
                        <button
                          type="button"
                          onClick={() => updateCartQuantity(item.product.id, -1)}
                          className="w-5 h-5 rounded hover:bg-slate-200 flex items-center justify-center text-slate-700"
                        >
                          −
                        </button>
                        <span className="min-w-[14px] text-center font-extrabold">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateCartQuantity(item.product.id, 1)}
                          className="w-5 h-5 rounded hover:bg-slate-200 flex items-center justify-center text-slate-700"
                        >
                          +
                        </button>
                      </div>

                      {/* Checkbox */}
                      <button
                        type="button"
                        onClick={() => handleToggleCollected(item.product.id)}
                        className={`w-8 h-8 rounded-xl border-2 flex items-center justify-center transition-all shrink-0 ${
                          item.isCollected
                            ? 'bg-[#0C831F] border-[#0C831F] text-white'
                            : 'border-slate-300 hover:border-[#0C831F] bg-white'
                        }`}
                        title="Mark item collected"
                      >
                        {item.isCollected && (
                          <span className="material-symbols-outlined text-[18px] font-bold">check</span>
                        )}
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 text-xs">
                      <div className="flex items-baseline gap-2">
                        <span className="font-extrabold text-sm text-[#1C1C1C]">
                          ₹{item.variant.price * item.quantity}
                        </span>
                        {item.variant.discountPercent && (
                          <span className="text-[10px] text-red-600 bg-red-50 px-1.5 py-0.2 rounded font-bold">
                            {item.variant.discountPercent}% OFF
                          </span>
                        )}
                      </div>
                      <span className="text-slate-400 text-[11px]">{item.variant.unitPriceText}</span>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}

          {/* Checkout Final Destination Item */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#1C1C1C] text-white flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[20px]">point_of_sale</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-[#1C1C1C]">Final Destination: Self-Checkout Counters 1-4</p>
              <p className="text-[11px] text-slate-500 font-medium">Scan QR on cart handle at kiosk for 1-touch sync</p>
            </div>
          </div>
        </div>
      </section>

      {/* Bill & Savings Summary Card (Blinkit Style) */}
      <section className="bg-white rounded-2xl p-5 border border-[#E8ECF4] shadow-xs flex flex-col gap-2.5">
        <h3 className="font-extrabold text-sm text-[#1C1C1C] pb-2 border-b border-slate-100">
          Trip Bill & Savings Summary
        </h3>
        <div className="flex items-center justify-between text-xs text-slate-600 font-medium">
          <span>Items Total ({cartItems.length} products)</span>
          <span className="font-bold text-[#1C1C1C]">₹{totalOriginal}</span>
        </div>
        {totalSavings > 0 && (
          <div className="flex items-center justify-between text-xs text-[#0C831F] font-bold">
            <span>In-Store Shelf Discounts</span>
            <span>- ₹{totalSavings}</span>
          </div>
        )}
        <div className="flex items-center justify-between text-sm font-extrabold text-[#1C1C1C] pt-2 border-t border-slate-100">
          <span>Estimated Total To Pay</span>
          <span className="text-base text-[#0C831F]">₹{subtotal}</span>
        </div>
      </section>

      {/* Sticky Primary Action Dock */}
      <div className="fixed bottom-16 md:bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] p-3 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex flex-col">
            <span className="text-xs font-extrabold text-[#1C1C1C]">
              {collectedCount} of {cartItems.length} Collected • ₹{subtotal}
            </span>
            <span className="text-xs text-[#0C831F] font-bold">~5.5 min optimal walking time</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleStartWayfinding}
              className="py-2.5 px-6 bg-[#0C831F] hover:bg-[#0A701A] text-white rounded-xl text-xs sm:text-sm font-extrabold shadow-xs transition-all active:scale-95 flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">explore</span>
              <span>Start Turn-by-Turn Wayfinding</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
