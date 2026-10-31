import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { AdminNavbar } from '../components/AdminNavbar';
import { useToast } from '@/shared/ui';
import { shippingZones } from '../data/adminSettingsStaticData';

const CARRIERS = ['DHL', 'FedEx', 'Local Courier'];
const DELIVERY_OPTIONS = ['Standard', 'Express', 'Local same-day'];

export function AdminSettingsShippingPage() {
  const toast = useToast();
  return (
    <div className="flex flex-col min-h-screen">
      <AdminNavbar />
      <div className="flex flex-col" style={{ padding: '32px', gap: '24px', maxWidth: '700px' }}>
        <Link to="/admin/settings" className="flex items-center text-ink-secondary hover:text-ink no-underline" style={{ gap: '8px', fontSize: '16px' }}><ArrowLeft className="w-5 h-5" /> Back to Settings</Link>
        <h1 className="font-bold text-ink" style={{ fontSize: '20px' }}>Shipping Settings</h1>

        {/* Shipping zones */}
        <div className="bg-white" style={{ border: '1px solid var(--color-line)', borderRadius: '8px', padding: '24px' }}>
          <h3 className="font-bold text-ink" style={{ fontSize: '16px', marginBottom: '16px' }}>Shipping Zones</h3>
          <table className="w-full">
            <thead><tr style={{ borderBottom: '1px solid var(--color-line)' }}>
              <th className="text-left font-bold text-ink-secondary" style={{ padding: '8px 0', fontSize: '12px', textTransform: 'uppercase' }}>Zone</th>
              <th className="text-left font-bold text-ink-secondary" style={{ padding: '8px 0', fontSize: '12px', textTransform: 'uppercase' }}>Region</th>
              <th className="text-left font-bold text-ink-secondary" style={{ padding: '8px 0', fontSize: '12px', textTransform: 'uppercase' }}>Rate Type</th>
              <th className="text-right font-bold text-ink-secondary" style={{ padding: '8px 0', fontSize: '12px', textTransform: 'uppercase' }}>Rate</th>
              <th className="text-right font-bold text-ink-secondary" style={{ padding: '8px 0', fontSize: '12px', textTransform: 'uppercase' }}></th>
            </tr></thead>
            <tbody>
              {shippingZones.map((z) => (
                <tr key={z.name} style={{ borderBottom: '1px solid var(--color-line)' }}>
                  <td className="font-medium text-ink" style={{ padding: '12px 0', fontSize: '14px' }}>{z.name}</td>
                  <td className="text-ink-faint" style={{ padding: '12px 0', fontSize: '14px' }}>{z.region}</td>
                  <td className="text-ink-faint" style={{ padding: '12px 0', fontSize: '14px' }}>{z.rateType}</td>
                  <td className="text-right font-bold text-ink" style={{ padding: '12px 0', fontSize: '14px' }}>{z.rate}</td>
                  <td className="text-right" style={{ padding: '12px 0' }}><button className="text-brand" style={{ fontSize: '14px' }}>Edit</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Rates */}
        <div className="bg-white" style={{ border: '1px solid var(--color-line)', borderRadius: '8px', padding: '24px' }}>
          <h3 className="font-bold text-ink" style={{ fontSize: '16px', marginBottom: '16px' }}>Rates & Free Shipping</h3>
          <div className="grid grid-cols-3" style={{ gap: '16px' }}>
            <div><span className="text-ink-faint" style={{ fontSize: '12px', textTransform: 'uppercase' }}>Free Shipping Threshold</span><p className="text-ink font-bold" style={{ fontSize: '18px', marginTop: '4px' }}>$75.00</p></div>
            <div><span className="text-ink-faint" style={{ fontSize: '12px', textTransform: 'uppercase' }}>Default Rate</span><p className="text-ink font-bold" style={{ fontSize: '18px', marginTop: '4px' }}>$8.50</p></div>
            <div><span className="text-ink-faint" style={{ fontSize: '12px', textTransform: 'uppercase' }}>Est. Delivery</span><p className="text-ink font-bold" style={{ fontSize: '18px', marginTop: '4px' }}>3-5 days</p></div>
          </div>
        </div>

        {/* Carriers */}
        <div className="bg-white" style={{ border: '1px solid var(--color-line)', borderRadius: '8px', padding: '24px' }}>
          <h3 className="font-bold text-ink" style={{ fontSize: '16px', marginBottom: '16px' }}>Carriers</h3>
          <div className="flex flex-col" style={{ gap: '12px' }}>
            {CARRIERS.map((c, i) => <ToggleRow key={c} label={c} defaultChecked={i < 2} />)}
          </div>
        </div>

        {/* Delivery options */}
        <div className="bg-white" style={{ border: '1px solid var(--color-line)', borderRadius: '8px', padding: '24px' }}>
          <h3 className="font-bold text-ink" style={{ fontSize: '16px', marginBottom: '16px' }}>Delivery Options</h3>
          <div className="flex flex-col" style={{ gap: '12px' }}>
            {DELIVERY_OPTIONS.map((d, i) => <ToggleRow key={d} label={d} defaultChecked={i < 2} />)}
          </div>
        </div>

        <div className="flex items-center justify-end" style={{ gap: '12px' }}>
          <Link to="/admin/settings" className="text-ink-secondary no-underline" style={{ fontSize: '16px', fontWeight: 500, padding: '8px 16px' }}>Cancel</Link>
          <button onClick={() => toast.show('Shipping settings are in demo mode')} className="bg-ink text-white" style={{ borderRadius: 'var(--radius-pill)', padding: '8px 24px', fontSize: '16px', fontWeight: 500, height: '48px' }}>Save Changes</button>
        </div>
      </div>
    </div>
  );
}

function ToggleRow({ label, defaultChecked }: { label: string; defaultChecked: boolean }) {
  return <label className="flex items-center justify-between text-ink" style={{ fontSize: '14px' }}>{label}<input type="checkbox" defaultChecked={defaultChecked} /></label>;
}