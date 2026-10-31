import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Bell, ChevronDown, LogOut, Settings, User } from 'lucide-react';
import { useAuth } from '@shared/lib/useAuth';

export function SellerNavbar() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const initials = user?.name?.split(' ').filter(Boolean).slice(0, 2).map((s) => s[0]?.toUpperCase() ?? '').join('') ?? '?';

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
    }
    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isMenuOpen]);

  function handleSignOut() {
    signOut();
    setIsMenuOpen(false);
    navigate('/seller/sign-in');
  }

  return (
    <header className="bg-white px-6 py-6 flex items-center justify-between" style={{ gap: '373px' }}>
      <div className="flex items-center overflow-hidden h-12" style={{ width: '418px', border: '1px solid var(--color-brand)', borderRadius: 'var(--radius-pill)' }}>
        <input type="search" placeholder="Search" className="flex-1 h-full bg-transparent pl-6 pr-3 text-body2 text-ink-muted placeholder:text-ink-muted focus:outline-none" />
        <div className="bg-ink h-full flex items-center justify-center" style={{ width: '78px', borderRadius: '0 var(--radius-pill) var(--radius-pill) 0' }}>
          <Search className="w-5 h-5 text-white" />
        </div>
      </div>
      <div className="flex items-center" style={{ gap: '12px' }}>
        <button type="button" className="relative w-12 h-12 flex items-center justify-center bg-white border border-line rounded-card-sm hover:bg-surface transition-colors" aria-label="Notifications">
          <Bell className="w-5 h-5 text-ink" />
          <span className="absolute bg-brand text-white font-bold rounded-full w-5 h-5 flex items-center justify-center" style={{ top: '4px', right: '4px', fontSize: '11px' }}>6</span>
        </button>
        <div className="relative" ref={menuRef}>
          <button type="button" onClick={() => setIsMenuOpen((v) => !v)} className="flex items-center bg-white rounded-card-sm transition-colors hover:bg-surface" style={{ gap: '8px', padding: '0 8px', height: '48px' }} aria-expanded={isMenuOpen} aria-haspopup="menu">
            <div className="rounded-full bg-primary text-brand font-bold w-8 h-8 flex items-center justify-center text-body3 shrink-0 overflow-hidden">{initials}</div>
            <div className="flex flex-col" style={{ gap: '2px' }}>
              <span className="text-body2 text-ink-secondary leading-tight">{user?.name ?? 'Seller'}</span>
              <span className="text-body3 text-ink-muted leading-tight">Owner</span>
            </div>
            <ChevronDown className={`w-4 h-4 text-ink-faint transition-transform ${isMenuOpen ? 'rotate-180' : ''}`} />
          </button>
          {isMenuOpen && (
            <div role="menu" className="absolute right-0 top-full mt-2 w-56 rounded-card-sm border border-line-strong bg-white shadow-brand py-2 z-50">
              <div className="px-4 py-3 border-b border-line">
                <div className="text-body1 font-semibold text-ink truncate">{user?.name ?? 'Seller'}</div>
                <div className="text-body3 text-ink-muted truncate">{user?.email ?? ''}</div>
              </div>
              <div className="py-1">
                <button type="button" onClick={() => { navigate('/seller/settings'); setIsMenuOpen(false); }} className="flex items-center w-full px-4 py-2 text-body2 text-ink hover:bg-primary-light transition-colors" style={{ gap: '10px' }} role="menuitem">
                  <User className="w-4 h-4 text-ink-faint" /> Profile
                </button>
                <button type="button" onClick={() => { navigate('/seller/settings'); setIsMenuOpen(false); }} className="flex items-center w-full px-4 py-2 text-body2 text-ink hover:bg-primary-light transition-colors" style={{ gap: '10px' }} role="menuitem">
                  <Settings className="w-4 h-4 text-ink-faint" /> Settings
                </button>
              </div>
              <div className="border-t border-line my-1" />
              <button type="button" onClick={handleSignOut} className="flex items-center w-full px-4 py-2 text-body2 text-danger-dark hover:bg-danger-dark/5 transition-colors" style={{ gap: '10px' }} role="menuitem">
                <LogOut className="w-4 h-4" /> Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}