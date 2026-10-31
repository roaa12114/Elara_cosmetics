import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Camera, FileText, Upload } from 'lucide-react';
import { AdminNavbar } from '../components/AdminNavbar';
import { useAdminSellers } from '@shared/hooks/useAdminSellers';
import { getSellerProfile } from '../data/adminSellerStaticData';
import { useToast } from '@/shared/ui';
import { initialsOf } from '@shared/lib/utils';

function Field({ label, defaultValue }: { label: string; defaultValue?: string }) {
  return (
    <div className="flex flex-col" style={{ gap: '6px' }}>
      <label className="text-ink-secondary" style={{ fontSize: '14px' }}>{label}</label>
      <input type="text" defaultValue={defaultValue} className="w-full bg-white text-ink" style={{ border: '1px solid var(--color-line)', borderRadius: '8px', padding: '12px', fontSize: '14px', height: '40px' }} />
    </div>
  );
}

export function AdminEditSellerPage() {
  const { id } = useParams();
  const toast = useToast();
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
  const nameParts = seller.name.split(' ');
  const firstName = nameParts[0] || '';
  const lastName = nameParts.slice(1).join(' ') || '';

  return (
    <div className="flex flex-col min-h-screen">
      <AdminNavbar />
      <div className="flex flex-col" style={{ padding: '32px', gap: '24px', maxWidth: '800px' }}>
        <Link to={`/admin/sellers/${seller._id}`} className="flex items-center text-ink-secondary hover:text-ink no-underline" style={{ gap: '8px', fontSize: '16px' }}>
          <ArrowLeft className="w-5 h-5" /> Back to Seller
        </Link>
        <h1 className="font-bold text-ink" style={{ fontSize: '20px' }}>Edit Seller Profile</h1>

        <div className="bg-white" style={{ border: '1px solid var(--color-line)', borderRadius: '8px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Profile photo */}
          <div className="flex items-center" style={{ gap: '16px' }}>
            <div className="rounded-full bg-primary text-brand font-bold flex items-center justify-center" style={{ width: '80px', height: '80px', fontSize: '28px' }}>
              {initialsOf(seller.name)}
            </div>
            <div>
              <p className="text-ink" style={{ fontSize: '14px' }}>Profile Photo</p>
              <p className="text-ink-faint" style={{ fontSize: '12px' }}>JPG or PNG. Recommended 400x400px</p>
              <button className="flex items-center bg-ink text-white mt-2" style={{ borderRadius: 'var(--radius-pill)', padding: '6px 12px', gap: '6px', fontSize: '12px' }}>
                <Camera className="w-3 h-3" /> Change Photo
              </button>
            </div>
          </div>

          {/* Personal info */}
          <div>
            <h3 className="font-bold text-ink" style={{ fontSize: '14px', marginBottom: '12px' }}>Personal Information</h3>
            <div className="grid grid-cols-2" style={{ gap: '16px' }}>
              <Field label="First Name" defaultValue={firstName} />
              <Field label="Last Name" defaultValue={lastName} />
              <Field label="Email" defaultValue={seller.email} />
              <Field label="Phone" defaultValue={seller.phone || ''} />
            </div>
          </div>

          {/* Business info */}
          <div>
            <h3 className="font-bold text-ink" style={{ fontSize: '14px', marginBottom: '12px' }}>Business Information</h3>
            <div className="grid grid-cols-2" style={{ gap: '16px' }}>
              <Field label="Store Name" defaultValue={profile.storeName} />
              <Field label="Business Type" defaultValue={profile.businessType} />
            </div>
          </div>

          {/* Address */}
          <div>
            <h3 className="font-bold text-ink" style={{ fontSize: '14px', marginBottom: '12px' }}>Address</h3>
            <div className="grid grid-cols-2" style={{ gap: '16px' }}>
              <Field label="Street Address" defaultValue={seller.address?.street || ''} />
              <Field label="City" defaultValue={seller.address?.city || ''} />
              <Field label="State" defaultValue={seller.address?.state || ''} />
              <Field label="ZIP Code" defaultValue={seller.address?.postalCode || ''} />
            </div>
            <div style={{ marginTop: '16px' }}>
              <Field label="Country" defaultValue={seller.address?.country || ''} />
            </div>
          </div>

          {/* Seller status */}
          <div>
            <label className="text-ink-secondary" style={{ fontSize: '14px', marginBottom: '6px', display: 'block' }}>Seller Status</label>
            <span className="inline-flex items-center" style={{ background: 'var(--color-status-delivered-bg)', color: 'var(--color-success-text)', borderRadius: '6px', padding: '8px 16px', fontSize: '14px', fontWeight: 500 }}>
              {seller.isActive ? 'Active' : 'Blocked'}
            </span>
          </div>

          {/* Verification documents */}
          <div>
            <h3 className="font-bold text-ink" style={{ fontSize: '14px', marginBottom: '12px' }}>Verification Documents</h3>
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
              <div className="flex flex-col items-center justify-center" style={{ border: '2px dashed var(--color-line)', borderRadius: '8px', padding: '24px', gap: '8px' }}>
                <Upload className="w-6 h-6 text-ink-faint" />
                <p className="text-ink-faint" style={{ fontSize: '12px' }}>Upload additional documents (PDF, JPG, PNG. Max 10MB)</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end" style={{ gap: '12px' }}>
          <Link to={`/admin/sellers/${seller._id}`} className="text-ink-secondary no-underline" style={{ fontSize: '16px', fontWeight: 500, padding: '8px 16px' }}>Cancel</Link>
          <button onClick={() => toast.show('Profile editing is in demo mode — no PATCH endpoint available')} className="bg-ink text-white" style={{ borderRadius: 'var(--radius-pill)', padding: '8px 24px', fontSize: '16px', fontWeight: 500, height: '48px' }}>Save Changes</button>
        </div>
      </div>
    </div>
  );
}