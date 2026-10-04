import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRetailStore } from '../../store/useRetailStore';

export const AIAssistantModal: React.FC = () => {
  const {
    isAssistantOpen,
    closeAssistant,
    assistantMessages,
    sendAssistantMessage,
    products,
    startNavigationToProduct,
    setSelectedProduct
  } = useRetailStore();
  const navigate = useNavigate();
  const [inputText, setInputText] = useState('');

  const quickPrompts = [
    'Where is Colgate?',
    'Show me toothpaste under ₹150',
    'What offers are available today?',
    'Where can I find baby products?'
  ];

  const handleSend = (text: string) => {
    if (!text.trim()) return;
    sendAssistantMessage(text.trim());
    setInputText('');
  };

  const handleProductNavigate = (prodId: string) => {
    const prod = products.find(p => p.id === prodId);
    if (prod) {
      setSelectedProduct(prod.id);
      startNavigationToProduct(prod);
      closeAssistant();
      navigate('/map');
    }
  };

  if (!isAssistantOpen) return null;

  return (
    <div className="fixed inset-0 md:inset-auto md:bottom-6 md:right-6 md:w-96 md:h-[540px] z-50 bg-white shadow-2xl md:rounded-2xl border border-slate-200 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-6">
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-[#0C831F] to-[#0A6C1A] text-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <img
                src="/iris-logo.jpg"
                alt="IRIS Logo"
                className="w-9 h-9 rounded-xl object-cover border border-white/40 bg-white p-0.5 shadow-xs"
              />
              <div>
                <h3 className="font-bold text-sm leading-tight">IRIS In-Store Assistant</h3>
                <span className="text-[11px] text-blue-100 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Online • Beacon Grid Connected
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={closeAssistant}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#F8FAFC]">
            {assistantMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-[#2563EB] text-white rounded-tr-none'
                      : 'bg-white text-slate-800 shadow-sm border border-slate-200 rounded-tl-none'
                  }`}
                >
                  <p>{msg.text}</p>

                  {/* If message links to product navigation */}
                  {msg.targetProductId && (
                    <button
                      type="button"
                      onClick={() => handleProductNavigate(msg.targetProductId!)}
                      className="mt-2 w-full py-1.5 px-3 bg-blue-50 hover:bg-blue-100 text-[#2563EB] rounded-lg font-semibold flex items-center justify-center gap-1 text-[11px] transition-colors border border-blue-200"
                    >
                      <span className="material-symbols-outlined text-[15px]">near_me</span>
                      <span>Plot Route to Shelf</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Quick Prompts Strip */}
          <div className="p-2 bg-white border-t border-slate-100 flex gap-1.5 overflow-x-auto no-scrollbar">
            {quickPrompts.map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => handleSend(prompt)}
                className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 text-[11px] whitespace-nowrap transition-colors border border-slate-200"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend(inputText);
            }}
            className="p-3 bg-white border-t border-slate-200 flex items-center gap-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask IRIS where to find items..."
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="w-9 h-9 rounded-xl bg-[#2563EB] hover:bg-blue-700 disabled:opacity-40 text-white flex items-center justify-center shrink-0 transition-colors shadow-sm"
            >
              <span className="material-symbols-outlined text-[18px]">send</span>
            </button>
          </form>
        </div>
  );
};
