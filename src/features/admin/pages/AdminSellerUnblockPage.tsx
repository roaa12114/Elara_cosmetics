import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Shield } from 'lucide-react';
import { AdminNavbar } from '../components/AdminNavbar';
import { useAdminSellers } from '@shared/hooks/useAdminSellers';
import { getSellerProfile, sellerUnblockConditions } from '../data/adminSellerStaticData';
import { useToast } from '@/shared/ui';
import { formatDate } from '@shared/lib/utils';

export function AdminSellerUnblockPage() {
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
        <Link to={`/admin/sellers/${seller._id}`} className="flex items-center text-ink-secondary hover:text-ink no-underline" style={{ gap: '8px', fontSize: '16px' }}>
          <ArrowLeft className="w-5 h-5" /> Back to Seller
        </Link>

        {/* Restore banner */}
        <div className="flex items-center" style={{ background: 'var(--color-status-delivered-bg)', borderRadius: '8px', padding: '16px', gap: '12px' }}>
          <Shield className="w-5 h-5 text-success-text" />
          <p className="text-success-text" style={{ fontSize: '14px' }}>You are unblocking this seller account. This will restore their selling privileges.</p>
        </div>

        {/* Seller overview */}
        <div className="bg-white" style={{ border: '1px solid var(--color-line)', borderRadius: '8px', padding: '24px' }}>
          <h3 className="font-bold text-ink" style={{ fontSize: '16px', marginBottom: '16px' }}>Seller Overview</h3>
          <div className="grid grid-cols-2" style={{ gap: '16px' }}>
            <div><span className="text-ink-faint" style={{ fontSize: '12px', textTransform: 'uppercase' }}>Name</span><p className="text-ink" style={{ fontSize: '14px' }}>{seller.name}</p></div>
            <div><span className="text-ink-faint" style={{ fontSize: '12px', textTransform: 'uppercase' }}>Store Name</span><p className="text-ink" style={{ fontSize: '14px' }}>{profile.storeName}</p></div>
            <div><span className="text-ink-faint" style={{ fontSize: '12px', textTransform: 'uppercase' }}>Business Type</span><p className="text-ink" style={{ fontSize: '14px' }}>{profile.businessType}</p></div>
            <div><span className="text-ink-faint" style={{ fontSize: '12px', textTransform: 'uppercase' }}>Blocked Date</span><p className="text-ink" style={{ fontSize: '14px' }}>{profile.blockedDate || formatDate(seller.createdAt)}</p></div>
            <div><span className="text-ink-faint" style={{ fontSize: '12px', textTransform: 'uppercase' }}>Status</span><p className="text-ink" style={{ fontSize: '14px' }}>Blocked</p></div>
          </div>
        </div>

        {/* Block details */}
        <div className="bg-white" style={{ border: '1px solid var(--color-line)', borderRadius: '8px', padding: '24px' }}>
          <h3 className="font-bold text-ink" style={{ fontSize: '16px', marginBottom: '16px' }}>Block Details</h3>
          <div className="grid grid-cols-2" style={{ gap: '16px' }}>
            <div><span className="text-ink-faint" style={{ fontSize: '12px', textTransform: 'uppercase' }}>Block Reason</span><p className="text-ink" style={{ fontSize: '14px' }}>{profile.blockReason || 'Terms of service violation'}</p></div>
            <div><span className="text-ink-faint" style={{ fontSize: '12px', textTransform: 'uppercase' }}>Blocked By</span><p className="text-ink" style={{ fontSize: '14px' }}>{profile.blockedBy || 'Sarah Jenkins'}</p></div>
          </div>
        </div>

        {/* Unblock conditions */}
        <div className="bg-white" style={{ border: '1px solid var(--color-line)', borderRadius: '8px', padding: '24px' }}>
          <h3 className="font-bold text-ink" style={{ fontSize: '16px', marginBottom: '16px' }}>Unblock Conditions</h3>
          <div className="flex flex-col" style={{ gap: '12px' }}>
            {sellerUnblockConditions.map((cond, i) => (
              <label key={cond} className="flex items-center text-ink" style={{ gap: '8px', fontSize: '14px' }}>
                <input type="checkbox" defaultChecked={i < 3} /> {cond}
              </label>
            ))}
          </div>
          <div style={{ marginTop: '16px' }}>
            <label className="text-ink-secondary" style={{ fontSize: '14px', marginBottom: '6px', display: 'block' }}>Unblock Notes</label>
            <textarea placeholder="Additional notes for the unblock record..." rows={3} className="w-full bg-white text-ink" style={{ border: '1px solid var(--color-line)', borderRadius: '8px', padding: '12px', fontSize: '14px', resize: 'vertical' }} />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end" style={{ gap: '12px' }}>
          <Link to={`/admin/sellers/${seller._id}`} className="text-ink-secondary no-underline" style={{ fontSize: '16px', fontWeight: 500, padding: '8px 16px' }}>Cancel</Link>
          <Link to={`/admin/sellers/${seller._id}/unblocked`} onClick={() => toast.show('Unblock is in demo mode — no backend endpoint available')} className="flex items-center bg-success-text text-white no-underline" style={{ borderRadius: 'var(--radius-pill)', padding: '8px 24px', fontSize: '16px', fontWeight: 500, height: '48px' }}>Unblock Seller</Link>
        </div>
      </div>
    </div>
  );
}