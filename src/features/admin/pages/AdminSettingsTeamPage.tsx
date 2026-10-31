import { Link } from 'react-router-dom';
import { ArrowLeft, Plus } from 'lucide-react';
import { AdminNavbar } from '../components/AdminNavbar';
import { useToast } from '@/shared/ui';
import { teamMembers, roleCards } from '../data/adminSettingsStaticData';

export function AdminSettingsTeamPage() {
  const toast = useToast();
  return (
    <div className="flex flex-col min-h-screen">
      <AdminNavbar />
      <div className="flex flex-col" style={{ padding: '32px', gap: '24px' }}>
        <div className="flex items-center justify-between">
          <Link to="/admin/settings" className="flex items-center text-ink-secondary hover:text-ink no-underline" style={{ gap: '8px', fontSize: '16px' }}><ArrowLeft className="w-5 h-5" /> Back to Settings</Link>
          <button onClick={() => toast.show('Invite member is in demo mode')} className="flex items-center bg-ink text-white" style={{ borderRadius: 'var(--radius-pill)', padding: '8px 16px', gap: '8px', fontSize: '16px', fontWeight: 500, height: '48px' }}><Plus className="w-5 h-5" /> Invite Member</button>
        </div>
        <h1 className="font-bold text-ink" style={{ fontSize: '20px' }}>Team Members</h1>

        {/* Members table */}
        <div className="bg-white overflow-hidden" style={{ border: '1px solid var(--color-line)', borderRadius: '8px' }}>
          <table className="w-full">
            <thead><tr style={{ borderBottom: '1px solid var(--color-line)', background: '#FFF9F9' }}>
              <th className="text-left font-bold text-ink-secondary" style={{ padding: '12px 16px', fontSize: '12px', textTransform: 'uppercase' }}>Name</th>
              <th className="text-left font-bold text-ink-secondary" style={{ padding: '12px 16px', fontSize: '12px', textTransform: 'uppercase' }}>Email</th>
              <th className="text-left font-bold text-ink-secondary" style={{ padding: '12px 16px', fontSize: '12px', textTransform: 'uppercase' }}>Role</th>
              <th className="text-center font-bold text-ink-secondary" style={{ padding: '12px 16px', fontSize: '12px', textTransform: 'uppercase' }}>Status</th>
              <th className="text-left font-bold text-ink-secondary" style={{ padding: '12px 16px', fontSize: '12px', textTransform: 'uppercase' }}>Last Active</th>
              <th className="text-center font-bold text-ink-secondary" style={{ padding: '12px 16px', fontSize: '12px', textTransform: 'uppercase' }}>Actions</th>
            </tr></thead>
            <tbody>
              {teamMembers.map((m) => (
                <tr key={m._id} style={{ borderBottom: '1px solid var(--color-line)' }} className="hover:bg-surface transition-colors">
                  <td className="font-medium text-ink" style={{ padding: '12px 16px', fontSize: '14px' }}>{m.name}</td>
                  <td className="text-ink-faint" style={{ padding: '12px 16px', fontSize: '14px' }}>{m.email}</td>
                  <td className="text-ink" style={{ padding: '12px 16px', fontSize: '14px' }}>{m.role}</td>
                  <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                    <span className="inline-flex items-center justify-center" style={{ background: m.status === 'Active' ? 'var(--color-status-delivered-bg)' : 'var(--color-status-pending-bg)', color: m.status === 'Active' ? 'var(--color-success-text)' : 'var(--color-warning-text)', borderRadius: '6px', padding: '4px 10px', fontSize: '12px', fontWeight: 500 }}>{m.status}</span>
                  </td>
                  <td className="text-ink-faint" style={{ padding: '12px 16px', fontSize: '14px' }}>{m.lastActive}</td>
                  <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                    {m.status === 'Invited'
                      ? <button onClick={() => toast.show('Resend invite is in demo mode')} className="text-brand" style={{ fontSize: '14px' }}>Resend</button>
                      : <button onClick={() => toast.show('View member is in demo mode')} className="text-brand" style={{ fontSize: '14px' }}>View</button>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Roles & permissions */}
        <div className="bg-white" style={{ border: '1px solid var(--color-line)', borderRadius: '8px', padding: '24px' }}>
          <h3 className="font-bold text-ink" style={{ fontSize: '16px', marginBottom: '16px' }}>Roles & Permissions</h3>
          <div className="grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
            {roleCards.map((r) => (
              <div key={r.name} style={{ border: '1px solid var(--color-line)', borderRadius: '8px', padding: '16px' }}>
                <div className="flex items-center justify-between" style={{ marginBottom: '8px' }}>
                  <span className="font-bold text-ink" style={{ fontSize: '14px' }}>{r.name}</span>
                  <span className="text-ink-faint" style={{ fontSize: '12px' }}>{r.count} {r.count === 1 ? 'person' : 'people'}</span>
                </div>
                <p className="text-ink-faint" style={{ fontSize: '12px' }}>{r.description}</p>
                <button className="text-brand mt-2" style={{ fontSize: '12px' }}>Edit role</button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-end" style={{ gap: '12px' }}>
          <Link to="/admin/settings" className="text-ink-secondary no-underline" style={{ fontSize: '16px', fontWeight: 500, padding: '8px 16px' }}>Cancel</Link>
          <button onClick={() => toast.show('Team settings are in demo mode')} className="bg-ink text-white" style={{ borderRadius: 'var(--radius-pill)', padding: '8px 24px', fontSize: '16px', fontWeight: 500, height: '48px' }}>Save Changes</button>
        </div>
      </div>
    </div>
  );
}