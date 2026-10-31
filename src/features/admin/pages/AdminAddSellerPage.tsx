import { Link } from 'react-router-dom';
import { Camera, Upload } from 'lucide-react';
import { AdminNavbar } from '../components/AdminNavbar';
import { useToast } from '@/shared/ui';

function Field({ label, type = 'text', placeholder = 'Type Something' }: { label: string; type?: string; placeholder?: string }) {
  return (
    <div className="flex flex-col" style={{ gap: '6px' }}>
      <label className="text-ink-secondary" style={{ fontSize: '14px' }}>{label}</label>
      <input type={type} placeholder={placeholder} className="w-full bg-white text-ink" style={{ border: '1px solid var(--color-line)', borderRadius: '8px', padding: '12px', fontSize: '14px', height: '40px' }} />
    </div>
  );
}

export function AdminAddSellerPage() {
  const toast = useToast();
  return (
    <div className="flex flex-col min-h-screen">
      <AdminNavbar />
      <div className="flex flex-col" style={{ padding: '32px', gap: '24px', maxWidth: '800px' }}>
        <nav className="flex items-center text-ink-faint" style={{ gap: '8px', fontSize: '14px' }}>
          <Link to="/admin" className="hover:text-ink no-underline">Home</Link><span>/</span>
          <Link to="/admin/sellers" className="hover:text-ink no-underline">Seller</Link><span>/</span>
          <span className="text-ink font-medium">Add Profile</span>
        </nav>
        <h1 className="font-bold text-ink" style={{ fontSize: '20px' }}>Add Profile</h1>

        <div className="bg-white" style={{ border: '1px solid var(--color-line)', borderRadius: '8px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Profile photo */}
          <div className="flex items-center" style={{ gap: '16px' }}>
            <div className="rounded-full bg-primary-light flex items-center justify-center" style={{ width: '80px', height: '80px' }}>
              <Camera className="w-8 h-8 text-ink-faint" />
            </div>
            <div>
              <p className="text-ink" style={{ fontSize: '14px' }}>Profile Photo</p>
              <p className="text-ink-faint" style={{ fontSize: '12px' }}>JPG or PNG. Recommended 400x400px</p>
            </div>
          </div>

          {/* Personal info */}
          <div>
            <h3 className="font-bold text-ink" style={{ fontSize: '14px', marginBottom: '12px' }}>Personal Information</h3>
            <div className="grid grid-cols-2" style={{ gap: '16px' }}>
              <Field label="First Name" />
              <Field label="Last Name" />
              <Field label="Email Address" type="email" />
              <Field label="Phone Number" type="tel" />
            </div>
          </div>

          {/* Business info */}
          <div>
            <h3 className="font-bold text-ink" style={{ fontSize: '14px', marginBottom: '12px' }}>Business Information</h3>
            <div className="grid grid-cols-2" style={{ gap: '16px' }}>
              <Field label="Store Name" />
              <Field label="Business Type" placeholder="e.g. Skincare & Cosmetics" />
            </div>
          </div>

          {/* Address */}
          <div>
            <h3 className="font-bold text-ink" style={{ fontSize: '14px', marginBottom: '12px' }}>Address</h3>
            <div className="grid grid-cols-2" style={{ gap: '16px' }}>
              <Field label="Street Address" />
              <Field label="City" />
              <Field label="State" />
              <Field label="ZIP Code" />
            </div>
            <div style={{ marginTop: '16px' }}>
              <Field label="Country" />
            </div>
          </div>

          {/* Seller status */}
          <div>
            <label className="text-ink-secondary" style={{ fontSize: '14px', marginBottom: '6px', display: 'block' }}>Seller Status</label>
            <select className="w-full bg-white text-ink" style={{ border: '1px solid var(--color-line)', borderRadius: '8px', padding: '12px', fontSize: '14px', height: '40px' }}>
              <option>Active</option>
              <option>Pending</option>
              <option>Blocked</option>
            </select>
          </div>

          {/* Verification documents */}
          <div>
            <h3 className="font-bold text-ink" style={{ fontSize: '14px', marginBottom: '12px' }}>Verification Documents</h3>
            <div className="flex flex-col items-center justify-center" style={{ border: '2px dashed var(--color-line)', borderRadius: '8px', padding: '32px', gap: '8px' }}>
              <Upload className="w-8 h-8 text-ink-faint" />
              <p className="text-ink" style={{ fontSize: '14px' }}>Drop files here or click to upload</p>
              <p className="text-ink-faint" style={{ fontSize: '12px' }}>PDF, JPG, or PNG. Max 10MB per file.</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end" style={{ gap: '12px' }}>
          <Link to="/admin/sellers" className="text-ink-secondary no-underline" style={{ fontSize: '16px', fontWeight: 500, padding: '8px 16px' }}>Cancel</Link>
          <button onClick={() => toast.show('Seller creation is in demo mode — no backend endpoint available')} className="bg-ink text-white" style={{ borderRadius: 'var(--radius-pill)', padding: '8px 24px', fontSize: '16px', fontWeight: 500, height: '48px' }}>Save</button>
        </div>
      </div>
    </div>
  );
}