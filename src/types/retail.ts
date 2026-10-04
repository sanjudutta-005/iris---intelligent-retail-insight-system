export interface ProductVariant {
  id: string;
  size: string;
  unit: string; // e.g. 'g', 'ml', 'kg', 'pack'
  price: number;
  originalPrice: number;
  discountPercent?: number;
  unitPriceText: string; // e.g. '₹76.67 / 100g'
  unitCostValue: number; // for comparison charts
  stock: number;
  shelfBin: string; // e.g. 'Shelf B • Bin 12'
  inStock: boolean;
  isBestValue?: boolean;
}

export interface ProductLocation {
  floor: number; // 1 or 2
  floorName: string; // 'Ground Floor' | 'L1: Fashion & Home'
  aisle: string; // e.g. 'A7'
  aisleName: string; // e.g. 'Oral Care & Hygiene'
  shelf: string; // 'Shelf B'
  tier: string; // 'Eye Level' | 'Top Deck' | 'Lower Level' | 'Endcap'
  bin: string; // 'Bin 12'
  bay: string; // 'Bay 03'
  distanceMeters: number; // e.g. 45
  walkingTimeText: string; // e.g. '~1 min'
  // 2D Floor map coordinates in SVG 1000x660 space
  x: number;
  y: number;
  eslTagId: string; // Electronic Shelf Label ID, e.g. 'ESL #TG-882'
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  department: string;
  description: string;
  image: string;
  rating: number;
  reviewCount: number;
  variants: ProductVariant[];
  selectedVariantId: string;
  location: ProductLocation;
  hasOffer: boolean;
  offerBadge?: string;
  offerExpires?: string;
  outOfStock?: boolean;
  alternativeProduct?: {
    id: string;
    name: string;
    price: number;
    locationText: string;
    distanceText: string;
  };
  pairedProducts?: {
    id: string;
    name: string;
    price: number;
    relation: string; // 'Same Rack' | '1 Bay Over'
    image: string;
  }[];
}

export interface StoreOffer {
  id: string;
  productId: string;
  title: string;
  subtitle: string;
  image: string;
  category: string;
  discountPercent: number;
  discountBadge: string;
  originalPrice: number;
  offerPrice: number;
  unitRateText: string;
  savingsText: string;
  stockText: string;
  validUntil: string;
  aisle: string;
  shelf: string;
  bay: string;
  distanceMeters: number;
  isFlashDeal?: boolean;
  isMegaDeal?: boolean;
  isBogo?: boolean;
  endsInText?: string;
  tagId: string;
}

export interface StoreAisle {
  id: string;
  code: string; // 'A1', 'A2', ...
  name: string;
  category: string;
  department: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color?: string;
  itemsCount: number;
}

export interface StoreInfo {
  name: string;
  locationName: string;
  hub: string;
  city: string;
  floors: string;
  statusText: string;
  hours: string;
  crowdLevel: string; // 'Moderate (34%)'
  beaconGridStatus: string; // 'Aisles 1–24 Online'
  currentCartId: string; // '#BC-882'
  currentCartLocation: string; // 'Aisle 4, Bay 2'
  currentCartCoordinates: { x: number; y: number };
}

export interface WayfindingStep {
  stepNumber: number;
  instruction: string;
  subtext: string;
  icon: string;
  distanceMeters: number;
  turnDirection?: 'straight' | 'left' | 'right' | 'arrived';
}

export interface CartShoppingItem {
  product: Product;
  variant: ProductVariant;
  quantity: number;
  isCollected: boolean;
  sequenceOrder: number;
}
