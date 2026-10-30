import { Search, Bell, ChevronDown } from 'lucide-react';
import { useAuth } from '@shared/lib/useAuth';

export function SellerNavbar() {
  const { user } = useAuth();
  const initials = user?.name?.split(' ').filter(Boolean).slice(0, 2).map((s) => s[0]?.toUpperCase() ?? '').join('') ?? '?';

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
        <div className="flex items-center bg-white rounded-card-sm" style={{ gap: '8px', padding: '0 8px', height: '48px' }}>
          <div className="rounded-full bg-primary text-brand font-bold w-8 h-8 flex items-center justify-center text-body3 shrink-0 overflow-hidden">{initials}</div>
          <div className="flex flex-col" style={{ gap: '2px' }}>
            <span className="text-body2 text-ink-secondary leading-tight">{user?.name ?? 'Seller'}</span>
            <span className="text-body3 text-ink-muted leading-tight">Owner</span>
          </div>
          <ChevronDown className="w-4 h-4 text-ink-faint" />
        </div>
      </div>
    </header>
  );
}