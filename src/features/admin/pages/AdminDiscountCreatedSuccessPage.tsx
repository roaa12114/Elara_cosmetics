import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Copy, CheckCircle2, Link2 } from 'lucide-react';
import { AdminNavbar } from '../components/AdminNavbar';
import { useAdminPromos } from '@shared/hooks/useAdminPromos';
import { useToast } from '@/shared/ui';
import {
  DISCOUNT_TYPE_LABELS,
  formatDiscountValue,
  formatDateRange,
  getAppliesTo,
  getCustomerEligibility,
  getUsedCount,
} from '../data/adminDiscountStaticData';

export function AdminDiscountCreatedSuccessPage() {
  const { code } = useParams();
  const toast = useToast();
  const { data, isLoading } = useAdminPromos({ limit: 100 });
  const promo = data?.promos?.find((p) => p.code === code);

  function handleCopy() {
    if (!promo) return;
    navigator.clipboard.writeText(promo.code).then(() => toast.success(`Copied "${promo.code}" to clipboard`));
  }

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <AdminNavbar />
        <div className="flex-1 flex items-center justify-center"><p className="text-ink-faint">Loading...</p></div>
      </div>
    );
  }

  if (!promo) {
    return (
      <div className="flex flex-col min-h-screen">
        <AdminNavbar />
        <div className="flex flex-col" style={{ padding: '32px', gap: '24px', maxWidth: '700px' }}>
          <Link to="/admin/discounts" className="flex items-center text-ink-secondary hover:text-ink no-underline" style={{ gap: '8px', fontSize: '16px' }}>
            <ArrowLeft className="w-5 h-5" /> Back to Discounts
          </Link>
          <div className="bg-white" style={{ border: '1px solid var(--color-line)', borderRadius: '8px', padding: '48px', textAlign: 'center' }}>
            <CheckCircle2 className="w-12 h-12 text-success-text mx-auto" style={{ marginBottom: '16px' }} />
            <h1 className="font-bold text-ink" style={{ fontSize: '20px', marginBottom: '8px' }}>Discount Created</h1>
            <p className="text-ink-faint" style={{ fontSize: '14px' }}>
              {code ? `Discount code "${code}" was created successfully.` : 'Your discount was created successfully.'}
            </p>
            <p className="text-ink-faint" style={{ fontSize: '14px', marginTop: '8px' }}>The promo is now visible in the discounts list.</p>
          </div>
          <div className="flex justify-end">
            <Link to="/admin/discounts" className="bg-ink text-white no-underline" style={{ borderRadius: 'var(--radius-pill)', padding: '8px 32px', fontSize: '16px', fontWeight: 500, height: '48px' }}>View All Discounts</Link>
          </div>
        </div>
      </div>
    );
  }

  const appliesTo = getAppliesTo(promo);
  const eligibility = getCustomerEligibility(promo);
  const used = getUsedCount(promo);

  return (
    <div className="flex flex-col min-h-screen">
      <AdminNavbar />
      <div className="flex flex-col" style={{ padding: '32px', gap: '24px', maxWidth: '800px' }}>
        <Link to="/admin/discounts" className="flex items-center text-ink-secondary hover:text-ink no-underline" style={{ gap: '8px', fontSize: '16px' }}>
          <ArrowLeft className="w-5 h-5" /> Back to Discounts
        </Link>

        {/* Success banner */}
        <div className="flex items-center justify-between" style={{ background: 'var(--color-status-delivered-bg)', borderRadius: '8px', padding: '20px', gap: '12px' }}>
          <div className="flex items-center" style={{ gap: '12px' }}>
            <CheckCircle2 className="w-6 h-6 text-success-text shrink-0" />
            <p className="text-success-text" style={{ fontSize: '16px', fontWeight: 500 }}>
              Discount code <strong>{promo.code}</strong> is now active and can be used at checkout.
            </p>
          </div>
          <button onClick={() => toast.show('Shareable link copied to clipboard!')} className="flex items-center bg-white text-ink shrink-0" style={{ border: '1px solid var(--color-line)', borderRadius: 'var(--radius-pill)', padding: '8px 16px', gap: '6px', fontSize: '14px', fontWeight: 500 }}>
            <Link2 className="w-4 h-4" /> Get shareable link
          </button>
        </div>

        {/* Discount code card */}
        <div className="bg-white" style={{ border: '1px solid var(--color-line)', borderRadius: '8px', padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span className="text-ink-faint" style={{ fontSize: '12px', textTransform: 'uppercase' }}>Discount Code</span>
            <div className="flex items-center" style={{ gap: '8px', marginTop: '4px' }}>
              <span className="font-bold text-ink font-mono" style={{ fontSize: '24px' }}>{promo.code}</span>
              <span className="inline-flex items-center justify-center" style={{ background: 'var(--color-status-delivered-bg)', color: 'var(--color-success-text)', borderRadius: '6px', padding: '4px 12px', fontSize: '12px', fontWeight: 500 }}>Active</span>
            </div>
          </div>
          <button onClick={handleCopy} className="flex items-center bg-white text-ink" style={{ border: '1px solid var(--color-line)', borderRadius: 'var(--radius-pill)', padding: '8px 16px', gap: '6px', fontSize: '14px', fontWeight: 500 }}>
            <Copy className="w-4 h-4" /> Copy
          </button>
        </div>

        {/* Details */}
        <div className="grid" style={{ gridTemplateColumns: '1fr 280px', gap: '24px' }}>
          <div className="bg-white" style={{ border: '1px solid var(--color-line)', borderRadius: '8px', padding: '24px' }}>
            <h3 className="font-bold text-ink" style={{ fontSize: '16px', marginBottom: '16px' }}>Discount Details</h3>
            <div className="flex flex-col" style={{ gap: '16px' }}>
              <DetailRow label="Discount type" value={DISCOUNT_TYPE_LABELS[promo.discountType]} />
              <DetailRow label="Offer" value={formatDiscountValue(promo)} />
              <DetailRow label="Applies to" value={appliesTo} />
              <DetailRow label="Minimum requirement" value={promo.minOrderAmount ? `$${promo.minOrderAmount} min order` : 'No minimum'} />
              <DetailRow label="Customer eligibility" value={eligibility} />
              <DetailRow label="Usage limit" value={promo.usageLimit ? `${promo.usageLimit} total uses` : 'Unlimited'} />
            </div>
          </div>

          <div className="bg-white" style={{ border: '1px solid var(--color-line)', borderRadius: '8px', padding: '24px' }}>
            <h3 className="font-bold text-ink" style={{ fontSize: '16px', marginBottom: '16px' }}>Summary</h3>
            <div className="flex flex-col" style={{ gap: '16px' }}>
              <div>
                <span className="text-ink-faint" style={{ fontSize: '12px', textTransform: 'uppercase' }}>Active dates</span>
                <p className="text-ink" style={{ fontSize: '14px', marginTop: '4px' }}>{formatDateRange(promo.startsAt, promo.expiresAt)}</p>
              </div>
              <div>
                <span className="text-ink-faint" style={{ fontSize: '12px', textTransform: 'uppercase' }}>Performance</span>
                <p className="text-ink" style={{ fontSize: '14px', marginTop: '4px' }}>{used > 0 ? `${used} redemptions` : 'Not used yet'}</p>
              </div>
              <div>
                <span className="text-ink-faint" style={{ fontSize: '12px', textTransform: 'uppercase' }}>Compatibility</span>
                <p className="text-ink-faint" style={{ fontSize: '12px', marginTop: '4px' }}>Cannot be combined with other automatic discounts.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Link to="/admin/discounts" className="bg-ink text-white no-underline" style={{ borderRadius: 'var(--radius-pill)', padding: '8px 32px', fontSize: '16px', fontWeight: 500, height: '48px' }}>Done</Link>
        </div>
      </div>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-ink-secondary" style={{ fontSize: '14px' }}>{label}</span>
      <span className="text-ink font-medium" style={{ fontSize: '14px' }}>{value}</span>
    </div>
  );
}