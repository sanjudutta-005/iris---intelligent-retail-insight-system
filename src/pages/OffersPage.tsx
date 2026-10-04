import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRetailStore } from '../store/useRetailStore';
import { mockOffers } from '../data/mockRetailData';
import { OfferCard } from '../components/offers/OfferCard';
import { ProductImage } from '../components/common/ProductImage';

export const OffersPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    products,
    setSelectedProduct,
    startNavigationToProduct,
    addToCart,
    setAisleStaffModalOpen
  } = useRetailStore();

  const [activeCategoryTab, setActiveCategoryTab] = useState('All Deals');
  const [inStockOnly, setInStockOnly] = useState(true);
  const [within50mOnly, setWithin50mOnly] = useState(false);
  const [sortOption, setSortOption] = useState('Biggest Discount %');

  // Simulated countdown timer for flash deals
  const [secondsRemaining, setSecondsRemaining] = useState(2 * 3600 + 45 * 60 + 18);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatCountdown = (secs: number) => {
    const hours = Math.floor(secs / 3600);
    const mins = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return `${String(hours).padStart(2, '0')}h : ${String(mins).padStart(2, '0')}m : ${String(s).padStart(2, '0')}s`;
  };

  const megaDealOffer = mockOffers[0]; // Surf Excel Matic 2L

  const filteredOffers = useMemo(() => {
    return mockOffers.filter((o) => {
      if (activeCategoryTab === 'Lightning Flash Deals' && !o.isFlashDeal) return false;
      if (activeCategoryTab === 'Buy 1 Get 1 / Combos' && !o.isBogo) return false;
      if (activeCategoryTab === 'Grocery & Staples' && o.category !== 'Groceries') return false;
      if (activeCategoryTab === 'Personal Care' && o.category !== 'Personal Care') return false;
      if (activeCategoryTab === 'Dairy & Frozen' && o.category !== 'Dairy') return false;
      if (activeCategoryTab === 'Beverages & Snacks' && o.category !== 'Snacks') return false;
      if (activeCategoryTab === 'Home & Cleaning' && o.category !== 'Household') return false;

      if (within50mOnly && o.distanceMeters > 50) return false;

      return true;
    }).sort((a, b) => {
      if (sortOption === 'Nearest to My Cart (Distance)') {
        return a.distanceMeters - b.distanceMeters;
      }
      if (sortOption === 'Price: Low to High') {
        return a.offerPrice - b.offerPrice;
      }
      return b.discountPercent - a.discountPercent;
    });
  }, [activeCategoryTab, within50mOnly, sortOption]);

  const handleRouteMegaDeal = () => {
    const prod = products.find((p) => p.id === megaDealOffer.productId) || products[0];
    setSelectedProduct(prod.id);
    startNavigationToProduct(prod);
    navigate('/map');
  };

  const handleAddMegaDeal = () => {
    const prod = products.find((p) => p.id === megaDealOffer.productId) || products[0];
    addToCart(prod);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-6 pb-24">
      {/* Section 1: Header, Breadcrumbs & Real-time Live Status Bar */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
          <button type="button" onClick={() => navigate('/')} className="hover:text-[#2563EB]">Home</button>
          <span className="material-symbols-outlined text-[14px]">chevron_right</span>
          <span>In-Store Offers & Promotions</span>
          <span className="material-symbols-outlined text-[14px]">chevron_right</span>
          <span className="text-[#0F172A] font-bold">Today's Deals</span>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
          <div className="flex flex-col gap-1 max-w-3xl">
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-600" />
              </span>
              <span className="text-xs font-bold text-red-600 tracking-wider uppercase">
                Live Electronic Shelf Sync Active
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">
              Today's Offers & In-Store Flash Deals
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Real-time discounts synced with Electronic Shelf Labels (ESL) at Indiranagar Supermart. Verify aisle coordinate beacons and claim savings directly from the physical shelf.
            </p>
          </div>

          {/* Cart Beacon Status Chip */}
          <div className="flex items-center gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-sm shrink-0 self-start lg:self-auto">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center">
              <span className="material-symbols-outlined text-[22px]">shopping_cart</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-[#0F172A]">Cart #BC-882 • Aisle 4</span>
              <span className="text-xs text-[#16A34A] font-bold">12 active deals within 30m</span>
            </div>
          </div>
        </div>

        {/* Real-Time Metric Telemetry Strip (Image 11) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-white p-3 rounded-xl shadow-xs border border-slate-200 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center text-[#2563EB] shrink-0">
              <span className="material-symbols-outlined text-[20px]">bolt</span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[11px] text-slate-500 font-medium">Active In-Store</span>
              <span className="text-sm font-bold text-[#0F172A] truncate">42 Live Deals</span>
            </div>
          </div>

          <div className="bg-white p-3 rounded-xl shadow-xs border border-slate-200 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700 shrink-0">
              <span className="material-symbols-outlined text-[20px]">sync</span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[11px] text-slate-500 font-medium">ESL Grid Latency</span>
              <span className="text-sm font-bold text-[#16A34A] truncate">4 mins ago</span>
            </div>
          </div>

          <div className="bg-white p-3 rounded-xl shadow-xs border border-slate-200 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-red-100 flex items-center justify-center text-red-600 shrink-0">
              <span className="material-symbols-outlined text-[20px]">timer</span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[11px] text-slate-500 font-medium">Flash Batch Ends</span>
              <span className="text-sm font-bold text-red-600 truncate font-mono">
                {formatCountdown(secondsRemaining)}
              </span>
            </div>
          </div>

          <div className="bg-white p-3 rounded-xl shadow-xs border border-slate-200 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center text-[#2563EB] shrink-0">
              <span className="material-symbols-outlined text-[20px]">pin_drop</span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[11px] text-slate-500 font-medium">Indoor Tracking</span>
              <span className="text-sm font-bold text-[#0F172A] truncate">±0.4m Precision</span>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Filters, Categories & Sorting */}
      <section className="flex flex-col gap-3 bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {[
            { id: 'All Deals', label: 'All Deals', count: 42 },
            { id: 'Lightning Flash Deals', label: '⚡ Flash Deals', count: 8 },
            { id: 'Buy 1 Get 1 / Combos', label: 'Buy 1 Get 1 / Combos', count: 11 },
            { id: 'Grocery & Staples', label: 'Grocery & Staples', count: 14 },
            { id: 'Personal Care', label: 'Personal Care', count: 9 },
            { id: 'Dairy & Frozen', label: 'Dairy & Frozen', count: 6 },
            { id: 'Beverages & Snacks', label: 'Beverages & Snacks', count: 12 },
            { id: 'Home & Cleaning', label: 'Home & Cleaning', count: 5 }
          ].map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategoryTab(cat.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 ${
                activeCategoryTab === cat.id
                  ? 'bg-[#2563EB] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <span>{cat.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  activeCategoryTab === cat.id ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                }`}
              >
                {cat.count}
              </span>
            </button>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2 border-t border-slate-100">
          <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-700">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="w-4 h-4 rounded text-[#2563EB] accent-[#2563EB]"
              />
              <span>In Stock on Shelf Only</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={within50mOnly}
                onChange={(e) => setWithin50mOnly(e.target.checked)}
                className="w-4 h-4 rounded text-[#2563EB] accent-[#2563EB]"
              />
              <span className="flex items-center gap-1">
                <span>Within 50m of Cart</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A]" />
              </span>
            </label>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto text-xs">
            <span className="text-slate-500 font-medium">Sort by:</span>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="bg-slate-100 border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-bold text-slate-800 focus:outline-none cursor-pointer"
            >
              <option>Biggest Discount %</option>
              <option>Nearest to My Cart (Distance)</option>
              <option>Price: Low to High</option>
            </select>
          </div>
        </div>
      </section>

      {/* Section 3: Featured Deal of the Hour Spotlight (Image 11 & 13) */}
      <section className="w-full bg-gradient-to-r from-blue-50/80 via-white to-blue-50/80 rounded-2xl shadow-sm border border-blue-200 overflow-hidden relative">
        <div className="p-5 sm:p-6 flex flex-col lg:flex-row items-center justify-between gap-6 relative z-10">
          <div className="flex flex-col sm:flex-row items-center gap-5 w-full lg:w-auto">
            <div className="relative w-32 h-32 sm:w-36 sm:h-36 rounded-2xl bg-white border border-slate-200 shrink-0 flex items-center justify-center p-2 shadow-xs">
              <ProductImage
                src={megaDealOffer.image}
                alt={megaDealOffer.title}
                category={megaDealOffer.category}
                className="w-full h-full object-contain"
              />
              <span className="absolute top-2 left-2 bg-red-600 text-white text-[11px] font-bold px-2 py-0.5 rounded-full">
                {megaDealOffer.discountBadge}
              </span>
              <span className="absolute bottom-2 left-2 right-2 bg-slate-900/80 backdrop-blur-sm text-center py-0.5 rounded text-[10px] font-bold text-white">
                Deal of the Hour
              </span>
            </div>

            <div className="flex flex-col gap-1.5 text-center sm:text-left">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-0.5 rounded">
                  Mega Flash Deal
                </span>
                <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px] text-red-600">schedule</span>
                  <span>Ends at 2:00 PM today</span>
                </span>
              </div>

              <h2 className="text-lg sm:text-xl font-extrabold text-[#0F172A] leading-tight">
                {megaDealOffer.title}
              </h2>

              <div className="flex items-baseline justify-center sm:justify-start gap-2">
                <span className="text-2xl sm:text-3xl font-black text-[#0F172A]">
                  ₹{megaDealOffer.offerPrice}
                </span>
                <span className="text-sm text-slate-400 line-through">₹{megaDealOffer.originalPrice}</span>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                  {megaDealOffer.savingsText} (35%)
                </span>
              </div>

              {/* Coordinates Pill */}
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-xs">
                <span className="bg-[#0F172A] text-white px-2.5 py-0.5 rounded font-bold">
                  {megaDealOffer.aisle} • {megaDealOffer.shelf} • {megaDealOffer.bay}
                </span>
                <span className="text-slate-500">{megaDealOffer.distanceMeters}m from current cart</span>
                <span className="text-slate-300">•</span>
                <span className="text-[#16A34A] font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A]" />
                  {megaDealOffer.stockText}
                </span>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex sm:flex-col gap-2 w-full lg:w-48 shrink-0">
            <button
              type="button"
              onClick={handleRouteMegaDeal}
              className="flex-1 sm:w-full bg-[#2563EB] hover:bg-blue-700 text-white py-2.5 px-4 rounded-xl text-xs font-bold shadow-sm flex items-center justify-center gap-1.5 transition-transform active:scale-95"
            >
              <span className="material-symbols-outlined text-[18px]">turn_sharp_right</span>
              <span>Plot Route</span>
            </button>
            <button
              type="button"
              onClick={handleAddMegaDeal}
              className="flex-1 sm:w-full bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">add_shopping_cart</span>
              <span>Add to Cart</span>
            </button>
          </div>
        </div>
      </section>

      {/* Section 4: Main 4-Column Product Offers Grid */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#2563EB] text-[22px]">storefront</span>
            <h2 className="text-lg font-bold text-[#0F172A]">Featured In-Store Flash Promotions</h2>
          </div>
          <span className="text-xs text-slate-500 hidden sm:inline">Tap map icon to view exact aisle shelf coordinates</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredOffers.map((offer) => (
            <OfferCard key={offer.id} offer={offer} />
          ))}
        </div>
      </section>

      {/* Section 5: Multi-Deal In-Store Route Optimizer Widget (Image 11 & 13) */}
      <section className="w-full bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#2563EB] flex items-center justify-center text-white shrink-0 shadow-md">
            <span className="material-symbols-outlined text-[28px]">route</span>
          </div>
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-[#0F172A]">IRIS Deal Route Optimizer</span>
              <span className="bg-blue-100 text-[#2563EB] text-[11px] font-bold px-2 py-0.5 rounded-full">
                Save Walking Time
              </span>
            </div>
            <p className="text-xs text-slate-500 max-w-xl">
              Selected multiple discounted products? IRIS calculates the single shortest non-backtracking route across Aisles 2, 3, 7, and 11 to collect all promotional items in under 4 minutes.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => navigate('/trip')}
          className="w-full md:w-auto bg-[#2563EB] hover:bg-blue-700 text-white py-3 px-6 rounded-xl text-xs font-bold shadow-sm flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-95 shrink-0"
        >
          <span className="material-symbols-outlined text-[18px]">alt_route</span>
          <span>Optimize Route (Est. walk: 120m)</span>
        </button>
      </section>

      {/* Section 6: Price & Promotion Transparency Guarantee & ESL Info */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-[#F8FAFC] rounded-2xl p-5 border border-slate-200 flex gap-4">
          <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[22px]">price_check</span>
          </div>
          <div className="flex flex-col gap-1">
            <h3 className="font-bold text-sm text-[#0F172A]">100% Shelf Price Transparency Guarantee</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              All discounts are automatically applied at self-checkout kiosks and POS scanning stations when scanning the physical barcode or ESL tag. No physical paper coupons or store loyalty card scanning required.
            </p>
          </div>
        </div>

        <div className="bg-[#F8FAFC] rounded-2xl p-5 border border-slate-200 flex gap-4">
          <div className="w-10 h-10 rounded-full bg-blue-100 text-[#2563EB] flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[22px]">contact_support</span>
          </div>
          <div className="flex flex-col gap-1 justify-between">
            <div>
              <h3 className="font-bold text-sm text-[#0F172A]">Notice an ESL Price Discrepancy?</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                If an Electronic Shelf Label does not reflect the app discount, tap to report to floor attendants for immediate price correction at Aisle 4.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setAisleStaffModalOpen(true)}
              className="mt-2 text-[#2563EB] text-xs font-bold self-start hover:underline flex items-center gap-1"
            >
              <span>Alert Aisle Associate</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
