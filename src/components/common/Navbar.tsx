import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useRetailStore } from '../../store/useRetailStore';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const {
    storeInfo,
    cartItems,
    openAssistant,
    setAisleStaffModalOpen,
    setBarcodeScannerOpen
  } = useRetailStore();

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/products', label: 'Find Products' },
    { path: '/map', label: 'Store Map', badge: true },
    { path: '/offers', label: "Today's Offers" },
    { path: '/prices', label: 'Price Compare' },
    { path: '/trip', label: 'Trip Optimizer' }
  ];

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#E8ECF4] shadow-[0_1px_6px_rgba(0,0,0,0.03)]">
      <div className="h-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        {/* Brand Logo & Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <Link to="/" className="flex items-center gap-2.5 group">
            <img
              src="/iris-logo.jpg"
              alt="IRIS — Intelligent Retail Insight System"
              className="h-10 sm:h-11 w-auto object-contain rounded-lg group-hover:scale-105 transition-transform shadow-2xs"
            />
            <span className="text-[10px] font-extrabold text-[#0C831F] bg-[#F7FFF9] px-2 py-0.5 rounded border border-emerald-200 uppercase tracking-wider hidden md:inline-block">
              SMART STORE
            </span>
          </Link>

          <div className="h-5 w-px bg-slate-200 hidden xl:block" />

          {/* Store Location Status Pill (Blinkit Style) */}
          <div className="hidden xl:flex items-center gap-2 bg-[#F8FAFC] px-3 py-1 rounded-full border border-slate-200">
            <span className="text-xs text-[#1C1C1C] font-bold">{storeInfo.name} • {storeInfo.locationName}</span>
            <span className="flex items-center gap-1 text-xs text-[#0C831F] font-bold">
              <span className="w-2 h-2 rounded-full bg-[#0C831F] animate-pulse" />
              {storeInfo.statusText}
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-xs text-slate-500 font-medium">Cart {storeInfo.currentCartId}</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`relative px-3.5 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-[#1C1C1C] text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-[#1C1C1C]'
                }`}
              >
                <span>{link.label}</span>
                {link.badge && !isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0C831F] inline-block" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right Tools: Barcode Scanner, Staff Assist, Ask IRIS, Cart Pill */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Scan Barcode Tag */}
          <button
            type="button"
            onClick={() => setBarcodeScannerOpen(true)}
            className="p-2 text-slate-600 hover:text-[#0C831F] hover:bg-emerald-50 rounded-xl transition-colors border border-transparent hover:border-emerald-200"
            title="Scan Shelf Barcode Tag"
            aria-label="Scan barcode"
          >
            <span className="material-symbols-outlined text-[20px]">qr_code_scanner</span>
          </button>

          {/* Ask IRIS AI Assistant Trigger */}
          <button
            type="button"
            onClick={openAssistant}
            className="flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 text-[#0C831F] px-3 py-1.5 rounded-xl text-xs font-extrabold border border-emerald-200 transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">smart_toy</span>
            <span className="hidden sm:inline">Ask IRIS</span>
          </button>

          {/* Request Aisle Assistance */}
          <button
            type="button"
            onClick={() => setAisleStaffModalOpen(true)}
            className="p-2 text-slate-600 hover:text-[#1C1C1C] hover:bg-slate-100 rounded-xl transition-colors hidden sm:block border border-transparent hover:border-slate-200"
            title="Request Aisle Staff"
          >
            <span className="material-symbols-outlined text-[20px]">support_agent</span>
          </button>

          {/* Blinkit Signature Cart Pill */}
          <Link
            to="/trip"
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs ${
              totalCartCount > 0
                ? 'bg-[#0C831F] hover:bg-[#0A701A] text-white shadow-emerald-700/20'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
            }`}
            title="Active Shopping Cart & Route Optimizer"
          >
            <span className="material-symbols-outlined text-[18px]">shopping_cart</span>
            <span className="font-extrabold">
              {totalCartCount > 0 ? `${totalCartCount} ${totalCartCount === 1 ? 'item' : 'items'}` : storeInfo.currentCartId}
            </span>
            {totalCartCount > 0 && (
              <span className="material-symbols-outlined text-[16px] -ml-0.5">arrow_forward</span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
};
