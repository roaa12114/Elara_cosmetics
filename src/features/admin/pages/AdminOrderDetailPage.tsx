import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, Truck, Home, Package, XCircle, Printer } from 'lucide-react';
import { AdminNavbar } from '../components/AdminNavbar';
import { useUpdateOrderStatus } from '@shared/hooks/useUpdateOrderStatus';
import { useToast } from '@/shared/ui';
import { formatCurrency } from '@shared/lib/utils';
import { getOrderDetail, STATUS_DISPLAY } from '../data/adminOrderStaticData';
import type { OrderStatus } from '../data/adminOrderStaticData';

type StatusKey = 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled' | 'Pending';
const STATUS_STYLES: Record<StatusKey, { bg: string; text: string }> = {
  Processing: { bg: 'var(--color-status-processing-bg)', text: 'var(--color-info-text)' },
  Shipped: { bg: 'var(--color-status-shipped-bg)', text: 'var(--color-info-text)' },
  Delivered: { bg: 'var(--color-status-delivered-bg)', text: 'var(--color-success-text)' },
  Cancelled: { bg: 'var(--color-status-out-of-stock-bg)', text: 'var(--color-danger-dark)' },
  Pending: { bg: 'var(--color-status-pending-bg)', text: 'var(--color-warning-text)' },
};

const TIMELINE_ICONS = [CheckCircle2, CheckCircle2, Package, Truck, Home];

