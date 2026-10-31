import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { AdminNavbar } from '../components/AdminNavbar';
import { useToast } from '@/shared/ui';
import { storeInfo } from '../data/adminSettingsStaticData';

export function AdminSettingsStorePage() {
  const toast = useToast();
  return (
    <div className="flex flex-col min-h-screen">
      <AdminNavbar />
      <div className="flex flex-col" style={{ padding: '32px', gap: '24px', maxWidth: '700px' }}>
        <Link to="/admin/settings" className="flex items-center text-ink-secondary hover:text-ink no-underline" style={{ gap: '8px', fontSize: '16px' }}><ArrowLeft className="w-5 h-5" /> Back to Settings</Link>
        <h1 className="font-bold text-ink" style={{ fontSize: '20px' }}>Store</h1>

        {/* Store identity */}
        <div className="bg-white" style={{ border: '1px solid var(--color-line)', borderRadius: '8px', padding: '24px' }}>
          <div className="flex items-center justify-between" style={{ marginBottom: '16px' }}>
            <h3 className="font-bold text-ink" style={{ fontSize: '16px' }}>Store Identity</h3>
            <span className="inline-flex items-center" style={{ background: 'var(--color-status-delivered-bg)', color: 'var(--color-success-text)', borderRadius: '6px', padding: '4px 12px', fontSize: '12px', fontWeight: 500 }}>{storeInfo.status}</span>
          </div>
          <div className="flex items-center" style={{ gap: '16px' }}>
            <div className="rounded-card-sm bg-ink text-white font-bold flex items-center justify-center" style={{ width: '64px', height: '64px', fontSize: '28px' }}>e</div>
            <div>
              <p className="text-ink font-medium" style={{ fontSize: '16px' }}>{storeInfo.name}</p>
              <p className="text-ink-faint" style={{ fontSize: '14px' }}>Accepting orders</p>
            </div>
          </div>
        </div>

        {/* Store details */}
        <div className="bg-white" style={{ border: '1px solid var(--color-line)', borderRadius: '8px', padding: '24px' }}>
          <h3 className="font-bold text-ink" style={{ fontSize: '16px', marginBottom: '16px' }}>Store Details</h3>
          <div className="grid grid-cols-2" style={{ gap: '16px' }}>
            <Field label="Store Name" defaultValue={storeInfo.name} />
            <Field label="Handle" defaultValue={storeInfo.handle} />
            <Field label="Support Email" defaultValue={storeInfo.email} />
            <Field label="Phone" defaultValue={storeInfo.phone} />
          </div>
        </div>

        {/* Business preferences */}
        <div className="bg-white" style={{ border: '1px solid var(--color-line)', borderRadius: '8px', padding: '24px' }}>
          <h3 className="font-bold text-ink" style={{ fontSize: '16px', marginBottom: '16px' }}>Business Preferences</h3>
          <div className="grid grid-cols-2" style={{ gap: '16px' }}>
            <Field label="Country" defaultValue={storeInfo.country} />
            <Field label="Currency" defaultValue={storeInfo.currency} />
            <Field label="Weight Unit" defaultValue={storeInfo.weightUnit} />
            <Field label="Registration Number" defaultValue={storeInfo.registrationNumber} />
            <Field label="Tax ID" defaultValue={storeInfo.taxId} />
          </div>
        </div>

        {/* Operating hours */}
        <div className="bg-white" style={{ border: '1px solid var(--color-line)', borderRadius: '8px', padding: '24px' }}>
          <h3 className="font-bold text-ink" style={{ fontSize: '16px', marginBottom: '16px' }}>Operating Hours</h3>
          <div className="flex flex-col" style={{ gap: '8px' }}>
            <div className="flex justify-between"><span className="text-ink" style={{ fontSize: '14px' }}>Monday - Friday</span><span className="text-ink-faint" style={{ fontSize: '14px' }}>9:00 AM - 7:00 PM</span></div>
            <div className="flex justify-between"><span className="text-ink" style={{ fontSize: '14px' }}>Saturday</span><span className="text-ink-faint" style={{ fontSize: '14px' }}>10:00 AM - 6:00 PM</span></div>
            <div className="flex justify-between"><span className="text-ink" style={{ fontSize: '14px' }}>Sunday</span><span className="text-ink-faint" style={{ fontSize: '14px' }}>Closed</span></div>
          </div>
        </div>

        <div className="flex items-center justify-end" style={{ gap: '12px' }}>
          <Link to="/admin/settings" className="text-ink-secondary no-underline" style={{ fontSize: '16px', fontWeight: 500, padding: '8px 16px' }}>Cancel</Link>
          <button onClick={() => toast.show('Store settings are in demo mode')} className="bg-ink text-white" style={{ borderRadius: 'var(--radius-pill)', padding: '8px 24px', fontSize: '16px', fontWeight: 500, height: '48px' }}>Save Changes</button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, defaultValue }: { label: string; defaultValue?: string }) {
  return (
    <div className="flex flex-col" style={{ gap: '6px' }}>
      <label className="text-ink-secondary" style={{ fontSize: '14px' }}>{label}</label>
      <input type="text" defaultValue={defaultValue} className="w-full bg-white text-ink" style={{ border: '1px solid var(--color-line)', borderRadius: '8px', padding: '12px', fontSize: '14px', height: '40px' }} />
    </div>
  );
}