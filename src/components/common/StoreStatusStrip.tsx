import React from 'react';
import { useRetailStore } from '../../store/useRetailStore';

export const StoreStatusStrip: React.FC = () => {
  const { storeInfo } = useRetailStore();

  return (
    <div className="w-full bg-white rounded-xl p-3 sm:px-4 sm:py-2.5 shadow-sm border border-[#E2E8F0] flex flex-wrap items-center justify-between gap-3 text-[#0F172A]">
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center text-[#2563EB] shrink-0 border border-blue-100">
          <span className="material-symbols-outlined text-[20px]">storefront</span>
        </div>
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-[#0F172A] truncate">{storeInfo.name}</span>
            <span className="text-[11px] bg-slate-100 px-2 py-0.5 rounded-full text-slate-600 font-semibold">
              {storeInfo.floors}
            </span>
          </div>
          <span className="text-xs text-slate-500 truncate">
            {storeInfo.hub} • {storeInfo.city}
          </span>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-slate-600 text-xs">
        <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-full border border-slate-200">
          <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse" />
          <span className="text-[#16A34A] font-bold">{storeInfo.statusText}</span>
          <span className="text-slate-300 font-normal">|</span>
          <span className="text-[#0F172A] font-medium">{storeInfo.hours}</span>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-full border border-slate-200">
          <span className="material-symbols-outlined text-blue-600 text-[15px]">groups</span>
          <span>
            Crowd: <strong className="text-[#0F172A] font-semibold">{storeInfo.crowdLevel}</strong>
          </span>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-full border border-slate-200">
          <span className="material-symbols-outlined text-[#16A34A] text-[15px]">sensors</span>
          <span>
            Beacon Grid: <strong className="text-[#0F172A] font-semibold">{storeInfo.beaconGridStatus}</strong>
          </span>
        </div>
      </div>
    </div>
  );
};
