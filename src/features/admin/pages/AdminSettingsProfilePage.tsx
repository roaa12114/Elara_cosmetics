import { Link } from 'react-router-dom';
import { ArrowLeft, Camera } from 'lucide-react';
import { AdminNavbar } from '../components/AdminNavbar';
import { useToast } from '@/shared/ui';
import { useAuth } from '@shared/lib/useAuth';
import { initialsOf } from '@shared/lib/utils';

export function AdminSettingsProfilePage() {
  const toast = useToast();
  const { user } = useAuth();
  const name = user?.name ?? 'Ahmed Ibrahiem';
  const email = user?.email ?? 'ahmed@elara.com';

  return (
    <div className="flex flex-col min-h-screen">
      <AdminNavbar />
      <div className="flex flex-col" style={{ padding: '32px', gap: '24px', maxWidth: '700px' }}>
        <Link to="/admin/settings" className="flex items-center text-ink-secondary hover:text-ink no-underline" style={{ gap: '8px', fontSize: '16px' }}>
          <ArrowLeft className="w-5 h-5" /> Back to Settings
        </Link>
        <h1 className="font-bold text-ink" style={{ fontSize: '20px' }}>Profile</h1>

        <div className="bg-white" style={{ border: '1px solid var(--color-line)', borderRadius: '8px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="flex items-center" style={{ gap: '16px' }}>
            <div className="rounded-full bg-primary text-brand font-bold flex items-center justify-center" style={{ width: '80px', height: '80px', fontSize: '28px' }}>{initialsOf(name)}</div>
            <div>
              <p className="text-ink" style={{ fontSize: '14px' }}>Profile Photo</p>
              <p className="text-ink-faint" style={{ fontSize: '12px' }}>JPG or PNG. Recommended 400×400px</p>
              <button className="flex items-center bg-ink text-white mt-2" style={{ borderRadius: 'var(--radius-pill)', padding: '6px 12px', gap: '6px', fontSize: '12px' }}><Camera className="w-3 h-3" /> Change Photo</button>
            </div>
          </div>

          <div className="grid grid-cols-2" style={{ gap: '16px' }}>
            <Field label="Full Name" defaultValue={name} />
            <Field label="Email" defaultValue={email} />
            <Field label="Phone" defaultValue="+998 90 345 67 89" />
            <div>
              <label className="text-ink-secondary" style={{ fontSize: '14px', marginBottom: '6px', display: 'block' }}>Role</label>
              <span className="inline-flex items-center" style={{ background: 'var(--color-status-delivered-bg)', color: 'var(--color-success-text)', borderRadius: '6px', padding: '8px 16px', fontSize: '14px', fontWeight: 500 }}>Owner</span>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-ink" style={{ fontSize: '14px', marginBottom: '12px' }}>Language & Region</h3>
            <div className="grid grid-cols-3" style={{ gap: '16px' }}>
              <div><label className="text-ink-secondary" style={{ fontSize: '14px', marginBottom: '6px', display: 'block' }}>Language</label><select className="w-full bg-white text-ink" style={{ border: '1px solid var(--color-line)', borderRadius: '8px', padding: '12px', fontSize: '14px', height: '40px' }}><option>English</option><option>Russian</option><option>Uzbek</option></select></div>
              <div><label className="text-ink-secondary" style={{ fontSize: '14px', marginBottom: '6px', display: 'block' }}>Timezone</label><select className="w-full bg-white text-ink" style={{ border: '1px solid var(--color-line)', borderRadius: '8px', padding: '12px', fontSize: '14px', height: '40px' }}><option>UTC+05:00 (Tashkent)</option><option>UTC+00:00 (London)</option><option>UTC-05:00 (New York)</option></select></div>
              <div><label className="text-ink-secondary" style={{ fontSize: '14px', marginBottom: '6px', display: 'block' }}>Currency</label><select className="w-full bg-white text-ink" style={{ border: '1px solid var(--color-line)', borderRadius: '8px', padding: '12px', fontSize: '14px', height: '40px' }}><option>UZS</option><option>USD</option><option>EUR</option></select></div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end" style={{ gap: '12px' }}>
          <Link to="/admin/settings" className="text-ink-secondary no-underline" style={{ fontSize: '16px', fontWeight: 500, padding: '8px 16px' }}>Cancel</Link>
          <button onClick={() => toast.show('Profile settings are in demo mode — no backend endpoint')} className="bg-ink text-white" style={{ borderRadius: 'var(--radius-pill)', padding: '8px 24px', fontSize: '16px', fontWeight: 500, height: '48px' }}>Save Changes</button>
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