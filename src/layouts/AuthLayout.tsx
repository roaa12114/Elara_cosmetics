import { Link, Outlet } from 'react-router-dom';

// Simple header + footer for auth pages. The full Figma-faithful customer
// header/footer (with search bar, social icons, 4-column link footer, payment
// icons) will be built in script 05 (shells) when the customer-shell screenshot
// is shared.
const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/makeup', label: 'Makeup' },
  { to: '/skincare', label: 'Skincare' },
  { to: '/korean-beauty', label: 'Korean Beauty' },
  { to: '/bundles', label: 'Bundles' },
  { to: '/offers', label: 'Offers' },
];

export function AuthLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <header className="border-b border-line bg-white">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="font-bold text-h5 text-ink">Elara</Link>
          <nav className="flex items-center gap-6 text-body2">
            {navLinks.map((l) => (
              <Link key={l.to} to={l.to} className="text-ink-secondary hover:text-ink">{l.label}</Link>
            ))}
            <Link to="/seller/sign-up" className="text-ink-secondary hover:text-ink">Sell with Us</Link>
          </nav>
        </div>
      </header>
      <main className="flex-1 flex items-center justify-center py-16 px-6">
        <Outlet />
      </main>
      <footer className="border-t border-line bg-white">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between text-body2 text-ink-muted">
          <span>© 2025 Elara Skincare &amp; Makeup</span>
          <span>Phase 1 — Foundation</span>
        </div>
      </footer>
    </div>
  );
}
