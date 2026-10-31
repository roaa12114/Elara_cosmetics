import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, Package, Truck, Home, Clock } from 'lucide-react';
import { SellerNavbar } from '../components/SellerNavbar';
import { sellerOrderDetail } from '../data/sellerStaticData';
import { formatCurrency } from '@shared/lib/utils';

const STATUS_STYLES: Record<string, { bg: string; text: string }> = {
  Delivered: { bg: 'var(--color-status-delivered-bg)', text: 'var(--color-success-text)' },
  Paid: { bg: 'var(--color-status-delivered-bg)', text: 'var(--color-success-text)' },
};
const TIMELINE_ICONS = [Clock, CheckCircle2, Package, Truck, Truck, Home];

export function SellerOrderDetailPage() {
  const { id } = useParams();
  const order = sellerOrderDetail;
  const st = STATUS_STYLES[order.status] ?? STATUS_STYLES.Delivered;
  const paySt = STATUS_STYLES[order.payment] ?? STATUS_STYLES.Paid;

  return (
    <div className="flex flex-col min-h-screen">
      <SellerNavbar />
      <div className="flex flex-col" style={{ padding: '32px', gap: '24px' }}>
        <Link to="/seller/orders" className="flex items-center text-ink-secondary hover:text-ink no-underline" style={{ gap: '8px', fontSize: '16px' }}><ArrowLeft className="w-5 h-5" /> Back to Orders</Link>
        <div className="bg-white" style={{ border: '1px solid var(--color-line)', borderRadius: '8px', padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div><h1 className="font-bold text-ink" style={{ fontSize: '24px' }}>{order.id}</h1><p className="text-ink-faint" style={{ fontSize: '14px', marginTop: '4px' }}>{order.date}</p></div>
          <div className="flex items-center" style={{ gap: '8px' }}>
            <span className="inline-flex items-center justify-center" style={{ background: st.bg, color: st.text, borderRadius: '6px', padding: '8px 16px', fontSize: '14px', fontWeight: 500 }}>{order.status}</span>
            <span className="inline-flex items-center justify-center" style={{ background: paySt.bg, color: paySt.text, borderRadius: '6px', padding: '8px 16px', fontSize: '14px', fontWeight: 500 }}>{order.payment}</span>
          </div>
        </div>
        <div className="grid" style={{ gridTemplateColumns: '400px 1fr', gap: '24px' }}>
          <div className="bg-white" style={{ border: '1px solid var(--color-line)', borderRadius: '8px', padding: '24px' }}>
            <h3 className="font-bold text-ink" style={{ fontSize: '16px', marginBottom: '16px' }}>Customer</h3>
            <div className="flex flex-col" style={{ gap: '12px' }}>
              <div><span className="text-ink-faint" style={{ fontSize: '12px', textTransform: 'uppercase' }}>Name</span><p className="text-ink" style={{ fontSize: '14px' }}>{order.customer.name}</p></div>
              <div><span className="text-ink-faint" style={{ fontSize: '12px', textTransform: 'uppercase' }}>Address</span><p className="text-ink" style={{ fontSize: '14px' }}>{order.customer.address}</p></div>
              <div><span className="text-ink-faint" style={{ fontSize: '12px', textTransform: 'uppercase' }}>Phone</span><p className="text-ink" style={{ fontSize: '14px' }}>{order.customer.phone}</p></div>
            </div>
            <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--color-line)' }}>
              <span className="text-ink-faint" style={{ fontSize: '12px', textTransform: 'uppercase' }}>Carrier</span><p className="text-ink" style={{ fontSize: '14px' }}>{order.carrier}</p>
              <span className="text-ink-faint" style={{ fontSize: '12px', textTransform: 'uppercase', display: 'block', marginTop: '8px' }}>Tracking Number</span><p className="text-ink font-mono" style={{ fontSize: '14px' }}>{order.trackingNumber}</p>
            </div>
          </div>
          <div className="bg-white" style={{ border: '1px solid var(--color-line)', borderRadius: '8px', padding: '24px' }}>
            <h3 className="font-bold text-ink" style={{ fontSize: '16px', marginBottom: '16px' }}>Order Items</h3>
            <table className="w-full">
              <thead><tr style={{ borderBottom: '1px solid var(--color-line)' }}>
                <th className="text-left font-bold text-ink-secondary" style={{ padding: '12px 0', fontSize: '12px', textTransform: 'uppercase' }}>Product</th>
                <th className="text-center font-bold text-ink-secondary" style={{ padding: '12px 0', fontSize: '12px', textTransform: 'uppercase' }}>Qty</th>
                <th className="text-right font-bold text-ink-secondary" style={{ padding: '12px 0', fontSize: '12px', textTransform: 'uppercase' }}>Price</th>
              </tr></thead>
              <tbody>{order.items.map((item, i) => (
                <tr key={i} style={{ borderBottom: '1px solid var(--color-line)' }}>
                  <td style={{ padding: '12px 0' }}><div className="text-ink font-medium" style={{ fontSize: '14px' }}>{item.name}</div><div className="text-ink-faint" style={{ fontSize: '12px' }}>SKU: {item.sku}</div></td>
                  <td className="text-center text-ink" style={{ padding: '12px 0', fontSize: '14px' }}>{item.quantity}</td>
                  <td className="text-right font-bold text-ink" style={{ padding: '12px 0', fontSize: '14px' }}>{formatCurrency(item.price)}</td>
                </tr>
              ))}</tbody>
            </table>
            <div className="flex flex-col" style={{ gap: '8px', marginTop: '16px' }}>
              <div className="flex justify-between"><span className="text-ink-secondary" style={{ fontSize: '14px' }}>Subtotal</span><span className="text-ink" style={{ fontSize: '14px' }}>{formatCurrency(order.subtotal)}</span></div>
              <div className="flex justify-between"><span className="text-ink-secondary" style={{ fontSize: '14px' }}>Shipping</span><span className="text-ink" style={{ fontSize: '14px' }}>{formatCurrency(order.shipping)}</span></div>
              <div className="flex justify-between"><span className="text-ink-secondary" style={{ fontSize: '14px' }}>Platform Fee</span><span className="text-danger-dark" style={{ fontSize: '14px' }}>-{formatCurrency(order.platformFee)}</span></div>
              <div className="flex justify-between" style={{ paddingTop: '8px', borderTop: '1px solid var(--color-line)' }}><span className="font-bold text-ink" style={{ fontSize: '16px' }}>Total</span><span className="font-bold text-ink" style={{ fontSize: '16px' }}>{formatCurrency(order.total)}</span></div>
            </div>
          </div>
        </div>
        <div className="bg-white" style={{ border: '1px solid var(--color-line)', borderRadius: '8px', padding: '24px' }}>
          <h3 className="font-bold text-ink" style={{ fontSize: '16px', marginBottom: '24px' }}>Order Timeline</h3>
          <div className="flex items-start justify-between">
            {order.timeline.map((step, i) => {
              const Icon = TIMELINE_ICONS[i] ?? CheckCircle2;
              const isLast = i === order.timeline.length - 1;
              return (
                <div key={i} className="flex flex-col items-center" style={{ flex: '1', position: 'relative' }}>
                  {!isLast && <div style={{ position: 'absolute', top: '16px', left: '50%', right: '-50%', height: '2px', background: step.complete ? 'var(--color-success-text)' : 'var(--color-line)', zIndex: 0 }} />}
                  <div className="flex items-center justify-center" style={{ width: '32px', height: '32px', borderRadius: '50%', background: step.complete ? 'var(--color-success-text)' : 'var(--color-line)', color: step.complete ? 'white' : 'var(--color-ink-faint)', position: 'relative', zIndex: 1 }}>
                    {step.complete ? <CheckCircle2 className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                  </div>
                  <span className="text-ink" style={{ fontSize: '12px', fontWeight: 500, marginTop: '8px', textAlign: 'center' }}>{step.step}</span>
                  <span className="text-ink-faint" style={{ fontSize: '11px', textAlign: 'center' }}>{step.date}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}