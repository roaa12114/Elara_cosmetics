import { Link, Outlet } from 'react-router-dom';

type NavItem = { to: string; label: string; status: 'active' | 'pending' };

const navLinks: NavItem[] = [
  { to: '/', label: 'Home', status: 'active' },
  { to: '/makeup', label: 'Makeup', status: 'pending' },
  { to: '/skincare', label: 'Skincare', status: 'pending' },
  { to: '/korean-beauty', label: 'Korean Beauty', status: 'pending' },
  { to: '/bundles', label: 'Bundles', status: 'pending' },
  { to: '/offers', label: 'Offers', status: 'pending' },
];

export function AuthLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <header className="border-b border-line bg-white">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="font-bold text-h5 text-ink">Elara</Link>
          <nav className="flex items-center gap-6 text-body2">
            {navLinks.map((l) =>
              l.status === 'active' ? (
                <Link key={l.to} to={l.to} className="text-ink-secondary hover:text-ink">{l.label}</Link>
              ) : (
                <span key={l.to} className="text-ink-muted cursor-not-allowed" aria-disabled="true">{l.label}</span>
              )
            )}
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
        </div>
      </footer>
    </div>
  );
}
