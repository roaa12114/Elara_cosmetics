import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '@shared/lib/auth-store';
import { cx } from '@shared/lib/cx';
import { SoonBadge } from '@/shared/ui';
import {
  LayoutDashboard, Package, Boxes, ShoppingCart,
  Wallet, Banknote, Tag, Settings,
} from 'lucide-react';

type NavStatus = 'active' | 'pending' | 'soon';

type NavItem = {
  label: string;
  icon: typeof LayoutDashboard;
  to: string;
  end: boolean;
  status: NavStatus;
};

// Per Q3:
//   Products, Orders: active
//   Overview, Inventory: pending (disabled, no Soon badge — will be built)
//   Earnings, Payouts, Promotions, Settings: soon (disabled, with Soon badge)
const navItems: NavItem[] = [
  { label: 'Overview', icon: LayoutDashboard, to: '/seller', end: true, status: 'pending' },
  { label: 'Products', icon: Package, to: '/seller/products', end: false, status: 'active' },
  { label: 'Inventory', icon: Boxes, to: '/seller/inventory', end: false, status: 'pending' },
  { label: 'Orders', icon: ShoppingCart, to: '/seller/orders', end: false, status: 'active' },
  { label: 'Earnings', icon: Wallet, to: '#', end: false, status: 'soon' },
  { label: 'Payouts', icon: Banknote, to: '#', end: false, status: 'soon' },
  { label: 'Promotions', icon: Tag, to: '#', end: false, status: 'soon' },
  { label: 'Settings', icon: Settings, to: '#', end: false, status: 'soon' },
];

export function SellerLayout() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex bg-surface">
      <aside className="w-64 border-r border-line bg-white flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-line">
          <Link to="/seller" className="font-bold text-h6 text-ink">Elara Seller</Link>
        </div>
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            if (item.status === 'active') {
              return (
                <NavLink
                  key={item.label}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    cx(
                      'flex items-center gap-3 px-3 py-2 rounded-pill text-body2',
                      isActive
                        ? 'bg-ink text-white'
                        : 'text-ink-secondary hover:bg-surface hover:text-ink'
                    )
                  }
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </NavLink>
              );
            }
            return (
              <div
                key={item.label}
                aria-disabled="true"
                className="flex items-center gap-3 px-3 py-2 rounded-pill text-body2 text-ink-muted cursor-not-allowed"
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
                {item.status === 'soon' && <SoonBadge />}
              </div>
            );
          })}
        </nav>
        <div className="p-3 border-t border-line">
          <div className="px-3 py-2 text-body2 text-ink-muted">{user?.name ?? 'Seller'}</div>
          <button
            onClick={() => { signOut(); navigate('/sign-in'); }}
            className="w-full text-left px-3 py-2 rounded-pill text-body2 text-ink-secondary hover:bg-surface hover:text-ink"
          >
            Log out
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
