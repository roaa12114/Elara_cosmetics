import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Shield } from 'lucide-react';
import { AdminNavbar } from '../components/AdminNavbar';
import { useAdminUsers } from '@shared/hooks/useAdminUsers';
import { useToast } from '@/shared/ui';
import { formatDate } from '@shared/lib/utils';

const UNBLOCK_CONDITIONS = [
  'Identity verification completed',
  'Security review completed',
  'No suspicious activity detected',
  'Customer contacted and issue resolved',
];

export function AdminUnblockCustomerPage() {
  const { id } = useParams();
  const toast = useToast();
  const { data } = useAdminUsers({ role: 'customer', limit: 100 });
  const user = data?.users?.find((u) => u._id === id);

  if (!user) {
    return (
      <div className="flex flex-col min-h-screen">
        <AdminNavbar />
        <div className="flex-1 flex items-center justify-center"><p className="text-ink">Customer not found</p></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <AdminNavbar />
      <div className="flex flex-col" style={{ padding: '32px', gap: '24px', maxWidth: '700px' }}>
        <Link to={`/admin/customers/${user._id}`} className="flex items-center text-ink-secondary hover:text-ink no-underline" style={{ gap: '8px', fontSize: '16px' }}>
          <ArrowLeft className="w-5 h-5" /> Back to Customer
        </Link>

        <div className="flex items-center" style={{ background: 'var(--color-status-delivered-bg)', borderRadius: '8px', padding: '16px', gap: '12px' }}>
          <Shield className="w-5 h-5 text-success-text" />
          <p className="text-success-text" style={{ fontSize: '14px' }}>Unblocking this customer will restore their access to the Elara platform.</p>
        </div>

        <div className="bg-white" style={{ border: '1px solid var(--color-line)', borderRadius: '8px', padding: '24px' }}>
          <h3 className="font-bold text-ink" style={{ fontSize: '16px', marginBottom: '16px' }}>Customer Overview</h3>
          <div className="grid grid-cols-2" style={{ gap: '16px' }}>
            <div><span className="text-ink-faint" style={{ fontSize: '12px', textTransform: 'uppercase' }}>Name</span><p className="text-ink" style={{ fontSize: '14px' }}>{user.name}</p></div>
            <div><span className="text-ink-faint" style={{ fontSize: '12px', textTransform: 'uppercase' }}>Email</span><p className="text-ink" style={{ fontSize: '14px' }}>{user.email}</p></div>
            <div><span className="text-ink-faint" style={{ fontSize: '12px', textTransform: 'uppercase' }}>Registered</span><p className="text-ink" style={{ fontSize: '14px' }}>{formatDate(user.createdAt)}</p></div>
            <div>
              <span className="text-ink-faint" style={{ fontSize: '12px', textTransform: 'uppercase' }}>Status</span>
              <p>
                <span className="inline-flex items-center" style={{ background: 'var(--color-status-out-of-stock-bg)', color: '#171315', borderRadius: '6px', padding: '4px 10px', fontSize: '12px', fontWeight: 500 }}>Blocked</span>
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white" style={{ border: '1px solid var(--color-line)', borderRadius: '8px', padding: '24px' }}>
          <h3 className="font-bold text-ink" style={{ fontSize: '16px', marginBottom: '16px' }}>Unblock Conditions</h3>
          <div className="flex flex-col" style={{ gap: '12px' }}>
            {UNBLOCK_CONDITIONS.map((cond, i) => (
              <label key={cond} className="flex items-center text-ink" style={{ gap: '8px', fontSize: '14px' }}>
                <input type="checkbox" defaultChecked={i < 3} /> {cond}
              </label>
            ))}
          </div>
          <div style={{ marginTop: '16px' }}>
            <label className="text-ink-secondary" style={{ fontSize: '14px', marginBottom: '6px', display: 'block' }}>Unblock Notes</label>
            <textarea
              placeholder="Additional notes for the unblock record..."
              rows={3}
              className="w-full bg-white text-ink"
              style={{ border: '1px solid var(--color-line)', borderRadius: '8px', padding: '12px', fontSize: '14px', resize: 'vertical' }}
            />
          </div>
        </div>

        <div className="flex items-center justify-end" style={{ gap: '12px' }}>
          <Link to={`/admin/customers/${user._id}`} className="text-ink-secondary no-underline" style={{ fontSize: '16px', fontWeight: 500, padding: '8px 16px' }}>Cancel</Link>
          <button
            onClick={() => toast.show('Unblock is in demo mode — no backend endpoint available')}
            className="bg-success-text text-white"
            style={{ borderRadius: 'var(--radius-pill)', padding: '8px 24px', fontSize: '16px', fontWeight: 500, height: '48px' }}
          >
            Unblock Customer
          </button>
        </div>
      </div>
    </div>
  );
}