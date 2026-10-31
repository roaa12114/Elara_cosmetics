import { Link, useParams } from 'react-router-dom';
import {  CheckCircle2, FileText } from 'lucide-react';
import { AdminNavbar } from '../components/AdminNavbar';
import { useAdminUsers } from '@shared/hooks/useAdminUsers';
import { formatDate } from '@shared/lib/utils';

export function AdminApproveCustomerPage() {
  const { id } = useParams();
  const { data } = useAdminUsers({ role: 'customer', limit: 100 });
  const user = data?.users?.find((u) => u._id === id);

  if (!user) return (<div className="flex flex-col min-h-screen"><AdminNavbar /><div className="flex-1 flex items-center justify-center"><p className="text-ink">Customer not found</p></div></div>);

  return (
    <div className="flex flex-col min-h-screen">
      <AdminNavbar />
      <div className="flex flex-col" style={{ padding: '32px', gap: '24px', maxWidth: '700px' }}>
        <nav className="flex items-center text-ink-faint" style={{ gap: '8px', fontSize: '14px' }}>
          <Link to="/admin" className="hover:text-ink no-underline">Home</Link><span>/</span>
          <Link to="/admin/customers" className="hover:text-ink no-underline">Customer</Link><span>/</span>
          <span className="text-ink font-medium">Approve Customer</span>
        </nav>

        {/* Customer info */}
        <div className="bg-white" style={{ border: '1px solid var(--color-line)', borderRadius: '8px', padding: '24px' }}>
          <div className="flex items-center" style={{ gap: '16px' }}>
            <div className="rounded-full bg-primary text-brand font-bold flex items-center justify-center" style={{ width: '56px', height: '56px', fontSize: '20px' }}>{user.name.split(' ').slice(0, 2).map((s) => s[0]?.toUpperCase()).join('')}</div>
            <div>
              <h2 className="font-bold text-ink" style={{ fontSize: '20px' }}>{user.name}</h2>
              <p className="text-ink-faint" style={{ fontSize: '14px' }}>{user.email}</p>
              <div className="flex items-center" style={{ gap: '8px', marginTop: '4px' }}>
                <span className="inline-flex items-center" style={{ background: 'var(--color-status-pending-bg)', color: 'var(--color-warning-text)', borderRadius: '6px', padding: '4px 10px', fontSize: '12px', fontWeight: 500 }}>Pending</span>
                <span className="text-ink-faint" style={{ fontSize: '14px' }}>Applied {formatDate(user.createdAt)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Application details */}
        <div className="bg-white" style={{ border: '1px solid var(--color-line)', borderRadius: '8px', padding: '24px' }}>
          <h3 className="font-bold text-ink" style={{ fontSize: '16px', marginBottom: '16px' }}>Application Details</h3>
          <div className="grid grid-cols-2" style={{ gap: '16px' }}>
            <div><span className="text-ink-faint" style={{ fontSize: '12px', textTransform: 'uppercase' }}>Application #</span><p className="text-ink" style={{ fontSize: '14px' }}>#APP-2024-156</p></div>
            <div><span className="text-ink-faint" style={{ fontSize: '12px', textTransform: 'uppercase' }}>Submission Date</span><p className="text-ink" style={{ fontSize: '14px' }}>{formatDate(user.createdAt)}</p></div>
            <div><span className="text-ink-faint" style={{ fontSize: '12px', textTransform: 'uppercase' }}>Account Type</span><p className="text-ink" style={{ fontSize: '14px' }}>Standard Customer</p></div>
            <div><span className="text-ink-faint" style={{ fontSize: '12px', textTransform: 'uppercase' }}>Phone</span><p className="text-ink" style={{ fontSize: '14px' }}>{user.phone || '—'}</p></div>
          </div>
        </div>

        {/* Verification documents */}
        <div className="bg-white" style={{ border: '1px solid var(--color-line)', borderRadius: '8px', padding: '24px' }}>
          <h3 className="font-bold text-ink" style={{ fontSize: '16px', marginBottom: '16px' }}>Verification Documents</h3>
          <div className="flex flex-col" style={{ gap: '12px' }}>
            <div className="flex items-center justify-between" style={{ padding: '12px', background: 'var(--color-surface)', borderRadius: '8px' }}>
              <div className="flex items-center" style={{ gap: '8px' }}><FileText className="w-5 h-5 text-brand" /><div><span className="text-ink" style={{ fontSize: '14px' }}>government_id_scan.pdf</span><br /><span className="text-ink-faint" style={{ fontSize: '12px' }}>2.1 MB</span></div></div>
              <button className="text-brand" style={{ fontSize: '14px' }}>View</button>
            </div>
            <div className="flex items-center justify-between" style={{ padding: '12px', background: 'var(--color-surface)', borderRadius: '8px' }}>
              <div className="flex items-center" style={{ gap: '8px' }}><FileText className="w-5 h-5 text-brand" /><div><span className="text-ink" style={{ fontSize: '14px' }}>proof_of_address.pdf</span><br /><span className="text-ink-faint" style={{ fontSize: '12px' }}>920 KB</span></div></div>
              <button className="text-brand" style={{ fontSize: '14px' }}>View</button>
            </div>
          </div>
        </div>

        {/* Admin notes */}
        <div className="bg-white" style={{ border: '1px solid var(--color-line)', borderRadius: '8px', padding: '16px' }}>
          <p className="text-ink-secondary" style={{ fontSize: '14px' }}>Applicant information has been verified and documents appear authentic. Recommend approval.</p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end" style={{ gap: '12px' }}>
          <Link to={`/admin/customers/${user._id}/reject`} className="flex items-center text-danger-dark no-underline" style={{ border: '1px solid var(--color-danger-dark)', borderRadius: 'var(--radius-pill)', padding: '8px 24px', fontSize: '16px', fontWeight: 500, height: '48px' }}>Reject</Link>
          <Link to={`/admin/customers/${user._id}/approved`} className="flex items-center bg-success-text text-white no-underline" style={{ borderRadius: 'var(--radius-pill)', padding: '8px 24px', fontSize: '16px', fontWeight: 500, height: '48px', gap: '8px' }}><CheckCircle2 className="w-5 h-5" /> Approve Customer</Link>
        </div>
      </div>
    </div>
  );
}