import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { AdminNavbar } from '../components/AdminNavbar';
import { useToast } from '@/shared/ui';

const EMAIL_NOTIFICATIONS = [
  { label: 'Order Updates', enabled: true },
  { label: 'Customer Registration', enabled: true },
  { label: 'Seller Applications', enabled: true },
  { label: 'Low Stock Alerts', enabled: true },
  { label: 'Payment Notifications', enabled: true },
];

const PUSH_NOTIFICATIONS = [
  { label: 'New Orders', enabled: true },
  { label: 'Returns & Refunds', enabled: true },
  { label: 'System Alerts', enabled: false },
];

export function AdminSettingsNotificationsPage() {
  const toast = useToast();
  return (
    <div className="flex flex-col min-h-screen">
      <AdminNavbar />
      <div className="flex flex-col" style={{ padding: '32px', gap: '24px', maxWidth: '700px' }}>
        <Link to="/admin/settings" className="flex items-center text-ink-secondary hover:text-ink no-underline" style={{ gap: '8px', fontSize: '16px' }}><ArrowLeft className="w-5 h-5" /> Back to Settings</Link>
        <div className="flex items-center justify-between">
          <h1 className="font-bold text-ink" style={{ fontSize: '20px' }}>Notifications</h1>
          <span className="text-ink-faint" style={{ fontSize: '12px' }}>Last updated: just now</span>
        </div>

        {/* Email notifications */}
        <div className="bg-white" style={{ border: '1px solid var(--color-line)', borderRadius: '8px', padding: '24px' }}>
          <h3 className="font-bold text-ink" style={{ fontSize: '16px', marginBottom: '16px' }}>Email Notifications</h3>
          <div className="flex flex-col" style={{ gap: '12px' }}>
            {EMAIL_NOTIFICATIONS.map((n) => <ToggleRow key={n.label} label={n.label} defaultChecked={n.enabled} />)}
          </div>
        </div>

        {/* Push notifications */}
        <div className="bg-white" style={{ border: '1px solid var(--color-line)', borderRadius: '8px', padding: '24px' }}>
          <h3 className="font-bold text-ink" style={{ fontSize: '16px', marginBottom: '16px' }}>Push Notifications</h3>
          <div className="flex flex-col" style={{ gap: '12px' }}>
            {PUSH_NOTIFICATIONS.map((n) => <ToggleRow key={n.label} label={n.label} defaultChecked={n.enabled} />)}
          </div>
        </div>

        {/* Frequency */}
        <div className="bg-white" style={{ border: '1px solid var(--color-line)', borderRadius: '8px', padding: '24px' }}>
          <h3 className="font-bold text-ink" style={{ fontSize: '16px', marginBottom: '16px' }}>Notification Frequency</h3>
          <div className="flex items-center" style={{ gap: '8px' }}>
            {['Instant', 'Daily', 'Weekly'].map((f, i) => (
              <button key={f} className={i === 0 ? 'bg-ink text-white' : 'bg-white text-ink'} style={{ border: i === 0 ? 'none' : '1px solid var(--color-line)', borderRadius: 'var(--radius-pill)', padding: '8px 20px', fontSize: '14px', fontWeight: 500 }}>{f}</button>
            ))}
          </div>
          <p className="text-ink-faint" style={{ fontSize: '12px', marginTop: '12px' }}>Security and payment alerts are always sent instantly.</p>
        </div>

        <div className="flex items-center justify-end" style={{ gap: '12px' }}>
          <Link to="/admin/settings" className="text-ink-secondary no-underline" style={{ fontSize: '16px', fontWeight: 500, padding: '8px 16px' }}>Cancel</Link>
          <button onClick={() => toast.show('Notification settings are in demo mode')} className="bg-ink text-white" style={{ borderRadius: 'var(--radius-pill)', padding: '8px 24px', fontSize: '16px', fontWeight: 500, height: '48px' }}>Save Changes</button>
        </div>
      </div>
    </div>
  );
}

function ToggleRow({ label, defaultChecked }: { label: string; defaultChecked: boolean }) {
  return (
    <label className="flex items-center justify-between text-ink" style={{ fontSize: '14px' }}>
      {label}
      <input type="checkbox" defaultChecked={defaultChecked} />
    </label>
  );
}