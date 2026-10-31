import { Link } from 'react-router-dom';
import { User, Shield, Bell, Store, CreditCard, Truck, Users, CheckCircle2 } from 'lucide-react';
import { AdminNavbar } from '../components/AdminNavbar';
import { settingsCards } from '../data/adminSettingsStaticData';

const ICONS: Record<string, typeof User> = { User, Shield, Bell, Store, CreditCard, Truck, Users };

export function AdminSettingsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <AdminNavbar />
      <div className="flex flex-col" style={{ padding: '32px', gap: '24px', maxWidth: '900px' }}>
        <nav className="flex items-center text-ink-faint" style={{ gap: '8px', fontSize: '14px' }}>
          <Link to="/admin" className="hover:text-ink no-underline">Home</Link><span>/</span>
          <span className="text-ink font-medium">Setting</span>
        </nav>
        <h1 className="font-bold text-ink" style={{ fontSize: '20px' }}>Settings</h1>

        <div className="bg-ink" style={{ borderRadius: '8px', padding: '24px', color: 'white' }}>
          <div className="flex items-center" style={{ gap: '12px' }}>
            <CheckCircle2 className="w-6 h-6 text-success-text" />
            <div>
              <h3 className="font-bold" style={{ fontSize: '16px' }}>Your core settings are healthy</h3>
              <p style={{ fontSize: '14px', opacity: 0.8, marginTop: '4px' }}>Store is live · 2FA enabled · Payment verified · All systems operational</p>
            </div>
          </div>
        </div>

        <div className="grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          {settingsCards.map((card) => {
            const Icon = ICONS[card.icon] ?? User;
            return (
              <Link key={card.title} to={card.link} className="bg-white no-underline" style={{ border: '1px solid var(--color-line)', borderRadius: '8px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div className="flex items-center" style={{ gap: '10px' }}>
                  <div className="bg-primary-light flex items-center justify-center rounded-card-sm" style={{ width: '36px', height: '36px' }}>
                    <Icon className="w-5 h-5 text-brand" />
                  </div>
                  <span className="font-bold text-ink" style={{ fontSize: '16px' }}>{card.title}</span>
                </div>
                <p className="text-ink-secondary" style={{ fontSize: '14px' }}>{card.description}</p>
                <div className="flex items-center justify-between" style={{ marginTop: 'auto' }}>
                  <span className="inline-flex items-center" style={{ background: 'var(--color-status-delivered-bg)', color: 'var(--color-success-text)', borderRadius: '6px', padding: '4px 10px', fontSize: '12px', fontWeight: 500 }}>{card.status}</span>
                  <span className="text-ink-faint" style={{ fontSize: '12px' }}>{card.updated}</span>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="flex items-center justify-center" style={{ marginTop: '16px' }}>
          <p className="text-ink-faint" style={{ fontSize: '14px' }}>Need help? <a href="#" className="text-brand">Visit the Help Center</a></p>
        </div>
      </div>
    </div>
  );
}