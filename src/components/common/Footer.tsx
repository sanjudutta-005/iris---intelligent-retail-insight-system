import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[#F8FAFC] border-t border-[#E2E8F0] py-8 pb-24 md:pb-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img
              src="/iris-logo.jpg"
              alt="IRIS — Intelligent Retail Insight System"
              className="h-10 w-auto object-contain rounded-lg"
            />
            <span className="text-xs text-slate-500 font-medium hidden sm:inline">
              Physical Store Navigation & Pricing System
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600">
            <Link to="/map" className="hover:text-[#2563EB] transition-colors">Indoor Store Map</Link>
            <span className="text-slate-300">•</span>
            <Link to="/products" className="hover:text-[#2563EB] transition-colors">Product Directory</Link>
            <span className="text-slate-300">•</span>
            <Link to="/offers" className="hover:text-[#2563EB] transition-colors">ESL Shelf Deals</Link>
            <span className="text-slate-300">•</span>
            <Link to="/prices" className="hover:text-[#2563EB] transition-colors">Unit Price Comparison</Link>
          </div>
        </div>

        <div className="border-t border-slate-200 pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <p>© 2026 IRIS Retail Technologies Inc. All rights reserved. Deployed at Indiranagar Flagship Supermart.</p>
          <div className="flex items-center gap-2 text-[11px] text-slate-400">
            <span className="inline-block w-2 h-2 rounded-full bg-[#16A34A]"></span>
            <span>Electronic Shelf Labels (ESL) Verified 12 mins ago</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
