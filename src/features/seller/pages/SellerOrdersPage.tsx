import { Link } from 'react-router-dom';
import { Search, Download, Eye } from 'lucide-react';
import { SellerNavbar } from '../components/SellerNavbar';
import { sellerOrders, sellerOrderStats } from '../data/sellerStaticData';
import { formatCurrency } from '@shared/lib/utils';

const STATUS_STYLES: Record<string, { bg: string; text: string }> = {
  Delivered: { bg: 'var(--color-status-delivered-bg)', text: 'var(--color-success-text)' },
  Shipped: { bg: 'var(--color-status-shipped-bg)', text: 'var(--color-danger-dark)' },
  Processing: { bg: 'var(--color-status-processing-bg)', text: 'var(--color-info-text)' },
  Pending: { bg: 'var(--color-status-pending-bg)', text: 'var(--color-warning-text)' },
  Cancelled: { bg: 'var(--color-status-out-of-stock-bg)', text: '#171315' },
};
const PAYMENT_STYLES: Record<string, { bg: string; text: string }> = {
  Paid: { bg: 'var(--color-status-delivered-bg)', text: 'var(--color-success-text)' },
  Refunded: { bg: 'var(--color-status-out-of-stock-bg)', text: '#171315' },
};
const FILTER_TABS = ['All Orders', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
const STAT_CARDS = [
  { label: 'Pending', value: sellerOrderStats.pending, subtitle: 'awaiting', color: 'var(--color-warning-text)' },
  { label: 'Shipped', value: sellerOrderStats.shipped, subtitle: 'in transit', color: 'var(--color-danger-dark)' },
  { label: 'Cancelled', value: sellerOrderStats.cancelled, subtitle: 'this month', color: '#171315' },
  { label: 'Processing', value: sellerOrderStats.processing, subtitle: 'being packed', color: 'var(--color-info-text)' },
  { label: 'Delivered', value: sellerOrderStats.delivered, subtitle: 'completed', color: 'var(--color-success-text)' },
];

export function SellerOrdersPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <SellerNavbar />
      <div className="flex flex-col" style={{ padding: '32px', gap: '24px' }}>
        <div className="flex items-center justify-between">
          <h1 className="font-bold text-ink" style={{ fontSize: '20px' }}>Orders</h1>
          <button className="flex items-center text-ink-secondary" style={{ border: '1px solid var(--color-ink-secondary)', borderRadius: 'var(--radius-pill)', padding: '8px 16px', gap: '8px', fontSize: '18px', fontWeight: 500, height: '48px' }}>
            <Download className="w-5 h-5" /> Export
          </button>
        </div>
        <div className="grid" style={{ gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px' }}>
          {STAT_CARDS.map((s) => (
            <div key={s.label} className="bg-white" style={{ borderRadius: '8px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <span className="text-ink-secondary" style={{ fontSize: '14px' }}>{s.label}</span>
              <span className="font-bold" style={{ fontSize: '24px', color: s.color }}>{s.value}</span>
              <span className="text-ink-faint" style={{ fontSize: '12px' }}>{s.subtitle}</span>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center overflow-hidden" style={{ minWidth: '300px', height: '48px', border: '1px solid var(--color-brand)', borderRadius: 'var(--radius-pill)' }}>
            <input type="search" placeholder="Search by order ID or customer..." className="flex-1 h-full bg-transparent px-6 text-body2 focus:outline-none" />
            <div className="bg-ink h-full flex items-center justify-center" style={{ width: '78px', borderRadius: '0 var(--radius-pill) var(--radius-pill) 0' }}><Search className="w-5 h-5 text-white" /></div>
          </div>
          <div className="flex items-center" style={{ gap: '6px' }}>
            {FILTER_TABS.map((tab, i) => (
              <button key={tab} className={i === 0 ? 'bg-ink text-white' : 'text-ink-secondary'} style={{ borderRadius: 'var(--radius-pill)', padding: '8px 16px', fontSize: '14px', fontWeight: 500, border: i === 0 ? 'none' : '1px solid var(--color-line)' }}>{tab}</button>
            ))}
          </div>
        </div>
        <div className="bg-white overflow-hidden" style={{ border: '1px solid var(--color-line)', borderRadius: '8px' }}>
          <table className="w-full">
            <thead><tr style={{ borderBottom: '1px solid var(--color-line)', background: '#FFF9F9' }}>
              <th className="text-left font-bold text-ink-secondary" style={{ padding: '12px 16px', fontSize: '12px', textTransform: 'uppercase' }}>Order ID</th>
              <th className="text-left font-bold text-ink-secondary" style={{ padding: '12px 16px', fontSize: '12px', textTransform: 'uppercase' }}>Customer</th>
              <th className="text-left font-bold text-ink-secondary" style={{ padding: '12px 16px', fontSize: '12px', textTransform: 'uppercase' }}>Date</th>
              <th className="text-left font-bold text-ink-secondary" style={{ padding: '12px 16px', fontSize: '12px', textTransform: 'uppercase' }}>Products</th>
              <th className="text-right font-bold text-ink-secondary" style={{ padding: '12px 16px', fontSize: '12px', textTransform: 'uppercase' }}>Total</th>
              <th className="text-center font-bold text-ink-secondary" style={{ padding: '12px 16px', fontSize: '12px', textTransform: 'uppercase' }}>Payment</th>
              <th className="text-center font-bold text-ink-secondary" style={{ padding: '12px 16px', fontSize: '12px', textTransform: 'uppercase' }}>Status</th>
              <th className="text-center font-bold text-ink-secondary" style={{ padding: '12px 16px', fontSize: '12px', textTransform: 'uppercase' }}>Action</th>
            </tr></thead>
            <tbody>
              {sellerOrders.map((o) => {
                const st = STATUS_STYLES[o.status] ?? STATUS_STYLES.Pending;
                const pay = PAYMENT_STYLES[o.payment] ?? PAYMENT_STYLES.Paid;
                return (
                  <tr key={o.id} style={{ borderBottom: '1px solid var(--color-line)' }} className="hover:bg-surface transition-colors">
                    <td className="font-medium text-ink" style={{ padding: '12px 16px', fontSize: '14px' }}>{o.id}</td>
                    <td className="text-ink-muted" style={{ padding: '12px 16px', fontSize: '14px' }}>{o.customer}</td>
                    <td className="text-ink-faint" style={{ padding: '12px 16px', fontSize: '14px' }}>{o.date}</td>
                    <td className="text-ink-secondary" style={{ padding: '12px 16px', fontSize: '14px' }}>{o.product}</td>
                    <td className="text-right font-bold text-ink" style={{ padding: '12px 16px', fontSize: '14px' }}>{formatCurrency(o.total)}</td>
                    <td style={{ padding: '12px 16px', textAlign: 'center' }}><span className="inline-flex items-center justify-center" style={{ background: pay.bg, color: pay.text, borderRadius: '6px', padding: '6px 12px', fontSize: '12px', fontWeight: 500 }}>{o.payment}</span></td>
                    <td style={{ padding: '12px 16px', textAlign: 'center' }}><span className="inline-flex items-center justify-center" style={{ background: st.bg, color: st.text, borderRadius: '6px', padding: '6px 12px', fontSize: '12px', fontWeight: 500 }}>{o.status}</span></td>
                    <td style={{ padding: '12px 16px', textAlign: 'center' }}><Link to={`/seller/orders/${o.id}`} className="inline-flex items-center justify-center text-ink-secondary hover:text-ink no-underline" style={{ width: '32px', height: '32px', borderRadius: '6px' }}><Eye className="w-4 h-4" /></Link></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-ink-faint" style={{ fontSize: '14px' }}>Showing 1-{sellerOrders.length} of {sellerOrders.length}</span>
          <div className="flex items-center" style={{ gap: '4px' }}>
            <button className="text-ink-faint cursor-not-allowed" style={{ border: '1px solid var(--color-line)', borderRadius: '8px', padding: '6px 12px', fontSize: '14px' }} disabled>Prev</button>
            <span className="bg-ink text-white" style={{ borderRadius: '8px', padding: '6px 12px', fontSize: '14px', fontWeight: 500 }}>1</span>
            <button className="text-ink-faint cursor-not-allowed" style={{ border: '1px solid var(--color-line)', borderRadius: '8px', padding: '6px 12px', fontSize: '14px' }} disabled>Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}