import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useRetailStore } from '../../store/useRetailStore';

export const MiniMapDrawer: React.FC = () => {
  const { miniMapDrawer, closeMiniMapDrawer, triggerFlashEslTag, products, startNavigationToProduct } = useRetailStore();
  const navigate = useNavigate();

  if (!miniMapDrawer.isOpen) return null;

  const handleStartNav = () => {
    if (miniMapDrawer.productId) {
      const prod = products.find(p => p.id === miniMapDrawer.productId);
      if (prod) startNavigationToProduct(prod);
    }
    closeMiniMapDrawer();
    navigate('/map');
  };

  const handleFlashLed = () => {
    triggerFlashEslTag('ESL #TG-882');
  };

  return (
    <div className="fixed inset-x-0 bottom-16 md:bottom-6 z-40 max-w-2xl mx-auto px-4 transition-all duration-300 animate-in fade-in slide-in-from-bottom-8">
      <div className="bg-white rounded-2xl shadow-2xl p-4 flex flex-col gap-3 border border-slate-200 overflow-hidden">
        {/* Top Bar: Item Name & Dismiss */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-full bg-[#2563EB] text-white flex items-center justify-center shrink-0 shadow-sm">
              <span className="material-symbols-outlined text-[20px]">navigation</span>
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-sm text-[#0F172A] truncate">
                {miniMapDrawer.itemName}
              </h3>
              <span className="text-xs text-[#2563EB] font-semibold truncate block">
                {miniMapDrawer.shelfDetails}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={closeMiniMapDrawer}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors shrink-0"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Live Vector Mini Indoor Schematic */}
        <div className="relative w-full h-36 bg-[#F8FAFC] border border-slate-200 rounded-xl overflow-hidden p-2 flex flex-col justify-between">
          <svg
            className="absolute inset-0 w-full h-full"
            fill="none"
            viewBox="0 0 400 120"
            preserveAspectRatio="none"
          >
            {/* Aisle 5 */}
            <rect x="20" y="15" width="60" height="24" rx="4" fill="#E2E8F0" />
            <text x="50" y="31" textAnchor="middle" fill="#475569" fontFamily="Inter" fontSize="10" fontWeight="600">Aisle 5</text>
            <rect x="20" y="65" width="60" height="24" rx="4" fill="#E2E8F0" />

            {/* Aisle 6 (You Are Here) */}
            <rect x="110" y="15" width="70" height="24" rx="4" fill="#E2E8F0" />
            <rect x="110" y="65" width="70" height="24" rx="4" fill="#E2E8F0" />
            <text x="145" y="80" textAnchor="middle" fill="#475569" fontFamily="Inter" fontSize="10" fontWeight="600">Aisle 6</text>

            {/* Aisle 7 (Target) */}
            <rect x="210" y="15" width="85" height="24" rx="4" fill="#DBE1FF" />
            <rect x="210" y="65" width="85" height="24" rx="4" fill="#DBE1FF" />
            <text x="252" y="31" textAnchor="middle" fill="#004AC6" fontFamily="Inter" fontSize="10" fontWeight="700">Aisle 7 (Target)</text>

            {/* Animated Path */}
            <path
              d="M 145 50 L 195 50 L 195 27 L 225 27"
              stroke="#2563EB"
              strokeWidth="3"
              strokeDasharray="4 3"
              className="animate-pulse"
            />
            {/* User dot */}
            <circle cx="145" cy="50" r="5" fill="#2563EB" className="animate-ping" />
            <circle cx="145" cy="50" r="5" fill="#2563EB" />
            {/* Target beacon */}
            <circle cx="225" cy="27" r="6" fill="#DC2626" />
          </svg>

          {/* Overlay Tag Top */}
          <div className="relative z-10 flex items-center justify-between pointer-events-none">
            <span className="px-2 py-0.5 rounded bg-white/90 text-[11px] font-semibold text-slate-800 shadow-sm border border-slate-200">
              Current Cart Station: Aisle 6
            </span>
            <span className="px-2 py-0.5 rounded bg-[#2563EB] text-white text-[11px] font-bold shadow-sm">
              Indoor Turn-by-Turn: Ready
            </span>
          </div>

          {/* Overlay Tag Bottom */}
          <div className="relative z-10 flex items-center justify-between pointer-events-none">
            <span className="text-xs font-bold text-[#0F172A] bg-white/90 px-2 py-0.5 rounded shadow-sm border border-slate-200">
              {miniMapDrawer.distanceTime || 'Walking time: 45 sec (45 meters)'}
            </span>
            <span className="text-[11px] font-semibold text-[#16A34A] bg-white/90 px-2 py-0.5 rounded shadow-sm flex items-center gap-1 border border-slate-200">
              <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A] animate-pulse" />
              Beacon Signal: 100%
            </span>
          </div>
        </div>

        {/* Action Button Strip */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleStartNav}
            className="flex-1 h-11 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all active:scale-[0.98]"
          >
            <span className="material-symbols-outlined text-[18px]">turn_sharp_right</span>
            <span>Start Real-Time Cart Navigation</span>
          </button>
          <button
            type="button"
            onClick={handleFlashLed}
            className="px-3 h-11 rounded-xl bg-blue-50 hover:bg-blue-100 text-[#2563EB] text-xs font-semibold flex items-center gap-1.5 border border-blue-200 transition-colors"
            title="Trigger LED light on physical shelf"
          >
            <span className="material-symbols-outlined text-[18px]">wb_twilight</span>
            <span className="hidden sm:inline">Flash Shelf LED</span>
          </button>
        </div>
      </div>
    </div>
  );
};
