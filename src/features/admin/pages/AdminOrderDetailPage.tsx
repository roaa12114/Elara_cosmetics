import { Link, useParams } from 'react-router-dom';
import { CheckCircle2, Truck, Home, Package } from 'lucide-react';
import { AdminNavbar } from '../components/AdminNavbar';
import { adminOrderDetail } from '../data/adminStaticData';
import { formatCurrency } from '@shared/lib/utils';

const STATUS_STYLES: Record<string, { bg: string; text: string }> = {
  Processing: { bg: 'var(--color-status-processing-bg)', text: 'var(--color-info-text)' },
};

const TIMELINE_ICONS = [CheckCircle2, CheckCircle2, Package, Truck, Home];

export function AdminOrderDetailPage() {
  const { orderId } = useParams();
  const o = adminOrderDetail;
  const st = STATUS_STYLES[o.status] ?? { bg: 'var(--color-status-out-of-stock-bg)', text: '#171315' };

  return (
    <div className="flex flex-col min-h-screen">
      <AdminNavbar />
      <div className="flex flex-col" style={{ padding: '32px', gap: '24px' }}>
        <nav className="flex items-center text-ink-faint" style={{ gap: '8px', fontSize: '14px' }}>
          <Link to="/admin" className="hover:text-ink no-underline">Home</Link><span>/</span>
          <Link to="/admin/customers" className="hover:text-ink no-underline">Customers</Link><span>/</span>
          <span className="text-ink font-medium">Order #{o.id}</span>
        </nav>

        {/* Header */}
        <div className="bg-white" style={{ border: '1px solid var(--color-line)', borderRadius: '8px', padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 className="font-bold text-ink" style={{ fontSize: '24px' }}>Order #{o.id}</h1>
            <p className="text-ink-faint" style={{ fontSize: '14px', marginTop: '4px' }}>{o.date} · {o.payment}</p>
          </div>
          <span className="inline-flex items-center justify-center" style={{ background: st.bg, color: st.text, borderRadius: '6px', padding: '8px 16px', fontSize: '14px', fontWeight: 500 }}>{o.status}</span>
        </div>

        <div className="grid" style={{ gridTemplateColumns: '360px 1fr', gap: '24px' }}>
          {/* Customer + shipping */}
          <div className="bg-white" style={{ border: '1px solid var(--color-line)', borderRadius: '8px', padding: '24px' }}>
            <h3 className="font-bold text-ink" style={{ fontSize: '16px', marginBottom: '16px' }}>Customer</h3>
            <div className="flex flex-col" style={{ gap: '12px' }}>
              <div><span className="text-ink-faint" style={{ fontSize: '12px', textTransform: 'uppercase' }}>Name</span><p className="text-ink" style={{ fontSize: '14px' }}>{o.customer.name}</p></div>
              <div><span className="text-ink-faint" style={{ fontSize: '12px', textTransform: 'uppercase' }}>Email</span><p className="text-ink" style={{ fontSize: '14px' }}>{o.customer.email}</p></div>
              <div><span className="text-ink-faint" style={{ fontSize: '12px', textTransform: 'uppercase' }}>Phone</span><p className="text-ink" style={{ fontSize: '14px' }}>{o.customer.phone}</p></div>
            </div>
            <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--color-line)' }}>
              <h3 className="font-bold text-ink" style={{ fontSize: '16px', marginBottom: '12px' }}>Shipping</h3>
              <div className="flex flex-col" style={{ gap: '8px' }}>
                <div><span className="text-ink-faint" style={{ fontSize: '12px', textTransform: 'uppercase' }}>Address</span><p className="text-ink" style={{ fontSize: '14px' }}>{o.shipping.address}</p></div>
                <div><span className="text-ink-faint" style={{ fontSize: '12px', textTransform: 'uppercase' }}>Tracking</span><p className="text-ink font-mono" style={{ fontSize: '14px' }}>{o.shipping.tracking}</p></div>
              </div>
            </div>
          </div>

          {/* Items + totals */}
          <div className="bg-white" style={{ border: '1px solid var(--color-line)', borderRadius: '8px', padding: '24px' }}>
            <h3 className="font-bold text-ink" style={{ fontSize: '16px', marginBottom: '16px' }}>Order Items</h3>
            <table className="w-full">
              <thead><tr style={{ borderBottom: '1px solid var(--color-line)' }}>
                <th className="text-left font-bold text-ink-secondary" style={{ padding: '12px 0', fontSize: '12px', textTransform: 'uppercase' }}>Product</th>
                <th className="text-left font-bold text-ink-secondary" style={{ padding: '12px 0', fontSize: '12px', textTransform: 'uppercase' }}>Category</th>
                <th className="text-center font-bold text-ink-secondary" style={{ padding: '12px 0', fontSize: '12px', textTransform: 'uppercase' }}>Qty</th>
                <th className="text-right font-bold text-ink-secondary" style={{ padding: '12px 0', fontSize: '12px', textTransform: 'uppercase' }}>Price</th>
                <th className="text-right font-bold text-ink-secondary" style={{ padding: '12px 0', fontSize: '12px', textTransform: 'uppercase' }}>Subtotal</th>
              </tr></thead>
              <tbody>{o.items.map((item, i) => (
                <tr key={i} style={{ borderBottom: '1px solid var(--color-line)' }}>
                  <td style={{ padding: '12px 0' }}><span className="text-ink font-medium" style={{ fontSize: '14px' }}>{item.name}</span></td>
                  <td className="text-ink-faint" style={{ padding: '12px 0', fontSize: '14px' }}>{item.category}</td>
                  <td className="text-center text-ink" style={{ padding: '12px 0', fontSize: '14px' }}>{item.qty}</td>
                  <td className="text-right text-ink" style={{ padding: '12px 0', fontSize: '14px' }}>{formatCurrency(item.price)}</td>
                  <td className="text-right font-bold text-ink" style={{ padding: '12px 0', fontSize: '14px' }}>{formatCurrency(item.price * item.qty)}</td>
                </tr>
              ))}</tbody>
            </table>
            <div className="flex flex-col" style={{ gap: '8px', marginTop: '16px' }}>
              <div className="flex justify-between"><span className="text-ink-secondary" style={{ fontSize: '14px' }}>Subtotal</span><span className="text-ink" style={{ fontSize: '14px' }}>{formatCurrency(o.subtotal)}</span></div>
              <div className="flex justify-between"><span className="text-ink-secondary" style={{ fontSize: '14px' }}>Shipping</span><span className="text-ink" style={{ fontSize: '14px' }}>{formatCurrency(o.shippingCost)}</span></div>
              <div className="flex justify-between"><span className="text-ink-secondary" style={{ fontSize: '14px' }}>Tax</span><span className="text-ink" style={{ fontSize: '14px' }}>{formatCurrency(o.tax)}</span></div>
              <div className="flex justify-between"><span className="text-ink-secondary" style={{ fontSize: '14px' }}>Discount ({o.discountCode})</span><span className="text-danger-dark" style={{ fontSize: '14px' }}>-{formatCurrency(o.discount)}</span></div>
              <div className="flex justify-between" style={{ paddingTop: '8px', borderTop: '1px solid var(--color-line)' }}><span className="font-bold text-ink" style={{ fontSize: '16px' }}>Total</span><span className="font-bold text-ink" style={{ fontSize: '16px' }}>{formatCurrency(o.total)}</span></div>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-white" style={{ border: '1px solid var(--color-line)', borderRadius: '8px', padding: '24px' }}>
          <h3 className="font-bold text-ink" style={{ fontSize: '16px', marginBottom: '24px' }}>Order Timeline</h3>
          <div className="flex items-start justify-between">
            {o.timeline.map((step, i) => {
              const Icon = TIMELINE_ICONS[i] ?? CheckCircle2;
              const isLast = i === o.timeline.length - 1;
              return (
                <div key={i} className="flex flex-col items-center" style={{ flex: '1', position: 'relative' }}>
                  {!isLast && <div style={{ position: 'absolute', top: '16px', left: '50%', right: '-50%', height: '2px', background: step.complete ? 'var(--color-success-text)' : 'var(--color-line)', zIndex: 0 }} />}
                  <div className="flex items-center justify-center" style={{ width: '32px', height: '32px', borderRadius: '50%', background: step.complete ? 'var(--color-success-text)' : 'var(--color-line)', color: step.complete ? 'white' : 'var(--color-ink-faint)', position: 'relative', zIndex: 1 }}>
                    {step.complete ? <CheckCircle2 className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                  </div>
                  <span className="text-ink" style={{ fontSize: '12px', fontWeight: 500, marginTop: '8px', textAlign: 'center' }}>{step.step}</span>
                  {step.date && <span className="text-ink-faint" style={{ fontSize: '11px', textAlign: 'center' }}>{step.date}</span>}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}