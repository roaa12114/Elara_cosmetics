export type OrderStatus = 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'pending';
export type PaymentStatus = 'Paid' | 'Pending' | 'Failed' | 'Refunded';

export const STATUS_DISPLAY: Record<OrderStatus, string> = {
  processing: 'Processing',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
  pending: 'Pending',
};

export const ALL_STATUSES: OrderStatus[] = ['processing', 'shipped', 'delivered', 'cancelled', 'pending'];

export interface AdminOrderRow {
  _id: string;
  orderId: string;
  customerName: string;
  customerEmail: string;
  itemsCount: number;
  total: number;
  paymentStatus: PaymentStatus;
  paymentMethod: string;
  date: string;
  status: OrderStatus;
}

export interface AdminOrderItem {
  name: string;
  category: string;
  qty: number;
  price: number;
}

export interface AdminOrderTimelineStep {
  step: string;
  date: string;
  complete: boolean;
}

export interface AdminOrderDetail {
  _id: string;
  orderId: string;
  date: string;
  paymentMethod: string;
  paymentStatus: PaymentStatus;
  status: OrderStatus;
  customer: { name: string; email: string; phone: string };
  shipping: { address: string; tracking: string };
  items: AdminOrderItem[];
  subtotal: number;
  shippingCost: number;
  tax: number;
  discount: number;
  discountCode: string;
  total: number;
  timeline: AdminOrderTimelineStep[];
}

export const mockOrders: AdminOrderRow[] = [
  { _id: 'ord-12345', orderId: '#12345', customerName: 'Sophia Martinez', customerEmail: 'sophia.m@gmail.com', itemsCount: 3, total: 184.50, paymentStatus: 'Paid', paymentMethod: 'Visa **** 4242', date: 'Oct 12, 2024', status: 'processing' },
  { _id: 'ord-1048', orderId: '#1048', customerName: 'Mazen Amr', customerEmail: 'mazen.amr@email.com', itemsCount: 2, total: 85.00, paymentStatus: 'Paid', paymentMethod: 'Visa **** 1881', date: 'Sep 8, 2026', status: 'delivered' },
  { _id: 'ord-1049', orderId: '#1049', customerName: 'Mazen Amr', customerEmail: 'mazen.amr@email.com', itemsCount: 4, total: 120.00, paymentStatus: 'Pending', paymentMethod: 'PayPal', date: 'Sep 8, 2026', status: 'pending' },
  { _id: 'ord-1050', orderId: '#1050', customerName: 'Emma Chen', customerEmail: 'emma.c@email.com', itemsCount: 1, total: 65.00, paymentStatus: 'Refunded', paymentMethod: 'Apple Pay', date: 'Sep 7, 2026', status: 'cancelled' },
  { _id: 'ord-1051', orderId: '#1051', customerName: 'Ahmed Ali', customerEmail: 'ahmed.a@email.com', itemsCount: 5, total: 240.00, paymentStatus: 'Paid', paymentMethod: 'Visa **** 7332', date: 'Sep 7, 2026', status: 'shipped' },
  { _id: 'ord-1052', orderId: '#1052', customerName: 'Olivia Smith', customerEmail: 'olivia.s@email.com', itemsCount: 2, total: 95.00, paymentStatus: 'Paid', paymentMethod: 'Visa **** 4242', date: 'Sep 6, 2026', status: 'delivered' },
  { _id: 'ord-1053', orderId: '#1053', customerName: 'Maria Garcia', customerEmail: 'maria.g@email.com', itemsCount: 3, total: 175.00, paymentStatus: 'Failed', paymentMethod: 'Mastercard **** 0099', date: 'Sep 6, 2026', status: 'pending' },
  { _id: 'ord-1054', orderId: '#1054', customerName: 'David Kim', customerEmail: 'david.k@email.com', itemsCount: 6, total: 310.00, paymentStatus: 'Paid', paymentMethod: 'Visa **** 4242', date: 'Sep 5, 2026', status: 'processing' },
  { _id: 'ord-1055', orderId: '#1055', customerName: 'Sarah Jenkins', customerEmail: 'sarah.j@email.com', itemsCount: 1, total: 52.00, paymentStatus: 'Paid', paymentMethod: 'PayPal', date: 'Sep 5, 2026', status: 'delivered' },
  { _id: 'ord-1056', orderId: '#1056', customerName: 'Tariq Mahmood', customerEmail: 'tariq.m@email.com', itemsCount: 2, total: 88.00, paymentStatus: 'Failed', paymentMethod: 'Visa **** 1881', date: 'Sep 4, 2026', status: 'cancelled' },
  { _id: 'ord-1057', orderId: '#1057', customerName: 'Clara Oswald', customerEmail: 'clara.o@email.com', itemsCount: 3, total: 145.00, paymentStatus: 'Paid', paymentMethod: 'Apple Pay', date: 'Sep 4, 2026', status: 'shipped' },
  { _id: 'ord-1058', orderId: '#1058', customerName: 'Julian Thorne', customerEmail: 'julian.t@email.com', itemsCount: 8, total: 420.00, paymentStatus: 'Paid', paymentMethod: 'Visa **** 7332', date: 'Sep 3, 2026', status: 'processing' },
  { _id: 'ord-1059', orderId: '#1059', customerName: 'Eleanor Vance', customerEmail: 'eleanor.v@email.com', itemsCount: 2, total: 78.00, paymentStatus: 'Paid', paymentMethod: 'Visa **** 4242', date: 'Sep 3, 2026', status: 'delivered' },
  { _id: 'ord-1060', orderId: '#1060', customerName: 'Miriam Rose', customerEmail: 'miriam.r@email.com', itemsCount: 4, total: 215.00, paymentStatus: 'Pending', paymentMethod: 'PayPal', date: 'Sep 2, 2026', status: 'pending' },
  { _id: 'ord-1061', orderId: '#1061', customerName: 'Silas Thorne', customerEmail: 'silas.t@email.com', itemsCount: 3, total: 132.00, paymentStatus: 'Paid', paymentMethod: 'Visa **** 1881', date: 'Sep 2, 2026', status: 'delivered' },
];

