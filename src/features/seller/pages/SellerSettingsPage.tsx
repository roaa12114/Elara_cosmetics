import { useState } from 'react';
import { User, Store, Bell, Camera, Trash2, Shield } from 'lucide-react';
import { SellerNavbar } from '../components/SellerNavbar';
import { useAuthMe } from '@shared/hooks/useAuthMe';
import { useToast } from '@/shared/ui';
import { formatDateTime } from '@shared/lib/utils';

type Tab = 'profile' | 'store' | 'notifications';

export function SellerSettingsPage() {
  const { data, isLoading } = useAuthMe();
  const toast = useToast();
  const [tab, setTab] = useState<Tab>('profile');
  const user = data?.user;

  function handleSave() {
    toast.show('Settings saved (demo mode — backend endpoint not available)');
  }

  if (isLoading) {
    return (<div className="flex flex-col min-h-screen"><SellerNavbar /><div className="flex-1 flex items-center justify-center"><p className="text-ink-faint">Loading...</p></div></div>);
  }

  return (
    <div className="flex flex-col min-h-screen">
      <SellerNavbar />
      <div className="flex flex-col" style={{ padding: '32px', gap: '24px', maxWidth: '900px' }}>
        <h1 className="font-bold text-ink" style={{ fontSize: '20px' }}>Settings</h1>

        {/* Tabs */}
        <div className="flex items-center border-b border-line">
          {[
            { id: 'profile' as Tab, label: 'Edit Profile', icon: User },
            { id: 'store' as Tab, label: 'Store Settings', icon: Store },
            { id: 'notifications' as Tab, label: 'Notifications', icon: Bell },
          ].map((t) => {
            const Icon = t.icon;
            return (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={tab === t.id ? 'text-ink' : 'text-ink-faint'}
                style={{ padding: '12px 20px', fontSize: '16px', fontWeight: 500, borderBottom: tab === t.id ? '2px solid var(--color-ink)' : '2px solid transparent', marginBottom: '-1px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Icon className="w-4 h-4" /> {t.label}
              </button>
            );
          })}
        </div>

        {/* === Edit Profile Tab === */}
        {tab === 'profile' && (
          <div className="flex flex-col" style={{ gap: '24px' }}>
            <Section title="Profile Photo" subtitle="JPG or PNG. Minimum 200×200px recommended.">
              <div className="flex items-center" style={{ gap: '16px' }}>
                <div className="rounded-full bg-primary text-brand font-bold flex items-center justify-center" style={{ width: '80px', height: '80px', fontSize: '28px' }}>
                  {user?.name?.split(' ').slice(0, 2).map((s) => s[0]?.toUpperCase()).join('') ?? '?'}
                </div>
                <div className="flex items-center" style={{ gap: '8px' }}>
                  <button className="flex items-center bg-ink text-white" style={{ borderRadius: 'var(--radius-pill)', padding: '8px 16px', gap: '6px', fontSize: '14px', fontWeight: 500 }}><Camera className="w-4 h-4" /> Change Photo</button>
                  <button className="flex items-center text-danger-dark" style={{ border: '1px solid var(--color-danger-dark)', borderRadius: 'var(--radius-pill)', padding: '8px 16px', gap: '6px', fontSize: '14px', fontWeight: 500 }}><Trash2 className="w-4 h-4" /> Remove</button>
                </div>
              </div>
            </Section>

            <Section title="Personal Information">
              <div className="grid grid-cols-2" style={{ gap: '16px' }}>
                <Field label="Full Name" defaultValue={user?.name ?? ''} />
                <Field label="Email" defaultValue={user?.email ?? ''} />
                <Field label="Phone" defaultValue={user?.phone ?? ''} />
                <Field label="Member Since" defaultValue={user ? formatDateTime(user.createdAt) : ''} readOnly />
              </div>
            </Section>

            <Section title="Account Security & Password">
              <div className="flex flex-col" style={{ gap: '16px' }}>
                <div className="grid grid-cols-2" style={{ gap: '16px' }}>
                  <Field label="Current Password" type="password" placeholder="••••••••" />
                  <div />
                  <Field label="New Password" type="password" placeholder="••••••••" />
                  <Field label="Confirm Password" type="password" placeholder="••••••••" />
                </div>
                <div className="flex items-center bg-surface" style={{ borderRadius: '8px', padding: '16px', gap: '12px' }}>
                  <Shield className="w-5 h-5 text-ink-faint" />
                  <div>
                    <span className="text-ink font-medium" style={{ fontSize: '14px' }}>Two-Factor Authentication (2FA)</span>
                    <p className="text-ink-faint" style={{ fontSize: '12px' }}>Not activated. Add an extra layer of security to your account.</p>
                  </div>
                  <button className="ml-auto text-brand" style={{ fontSize: '14px', fontWeight: 500 }}>Enable</button>
                </div>
              </div>
            </Section>
          </div>
        )}

        {/* === Store Settings Tab === */}
        {tab === 'store' && (
          <div className="flex flex-col" style={{ gap: '24px' }}>
            <Section title="Store Status">
              <div className="flex items-center" style={{ gap: '12px' }}>
                <Toggle defaultOn label="Store is Open" />
                <span className="text-ink-faint" style={{ fontSize: '14px' }}>Customers can browse and place orders</span>
              </div>
            </Section>
            <Section title="Order Settings">
              <div className="flex flex-col" style={{ gap: '16px' }}>
                <div className="flex items-center" style={{ gap: '12px' }}><Toggle defaultOn label="Accept Orders" /></div>
                <div>
                  <label className="text-ink-secondary" style={{ fontSize: '14px', marginBottom: '6px', display: 'block' }}>Minimum Order Amount</label>
                  <input type="number" defaultValue="40" className="bg-white text-ink" style={{ border: '1px solid var(--color-line)', borderRadius: '8px', padding: '12px', fontSize: '14px', height: '40px', width: '200px' }} />
                </div>
              </div>
            </Section>
            <Section title="Inventory & Alerts">
              <div className="flex flex-col" style={{ gap: '16px' }}>
                <div className="flex items-center" style={{ gap: '12px' }}><Toggle defaultOn label="Low Stock Alert" /></div>
                <div>
                  <label className="text-ink-secondary" style={{ fontSize: '14px', marginBottom: '6px', display: 'block' }}>Low Stock Threshold</label>
                  <input type="number" defaultValue="10" className="bg-white text-ink" style={{ border: '1px solid var(--color-line)', borderRadius: '8px', padding: '12px', fontSize: '14px', height: '40px', width: '120px' }} />
                </div>
              </div>
            </Section>
            <Section title="Business Hours">
              <div className="flex flex-col" style={{ gap: '12px' }}>
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                  <div key={day} className="flex items-center justify-between" style={{ padding: '8px 0' }}>
                    <span className="text-ink" style={{ fontSize: '14px', width: '100px' }}>{day}</span>
                    {day === 'Friday' ? (
                      <span className="text-danger-dark" style={{ fontSize: '14px' }}>Closed all day</span>
                    ) : (
                      <div className="flex items-center" style={{ gap: '8px' }}>
                        <input type="time" defaultValue="09:00" className="bg-white text-ink" style={{ border: '1px solid var(--color-line)', borderRadius: '8px', padding: '6px 12px', fontSize: '14px' }} />
                        <span className="text-ink-faint">to</span>
                        <input type="time" defaultValue="18:00" className="bg-white text-ink" style={{ border: '1px solid var(--color-line)', borderRadius: '8px', padding: '6px 12px', fontSize: '14px' }} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Section>
            <Section title="Currency">
              <select className="bg-white text-ink" style={{ border: '1px solid var(--color-line)', borderRadius: '8px', padding: '12px', fontSize: '14px', height: '40px', width: '300px' }}>
                <option>USD ($) - US Dollar</option><option>EUR (€) - Euro</option><option>GBP (£) - British Pound</option><option>EGP (£E) - Egyptian Pound</option>
              </select>
            </Section>
          </div>
        )}

        {/* === Notifications Tab === */}
        {tab === 'notifications' && (
          <div className="flex flex-col" style={{ gap: '24px' }}>
            <Section title="Order Notifications">
              <div className="flex flex-col" style={{ gap: '12px' }}>
                {['New Order', 'Order Cancellation', 'Order Status Update', 'Payment Notifications'].map((label) => (
                  <div key={label} className="flex items-center justify-between" style={{ padding: '8px 0' }}>
                    <span className="text-ink" style={{ fontSize: '14px' }}>{label}</span>
                    <div className="flex items-center" style={{ gap: '16px' }}>
                      <span className="text-ink-faint" style={{ fontSize: '12px' }}>Email</span><Toggle defaultOn small />
                      <span className="text-ink-faint" style={{ fontSize: '12px' }}>Push</span><Toggle defaultOn small />
                    </div>
                  </div>
                ))}
                <div className="flex items-center justify-between" style={{ padding: '8px 0' }}>
                  <span className="text-ink" style={{ fontSize: '14px' }}>System Alerts</span>
                  <div className="flex items-center" style={{ gap: '16px' }}>
                    <span className="text-brand" style={{ fontSize: '12px' }}>Email</span><Toggle defaultOn small pink />
                    <span className="text-brand" style={{ fontSize: '12px' }}>Push</span><Toggle defaultOn small pink />
                  </div>
                </div>
              </div>
            </Section>
            <Section title="Inventory Notifications">
              <div className="flex flex-col" style={{ gap: '12px' }}>
                {['Low Stock Alert', 'Out of Stock Alert'].map((label) => (
                  <div key={label} className="flex items-center justify-between" style={{ padding: '8px 0' }}><span className="text-ink" style={{ fontSize: '14px' }}>{label}</span><Toggle defaultOn /></div>
                ))}
              </div>
            </Section>
            <Section title="Customer & Store Notifications">
              <div className="flex flex-col" style={{ gap: '12px' }}>
                {['New Customer Registration', 'New Review'].map((label) => (
                  <div key={label} className="flex items-center justify-between" style={{ padding: '8px 0' }}><span className="text-ink" style={{ fontSize: '14px' }}>{label}</span><Toggle defaultOn /></div>
                ))}
              </div>
            </Section>
            <Section title="Marketing Announcements">
              <div className="flex flex-col" style={{ gap: '12px' }}>
                {['Promo Updates', 'Platform Announcements'].map((label) => (
                  <div key={label} className="flex items-center justify-between" style={{ padding: '8px 0' }}><span className="text-ink" style={{ fontSize: '14px' }}>{label}</span><Toggle /></div>
                ))}
              </div>
            </Section>
            <Section title="Notification Frequency">
              <div className="flex flex-col" style={{ gap: '12px' }}>
                <div className="flex items-center" style={{ gap: '12px' }}>
                  {['Instant', 'Daily', 'Weekly'].map((freq, i) => (
                    <button key={freq} className={i === 0 ? 'bg-ink text-white' : 'text-ink-secondary'} style={{ borderRadius: 'var(--radius-pill)', padding: '8px 20px', fontSize: '14px', fontWeight: 500, border: i === 0 ? 'none' : '1px solid var(--color-line)' }}>{freq}</button>
                  ))}
                </div>
                <p className="text-ink-faint" style={{ fontSize: '12px' }}>Security & payment alerts are always sent instantly.</p>
              </div>
            </Section>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-end" style={{ gap: '12px', paddingTop: '16px', borderTop: '1px solid var(--color-line)' }}>
          <button className="text-ink-secondary" style={{ fontSize: '16px', fontWeight: 500, padding: '8px 16px' }}>Cancel</button>
          <button onClick={handleSave} className="bg-ink text-white" style={{ borderRadius: 'var(--radius-pill)', padding: '8px 24px', fontSize: '16px', fontWeight: 500, height: '48px' }}>Save Changes</button>
        </div>
      </div>
    </div>
  );
}

function Section({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div className="bg-white" style={{ border: '1px solid var(--color-line)', borderRadius: '8px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div><h3 className="font-bold text-ink" style={{ fontSize: '16px' }}>{title}</h3>{subtitle && <p className="text-ink-faint" style={{ fontSize: '12px', marginTop: '4px' }}>{subtitle}</p>}</div>
      {children}
    </div>
  );
}

function Field({ label, defaultValue, type, placeholder, readOnly }: {
  label: string; defaultValue?: string; type?: string; placeholder?: string; readOnly?: boolean;
}) {
  return (
    <div className="flex flex-col" style={{ gap: '6px' }}>
      <label className="text-ink-secondary" style={{ fontSize: '14px' }}>{label}</label>
      <input type={type ?? 'text'} defaultValue={defaultValue} placeholder={placeholder} readOnly={readOnly}
        className="w-full bg-white text-ink" style={{ border: '1px solid var(--color-line)', borderRadius: '8px', padding: '12px', fontSize: '14px', height: '40px', opacity: readOnly ? 0.7 : 1 }} />
    </div>
  );
}

function Toggle({ defaultOn, label, small, pink }: { defaultOn?: boolean; label?: string; small?: boolean; pink?: boolean }) {
  const [on, setOn] = useState(!!defaultOn);
  const w = small ? '36px' : '48px';
  const h = small ? '20px' : '26px';
  return (
    <button type="button" onClick={() => setOn(!on)} className="flex items-center" style={{ gap: label ? '8px' : '0' }}>
      {label && <span className="text-ink" style={{ fontSize: '14px' }}>{label}</span>}
      <div style={{ width: w, height: h, borderRadius: h, background: on ? (pink ? 'var(--color-brand)' : 'var(--color-ink)') : 'var(--color-line)', position: 'relative', transition: 'background 0.2s' }}>
        <div style={{ position: 'absolute', top: '2px', left: on ? `calc(100% - ${small ? '16px' : '22px'})` : '2px', width: small ? '16px' : '22px', height: small ? '16px' : '22px', borderRadius: '50%', background: 'white', transition: 'left 0.2s' }} />
      </div>
    </button>
  );
}