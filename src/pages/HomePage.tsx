import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useRetailStore } from '../store/useRetailStore';
import { StoreStatusStrip } from '../components/common/StoreStatusStrip';
import { OfferCard } from '../components/offers/OfferCard';
import { ProductCard } from '../components/product/ProductCard';
import { mockOffers } from '../data/mockRetailData';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const {
    searchQuery,
    setSearchQuery,
    setSelectedCategory,
    setBarcodeScannerOpen,
    setVoiceSearchOpen,
    openAssistant,
    products,
    startNavigationToProduct,
    setSelectedProduct
  } = useRetailStore();

  const [inputVal, setInputVal] = useState(searchQuery);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputVal.trim()) {
      setSearchQuery(inputVal.trim());
      navigate('/products');
    }
  };

  const handleChipClick = (term: string) => {
    setInputVal(term);
    setSearchQuery(term);
    navigate('/products');
  };

  const handleCategoryClick = (catKey: string) => {
    setSelectedCategory(catKey);
    navigate('/products');
  };

  const handleLaunchColgateDemo = () => {
    const colgate = products.find((p) => p.id === 'prod-colgate-maxfresh') || products[0];
    setSelectedProduct(colgate.id);
    startNavigationToProduct(colgate);
    navigate('/map');
  };

  const topOffers = mockOffers.slice(0, 4);
  const trendingProducts = products.slice(0, 4);

  const categories = [
    { id: 'cat-grocery', name: 'Atta, Rice & Dal', icon: 'grain', bg: 'bg-amber-50 text-amber-700 border-amber-200' },
    { id: 'cat-snacks', name: 'Snacks & Maggi', icon: 'ramen_dining', bg: 'bg-orange-50 text-orange-700 border-orange-200' },
    { id: 'cat-dairy', name: 'Dairy & Butter', icon: 'lunch_dining', bg: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
    { id: 'cat-beverages', name: 'Cold Drinks & Tea', icon: 'local_cafe', bg: 'bg-blue-50 text-blue-700 border-blue-200' },
    { id: 'cat-oral', name: 'Oral & Dental Care', icon: 'dentistry', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    { id: 'cat-home', name: 'Detergents & Cleaners', icon: 'cleaning_services', bg: 'bg-purple-50 text-purple-700 border-purple-200' },
    { id: 'cat-baby', name: 'Baby Care & Diapers', icon: 'child_care', bg: 'bg-pink-50 text-pink-700 border-pink-200' }
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-8 pb-20">
      {/* 1. Store Status Top Strip */}
      <StoreStatusStrip />

      {/* 2. Blinkit/Instamart Style Search Hero Section */}
      <section className="w-full bg-gradient-to-b from-[#F7FFF9] via-white to-[#F4F6FB] border border-[#E8ECF4] rounded-3xl p-6 sm:p-10 flex flex-col items-center text-center relative overflow-hidden shadow-xs">
        {/* Subtle background glow */}
        <div className="absolute -right-20 -top-20 w-72 h-72 bg-emerald-100/40 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-72 h-72 bg-blue-100/30 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col items-center gap-2 mb-3">
          <img
            src="/iris-logo.jpg"
            alt="IRIS — Intelligent Retail Insight System"
            className="h-16 sm:h-20 w-auto object-contain rounded-xl drop-shadow-sm"
          />
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-[#0C831F] text-xs font-extrabold border border-emerald-200 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-[#0C831F] animate-pulse" />
            <span>Indoor GPS Active • Accuracy ±0.5m • 12 Aisles Synced</span>
          </div>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#1C1C1C] max-w-2xl tracking-tight mb-2">
          Find Any Item in Aisle. <span className="text-[#0C831F]">Fast.</span>
        </h1>

        <p className="text-sm sm:text-base text-slate-600 max-w-xl mb-6 font-medium">
          Instant shelf locator, zero-backtracking walking routes, unit price comparisons, and live electronic shelf deals.
        </p>

        {/* Large Blinkit-style Rounded Search Bar */}
        <form
          onSubmit={handleSearchSubmit}
          className="w-full max-w-3xl bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.06)] border border-slate-200 p-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-2"
        >
          <div className="flex items-center flex-1 px-3 py-1.5 gap-2.5">
            <span className="material-symbols-outlined text-[#0C831F] text-[24px]">search</span>
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="Search 'Colgate', 'Maggi', 'Butter', 'Surf Excel', 'Tata Salt'..."
              className="w-full bg-transparent text-sm sm:text-base text-[#1C1C1C] placeholder:text-slate-400 focus:outline-none font-medium"
            />
            <button
              type="button"
              onClick={() => setBarcodeScannerOpen(true)}
              className="p-1.5 rounded-xl text-slate-400 hover:text-[#0C831F] hover:bg-emerald-50 transition-colors"
              title="Barcode & Shelf Tag Scanner"
            >
              <span className="material-symbols-outlined text-[22px]">qr_code_scanner</span>
            </button>
          </div>

          <div className="flex items-center justify-end gap-1.5 pr-1">
            <Link
              to="/map"
              className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1 transition-colors"
              title="Quick Floor Map"
            >
              <span className="material-symbols-outlined text-[17px] text-[#2563EB]">map</span>
              <span className="hidden sm:inline">Store Map</span>
            </Link>

            <button
              type="button"
              onClick={() => setVoiceSearchOpen(true)}
              className="p-2 rounded-xl bg-slate-100 text-slate-700 hover:text-[#0C831F] hover:bg-emerald-50 transition-colors"
              title="Voice Search"
            >
              <span className="material-symbols-outlined text-[20px]">mic</span>
            </button>

            <button
              type="submit"
              className="bg-[#0C831F] hover:bg-[#0A701A] text-white px-5 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold flex items-center gap-1.5 shadow-xs transition-all active:scale-95 shrink-0"
            >
              <span>Search Store</span>
              <span className="material-symbols-outlined text-[17px]">arrow_forward</span>
            </button>
          </div>
        </form>

        {/* Quick Search Trending Chips */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-4 max-w-2xl">
          <span className="text-xs text-slate-500 font-bold mr-1">Trending Aisles:</span>
          {['Colgate MaxFresh', 'Maggi 2-Minute', 'Amul Butter', 'Tata Salt', 'Dove Body Wash', 'Surf Excel'].map((term) => (
            <button
              key={term}
              type="button"
              onClick={() => handleChipClick(term)}
              className="px-3 py-1 rounded-full bg-white text-slate-700 hover:bg-emerald-50 hover:text-[#0C831F] text-xs font-bold border border-slate-200/80 shadow-xs transition-colors"
            >
              {term}
            </button>
          ))}
        </div>
      </section>

      {/* 3. Blinkit / Instamart Signature Category Quick-Rail */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-extrabold text-[#1C1C1C]">Explore Store Aisles</h2>
          <Link to="/products" className="text-xs font-bold text-[#0C831F] hover:underline flex items-center gap-0.5">
            <span>All Categories</span>
            <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => handleCategoryClick(cat.id)}
              className={`p-3 rounded-2xl border ${cat.bg} hover:shadow-md transition-all flex flex-col items-center text-center gap-2 group active:scale-95 cursor-pointer`}
            >
              <div className="w-12 h-12 rounded-2xl bg-white shadow-xs flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-[26px]">{cat.icon}</span>
              </div>
              <span className="text-xs font-extrabold leading-tight text-[#1C1C1C] line-clamp-1">
                {cat.name}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* 4. Four Core In-Store Supertools */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Find a Product */}
        <Link
          to="/products"
          className="group bg-white rounded-2xl p-5 border border-[#E8ECF4] shadow-xs hover:shadow-md hover:border-emerald-300 transition-all flex flex-col justify-between"
        >
          <div className="flex items-start justify-between mb-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#0C831F] group-hover:bg-[#0C831F] group-hover:text-white flex items-center justify-center transition-colors shadow-xs">
              <span className="material-symbols-outlined text-[26px]">travel_explore</span>
            </div>
            <span className="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full font-bold">
              Aisles 1–24
            </span>
          </div>
          <div>
            <h3 className="font-extrabold text-base text-[#1C1C1C] mb-1 group-hover:text-[#0C831F] transition-colors flex items-center justify-between">
              Find a Product
              <span className="material-symbols-outlined text-[18px] opacity-0 group-hover:opacity-100 transition-opacity">arrow_forward</span>
            </h3>
            <p className="text-xs text-slate-500 font-medium">Search shelf, bin & tier with exact pin coordinates.</p>
          </div>
        </Link>

        {/* Card 2: Store Map */}
        <Link
          to="/map"
          className="group bg-white rounded-2xl p-5 border border-[#E8ECF4] shadow-xs hover:shadow-md hover:border-blue-300 transition-all flex flex-col justify-between"
        >
          <div className="flex items-start justify-between mb-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#2563EB] group-hover:bg-[#2563EB] group-hover:text-white flex items-center justify-center transition-colors shadow-xs">
              <span className="material-symbols-outlined text-[26px]">map</span>
            </div>
            <span className="text-[11px] bg-blue-50 text-blue-700 font-bold px-2 py-0.5 rounded-full">
              Interactive 2D
            </span>
          </div>
          <div>
            <h3 className="font-extrabold text-base text-[#1C1C1C] mb-1 group-hover:text-[#2563EB] transition-colors flex items-center justify-between">
              Store Map
              <span className="material-symbols-outlined text-[18px] opacity-0 group-hover:opacity-100 transition-opacity">arrow_forward</span>
            </h3>
            <p className="text-xs text-slate-500 font-medium">Turn-by-turn vector route visualizer with live walk preview.</p>
          </div>
        </Link>

        {/* Card 3: Today's Offers */}
        <Link
          to="/offers"
          className="group bg-white rounded-2xl p-5 border border-[#E8ECF4] shadow-xs hover:shadow-md hover:border-red-300 transition-all flex flex-col justify-between"
        >
          <div className="flex items-start justify-between mb-3">
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 group-hover:bg-red-600 group-hover:text-white flex items-center justify-center transition-colors shadow-xs">
              <span className="material-symbols-outlined text-[26px]">local_offer</span>
            </div>
            <span className="text-[11px] bg-red-50 text-red-600 font-bold px-2 py-0.5 rounded-full">
              Up to 35% OFF
            </span>
          </div>
          <div>
            <h3 className="font-extrabold text-base text-[#1C1C1C] mb-1 group-hover:text-red-600 transition-colors flex items-center justify-between">
              Today's Offers
              <span className="material-symbols-outlined text-[18px] opacity-0 group-hover:opacity-100 transition-opacity">arrow_forward</span>
            </h3>
            <p className="text-xs text-slate-500 font-medium">Shelf ESL discounts synced directly from in-store tags.</p>
          </div>
        </Link>

        {/* Card 4: Price Compare */}
        <Link
          to="/prices"
          className="group bg-white rounded-2xl p-5 border border-[#E8ECF4] shadow-xs hover:shadow-md hover:border-indigo-300 transition-all flex flex-col justify-between"
        >
          <div className="flex items-start justify-between mb-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white flex items-center justify-center transition-colors shadow-xs">
              <span className="material-symbols-outlined text-[26px]">balance</span>
            </div>
            <span className="text-[11px] bg-indigo-50 text-indigo-700 font-bold px-2 py-0.5 rounded-full">
              Per 100g Rate
            </span>
          </div>
          <div>
            <h3 className="font-extrabold text-base text-[#1C1C1C] mb-1 group-hover:text-indigo-600 transition-colors flex items-center justify-between">
              Compare Prices
              <span className="material-symbols-outlined text-[18px] opacity-0 group-hover:opacity-100 transition-opacity">arrow_forward</span>
            </h3>
            <p className="text-xs text-slate-500 font-medium">Normalized unit costs to pick the absolute highest value size.</p>
          </div>
        </Link>
      </section>

      {/* 5. Trending Bestsellers in Store (Blinkit Card Layout) */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#1C1C1C]">Trending In-Store Essentials</h2>
              <span className="bg-emerald-100 text-[#0C831F] text-xs px-2.5 py-0.5 rounded-full font-extrabold">
                Fast Pick
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">Top picked items located within 50 meters of your shopping cart</p>
          </div>

          <Link
            to="/products"
            className="inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-[#0C831F] hover:underline"
          >
            <span>See all items</span>
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {trendingProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 6. Today's Flash Electronic Shelf Deals */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#1C1C1C]">Today's Flash Shelf Deals</h2>
              <span className="bg-red-100 text-red-600 text-xs px-2.5 py-0.5 rounded-full font-extrabold">
                ESL Verified
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">Verified electronic shelf label promotions across all bays</p>
          </div>

          <Link
            to="/offers"
            className="inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-[#0C831F] hover:underline"
          >
            <span>View all 42 deals</span>
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {topOffers.map((offer) => (
            <OfferCard key={offer.id} offer={offer} />
          ))}
        </div>
      </section>

      {/* 7. Turn-by-Turn Wayfinding Preview Teaser */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8ECF4] shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-blue-50 text-[#2563EB] text-xs font-extrabold mb-1 border border-blue-100">
              <span className="material-symbols-outlined text-[15px]">route</span>
              Zero-Backtracking Path Guidance
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#1C1C1C]">Know Exactly Where to Walk</h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">Step-by-step turn guidance directly from your cart (#BC-882) to any shelf.</p>
          </div>

          <div className="flex items-center gap-3 bg-[#F8FAFC] px-4 py-2.5 rounded-2xl border border-slate-200 shrink-0">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-[#0C831F] flex items-center justify-center font-bold">
              <span className="material-symbols-outlined text-[22px]">directions_walk</span>
            </div>
            <div>
              <span className="text-[11px] text-slate-400 block font-bold uppercase tracking-wider">Estimated Walk</span>
              <span className="text-sm font-extrabold text-[#1C1C1C]">45 seconds (38 meters)</span>
            </div>
          </div>
        </div>

        {/* Visual Wayfinding Steps */}
        <div className="w-full bg-[#F8FAFC] rounded-2xl p-4 sm:p-5 border border-slate-200">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 sm:gap-4">
            <div className="flex items-start gap-3 bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
              <div className="w-8 h-8 rounded-full bg-[#1C1C1C] text-white flex items-center justify-center text-xs font-extrabold shrink-0">
                1
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Current Station</span>
                <span className="text-xs font-bold text-[#1C1C1C] truncate">Aisle 4, Bay 2</span>
                <span className="text-[11px] text-slate-500 font-medium">Cart #BC-882 synced</span>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
              <div className="w-8 h-8 rounded-full bg-blue-100 text-[#2563EB] flex items-center justify-center text-xs font-extrabold shrink-0">
                2
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Walk 18m straight</span>
                <span className="text-xs font-bold text-[#1C1C1C] truncate">Main Corridor</span>
                <span className="text-[11px] text-slate-500 font-medium">Pass Bakery section</span>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
              <div className="w-8 h-8 rounded-full bg-blue-100 text-[#2563EB] flex items-center justify-center text-xs font-extrabold shrink-0">
                3
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Turn Left into</span>
                <div className="flex items-center gap-1.5">
                  <span className="bg-[#1C1C1C] text-white text-[10px] px-1.5 py-0.2 rounded font-bold">A7</span>
                  <span className="text-xs font-bold text-[#1C1C1C] truncate">Oral Hygiene</span>
                </div>
                <span className="text-[11px] text-slate-500 font-medium">Bay 03 (Middle Rack)</span>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
              <div className="w-8 h-8 rounded-full bg-emerald-100 text-[#0C831F] flex items-center justify-center shrink-0 font-bold">
                <span className="material-symbols-outlined text-[18px]">check</span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[10px] text-[#0C831F] font-bold uppercase">Destination</span>
                <span className="text-xs font-bold text-[#1C1C1C] truncate">Shelf B • Eye Level</span>
                <span className="text-[11px] text-slate-500 font-medium">Colgate MaxFresh (Bin 12)</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[#0C831F] text-[24px]">explore</span>
              <div className="text-left">
                <span className="text-xs font-bold text-[#1C1C1C]">Indoor Beacon Wayfinding Calibrated</span>
                <p className="text-[11px] text-slate-500 font-medium">Visual route turns with haptic flash alerts at shelf targets.</p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleLaunchColgateDemo}
              className="w-full md:w-auto bg-[#0C831F] hover:bg-[#0A701A] text-white px-5 py-2.5 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-2 shadow-xs active:scale-95"
            >
              <span className="material-symbols-outlined text-[18px]">near_me</span>
              <span>Launch Live Floor Map</span>
            </button>
          </div>
        </div>
      </section>

      {/* 8. Ask IRIS AI Assistant Strip */}
      <section className="bg-gradient-to-r from-emerald-50/60 via-white to-blue-50/60 border border-emerald-200/80 rounded-3xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-[#0C831F] text-white flex items-center justify-center shrink-0 shadow-xs">
            <span className="material-symbols-outlined text-[24px]">smart_toy</span>
          </div>
          <div>
            <span className="font-extrabold text-sm sm:text-base text-[#1C1C1C] block">Looking for an item or price?</span>
            <span className="text-xs text-slate-600 font-medium">
              Ask IRIS our retail AI for instant shelf lookups, dietary checks, or stock availability.
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {['Where is Colgate?', 'Show butter on offer', 'Cheapest Basmati rice'].map((prompt) => (
            <button
              key={prompt}
              type="button"
              onClick={() => {
                openAssistant();
                useRetailStore.getState().sendAssistantMessage(prompt);
              }}
              className="bg-white text-slate-700 hover:text-[#0C831F] hover:border-emerald-300 px-3.5 py-1.5 rounded-xl text-xs font-bold border border-slate-200 shadow-xs transition-colors"
            >
              “{prompt}”
            </button>
          ))}
        </div>
      </section>
    </div>
  );
};
