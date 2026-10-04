import { create } from 'zustand';
import { Product, ProductVariant, StoreOffer, StoreInfo, CartShoppingItem } from '../types/retail';
import { mockProducts, mockOffers, mockStoreInfo } from '../data/mockRetailData';

export type SortOption = 'relevance' | 'distance' | 'priceAsc' | 'discount';

interface RetailStoreState {
  // Store status
  storeInfo: StoreInfo;
  
  // Search & Filters
  searchQuery: string;
  selectedCategory: string;
  selectedAisleCode: string;
  selectedBrand: string;
  inStockOnly: boolean;
  hasOfferOnly: boolean;
  within50mOnly: boolean;
  priceRange: [number, number];
  packSizeFilter: string;
  sortOption: SortOption;
  
  // Products
  products: Product[];
  selectedProductId: string;
  activeVariantMap: Record<string, string>; // productId -> variantId
  
  // Wayfinding / Map
  activeNavigationProduct: Product | null;
  isLiveNavigating: boolean;
  activeFloor: number;
  userPosition: { x: number; y: number; label: string };
  flashingEslTag: string | null;
  flashingTimeoutId: any;
  miniMapDrawer: {
    isOpen: boolean;
    itemName: string;
    shelfDetails: string;
    distanceTime: string;
    productId?: string;
  };
  
  // Shopping Cart & Multi-Stop Trip Optimizer
  cartItems: CartShoppingItem[];
  isColdChainLockEnabled: boolean;
  
  // AI Assistant
  isAssistantOpen: boolean;
  assistantMessages: { id: string; sender: 'user' | 'iris'; text: string; actionType?: string; targetProductId?: string }[];
  
  // Modals
  isBarcodeScannerOpen: boolean;
  isVoiceSearchOpen: boolean;
  isAisleStaffModalOpen: boolean;
  isTripOptimizerModalOpen: boolean;

  // Actions
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (cat: string) => void;
  setSelectedAisleCode: (code: string) => void;
  setSelectedBrand: (brand: string) => void;
  setInStockOnly: (val: boolean) => void;
  setHasOfferOnly: (val: boolean) => void;
  setWithin50mOnly: (val: boolean) => void;
  setPriceRange: (range: [number, number]) => void;
  setPackSizeFilter: (size: string) => void;
  setSortOption: (sort: SortOption) => void;
  resetFilters: () => void;
  
  setSelectedProduct: (productId: string) => void;
  setActiveVariant: (productId: string, variantId: string) => void;
  
  startNavigationToProduct: (product: Product) => void;
  stopNavigation: () => void;
  setActiveFloor: (floor: number) => void;
  setUserPosition: (pos: { x: number; y: number; label: string }) => void;
  triggerFlashEslTag: (tagId: string) => void;
  openMiniMapDrawer: (itemName: string, shelfDetails: string, distanceTime: string, productId?: string) => void;
  closeMiniMapDrawer: () => void;
  
  addToCart: (product: Product, variant?: ProductVariant) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, delta: number) => void;
  toggleItemCollected: (productId: string) => void;
  setColdChainLock: (val: boolean) => void;
  
  openAssistant: () => void;
  closeAssistant: () => void;
  sendAssistantMessage: (text: string) => void;
  
  setBarcodeScannerOpen: (open: boolean) => void;
  setVoiceSearchOpen: (open: boolean) => void;
  setAisleStaffModalOpen: (open: boolean) => void;
  setTripOptimizerModalOpen: (open: boolean) => void;
}

