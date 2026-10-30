import { NavLink } from 'react-router-dom';

const TABS = [
  { to: '/seller', label: 'Overview', end: true },
  { to: '/seller/analytics', label: 'Sales Analytics', end: false },
  { to: '/seller/sales', label: 'Sales Overview', end: false },
] as const;

export function SellerOverviewTabs() {
  return (
    <div className="flex items-center border-b border-line" style={{ gap: '0' }}>
      {TABS.map((tab) => (
        <NavLink key={tab.to} to={tab.to} end={tab.end}
          className={({ isActive }) => `px-5 py-3 text-body2 font-medium border-b-2 transition-colors no-underline -mb-px ${isActive ? 'border-ink text-ink' : 'border-transparent text-ink-muted hover:text-ink'}`}>
          {tab.label}
        </NavLink>
      ))}
    </div>
  );
}