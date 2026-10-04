import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRetailStore } from '../store/useRetailStore';
import { ProductImage } from '../components/common/ProductImage';

export const PriceComparePage: React.FC = () => {
  const navigate = useNavigate();
  const {
    products,
    selectedProductId,
    setSelectedProduct,
    activeVariantMap,
    setActiveVariant,
    startNavigationToProduct,
    addToCart,
    setBarcodeScannerOpen
  } = useRetailStore();

  const product = products.find((p) => p.id === selectedProductId) || products[0];
  const activeVarId = activeVariantMap[product.id] || product.selectedVariantId;
  const currentVariant = product.variants.find((v) => v.id === activeVarId) || product.variants[0];

  const [productSearch, setProductSearch] = useState('');
  const [showSwitchDropdown, setShowSwitchDropdown] = useState(false);

  const handleSelectRow = (varId: string) => {
    setActiveVariant(product.id, varId);
  };

  const handlePlotRoute = () => {
    startNavigationToProduct(product);
    navigate('/map');
  };

  const handleAddToCart = () => {
    addToCart(product, currentVariant);
  };

  const filteredSwitch = productSearch
    ? products.filter((p) => p.name.toLowerCase().includes(productSearch.toLowerCase()))
    : products.slice(0, 8);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-6 pb-28">
      {/* Breadcrumbs & Location Sensor */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-1.5 text-slate-500 font-medium">
          <span>Supermart</span>
          <span className="material-symbols-outlined text-[14px]">chevron_right</span>
          <span>{product.department}</span>
          <span className="material-symbols-outlined text-[14px]">chevron_right</span>
          <span>{product.category}</span>
          <span className="material-symbols-outlined text-[14px]">chevron_right</span>
          <span className="text-[#0F172A] font-bold">Unit Price Matrix</span>
        </div>

        <div className="flex items-center gap-2 bg-[#F1F5F9] px-3 py-1.5 rounded-full border border-slate-200">
          <span className="material-symbols-outlined text-[#2563EB] text-[16px]">share_location</span>
          <span className="font-bold text-[#0F172A]">You are at Aisle 7, Bay 4</span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A]" />
          <span className="text-slate-500">Beacon: A7-N44</span>
        </div>
      </div>

      {/* Product Benchmark Header */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-5 sm:p-6 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5 relative z-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="w-20 h-20 rounded-xl bg-[#F8FAFC] border border-slate-200 p-2 flex items-center justify-center shrink-0">
              <ProductImage src={product.image} alt={product.name} category={product.category} className="w-full h-full object-contain" />
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="bg-[#0F172A] text-white px-2.5 py-0.5 rounded-full text-xs font-bold">
                  {product.location.aisle} • {product.location.shelf}
                </span>
                <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full text-xs font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A]" />
                  All {product.variants.length} Sizes On-Shelf
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-[#0F172A] tracking-tight">
                {product.name}
              </h1>
              <p className="text-xs sm:text-sm text-slate-500">
                Instant price comparison across sizes. Normalized unit economics benchmarked per 100 grams.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-stretch lg:self-auto justify-end relative">
            <button
              type="button"
              onClick={() => setShowSwitchDropdown(!showSwitchDropdown)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors border border-slate-200"
            >
              <span className="material-symbols-outlined text-[18px]">swap_horiz</span>
              <span>Switch Product</span>
            </button>

            <button
              type="button"
              onClick={() => setBarcodeScannerOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors border border-slate-200"
            >
              <span className="material-symbols-outlined text-[18px]">barcode_scanner</span>
              <span>Scan Different Shelf</span>
            </button>

            {/* Switch Product Dropdown */}
            {showSwitchDropdown && (
              <div className="absolute top-full right-0 mt-2 w-72 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 p-2 flex flex-col gap-1">
                <input
                  type="text"
                  placeholder="Filter products..."
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  className="p-2 text-xs bg-slate-50 border border-slate-200 rounded-lg mb-1 focus:outline-none"
                />
                <div className="max-h-56 overflow-y-auto flex flex-col gap-1">
                  {filteredSwitch.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => {
                        setSelectedProduct(p.id);
                        setShowSwitchDropdown(false);
                      }}
                      className="p-2 text-left hover:bg-blue-50 rounded-lg text-xs flex items-center justify-between"
                    >
                      <span className="font-semibold text-slate-800 truncate">{p.name}</span>
                      <span className="text-[10px] text-blue-600 bg-blue-100 px-1.5 py-0.2 rounded font-bold">
                        {p.location.aisle}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* IRIS Value Insight Banner (Image 9) */}
      <div className="bg-gradient-to-r from-blue-50 via-slate-50 to-indigo-50 border border-blue-200 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#2563EB] text-white flex items-center justify-center shrink-0 shadow-xs">
            <span className="material-symbols-outlined text-[22px]">insights</span>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-[#0F172A]">IRIS Value Insight</span>
              <span className="bg-[#16A34A] text-white px-2 py-0.5 rounded-full text-[11px] font-bold">
                Save Up to ₹20 / 100g
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
              The 200 g pack or Saver Duo saves you up to ₹20 per 100g compared to the 50g starter tube. Both are placed together on {product.location.shelf} directly at eye level.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-white px-3.5 py-2 rounded-xl shrink-0 shadow-xs border border-slate-200">
          <div className="text-right">
            <div className="text-[11px] text-slate-400 font-medium">Cheapest Unit Rate</div>
            <div className="text-base font-extrabold text-[#16A34A]">₹70.00 / 100g</div>
          </div>
          <span className="material-symbols-outlined text-[#16A34A] text-[26px]">savings</span>
        </div>
      </div>

      {/* 2-Column: Variant Matrix (8 Cols) + Brand Alternatives (4 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Variant Matrix & Unit Cost Chart */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-[#0F172A]">Variant Matrix & Shelf Inventory</h2>
              <p className="text-xs text-slate-500">Tap any row to select your destination pack size</p>
            </div>
            <span className="text-[11px] text-slate-500 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-md font-medium">
              Live ESL Sync
            </span>
          </div>

          {/* Clean Data Table */}
          <div className="bg-white rounded-2xl shadow-sm border border-[#E2E8F0] overflow-x-auto">
            <table className="w-full text-left min-w-[620px] text-xs">
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-slate-200 text-slate-600 font-bold">
                  <th className="py-3 px-4">Pack Size</th>
                  <th className="py-3 px-4">Price</th>
                  <th className="py-3 px-4">Unit Cost</th>
                  <th className="py-3 px-4">Deal / Badge</th>
                  <th className="py-3 px-4">Stock</th>
                  <th className="py-3 px-4">Bin Code</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {product.variants.map((v) => {
                  const isSelected = v.id === currentVariant.id;
                  return (
                    <tr
                      key={v.id}
                      onClick={() => handleSelectRow(v.id)}
                      className={`cursor-pointer transition-colors ${
                        isSelected
                          ? 'bg-blue-50/80 hover:bg-blue-100/60'
                          : 'hover:bg-slate-50'
                      }`}
                    >
                      <td className="py-3.5 px-4 font-bold text-[#0F172A] flex items-center gap-1.5">
                        {isSelected && <span className="w-2 h-2 rounded-full bg-[#2563EB] animate-pulse" />}
                        <span>{v.size}</span>
                        {isSelected && (
                          <span className="bg-[#2563EB] text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold ml-1">
                            Selected
                          </span>
                        )}
                        {v.isBestValue && (
                          <span className="bg-emerald-100 text-emerald-800 text-[10px] px-1.5 py-0.2 rounded font-bold ml-1">
                            ★ BEST VALUE
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-sm text-[#0F172A]">₹{v.price}</td>
                      <td className="py-3.5 px-4 font-semibold text-[#2563EB]">{v.unitPriceText}</td>
                      <td className="py-3.5 px-4">
                        {v.discountPercent ? (
                          <span className="bg-red-100 text-red-600 text-[10px] px-2 py-0.5 rounded font-bold">
                            {v.discountPercent}% OFF
                          </span>
                        ) : (
                          <span className="text-slate-400 text-[11px]">— Standard</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="text-[#16A34A] text-xs font-semibold flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A]" />
                          {v.stock} left
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-semibold text-[11px]">
                          {v.shelfBin.split('•')[1] || v.shelfBin}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          type="button"
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                            isSelected
                              ? 'bg-[#2563EB] text-white shadow-xs'
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          }`}
                        >
                          {isSelected ? 'Selected' : 'Locate'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Unit Cost Economy Curve (Image 9) */}
          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-sm flex flex-col gap-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-[#0F172A]">Unit Cost Economy Curve (₹ per 100g)</span>
              <span className="text-slate-400 font-medium">Lower unit cost saves more money</span>
            </div>

            <div className="h-28 w-full flex items-end gap-4 pt-4 px-2">
              {product.variants.map((v) => {
                const maxUnit = Math.max(...product.variants.map((varItem) => varItem.unitCostValue));
                const heightPercent = Math.round((v.unitCostValue / maxUnit) * 100);
                const isSelected = v.id === currentVariant.id;

                return (
                  <div
                    key={v.id}
                    onClick={() => handleSelectRow(v.id)}
                    className="flex-1 flex flex-col items-center gap-1.5 cursor-pointer group"
                  >
                    <span
                      className={`text-xs font-bold transition-colors ${
                        isSelected ? 'text-[#2563EB]' : 'text-slate-500 group-hover:text-slate-900'
                      }`}
                    >
                      ₹{v.unitCostValue.toFixed(1)}
                    </span>
                    <div
                      className={`w-full rounded-t-md transition-all duration-300 ${
                        isSelected
                          ? 'bg-[#2563EB]'
                          : v.isBestValue
                          ? 'bg-emerald-500'
                          : 'bg-slate-200 group-hover:bg-blue-200'
                      }`}
                      style={{ height: `${heightPercent}%` }}
                    />
                    <span className="text-[11px] text-slate-500 font-medium truncate max-w-full">
                      {v.size.split(' ')[0]}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Brand Alternatives & Transparency Guarantee (4 Cols) */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-5 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#0F172A] flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[#2563EB] text-[20px]">compare</span>
                Brand Alternatives
              </h3>
              <span className="text-[11px] text-slate-400 font-medium">~150g Segment</span>
            </div>

            {/* Alternatives Cards */}
            <div className="flex flex-col gap-2.5">
              <div className="p-3 rounded-xl bg-blue-50/80 border border-blue-200 flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#0F172A]">Colgate MaxFresh (150g)</span>
                  <span className="text-sm font-extrabold text-[#0F172A]">₹115</span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>Unit: ₹76.7 / 100g</span>
                  <span className="bg-white px-2 py-0.5 rounded text-[11px] font-semibold border border-blue-200">
                    Aisle 7, Shelf B
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 transition-colors flex flex-col gap-1 shadow-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-[#0F172A]">Pepsodent GermiCheck</span>
                    <span className="text-emerald-700 text-[10px] font-bold bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">-₹7</span>
                  </div>
                  <span className="text-sm font-extrabold text-[#0F172A]">₹108</span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="text-emerald-600 font-semibold">₹72.0 / 100g</span>
                  <span className="bg-slate-100 px-2 py-0.5 rounded text-[11px] font-semibold">
                    Aisle 7, Shelf A
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 transition-colors flex flex-col gap-1 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#0F172A]">Close Up Everfresh (150g)</span>
                  <span className="text-sm font-extrabold text-[#0F172A]">₹125</span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>₹83.3 / 100g</span>
                  <span className="bg-slate-100 px-2 py-0.5 rounded text-[11px] font-semibold">
                    Aisle 7, Shelf C
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 transition-colors flex flex-col gap-1 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#0F172A]">Sensodyne Repair (100g)</span>
                  <span className="text-sm font-extrabold text-[#0F172A]">₹195</span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>₹195.0 / 100g</span>
                  <span className="bg-slate-100 px-2 py-0.5 rounded text-[11px] font-semibold">
                    Aisle 7, Shelf E
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Price Transparency Guarantee Card */}
          <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-4 flex flex-col gap-2">
            <span className="text-xs font-bold text-[#0F172A] flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[#16A34A] text-[18px]">verified</span>
              Price Transparency Guarantee
            </span>
            <p className="text-xs text-slate-500 leading-relaxed">
              All prices are matched against IRIS Smart Tag Electronic Shelf Labels (ESL) updated 12 mins ago. Scanning at self-checkout will honor these promo unit rates automatically.
            </p>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Active Target Variant Strip (Image 9) */}
      <div className="fixed bottom-16 md:bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-2xl p-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="w-11 h-11 rounded-xl bg-[#2563EB] text-white flex items-center justify-center shrink-0 shadow-sm">
              <span className="material-symbols-outlined text-[24px]">navigation</span>
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">Active Target Variant:</span>
                <span className="text-sm font-bold text-[#0F172A] truncate">
                  {product.name} ({currentVariant.size})
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <span className="font-bold text-[#0F172A]">
                  ₹{currentVariant.price} ({currentVariant.unitPriceText})
                </span>
                <span>•</span>
                <span className="text-[#2563EB] font-semibold flex items-center gap-1">
                  <span className="material-symbols-outlined text-[15px]">location_on</span>
                  {product.location.aisle}, {product.location.shelf}, {currentVariant.shelfBin}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 w-full md:w-auto justify-end">
            <button
              type="button"
              onClick={handleAddToCart}
              className="flex-1 md:flex-initial px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors"
            >
              Add to Cart List
            </button>
            <button
              type="button"
              onClick={handlePlotRoute}
              className="flex-1 md:flex-initial flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white text-xs sm:text-sm font-bold shadow-md transition-all active:scale-95"
            >
              <span className="material-symbols-outlined text-[18px]">turn_sharp_right</span>
              <span>Plot Route to {product.location.shelf} ({product.location.distanceMeters}m away)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
