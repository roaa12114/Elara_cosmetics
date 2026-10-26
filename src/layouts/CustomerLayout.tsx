import { Link, Outlet } from 'react-router-dom';
import { ShoppingCart, Heart, Search } from 'lucide-react';
import { useAuth } from '@shared/lib/useAuth';

type NavItem = { to: string; label: string; status: 'active' | 'pending' };

// Per Figma customer shell — 4 items in the pink nav bar.
// The mega menu (Products → Makeup/Skincare/Korean Beauty sub-items) is
// deferred to script 15 (shells) per the open mega-menu decision.
const navLinks: NavItem[] = [
  { to: '/', label: 'Home', status: 'active' },
  { to: '/products', label: 'Products', status: 'pending' },
  { to: '/bundles', label: 'Bundles', status: 'pending' },
  { to: '/offers', label: 'Offers', status: 'pending' },
];

const footerColumns = [
  { title: 'Shop', links: ['All Products', 'Makeup', 'Skincare', 'Korean Beauty', 'Bundles', 'Offers'] },
  { title: 'Explore', links: ['About Us', 'Our Brands', 'Reviews', 'Blog', 'Careers', 'Sustainability'] },
  { title: 'Customer Care', links: ['Help Center', 'Contact Us', 'Shipping Policy', 'Returns', 'FAQ', 'Track Order'] },
  { title: 'My Account', links: ['My Orders', 'Wishlist', 'Addresses', 'Saved Cards', 'Notifications', 'Profile'] },
];

const socialIcons = [
  { label: 'Facebook', abbr: 'f' },
  { label: 'Instagram', abbr: 'ig' },
  { label: 'TikTok', abbr: 'tt' },
  { label: 'WhatsApp', abbr: 'wa' },
];

const paymentMethods = ['Mastercard', 'Visa', 'Apple Pay', 'OPay'];

export function CustomerLayout() {
  const { user, isAuthenticated, signOut } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <header className="border-b border-line bg-white">
        {/* Top row: logo + search + account actions */}
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-6">
          <Link to="/" className="font-bold text-h5 text-ink">Elara</Link>

          <div className="flex-1 max-w-xl relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted pointer-events-none" />
            <input
              type="search"
              placeholder="Search products..."
              disabled
              aria-label="Search products"
              title="Search results page coming soon"
              className="w-full h-10 rounded-pill border border-line bg-surface pl-11 pr-5 text-body2 text-ink placeholder:text-ink-muted focus:border-brand focus:outline-none disabled:cursor-not-allowed disabled:opacity-60"
            />
          </div>

          <div className="flex items-center gap-4 text-body2">
            {isAuthenticated && user ? (
              <span className="text-ink-muted cursor-not-allowed" aria-disabled="true" title="Account page coming in script 08">
                Hi, {user.name.split(' ')[0]}
              </span>
            ) : (
              <Link to="/sign-in" className="text-ink-secondary hover:text-ink">Login</Link>
            )}
            <span className="text-ink-muted cursor-not-allowed" aria-disabled="true" title="Language selector coming soon">English</span>
            <Link to="/seller/sign-up" className="text-ink-secondary hover:text-ink">Sell with Us</Link>
            <button
              type="button"
              disabled
              aria-label="Cart"
              title="Cart page coming in script 12"
              className="text-ink-muted hover:text-brand disabled:cursor-not-allowed disabled:opacity-60"
            >
              <ShoppingCart className="w-5 h-5" />
            </button>
            <button
              type="button"
              disabled
              aria-label="Wishlist"
              title="Wishlist page coming in script 08"
              className="text-ink-muted hover:text-brand disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Heart className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Bottom row: pink nav bar */}
        <div className="bg-primary-light">
          <div className="max-w-7xl mx-auto px-6 h-12 flex items-center gap-8 text-body2 font-medium">
            {navLinks.map((l) =>
              l.status === 'active' ? (
                <Link key={l.to} to={l.to} className="text-ink hover:text-brand">{l.label}</Link>
              ) : (
                <span key={l.to} className="text-ink-muted cursor-not-allowed" aria-disabled="true">{l.label}</span>
              )
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8">
        <Outlet />
      </main>

      <footer className="border-t border-line bg-primary-light">
        <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-2 lg:grid-cols-5 gap-8">
          <div className="col-span-2 flex flex-col gap-3">
            <div className="font-bold text-h6 text-brand">Elara</div>
            <p className="text-body2 text-ink-secondary">
              ELARA is your destination for premium beauty and self-care essentials. Glow with confidence, every day.
            </p>
            <div className="flex gap-2 mt-2">
              {socialIcons.map((s) => (
                <span
                  key={s.abbr}
                  aria-label={s.label}
                  title={s.label + ' (coming soon)'}
                  className="w-9 h-9 rounded-pill bg-white flex items-center justify-center text-body2 font-bold text-brand cursor-not-allowed"
                >
                  {s.abbr}
                </span>
              ))}
            </div>
          </div>

          {footerColumns.map((col) => (
            <div key={col.title} className="flex flex-col gap-3">
              <div className="text-body1 font-semibold text-ink">{col.title}</div>
              <ul className="flex flex-col gap-2">
                {col.links.map((link) => (
                  <li key={link}>
                    <span className="text-body2 text-ink-secondary cursor-not-allowed" aria-disabled="true">{link}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-line">
          <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-body2 text-ink-muted">© 2025 Elara Skincare &amp; Makeup</div>
            <div className="flex gap-3 items-center text-body2 text-ink-muted">
              {paymentMethods.map((m, i) => (
                <span key={m} className="flex items-center gap-3">
                  {i > 0 && <span>·</span>}
                  <span>{m}</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
