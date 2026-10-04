import React, { useState } from 'react';
import { useRetailStore } from '../../store/useRetailStore';

export const AisleStaffModal: React.FC = () => {
  const { isAisleStaffModalOpen, setAisleStaffModalOpen, storeInfo } = useRetailStore();
  const [requested, setRequested] = useState(false);
  const [selectedReason, setSelectedReason] = useState('Stock check in backroom storage');

  if (!isAisleStaffModalOpen) return null;

  const handleRequest = () => {
    setRequested(true);
    setTimeout(() => {
      // Auto close after 2.5s
      setRequested(false);
      setAisleStaffModalOpen(false);
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl p-6 flex flex-col border border-slate-200">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#2563EB]">support_agent</span>
            <h3 className="font-bold text-sm text-[#0F172A]">Request In-Aisle Assistance</h3>
          </div>
          <button
            type="button"
            onClick={() => {
              setRequested(false);
              setAisleStaffModalOpen(false);
            }}
            className="w-7 h-7 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center"
          >
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        </div>

        {requested ? (
          <div className="py-6 flex flex-col items-center text-center animate-in zoom-in-95">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-3">
              <span className="material-symbols-outlined text-[28px]">check_circle</span>
            </div>
            <h4 className="font-bold text-base text-[#0F172A]">Staff Alert Dispatched!</h4>
            <p className="text-xs text-slate-600 mt-1 max-w-xs">
              Associate <strong>Ramesh (Floor 1 Zone A)</strong> is walking toward {storeInfo.currentCartLocation}. ETA ~45 seconds.
            </p>
          </div>
        ) : (
          <div className="py-4 flex flex-col gap-3">
            <div className="bg-blue-50 p-2.5 rounded-xl border border-blue-100 text-xs text-[#0F172A]">
              <span className="font-bold text-blue-700 block">Your Current Station:</span>
              <span>{storeInfo.currentCartLocation} (Cart {storeInfo.currentCartId})</span>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-600">Select Assistance Needed:</label>
              {[
                'Stock check in backroom storage',
                'Help reaching high shelf top deck',
                'Heavy pack assistance (e.g. 10kg Atta/Oil)',
                'Price or ESL tag discrepancy query'
              ].map((reason) => (
                <button
                  key={reason}
                  type="button"
                  onClick={() => setSelectedReason(reason)}
                  className={`p-2.5 text-left text-xs rounded-xl border transition-colors ${
                    selectedReason === reason
                      ? 'border-[#2563EB] bg-blue-50/60 font-semibold text-[#2563EB]'
                      : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {reason}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={handleRequest}
              className="mt-2 w-full py-3 bg-[#2563EB] hover:bg-blue-700 text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-[18px]">cell_tower</span>
              <span>Alert Nearest Floor Associate</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