export const useRetailStore = create<RetailStoreState>((set, get) => ({
  storeInfo: mockStoreInfo,
  
  searchQuery: '',
  selectedCategory: 'cat-all',
  selectedAisleCode: 'all',
  selectedBrand: 'all',
  inStockOnly: false,
  hasOfferOnly: false,
  within50mOnly: false,
  priceRange: [0, 1000],
  packSizeFilter: 'all',
  sortOption: 'relevance',
  
  products: mockProducts,
  selectedProductId: 'prod-colgate-maxfresh',
  activeVariantMap: {
    'prod-colgate-maxfresh': 'var-cm-150',
    'prod-colgate-strong-teeth': 'var-cst-200',
    'prod-colgate-total-12': 'var-ct-120',
    'prod-colgate-visible-white': 'var-vw-100',
    'prod-maggi-masala': 'var-mg-6',
    'prod-tata-salt': 'var-ts-1k',
    'prod-dove-body-wash': 'var-dbw-800',
    'prod-surf-excel-matic': 'var-sem-2l',
    'prod-amul-ghee': 'var-ag-1l',
    'prod-lays-magic-masala': 'var-lm-115',
    'prod-epigamia-yogurt': 'var-ey-4pack',
    'prod-dettol-handwash': 'var-dh-1500',
  },
  
  activeNavigationProduct: mockProducts[0],
  isLiveNavigating: false,
  activeFloor: 1,
  userPosition: { x: 510, y: 50, label: 'Store Entrance Turnstiles' },
  flashingEslTag: null,
  flashingTimeoutId: null,
  miniMapDrawer: {
    isOpen: false,
    itemName: '',
    shelfDetails: '',
    distanceTime: ''
  },
  
  // Seed with realistic smart cart items for trip optimization
  cartItems: [
    { product: mockProducts.find(p => p.id === 'prod-amul-ghee')!, variant: mockProducts.find(p => p.id === 'prod-amul-ghee')!.variants[1], quantity: 1, isCollected: false, sequenceOrder: 1 },
    { product: mockProducts.find(p => p.id === 'prod-maggi-masala')!, variant: mockProducts.find(p => p.id === 'prod-maggi-masala')!.variants[2], quantity: 1, isCollected: false, sequenceOrder: 2 },
    { product: mockProducts.find(p => p.id === 'prod-colgate-maxfresh')!, variant: mockProducts.find(p => p.id === 'prod-colgate-maxfresh')!.variants[2], quantity: 1, isCollected: false, sequenceOrder: 3 },
    { product: mockProducts.find(p => p.id === 'prod-surf-excel-matic')!, variant: mockProducts.find(p => p.id === 'prod-surf-excel-matic')!.variants[1], quantity: 1, isCollected: false, sequenceOrder: 4 },
    { product: mockProducts.find(p => p.id === 'prod-epigamia-yogurt')!, variant: mockProducts.find(p => p.id === 'prod-epigamia-yogurt')!.variants[1], quantity: 1, isCollected: false, sequenceOrder: 5 },
  ],
  isColdChainLockEnabled: true,
  
  isAssistantOpen: false,
  assistantMessages: [
    {
      id: 'm1',
      sender: 'iris',
      text: 'Hello! I am IRIS, your in-store retail intelligence guide. Looking for a specific item, checking shelf stock, or seeking today\'s best price?'
    }
  ],
  
  isBarcodeScannerOpen: false,
  isVoiceSearchOpen: false,
  isAisleStaffModalOpen: false,
  isTripOptimizerModalOpen: false,

  setSearchQuery: (query) => set({ searchQuery: query }),
  setSelectedCategory: (cat) => set({ selectedCategory: cat }),
  setSelectedAisleCode: (code) => set({ selectedAisleCode: code }),
  setSelectedBrand: (brand) => set({ selectedBrand: brand }),
  setInStockOnly: (val) => set({ inStockOnly: val }),
  setHasOfferOnly: (val) => set({ hasOfferOnly: val }),
  setWithin50mOnly: (val) => set({ within50mOnly: val }),
  setPriceRange: (range) => set({ priceRange: range }),
  setPackSizeFilter: (size) => set({ packSizeFilter: size }),
  setSortOption: (sort) => set({ sortOption: sort }),
  resetFilters: () => set({
    searchQuery: '',
    selectedCategory: 'cat-all',
    selectedAisleCode: 'all',
    selectedBrand: 'all',
    inStockOnly: false,
    hasOfferOnly: false,
    within50mOnly: false,
    priceRange: [0, 1000],
    packSizeFilter: 'all',
    sortOption: 'relevance'
  }),
  
  setSelectedProduct: (productId) => set({ selectedProductId: productId }),
  
  setActiveVariant: (productId, variantId) => {
    set((state) => ({
      activeVariantMap: {
        ...state.activeVariantMap,
        [productId]: variantId
      }
    }));
  },
  
  startNavigationToProduct: (product) => set({
    activeNavigationProduct: product,
    selectedProductId: product.id,
    isLiveNavigating: true,
    miniMapDrawer: {
      isOpen: false,
      itemName: '',
      shelfDetails: '',
      distanceTime: ''
    }
  }),
  
  stopNavigation: () => set({ isLiveNavigating: false }),
  setActiveFloor: (floor) => set({ activeFloor: floor }),
  setUserPosition: (pos) => set({ userPosition: pos }),
  
  triggerFlashEslTag: (tagId) => {
    const { flashingTimeoutId } = get();
    if (flashingTimeoutId) clearTimeout(flashingTimeoutId);
    
    set({ flashingEslTag: tagId });
    const timeout = setTimeout(() => {
      set({ flashingEslTag: null });
    }, 15000);
    set({ flashingTimeoutId: timeout });
  },
  
  openMiniMapDrawer: (itemName, shelfDetails, distanceTime, productId) => set({
    miniMapDrawer: {
      isOpen: true,
      itemName,
      shelfDetails,
      distanceTime,
      productId
    }
  }),
  
  closeMiniMapDrawer: () => set({
    miniMapDrawer: {
      isOpen: false,
      itemName: '',
      shelfDetails: '',
      distanceTime: ''
    }
  }),
  
  addToCart: (product, variant) => {
    const state = get();
    const activeVarId = state.activeVariantMap[product.id] || product.selectedVariantId;
    const chosenVariant = variant || product.variants.find(v => v.id === activeVarId) || product.variants[0];
    
    const existingIndex = state.cartItems.findIndex(i => i.product.id === product.id && i.variant.id === chosenVariant.id);
    if (existingIndex > -1) {
      const updated = [...state.cartItems];
      updated[existingIndex].quantity += 1;
      set({ cartItems: updated });
    } else {
      const newItem: CartShoppingItem = {
        product,
        variant: chosenVariant,
        quantity: 1,
        isCollected: false,
        sequenceOrder: state.cartItems.length + 1
      };
      set({ cartItems: [...state.cartItems, newItem] });
    }
  },
  
  removeFromCart: (productId) => {
    set(state => ({
      cartItems: state.cartItems.filter(i => i.product.id !== productId)
    }));
  },
  
  updateCartQuantity: (productId, delta) => {
    const state = get();
    const existing = state.cartItems.find(i => i.product.id === productId);
    if (!existing) return;
    
    const newQty = existing.quantity + delta;
    if (newQty <= 0) {
      set({ cartItems: state.cartItems.filter(i => i.product.id !== productId) });
    } else {
      set({
        cartItems: state.cartItems.map(i =>
          i.product.id === productId ? { ...i, quantity: newQty } : i
        )
      });
    }
  },
  
  toggleItemCollected: (productId) => {
    set(state => ({
      cartItems: state.cartItems.map(i => 
        i.product.id === productId ? { ...i, isCollected: !i.isCollected } : i
      )
    }));
  },
  
  setColdChainLock: (val) => set({ isColdChainLockEnabled: val }),
  
  openAssistant: () => set({ isAssistantOpen: true }),
  closeAssistant: () => set({ isAssistantOpen: false }),
  
  sendAssistantMessage: async (text) => {
    const userMsgId = 'u-' + Date.now();
    const newMessages = [...get().assistantMessages, { id: userMsgId, sender: 'user' as const, text }];
    set({ assistantMessages: newMessages });
    
    const fallbackAnswer = (queryText: string) => {
      const lower = queryText.toLowerCase();
      let reply = '';
      let targetProdId: string | undefined;

      if (lower.includes('colgate') || lower.includes('toothpaste') || lower.includes('brush')) {
        reply = 'Colgate MaxFresh Peppermint 150g is in Aisle 7, Shelf B (Eye Level, Bin 12). Today it has a 20% discount (₹115 instead of ₹145). Walking distance from your cart is ~45 meters.';
        targetProdId = 'prod-colgate-maxfresh';
      } else if (lower.includes('butter') || lower.includes('amul') || lower.includes('ghee')) {
        reply = 'Amul Pasteurised Butter 500g is at Dairy Chiller Vault 1, Shelf 1 (₹275). Amul Pure Ghee 1L Tin is right next to you at Aisle 4, Bay 2 (₹575, ₹65 FLAT OFF today!).';
        targetProdId = 'prod-amul-ghee';
      } else if (lower.includes('rice') || lower.includes('basmati')) {
        reply = 'India Gate Basmati Rice Classic 1kg is in Aisle 1, Shelf C, Bin 03 at ₹195 (Unit rate ₹19.50/100g). For maximum savings, the 5kg bag is ₹890 (₹17.80/100g).';
        targetProdId = 'prod-india-gate-rice';
      } else if (lower.includes('offer') || lower.includes('discount') || lower.includes('deal')) {
        reply = 'Today we have 42 active Electronic Shelf Deals! Highlight deals: Surf Excel 2L Liquid (35% OFF in Aisle 11), Colgate MaxFresh (20% OFF in Aisle 7), and Maggi 12-pack (18% OFF in Aisle 3).';
      } else if (lower.includes('baby') || lower.includes('diaper')) {
        reply = 'Baby diapers and care items are located in Aisle 12, Shelf B. Pampers All Round Protection (Medium 64s) has 15% OFF at ₹849.';
        targetProdId = 'prod-pampers-diapers';
      } else if (lower.includes('under 100') || lower.includes('under 150')) {
        reply = 'Under ₹150 top picks: Maggi 2-Min 6-Pack (₹78), Colgate MaxFresh 150g (₹115), Tata Salt 1kg (₹25), and Lay\'s 115g Party Pack (₹50).';
      } else {
        reply = `I found matching items in our Koramangala store inventory. Would you like me to plot turn-by-turn walking route from your current cart (#BC-882 at Aisle 4) or flash the physical shelf LED tag?`;
      }
      return { reply, targetProdId };
    };

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        if (data.reply) {
          set((state) => ({
            assistantMessages: [
              ...state.assistantMessages,
              {
                id: 'iris-' + Date.now(),
                sender: 'iris',
                text: data.reply,
                targetProductId: data.targetProductId
              }
            ]
          }));
          return;
        }
      }
    } catch {
      // Offline or server not responding, use fallback seamlessly
    }

    const { reply, targetProdId } = fallbackAnswer(text);
    set((state) => ({
      assistantMessages: [
        ...state.assistantMessages,
        {
          id: 'iris-' + Date.now(),
          sender: 'iris',
          text: reply,
          targetProductId: targetProdId
        }
      ]
    }));
  },
  
  setBarcodeScannerOpen: (open) => set({ isBarcodeScannerOpen: open }),
  setVoiceSearchOpen: (open) => set({ isVoiceSearchOpen: open }),
  setAisleStaffModalOpen: (open) => set({ isAisleStaffModalOpen: open }),
  setTripOptimizerModalOpen: (open) => set({ isTripOptimizerModalOpen: open })
}));
