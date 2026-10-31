import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { AdminNavbar } from '../components/AdminNavbar';
import { useToast } from '@/shared/ui';
import { loginHistory } from '../data/adminSettingsStaticData';

export function AdminSettingsSecurityPage() {
  const toast = useToast();
  return (
    <div className="flex flex-col min-h-screen">
      <AdminNavbar />
      <div className="flex flex-col" style={{ padding: '32px', gap: '24px', maxWidth: '700px' }}>
        <Link to="/admin/settings" className="flex items-center text-ink-secondary hover:text-ink no-underline" style={{ gap: '8px', fontSize: '16px' }}><ArrowLeft className="w-5 h-5" /> Back to Settings</Link>
        <h1 className="font-bold text-ink" style={{ fontSize: '20px' }}>Security</h1>

        {/* Change password */}
        <div className="bg-white" style={{ border: '1px solid var(--color-line)', borderRadius: '8px', padding: '24px' }}>
          <h3 className="font-bold text-ink" style={{ fontSize: '16px', marginBottom: '16px' }}>Change Password</h3>
          <div className="flex flex-col" style={{ gap: '16px' }}>
            <div className="flex flex-col" style={{ gap: '6px' }}><label className="text-ink-secondary" style={{ fontSize: '14px' }}>Current Password</label><input type="password" placeholder="••••••••" className="w-full bg-white text-ink" style={{ border: '1px solid var(--color-line)', borderRadius: '8px', padding: '12px', fontSize: '14px', height: '40px' }} /></div>
            <div className="flex flex-col" style={{ gap: '6px' }}><label className="text-ink-secondary" style={{ fontSize: '14px' }}>New Password</label><input type="password" placeholder="••••••••" className="w-full bg-white text-ink" style={{ border: '1px solid var(--color-line)', borderRadius: '8px', padding: '12px', fontSize: '14px', height: '40px' }} /></div>
            <div className="flex flex-col" style={{ gap: '6px' }}><label className="text-ink-secondary" style={{ fontSize: '14px' }}>Confirm New Password</label><input type="password" placeholder="••••••••" className="w-full bg-white text-ink" style={{ border: '1px solid var(--color-line)', borderRadius: '8px', padding: '12px', fontSize: '14px', height: '40px' }} /></div>
          </div>
        </div>

        {/* 2FA */}
        <div className="bg-white" style={{ border: '1px solid var(--color-line)', borderRadius: '8px', padding: '24px' }}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-ink" style={{ fontSize: '16px' }}>Two-Factor Authentication</h3>
              <p className="text-ink-faint" style={{ fontSize: '14px', marginTop: '4px' }}>Add an extra layer of security to your account</p>
            </div>
            <div className="flex items-center" style={{ gap: '12px' }}>
              <span className="inline-flex items-center" style={{ background: 'var(--color-status-delivered-bg)', color: 'var(--color-success-text)', borderRadius: '6px', padding: '4px 12px', fontSize: '12px', fontWeight: 500 }}>Active</span>
              <input type="checkbox" defaultChecked />
            </div>
          </div>
        </div>

        {/* Login history */}
        <div className="bg-white overflow-hidden" style={{ border: '1px solid var(--color-line)', borderRadius: '8px' }}>
          <div style={{ padding: '24px', borderBottom: '1px solid var(--color-line)' }}><h3 className="font-bold text-ink" style={{ fontSize: '16px' }}>Login History</h3></div>
          <table className="w-full">
            <thead><tr style={{ borderBottom: '1px solid var(--color-line)', background: '#FFF9F9' }}>
              <th className="text-left font-bold text-ink-secondary" style={{ padding: '12px 16px', fontSize: '12px', textTransform: 'uppercase' }}>Date</th>
              <th className="text-left font-bold text-ink-secondary" style={{ padding: '12px 16px', fontSize: '12px', textTransform: 'uppercase' }}>IP Address</th>
              <th className="text-left font-bold text-ink-secondary" style={{ padding: '12px 16px', fontSize: '12px', textTransform: 'uppercase' }}>Location</th>
              <th className="text-left font-bold text-ink-secondary" style={{ padding: '12px 16px', fontSize: '12px', textTransform: 'uppercase' }}>Device</th>
              <th className="text-center font-bold text-ink-secondary" style={{ padding: '12px 16px', fontSize: '12px', textTransform: 'uppercase' }}>Status</th>
            </tr></thead>
            <tbody>
              {loginHistory.map((entry, i) => (
                <tr key={i} style={{ borderBottom: '1px solid var(--color-line)' }}>
                  <td className="text-ink-faint" style={{ padding: '12px 16px', fontSize: '14px' }}>{entry.date}</td>
                  <td className="text-ink font-mono" style={{ padding: '12px 16px', fontSize: '14px' }}>{entry.ip}</td>
                  <td className="text-ink-faint" style={{ padding: '12px 16px', fontSize: '14px' }}>{entry.location}</td>
                  <td className="text-ink-faint" style={{ padding: '12px 16px', fontSize: '14px' }}>{entry.device}</td>
                  <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                    <span className="inline-flex items-center" style={{ background: entry.status === 'Successful' ? 'var(--color-status-delivered-bg)' : 'var(--color-status-shipped-bg)', color: entry.status === 'Successful' ? 'var(--color-success-text)' : 'var(--color-danger-dark)', borderRadius: '6px', padding: '4px 10px', fontSize: '12px', fontWeight: 500 }}>{entry.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-end" style={{ gap: '12px' }}>
          <Link to="/admin/settings" className="text-ink-secondary no-underline" style={{ fontSize: '16px', fontWeight: 500, padding: '8px 16px' }}>Cancel</Link>
          <button onClick={() => toast.show('Security settings are in demo mode')} className="bg-ink text-white" style={{ borderRadius: 'var(--radius-pill)', padding: '8px 24px', fontSize: '16px', fontWeight: 500, height: '48px' }}>Save Changes</button>
        </div>
      </div>
    </div>
  );
}