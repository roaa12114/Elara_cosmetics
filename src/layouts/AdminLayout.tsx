import { Link, NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, Users, Store, Tag, ShoppingCart, Percent, Truck, FileText, BarChart3, Settings } from 'lucide-react';

type NavItem = { label: string; icon: typeof LayoutDashboard; to: string; end: boolean; status: 'active' | 'soon' };

const navItems: NavItem[] = [
  { label: 'Overview', icon: LayoutDashboard, to: '/admin', end: true, status: 'active' },
  { label: 'Customer', icon: Users, to: '/admin/customers', end: false, status: 'active' },
  { label: 'Seller', icon: Store, to: '/admin/sellers', end: false, status: 'soon' },
  { label: 'Category', icon: Tag, to: '/admin/categories', end: false, status: 'soon' },
  { label: 'Orders', icon: ShoppingCart, to: '/admin/orders', end: false, status: 'soon' },
  { label: 'Discount', icon: Percent, to: '/admin/discounts', end: false, status: 'soon' },
  { label: 'Shipping', icon: Truck, to: '/admin/shipping', end: false, status: 'soon' },
  { label: 'Content', icon: FileText, to: '/admin/content', end: false, status: 'soon' },
  { label: 'Analytics', icon: BarChart3, to: '/admin/analytics', end: false, status: 'soon' },
  { label: 'Settings', icon: Settings, to: '/admin/settings', end: false, status: 'soon' },
];

export function AdminLayout() {
  return (
    <div className="min-h-screen flex" style={{ background: 'var(--color-surface)' }}>
      <aside className="flex flex-col shrink-0" style={{ width: '264px', background: '#FFFFFF', borderRadius: '32px 0 0 32px', boxShadow: '0px 16px 24px -4px rgba(217, 138, 156, 0.2)' }}>
        <div className="flex items-center justify-between" style={{ height: '110px', padding: '0 24px' }}>
          <Link to="/admin" className="font-bold text-h6 text-ink no-underline">Elara Admin</Link>
        </div>
        <div style={{ height: '1px', background: 'var(--color-brand)', margin: '0 24px' }} />
        <nav className="flex-1 overflow-y-auto" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            if (item.status === 'soon') {
              return (
                <div key={item.label} className="flex items-center justify-between rounded-card-sm px-4 py-2.5 text-body2 text-ink-muted cursor-not-allowed" style={{ gap: '8px', fontSize: '16px', fontWeight: 500 }}>
                  <span className="flex items-center" style={{ gap: '10px' }}><Icon className="w-5 h-5" /> {item.label}</span>
                  <span className="rounded-pill bg-line text-ink-muted text-body3 px-2 py-0.5">Soon</span>
                </div>
              );
            }
            return (
              <NavLink key={item.label} to={item.to} end={item.end}
                className={({ isActive }) => isActive ? 'bg-ink text-white font-medium' : 'text-ink-secondary hover:bg-primary-light hover:text-ink'}
                style={({ isActive }) => ({ height: '42px', borderRadius: isActive ? '12px' : '8px', padding: '8px 16px', gap: '8px', fontSize: '16px', lineHeight: '24px', fontWeight: 500, display: 'flex', alignItems: 'center' })}>
                <Icon className="w-5 h-5 shrink-0" /> {item.label}
              </NavLink>
            );
          })}
        </nav>
      </aside>
      <main className="flex-1 overflow-auto"><Outlet /></main>
    </div>
  );
}