// ===== Admin Analytics static data =====
// The backend has NO analytics endpoints. All stats, charts, and tables
// on this page are mock data defined here.

export const analyticsStats = {
  totalRevenue: 47800,
  revenueChange: 12.4,
  totalOrders: 692,
  ordersChange: 8.1,
  totalCustomers: 8921,
  customersChange: 8.1,
  avgOrderValue: 19.69,
  avgOrderChange: 12.5,
};

export const analyticsRevenueTrend = [
  { day: 'Nov 1', value: 1240 }, { day: 'Nov 4', value: 1850 }, { day: 'Nov 7', value: 1620 },
  { day: 'Nov 10', value: 2100 }, { day: 'Nov 13', value: 1950 }, { day: 'Nov 16', value: 2480 },
  { day: 'Nov 19', value: 2200 }, { day: 'Nov 22', value: 2850 }, { day: 'Nov 25', value: 2600 },
  { day: 'Nov 28', value: 3120 },
];

export interface CategorySlice {
  name: string;
  percentage: number;
  color: string;
}

export const analyticsCategorySales: CategorySlice[] = [
  { name: 'Makeup', percentage: 45, color: '#C06478' },
  { name: 'Skincare', percentage: 35, color: '#E8B4BC' },
  { name: 'Korean Beauty', percentage: 20, color: '#F4D8DC' },
];

export const analyticsCategoryTotal = 24580;

export interface TopProduct {
  name: string;
  units: number;
}

export const analyticsTopProducts: TopProduct[] = [
  { name: 'Moisturizing Essence', units: 245 },
  { name: 'Matte Lipstick', units: 190 },
  { name: 'Sunscreen SPF 50', units: 165 },
  { name: 'Face Cream', units: 10 },
];

export interface OrderStatusSlice {
  name: string;
  count: number;
  color: string;
}

export const analyticsOrderStatuses: OrderStatusSlice[] = [
  { name: 'Delivered', count: 982, color: '#22C55E' },
  { name: 'Shipped', count: 156, color: '#3B82F6' },
  { name: 'Processing', count: 86, color: '#F59E0B' },
  { name: 'Pending', count: 64, color: '#EAB308' },
  { name: 'Cancelled', count: 56, color: '#EF4444' },
];

export const analyticsTotalOrders = 1248;

export const analyticsCustomerGrowth = [
  { month: 'Jan', value: 200 }, { month: 'Feb', value: 240 }, { month: 'Mar', value: 280 },
  { month: 'Apr', value: 300 }, { month: 'May', value: 320 }, { month: 'Jun', value: 350 },
  { month: 'Jul', value: 380 }, { month: 'Aug', value: 400 },
];

export interface LowStockItem {
  name: string;
  sku: string;
  stock: number;
  threshold: number;
}

export const analyticsLowStock: LowStockItem[] = [
  { name: 'Matte Lipstick', sku: 'LIP-001', stock: 12, threshold: 20 },
  { name: 'Foundation', sku: 'FDN-042', stock: 8, threshold: 15 },
  { name: 'Highlighter', sku: 'HIL-018', stock: 5, threshold: 10 },
];