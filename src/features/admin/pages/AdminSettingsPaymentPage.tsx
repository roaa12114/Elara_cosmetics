import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { AdminNavbar } from '../components/AdminNavbar';
import { useToast } from '@/shared/ui';
import { billingInfo, payoutSettings } from '../data/adminSettingsStaticData';

const PAYMENT_METHODS = [
  { label: 'Credit & Debit Cards (Visa, Mastercard)', enabled: true },
  { label: 'Digital Wallets (Apple Pay, Google Pay)', enabled: true },
];

const TRANSACTION_PREFS = [
  { label: 'Automatic receipts', enabled: true },
  { label: 'Automatic refunds', enabled: true },
  { label: 'Fraud detection', enabled: true },
  { label: 'Failed payment alerts', enabled: true },
];

export function AdminSettingsPaymentPage() {
  const toast = useToast();
  return (
    <div className="flex flex-col min-h-screen">
      <AdminNavbar />
      <div className="flex flex-col" style={{ padding: '32px', gap: '24px', maxWidth: '700px' }}>
        <Link to="/admin/settings" className="flex items-center text-ink-secondary hover:text-ink no-underline" style={{ gap: '8px', fontSize: '16px' }}><ArrowLeft className="w-5 h-5" /> Back to Settings</Link>
        <div className="flex items-center justify-between"><h1 className="font-bold text-ink" style={{ fontSize: '20px' }}>Payment</h1><span className="text-ink-faint" style={{ fontSize: '12px' }}>Last updated: just now</span></div>

        {/* Payment methods */}
        <div className="bg-white" style={{ border: '1px solid var(--color-line)', borderRadius: '8px', padding: '24px' }}>
          <h3 className="font-bold text-ink" style={{ fontSize: '16px', marginBottom: '16px' }}>Payment Methods</h3>
          <div className="flex flex-col" style={{ gap: '12px' }}>
            {PAYMENT_METHODS.map((m) => <ToggleRow key={m.label} label={m.label} defaultChecked={m.enabled} />)}
          </div>
        </div>

        {/* Billing info */}
        <div className="bg-white" style={{ border: '1px solid var(--color-line)', borderRadius: '8px', padding: '24px' }}>
          <h3 className="font-bold text-ink" style={{ fontSize: '16px', marginBottom: '16px' }}>Billing Information</h3>
          <div className="grid grid-cols-2" style={{ gap: '16px' }}>
            <DetailRow label="Legal Business Name" value={billingInfo.legalName} />
            <DetailRow label="Billing Email" value={billingInfo.billingEmail} />
            <DetailRow label="Address" value={billingInfo.address} />
            <DetailRow label="Tax ID" value={billingInfo.taxId} />
          </div>
        </div>

        {/* Payout settings */}
        <div className="bg-white" style={{ border: '1px solid var(--color-line)', borderRadius: '8px', padding: '24px' }}>
          <h3 className="font-bold text-ink" style={{ fontSize: '16px', marginBottom: '16px' }}>Payout Settings</h3>
          <div className="grid grid-cols-2" style={{ gap: '16px' }}>
            <div>
              <span className="text-ink-faint" style={{ fontSize: '12px', textTransform: 'uppercase' }}>Bank Account</span>
              <div className="flex items-center" style={{ gap: '8px', marginTop: '4px' }}>
                <p className="text-ink" style={{ fontSize: '14px' }}>{payoutSettings.bankAccount}</p>
                <span className="inline-flex items-center" style={{ background: 'var(--color-status-delivered-bg)', color: 'var(--color-success-text)', borderRadius: '6px', padding: '2px 8px', fontSize: '11px', fontWeight: 500 }}>{payoutSettings.status}</span>
                <button className="text-brand" style={{ fontSize: '14px' }}>Change</button>
              </div>
            </div>
            <DetailRow label="Payout Schedule" value={payoutSettings.schedule} />
            <DetailRow label="Settlement Currency" value={payoutSettings.currency} />
          </div>
        </div>

        {/* Transaction preferences */}
        <div className="bg-white" style={{ border: '1px solid var(--color-line)', borderRadius: '8px', padding: '24px' }}>
          <h3 className="font-bold text-ink" style={{ fontSize: '16px', marginBottom: '16px' }}>Transaction Preferences</h3>
          <div className="flex flex-col" style={{ gap: '12px' }}>
            {TRANSACTION_PREFS.map((p) => <ToggleRow key={p.label} label={p.label} defaultChecked={p.enabled} />)}
          </div>
        </div>

        <div className="flex items-center justify-end" style={{ gap: '12px' }}>
          <Link to="/admin/settings" className="text-ink-secondary no-underline" style={{ fontSize: '16px', fontWeight: 500, padding: '8px 16px' }}>Cancel</Link>
          <button onClick={() => toast.show('Payment settings are in demo mode')} className="bg-ink text-white" style={{ borderRadius: 'var(--radius-pill)', padding: '8px 24px', fontSize: '16px', fontWeight: 500, height: '48px' }}>Save Changes</button>
        </div>
      </div>
    </div>
  );
}

function ToggleRow({ label, defaultChecked }: { label: string; defaultChecked: boolean }) {
  return <label className="flex items-center justify-between text-ink" style={{ fontSize: '14px' }}>{label}<input type="checkbox" defaultChecked={defaultChecked} /></label>;
}
function DetailRow({ label, value }: { label: string; value: string }) {
  return <div><span className="text-ink-faint" style={{ fontSize: '12px', textTransform: 'uppercase' }}>{label}</span><p className="text-ink" style={{ fontSize: '14px', marginTop: '4px' }}>{value}</p></div>;
}