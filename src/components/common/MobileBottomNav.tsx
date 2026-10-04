import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useRetailStore } from '../../store/useRetailStore';

export const MobileBottomNav: React.FC = () => {
  const location = useLocation();
  const { cartItems } = useRetailStore();
  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const tabs = [
    { path: '/', label: 'Home', icon: 'storefront' },
    { path: '/products', label: 'Search', icon: 'search' },
    { path: '/map', label: 'Map', icon: 'explore' },
    { path: '/offers', label: 'Offers', icon: 'local_offer' },
    { path: '/trip', label: 'Trip', icon: 'route', count: totalCartCount }
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-t border-[#E2E8F0] shadow-[0_-2px_12px_rgba(0,0,0,0.05)] pb-[env(safe-area-inset-bottom,0px)]">
      <div className="flex items-center justify-around h-16 px-2">
        {tabs.map((tab) => {
          const isActive = location.pathname === tab.path;
          return (
            <Link
              key={tab.path}
              to={tab.path}
              className={`flex flex-col items-center justify-center min-w-[56px] min-h-[44px] gap-0.5 transition-colors relative ${
                isActive ? 'text-[#0C831F] font-extrabold' : 'text-[#64748B] hover:text-[#1C1C1C]'
              }`}
            >
              <div className="relative">
                <span
                  className="material-symbols-outlined text-[24px]"
                  style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
                >
                  {tab.icon}
                </span>
                {Boolean(tab.count && tab.count > 0) && (
                  <span className="absolute -top-1 -right-2 bg-[#0C831F] text-white text-[10px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center leading-none shadow-xs">
                    {tab.count}
                  </span>
                )}
              </div>
              <span className="text-[11px] leading-tight font-bold">{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
