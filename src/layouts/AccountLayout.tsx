import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import {
  User,
  MapPin,
  Package,
  RotateCcw,
  Heart,
  CreditCard,
  Bell,
  LogOut,
} from 'lucide-react';
import { useAuth } from '@shared/lib/useAuth';
import { useToast } from '@/shared/ui';

const menuItems = [
  { to: '/account/profile', label: 'Profile', icon: User, comingSoon: false },
  { to: '/account/addresses', label: 'Address', icon: MapPin, comingSoon: false },
  { to: '/account/orders', label: 'Orders', icon: Package, comingSoon: false },
  { to: '/account/returns', label: 'Returns', icon: RotateCcw, comingSoon: true },
  { to: '/account/wishlist', label: 'Wishlist', icon: Heart, comingSoon: false },
  { to: '/account/cards', label: 'Manage Cards', icon: CreditCard, comingSoon: true },
  { to: '/account/notifications', label: 'Notifications', icon: Bell, comingSoon: false },
] as const;

export function AccountLayout() {
  const { user, isAuthenticated, signOut } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/sign-in?redirect=/account/orders');
    }
  }, [isAuthenticated, navigate]);

  function handleSignOut() {
    signOut();
    toast.show('Signed out successfully');
    navigate('/');
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  const initials = user.name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase() ?? '')
    .join('') || '?';

  return (
    <div className="mx-auto w-full max-w-[1440px] px-6 lg:px-20 py-10 flex flex-col" style={{ gap: '32px' }}>
      <nav className="flex items-center gap-2 text-body1" aria-label="Breadcrumb">
        <a href="/" className="text-ink-secondary hover:text-ink">Home</a>
        <span className="text-ink-muted">/</span>
        <span className="text-ink font-medium">My Account</span>
      </nav>

      <h1 className="font-serif text-h3 font-bold text-ink">My Account</h1>

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr]" style={{ gap: '32px' }}>
        <aside>
          <div className="rounded-card-sm border border-line-strong bg-white p-6 flex flex-col" style={{ gap: '20px' }}>
            <div className="flex items-center" style={{ gap: '12px' }}>
              <div className="rounded-full bg-primary text-brand font-bold w-12 h-12 flex items-center justify-center text-h6">
                {initials}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-body1 font-semibold text-ink truncate">{user.name}</span>
                <span className="text-body3 text-ink-muted truncate">{user.email}</span>
              </div>
            </div>

            <div className="border-t border-line" />

            <nav className="flex flex-col" style={{ gap: '4px' }}>
              {menuItems.map((item) => {
                const Icon = item.icon;
                if (item.comingSoon) {
                  return (
                    <span
                      key={item.to}
                      className="flex items-center justify-between rounded-card-sm px-3 py-2.5 text-body2 text-ink-muted cursor-not-allowed"
                      title="Coming soon"
                    >
                      <span className="flex items-center" style={{ gap: '10px' }}>
                        <Icon className="w-4 h-4" />
                        {item.label}
                      </span>
                      <span className="rounded-pill bg-line text-ink-muted text-body3 px-2 py-0.5">Soon</span>
                    </span>
                  );
                }
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) =>
                      `flex items-center rounded-card-sm px-3 py-2.5 text-body2 transition-colors no-underline ${
                        isActive
                          ? 'bg-ink text-white font-semibold'
                          : 'text-ink hover:bg-primary-light'
                      }`
                    }
                    style={{ gap: '10px' }}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </NavLink>
                );
              })}
            </nav>

            <div className="border-t border-line" />

            <button
              type="button"
              onClick={handleSignOut}
              className="flex items-center rounded-card-sm px-3 py-2.5 text-body2 text-danger hover:bg-danger/5 transition-colors"
              style={{ gap: '10px' }}
            >
              <LogOut className="w-4 h-4" />
              Sign out
            </button>
          </div>
        </aside>

        <main className="min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}