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
  { code: 'WELCOME20', type: 'Percentage', value: '20%', uses: 42, limit: 100, status: 'Active', expiresAt: 'Dec 31, 2024' },
  { code: 'SUMMER15', type: 'Percentage', value: '15%', uses: 89, limit: 200, status: 'Active', expiresAt: 'Sep 30, 2024' },
  { code: 'FLASH10', type: 'Fixed', value: '$10', uses: 234, limit: 500, status: 'Expired', expiresAt: 'Aug 31, 2024' },
  { code: 'FREESHIP', type: 'Fixed', value: 'Free Ship', uses: 67, limit: 1000, status: 'Active', expiresAt: 'Jan 31, 2025' },
  { code: 'MAKEUP25', type: 'Percentage', value: '25%', uses: 12, limit: 50, status: 'Scheduled', expiresAt: 'Oct 31, 2026' },
  { code: 'SAVE5', type: 'Fixed', value: '$5', uses: 0, limit: 100, status: 'Scheduled', expiresAt: 'Nov 30, 2026' },
];

export const promoCodeDetail = {
  code: 'WELCOME20', status: 'Active', valueLabel: '20% OFF',
  startDate: 'Sep 1, 2026', endDate: 'Sep 15, 2026',
  stats: { totalUses: 42, usesChange: 12.6, remaining: 58, remainingChange: 8.1, orders: 3, ordersChange: 8.1, totalDiscount: 630, discountChange: 8.1 },
  details: { discount: '20%', minOrder: '$50', maxDiscount: '$30', usageLimit: 100, perCustomer: 1, appliesTo: 'Skincare', expiresAt: 'Sep 8, 2026' },
  usageOverTime: [
    { day: 'Nov 1', value: 2 }, { day: 'Nov 4', value: 4 }, { day: 'Nov 7', value: 3 },
    { day: 'Nov 10', value: 6 }, { day: 'Nov 13', value: 5 }, { day: 'Nov 16', value: 8 },
    { day: 'Nov 19', value: 6 }, { day: 'Nov 22', value: 9 }, { day: 'Nov 25', value: 7 },
    { day: 'Nov 28', value: 10 },
  ],
  products: [
    { name: 'Vitamin C Serum', originalPrice: 30, discountedPrice: 24 },
    { name: 'Hyaluronic Acid Moisturizer', originalPrice: 45, discountedPrice: 36 },
    { name: 'Gentle Foaming Cleanser', originalPrice: 22, discountedPrice: 17.60 },
    { name: 'Retinol Night Cream', originalPrice: 55, discountedPrice: 44 },
  ],
};

export const sellerOrderStats = {
  pending: 1, shipped: 1, cancelled: 2, processing: 1, delivered: 3,
};

export const sellerOrders = [
  { id: 'ORD-9821', customer: 'Sophia Laurent', date: 'Oct 12, 2024', product: 'Velvet Matte Lipstick', total: 31.80, payment: 'Paid', status: 'Delivered' },
  { id: 'ORD-9820', customer: 'Emma Chen', date: 'Oct 11, 2024', product: 'Hydra-Glow Eye Cream', total: 71.80, payment: 'Paid', status: 'Shipped' },
  { id: 'ORD-9819', customer: 'Aisha Kamara', date: 'Oct 10, 2024', product: 'Glossy Lip Oil', total: 47.80, payment: 'Paid', status: 'Processing' },
  { id: 'ORD-9818', customer: 'Mia Rossi', date: 'Oct 9, 2024', product: 'Rose Quartz Highlighter', total: 37.80, payment: 'Paid', status: 'Pending' },
  { id: 'ORD-9817', customer: 'Zoe Nakamura', date: 'Oct 8, 2024', product: 'Radiance Serum Foundation', total: 50.60, payment: 'Paid', status: 'Delivered' },
  { id: 'ORD-9816', customer: 'Liam Murphy', date: 'Oct 7, 2024', product: 'Satin Blush Duo', total: 29.80, payment: 'Refunded', status: 'Cancelled' },
  { id: 'ORD-9815', customer: 'Olivia Smith', date: 'Oct 6, 2024', product: 'Precision Liner Pen', total: 19.00, payment: 'Refunded', status: 'Cancelled' },
];

export const sellerOrderDetail = {
  id: 'ORD-9821', date: 'Oct 12, 2024, 14:32', status: 'Delivered', payment: 'Paid',
  customer: { name: 'Sophia Laurent', address: '14 Rue de Rivoli, Paris 75001, France', phone: '+44 7700 900123' },
  items: [{ name: 'Velvet Matte Lipstick', sku: 'LIP-VML-001', quantity: 1, price: 28.00 }],
  subtotal: 28.00, shipping: 3.80, platformFee: 2.24, total: 31.80,
  timeline: [
    { step: 'Pending', date: 'Oct 12, 2024', complete: true },
    { step: 'Confirmed', date: 'Oct 12, 2024', complete: true },
    { step: 'Processing', date: 'Oct 13, 2024', complete: true },
    { step: 'Shipped', date: 'Oct 15, 2024', complete: true },
    { step: 'Out for Delivery', date: 'Nov 27, 2024', complete: true },
    { step: 'Delivered', date: 'Nov 28, 2024', complete: true },
  ],
  carrier: 'DHL Express', trackingNumber: 'JD014600006251478663',
};

