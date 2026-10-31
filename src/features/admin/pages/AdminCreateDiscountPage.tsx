import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { AdminNavbar } from '../components/AdminNavbar';
import { useCreatePromo } from '@shared/hooks/useCreatePromo';
import { useToast } from '@/shared/ui';
import { DISCOUNT_TYPE_LABELS, formatDiscountValue } from '../data/adminDiscountStaticData';
import type { DiscountType } from '@shared/hooks/useAdminPromos';

const DISCOUNT_TYPES: DiscountType[] = ['percentage', 'fixed_amount', 'free_shipping', 'buy_x_get_y'];

function generateCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 10; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

export function AdminCreateDiscountPage() {
  const navigate = useNavigate();
  const toast = useToast();
  const createPromo = useCreatePromo();

  const [code, setCode] = useState(generateCode());
  const [discountType, setDiscountType] = useState<DiscountType>('percentage');
  const [discountValue, setDiscountValue] = useState(5);
  const [minOrderAmount, setMinOrderAmount] = useState(0);
  const [hasUsageLimit, setHasUsageLimit] = useState(false);
  const [usageLimit, setUsageLimit] = useState(500);
  const [startsAt, setStartsAt] = useState(new Date().toISOString().slice(0, 10));
  const [expiresAt, setExpiresAt] = useState(() => {
    const d = new Date();
    d.setMonth(d.getMonth() + 3);
    return d.toISOString().slice(0, 10);
  });

  const summaryValue = formatDiscountValue({ discountType, discountValue } as any);

  function handleSubmit() {
    if (!code.trim()) { toast.error('Discount code is required'); return; }
    if (discountType !== 'free_shipping' && (!discountValue || discountValue <= 0)) { toast.error('Discount value must be greater than 0'); return; }
    if (new Date(expiresAt) < new Date(startsAt)) { toast.error('Expiry date must be after start date'); return; }

    createPromo.mutate(
      {
        code: code.trim().toUpperCase(),
        discountType,
        discountValue: discountType === 'free_shipping' ? 0 : discountValue,
        minOrderAmount: minOrderAmount > 0 ? minOrderAmount : undefined,
        startsAt: new Date(startsAt).toISOString(),
        expiresAt: new Date(expiresAt + 'T23:59:59').toISOString(),
        usageLimit: hasUsageLimit ? usageLimit : undefined,
        isActive: true,
      },
      {
        onSuccess: () => {
          toast.success(`Discount code "${code.trim().toUpperCase()}" created`);
          navigate(`/admin/discounts/${code.trim().toUpperCase()}/created`);
        },
        onError: (err: { message?: string }) => toast.error(err?.message ?? 'Failed to create discount'),
      },
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <AdminNavbar />
      <div className="flex flex-col" style={{ padding: '32px', gap: '24px' }}>
        <Link to="/admin/discounts" className="flex items-center text-ink-secondary hover:text-ink no-underline" style={{ gap: '8px', fontSize: '16px' }}>
          <ArrowLeft className="w-5 h-5" /> Back to Discounts
        </Link>
        <h1 className="font-bold text-ink" style={{ fontSize: '20px' }}>Create discount</h1>

        <div className="grid" style={{ gridTemplateColumns: '1fr 320px', gap: '24px', alignItems: 'start' }}>
          {/* Form */}
          <div className="bg-white" style={{ border: '1px solid var(--color-line)', borderRadius: '8px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div className="flex flex-col" style={{ gap: '6px' }}>
              <label className="text-ink-secondary" style={{ fontSize: '14px' }}>Discount code</label>
              <div className="flex items-center" style={{ gap: '8px' }}>
                <input type="text" value={code} onChange={(e) => setCode(e.target.value)} className="flex-1 bg-white text-ink font-mono" style={{ border: '1px solid var(--color-line)', borderRadius: '8px', padding: '12px', fontSize: '14px', height: '40px', textTransform: 'uppercase' }} />
                <button onClick={() => setCode(generateCode())} className="bg-white text-ink" style={{ border: '1px solid var(--color-line)', borderRadius: '8px', padding: '8px 12px', fontSize: '14px', height: '40px' }}>Generate</button>
              </div>
              <span className="text-ink-faint" style={{ fontSize: '12px' }}>Customers will enter this code at checkout</span>
            </div>

            <div className="flex flex-col" style={{ gap: '8px' }}>
              <label className="text-ink-secondary" style={{ fontSize: '14px' }}>Discount type</label>
              <div className="grid grid-cols-2" style={{ gap: '8px' }}>
                {DISCOUNT_TYPES.map((t) => (
                  <button key={t} onClick={() => setDiscountType(t)} className={discountType === t ? 'bg-ink text-white' : 'bg-white text-ink'} style={{ border: discountType === t ? 'none' : '1px solid var(--color-line)', borderRadius: '8px', padding: '12px', fontSize: '14px', fontWeight: 500, cursor: 'pointer' }}>
                    {DISCOUNT_TYPE_LABELS[t]}
                  </button>
                ))}
              </div>
            </div>

            {discountType !== 'free_shipping' && (
              <div className="flex flex-col" style={{ gap: '6px' }}>
                <label className="text-ink-secondary" style={{ fontSize: '14px' }}>
                  {discountType === 'percentage' ? 'Percentage off (%)' : discountType === 'fixed_amount' ? 'Amount off ($)' : 'Buy X quantity'}
                </label>
                <input type="number" value={discountValue} onChange={(e) => setDiscountValue(Number(e.target.value))} min={0} className="w-full bg-white text-ink" style={{ border: '1px solid var(--color-line)', borderRadius: '8px', padding: '12px', fontSize: '14px', height: '40px' }} />
              </div>
            )}

            <div className="flex flex-col" style={{ gap: '8px' }}>
              <label className="text-ink-secondary" style={{ fontSize: '14px' }}>Minimum requirement</label>
              <div className="flex items-center" style={{ gap: '12px' }}>
                <input type="number" value={minOrderAmount} onChange={(e) => setMinOrderAmount(Number(e.target.value))} min={0} placeholder="0 = no minimum" className="flex-1 bg-white text-ink" style={{ border: '1px solid var(--color-line)', borderRadius: '8px', padding: '12px', fontSize: '14px', height: '40px' }} />
                <span className="text-ink-faint" style={{ fontSize: '14px' }}>Min order amount ($)</span>
              </div>
            </div>

            <div className="grid grid-cols-2" style={{ gap: '16px' }}>
              <div className="flex flex-col" style={{ gap: '6px' }}>
                <label className="text-ink-secondary" style={{ fontSize: '14px' }}>Start date</label>
                <input type="date" value={startsAt} onChange={(e) => setStartsAt(e.target.value)} className="w-full bg-white text-ink" style={{ border: '1px solid var(--color-line)', borderRadius: '8px', padding: '12px', fontSize: '14px', height: '40px' }} />
              </div>
              <div className="flex flex-col" style={{ gap: '6px' }}>
                <label className="text-ink-secondary" style={{ fontSize: '14px' }}>End date</label>
                <input type="date" value={expiresAt} onChange={(e) => setExpiresAt(e.target.value)} className="w-full bg-white text-ink" style={{ border: '1px solid var(--color-line)', borderRadius: '8px', padding: '12px', fontSize: '14px', height: '40px' }} />
              </div>
            </div>

            <div className="flex flex-col" style={{ gap: '8px' }}>
              <label className="flex items-center text-ink" style={{ gap: '8px', fontSize: '14px' }}>
                <input type="checkbox" checked={hasUsageLimit} onChange={(e) => setHasUsageLimit(e.target.checked)} /> Limit number of times this discount can be used
              </label>
              {hasUsageLimit && (
                <input type="number" value={usageLimit} onChange={(e) => setUsageLimit(Number(e.target.value))} min={1} className="w-full bg-white text-ink" style={{ border: '1px solid var(--color-line)', borderRadius: '8px', padding: '12px', fontSize: '14px', height: '40px' }} />
              )}
            </div>
          </div>

          {/* Summary */}
          <div className="bg-white" style={{ border: '1px solid var(--color-line)', borderRadius: '8px', padding: '24px', position: 'sticky', top: '24px' }}>
            <h3 className="font-bold text-ink" style={{ fontSize: '16px', marginBottom: '16px' }}>Summary</h3>
            <div className="flex flex-col" style={{ gap: '12px' }}>
              <div><span className="text-ink-faint" style={{ fontSize: '12px', textTransform: 'uppercase' }}>Offer</span><p className="text-ink font-medium" style={{ fontSize: '14px' }}>{summaryValue}</p></div>
              <div><span className="text-ink-faint" style={{ fontSize: '12px', textTransform: 'uppercase' }}>Min order</span><p className="text-ink" style={{ fontSize: '14px' }}>{minOrderAmount > 0 ? `$${minOrderAmount}` : 'No minimum'}</p></div>
              <div><span className="text-ink-faint" style={{ fontSize: '12px', textTransform: 'uppercase' }}>Usage limit</span><p className="text-ink" style={{ fontSize: '14px' }}>{hasUsageLimit ? `${usageLimit} uses` : 'Unlimited'}</p></div>
              <div><span className="text-ink-faint" style={{ fontSize: '12px', textTransform: 'uppercase' }}>Active dates</span><p className="text-ink" style={{ fontSize: '14px' }}>{startsAt} → {expiresAt}</p></div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end" style={{ gap: '12px' }}>
          <Link to="/admin/discounts" className="text-ink-secondary no-underline" style={{ fontSize: '16px', fontWeight: 500, padding: '8px 16px' }}>Discard</Link>
          <button onClick={handleSubmit} disabled={createPromo.isPending} className="bg-ink text-white" style={{ borderRadius: 'var(--radius-pill)', padding: '8px 24px', fontSize: '16px', fontWeight: 500, height: '48px', opacity: createPromo.isPending ? 0.6 : 1 }}>
            {createPromo.isPending ? 'Saving...' : 'Save discount'}
          </button>
        </div>
      </div>
    </div>
  );
}