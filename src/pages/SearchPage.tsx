import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRetailStore, SortOption } from '../store/useRetailStore';
import { ProductCard } from '../components/product/ProductCard';

export const SearchPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    products,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    selectedAisleCode,
    setSelectedAisleCode,
    selectedBrand,
    setSelectedBrand,
    inStockOnly,
    setInStockOnly,
    hasOfferOnly,
    setHasOfferOnly,
    within50mOnly,
    setWithin50mOnly,
    priceRange,
    setPriceRange,
    packSizeFilter,
    setPackSizeFilter,
    sortOption,
    setSortOption,
    resetFilters,
    openMiniMapDrawer,
    setBarcodeScannerOpen,
    setAisleStaffModalOpen
  } = useRetailStore();

  // Filter & Search Products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Query search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(q);
        const matchesBrand = p.brand.toLowerCase().includes(q);
        const matchesCat = p.category.toLowerCase().includes(q);
        const matchesAisle = p.location.aisle.toLowerCase().includes(q);
        if (!matchesName && !matchesBrand && !matchesCat && !matchesAisle) {
          return false;
        }
      }

      // Category
      if (selectedCategory !== 'cat-all') {
        const catMap: Record<string, string> = {
          'cat-oral': 'Oral Care',
          'cat-grocery': 'Staples & Spices',
          'cat-beverages': 'Beverages',
          'cat-dairy': 'Dairy',
          'cat-snacks': 'Snacks',
          'cat-home': 'Home Care',
          'cat-produce': 'Fruits & Vegetables',
          'cat-bakery': 'Bakery',
          'cat-baby': 'Baby Care'
        };
        const mapped = catMap[selectedCategory];
        if (mapped && p.category !== mapped && p.department !== mapped) {
          return false;
        }
      }

      // Aisle filter
      if (selectedAisleCode !== 'all') {
        if (!p.location.aisle.toLowerCase().includes(selectedAisleCode.toLowerCase())) {
          return false;
        }
      }

      // Brand
      if (selectedBrand !== 'all') {
        if (p.brand.toLowerCase() !== selectedBrand.toLowerCase()) {
          return false;
        }
      }

      // Stock
      if (inStockOnly && (p.outOfStock || !p.variants[0].inStock)) {
        return false;
      }

      // Offers
      if (hasOfferOnly && !p.hasOffer) {
        return false;
      }

      // Within 50m
      if (within50mOnly && p.location.distanceMeters > 50) {
        return false;
      }

      // Price
      const minPrice = p.variants[0].price;
      if (minPrice < priceRange[0] || minPrice > priceRange[1]) {
        return false;
      }

      // Pack Size
      if (packSizeFilter !== 'all') {
        const hasVariant = p.variants.some((v) =>
          v.size.toLowerCase().includes(packSizeFilter.toLowerCase())
        );
        if (!hasVariant) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortOption === 'distance') {
        return a.location.distanceMeters - b.location.distanceMeters;
      }
      if (sortOption === 'priceAsc') {
        return a.variants[0].price - b.variants[0].price;
      }
      if (sortOption === 'discount') {
        const discA = a.variants[0].discountPercent || 0;
        const discB = b.variants[0].discountPercent || 0;
        return discB - discA;
      }
      return 0; // relevance
    });
  }, [
    products,
    searchQuery,
    selectedCategory,
    selectedAisleCode,
    selectedBrand,
    inStockOnly,
    hasOfferOnly,
    within50mOnly,
    priceRange,
    packSizeFilter,
    sortOption
  ]);

  const nearestDistance = filteredProducts.length > 0
    ? Math.min(...filteredProducts.map((p) => p.location.distanceMeters))
    : 45;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-6">
      {/* Search Header Banner */}
      <section className="bg-white rounded-2xl shadow-sm border border-[#E2E8F0] p-4 sm:p-6 flex flex-col gap-4 relative overflow-hidden">
        {/* Live Sync Status */}
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 text-slate-800 font-semibold">
              <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse" />
              Koramangala Flagship Supermart
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold">
              <span className="material-symbols-outlined text-[14px]">verified</span>
              Live Shelf Sensor & Stock Sync Active
            </span>
          </div>

          <div className="flex items-center gap-1 font-medium">
            <span className="material-symbols-outlined text-[15px] text-emerald-600">update</span>
            <span>All prices & aisle stocks verified <strong>12 mins ago</strong></span>
          </div>
        </div>

        {/* Main Query Bar */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          <div className="flex-1 relative">
            <div className="w-full flex items-center bg-[#F8FAFC] border border-slate-200 rounded-xl px-4 py-2.5 shadow-xs focus-within:border-blue-500 transition-colors">
              <span className="material-symbols-outlined text-[#2563EB] text-[22px] mr-3">search</span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products, brands, or aisles (e.g. Colgate, Maggi, Rice)..."
                className="w-full bg-transparent text-sm sm:text-base text-[#0F172A] placeholder:text-slate-400 focus:outline-none"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 hover:text-slate-900 mr-2"
                  title="Clear query"
                >
                  <span className="material-symbols-outlined text-[16px]">close</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => setBarcodeScannerOpen(true)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white text-[#2563EB] border border-slate-200 shadow-xs hover:bg-blue-50 text-xs font-bold"
                title="Scan Bay Tag"
              >
                <span className="material-symbols-outlined text-[18px]">barcode_scanner</span>
                <span className="hidden sm:inline">Scan Bay Tag</span>
              </button>
            </div>
          </div>

          {/* Found Stats Cards */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="bg-slate-50 border border-slate-200 px-4 py-2 rounded-xl flex items-center gap-3">
              <span className="material-symbols-outlined text-[#2563EB] text-[22px]">inventory_2</span>
              <div className="flex flex-col">
                <span className="text-xl font-bold text-[#0F172A] leading-none">{filteredProducts.length}</span>
                <span className="text-[11px] text-slate-500 font-medium">Products Found</span>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 px-4 py-2 rounded-xl flex items-center gap-3">
              <span className="material-symbols-outlined text-[#2563EB] text-[22px]">near_me</span>
              <div className="flex flex-col">
                <span className="text-xl font-bold text-[#2563EB] leading-none">{nearestDistance}m</span>
                <span className="text-[11px] text-blue-700 font-medium">Nearest in Aisle 7</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sort Chips */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-semibold text-slate-500 mr-1">Sort:</span>
            {[
              { id: 'relevance' as SortOption, label: 'Relevance', icon: 'auto_awesome' },
              { id: 'distance' as SortOption, label: 'Distance (Closest First)', icon: 'navigation' },
              { id: 'priceAsc' as SortOption, label: 'Price: Low to High', icon: 'arrow_upward' },
              { id: 'discount' as SortOption, label: 'Biggest Discounts', icon: 'percent' }
            ].map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setSortOption(s.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all ${
                  sortOption === s.id
                    ? 'bg-[#0C831F] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <span className="material-symbols-outlined text-[15px]">{s.icon}</span>
                <span>{s.label}</span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold">
            <span className="material-symbols-outlined text-[#0C831F] text-[16px]">cell_tower</span>
            <span>Cart Sensor #BC-882 Syncing</span>
          </div>
        </div>
      </section>

      {/* 2-Column Store Layout: Filters Sidebar (25%) + Product Discovery Grid (75%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT: Retail Filters Panel (3 Columns) */}
        <aside className="lg:col-span-4 xl:col-span-3 flex flex-col gap-4">
          <div className="bg-white rounded-2xl shadow-sm border border-[#E2E8F0] p-4 flex flex-col gap-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-sm font-bold text-[#0F172A] flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[#2563EB] text-[18px]">tune</span>
                In-Store Filters
              </span>
              <button
                type="button"
                onClick={resetFilters}
                className="text-xs font-semibold text-[#2563EB] hover:underline"
              >
                Reset All
              </button>
            </div>

            {/* Quick High-Impact Toggles */}
            <div className="flex flex-col gap-2">
              <label className="flex items-center justify-between p-2.5 rounded-xl bg-[#F8FAFC] border border-slate-200 hover:bg-slate-100 cursor-pointer transition-colors">
                <span className="flex items-center gap-2 text-xs font-semibold text-slate-800">
                  <span className="material-symbols-outlined text-[#16A34A] text-[18px]">inventory</span>
                  In Stock Only
                </span>
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="w-4 h-4 rounded text-[#2563EB] accent-[#2563EB] cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-2.5 rounded-xl bg-[#F8FAFC] border border-slate-200 hover:bg-slate-100 cursor-pointer transition-colors">
                <span className="flex items-center gap-2 text-xs font-semibold text-slate-800">
                  <span className="material-symbols-outlined text-red-600 text-[18px]">local_offer</span>
                  Has Offer / Discount
                </span>
                <input
                  type="checkbox"
                  checked={hasOfferOnly}
                  onChange={(e) => setHasOfferOnly(e.target.checked)}
                  className="w-4 h-4 rounded text-[#2563EB] accent-[#2563EB] cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-2.5 rounded-xl bg-[#F8FAFC] border border-slate-200 hover:bg-slate-100 cursor-pointer transition-colors">
                <span className="flex items-center gap-2 text-xs font-semibold text-slate-800">
                  <span className="material-symbols-outlined text-[#2563EB] text-[18px]">pin_drop</span>
                  Within 50m of Me
                </span>
                <input
                  type="checkbox"
                  checked={within50mOnly}
                  onChange={(e) => setWithin50mOnly(e.target.checked)}
                  className="w-4 h-4 rounded text-[#2563EB] accent-[#2563EB] cursor-pointer"
                />
              </label>
            </div>

            {/* Physical Aisles Filter */}
            <div className="pt-2 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#0F172A]">Physical Aisles</span>
                <span className="text-[11px] text-slate-400">Floor 1</span>
              </div>
              <div className="flex flex-col gap-1">
                {[
                  { code: 'all', label: 'All Aisles', count: products.length },
                  { code: 'A7', label: 'Aisle 7 • Oral Hygiene', count: 6 },
                  { code: 'A3', label: 'Aisle 3 • Instant Foods', count: 4 },
                  { code: 'A2', label: 'Aisle 2 • Staples & Oil', count: 3 },
                  { code: 'A4', label: 'Aisle 4 • Snacks & Dairy', count: 4 },
                  { code: 'A11', label: 'Aisle 11 • Detergents', count: 3 }
                ].map((aisle) => (
                  <button
                    key={aisle.code}
                    type="button"
                    onClick={() => setSelectedAisleCode(aisle.code)}
                    className={`w-full flex items-center justify-between p-2 rounded-xl text-xs font-semibold transition-colors ${
                      selectedAisleCode === aisle.code
                        ? 'bg-blue-100 text-[#2563EB] border border-blue-300'
                        : 'bg-[#F8FAFC] text-slate-700 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    <span>{aisle.label}</span>
                    <span className="bg-white px-1.5 py-0.5 rounded text-[11px] text-slate-500 font-bold border border-slate-200">
                      {aisle.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Brands Filter */}
            <div className="pt-2 flex flex-col gap-2">
              <span className="text-xs font-bold text-[#0F172A]">Brands</span>
              <div className="flex flex-wrap gap-1.5">
                {['all', 'Colgate', 'Maggi', 'Tata', 'Amul', 'Dove', 'Surf Excel', 'Sensodyne'].map((b) => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => setSelectedBrand(b)}
                    className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${
                      selectedBrand === b
                        ? 'bg-[#2563EB] text-white border-[#2563EB]'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {b === 'all' ? 'All Brands' : b}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div className="pt-2 flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#0F172A]">Price Range</span>
                <span className="text-[#2563EB] font-bold">Up to ₹{priceRange[1]}</span>
              </div>
              <input
                type="range"
                min="0"
                max="1000"
                step="25"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([0, Number(e.target.value)])}
                className="w-full accent-[#2563EB] cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-400">
                <span>₹0</span>
                <span>₹500</span>
                <span>₹1000+</span>
              </div>
            </div>

            {/* Pack Size Pills */}
            <div className="pt-2 flex flex-col gap-2">
              <span className="text-xs font-bold text-[#0F172A]">Pack Size</span>
              <div className="flex flex-wrap gap-1.5">
                {['all', '50g', '100g', '150g', '200g', '1 kg', '1 Litre'].map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setPackSizeFilter(size)}
                    className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${
                      packSizeFilter === size
                        ? 'bg-[#2563EB] text-white border-[#2563EB]'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {size === 'all' ? 'Any Size' : size}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Current Shopping Mission Card */}
          <div className="bg-[#EFF6FF] rounded-2xl p-4 border border-blue-200 flex flex-col gap-2 shadow-xs">
            <div className="flex items-center gap-2 text-[#2563EB] font-bold text-sm">
              <span className="material-symbols-outlined text-[20px]">shopping_cart</span>
              <span>Current Shopping Mission</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Your cart is stationed at <strong>Aisle 4 (Snacks & Beverages)</strong>. Target items in Aisle 7 are right behind fixture bay 4.
            </p>
            <div className="flex items-center justify-between pt-2 border-t border-blue-200 text-xs">
              <span className="text-[#16A34A] font-semibold flex items-center gap-1 text-[11px]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A]" />
                Optical Tracking: Online
              </span>
              <button
                type="button"
                onClick={() => navigate('/trip')}
                className="text-[#2563EB] font-bold hover:underline"
              >
                Route All Stops
              </button>
            </div>
          </div>
        </aside>

        {/* RIGHT: Results Grid & Aisle Cards (9 Columns) */}
        <section className="lg:col-span-8 xl:col-span-9 flex flex-col gap-4">
          {/* Physical Store Navigation Context Banner */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#2563EB] text-white flex items-center justify-center shrink-0 shadow-sm">
                <span className="material-symbols-outlined text-[22px]">route</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-[#0F172A]">Aisle 7: Dental & Oral Hygiene</span>
                  <span className="px-2 py-0.5 rounded-full bg-slate-100 text-[11px] text-slate-600 font-semibold">
                    Bay 1 to 14
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  Walking distance: ~45 meters (straight ahead, turn right at Endcap 6)
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() =>
                openMiniMapDrawer(
                  'Aisle 7 - Oral Care Hub',
                  'Floor 1, West Wing (Aisle 7)',
                  'Walking time: 45 sec (45 meters)'
                )
              }
              className="whitespace-nowrap px-4 py-2 rounded-xl bg-[#F8FAFC] hover:bg-slate-100 text-[#2563EB] text-xs font-bold border border-slate-200 shadow-xs transition-all flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[18px]">map</span>
              <span>View Aisle Floorplan</span>
            </button>
          </div>

          {/* 3-Column Products Grid */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 flex flex-col items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mb-3">
                <span className="material-symbols-outlined text-[32px]">search_off</span>
              </div>
              <h3 className="font-bold text-base text-[#0F172A]">We couldn't find that product.</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm">
                Try checking spelling, searching by brand (e.g. Colgate, Maggi, Tata Salt), or browsing departments.
              </p>
              <button
                type="button"
                onClick={resetFilters}
                className="mt-4 px-4 py-2 bg-[#2563EB] text-white text-xs font-bold rounded-xl shadow-xs"
              >
                Clear All Filters
              </button>
            </div>
          )}

          {/* End of Results / Request Assistance Strip */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4 mt-2">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[#2563EB] text-[26px]">support_agent</span>
              <div className="flex flex-col text-center sm:text-left">
                <span className="font-bold text-sm text-[#0F172A]">Cannot find a specific brand or size?</span>
                <span className="text-xs text-slate-500">
                  Store staff can check backroom pallet storage or bring it directly to your cart.
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setAisleStaffModalOpen(true)}
              className="whitespace-nowrap px-4 py-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-[#2563EB] text-xs font-bold border border-blue-200 transition-colors"
            >
              Request Aisle Staff
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};
