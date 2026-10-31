import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, FileText, CheckCircle2, XCircle } from 'lucide-react';
import { AdminNavbar } from '../components/AdminNavbar';
import { useAdminSellers } from '@shared/hooks/useAdminSellers';
import { getSellerProfile } from '../data/adminSellerStaticData';
import { initialsOf } from '@shared/lib/utils';

export function AdminSellerApplicationPage() {
  const { id } = useParams();
  const { data, isLoading } = useAdminSellers({ limit: 100 });
  const seller = data?.sellers?.find((s) => s._id === id);

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <AdminNavbar />
        <div className="flex-1 flex items-center justify-center"><p className="text-ink-faint">Loading...</p></div>
      </div>
    );
  }
  if (!seller) {
    return (
      <div className="flex flex-col min-h-screen">
        <AdminNavbar />
        <div className="flex-1 flex items-center justify-center"><p className="text-ink">Seller not found</p></div>
      </div>
    );
  }

  const profile = getSellerProfile(seller._id);
  const isApproved = !!profile.approvedBy;

  return (
    <div className="flex flex-col min-h-screen">
      <AdminNavbar />
      <div className="flex flex-col" style={{ padding: '32px', gap: '24px', maxWidth: '800px' }}>
        <Link to={`/admin/sellers/${seller._id}`} className="flex items-center text-ink-secondary hover:text-ink no-underline" style={{ gap: '8px', fontSize: '16px' }}>
          <ArrowLeft className="w-5 h-5" /> Back to Seller
        </Link>

        {/* Application header */}
        <div className="bg-white" style={{ border: '1px solid var(--color-line)', borderRadius: '8px', padding: '24px' }}>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-bold text-ink" style={{ fontSize: '20px' }}>Application {profile.applicationId}</h1>
              <p className="text-ink-faint" style={{ fontSize: '14px', marginTop: '4px' }}>Submitted {profile.applicationDate}</p>
            </div>
            <span className="inline-flex items-center justify-center" style={{
              background: isApproved ? 'var(--color-status-delivered-bg)' : 'var(--color-status-pending-bg)',
              color: isApproved ? 'var(--color-success-text)' : 'var(--color-warning-text)',
              borderRadius: '6px', padding: '6px 16px', fontSize: '14px', fontWeight: 500,
            }}>
              {isApproved ? 'Approved' : 'Pending'}
            </span>
          </div>
        </div>

        {/* Applicant info */}
        <div className="bg-white" style={{ border: '1px solid var(--color-line)', borderRadius: '8px', padding: '24px' }}>
          <div className="flex items-center" style={{ gap: '16px' }}>
            <div className="rounded-full bg-primary text-brand font-bold flex items-center justify-center" style={{ width: '56px', height: '56px', fontSize: '20px' }}>
              {initialsOf(seller.name)}
            </div>
            <div>
              <h2 className="font-bold text-ink" style={{ fontSize: '18px' }}>{seller.name}</h2>
              <p className="text-ink-faint" style={{ fontSize: '14px' }}>{profile.applicantTitle || 'Seller'}</p>
              <p className="text-ink-faint" style={{ fontSize: '14px' }}>{seller.email}</p>
              <p className="text-ink-faint" style={{ fontSize: '14px' }}>{profile.applicantAddress || '—'}</p>
            </div>
          </div>
        </div>

        {/* Business info */}
        <div className="bg-white" style={{ border: '1px solid var(--color-line)', borderRadius: '8px', padding: '24px' }}>
          <h3 className="font-bold text-ink" style={{ fontSize: '16px', marginBottom: '16px' }}>Business Information</h3>
          <div className="grid grid-cols-2" style={{ gap: '16px' }}>
            <div><span className="text-ink-faint" style={{ fontSize: '12px', textTransform: 'uppercase' }}>Registered Entity</span><p className="text-ink" style={{ fontSize: '14px' }}>{profile.registeredEntity || profile.storeName}</p></div>
            <div><span className="text-ink-faint" style={{ fontSize: '12px', textTransform: 'uppercase' }}>Specialty</span><p className="text-ink" style={{ fontSize: '14px' }}>{profile.specialty || '—'}</p></div>
            <div><span className="text-ink-faint" style={{ fontSize: '12px', textTransform: 'uppercase' }}>Store Name</span><p className="text-ink" style={{ fontSize: '14px' }}>{profile.storeName}</p></div>
            <div><span className="text-ink-faint" style={{ fontSize: '12px', textTransform: 'uppercase' }}>Business Type</span><p className="text-ink" style={{ fontSize: '14px' }}>{profile.businessType}</p></div>
          </div>
          {profile.storeDescription && (
            <div style={{ marginTop: '16px' }}>
              <span className="text-ink-faint" style={{ fontSize: '12px', textTransform: 'uppercase' }}>Description</span>
              <p className="text-ink" style={{ fontSize: '14px', marginTop: '4px' }}>{profile.storeDescription}</p>
            </div>
          )}
        </div>

        {/* Verification documents */}
        <div className="bg-white" style={{ border: '1px solid var(--color-line)', borderRadius: '8px', padding: '24px' }}>
          <h3 className="font-bold text-ink" style={{ fontSize: '16px', marginBottom: '16px' }}>Verification Documents</h3>
          <div className="flex flex-col" style={{ gap: '12px' }}>
            {profile.verificationDocuments.map((doc) => (
              <div key={doc.name} className="flex items-center justify-between" style={{ padding: '12px', background: 'var(--color-surface)', borderRadius: '8px' }}>
                <div className="flex items-center" style={{ gap: '8px' }}>
                  <FileText className="w-5 h-5 text-brand" />
                  <div>
                    <span className="text-ink" style={{ fontSize: '14px' }}>{doc.name}</span><br />
                    <span className="text-ink-faint" style={{ fontSize: '12px' }}>{doc.size}</span>
                  </div>
                </div>
                <button className="text-brand" style={{ fontSize: '14px' }}>View</button>
              </div>
            ))}
          </div>
        </div>

        {/* Review result */}
        {isApproved && (
          <div className="bg-white" style={{ border: '1px solid var(--color-line)', borderRadius: '8px', padding: '24px' }}>
            <h3 className="font-bold text-ink" style={{ fontSize: '16px', marginBottom: '16px' }}>Review Result</h3>
            <div className="grid grid-cols-2" style={{ gap: '16px' }}>
              <div><span className="text-ink-faint" style={{ fontSize: '12px', textTransform: 'uppercase' }}>Status</span><p className="text-ink" style={{ fontSize: '14px' }}>Approved</p></div>
              <div><span className="text-ink-faint" style={{ fontSize: '12px', textTransform: 'uppercase' }}>Approved By</span><p className="text-ink" style={{ fontSize: '14px' }}>{profile.approvedBy}</p></div>
              <div><span className="text-ink-faint" style={{ fontSize: '12px', textTransform: 'uppercase' }}>Date</span><p className="text-ink" style={{ fontSize: '14px' }}>{profile.approvedDate}</p></div>
            </div>
            {profile.reviewNotes && (
              <div style={{ marginTop: '16px' }}>
                <span className="text-ink-faint" style={{ fontSize: '12px', textTransform: 'uppercase' }}>Review Notes</span>
                <p className="text-ink" style={{ fontSize: '14px', marginTop: '4px' }}>{profile.reviewNotes}</p>
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-end" style={{ gap: '12px' }}>
          {!isApproved && (
            <>
              <Link to={`/admin/sellers/${seller._id}/reject`} className="flex items-center text-danger-dark no-underline" style={{ border: '1px solid var(--color-danger-dark)', borderRadius: 'var(--radius-pill)', padding: '8px 24px', fontSize: '16px', fontWeight: 500, height: '48px', gap: '8px' }}>
                <XCircle className="w-5 h-5" /> Reject
              </Link>
              <Link to={`/admin/sellers/${seller._id}/approve`} className="flex items-center bg-success-text text-white no-underline" style={{ borderRadius: 'var(--radius-pill)', padding: '8px 24px', fontSize: '16px', fontWeight: 500, height: '48px', gap: '8px' }}>
                <CheckCircle2 className="w-5 h-5" /> Approve Seller
              </Link>
            </>
          )}
          {isApproved && (
            <Link to={`/admin/sellers/${seller._id}/block`} className="flex items-center text-danger-dark no-underline" style={{ border: '1px solid var(--color-danger-dark)', borderRadius: 'var(--radius-pill)', padding: '8px 24px', fontSize: '16px', fontWeight: 500, height: '48px' }}>
              Block Seller
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}