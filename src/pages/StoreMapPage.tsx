import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useRetailStore } from '../store/useRetailStore';
import { StoreFloorMap } from '../components/map/StoreFloorMap';
import { Product } from '../types/retail';
import { ProductImage } from '../components/common/ProductImage';

export const StoreMapPage: React.FC = () => {
  const {
    products,
    activeNavigationProduct,
    startNavigationToProduct,
    setSelectedProduct,
    activeFloor,
    setActiveFloor,
    setBarcodeScannerOpen,
    triggerFlashEslTag,
    flashingEslTag
  } = useRetailStore();

  const [mapSearch, setMapSearch] = useState('');
  const [selectedCategoryTab, setSelectedCategoryTab] = useState('All Aisles');
  const [qrModalOpen, setQrModalOpen] = useState(false);

  const currentProduct = activeNavigationProduct || products[0];
  const isFlashing = flashingEslTag === currentProduct.location.eslTagId;

  // Filter dropdown suggestions when typing in map search
  const searchSuggestions = mapSearch.trim()
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(mapSearch.toLowerCase()) ||
          p.brand.toLowerCase().includes(mapSearch.toLowerCase()) ||
          p.location.aisle.toLowerCase().includes(mapSearch.toLowerCase())
      )
    : [];

  const handlePickProduct = (product: Product) => {
    setSelectedProduct(product.id);
    startNavigationToProduct(product);
    setMapSearch('');
  };

  const handleFlashLed = () => {
    triggerFlashEslTag(currentProduct.location.eslTagId);
  };

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Top Map Utility Bar */}
      <div className="w-full bg-white border-b border-[#E2E8F0] shadow-xs z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col gap-3">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            {/* Search Input Bar with autocomplete */}
            <div className="relative flex-1 max-w-2xl">
              <div className="flex items-center bg-[#F8FAFC] border border-slate-200 rounded-xl px-3.5 py-2 shadow-xs focus-within:border-blue-500 transition-colors">
                <span className="material-symbols-outlined text-[#2563EB] text-[22px] mr-2">search</span>
                <input
                  type="text"
                  value={mapSearch}
                  onChange={(e) => setMapSearch(e.target.value)}
                  placeholder="Search products or aisles to plot route..."
                  className="w-full bg-transparent text-sm text-[#0F172A] focus:outline-none placeholder:text-slate-400"
                />
                {mapSearch && (
                  <button
                    type="button"
                    onClick={() => setMapSearch('')}
                    className="text-slate-400 hover:text-slate-600 p-1"
                  >
                    <span className="material-symbols-outlined text-[18px]">close</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setBarcodeScannerOpen(true)}
                  className="flex items-center text-slate-400 hover:text-[#2563EB] p-1 transition-colors"
                  title="Barcode Scan"
                >
                  <span className="material-symbols-outlined text-[20px]">qr_code_scanner</span>
                </button>
              </div>

              {/* Autocomplete Dropdown */}
              {searchSuggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-xl z-50 max-h-64 overflow-y-auto">
                  {searchSuggestions.map((prod) => (
                    <button
                      key={prod.id}
                      type="button"
                      onClick={() => handlePickProduct(prod)}
                      className="w-full p-2.5 hover:bg-blue-50 text-left flex items-center justify-between border-b border-slate-100 last:border-0"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <ProductImage src={prod.image} alt={prod.name} className="w-8 h-8 object-contain rounded bg-slate-50 p-0.5" />
                        <div className="min-w-0">
                          <span className="text-xs font-bold text-[#0F172A] block truncate">{prod.name}</span>
                          <span className="text-[10px] text-slate-500">{prod.brand} • ₹{prod.variants[0].price}</span>
                        </div>
                      </div>
                      <span className="text-[11px] font-bold text-[#2563EB] bg-blue-50 px-2 py-0.5 rounded shrink-0">
                        {prod.location.aisle} • {prod.location.distanceMeters}m
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Floor Switcher & Beacon Signal */}
            <div className="flex items-center flex-wrap gap-2.5 justify-between lg:justify-end">
              <div className="inline-flex p-1 bg-slate-100 rounded-xl border border-slate-200">
                <button
                  type="button"
                  onClick={() => setActiveFloor(1)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                    activeFloor === 1 ? 'bg-white text-[#2563EB] shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">layers</span>
                  <span>Ground Floor</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveFloor(2)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                    activeFloor === 2 ? 'bg-white text-[#2563EB] shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span>L1: Fashion & Home</span>
                </button>
              </div>

              <div className="flex items-center gap-2 bg-[#F8FAFC] border border-slate-200 px-3 py-1.5 rounded-full text-xs text-slate-600">
                <span className="w-2.5 h-2.5 rounded-full bg-[#16A34A] animate-pulse" />
                <span>
                  Near Entrance Lobby <strong className="text-[#0F172A] font-bold">(Zone A-1)</strong>
                </span>
              </div>
            </div>
          </div>

          {/* Quick Department / Aisle Filters */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs font-semibold">
            {[
              'All Aisles',
              'Personal Care',
              'Groceries & Spices',
              'Beverages',
              'Dairy & Frozen',
              'Bakery & Deli',
              'Express Checkouts'
            ].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategoryTab(cat)}
                className={`px-3 py-1 rounded-full whitespace-nowrap transition-colors ${
                  selectedCategoryTab === cat
                    ? 'bg-[#2563EB] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Blueprint Canvas & Guidance Panel */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pb-12">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
          {/* Interactive Map Blueprint (8 / 9 Cols) */}
          <div className="xl:col-span-8 2xl:col-span-9 bg-white rounded-2xl shadow-sm border border-[#E2E8F0] p-4 relative flex flex-col overflow-hidden">
            <StoreFloorMap
              highlightedProduct={currentProduct}
              className="aspect-[4/3] lg:aspect-[16/10] w-full"
            />
          </div>

          {/* Right Turn Guidance & Shelf Inspector Panel (3 / 4 Cols) */}
          <div className="xl:col-span-4 2xl:col-span-3 bg-white rounded-2xl shadow-sm border border-[#E2E8F0] p-5 flex flex-col gap-4 sticky top-20">
            {/* Destination Lock Status */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-[#16A34A] px-2.5 py-1 rounded-full text-xs font-bold border border-emerald-200">
                <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse" />
                Destination Locked
              </span>
              <span className="text-xs text-slate-500 font-medium">Indoor GPS ±0.4m</span>
            </div>

            {/* Product Card Snippet */}
            <div className="flex items-start gap-3 bg-[#F8FAFC] p-3.5 rounded-xl border border-slate-200">
              <ProductImage
                src={currentProduct.image}
                alt={currentProduct.name}
                category={currentProduct.category}
                className="w-16 h-16 rounded-lg object-contain bg-white p-1 shrink-0 border border-slate-200"
              />
              <div className="flex-1 min-w-0">
                <span className="text-[11px] text-[#2563EB] font-bold uppercase tracking-wider">
                  {currentProduct.location.aisle} • {currentProduct.location.bay}
                </span>
                <h2 className="text-sm font-bold text-[#0F172A] leading-snug truncate">
                  {currentProduct.name}
                </h2>
                <p className="text-xs text-slate-500">{currentProduct.variants[0].size}</p>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-base font-extrabold text-[#0F172A]">
                    ₹{currentProduct.variants[0].price}
                  </span>
                  {currentProduct.variants[0].originalPrice > currentProduct.variants[0].price && (
                    <span className="text-xs text-slate-400 line-through">
                      ₹{currentProduct.variants[0].originalPrice}
                    </span>
                  )}
                  {currentProduct.variants[0].discountPercent && (
                    <span className="text-xs text-red-600 font-bold">
                      {currentProduct.variants[0].discountPercent}% OFF
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Metrics Matrix */}
            <div className="grid grid-cols-2 gap-2 text-center">
              <div className="bg-[#F8FAFC] border border-slate-200 p-2.5 rounded-xl">
                <span className="block text-[11px] text-slate-500 font-medium">Walking Distance</span>
                <span className="text-xl font-extrabold text-[#2563EB]">{currentProduct.location.distanceMeters} m</span>
              </div>
              <div className="bg-[#F8FAFC] border border-slate-200 p-2.5 rounded-xl">
                <span className="block text-[11px] text-slate-500 font-medium">Est. Walking Time</span>
                <span className="text-xl font-extrabold text-[#16A34A]">{currentProduct.location.walkingTimeText}</span>
              </div>
            </div>

            {/* Coordinates Placement */}
            <div className="bg-[#F8FAFC] border border-slate-200 rounded-xl p-3 flex flex-col gap-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">shelves</span> Aisle Location:
                </span>
                <span className="font-bold text-[#0F172A]">
                  {currentProduct.location.aisle} ({currentProduct.category})
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">inventory_2</span> Exact Placement:
                </span>
                <span className="font-bold text-[#2563EB]">
                  {currentProduct.location.shelf} ({currentProduct.location.tier}, {currentProduct.location.bin})
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">verified</span> Stock Status:
                </span>
                <span className="font-bold text-[#16A34A]">
                  {currentProduct.variants[0].stock} Units on Shelf
                </span>
              </div>
            </div>

            {/* Turn-by-Turn Wayfinding Steps (Image 5) */}
            <div className="flex flex-col gap-2 pt-1">
              <h3 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">Step-by-Step Wayfinding</h3>
              <div className="relative pl-6 flex flex-col gap-3 before:content-[''] before:absolute before:left-2.5 before:top-2 before:bottom-3 before:w-0.5 before:bg-slate-200 text-xs">
                <div className="relative flex items-start gap-2">
                  <div className="absolute -left-6 top-0.5 w-5 h-5 rounded-full bg-[#2563EB] text-white flex items-center justify-center text-[10px] font-bold">
                    1
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-[#0F172A]">Start at Main Entrance</p>
                    <p className="text-[11px] text-slate-500">Walk straight North past the cart bay (20 m)</p>
                  </div>
                </div>

                <div className="relative flex items-start gap-2">
                  <div className="absolute -left-6 top-0.5 w-5 h-5 rounded-full bg-blue-100 text-[#2563EB] flex items-center justify-center text-[10px] font-bold">
                    2
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-[#0F172A]">Cross Promotion Promenade</p>
                    <p className="text-[11px] text-slate-500">Head towards corridor between Aisles 6 & 7</p>
                  </div>
                </div>

                <div className="relative flex items-start gap-2">
                  <div className="absolute -left-6 top-0.5 w-5 h-5 rounded-full bg-blue-100 text-[#2563EB] flex items-center justify-center text-[10px] font-bold">
                    3
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-[#0F172A]">Turn Right into {currentProduct.location.aisle}</p>
                    <p className="text-[11px] text-slate-500">Pass endcap into Oral Hygiene section</p>
                  </div>
                </div>

                <div className="relative flex items-start gap-2">
                  <div className="absolute -left-6 top-0.5 w-5 h-5 rounded-full bg-[#16A34A] text-white flex items-center justify-center text-[10px] font-bold">
                    ✓
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-[#16A34A]">Arrival: {currentProduct.location.shelf} ({currentProduct.location.tier})</p>
                    <p className="text-[11px] text-slate-500">{currentProduct.name}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action CTAs */}
            <div className="flex flex-col gap-2 pt-2">
              <button
                type="button"
                onClick={handleFlashLed}
                className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 border transition-all ${
                  isFlashing
                    ? 'bg-cyan-400 text-slate-900 border-cyan-500 animate-pulse'
                    : 'bg-blue-50 text-[#2563EB] border-blue-200 hover:bg-blue-100'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">wb_twilight</span>
                <span>{isFlashing ? 'Shelf Tag LED Blinking Cyan (30s)...' : 'Flash Shelf ESL Tag Light'}</span>
              </button>

              <button
                type="button"
                onClick={() => setQrModalOpen(true)}
                className="w-full bg-[#F8FAFC] hover:bg-slate-100 text-slate-700 py-2.5 rounded-xl text-xs font-bold border border-slate-200 flex items-center justify-center gap-1.5 transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">phonelink_ring</span>
                <span>Send Route to Mobile via QR</span>
              </button>
            </div>

            {/* Also on Shelf B */}
            <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
              <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">
                Also on {currentProduct.location.shelf}
              </span>
              <div className="flex items-center justify-between text-xs hover:bg-slate-50 p-2 rounded-lg transition-colors cursor-pointer border border-transparent hover:border-slate-200">
                <div>
                  <p className="font-bold text-[#0F172A]">Colgate Total Advanced (120 g)</p>
                  <p className="text-slate-500">₹130 • 4 units left</p>
                </div>
                <span className="material-symbols-outlined text-slate-400 text-[18px]">chevron_right</span>
              </div>
              <div className="flex items-center justify-between text-xs hover:bg-slate-50 p-2 rounded-lg transition-colors cursor-pointer border border-transparent hover:border-slate-200">
                <div>
                  <p className="font-bold text-[#0F172A]">Sensodyne Deep Clean (100 g)</p>
                  <p className="text-slate-500">₹195 • In Stock</p>
                </div>
                <span className="material-symbols-outlined text-slate-400 text-[18px]">chevron_right</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* QR Code Companion Modal */}
      {qrModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-xs w-full text-center border border-slate-200 flex flex-col items-center">
            <h3 className="font-bold text-base text-[#0F172A]">Scan on Your Phone</h3>
            <p className="text-xs text-slate-500 mt-1 mb-4">
              Open your camera app to transfer turn-by-turn guidance to your phone.
            </p>
            {/* SVG QR Code Simulation */}
            <div className="w-48 h-48 bg-slate-900 rounded-xl p-3 flex items-center justify-center shadow-inner">
              <div className="w-full h-full bg-white rounded-lg p-2 flex flex-col justify-between">
                <div className="flex justify-between">
                  <div className="w-10 h-10 border-4 border-black" />
                  <div className="w-10 h-10 border-4 border-black" />
                </div>
                <div className="flex items-center justify-center font-mono text-[10px] font-bold text-blue-600">
                  IRIS ROUTE #A7
                </div>
                <div className="flex justify-between">
                  <div className="w-10 h-10 border-4 border-black" />
                  <div className="w-6 h-6 bg-black" />
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setQrModalOpen(false)}
              className="mt-5 w-full py-2 bg-[#2563EB] text-white text-xs font-bold rounded-xl"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
