import { Link, useParams } from 'react-router-dom';
import { XCircle } from 'lucide-react';
import { AdminNavbar } from '../components/AdminNavbar';
import { useAdminUsers } from '@shared/hooks/useAdminUsers';
import { formatDate, initialsOf } from '@shared/lib/utils';

export function AdminRejectedSuccessPage() {
  const { id } = useParams();
  const { data } = useAdminUsers({ role: 'customer', limit: 100 });
  const user = data?.users?.find((u) => u._id === id);

  return (
    <div className="flex flex-col min-h-screen">
      <AdminNavbar />
      <div className="flex flex-col" style={{ padding: '32px', gap: '24px', maxWidth: '700px' }}>
        <nav className="flex items-center text-ink-faint" style={{ gap: '8px', fontSize: '14px' }}>
          <Link to="/admin" className="hover:text-ink no-underline">Home</Link>
          <span>/</span>
          <Link to="/admin/customers" className="hover:text-ink no-underline">Customer</Link>
          <span>/</span>
          <span className="text-ink font-medium">Customer Rejected</span>
        </nav>

        {/* Rejection banner */}
        <div className="flex items-center" style={{ background: 'var(--color-status-shipped-bg)', borderRadius: '8px', padding: '20px', gap: '12px' }}>
          <XCircle className="w-6 h-6 text-danger-dark" />
          <p className="text-danger-dark" style={{ fontSize: '16px', fontWeight: 500 }}>
            Customer application rejected. {user?.name ?? 'Applicant'} has been notified and their account access has been denied.
          </p>
        </div>

        {user && (
          <div className="bg-white" style={{ border: '1px solid var(--color-line)', borderRadius: '8px', padding: '24px' }}>
            <div className="flex items-center" style={{ gap: '16px' }}>
              <div className="rounded-full bg-primary text-brand font-bold flex items-center justify-center" style={{ width: '56px', height: '56px', fontSize: '20px' }}>
                {initialsOf(user.name)}
              </div>
              <div>
                <h2 className="font-bold text-ink" style={{ fontSize: '20px' }}>{user.name}</h2>
                <p className="text-ink-faint" style={{ fontSize: '14px' }}>{user.email}</p>
                <span className="inline-flex items-center" style={{ background: 'var(--color-status-out-of-stock-bg)', color: '#171315', borderRadius: '6px', padding: '4px 10px', fontSize: '12px', fontWeight: 500 }}>Rejected</span>
              </div>
            </div>
            <div className="grid grid-cols-2" style={{ gap: '16px', marginTop: '20px' }}>
              <div><span className="text-ink-faint" style={{ fontSize: '12px', textTransform: 'uppercase' }}>Application #</span><p className="text-ink" style={{ fontSize: '14px' }}>#APP-2024-203</p></div>
              <div><span className="text-ink-faint" style={{ fontSize: '12px', textTransform: 'uppercase' }}>Submission Date</span><p className="text-ink" style={{ fontSize: '14px' }}>{formatDate(user.createdAt)}</p></div>
              <div><span className="text-ink-faint" style={{ fontSize: '12px', textTransform: 'uppercase' }}>Account Type</span><p className="text-ink" style={{ fontSize: '14px' }}>Standard Customer</p></div>
              <div><span className="text-ink-faint" style={{ fontSize: '12px', textTransform: 'uppercase' }}>Phone</span><p className="text-ink" style={{ fontSize: '14px' }}>{user.phone || '—'}</p></div>
            </div>
            <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--color-line)' }}>
              <span className="text-ink-faint" style={{ fontSize: '12px', textTransform: 'uppercase' }}>Rejection Reasons</span>
              <p className="text-ink" style={{ fontSize: '14px', marginTop: '4px' }}>Incomplete identity verification documents; Invalid or expired ID document</p>
            </div>
          </div>
        )}

        <div className="flex justify-end">
          <Link to="/admin/customers" className="bg-ink text-white no-underline" style={{ borderRadius: 'var(--radius-pill)', padding: '8px 32px', fontSize: '16px', fontWeight: 500, height: '48px' }}>Done</Link>
        </div>
      </div>
    </div>
  );
}