import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRetailStore } from '../../store/useRetailStore';

export const BarcodeScannerModal: React.FC = () => {
  const { isBarcodeScannerOpen, setBarcodeScannerOpen, products, setSelectedProduct, startNavigationToProduct } = useRetailStore();
  const navigate = useNavigate();
  const [isScanning, setIsScanning] = useState(true);
  const [scannedProduct, setScannedProduct] = useState<any>(null);

  if (!isBarcodeScannerOpen) return null;

  const playBeep = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, audioCtx.currentTime); // A5 note
      gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.15);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.15);
    } catch {
      // Audio not permitted without interaction
    }
  };

  const handleSimulateScan = (prodId: string) => {
    const prod = products.find(p => p.id === prodId) || products[0];
    playBeep();
    setIsScanning(false);
    setScannedProduct(prod);
  };

  const handleLocateScanned = () => {
    if (scannedProduct) {
      setSelectedProduct(scannedProduct.id);
      startNavigationToProduct(scannedProduct);
      setBarcodeScannerOpen(false);
      navigate('/map');
    }
  };

  const handleViewPDP = () => {
    if (scannedProduct) {
      setSelectedProduct(scannedProduct.id);
      setBarcodeScannerOpen(false);
      navigate(`/products/${scannedProduct.id}`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-slate-200">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#2563EB]">qr_code_scanner</span>
            <div>
              <h3 className="font-bold text-sm text-[#0F172A]">IRIS In-Store Shelf & Barcode Scanner</h3>
              <p className="text-xs text-slate-500">Scan product packaging or ESL shelf price tag</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              setBarcodeScannerOpen(false);
              setIsScanning(true);
              setScannedProduct(null);
            }}
            className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center hover:bg-slate-300"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Viewfinder Area */}
        <div className="p-6 flex flex-col items-center justify-center bg-slate-900 text-white relative min-h-[260px] overflow-hidden">
          {isScanning ? (
            <>
              {/* Camera reticle overlay */}
              <div className="relative w-64 h-44 border-2 border-dashed border-blue-400 rounded-xl flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-blue-500/10" />
                {/* Red Laser Scanning line */}
                <div className="absolute left-0 right-0 h-0.5 bg-red-500 shadow-[0_0_8px_#ef4444] animate-bounce" />
                <span className="text-xs text-blue-200 font-medium z-10 bg-slate-900/80 px-2 py-1 rounded">
                  Align Barcode or ESL Tag
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-4 text-center">
                Camera live stream active. Point at any shelf sticker or product barcode.
              </p>
            </>
          ) : (
            scannedProduct && (
              <div className="flex flex-col items-center text-center p-2 animate-in fade-in zoom-in-95 duration-200">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-2">
                  <span className="material-symbols-outlined text-[28px]">check_circle</span>
                </div>
                <span className="text-xs text-emerald-400 font-semibold uppercase tracking-wider">
                  Verified Shelf Tag • {scannedProduct.location.eslTagId}
                </span>
                <h4 className="font-bold text-base text-white mt-1 max-w-xs truncate">
                  {scannedProduct.name}
                </h4>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xl font-bold text-white">
                    ₹{scannedProduct.variants[0].price}
                  </span>
                  <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded font-semibold">
                    {scannedProduct.location.aisle} • {scannedProduct.location.shelf}
                  </span>
                </div>
              </div>
            )
          )}
        </div>

        {/* Quick Simulation Barcodes */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex flex-col gap-2">
          {isScanning ? (
            <>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Simulate Instant Shelf Scans:
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleSimulateScan('prod-colgate-maxfresh')}
                  className="p-2 text-left bg-white border border-slate-200 rounded-lg text-xs hover:border-blue-500 transition-colors"
                >
                  <span className="font-semibold block text-[#0F172A] truncate">Colgate MaxFresh</span>
                  <span className="text-slate-500 text-[10px]">Aisle 7 • ESL #TG-882</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleSimulateScan('prod-maggi-masala')}
                  className="p-2 text-left bg-white border border-slate-200 rounded-lg text-xs hover:border-blue-500 transition-colors"
                >
                  <span className="font-semibold block text-[#0F172A] truncate">Maggi 2-Min Noodles</span>
                  <span className="text-slate-500 text-[10px]">Aisle 3 • ESL #44-A3</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleSimulateScan('prod-amul-ghee')}
                  className="p-2 text-left bg-white border border-slate-200 rounded-lg text-xs hover:border-blue-500 transition-colors"
                >
                  <span className="font-semibold block text-[#0F172A] truncate">Amul Pure Ghee 1L</span>
                  <span className="text-slate-500 text-[10px]">Aisle 4 • ESL #AG-101</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleSimulateScan('prod-surf-excel-matic')}
                  className="p-2 text-left bg-white border border-slate-200 rounded-lg text-xs hover:border-blue-500 transition-colors"
                >
                  <span className="font-semibold block text-[#0F172A] truncate">Surf Excel Matic 2L</span>
                  <span className="text-slate-500 text-[10px]">Aisle 11 • ESL #SE-202</span>
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleLocateScanned}
                className="flex-1 py-2.5 px-4 bg-[#2563EB] hover:bg-blue-700 text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-sm"
              >
                <span className="material-symbols-outlined text-[18px]">near_me</span>
                <span>Locate on Map</span>
              </button>
              <button
                type="button"
                onClick={handleViewPDP}
                className="flex-1 py-2.5 px-4 bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold rounded-xl text-xs flex items-center justify-center gap-1.5"
              >
                <span>View Variants & Prices</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
