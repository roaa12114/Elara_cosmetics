import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '@shared/lib/auth-store';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/makeup', label: 'Makeup' },
  { to: '/skincare', label: 'Skincare' },
  { to: '/korean-beauty', label: 'Korean Beauty' },
  { to: '/bundles', label: 'Bundles' },
  { to: '/offers', label: 'Offers' },
];

export function CustomerLayout() {
  const { user, isAuthenticated, signOut } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <header className="border-b border-line bg-white">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="font-bold text-h5 text-ink">Elara</Link>
          <nav className="flex items-center gap-6 text-body2">
            {navLinks.map((l) => (
              <Link key={l.to} to={l.to} className="text-ink-secondary hover:text-ink">
                {l.label}
              </Link>
            ))}
            {isAuthenticated && user ? (
              <>
                <Link to="/account" className="text-ink-secondary hover:text-ink">{user.name}</Link>
                <button onClick={signOut} className="text-ink-muted hover:text-ink">Sign out</button>
              </>
            ) : (
              <Link to="/sign-in" className="text-ink-secondary hover:text-ink">Sign in</Link>
            )}
          </nav>
        </div>
      </header>
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8">
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
