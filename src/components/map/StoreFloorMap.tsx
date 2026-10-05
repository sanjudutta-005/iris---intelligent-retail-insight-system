import React, { useState, useRef, useEffect } from 'react';
import { useRetailStore } from '../../store/useRetailStore';
import { Product } from '../../types/retail';

interface StoreFloorMapProps {
  interactive?: boolean;
  highlightedProduct?: Product | null;
  onSelectProduct?: (product: Product) => void;
  showHudControls?: boolean;
  className?: string;
}

export const StoreFloorMap: React.FC<StoreFloorMapProps> = ({
  interactive = true,
  highlightedProduct,
  onSelectProduct,
  showHudControls = true,
  className = ''
}) => {
  const {
    activeNavigationProduct,
    userPosition,
    setUserPosition,
    products,
    flashingEslTag,
    triggerFlashEslTag
  } = useRetailStore();

  const target = highlightedProduct || activeNavigationProduct || products[0];

  // Pan and zoom states
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isSimulatingWalk, setIsSimulatingWalk] = useState(false);
  const [simProgress, setSimProgress] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showLegend, setShowLegend] = useState(false);
  const [mobileHudExpanded, setMobileHudExpanded] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartRef = useRef<{ x: number; y: number; dist?: number; initialZoom?: number }>({ x: 0, y: 0 });

  // Target coordinates
  const targetX = target?.location?.x || 570;
  const targetY = target?.location?.y || 245;

  // Start coordinates (default user position e.g. Entrance 510, 50 or Cart in Aisle 4: 350, 240)
  const startX = userPosition.x;
  const startY = userPosition.y;

  // Compute curved waypoint path from Start to Target
  // We navigate via the promotion corridor / cross aisles
  const midY = 100;
  const aisleCorridorX = targetX < 500 ? targetX : targetX - 35;
  const pathD = `M ${startX} ${startY} L ${startX} ${midY} Q ${startX} ${midY + 10} ${startX + (targetX > startX ? 15 : -15)} ${midY + 10} L ${aisleCorridorX} ${midY + 10} Q ${targetX} ${midY + 10} ${targetX} ${midY + 25} L ${targetX} ${targetY}`;

  // Handle Simulated Walk
  useEffect(() => {
    let animId: any;
    if (isSimulatingWalk) {
      const startTime = Date.now();
      const duration = 8000; // 8 seconds to walk

      const frame = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        setSimProgress(progress);

        // Interpolate position along waypoints
        let curX = startX;
        let curY = startY;
        if (progress < 0.25) {
          const t = progress / 0.25;
          curY = startY + (midY - startY) * t;
        } else if (progress < 0.65) {
          const t = (progress - 0.25) / 0.4;
          curY = midY + 10;
          curX = startX + (targetX - startX) * t;
        } else {
          const t = (progress - 0.65) / 0.35;
          curX = targetX;
          curY = midY + 10 + (targetY - (midY + 10)) * t;
        }

        setUserPosition({ x: Math.round(curX), y: Math.round(curY), label: progress >= 1 ? 'Target Shelf B Reached' : 'En Route to Aisle 7' });

        if (progress < 1) {
          animId = requestAnimationFrame(frame);
        } else {
          setIsSimulatingWalk(false);
          triggerFlashEslTag(target.location.eslTagId);
        }
      };

      animId = requestAnimationFrame(frame);
    }
    return () => cancelAnimationFrame(animId);
  }, [isSimulatingWalk]);

  const handleRecenter = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  // Center on destination target shelf with zoom
  const handleFocusTarget = () => {
    if (!containerRef.current) {
      setZoom(1.6);
      return;
    }
    const rect = containerRef.current.getBoundingClientRect();
    const scaleFactor = Math.min(rect.width / 1000, rect.height / 660);
    const targetZoom = 1.6;
    const panX = (500 - targetX) * scaleFactor * targetZoom;
    const panY = (330 - targetY) * scaleFactor * targetZoom;
    setZoom(targetZoom);
    setPan({ x: Math.round(panX), y: Math.round(panY) });
  };

  // Center on user position with zoom
  const handleFocusUser = () => {
    if (!containerRef.current) {
      setZoom(1.6);
      return;
    }
    const rect = containerRef.current.getBoundingClientRect();
    const scaleFactor = Math.min(rect.width / 1000, rect.height / 660);
    const targetZoom = 1.6;
    const panX = (500 - startX) * scaleFactor * targetZoom;
    const panY = (330 - startY) * scaleFactor * targetZoom;
    setZoom(targetZoom);
    setPan({ x: Math.round(panX), y: Math.round(panY) });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!interactive) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !interactive) return;
    setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch handlers for mobile (pan and pinch-to-zoom)
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!interactive) return;
    if (e.touches.length === 1) {
      touchStartRef.current = {
        x: e.touches[0].clientX - pan.x,
        y: e.touches[0].clientY - pan.y
      };
      setIsDragging(true);
    } else if (e.touches.length === 2) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      touchStartRef.current = {
        x: pan.x,
        y: pan.y,
        dist,
        initialZoom: zoom
      };
      setIsDragging(false);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!interactive) return;
    if (e.touches.length === 1 && isDragging) {
      setPan({
        x: e.touches[0].clientX - touchStartRef.current.x,
        y: e.touches[0].clientY - touchStartRef.current.y
      });
    } else if (e.touches.length === 2 && touchStartRef.current.dist && touchStartRef.current.initialZoom) {
      const newDist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const ratio = newDist / touchStartRef.current.dist;
      const nextZoom = Math.min(Math.max(touchStartRef.current.initialZoom * ratio, 0.75), 3.0);
      setZoom(nextZoom);
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    touchStartRef.current = { x: 0, y: 0 };
  };

  const isFlashing = flashingEslTag === target?.location?.eslTagId;

  return (
    <div
      ref={containerRef}
      className={`${
        isFullscreen
          ? 'fixed inset-0 z-50 bg-[#F8FAFC] flex flex-col p-2 sm:p-4 select-none touch-none'
          : `relative w-full overflow-hidden select-none bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl touch-none ${className}`
      }`}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
    >
      {/* Floating HUD Controls */}
      {showHudControls && (
        <>
          {/* Top Left Navigation Pill - Responsive & Mobile Safe */}
          <div className="absolute top-2.5 sm:top-4 left-2.5 sm:left-4 z-20 pointer-events-auto max-w-[calc(100%-120px)] sm:max-w-sm">
            <div
              onClick={() => setMobileHudExpanded(!mobileHudExpanded)}
              className="bg-white/95 backdrop-blur-md rounded-xl p-2 sm:p-3 shadow-md border border-slate-200 flex items-center gap-2 sm:gap-3 cursor-pointer transition-all hover:bg-white"
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-[#2563EB] text-white flex items-center justify-center shrink-0 shadow-sm">
                <span className="material-symbols-outlined text-[18px] sm:text-[24px]">turn_right</span>
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <span className="text-[10px] sm:text-xs text-[#2563EB] font-bold uppercase tracking-wider truncate">
                    NEXT TURN • {Math.round(target.location.distanceMeters * (1 - simProgress))}M
                  </span>
                  <span className="hidden xs:inline-block px-1.5 py-0.2 bg-blue-100 text-[#2563EB] text-[9px] sm:text-[10px] font-bold rounded">
                    Fastest
                  </span>
                </div>
                <p className="text-xs sm:text-sm font-semibold text-[#0F172A] truncate">
                  Turn right into {target.location.aisle}
                </p>
                {mobileHudExpanded && (
                  <p className="text-[10px] text-slate-500 mt-1 line-clamp-2">
                    {target.name} • {target.location.shelf} ({target.location.tier})
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Top Right Zoom, Focus and Control Tools */}
          <div className="absolute top-2.5 sm:top-4 right-2.5 sm:right-4 z-20 pointer-events-auto flex flex-col gap-1 sm:gap-1.5 bg-white/95 backdrop-blur-md rounded-xl p-1 shadow-md border border-slate-200">
            {/* Fullscreen Toggle */}
            <button
              type="button"
              onClick={() => setIsFullscreen(!isFullscreen)}
              className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center transition-colors ${
                isFullscreen ? 'bg-[#2563EB] text-white' : 'hover:bg-slate-100 text-[#2563EB]'
              }`}
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Map'}
            >
              <span className="material-symbols-outlined text-[18px] sm:text-[20px]">
                {isFullscreen ? 'fullscreen_exit' : 'fullscreen'}
              </span>
            </button>

            {/* Focus Destination Shelf */}
            <button
              type="button"
              onClick={handleFocusTarget}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg hover:bg-slate-100 flex items-center justify-center text-red-600 transition-colors"
              title="Focus Target Shelf"
            >
              <span className="material-symbols-outlined text-[18px] sm:text-[20px]">pin_drop</span>
            </button>

            {/* Focus Your Position */}
            <button
              type="button"
              onClick={handleFocusUser}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg hover:bg-slate-100 flex items-center justify-center text-[#2563EB] transition-colors"
              title="Focus Your Position"
            >
              <span className="material-symbols-outlined text-[18px] sm:text-[20px]">person_pin_circle</span>
            </button>

            {/* Recenter / Fit Whole Store */}
            <button
              type="button"
              onClick={handleRecenter}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-700 transition-colors"
              title="Fit Full Store Map"
            >
              <span className="material-symbols-outlined text-[18px] sm:text-[20px]">fit_screen</span>
            </button>

            {/* Zoom In */}
            <button
              type="button"
              onClick={() => setZoom((z) => Math.min(z + 0.3, 3.0))}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-700 transition-colors"
              title="Zoom In"
            >
              <span className="material-symbols-outlined text-[18px] sm:text-[20px]">add</span>
            </button>

            {/* Zoom Out */}
            <button
              type="button"
              onClick={() => setZoom((z) => Math.max(z - 0.3, 0.75))}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-700 transition-colors"
              title="Zoom Out"
            >
              <span className="material-symbols-outlined text-[18px] sm:text-[20px]">remove</span>
            </button>

            {/* Simulate Walking */}
            <button
              type="button"
              onClick={() => {
                setIsSimulatingWalk(!isSimulatingWalk);
              }}
              className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center transition-colors ${
                isSimulatingWalk ? 'bg-emerald-500 text-white animate-pulse' : 'hover:bg-slate-100 text-slate-700'
              }`}
              title="Simulate Walking Route"
            >
              <span className="material-symbols-outlined text-[18px] sm:text-[20px]">directions_walk</span>
            </button>
          </div>

          {/* Bottom Left Legend - Collapsible on Mobile */}
          <div className="absolute bottom-2.5 sm:bottom-3 left-2.5 sm:left-3 z-20 pointer-events-auto">
            {/* Mobile Legend Button & Popup */}
            <div className="sm:hidden">
              <button
                type="button"
                onClick={() => setShowLegend(!showLegend)}
                className="bg-white/95 backdrop-blur-md px-2.5 py-1.5 rounded-xl shadow-sm border border-slate-200 flex items-center gap-1.5 text-[11px] font-bold text-slate-700 hover:bg-white"
              >
                <span className="material-symbols-outlined text-[15px] text-[#2563EB]">info</span>
                <span>{showLegend ? 'Close' : 'Legend'}</span>
              </button>
              {showLegend && (
                <div className="mt-1.5 bg-white/95 backdrop-blur-md p-2 rounded-xl shadow-md border border-slate-200 flex flex-col gap-1.5 text-[10px] font-medium text-slate-700 animate-in fade-in slide-in-from-bottom-2">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#2563EB]" />
                    <span>Target Route</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-sm bg-emerald-400" />
                    <span>Fresh Produce</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-sm bg-sky-300" />
                    <span>Dairy & Frozen</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-sm bg-indigo-200" />
                    <span>Checkouts</span>
                  </div>
                </div>
              )}
            </div>

            {/* Desktop / Tablet Full Legend */}
            <div className="hidden sm:flex bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl shadow-sm border border-slate-200 items-center gap-3.5 text-xs font-medium text-slate-600">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#2563EB]" />
                <span>Target Route</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-emerald-400" />
                <span>Fresh Produce</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-sky-300" />
                <span>Dairy & Frozen</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-indigo-200" />
                <span>Checkouts</span>
              </div>
            </div>
          </div>

          {/* Mobile Bottom Right Hint */}
          <div className="sm:hidden absolute bottom-2.5 right-2.5 z-10 pointer-events-none bg-slate-900/75 backdrop-blur-xs text-white text-[9px] px-2 py-1 rounded-full font-medium">
            Drag • Pinch zoom
          </div>
        </>
      )}

      {/* SVG Canvas */}
      <div
        className="w-full h-full cursor-grab active:cursor-grabbing transition-transform duration-75 flex items-center justify-center"
        style={{
          transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`,
          transformOrigin: 'center center'
        }}
      >
        <svg
          viewBox="0 0 1000 660"
          className="w-full h-full object-contain"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <pattern id="grid-bg" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#DBE1FF" strokeWidth="0.5" opacity="0.4" />
            </pattern>
            <radialGradient id="beaconPulse" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#2563EB" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#004AC6" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="destGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#2563EB" />
              <stop offset="100%" stopColor="#004AC6" />
            </linearGradient>
          </defs>

          {/* Grid Background */}
          <rect width="1000" height="660" fill="#F8FAFC" />
          <rect width="1000" height="660" fill="url(#grid-bg)" />

          {/* ================= 1. PERIMETER DEPARTMENTS ================= */}
          {/* Fresh Produce Zone (Left) */}
          <g id="fresh-produce">
            <rect x="24" y="24" width="130" height="420" rx="12" fill="#EEFAF0" stroke="#86EFAC" strokeWidth="1" />
            <text x="89" y="50" textAnchor="middle" fill="#006329" fontFamily="Inter" fontSize="12" fontWeight="700">
              FRESH PRODUCE
            </text>
            <rect x="42" y="80" width="94" height="60" rx="6" fill="#C7FFCA" opacity="0.8" />
            <text x="89" y="115" textAnchor="middle" fill="#005320" fontFamily="Inter" fontSize="10" fontWeight="500">
              Organic Fruits
            </text>
            <rect x="42" y="160" width="94" height="60" rx="6" fill="#C7FFCA" opacity="0.8" />
            <text x="89" y="195" textAnchor="middle" fill="#005320" fontFamily="Inter" fontSize="10" fontWeight="500">
              Greens & Veggies
            </text>
            <rect x="42" y="240" width="94" height="60" rx="6" fill="#C7FFCA" opacity="0.8" />
            <text x="89" y="275" textAnchor="middle" fill="#005320" fontFamily="Inter" fontSize="10" fontWeight="500">
              Salads & Cut Herbs
            </text>
            <rect x="42" y="320" width="94" height="60" rx="6" fill="#C7FFCA" opacity="0.8" />
            <text x="89" y="355" textAnchor="middle" fill="#005320" fontFamily="Inter" fontSize="10" fontWeight="500">
              Imported Produce
            </text>
          </g>

          {/* Dairy & Frozen Chiller (Right Top) */}
          <g id="dairy-frozen">
            <rect x="846" y="24" width="130" height="230" rx="12" fill="#EFF8FF" stroke="#BAE6FD" strokeWidth="1" />
            <text x="911" y="50" textAnchor="middle" fill="#0058BE" fontFamily="Inter" fontSize="12" fontWeight="700">
              DAIRY & FROZEN
            </text>
            <rect x="862" y="70" width="98" height="35" rx="4" fill="#D8E2FF" />
            <text x="911" y="92" textAnchor="middle" fill="#003EA8" fontFamily="Inter" fontSize="10" fontWeight="600">
              Milk & Cheeses
            </text>
            <rect x="862" y="120" width="98" height="35" rx="4" fill="#D8E2FF" />
            <text x="911" y="142" textAnchor="middle" fill="#003EA8" fontFamily="Inter" fontSize="10" fontWeight="600">
              Ice Creams
            </text>
            <rect x="862" y="170" width="98" height="35" rx="4" fill="#D8E2FF" />
            <text x="911" y="192" textAnchor="middle" fill="#003EA8" fontFamily="Inter" fontSize="10" fontWeight="600">
              Frozen Meals
            </text>
          </g>

          {/* Artisan Bakery & Deli (Right Bottom) */}
          <g id="bakery-deli">
            <rect x="846" y="270" width="130" height="174" rx="12" fill="#FFFBEB" stroke="#FDE68A" strokeWidth="1" />
            <text x="911" y="296" textAnchor="middle" fill="#93000A" fontFamily="Inter" fontSize="12" fontWeight="700">
              BAKERY & DELI
            </text>
            <rect x="862" y="315" width="98" height="50" rx="4" fill="#FFDAD6" opacity="0.6" />
            <text x="911" y="345" textAnchor="middle" fill="#93000A" fontFamily="Inter" fontSize="10" fontWeight="600">
              Fresh Breads
            </text>
            <rect x="862" y="375" width="98" height="50" rx="4" fill="#FFDAD6" opacity="0.6" />
            <text x="911" y="405" textAnchor="middle" fill="#93000A" fontFamily="Inter" fontSize="10" fontWeight="600">
              Hot Rotisserie
            </text>
          </g>

          {/* ================= 2. ENTRANCE & MAIN PROMENADE ================= */}
          <rect x="420" y="16" width="180" height="42" rx="8" fill="#E2E7FF" stroke="#C3C6D7" strokeWidth="1" />
          <text x="510" y="42" textAnchor="middle" fill="#004AC6" fontFamily="Inter" fontSize="12" fontWeight="700">
            ▼ STORE ENTRANCE / CARTS ▼
          </text>
          <circle cx="440" cy="37" r="4" fill="#16A34A" />
          <circle cx="580" cy="37" r="4" fill="#16A34A" />

          {/* Promotion Promenade Corridor */}
          <rect x="180" y="70" width="640" height="34" rx="6" fill="#EAEDFF" opacity="0.7" />
          <text x="500" y="91" textAnchor="middle" fill="#434655" fontFamily="Inter" fontSize="11" fontWeight="600" letterSpacing="1.5">
            CENTRAL PROMENADE (PROMOTION CORRIDOR)
          </text>

          {/* ================= 3. AISLES SHELVING MATRIX ================= */}
          {/* Aisle 1-2: Rice, Atta & Spices */}
          <g id="aisle_1_2" className="cursor-pointer hover:opacity-90 transition-opacity">
            <rect x="200" y="130" width="80" height="240" rx="6" fill="#FFFFFF" stroke="#C3C6D7" strokeWidth="1.5" />
            <rect x="200" y="130" width="80" height="22" rx="4" fill="#DAE2FD" />
            <text x="240" y="146" textAnchor="middle" fill="#131B2E" fontFamily="Inter" fontSize="11" fontWeight="700">AISLE 1-2</text>
            <line x1="200" y1="210" x2="280" y2="210" stroke="#EAEDFF" strokeWidth="2" />
            <line x1="200" y1="290" x2="280" y2="290" stroke="#EAEDFF" strokeWidth="2" />
            <text x="240" y="248" textAnchor="middle" fill="#434655" fontFamily="Inter" fontSize="10">Rice & Atta</text>
            <text x="240" y="328" textAnchor="middle" fill="#434655" fontFamily="Inter" fontSize="10">Whole Spices</text>
          </g>

          {/* Aisle 3-4: Instant Foods & Pasta */}
          <g id="aisle_3_4" className="cursor-pointer hover:opacity-90 transition-opacity">
            <rect x="310" y="130" width="80" height="240" rx="6" fill="#FFFFFF" stroke="#C3C6D7" strokeWidth="1.5" />
            <rect x="310" y="130" width="80" height="22" rx="4" fill="#DAE2FD" />
            <text x="350" y="146" textAnchor="middle" fill="#131B2E" fontFamily="Inter" fontSize="11" fontWeight="700">AISLE 3-4</text>
            <line x1="310" y1="210" x2="390" y2="210" stroke="#EAEDFF" strokeWidth="2" />
            <line x1="310" y1="290" x2="390" y2="290" stroke="#EAEDFF" strokeWidth="2" />
            <text x="350" y="248" textAnchor="middle" fill="#434655" fontFamily="Inter" fontSize="10">Noodles & Pasta</text>
            <text x="350" y="328" textAnchor="middle" fill="#434655" fontFamily="Inter" fontSize="10">Chips & Snacks</text>
          </g>

          {/* Aisle 5-6: Beverages & Juices */}
          <g id="aisle_5_6" className="cursor-pointer hover:opacity-90 transition-opacity">
            <rect x="420" y="130" width="80" height="240" rx="6" fill="#FFFFFF" stroke="#C3C6D7" strokeWidth="1.5" />
            <rect x="420" y="130" width="80" height="22" rx="4" fill="#DAE2FD" />
            <text x="460" y="146" textAnchor="middle" fill="#131B2E" fontFamily="Inter" fontSize="11" fontWeight="700">AISLE 5-6</text>
            <line x1="420" y1="210" x2="500" y2="210" stroke="#EAEDFF" strokeWidth="2" />
            <line x1="420" y1="290" x2="500" y2="290" stroke="#EAEDFF" strokeWidth="2" />
            <text x="460" y="248" textAnchor="middle" fill="#434655" fontFamily="Inter" fontSize="10">Energy Drinks</text>
            <text x="460" y="328" textAnchor="middle" fill="#434655" fontFamily="Inter" fontSize="10">Tea & Coffees</text>
          </g>

          {/* Aisle 7-8: Dental, Personal Care & Oral Hygiene (TARGET AISLE HIGHLIGHTED) */}
          <g id="aisle_7_8">
            <rect x="526" y="126" width="88" height="248" rx="8" fill="#DBE1FF" opacity={target.location.aisle.startsWith('A7') || target.location.aisle.startsWith('A8') ? 0.8 : 0.2} />
            <rect x="530" y="130" width="80" height="240" rx="6" fill="#FFFFFF" stroke="#2563EB" strokeWidth="2.5" />
            <rect x="530" y="130" width="80" height="24" rx="4" fill="#004AC6" />
            <text x="570" y="147" textAnchor="middle" fill="#FFFFFF" fontFamily="Inter" fontSize="11" fontWeight="700">AISLE 7-8</text>
            
            {/* Shelf A */}
            <rect x="532" y="160" width="76" height="50" rx="3" fill="#F2F3FF" />
            <text x="570" y="188" textAnchor="middle" fill="#004AC6" fontFamily="Inter" fontSize="10" fontWeight="600">Soaps & Body</text>

            {/* Shelf B - Target Eye Level Shelf */}
            <rect
              x="532"
              y="218"
              width="76"
              height="66"
              rx="4"
              fill={isFlashing ? '#67E8F9' : '#DBE1FF'}
              stroke="#2563EB"
              strokeWidth="2"
              strokeDasharray={isFlashing ? '0' : '3 2'}
              className={isFlashing ? 'animate-pulse' : ''}
            />
            <text x="570" y="246" textAnchor="middle" fill="#003EA8" fontFamily="Inter" fontSize="10" fontWeight="700">SHELF B</text>
            <text x="570" y="262" textAnchor="middle" fill="#004AC6" fontFamily="Inter" fontSize="9" fontWeight="600">Oral Care Zone</text>

            {/* Shelf C */}
            <rect x="532" y="292" width="76" height="70" rx="3" fill="#F2F3FF" />
            <text x="570" y="330" textAnchor="middle" fill="#004AC6" fontFamily="Inter" fontSize="10" fontWeight="600">Skin & Hair</text>
          </g>

          {/* Aisle 9-10: Detergents & Cleaners */}
          <g id="aisle_9_10" className="cursor-pointer hover:opacity-90 transition-opacity">
            <rect x="640" y="130" width="80" height="240" rx="6" fill="#FFFFFF" stroke="#C3C6D7" strokeWidth="1.5" />
            <rect x="640" y="130" width="80" height="22" rx="4" fill="#DAE2FD" />
            <text x="680" y="146" textAnchor="middle" fill="#131B2E" fontFamily="Inter" fontSize="11" fontWeight="700">AISLE 9-10</text>
            <line x1="640" y1="210" x2="720" y2="210" stroke="#EAEDFF" strokeWidth="2" />
            <line x1="640" y1="290" x2="720" y2="290" stroke="#EAEDFF" strokeWidth="2" />
            <text x="680" y="248" textAnchor="middle" fill="#434655" fontFamily="Inter" fontSize="10">Detergents</text>
            <text x="680" y="328" textAnchor="middle" fill="#434655" fontFamily="Inter" fontSize="10">Cleaners</text>
          </g>

          {/* Aisle 11-12: Baby Care & Wellness */}
          <g id="aisle_11_12" className="cursor-pointer hover:opacity-90 transition-opacity">
            <rect x="750" y="130" width="80" height="240" rx="6" fill="#FFFFFF" stroke="#C3C6D7" strokeWidth="1.5" />
            <rect x="750" y="130" width="80" height="22" rx="4" fill="#DAE2FD" />
            <text x="790" y="146" textAnchor="middle" fill="#131B2E" fontFamily="Inter" fontSize="11" fontWeight="700">AISLE 11-12</text>
            <line x1="750" y1="210" x2="830" y2="210" stroke="#EAEDFF" strokeWidth="2" />
            <line x1="750" y1="290" x2="830" y2="290" stroke="#EAEDFF" strokeWidth="2" />
            <text x="790" y="248" textAnchor="middle" fill="#434655" fontFamily="Inter" fontSize="10">Baby Diapers</text>
            <text x="790" y="328" textAnchor="middle" fill="#434655" fontFamily="Inter" fontSize="10">Vitamins</text>
          </g>

          {/* ================= 4. CHECKOUTS & AMENITIES ================= */}
          <g id="checkouts-matrix">
            <rect x="180" y="470" width="130" height="48" rx="8" fill="#EEF0FF" />
            <text x="245" y="492" textAnchor="middle" fill="#004AC6" fontFamily="Inter" fontSize="10" fontWeight="700">EXPRESS 1-4</text>
            <text x="245" y="508" textAnchor="middle" fill="#434655" fontFamily="Inter" fontSize="9">&lt; 10 Items</text>

            <rect x="330" y="470" width="180" height="48" rx="8" fill="#EEF0FF" />
            <text x="420" y="492" textAnchor="middle" fill="#004AC6" fontFamily="Inter" fontSize="10" fontWeight="700">SELF-CHECKOUT (A–F)</text>
            <circle cx="360" cy="505" r="4" fill="#16A34A" />
            <circle cx="390" cy="505" r="4" fill="#16A34A" />
            <circle cx="420" cy="505" r="4" fill="#16A34A" />
            <circle cx="450" cy="505" r="4" fill="#16A34A" />
            <circle cx="480" cy="505" r="4" fill="#DC2626" />

            <rect x="530" y="470" width="180" height="48" rx="8" fill="#EAEDFF" />
            <text x="620" y="492" textAnchor="middle" fill="#131B2E" fontFamily="Inter" fontSize="10" fontWeight="700">LANES 5 – 10</text>
            <text x="620" y="508" textAnchor="middle" fill="#434655" fontFamily="Inter" fontSize="9">Cash / Card / IRIS Pay</text>

            <rect x="730" y="470" width="100" height="48" rx="8" fill="#EAEDFF" />
            <text x="780" y="492" textAnchor="middle" fill="#131B2E" fontFamily="Inter" fontSize="10" fontWeight="700">HELP DESK</text>
            <text x="780" y="508" textAnchor="middle" fill="#434655" fontFamily="Inter" fontSize="9">Returns & Info</text>
          </g>

          {/* Restrooms & Locker Facilities */}
          <rect x="24" y="550" width="130" height="60" rx="8" fill="#FAF8FF" stroke="#C3C6D7" strokeWidth="1" />
          <text x="89" y="585" textAnchor="middle" fill="#434655" fontFamily="Inter" fontSize="10" fontWeight="600">Restrooms & Care</text>

          <rect x="846" y="550" width="130" height="60" rx="8" fill="#FAF8FF" stroke="#C3C6D7" strokeWidth="1" />
          <text x="911" y="585" textAnchor="middle" fill="#434655" fontFamily="Inter" fontSize="10" fontWeight="600">Packaging & Locker</text>

          {/* ================= 5. ACTIVE WAYFINDING PATHWAY ================= */}
          <path
            d={pathD}
            fill="none"
            stroke="#2563EB"
            strokeWidth="5"
            strokeDasharray="8 6"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="animate-dash"
          />

          {/* Distance Marker Pill on Path */}
          <g transform={`translate(${Math.round((startX + targetX) / 2) - 25}, ${midY})`}>
            <rect width="50" height="18" rx="9" fill="#004AC6" />
            <text x="25" y="13" textAnchor="middle" fill="#FFFFFF" fontFamily="Inter" fontSize="9" fontWeight="700">
              {target.location.distanceMeters}m
            </text>
          </g>

          {/* ================= 6. USER LOCATION BEACON ================= */}
          <g transform={`translate(${startX}, ${startY})`}>
            {/* Animated radar rings */}
            <circle cx="0" cy="0" r="28" fill="url(#beaconPulse)">
              <animate attributeName="r" values="12;32;12" dur="2.4s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.8;0.1;0.8" dur="2.4s" repeatCount="indefinite" />
            </circle>
            {/* Viewing cone */}
            <path d="M 0 0 L -14 26 Q 0 32 14 26 Z" fill="#0058BE" opacity="0.3" />
            {/* Core blue circle */}
            <circle cx="0" cy="0" r="8" fill="#FFFFFF" stroke="#004AC6" strokeWidth="3" />
            <circle cx="0" cy="0" r="4" fill="#2563EB" />
            {/* User Label Badge */}
            <g transform="translate(-50, -28)">
              <rect width="100" height="20" rx="10" fill="#131B2E" />
              <text x="50" y="14" textAnchor="middle" fill="#FFFFFF" fontFamily="Inter" fontSize="9" fontWeight="700">
                YOU ({userPosition.label.split(' ')[0]})
              </text>
            </g>
          </g>

          {/* ================= 7. DESTINATION TARGET PIN ================= */}
          <g transform={`translate(${targetX}, ${targetY})`}>
            {/* Pulse */}
            <circle cx="0" cy="0" r="20" fill={isFlashing ? '#67E8F9' : '#FFDAD6'} opacity="0.6">
              <animate attributeName="r" values="8;24;8" dur="1.8s" repeatCount="indefinite" />
            </circle>
            {/* Target Pin Head */}
            <circle cx="0" cy="0" r="10" fill="url(#destGradient)" stroke="#FFFFFF" strokeWidth="2.5" />
            <circle cx="0" cy="0" r="4" fill="#FFFFFF" />

            {/* Tooltip Product Card */}
            <g transform="translate(14, -24)">
              <rect width="150" height="44" rx="8" fill="#FFFFFF" filter="drop-shadow(0 4px 6px rgba(0,0,0,0.15))" />
              <text x="12" y="18" fill="#131B2E" fontFamily="Inter" fontSize="10" fontWeight="700">
                {target.name.length > 20 ? target.name.slice(0, 18) + '...' : target.name}
              </text>
              <text x="12" y="32" fill="#007F36" fontFamily="Inter" fontSize="9" fontWeight="600">
                ₹{target.variants[0].price} • {target.location.shelf} ({target.location.tier})
              </text>
            </g>
          </g>
        </svg>
      </div>
    </div>
  );
};
