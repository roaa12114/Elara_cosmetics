export const sellerStats = {
  totalRevenue: 47800, revenueChange: 12.4, grossRevenue: 52480, netRevenue: 44608,
  totalOrders: 692, ordersChange: 8.1, completedOrders: 574, avgOrderValue: 69.07,
  aovChange: 3.6, refundRate: 1.9, revenueGrowth: 23.5,
  activeProducts: 6, totalProducts: 8, pendingOrders: 1, lowStock: 5, outOfStock: 2,
  availableEarnings: 3240.0, pendingEarnings: 1180.0,
};

export const revenueTrend = [
  { day: 'Nov 1', value: 1240 }, { day: 'Nov 4', value: 1850 }, { day: 'Nov 7', value: 1620 },
  { day: 'Nov 10', value: 2100 }, { day: 'Nov 13', value: 1950 }, { day: 'Nov 16', value: 2480 },
  { day: 'Nov 19', value: 2200 }, { day: 'Nov 22', value: 2850 }, { day: 'Nov 25', value: 2600 },
  { day: 'Nov 28', value: 3120 },
];

export const yearlyRevenue = [
  { year: '2022', value: 198000 }, { year: '2023', value: 312000 }, { year: '2024', value: 400000 },
];

export const topProducts = [
  { name: 'Radiance Serum Foundation', revenue: 24397, units: 890, change: 18 },
  { name: 'Hydra-Glow Eye Cream', revenue: 21216, units: 720, change: 15 },
  { name: 'Baked Blush-On', revenue: 18750, units: 1240, change: 18 },
  { name: 'Matte Lipstick', revenue: 45000, units: 1240, change: 18 },
  { name: 'Studio Fix Fluid Foundation', revenue: 117600, units: 980, change: 12 },
  { name: "Prep + Prime Highlighter", revenue: 15200, units: 530, change: 8 },
];

export const categoryRevenue = [
  { name: 'Lips', revenue: 18164, percentage: 38 },
  { name: 'Face', revenue: 14818, percentage: 31 },
  { name: 'Eyes', revenue: 8604, percentage: 18 },
  { name: 'Skincare', revenue: 6214, percentage: 13 },
];

export const recentOrders = [
  { id: 'ORD-99201', customer: 'Sophia Laurent', product: 'Radiance Serum Foundation', amount: 31.8, status: 'Delivered' },
  { id: 'ORD-99198', customer: 'Emma Chen', product: 'Hydra-Glow Eye Cream', amount: 28.5, status: 'Shipped' },
  { id: 'ORD-99195', customer: 'Olivia Smith', product: 'Baked Blush-On', amount: 24.0, status: 'Processing' },
  { id: 'ORD-99192', customer: 'Ahmed Ali', product: 'Matte Lipstick', amount: 19.0, status: 'Pending' },
  { id: 'ORD-99188', customer: 'Maria Garcia', product: 'Studio Fix Fluid', amount: 45.0, status: 'Delivered' },
  { id: 'ORD-99185', customer: 'James Wilson', product: 'Prep + Prime Highlighter', amount: 22.0, status: 'Delivered' },
  { id: 'ORD-99182', customer: 'Fatma Salah', product: 'Radiance Serum Foundation', amount: 31.8, status: 'Cancelled' },
  { id: 'ORD-99178', customer: 'John Davis', product: 'Hydra-Glow Eye Cream', amount: 28.5, status: 'Delivered' },
];

export const activityFeed = [
  { type: 'order', text: 'Order #ORD-99201 was completed', time: '2 min ago' },
  { type: 'seller', text: 'Seller "Glamour Inc." was approved', time: '1 hour ago' },
  { type: 'user', text: 'New user "David K." registered', time: '3 hours ago' },
  { type: 'return', text: 'Return request for order #ORD-99175', time: '5 hours ago' },
  { type: 'dispute', text: 'Dispute #DSP-001 was opened', time: '1 day ago' },
];

export const lowStockAlerts = [
  { name: 'Matte Lipstick', sku: 'ML-001', stock: 3, status: 'Low stock' },
  { name: 'Baked Blush-On', sku: 'BB-002', stock: 0, status: 'Out of stock' },
  { name: 'Hydra-Glow Eye Cream', sku: 'HG-003', stock: 2, status: 'Low stock' },
  { name: 'Radiance Serum', sku: 'RS-004', stock: 15, status: 'In stock' },
  { name: 'Studio Fix Fluid', sku: 'SF-005', stock: 0, status: 'Out of stock' },
];

export const payouts = [
  { id: 'PO-2024-011', date: 'Nov 15, 2024', amount: 3240.0, method: 'Bank Transfer •• 4521', status: 'Completed' },
  { id: 'PO-2024-010', date: 'Oct 15, 2024', amount: 2890.5, method: 'Bank Transfer •• 4521', status: 'Completed' },
  { id: 'PO-2024-009', date: 'Sep 15, 2024', amount: 3120.75, method: 'Bank Transfer •• 4521', status: 'Completed' },
  { id: 'PO-2024-008', date: 'Aug 15, 2024', amount: 2650.25, method: 'Bank Transfer •• 4521', status: 'Completed' },
  { id: 'PO-2024-012', date: 'Dec 15, 2024', amount: 1180.0, method: 'Bank Transfer •• 4521', status: 'Pending' },
];

export const sellerPromotions = [
  { code: 'WELCOME20', type: 'Percentage', value: '20% off', uses: 142, status: 'Active', expiresAt: 'Dec 31, 2024' },
  { code: 'SUMMER15', type: 'Percentage', value: '15% off', uses: 89, status: 'Active', expiresAt: 'Sep 30, 2024' },
  { code: 'FLASH10', type: 'Percentage', value: '10% off', uses: 234, status: 'Expired', expiresAt: 'Aug 31, 2024' },
  { code: 'FREESHIP', type: 'Free Shipping', value: 'Free delivery', uses: 67, status: 'Active', expiresAt: 'Jan 31, 2025' },
];