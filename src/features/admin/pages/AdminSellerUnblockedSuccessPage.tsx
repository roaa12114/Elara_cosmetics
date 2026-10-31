import { Link, useParams } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import { AdminNavbar } from '../components/AdminNavbar';
import { useAdminSellers } from '@shared/hooks/useAdminSellers';
import { getSellerProfile } from '../data/adminSellerStaticData';
import { formatDate, initialsOf } from '@shared/lib/utils';

export function AdminSellerUnblockedSuccessPage() {
  const { id } = useParams();
  const { data } = useAdminSellers({ limit: 100 });
  const seller = data?.sellers?.find((s) => s._id === id);
  const profile = seller ? getSellerProfile(seller._id) : null;

  return (
    <div className="flex flex-col min-h-screen">
      <AdminNavbar />
      <div className="flex flex-col" style={{ padding: '32px', gap: '24px', maxWidth: '700px' }}>
        <nav className="flex items-center text-ink-faint" style={{ gap: '8px', fontSize: '14px' }}>
          <Link to="/admin" className="hover:text-ink no-underline">Home</Link><span>/</span>
          <Link to="/admin/sellers" className="hover:text-ink no-underline">Seller</Link><span>/</span>
          <span className="text-ink font-medium">Seller Unblocked</span>
        </nav>

        {/* Success banner */}
        <div className="flex items-center" style={{ background: 'var(--color-status-delivered-bg)', borderRadius: '8px', padding: '20px', gap: '12px' }}>
          <CheckCircle2 className="w-6 h-6 text-success-text" />
          <p className="text-success-text" style={{ fontSize: '16px', fontWeight: 500 }}>
            Seller unblocked successfully! {seller?.name ?? 'Seller'}'s account has been restored with full selling privileges.
          </p>
        </div>

        {seller && profile && (
          <div className="bg-white" style={{ border: '1px solid var(--color-line)', borderRadius: '8px', padding: '24px' }}>
            <div className="flex items-center" style={{ gap: '16px' }}>
              <div className="rounded-full bg-primary text-brand font-bold flex items-center justify-center" style={{ width: '56px', height: '56px', fontSize: '20px' }}>
                {initialsOf(seller.name)}
              </div>
              <div>
                <h2 className="font-bold text-ink" style={{ fontSize: '20px' }}>{seller.name}</h2>
                <p className="text-ink-faint" style={{ fontSize: '14px' }}>{seller.email}</p>
                <p className="text-ink-faint" style={{ fontSize: '14px' }}>{seller.phone || ''}</p>
                <span className="inline-flex items-center mt-1" style={{ background: 'var(--color-status-delivered-bg)', color: 'var(--color-success-text)', borderRadius: '6px', padding: '4px 10px', fontSize: '12px', fontWeight: 500 }}>Active</span>
              </div>
            </div>
            <div className="grid grid-cols-2" style={{ gap: '16px', marginTop: '20px' }}>
              <div><span className="text-ink-faint" style={{ fontSize: '12px', textTransform: 'uppercase' }}>Store Name</span><p className="text-ink" style={{ fontSize: '14px' }}>{profile.storeName}</p></div>
              <div><span className="text-ink-faint" style={{ fontSize: '12px', textTransform: 'uppercase' }}>Business Type</span><p className="text-ink" style={{ fontSize: '14px' }}>{profile.businessType}</p></div>
              <div><span className="text-ink-faint" style={{ fontSize: '12px', textTransform: 'uppercase' }}>Joined</span><p className="text-ink" style={{ fontSize: '14px' }}>{formatDate(seller.createdAt)}</p></div>
              <div><span className="text-ink-faint" style={{ fontSize: '12px', textTransform: 'uppercase' }}>Account Status</span><p className="text-ink" style={{ fontSize: '14px' }}>Active</p></div>
            </div>
            <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--color-line)' }}>
              <span className="text-ink-faint" style={{ fontSize: '12px' }}>Restored: Just now</span>
            </div>
          </div>
        )}

        <div className="flex justify-end">
          <Link to="/admin/sellers" className="bg-ink text-white no-underline" style={{ borderRadius: 'var(--radius-pill)', padding: '8px 32px', fontSize: '16px', fontWeight: 500, height: '48px' }}>Done</Link>
        </div>
      </div>
    </div>
  );
}