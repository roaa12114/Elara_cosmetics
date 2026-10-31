import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Trash2, Printer, Tag } from 'lucide-react';
import { SellerNavbar } from '../components/SellerNavbar';
import { discountDetail } from '../data/sellerStaticData';
import { formatCurrency } from '@shared/lib/utils';

const STATUS_STYLES: Record<string, { bg: string; text: string }> = {
  Active: { bg: 'var(--color-status-delivered-bg)', text: 'var(--color-success-text)' },
};

export function SellerDiscountDetailPage() {
  const { id } = useParams();
  const d = discountDetail;
  const st = STATUS_STYLES[d.status] ?? { bg: 'var(--color-status-out-of-stock-bg)', text: '#171315' };

  return (
    <div className="flex flex-col min-h-screen">
      <SellerNavbar />
      <div className="flex flex-col" style={{ padding: '32px', gap: '24px' }}>
        <nav className="flex items-center text-ink-faint" style={{ gap: '8px', fontSize: '14px' }}>
          <Link to="/seller" className="hover:text-ink no-underline">Dashboard</Link><span>/</span>
          <Link to="/seller/promotions" className="hover:text-ink no-underline">Promotions</Link><span>/</span>
          <Link to="/seller/discounts" className="hover:text-ink no-underline">Discounts</Link><span>/</span>
          <span className="text-ink font-medium">Discount Details</span>
        </nav>
        <div className="bg-white" style={{ border: '1px solid var(--color-line)', borderRadius: '8px', padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div className="flex items-center" style={{ gap: '12px' }}><Tag className="w-6 h-6 text-brand" /><h1 className="font-bold text-ink" style={{ fontSize: '24px' }}>{d.name}</h1></div>
            <div className="flex items-center" style={{ gap: '8px', marginTop: '12px' }}>
              <span className="inline-flex items-center justify-center" style={{ background: st.bg, color: st.text, borderRadius: '6px', padding: '6px 12px', fontSize: '12px', fontWeight: 500 }}>{d.status}</span>
              <span className="inline-flex items-center justify-center bg-ink text-white" style={{ borderRadius: '6px', padding: '6px 12px', fontSize: '12px', fontWeight: 500 }}>{d.valueLabel}</span>
              <span className="text-ink-faint" style={{ fontSize: '14px' }}>{d.startDate} – {d.endDate}</span>
            </div>
          </div>
          <div className="flex items-center" style={{ gap: '8px' }}>
            <button className="flex items-center text-ink-secondary" style={{ border: '1px solid var(--color-ink-secondary)', borderRadius: 'var(--radius-pill)', padding: '8px 16px', gap: '6px', fontSize: '14px', fontWeight: 500 }}><Printer className="w-4 h-4" /> Print Invoice</button>
            <button className="flex items-center text-danger-dark" style={{ border: '1px solid var(--color-danger-dark)', borderRadius: 'var(--radius-pill)', padding: '8px 16px', gap: '6px', fontSize: '14px', fontWeight: 500 }}><Trash2 className="w-4 h-4" /> Delete Discount</button>
          </div>
        </div>
        <div className="grid" style={{ gridTemplateColumns: '360px 1fr', gap: '24px' }}>
          <div className="bg-white" style={{ border: '1px solid var(--color-line)', borderRadius: '8px', padding: '24px' }}>
            <h3 className="font-bold text-ink" style={{ fontSize: '16px', marginBottom: '20px' }}>Discount Details</h3>
            <div className="flex flex-col" style={{ gap: '16px' }}>
              <DetailRow label="Discount Type" value={d.type} />
              <DetailRow label="Status" value={d.status} />
              <DetailRow label="Value" value={`${d.value}%`} />
              <DetailRow label="Apply To" value={d.category} />
              <DetailRow label="Start Date" value={d.startDate} />
              <DetailRow label="End Date" value={d.endDate} />
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
                  <td className="text-center" style={{ padding: '12px 16px' }}><span className="inline-flex items-center justify-center" style={{ background: 'var(--color-status-pending-bg)', color: 'var(--color-warning-text)', borderRadius: '6px', padding: '4px 8px', fontSize: '12px', fontWeight: 500 }}>{d.value}%</span></td>
                  <td className="text-right font-bold text-ink" style={{ padding: '12px 16px', fontSize: '14px' }}>{formatCurrency(p.discountedPrice)}</td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col" style={{ gap: '4px' }}>
      <span className="text-ink-faint" style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</span>
      <span className="text-ink" style={{ fontSize: '14px' }}>{value}</span>
    </div>
  );
}