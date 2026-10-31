import { Link, useParams } from 'react-router-dom';
import { XCircle, AlertTriangle } from 'lucide-react';
import { AdminNavbar } from '../components/AdminNavbar';
import { useAdminUsers } from '@shared/hooks/useAdminUsers';
import { useToast } from '@/shared/ui';
import { formatDate } from '@shared/lib/utils';

const REJECT_REASONS = [
  'Incomplete identity verification documents',
  'Invalid or expired ID document',
  'Address verification failed',
  'Other',
];

export function AdminRejectCustomerPage() {
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
        <nav className="flex items-center text-ink-faint" style={{ gap: '8px', fontSize: '14px' }}>
          <Link to="/admin" className="hover:text-ink no-underline">Home</Link>
          <span>/</span>
          <Link to="/admin/customers" className="hover:text-ink no-underline">Customer</Link>
          <span>/</span>
          <span className="text-ink font-medium">Reject Customer</span>
        </nav>

        <div className="flex items-center" style={{ background: 'var(--color-status-shipped-bg)', borderRadius: '8px', padding: '16px', gap: '12px' }}>
          <AlertTriangle className="w-5 h-5 text-danger-dark" />
          <p className="text-danger-dark" style={{ fontSize: '14px' }}>Rejecting this customer will immediately notify them and deny their account access.</p>
        </div>

        <div className="bg-white" style={{ border: '1px solid var(--color-line)', borderRadius: '8px', padding: '24px' }}>
          <h3 className="font-bold text-ink" style={{ fontSize: '16px', marginBottom: '16px' }}>Application Overview</h3>
          <div className="grid grid-cols-2" style={{ gap: '16px' }}>
            <div><span className="text-ink-faint" style={{ fontSize: '12px', textTransform: 'uppercase' }}>Applicant</span><p className="text-ink" style={{ fontSize: '14px' }}>{user.name}</p></div>
            <div><span className="text-ink-faint" style={{ fontSize: '12px', textTransform: 'uppercase' }}>Email</span><p className="text-ink" style={{ fontSize: '14px' }}>{user.email}</p></div>
            <div><span className="text-ink-faint" style={{ fontSize: '12px', textTransform: 'uppercase' }}>Phone</span><p className="text-ink" style={{ fontSize: '14px' }}>{user.phone || '—'}</p></div>
            <div><span className="text-ink-faint" style={{ fontSize: '12px', textTransform: 'uppercase' }}>Applied</span><p className="text-ink" style={{ fontSize: '14px' }}>{formatDate(user.createdAt)}</p></div>
          </div>
        </div>

        <div className="bg-white" style={{ border: '1px solid var(--color-line)', borderRadius: '8px', padding: '24px' }}>
          <h3 className="font-bold text-ink" style={{ fontSize: '16px', marginBottom: '16px' }}>Rejection Reasons</h3>
          <div className="flex flex-col" style={{ gap: '12px' }}>
            {REJECT_REASONS.map((reason, i) => (
              <label key={reason} className="flex items-center text-ink" style={{ gap: '8px', fontSize: '14px' }}>
                <input type="checkbox" defaultChecked={i === 0} /> {reason}
              </label>
            ))}
          </div>
          <div style={{ marginTop: '16px' }}>
            <label className="text-ink-secondary" style={{ fontSize: '14px', marginBottom: '6px', display: 'block' }}>Rejection Notes</label>
            <textarea
              placeholder="Provide details for the rejection (applicant will be notified)..."
              rows={3}
              className="w-full bg-white text-ink"
              style={{ border: '1px solid var(--color-line)', borderRadius: '8px', padding: '12px', fontSize: '14px', resize: 'vertical' }}
            />
          </div>
        </div>

        <div className="flex items-center justify-end" style={{ gap: '12px' }}>
          <Link to={`/admin/customers/${user._id}`} className="text-ink-secondary no-underline" style={{ fontSize: '16px', fontWeight: 500, padding: '8px 16px' }}>Cancel</Link>
          <Link
            to={`/admin/customers/${user._id}/rejected`}
            onClick={() => toast.show('Rejection is in demo mode — no backend endpoint')}
            className="flex items-center bg-danger-dark text-white no-underline"
            style={{ borderRadius: 'var(--radius-pill)', padding: '8px 24px', fontSize: '16px', fontWeight: 500, height: '48px', gap: '8px' }}
          >
            <XCircle className="w-5 h-5" /> Reject Customer
          </Link>
        </div>
      </div>
    </div>
  );
}