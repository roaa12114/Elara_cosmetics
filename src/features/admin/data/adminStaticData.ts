export const adminStats = {
  totalRevenue: 47800, revenueChange: 12.4,
  totalOrders: 692, ordersChange: 8.1,
  totalCustomers: 8921, customersChange: 18.4,
  totalSellers: 342, sellersChange: 5.2,
};

export const adminRevenueTrend = [
  { day: 'Nov 1', value: 1240 }, { day: 'Nov 4', value: 1850 }, { day: 'Nov 7', value: 1620 },
  { day: 'Nov 10', value: 2100 }, { day: 'Nov 13', value: 1950 }, { day: 'Nov 16', value: 2480 },
  { day: 'Nov 19', value: 2200 }, { day: 'Nov 22', value: 2850 }, { day: 'Nov 25', value: 2600 },
  { day: 'Nov 28', value: 3120 },
];

export const adminRecentCustomers = [
  { name: 'Sarah Jenkins', email: 'sarah.j@elaramember.com', date: 'Oct 24, 2026', status: 'Active' },
  { name: 'Emma Chen', email: 'emma.c@email.com', date: 'Oct 23, 2026', status: 'Active' },
  { name: 'Tariq Mahmood', email: 'tariq.m@email.com', date: 'Oct 22, 2026', status: 'Pending' },
  { name: 'Clara Oswald', email: 'clara.o@email.com', date: 'Oct 21, 2026', status: 'Blocked' },
  { name: 'David Kim', email: 'david.k@email.com', date: 'Oct 20, 2026', status: 'Active' },
];

export const adminRecentOrders = [
  { id: 'ORD-99201', customer: 'Sophia Laurent', product: 'MAC Baked Blush-On', amount: 200, status: 'Delivered' },
  { id: 'ORD-99198', customer: 'Emma Chen', product: 'Studio Fix Fluid', amount: 200, status: 'Cancelled' },
  { id: 'ORD-99195', customer: 'Olivia Smith', product: 'Baked Blush-On', amount: 200, status: 'Delivered' },
  { id: 'ORD-99192', customer: 'Ahmed Ali', product: 'Matte Lipstick', amount: 200, status: 'Processing' },
  { id: 'ORD-99188', customer: 'Maria Garcia', product: 'Prep + Prime', amount: 200, status: 'Delivered' },
];

export const adminTopProducts = [
  { name: 'Baked Blush-On', revenue: 64400, units: 760, change: 9 },
  { name: 'Matte Lipstick', revenue: 45000, units: 1240, change: 18 },
  { name: 'Studio Fix Fluid', revenue: 117600, units: 980, change: 12 },
  { name: 'Prep + Prime Highlighter', revenue: 15200, units: 530, change: 8 },
];

export const adminLowStock = [
  { name: 'Matte Lipstick', stock: 12, status: 'Low stock' },
  { name: 'Baked Blush-On', stock: 0, status: 'Out of stock' },
  { name: 'Hydra-Glow Eye Cream', stock: 2, status: 'Low stock' },
];

export const adminRecentSellers = [
  { name: 'Glamour Inc.', email: 'glamour@email.com', date: 'Oct 23, 2026', status: 'Approved' },
  { name: 'Beauty Box Co.', email: 'beautybox@email.com', date: 'Oct 22, 2026', status: 'Pending' },
  { name: 'Lumière Cosmetics', email: 'lumiere@email.com', date: 'Oct 21, 2026', status: 'Approved' },
];

export const adminPendingItems = [
  { type: 'Seller Approval', text: 'Glamour Inc. requesting seller approval', action: 'Approve' },
  { type: 'Return Request', text: 'Return request for ORD-99175 (Matte Lipstick)', action: 'Review' },
  { type: 'Dispute', text: 'Dispute #DSP-001 opened by Sophia Laurent', action: 'Review' },
];

export const adminCustomerStats = {
  total: 24815, active: 22410, newThisMonth: 1240, blocked: 165,
};

export const adminCustomerDetail = {
  name: 'Sarah Jenkins', email: 'sarah.j@elaramember.com', phone: '+1 (555) 0192',
  status: 'Active', registeredDate: 'Oct 12, 2021', id: 'CUS-2023-1842',
  address: { street: '9021 Broadway Street, Suite 400', city: 'Los Angeles', state: 'California', zip: '90015', country: 'United States' },
  preferences: ['Email Promos', 'VIP Tier'],
  stats: { totalOrders: 42, totalOrdersChange: 15, totalSpent: 2480.50, totalSpentChange: 22, avgOrder: 59.05, avgOrderChange: 5, lastOrder: 'Oct 24, 2026' },
  orders: [
    { id: 'EL-9041', date: '24 Oct 2026', items: 3, amount: 245.00, payment: 'Visa **** 4242', status: 'Delivered' },
    { id: 'EL-8890', date: '23 Oct 2026', items: 1, amount: 89.50, payment: 'Apple Pay', status: 'Cancelled' },
    { id: 'EL-8761', date: '24 Oct 2026', items: 5, amount: 1120.00, payment: 'Visa **** 4242', status: 'Delivered' },
    { id: 'EL-8540', date: '22 Oct 2026', items: 2, amount: 340.00, payment: 'PayPal', status: 'Processing' },
  ],
};

export const adminOrderDetail = {
  id: '12345', date: 'Oct 12, 2024', payment: 'Visa **** 4242', status: 'Processing',
  customer: { name: 'Sophia Martinez', email: 'sophia.m@gmail.com', phone: '+1 (555) 321-7890' },
  shipping: { address: 'San Francisco, CA, USA', tracking: 'EL-992384-US' },
  items: [
    { name: 'Baked Blush-On', category: 'Makeup', qty: 1, price: 89.00 },
    { name: 'Matte Lipstick', category: 'Makeup', qty: 2, price: 24.00 },
    { name: 'Gentle Foaming Cleanser', category: 'Skincare', qty: 1, price: 36.00 },
  ],
  subtotal: 173.00, shippingCost: 12.00, tax: 14.50, discount: 15.00, discountCode: 'PROMO10', total: 184.50,
  timeline: [
    { step: 'Placed', date: 'Oct 12', complete: true },
    { step: 'Paid', date: 'Oct 12', complete: true },
    { step: 'Processing', date: 'Oct 13', complete: true },
    { step: 'To Ship', date: '', complete: false },
    { step: 'To Deliver', date: '', complete: false },
  ],
};