export function AdminOrderDetailPage() {
  const { orderId } = useParams();
  const toast = useToast();
  const updateStatus = useUpdateOrderStatus();
  const order = orderId ? getOrderDetail(orderId) : undefined;

  if (!order) {
    return (
      <div className="flex flex-col min-h-screen">
        <AdminNavbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-ink" style={{ fontSize: '18px', fontWeight: 600 }}>Order not found</p>
            <Link to="/admin/orders" className="text-brand hover:underline">← Back to Orders</Link>
          </div>
        </div>
      </div>
    );
  }

  const st = STATUS_STYLES[STATUS_DISPLAY[order.status as OrderStatus] as StatusKey] ?? STATUS_STYLES.Pending;

  function handleCancel() {
    if (!window.confirm(`Cancel order ${order!.orderId}? This will notify ${order!.customer.name}.`)) return;
    updateStatus.mutate(
      { orderId: order!._id, status: 'cancelled' as OrderStatus },
      {
        onSuccess: () => toast.success(`Order ${order!.orderId} cancelled`),
        onError: (err: { message?: string }) => toast.error(err?.message ?? 'Failed to cancel order'),
      },
    );
  }

  function handlePrint() {
    toast.show(`Printing invoice for ${order!.orderId}...`);
    setTimeout(() => window.print(), 500);
  }

  return (
    <div className="flex flex-col min-h-screen">
      <AdminNavbar />
      <div className="flex flex-col" style={{ padding: '32px', gap: '24px' }}>
        <Link to="/admin/orders" className="flex items-center text-ink-secondary hover:text-ink no-underline" style={{ gap: '8px', fontSize: '16px' }}>
          <ArrowLeft className="w-5 h-5" /> Back to Orders
        </Link>

        <div className="bg-white" style={{ border: '1px solid var(--color-line)', borderRadius: '8px', padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 className="font-bold text-ink" style={{ fontSize: '24px' }}>Order {order.orderId}</h1>
            <p className="text-ink-faint" style={{ fontSize: '14px', marginTop: '4px' }}>{order.date} · {order.paymentMethod}</p>
          </div>
          <div className="flex items-center" style={{ gap: '12px' }}>
            <span className="inline-flex items-center justify-center" style={{ background: st.bg, color: st.text, borderRadius: '6px', padding: '8px 16px', fontSize: '14px', fontWeight: 500 }}>{STATUS_DISPLAY[order.status as OrderStatus]}</span>
            <button onClick={handlePrint} className="flex items-center bg-white text-ink" style={{ border: '1px solid var(--color-line)', borderRadius: 'var(--radius-pill)', padding: '8px 16px', gap: '6px', fontSize: '14px', fontWeight: 500 }}>
              <Printer className="w-4 h-4" /> Print Invoice
            </button>
            {order.status !== 'cancelled' && (
              <button onClick={handleCancel} disabled={updateStatus.isPending} className="flex items-center text-danger-dark" style={{ border: '1px solid var(--color-danger-dark)', borderRadius: 'var(--radius-pill)', padding: '8px 16px', gap: '6px', fontSize: '14px', fontWeight: 500, opacity: updateStatus.isPending ? 0.6 : 1 }}>
                <XCircle className="w-4 h-4" /> {updateStatus.isPending ? 'Cancelling...' : 'Cancel Order'}
              </button>
            )}
          </div>
        </div>

        <div className="grid" style={{ gridTemplateColumns: '360px 1fr', gap: '24px' }}>
          <div className="bg-white" style={{ border: '1px solid var(--color-line)', borderRadius: '8px', padding: '24px' }}>
            <h3 className="font-bold text-ink" style={{ fontSize: '16px', marginBottom: '16px' }}>Customer</h3>
            <div className="flex flex-col" style={{ gap: '12px' }}>
              <div><span className="text-ink-faint" style={{ fontSize: '12px', textTransform: 'uppercase' }}>Name</span><p className="text-ink" style={{ fontSize: '14px' }}>{order.customer.name}</p></div>
              <div><span className="text-ink-faint" style={{ fontSize: '12px', textTransform: 'uppercase' }}>Email</span><p className="text-ink" style={{ fontSize: '14px' }}>{order.customer.email}</p></div>
              <div><span className="text-ink-faint" style={{ fontSize: '12px', textTransform: 'uppercase' }}>Phone</span><p className="text-ink" style={{ fontSize: '14px' }}>{order.customer.phone}</p></div>
            </div>
            <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--color-line)' }}>
              <h3 className="font-bold text-ink" style={{ fontSize: '16px', marginBottom: '12px' }}>Shipping</h3>
              <div className="flex flex-col" style={{ gap: '8px' }}>
                <div><span className="text-ink-faint" style={{ fontSize: '12px', textTransform: 'uppercase' }}>Address</span><p className="text-ink" style={{ fontSize: '14px' }}>{order.shipping.address}</p></div>
                <div><span className="text-ink-faint" style={{ fontSize: '12px', textTransform: 'uppercase' }}>Tracking</span><p className="text-ink font-mono" style={{ fontSize: '14px' }}>{order.shipping.tracking}</p></div>
              </div>
            </div>
          </div>

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
              <tbody>
                {order.items.map((item, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid var(--color-line)' }}>
                    <td style={{ padding: '12px 0' }}><span className="text-ink font-medium" style={{ fontSize: '14px' }}>{item.name}</span></td>
                    <td className="text-ink-faint" style={{ padding: '12px 0', fontSize: '14px' }}>{item.category}</td>
                    <td className="text-center text-ink" style={{ padding: '12px 0', fontSize: '14px' }}>{item.qty}</td>
                    <td className="text-right text-ink" style={{ padding: '12px 0', fontSize: '14px' }}>{formatCurrency(item.price)}</td>
                    <td className="text-right font-bold text-ink" style={{ padding: '12px 0', fontSize: '14px' }}>{formatCurrency(item.price * item.qty)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex flex-col" style={{ gap: '8px', marginTop: '16px' }}>
              <div className="flex justify-between"><span className="text-ink-secondary" style={{ fontSize: '14px' }}>Subtotal</span><span className="text-ink" style={{ fontSize: '14px' }}>{formatCurrency(order.subtotal)}</span></div>
              <div className="flex justify-between"><span className="text-ink-secondary" style={{ fontSize: '14px' }}>Shipping</span><span className="text-ink" style={{ fontSize: '14px' }}>{formatCurrency(order.shippingCost)}</span></div>
              <div className="flex justify-between"><span className="text-ink-secondary" style={{ fontSize: '14px' }}>Tax</span><span className="text-ink" style={{ fontSize: '14px' }}>{formatCurrency(order.tax)}</span></div>
              {order.discount > 0 && <div className="flex justify-between"><span className="text-ink-secondary" style={{ fontSize: '14px' }}>Discount ({order.discountCode})</span><span className="text-danger-dark" style={{ fontSize: '14px' }}>-{formatCurrency(order.discount)}</span></div>}
              <div className="flex justify-between" style={{ paddingTop: '8px', borderTop: '1px solid var(--color-line)' }}>
                <span className="font-bold text-ink" style={{ fontSize: '16px' }}>Total</span>
                <span className="font-bold text-ink" style={{ fontSize: '16px' }}>{formatCurrency(order.total)}</span>
              </div>
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