import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRetailStore } from '../../store/useRetailStore';

export const VoiceSearchModal: React.FC = () => {
  const { isVoiceSearchOpen, setVoiceSearchOpen, setSearchQuery } = useRetailStore();
  const navigate = useNavigate();
  const [transcript, setTranscript] = useState('Listening... Speak now');

  if (!isVoiceSearchOpen) return null;

  const handleQueryPick = (query: string) => {
    setTranscript(`"${query}"`);
    setTimeout(() => {
      setSearchQuery(query);
      setVoiceSearchOpen(false);
      navigate('/products');
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl p-6 flex flex-col items-center text-center border border-slate-200 animate-in zoom-in-95">
        <button
          type="button"
          onClick={() => setVoiceSearchOpen(false)}
          className="self-end -mr-2 -mt-2 w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center"
        >
          <span className="material-symbols-outlined text-[18px]">close</span>
        </button>

        {/* Animated Microphone Pulsar */}
        <div className="relative my-4">
          <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center text-[#2563EB] animate-pulse">
            <span className="material-symbols-outlined text-[36px]">mic</span>
          </div>
          <div className="absolute inset-0 rounded-full border-2 border-blue-400 animate-ping opacity-30" />
        </div>

        <h3 className="font-bold text-lg text-[#0F172A]">IRIS Voice Search</h3>
        <p className="text-sm font-medium text-[#2563EB] mt-1">{transcript}</p>
        <p className="text-xs text-slate-400 mt-1">Speak an item name, aisle number, or natural query</p>

        {/* Quick Sample Prompts */}
        <div className="mt-5 w-full flex flex-col gap-2">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Try Saying:</span>
          <button
            type="button"
            onClick={() => handleQueryPick('Colgate toothpaste')}
            className="w-full py-2 px-3 bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-700 text-xs rounded-xl border border-slate-200 transition-colors text-left flex items-center justify-between"
          >
            <span>“Where is Colgate toothpaste?”</span>
            <span className="material-symbols-outlined text-[16px] text-slate-400">arrow_forward</span>
          </button>
          <button
            type="button"
            onClick={() => handleQueryPick('Amul Butter')}
            className="w-full py-2 px-3 bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-700 text-xs rounded-xl border border-slate-200 transition-colors text-left flex items-center justify-between"
          >
            <span>“Show butter on offer”</span>
            <span className="material-symbols-outlined text-[16px] text-slate-400">arrow_forward</span>
          </button>
          <button
            type="button"
            onClick={() => handleQueryPick('India Gate Basmati Rice')}
            className="w-full py-2 px-3 bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-700 text-xs rounded-xl border border-slate-200 transition-colors text-left flex items-center justify-between"
          >
            <span>“Find cheapest Basmati rice”</span>
            <span className="material-symbols-outlined text-[16px] text-slate-400">arrow_forward</span>
          </button>
        </div>
      </div>
    </div>
  );
};
