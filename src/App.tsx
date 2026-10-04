/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/common/Navbar';
import { MobileBottomNav } from './components/common/MobileBottomNav';
import { Footer } from './components/common/Footer';
import { MiniMapDrawer } from './components/map/MiniMapDrawer';
import { BarcodeScannerModal } from './components/common/BarcodeScannerModal';
import { VoiceSearchModal } from './components/common/VoiceSearchModal';
import { AisleStaffModal } from './components/common/AisleStaffModal';
import { AIAssistantModal } from './components/assistant/AIAssistantModal';

import { HomePage } from './pages/HomePage';
import { SearchPage } from './pages/SearchPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { StoreMapPage } from './pages/StoreMapPage';
import { OffersPage } from './pages/OffersPage';
import { PriceComparePage } from './pages/PriceComparePage';
import { TripOptimizerPage } from './pages/TripOptimizerPage';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#F4F6FB] text-[#1C1C1C] flex flex-col antialiased selection:bg-emerald-100 selection:text-emerald-900 font-sans">
        {/* Global Desktop & Tablet Top Navigation */}
        <Navbar />

        {/* Main Content View with top offset for fixed navbar */}
        <main className="flex-1 w-full pt-16">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<SearchPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/products/:id" element={<ProductDetailPage />} />
            <Route path="/map" element={<StoreMapPage />} />
            <Route path="/offers" element={<OffersPage />} />
            <Route path="/prices" element={<PriceComparePage />} />
            <Route path="/trip" element={<TripOptimizerPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        {/* Global Footer */}
        <Footer />

        {/* Global Modals & Drawers */}
        <MiniMapDrawer />
        <BarcodeScannerModal />
        <VoiceSearchModal />
        <AisleStaffModal />
        <AIAssistantModal />

        {/* Persistent Bottom In-Store Hardware Telemetry Bar (from screenshots) */}
        <aside className="hidden lg:block fixed bottom-0 left-0 right-0 z-30 bg-white/90 backdrop-blur-md border-t border-slate-200 py-1.5 px-6 pointer-events-none">
          <div className="max-w-7xl mx-auto flex items-center justify-between text-xs text-slate-500 font-medium">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#16A34A] text-[16px]">wifi_tethering</span>
              <span>Connected to Store Wi-Fi & Beacon Grid • Precision ±0.5m</span>
            </div>
            <div className="flex items-center gap-4">
              <span>Floor 1 • Aisle 4 Guidance Active</span>
              <span className="text-slate-300">•</span>
              <span>Indoor GPS Sensor Ready</span>
            </div>
          </div>
        </aside>

        {/* Mobile Fixed Bottom Navigation Bar */}
        <MobileBottomNav />
      </div>
    </BrowserRouter>
  );
}
