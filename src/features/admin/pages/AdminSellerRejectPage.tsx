import { Link, useParams } from 'react-router-dom';
import { XCircle, AlertTriangle } from 'lucide-react';
import { AdminNavbar } from '../components/AdminNavbar';
import { useAdminSellers } from '@shared/hooks/useAdminSellers';
import { getSellerProfile, sellerRejectReasons } from '../data/adminSellerStaticData';
import { useToast } from '@/shared/ui';

export function AdminSellerRejectPage() {
  const { id } = useParams();
  const toast = useToast();
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
          <span className="text-ink font-medium">Reject Seller</span>
        </nav>

        {/* Warning banner */}
        <div className="flex items-center" style={{ background: 'var(--color-status-shipped-bg)', borderRadius: '8px', padding: '16px', gap: '12px' }}>
          <AlertTriangle className="w-5 h-5 text-danger-dark" />
          <p className="text-danger-dark" style={{ fontSize: '14px' }}>You are rejecting this seller application. This action will notify the applicant immediately.</p>
        </div>

        {/* Application overview */}
        <div className="bg-white" style={{ border: '1px solid var(--color-line)', borderRadius: '8px', padding: '24px' }}>
          <h3 className="font-bold text-ink" style={{ fontSize: '16px', marginBottom: '16px' }}>Application Overview</h3>
          <div className="grid grid-cols-2" style={{ gap: '16px' }}>
            <div><span className="text-ink-faint" style={{ fontSize: '12px', textTransform: 'uppercase' }}>Applicant</span><p className="text-ink" style={{ fontSize: '14px' }}>{seller.name}</p></div>
            <div><span className="text-ink-faint" style={{ fontSize: '12px', textTransform: 'uppercase' }}>Store Name</span><p className="text-ink" style={{ fontSize: '14px' }}>{profile.storeName}</p></div>
            <div><span className="text-ink-faint" style={{ fontSize: '12px', textTransform: 'uppercase' }}>Business Type</span><p className="text-ink" style={{ fontSize: '14px' }}>{profile.businessType}</p></div>
            <div><span className="text-ink-faint" style={{ fontSize: '12px', textTransform: 'uppercase' }}>Application Date</span><p className="text-ink" style={{ fontSize: '14px' }}>{profile.applicationDate}</p></div>
          </div>
        </div>

        {/* Rejection reasons */}
        <div className="bg-white" style={{ border: '1px solid var(--color-line)', borderRadius: '8px', padding: '24px' }}>
          <h3 className="font-bold text-ink" style={{ fontSize: '16px', marginBottom: '16px' }}>Rejection Reasons</h3>
          <div className="flex flex-col" style={{ gap: '12px' }}>
            {sellerRejectReasons.map((reason, i) => (
              <label key={reason} className="flex items-center text-ink" style={{ gap: '8px', fontSize: '14px' }}>
                <input type="checkbox" defaultChecked={i === 0} /> {reason}
              </label>
            ))}
          </div>
          <div style={{ marginTop: '16px' }}>
            <label className="text-ink-secondary" style={{ fontSize: '14px', marginBottom: '6px', display: 'block' }}>Rejection Notes</label>
            <textarea placeholder="Provide details for the rejection (applicant will be notified)..." rows={3} className="w-full bg-white text-ink" style={{ border: '1px solid var(--color-line)', borderRadius: '8px', padding: '12px', fontSize: '14px', resize: 'vertical' }} />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end" style={{ gap: '12px' }}>
          <Link to={`/admin/sellers/${seller._id}/application`} className="text-ink-secondary no-underline" style={{ fontSize: '16px', fontWeight: 500, padding: '8px 16px' }}>Cancel</Link>
          <Link to={`/admin/sellers/${seller._id}/rejected`} onClick={() => toast.show('Rejection is in demo mode — no backend endpoint')} className="flex items-center bg-danger-dark text-white no-underline" style={{ borderRadius: 'var(--radius-pill)', padding: '8px 24px', fontSize: '16px', fontWeight: 500, height: '48px', gap: '8px' }}>
            <XCircle className="w-5 h-5" /> Reject Seller
          </Link>
        </div>
      </div>
    </div>
  );
}