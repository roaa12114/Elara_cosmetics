
export interface AdminSubcategory {
  _id: string;
  name: string;
  productsCount: number;
  isActive: boolean;
  createdAt: string;
}

function hashId(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) | 0;
  return Math.abs(h);
}

const PRODUCT_COUNTS = [96, 70, 83, 124, 48, 112, 65, 89];
export function getProductsCountForCategory(id: string): number {
  return PRODUCT_COUNTS[hashId(id) % PRODUCT_COUNTS.length];
}

const SUBCATEGORY_POOLS: AdminSubcategory[][] = [
  [
    { _id: 'sub-face', name: 'Face Makeup', productsCount: 96, isActive: true, createdAt: 'Sep 8, 2026' },
    { _id: 'sub-eye', name: 'Eye Makeup', productsCount: 70, isActive: false, createdAt: 'Sep 8, 2026' },
    { _id: 'sub-lip', name: 'Lip Makeup', productsCount: 83, isActive: false, createdAt: 'Sep 8, 2026' },
    { _id: 'sub-tools', name: 'Makeup Tools', productsCount: 83, isActive: true, createdAt: 'Sep 8, 2026' },
    { _id: 'sub-cheeks', name: 'Cheeks', productsCount: 83, isActive: true, createdAt: 'Sep 8, 2026' },
    { _id: 'sub-brushes', name: 'Brushes', productsCount: 83, isActive: true, createdAt: 'Sep 8, 2026' },
    { _id: 'sub-skin-makeup', name: 'Skin Makeup', productsCount: 83, isActive: true, createdAt: 'Sep 8, 2026' },
  ],
  // Pool 1 — Skincare-style
  [
    { _id: 'sub-cleansers', name: 'Cleansers', productsCount: 45, isActive: true, createdAt: 'Sep 8, 2026' },
    { _id: 'sub-moisturizers', name: 'Moisturizers', productsCount: 52, isActive: true, createdAt: 'Sep 8, 2026' },
    { _id: 'sub-serums', name: 'Serums & Treatments', productsCount: 38, isActive: true, createdAt: 'Sep 8, 2026' },
    { _id: 'sub-masks', name: 'Masks & Peels', productsCount: 24, isActive: false, createdAt: 'Sep 8, 2026' },
    { _id: 'sub-sunscreen', name: 'Sun Protection', productsCount: 31, isActive: true, createdAt: 'Sep 8, 2026' },
  ],
  // Pool 2 — Korean beauty-style
  [
    { _id: 'sub-k-cleansing', name: 'Cleansing Oils & Balms', productsCount: 42, isActive: true, createdAt: 'Sep 8, 2026' },
    { _id: 'sub-k-essence', name: 'Essences & Toners', productsCount: 56, isActive: true, createdAt: 'Sep 8, 2026' },
    { _id: 'sub-k-sheet-masks', name: 'Sheet Masks', productsCount: 78, isActive: true, createdAt: 'Sep 8, 2026' },
    { _id: 'sub-k-cream', name: 'Korean Creams', productsCount: 34, isActive: false, createdAt: 'Sep 8, 2026' },
    { _id: 'sub-k-sunscreen', name: 'Korean Sunscreens', productsCount: 41, isActive: true, createdAt: 'Sep 8, 2026' },
  ],
];

export function getSubcategoriesForCategory(id: string): AdminSubcategory[] {
  return SUBCATEGORY_POOLS[hashId(id) % SUBCATEGORY_POOLS.length];
}

export function getSubcategoriesCountForCategory(id: string): number {
  return getSubcategoriesForCategory(id).length;
}