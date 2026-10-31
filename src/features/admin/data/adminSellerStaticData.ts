export const sellerBlockReasons = [
  'Fraudulent activity or suspicious transactions',
  'Customer complaints',
  'Terms of service violation',
  'Counterfeit goods',
  'Other',
];

export const sellerRejectReasons = [
  'Incomplete documents',
  'Invalid business license',
  'Platform policy violation',
  'Duplicate seller account',
  'Other',
];

export const sellerUnblockConditions = [
  'Violation resolved',
  'Platform policies acknowledged',
  'No further complaints',
  'Seller contacted and issue resolved',
];

export interface SellerCatalogRow {
  name: string;
  price: number;
  stock: number;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
}

export interface SellerVerificationDoc {
  name: string;
  size: string;
}

export interface SellerStats {
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  totalPayouts: number;
}

export interface AdminSellerProfile {
  storeName: string;
  businessType: string;
  storeDescription?: string;
  specialty?: string;
  registeredEntity?: string;
  applicantTitle?: string;
  applicantAddress?: string;
  applicationId: string;
  applicationDate: string;
  approvedBy?: string;
  approvedDate?: string;
  reviewNotes?: string;
  verificationDocuments: SellerVerificationDoc[];
  stats?: SellerStats;
  catalog?: SellerCatalogRow[];
  blockReason?: string;
  blockedBy?: string;
  blockedDate?: string;
}

function pickProfile<T>(id: string, pool: T[]): T {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) | 0;
  return pool[Math.abs(h) % pool.length];
}

export const sellerProfiles: AdminSellerProfile[] = [
  {
    storeName: 'Rosy Threads',
    businessType: 'Sole Proprietorship',
    storeDescription: 'Premium skincare cosmetics line and luxury beauty accessories for everyday radiance.',
    specialty: 'Skincare & Cosmetics',
    applicantTitle: 'Founder & CEO',
    applicantAddress: 'Portland, Oregon',
    applicationId: '#APP-2024-41',
    applicationDate: 'Jan 15, 2024',
    approvedBy: 'Sarah Jenkins',
    approvedDate: 'Jan 18, 2024',
    reviewNotes: 'Documents verified and authentic. Approved.',
    verificationDocuments: [
      { name: 'business_license_oregon.pdf', size: '1.4 MB' },
      { name: 'tax_id_ein_form.pdf', size: '920 KB' },
    ],
    stats: { totalProducts: 32, totalOrders: 480, totalRevenue: 12450, totalPayouts: 9832 },
    catalog: [
      { name: 'Baked Blush-On', price: 48, stock: 124, status: 'In Stock' },
      { name: 'Matte Lipstick', price: 24, stock: 89, status: 'In Stock' },
      { name: 'Hydra-Glow Serum', price: 65, stock: 8, status: 'Low Stock' },
    ],
  },
  {
    storeName: 'Coquette Vintage',
    businessType: 'Sole Proprietorship',
    storeDescription: 'Curated vintage clothing and accessories.',
    specialty: 'Vintage Fashion',
    applicantTitle: 'Owner',
    applicantAddress: 'Brooklyn, New York',
    applicationId: '#APP-2023-203',
    applicationDate: 'Oct 24, 2023',
    verificationDocuments: [
      { name: 'trade_license_2022.pdf', size: '1.1 MB' },
      { name: 'id_scan.pdf', size: '640 KB' },
    ],
    stats: { totalProducts: 18, totalOrders: 92, totalRevenue: 4200, totalPayouts: 3100 },
    catalog: [
      { name: 'Vintage Silk Scarf', price: 85, stock: 12, status: 'In Stock' },
      { name: 'Retro Handbag', price: 120, stock: 0, status: 'Out of Stock' },
    ],
    blockReason: 'Fraudulent activity or suspicious transactions',
    blockedBy: 'Sarah Jenkins',
    blockedDate: 'Jan 15, 2024',
  },
  {
    storeName: 'Thorne Woodworks',
    businessType: 'LLC',
    storeDescription: 'Handcrafted Oregon hardwood furniture made to last generations.',
    specialty: 'Handcrafted Home Decor',
    registeredEntity: 'Thorne Woodworks LLC',
    applicantTitle: 'Lead Artisan & Founder',
    applicantAddress: 'Bend, Oregon',
    applicationId: '#APP-2023-88',
    applicationDate: 'Oct 12, 2023',
    approvedBy: 'Sarah Jenkins',
    approvedDate: 'Oct 15, 2023',
    reviewNotes: 'Documents verified. Business license and tax ID confirmed with state registry.',
    verificationDocuments: [
      { name: 'business_license_oregon.pdf', size: '1.4 MB' },
      { name: 'tax_id_ein_form.pdf', size: '920 KB' },
    ],
    stats: { totalProducts: 24, totalOrders: 156, totalRevenue: 28900, totalPayouts: 22100 },
    catalog: [
      { name: 'Walnut Coffee Table', price: 1200, stock: 5, status: 'In Stock' },
      { name: 'Oak Dining Chair', price: 380, stock: 18, status: 'In Stock' },
      { name: 'Maple Bookshelf', price: 940, stock: 3, status: 'Low Stock' },
    ],
  },
  {
    storeName: 'Aura Crafts',
    businessType: 'Sole Proprietorship',
    storeDescription: 'Handmade ceramics and artisan home goods.',
    specialty: 'Handmade Ceramics',
    applicantTitle: 'Founder',
    applicantAddress: 'Asheville, North Carolina',
    applicationId: '#APP-2023-156',
    applicationDate: 'Oct 5, 2023',
    approvedBy: 'Sarah Jenkins',
    approvedDate: 'Oct 8, 2023',
    reviewNotes: 'All documents in order.',
    verificationDocuments: [
      { name: 'business_license_nc.pdf', size: '1.2 MB' },
      { name: 'tax_id.pdf', size: '780 KB' },
    ],
    stats: { totalProducts: 48, totalOrders: 1240, totalRevenue: 18450, totalPayouts: 14832 },
    catalog: [
      { name: 'Baked Blush-On', price: 48, stock: 124, status: 'In Stock' },
      { name: 'Matte Lipstick', price: 24, stock: 89, status: 'In Stock' },
      { name: 'Studio Fix Fluid', price: 85, stock: 42, status: 'Low Stock' },
      { name: 'Ceramic Vase', price: 32, stock: 0, status: 'Out of Stock' },
    ],
  },
  {
    storeName: 'Thorne Woodworks',
    businessType: 'LLC',
    storeDescription: 'Handcrafted Oregon hardwood furniture.',
    specialty: 'Handcrafted Home Decor',
    registeredEntity: 'Thorne Woodworks LLC',
    applicantTitle: 'Co-Founder',
    applicantAddress: 'Eugene, Oregon',
    applicationId: '#APP-2023-72',
    applicationDate: 'Sep 1, 2023',
    verificationDocuments: [
      { name: 'business_license_oregon.pdf', size: '1.4 MB' },
      { name: 'tax_id_ein_form.pdf', size: '920 KB' },
    ],
    stats: { totalProducts: 20, totalOrders: 110, totalRevenue: 19800, totalPayouts: 15400 },
    catalog: [
      { name: 'Oak Desk', price: 1450, stock: 4, status: 'In Stock' },
      { name: 'Walnut Chair', price: 420, stock: 12, status: 'In Stock' },
    ],
    blockReason: 'Terms of service violation',
    blockedBy: 'Sarah Jenkins',
    blockedDate: 'Sep 18, 2023',
  },
];

export function getSellerProfile(id: string): AdminSellerProfile {
  return pickProfile(id, sellerProfiles);
}