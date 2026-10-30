import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '@shared/lib/useAuth';
import { cx } from '@shared/lib/cx';
import {
  LayoutDashboard, Package, Boxes, ShoppingCart,
  Wallet, Banknote, Tag, Settings, LogOut,
} from 'lucide-react';

type NavItem = { label: string; icon: typeof LayoutDashboard; to: string; end: boolean; };

const navItems: NavItem[] = [
  { label: 'Overview', icon: LayoutDashboard, to: '/seller', end: true },
  { label: 'Products', icon: Package, to: '/seller/products', end: false },
  { label: 'Inventory', icon: Boxes, to: '/seller/inventory', end: false },
  { label: 'Orders', icon: ShoppingCart, to: '/seller/orders', end: false },
  { label: 'Earnings', icon: Wallet, to: '/seller/earnings', end: false },
  { label: 'Payouts', icon: Banknote, to: '/seller/payouts', end: false },
  { label: 'Promotions', icon: Tag, to: '/seller/promotions', end: false },
  { label: 'Settings', icon: Settings, to: '/seller/settings', end: false },
];

export function SellerLayout() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  function handleSignOut() {
    signOut();
    navigate('/seller/sign-in');
  }

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--color-surface)' }}>
      <aside className="flex flex-col shrink-0" style={{ width: '264px', background: '#FFFFFF', borderRadius: '32px 0 0 32px', boxShadow: '0px 16px 24px -4px rgba(217, 138, 156, 0.2)' }}>
        <div className="flex items-center justify-between" style={{ height: '110px', padding: '0 24px' }}>
          <Link to="/seller" className="font-bold text-h6 text-ink no-underline">Elara Seller</Link>
        </div>
        <div style={{ height: '1px', background: 'var(--color-brand)', margin: '0 24px' }} />
        <nav className="flex-1 overflow-y-auto" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink key={item.label} to={item.to} end={item.end}
                className={({ isActive }) => cx('flex items-center no-underline transition-colors', isActive ? 'bg-ink text-white font-medium' : 'text-ink-secondary hover:bg-primary-light hover:text-ink')}
                style={({ isActive }) => ({ height: '42px', borderRadius: isActive ? '12px' : '8px', padding: '8px 16px', gap: '8px', fontSize: '16px', lineHeight: '24px', fontWeight: 500 })}>
                <Icon className="w-5 h-5 shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
        <div style={{ padding: '0 24px 32px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <button onClick={handleSignOut} className="flex items-center transition-colors text-danger-dark hover:bg-danger-dark/5"
            style={{ height: '42px', borderRadius: '8px', padding: '8px 16px', gap: '8px', fontSize: '16px', lineHeight: '24px', fontWeight: 500 }}>
            <LogOut className="w-5 h-5 shrink-0" />
            Log out
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-auto"><Outlet /></main>
    </div>
  );
}