export const earningsStats = {
  totalEarnings: 547.00, netEarnings: 505.38, withdrawn: 9780.75, pending: 110.64, platformFee: 34.42,
};

export const monthlyEarnings = [
  { month: 'Jun', gross: 82, net: 75 }, { month: 'Jul', gross: 95, net: 88 },
  { month: 'Aug', gross: 110, net: 102 }, { month: 'Sep', gross: 88, net: 81 },
  { month: 'Oct', gross: 125, net: 116 }, { month: 'Nov', gross: 147, net: 136 },
];

export const netEarningsTrend = [
  { month: 'Jun', value: 24140 }, { month: 'Jul', value: 28200 }, { month: 'Aug', value: 32800 },
  { month: 'Sep', value: 26100 }, { month: 'Oct', value: 37200 }, { month: 'Nov', value: 43600 },
];

export const transactions = [
  { id: 'TXN-4821', date: 'Nov 28, 2024', order: 'ORD-9821', description: 'Velvet Matte Lipstick ×1', gross: 66.36, fee: 3.32, net: 63.04, type: 'Sale', status: 'Pending' },
  { id: 'TXN-4820', date: 'Nov 27, 2024', order: 'ORD-9820', description: 'Hydra-Glow Eye Cream ×1', gross: 44.28, fee: 2.21, net: 42.07, type: 'Sale', status: 'Pending' },
  { id: 'TXN-4819', date: 'Nov 25, 2024', order: 'ORD-9819', description: 'Glossy Lip Oil ×2', gross: 35.08, fee: 1.75, net: 33.33, type: 'Sale', status: 'Completed' },
  { id: 'TXN-4818', date: 'Nov 23, 2024', order: 'ORD-9818', description: 'Rose Quartz Highlighter ×1', gross: 46.86, fee: 2.34, net: 44.52, type: 'Sale', status: 'Completed' },
  { id: 'TXN-4817', date: 'Nov 20, 2024', order: 'ORD-9817', description: 'Radiance Serum Foundation ×1 (Refund)', gross: -66.36, fee: 0, net: -66.36, type: 'Refund', status: 'Completed' },
];

export const discountStats = {
  total: 12, active: 5, scheduled: 3, expired: 4,
};

export const discounts = [
  { id: 'DISC-001', name: 'Summer Sale', type: 'Percentage', value: '25%', category: 'All Products', startDate: 'Jun 1, 2026', endDate: 'Jun 30, 2026', status: 'Active' },
  { id: 'DISC-002', name: 'Makeup Deal', type: 'Percentage', value: '15%', category: 'Makeup', startDate: 'Jul 1, 2026', endDate: 'Jul 15, 2026', status: 'Expired' },
  { id: 'DISC-003', name: 'Clearance', type: 'Fixed', value: '$10', category: 'Skincare', startDate: 'Aug 1, 2026', endDate: 'Aug 31, 2026', status: 'Expired' },
  { id: 'DISC-004', name: 'Clearance', type: 'Fixed', value: '$10', category: 'Eyes', startDate: 'Aug 1, 2026', endDate: 'Aug 31, 2026', status: 'Expired' },
  { id: 'DISC-005', name: 'Summer Skincare Sale', type: 'Percentage', value: '20%', category: 'Skincare', startDate: 'Sep 1, 2026', endDate: 'Sep 15, 2026', status: 'Active' },
  { id: 'DISC-006', name: '40% Makeup', type: 'Fixed', value: '$15', category: 'Makeup', startDate: 'Sep 1, 2026', endDate: 'Sep 30, 2026', status: 'Active' },
  { id: 'DISC-007', name: 'Korean Beauty Week', type: 'Percentage', value: '30%', category: 'Korean Beauty', startDate: 'Oct 1, 2026', endDate: 'Oct 7, 2026', status: 'Scheduled' },
  { id: 'DISC-008', name: 'Black Friday', type: 'Percentage', value: '40%', category: 'All Products', startDate: 'Nov 25, 2026', endDate: 'Nov 30, 2026', status: 'Scheduled' },
];

export const discountDetail = {
  id: 'DISC-005', name: 'Summer Skincare Sale', type: 'Percentage', value: 20, valueLabel: '20% OFF',
  category: 'Skincare', status: 'Active', startDate: 'Sep 1, 2026', endDate: 'Sep 15, 2026',
  products: [
    { name: 'Vitamin C Serum', originalPrice: 30, discountedPrice: 24 },
    { name: 'Hyaluronic Acid Moisturizer', originalPrice: 45, discountedPrice: 36 },
    { name: 'Gentle Foaming Cleanser', originalPrice: 22, discountedPrice: 17.60 },
    { name: 'Retinol Night Cream', originalPrice: 55, discountedPrice: 44 },
  ],
};
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