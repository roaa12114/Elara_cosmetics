import { Link, useParams } from 'react-router-dom';
import { CheckCircle2, AlertTriangle } from 'lucide-react';
import { AdminNavbar } from '../components/AdminNavbar';
import { useAdminSellers } from '@shared/hooks/useAdminSellers';
import { getSellerProfile } from '../data/adminSellerStaticData';

export function AdminSellerApprovePage() {
  const { id } = useParams();
  const { data } = useAdminSellers({ limit: 100 });
  const seller = data?.sellers?.find((s) => s._id === id);

  if (!seller) {
    return (
      <div className="flex flex-col min-h-screen">
        <AdminNavbar />
        <div className="flex-1 flex items-center justify-center"><p className="text-ink">Seller not found</p></div>
      </div>
    );
  }

  const profile = getSellerProfile(seller._id);

  return (
    <div className="flex flex-col min-h-screen">
      <AdminNavbar />
      <div className="flex flex-col" style={{ padding: '32px', gap: '24px', maxWidth: '700px' }}>
        <nav className="flex items-center text-ink-faint" style={{ gap: '8px', fontSize: '14px' }}>
          <Link to="/admin" className="hover:text-ink no-underline">Home</Link><span>/</span>
          <Link to="/admin/sellers" className="hover:text-ink no-underline">Seller</Link><span>/</span>
          <span className="text-ink font-medium">Approve Seller</span>
        </nav>

        {/* Warning banner */}
        <div className="flex items-center" style={{ background: 'var(--color-status-pending-bg)', borderRadius: '8px', padding: '16px', gap: '12px' }}>
          <AlertTriangle className="w-5 h-5 text-warning-text" />
          <p className="text-ink" style={{ fontSize: '14px' }}>You are about to approve this seller application. This will grant the applicant full selling privileges.</p>
        </div>

        {/* Application overview */}
        <div className="bg-white" style={{ border: '1px solid var(--color-line)', borderRadius: '8px', padding: '24px' }}>
          <h3 className="font-bold text-ink" style={{ fontSize: '16px', marginBottom: '16px' }}>Application Overview</h3>
          <div className="grid grid-cols-2" style={{ gap: '16px' }}>
            <div><span className="text-ink-faint" style={{ fontSize: '12px', textTransform: 'uppercase' }}>Applicant</span><p className="text-ink" style={{ fontSize: '14px' }}>{seller.name}</p></div>
            <div><span className="text-ink-faint" style={{ fontSize: '12px', textTransform: 'uppercase' }}>Email</span><p className="text-ink" style={{ fontSize: '14px' }}>{seller.email}</p></div>
            <div><span className="text-ink-faint" style={{ fontSize: '12px', textTransform: 'uppercase' }}>Application #</span><p className="text-ink" style={{ fontSize: '14px' }}>{profile.applicationId}</p></div>
            <div><span className="text-ink-faint" style={{ fontSize: '12px', textTransform: 'uppercase' }}>Store Name</span><p className="text-ink" style={{ fontSize: '14px' }}>{profile.storeName}</p></div>
            <div><span className="text-ink-faint" style={{ fontSize: '12px', textTransform: 'uppercase' }}>Business Type</span><p className="text-ink" style={{ fontSize: '14px' }}>{profile.businessType}</p></div>
          </div>
        </div>

        {/* Confirmation card */}
        <div className="bg-white" style={{ border: '1px solid var(--color-line)', borderRadius: '8px', padding: '24px' }}>
          <h3 className="font-bold text-ink" style={{ fontSize: '16px', marginBottom: '16px' }}>Confirm Seller Approval</h3>
          <p className="text-ink-secondary" style={{ fontSize: '14px', marginBottom: '16px' }}>
            Are you sure you want to approve {seller.name} as a seller? Their product catalog will be activated immediately.
          </p>
          <div className="flex flex-col" style={{ gap: '8px', padding: '16px', background: 'var(--color-surface)', borderRadius: '8px' }}>
            <div className="flex justify-between"><span className="text-ink-faint" style={{ fontSize: '14px' }}>Applicant</span><span className="text-ink" style={{ fontSize: '14px' }}>{seller.name}</span></div>
            <div className="flex justify-between"><span className="text-ink-faint" style={{ fontSize: '14px' }}>Store</span><span className="text-ink" style={{ fontSize: '14px' }}>{profile.storeName}</span></div>
            <div className="flex justify-between"><span className="text-ink-faint" style={{ fontSize: '14px' }}>Business</span><span className="text-ink" style={{ fontSize: '14px' }}>{profile.businessType}</span></div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end" style={{ gap: '12px' }}>
          <Link to={`/admin/sellers/${seller._id}/application`} className="text-ink-secondary no-underline" style={{ fontSize: '16px', fontWeight: 500, padding: '8px 16px' }}>Cancel</Link>
          <Link to={`/admin/sellers/${seller._id}/approved`} className="flex items-center bg-success-text text-white no-underline" style={{ borderRadius: 'var(--radius-pill)', padding: '8px 24px', fontSize: '16px', fontWeight: 500, height: '48px', gap: '8px' }}>
            <CheckCircle2 className="w-5 h-5" /> Confirm Approval
          </Link>
        </div>
      </div>
    </div>
  );
}