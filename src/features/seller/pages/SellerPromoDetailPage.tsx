import { Link, useParams } from 'react-router-dom';
import { Trash2, Printer, Ticket } from 'lucide-react';
import { SellerNavbar } from '../components/SellerNavbar';
import { promoCodeDetail } from '../data/sellerStaticData';
import { formatCurrency } from '@shared/lib/utils';

const STATUS_STYLES: Record<string, { bg: string; text: string }> = {
  Active: { bg: 'var(--color-status-delivered-bg)', text: 'var(--color-success-text)' },
};

export function SellerPromoDetailPage() {
  const d = promoCodeDetail;
  const st = STATUS_STYLES[d.status] ?? { bg: 'var(--color-status-out-of-stock-bg)', text: '#171315' };
  const maxUsage = Math.max(...d.usageOverTime.map((u) => u.value));

  return (
    <div className="flex flex-col min-h-screen">
      <SellerNavbar />
      <div className="flex flex-col" style={{ padding: '32px', gap: '24px' }}>
        <nav className="flex items-center text-ink-faint" style={{ gap: '8px', fontSize: '14px' }}>
          <Link to="/seller" className="hover:text-ink no-underline">Dashboard</Link><span>/</span>
          <Link to="/seller/promo-codes" className="hover:text-ink no-underline">Promo Codes</Link><span>/</span>
          <span className="text-ink font-medium">{d.code}</span>
        </nav>
        <div className="bg-white" style={{ border: '1px solid var(--color-line)', borderRadius: '8px', padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div className="flex items-center" style={{ gap: '12px' }}><Ticket className="w-6 h-6 text-brand" /><h1 className="font-bold text-ink font-mono" style={{ fontSize: '24px' }}>{d.code}</h1></div>
            <div className="flex items-center" style={{ gap: '8px', marginTop: '12px' }}>
              <span className="inline-flex items-center justify-center" style={{ background: st.bg, color: st.text, borderRadius: '6px', padding: '6px 12px', fontSize: '12px', fontWeight: 500 }}>{d.status}</span>
              <span className="inline-flex items-center justify-center bg-ink text-white" style={{ borderRadius: '6px', padding: '6px 12px', fontSize: '12px', fontWeight: 500 }}>{d.valueLabel}</span>
              <span className="text-ink-faint" style={{ fontSize: '14px' }}>{d.startDate} – {d.endDate}</span>
            </div>
          </div>
          <div className="flex items-center" style={{ gap: '8px' }}>
            <button className="flex items-center text-ink-secondary" style={{ border: '1px solid var(--color-ink-secondary)', borderRadius: 'var(--radius-pill)', padding: '8px 16px', gap: '6px', fontSize: '14px', fontWeight: 500 }}><Printer className="w-4 h-4" /> Print Invoice</button>
            <button className="flex items-center text-danger-dark" style={{ border: '1px solid var(--color-danger-dark)', borderRadius: 'var(--radius-pill)', padding: '8px 16px', gap: '6px', fontSize: '14px', fontWeight: 500 }}><Trash2 className="w-4 h-4" /> Delete Promo Code</button>
          </div>
        </div>
        <div className="grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
          {[
            { label: 'Total Uses', value: d.stats.totalUses, change: d.stats.usesChange },
            { label: 'Remaining', value: d.stats.remaining, change: d.stats.remainingChange },
            { label: 'Orders', value: d.stats.orders, change: d.stats.ordersChange },
            { label: 'Total Discount', value: formatCurrency(d.stats.totalDiscount), change: d.stats.discountChange },
          ].map((s) => (
            <div key={s.label} className="bg-white" style={{ borderRadius: '8px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <span className="text-ink-secondary" style={{ fontSize: '14px' }}>{s.label}</span>
              <div className="flex items-center" style={{ gap: '6px' }}><span className="font-bold text-ink" style={{ fontSize: '24px' }}>{s.value}</span><span className="text-success-text" style={{ fontSize: '12px' }}>↑ {s.change}%</span></div>
            </div>
          ))}
        </div>
        <div className="grid" style={{ gridTemplateColumns: '360px 1fr', gap: '24px' }}>
          <div className="bg-white" style={{ border: '1px solid var(--color-line)', borderRadius: '8px', padding: '24px' }}>
            <h3 className="font-bold text-ink" style={{ fontSize: '16px', marginBottom: '20px' }}>Promo Details</h3>
            <div className="flex flex-col" style={{ gap: '16px' }}>
              <DetailRow label="Discount" value={d.details.discount} />
              <DetailRow label="Min Order Amount" value={d.details.minOrder} />
              <DetailRow label="Max Discount" value={d.details.maxDiscount} />
              <DetailRow label="Usage Limit" value={String(d.details.usageLimit)} />
              <DetailRow label="Per Customer" value={`${d.details.perCustomer} use`} />
              <DetailRow label="Applies To" value={d.details.appliesTo} />
              <DetailRow label="Expires" value={d.details.expiresAt} />
            </div>
          </div>
          <div className="bg-white" style={{ border: '1px solid var(--color-line)', borderRadius: '8px', padding: '24px' }}>
            <div className="flex items-center justify-between" style={{ marginBottom: '16px' }}>
              <h3 className="font-bold text-ink" style={{ fontSize: '16px' }}>Usage Over Time</h3>
              <div className="flex items-center" style={{ gap: '6px' }}><button className="bg-ink text-white" style={{ borderRadius: '14px', padding: '4px 12px', fontSize: '12px' }}>Weekly</button><button className="text-ink-faint" style={{ padding: '4px 12px', fontSize: '12px' }}>Yearly</button></div>
            </div>
            <svg width="100%" height="220" viewBox="0 0 450 220" className="overflow-visible">
              {[0, 1, 2, 3].map((i) => { const y = 10 + (i / 3) * 185; return <line key={i} x1="50" y1={y} x2="440" y2={y} stroke="var(--color-chart-grid)" strokeWidth="1" strokeDasharray="4 4" />; })}
              <defs><linearGradient id="usageGradient" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#C06478" stopOpacity="0.12" /><stop offset="95%" stopColor="#C06478" stopOpacity="0" /></linearGradient></defs>
              {(() => { const points = d.usageOverTime.map((u, i) => ({ x: 50 + (i / (d.usageOverTime.length - 1)) * 390, y: 195 - (u.value / maxUsage) * 175, ...u })); const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' '); const areaPath = `M ${points[0].x} 195 ${points.map((p) => `L ${p.x} ${p.y}`).join(' ')} L ${points[points.length - 1].x} 195 Z`; return (<><path d={areaPath} fill="url(#usageGradient)" /><path d={linePath} fill="none" stroke="var(--color-revenue-line)" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />{points.map((p, i) => (<g key={i}><circle cx={p.x} cy={p.y} r="3" fill="var(--color-revenue-line)" /><text x={p.x} y={212} textAnchor="middle" fill="var(--color-ink-faint)" style={{ fontSize: '11px', fontFamily: 'Manrope' }}>{p.day}</text></g>))}</>); })()}
            </svg>
          </div>
        </div>
        <div className="bg-white overflow-hidden" style={{ border: '1px solid var(--color-line)', borderRadius: '8px' }}>
          <div style={{ padding: '24px', borderBottom: '1px solid var(--color-line)' }}><h3 className="font-bold text-ink" style={{ fontSize: '16px' }}>Discounted Products</h3></div>
          <table className="w-full">
            <thead><tr style={{ borderBottom: '1px solid var(--color-line)', background: '#FFF9F9' }}>
              <th className="text-left font-bold text-ink-secondary" style={{ padding: '12px 16px', fontSize: '12px', textTransform: 'uppercase' }}>Product</th>
              <th className="text-right font-bold text-ink-secondary" style={{ padding: '12px 16px', fontSize: '12px', textTransform: 'uppercase' }}>Original Price</th>
              <th className="text-center font-bold text-ink-secondary" style={{ padding: '12px 16px', fontSize: '12px', textTransform: 'uppercase' }}>Discount</th>
              <th className="text-right font-bold text-ink-secondary" style={{ padding: '12px 16px', fontSize: '12px', textTransform: 'uppercase' }}>Final Price</th>
            </tr></thead>
            <tbody>{d.products.map((p, i) => (
              <tr key={i} style={{ borderBottom: '1px solid var(--color-line)' }}>
                <td style={{ padding: '12px 16px' }}><div className="flex items-center" style={{ gap: '12px' }}><div className="rounded-card-sm bg-primary-light shrink-0" style={{ width: '40px', height: '40px' }} /><span className="text-ink font-medium" style={{ fontSize: '14px' }}>{p.name}</span></div></td>
                <td className="text-right text-ink-faint" style={{ padding: '12px 16px', fontSize: '14px', textDecoration: 'line-through' }}>{formatCurrency(p.originalPrice)}</td>
                <td className="text-center" style={{ padding: '12px 16px' }}><span className="inline-flex items-center justify-center" style={{ background: 'var(--color-status-pending-bg)', color: 'var(--color-warning-text)', borderRadius: '6px', padding: '4px 8px', fontSize: '12px', fontWeight: 500 }}>{d.details.discount}</span></td>
                <td className="text-right font-bold text-ink" style={{ padding: '12px 16px', fontSize: '14px' }}>{formatCurrency(p.discountedPrice)}</td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (<div className="flex flex-col" style={{ gap: '4px' }}><span className="text-ink-faint" style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</span><span className="text-ink" style={{ fontSize: '14px' }}>{value}</span></div>);
}