export function getOrderDetail(orderId: string): AdminOrderDetail | undefined {
  const row = mockOrders.find((o) => o.orderId === orderId || o._id === orderId);
  if (!row) return undefined;

  const itemPool: AdminOrderItem[] = [
    { name: 'Baked Blush-On', category: 'Makeup', qty: 1, price: 89.0 },
    { name: 'Matte Lipstick', category: 'Makeup', qty: 2, price: 24.0 },
    { name: 'Gentle Foaming Cleanser', category: 'Skincare', qty: 1, price: 36.0 },
    { name: 'Hydra-Glow Serum', category: 'Skincare', qty: 1, price: 65.0 },
    { name: 'Studio Fix Fluid', category: 'Makeup', qty: 1, price: 85.0 },
    { name: 'Prep + Prime Highlighter', category: 'Makeup', qty: 1, price: 32.0 },
    { name: 'Ceramic Vase', category: 'Home Decor', qty: 1, price: 32.0 },
    { name: 'Walnut Coffee Table', category: 'Furniture', qty: 1, price: 1200.0 },
  ];

  let h = 0;
  for (let i = 0; i < row._id.length; i++) h = (h * 31 + row._id.charCodeAt(i)) | 0;
  const items: AdminOrderItem[] = [];
  for (let i = 0; i < Math.min(row.itemsCount, itemPool.length); i++) {
    items.push(itemPool[(h + i) % itemPool.length]);
  }

  const subtotal = items.reduce((sum, it) => sum + it.price * it.qty, 0);
  const shippingCost = 12.0;
  const tax = Math.round(subtotal * 0.08 * 100) / 100;
  const discount = row.paymentStatus === 'Refunded' ? 0 : 15.0;
  const discountCode = discount > 0 ? 'PROMO10' : '';
  const total = Math.round((subtotal + shippingCost + tax - discount) * 100) / 100;

  const isComplete = (step: string): boolean => {
    const order = ['pending', 'processing', 'shipped', 'delivered'];
    if (row.status === 'cancelled') return step === 'Placed';
    const statusIdx = order.indexOf(row.status);
    const stepIdx = ['Placed', 'Paid', 'Processing', 'To Ship', 'To Deliver'].indexOf(step);
    if (stepIdx === 4) return row.status === 'delivered';
    return stepIdx <= statusIdx;
  };

  const timeline: AdminOrderTimelineStep[] = [
    { step: 'Placed', date: row.date, complete: isComplete('Placed') },
    { step: 'Paid', date: row.paymentStatus === 'Paid' ? row.date : '', complete: isComplete('Paid') },
    { step: 'Processing', date: isComplete('Processing') ? row.date : '', complete: isComplete('Processing') },
    { step: 'To Ship', date: '', complete: isComplete('To Ship') },
    { step: 'To Deliver', date: '', complete: isComplete('To Deliver') },
  ];

  return {
    _id: row._id,
    orderId: row.orderId,
    date: row.date,
    paymentMethod: row.paymentMethod,
    paymentStatus: row.paymentStatus,
    status: row.status,
    customer: {
      name: row.customerName,
      email: row.customerEmail,
      phone: '+1 (555) ' + (100 + Math.abs(h) % 900) + '-' + (1000 + Math.abs(h >> 4) % 9000),
    },
    shipping: {
      address: 'San Francisco, CA, USA',
      tracking: 'EL-' + (992000 + Math.abs(h) % 1000) + '-US',
    },
    items,
    subtotal: Math.round(subtotal * 100) / 100,
    shippingCost,
    tax,
    discount,
    discountCode,
    total,
    timeline,
  };
}