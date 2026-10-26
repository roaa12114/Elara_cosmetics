import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '@shared/lib/useAuth';
import { cx } from '@shared/lib/cx';
import { SoonBadge } from '@/shared/ui';
import {
  LayoutDashboard, Users, Store, ShoppingCart, Tag, FolderTree,
  Truck, Image, BarChart3, Settings,
} from 'lucide-react';

type NavStatus = 'active' | 'pending' | 'soon';

type NavItem = {
  label: string;
  icon: typeof LayoutDashboard;
  to: string;
  end: boolean;
  status: NavStatus;
};

// Per Q4: Customers/Sellers/Orders/Discounts/Categories/Content will be built in Phase 4
// — for now they are pending (disabled, no Soon badge). Dashboard/Shipping/Analytics/
// Settings have no backend — Soon badge (Rule #4).
const navItems: NavItem[] = [
  { label: 'Dashboard', icon: LayoutDashboard, to: '#', end: true, status: 'soon' },
  { label: 'Customers', icon: Users, to: '/admin/customers', end: false, status: 'pending' },
  { label: 'Sellers', icon: Store, to: '/admin/sellers', end: false, status: 'pending' },
  { label: 'Orders', icon: ShoppingCart, to: '/admin/orders', end: false, status: 'pending' },
  { label: 'Discounts', icon: Tag, to: '/admin/discounts', end: false, status: 'pending' },
  { label: 'Categories', icon: FolderTree, to: '/admin/categories', end: false, status: 'pending' },
  { label: 'Content', icon: Image, to: '/admin/content', end: false, status: 'pending' },
  { label: 'Shipping', icon: Truck, to: '#', end: false, status: 'soon' },
  { label: 'Analytics', icon: BarChart3, to: '#', end: false, status: 'soon' },
  { label: 'Settings', icon: Settings, to: '#', end: false, status: 'soon' },
];

export function AdminLayout() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex bg-surface">
      <aside className="w-64 border-r border-line bg-white flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-line">
          <Link to="/admin" className="font-bold text-h6 text-ink">Elara Admin</Link>
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
          <div className="px-3 py-2 text-body2 text-ink-muted">{user?.name ?? 'Admin'}</div>
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
