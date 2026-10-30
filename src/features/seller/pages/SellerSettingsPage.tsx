import { useAuthMe } from '@shared/hooks/useAuthMe';
import { formatDateTime } from '@shared/lib/utils';
import { User, Mail, Phone, MapPin, Calendar, Store, ShieldCheck } from 'lucide-react';

export function SellerSettingsPage() {
  const { data, isLoading } = useAuthMe();
  const user = data?.user;

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <header className="bg-white border-b border-line px-8 py-4">
          <h1 className="font-sans font-bold text-ink" style={{ fontSize: '20px' }}>Settings</h1>
        </header>
        <div className="flex-1 p-8">
          <div className="rounded-card-sm border border-line-strong bg-white p-8 animate-pulse">
            <div className="h-6 w-48 bg-line rounded mb-6" />
            <div className="grid grid-cols-2" style={{ gap: '24px' }}>
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="h-20 bg-line rounded-card-sm" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col min-h-screen">
        <header className="bg-white border-b border-line px-8 py-4">
          <h1 className="font-sans font-bold text-ink" style={{ fontSize: '20px' }}>Settings</h1>
        </header>
        <div className="flex-1 p-8">
          <div className="rounded-card-sm border border-line-strong bg-white p-8 text-center text-ink-muted">
            Could not load your profile. Please try again.
          </div>
        </div>
      </div>
    );
  }

  const address = user.address;

  return (
    <div className="flex flex-col min-h-screen">
      {/* Top bar */}
      <header className="bg-white border-b border-line px-8 py-4">
        <h1 className="font-sans font-bold text-ink" style={{ fontSize: '20px' }}>Settings</h1>
        <p className="text-body3 text-ink-muted mt-1">Manage your seller account information</p>
      </header>

      {/* Content */}
      <div className="flex-1 p-8 flex flex-col" style={{ gap: '24px' }}>
        {/* Store info header */}
        <div className="rounded-card-sm border border-line-strong bg-white p-6 flex items-center justify-between">
          <div className="flex items-center" style={{ gap: '16px' }}>
            <div className="rounded-full bg-primary text-brand font-bold w-16 h-16 flex items-center justify-center text-h4">
              {user.name.split(' ').slice(0, 2).map((s) => s[0]?.toUpperCase()).join('')}
            </div>
            <div>
              <h2 className="font-sans font-bold text-ink" style={{ fontSize: '20px' }}>{user.name}</h2>
              <p className="text-body2 text-ink-muted">Seller Account · Owner</p>
            </div>
          </div>
          <div className="rounded-pill bg-success/20 text-success px-3 py-1 text-body3 font-medium flex items-center" style={{ gap: '6px' }}>
            <ShieldCheck className="w-4 h-4" />
            Verified Seller
          </div>
        </div>

        {/* Personal info section */}
        <section className="rounded-card-sm border border-line-strong bg-white p-6 flex flex-col" style={{ gap: '20px' }}>
          <h3 className="font-sans font-semibold text-ink" style={{ fontSize: '18px' }}>Personal Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: '20px' }}>
            <InfoRow icon={User} label="Full Name" value={user.name} />
            <InfoRow icon={Mail} label="Email" value={user.email} />
            <InfoRow icon={Phone} label="Phone" value={user.phone || '—'} />
            <InfoRow icon={Calendar} label="Member Since" value={formatDateTime(user.createdAt)} />
          </div>
        </section>

        {/* Store details */}
        <section className="rounded-card-sm border border-line-strong bg-white p-6 flex flex-col" style={{ gap: '20px' }}>
          <h3 className="font-sans font-semibold text-ink" style={{ fontSize: '18px' }}>Store Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: '20px' }}>
            <InfoRow icon={Store} label="Store Name" value={user.name} />
            <InfoRow icon={ShieldCheck} label="Verification" value="Verified" />
          </div>
        </section>

        {/* Address */}
        <section className="rounded-card-sm border border-line-strong bg-white p-6 flex flex-col" style={{ gap: '20px' }}>
          <h3 className="font-sans font-semibold text-ink" style={{ fontSize: '18px' }}>Business Address</h3>
          {address && (address.street || address.city) ? (
            <div className="flex items-start" style={{ gap: '12px' }}>
              <MapPin className="w-5 h-5 text-brand mt-0.5" />
              <div className="flex flex-col" style={{ gap: '2px' }}>
                <span className="text-body1 text-ink">{address.street || '—'}</span>
                <span className="text-body2 text-ink-secondary">
                  {[address.city, address.state, address.postalCode].filter(Boolean).join(', ') || '—'}
                </span>
                <span className="text-body2 text-ink-secondary">{address.country || '—'}</span>
              </div>
            </div>
          ) : (
            <p className="text-body2 text-ink-muted">No business address on file.</p>
          )}
        </section>

        {/* Read-only notice */}
        <div className="rounded-card-sm border border-line-strong bg-primary-light/30 p-4 text-body2 text-ink-secondary text-center">
          Profile editing is currently unavailable. To update your store name, email, or phone,
          please contact Elara support.
        </div>
      </div>
    </div>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof User;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start" style={{ gap: '12px' }}>
      <div className="rounded-card-sm bg-primary-light w-10 h-10 flex items-center justify-center shrink-0">
        <Icon className="w-5 h-5 text-brand" />
      </div>
      <div className="flex flex-col min-w-0" style={{ gap: '2px' }}>
        <span className="text-body3 text-ink-muted uppercase tracking-wide">{label}</span>
        <span className="text-body1 text-ink break-words">{value}</span>
      </div>
    </div>
  );
}