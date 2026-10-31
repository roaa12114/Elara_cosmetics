// ===== Admin Settings static data =====
export interface TeamMember {
  _id: string;
  name: string;
  email: string;
  role: 'Owner' | 'Admin' | 'Editor' | 'Viewer';
  status: 'Active' | 'Invited';
  lastActive: string;
}

export const teamMembers: TeamMember[] = [
  { _id: 'tm-1', name: 'Ahmed Ibrahiem', email: 'ahmed@elara.com', role: 'Owner', status: 'Active', lastActive: 'Today 09:42' },
  { _id: 'tm-2', name: 'Maya Chen', email: 'maya@elara.com', role: 'Admin', status: 'Active', lastActive: 'Sep 9, 18:15' },
  { _id: 'tm-3', name: 'Noor Hassan', email: 'lina@elara.com', role: 'Viewer', status: 'Invited', lastActive: 'Sep 9, 18:15' },
];

export interface RoleCard { name: string; count: number; description: string; }
export const roleCards: RoleCard[] = [
  { name: 'Owner', count: 1, description: 'Full access to all settings and data' },
  { name: 'Admin', count: 1, description: 'Manage products, orders, and customers' },
  { name: 'Editor', count: 2, description: 'Edit products and content only' },
  { name: 'Viewer', count: 1, description: 'Read-only access to dashboard' },
];

export interface LoginHistoryEntry { date: string; ip: string; location: string; device: string; status: 'Successful' | 'Blocked'; }
export const loginHistory: LoginHistoryEntry[] = [
  { date: 'Sep 10, 2026 09:42', ip: '192.168.1.42', location: 'Tashkent, UZ', device: 'Chrome / macOS', status: 'Successful' },
  { date: 'Sep 9, 2026 18:16', ip: '192.168.0.42', location: 'Tashkent, UZ', device: 'Safari / iPhone', status: 'Successful' },
  { date: 'Sep 7, 2026 11:04', ip: '85.117.106.24', location: 'Samarkand, UZ', device: 'Chrome / Windows', status: 'Successful' },
  { date: 'Sep 5, 2026 02:31', ip: '185.74.4.18', location: 'Warsaw, PL', device: 'Firefox / Windows', status: 'Blocked' },
];

export interface ShippingZone { name: string; region: string; rateType: string; rate: string; status: 'Active' | 'Inactive'; }
export const shippingZones: ShippingZone[] = [
  { name: 'Domestic', region: 'Uzbekistan', rateType: 'Flat rate', rate: '$8.50', status: 'Active' },
  { name: 'International', region: '42 countries', rateType: 'Weight based', rate: 'Calculated', status: 'Active' },
  { name: 'Express', region: 'Major cities', rateType: 'Weight based', rate: '$18.00', status: 'Active' },
];

export const storeInfo = { name: 'Elara Skincare & Makeup', handle: 'elara-beauty', email: 'support@elara.com', phone: '+998 71 200 24 24', country: 'Uzbekistan', currency: 'UZS', weightUnit: 'kg', registrationNumber: 'UZ-ELR-2048-19', taxId: '309 884 120', status: 'LIVE' };
export const billingInfo = { legalName: 'Elara Skincare & Makeup', billingEmail: 'billing@elara.com', address: '24 Amir Temur Avenue, Tashkent', taxId: '309 884 120' };
export const payoutSettings = { bankAccount: 'Kapitalbank •••• 4821', status: 'Verified', schedule: 'Weekly — every Monday', currency: 'UZS' };

export const settingsCards = [
  { title: 'Profile', icon: 'User', description: 'Ahmed Ibrahiem · ahmed@elara.com', updated: '2 days ago', link: '/admin/settings/profile', status: 'Updated 2 days ago' },
  { title: 'Security', icon: 'Shield', description: '2FA enabled · Password updated', updated: '2 days ago', link: '/admin/settings/security', status: '2FA Active' },
  { title: 'Notifications', icon: 'Bell', description: '8 of 9 notifications enabled', updated: '5 days ago', link: '/admin/settings/notifications', status: '8/9 enabled' },
  { title: 'Store', icon: 'Store', description: 'Elara Skincare & Makeup', updated: '1 week ago', link: '/admin/settings/store', status: 'Live' },
  { title: 'Payment', icon: 'CreditCard', description: 'Bank account verified', updated: '3 days ago', link: '/admin/settings/payment', status: 'Verified' },
  { title: 'Shipping', icon: 'Truck', description: '3 active shipping zones', updated: '1 week ago', link: '/admin/settings/shipping', status: '3 zones active' },
  { title: 'Team Members', icon: 'Users', description: '3 members · 1 invited', updated: '2 days ago', link: '/admin/settings/team-members', status: '3 + 1 pending' },
];