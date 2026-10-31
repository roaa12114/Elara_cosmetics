import { Link } from 'react-router-dom';
import {  Camera } from 'lucide-react';
import { AdminNavbar } from '../components/AdminNavbar';
import { useToast } from '@/shared/ui';

export function AdminAddCustomerPage() {
  const toast = useToast();
  return (
    <div className="flex flex-col min-h-screen">
      <AdminNavbar />
      <div className="flex flex-col" style={{ padding: '32px', gap: '24px', maxWidth: '800px' }}>
        <nav className="flex items-center text-ink-faint" style={{ gap: '8px', fontSize: '14px' }}>
          <Link to="/admin" className="hover:text-ink no-underline">Home</Link><span>/</span>
          <Link to="/admin/customers" className="hover:text-ink no-underline">Customer</Link><span>/</span>
          <span className="text-ink font-medium">Add Profile</span>
        </nav>
        <h1 className="font-bold text-ink" style={{ fontSize: '20px' }}>Add Profile</h1>

        <div className="bg-white" style={{ border: '1px solid var(--color-line)', borderRadius: '8px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Avatar */}
          <div className="flex items-center" style={{ gap: '16px' }}>
            <div className="rounded-full bg-primary-light flex items-center justify-center" style={{ width: '80px', height: '80px' }}><Camera className="w-8 h-8 text-ink-faint" /></div>
            <div><p className="text-ink" style={{ fontSize: '14px' }}>Profile Photo</p><p className="text-ink-faint" style={{ fontSize: '12px' }}>JPG or PNG. Recommended 400×400px</p></div>
          </div>
          {/* Name */}
          <div className="grid grid-cols-2" style={{ gap: '16px' }}>
            <Field label="First Name" /><Field label="Last Name" />
          </div>
          {/* Contact */}
          <div className="grid grid-cols-2" style={{ gap: '16px' }}>
            <Field label="Email Address" type="email" /><Field label="Phone Number" type="tel" />
          </div>
          {/* Address */}
          <div className="grid grid-cols-2" style={{ gap: '16px' }}>
            <Field label="Street Address" /><Field label="City" />
          </div>
          <div className="grid grid-cols-3" style={{ gap: '16px' }}>
            <Field label="State" /><Field label="ZIP Code" /><Field label="Country" />
          </div>
          {/* Status */}
          <div>
            <label className="text-ink-secondary" style={{ fontSize: '14px', marginBottom: '6px', display: 'block' }}>Customer Status</label>
            <select className="w-full bg-white text-ink" style={{ border: '1px solid var(--color-line)', borderRadius: '8px', padding: '12px', fontSize: '14px', height: '40px' }}>
              <option>Active</option><option>Pending</option><option>Blocked</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-end" style={{ gap: '12px' }}>
          <Link to="/admin/customers" className="text-ink-secondary no-underline" style={{ fontSize: '16px', fontWeight: 500, padding: '8px 16px' }}>Cancel</Link>
          <button onClick={() => toast.show('Customer creation is in demo mode — backend endpoint not available')} className="bg-ink text-white" style={{ borderRadius: 'var(--radius-pill)', padding: '8px 24px', fontSize: '16px', fontWeight: 500, height: '48px' }}>Save</button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, type }: { label: string; type?: string }) {
  return (
    <div className="flex flex-col" style={{ gap: '6px' }}>
      <label className="text-ink-secondary" style={{ fontSize: '14px' }}>{label}</label>
      <input type={type ?? 'text'} placeholder="Type Something" className="w-full bg-white text-ink" style={{ border: '1px solid var(--color-line)', borderRadius: '8px', padding: '12px', fontSize: '14px', height: '40px' }} />
    </div>
  );
}