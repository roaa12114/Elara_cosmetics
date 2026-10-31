import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, X, Eye, Trash2, Tag } from 'lucide-react';
import { SellerNavbar } from '../components/SellerNavbar';
import { discounts, discountStats } from '../data/sellerStaticData';

const STATUS_STYLES: Record<string, { bg: string; text: string }> = {
  Active: { bg: 'var(--color-status-delivered-bg)', text: 'var(--color-success-text)' },
  Scheduled: { bg: 'var(--color-status-processing-bg)', text: 'var(--color-info-text)' },
  Expired: { bg: 'var(--color-status-out-of-stock-bg)', text: '#171315' },
};

const STAT_CARDS = [
  { label: 'Total Discounts', value: discountStats.total, subtitle: 'all time' },
  { label: 'Active', value: discountStats.active, subtitle: 'running now' },
  { label: 'Scheduled', value: discountStats.scheduled, subtitle: 'upcoming' },
  { label: 'Expired', value: discountStats.expired, subtitle: 'past' },
];

export function SellerDiscountsPage() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="flex flex-col min-h-screen">
      <SellerNavbar />
      <div className="flex flex-col" style={{ padding: '32px', gap: '24px' }}>
        <div className="flex items-center justify-between">
          <h1 className="font-bold text-ink" style={{ fontSize: '20px' }}>Discounts</h1>
          <button onClick={() => setShowModal(true)} className="flex items-center bg-ink text-white" style={{ borderRadius: 'var(--radius-pill)', padding: '8px 16px', gap: '8px', fontSize: '18px', fontWeight: 500, height: '48px' }}><Plus className="w-5 h-5" /> Create Discount</button>
        </div>
        <div className="grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
          {STAT_CARDS.map((s) => (
            <div key={s.label} className="bg-white" style={{ borderRadius: '8px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <span className="text-ink-secondary" style={{ fontSize: '14px' }}>{s.label}</span>
              <span className="font-bold text-ink" style={{ fontSize: '24px' }}>{s.value}</span>
              <span className="text-ink-faint" style={{ fontSize: '12px' }}>{s.subtitle}</span>
            </div>
          ))}
        </div>
        <div className="bg-white overflow-hidden" style={{ border: '1px solid var(--color-line)', borderRadius: '8px' }}>
          <table className="w-full">
            <thead><tr style={{ borderBottom: '1px solid var(--color-line)', background: '#FFF9F9' }}>
              <th className="text-left font-bold text-ink-secondary" style={{ padding: '12px 16px', fontSize: '12px', textTransform: 'uppercase' }}>Name</th>
              <th className="text-left font-bold text-ink-secondary" style={{ padding: '12px 16px', fontSize: '12px', textTransform: 'uppercase' }}>Type</th>
              <th className="text-left font-bold text-ink-secondary" style={{ padding: '12px 16px', fontSize: '12px', textTransform: 'uppercase' }}>Value</th>
              <th className="text-left font-bold text-ink-secondary" style={{ padding: '12px 16px', fontSize: '12px', textTransform: 'uppercase' }}>Category</th>
              <th className="text-left font-bold text-ink-secondary" style={{ padding: '12px 16px', fontSize: '12px', textTransform: 'uppercase' }}>Start</th>
              <th className="text-left font-bold text-ink-secondary" style={{ padding: '12px 16px', fontSize: '12px', textTransform: 'uppercase' }}>End</th>
              <th className="text-center font-bold text-ink-secondary" style={{ padding: '12px 16px', fontSize: '12px', textTransform: 'uppercase' }}>Status</th>
              <th className="text-center font-bold text-ink-secondary" style={{ padding: '12px 16px', fontSize: '12px', textTransform: 'uppercase' }}>Actions</th>
            </tr></thead>
            <tbody>{discounts.map((d) => {
              const st = STATUS_STYLES[d.status] ?? STATUS_STYLES.Expired;
              return (
                <tr key={d.id} style={{ borderBottom: '1px solid var(--color-line)' }} className="hover:bg-surface transition-colors">
                  <td style={{ padding: '12px 16px' }}><Link to={`/seller/discounts/${d.id}`} className="flex items-center no-underline" style={{ gap: '8px' }}><Tag className="w-4 h-4 text-brand" /><span className="text-ink font-medium" style={{ fontSize: '14px' }}>{d.name}</span></Link></td>
                  <td className="text-ink-faint" style={{ padding: '12px 16px', fontSize: '14px' }}>{d.type}</td>
                  <td className="text-ink font-medium" style={{ padding: '12px 16px', fontSize: '14px' }}>{d.value}</td>
                  <td className="text-ink-faint" style={{ padding: '12px 16px', fontSize: '14px' }}>{d.category}</td>
                  <td className="text-ink-faint" style={{ padding: '12px 16px', fontSize: '14px' }}>{d.startDate}</td>
                  <td className="text-ink-faint" style={{ padding: '12px 16px', fontSize: '14px' }}>{d.endDate}</td>
                  <td style={{ padding: '12px 16px', textAlign: 'center' }}><span className="inline-flex items-center justify-center" style={{ background: st.bg, color: st.text, borderRadius: '6px', padding: '6px 12px', fontSize: '12px', fontWeight: 500 }}>{d.status}</span></td>
                  <td style={{ padding: '12px 16px', textAlign: 'center' }}><div className="flex items-center justify-center" style={{ gap: '8px' }}><Link to={`/seller/discounts/${d.id}`} className="text-ink-faint hover:text-ink no-underline"><Eye className="w-4 h-4" /></Link><button className="text-ink-faint hover:text-danger-dark"><Trash2 className="w-4 h-4" /></button></div></td>
                </tr>
              );
            })}</tbody>
          </table>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-ink-faint" style={{ fontSize: '14px' }}>Showing 1-{discounts.length} of {discountStats.total}</span>
          <div className="flex items-center" style={{ gap: '4px' }}>
            <button className="text-ink-faint cursor-not-allowed" style={{ border: '1px solid var(--color-line)', borderRadius: '8px', padding: '6px 12px', fontSize: '14px' }} disabled>Prev</button>
            <span className="bg-ink text-white" style={{ borderRadius: '8px', padding: '6px 12px', fontSize: '14px', fontWeight: 500 }}>1</span>
            <button className="text-ink-faint cursor-not-allowed" style={{ border: '1px solid var(--color-line)', borderRadius: '8px', padding: '6px 12px', fontSize: '14px' }} disabled>Next</button>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.4)' }} onClick={() => setShowModal(false)}>
          <div className="bg-white" style={{ borderRadius: '16px', padding: '32px', maxWidth: '520px', width: '90%', boxShadow: '0px 20px 40px rgba(0,0,0,0.15)' }} onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between" style={{ marginBottom: '24px' }}>
              <h2 className="font-bold text-ink" style={{ fontSize: '20px' }}>Create Discount</h2>
              <button onClick={() => setShowModal(false)} className="text-ink-faint hover:text-ink"><X className="w-5 h-5" /></button>
            </div>
            <div className="flex flex-col" style={{ gap: '20px' }}>
              <div><label className="text-ink-secondary" style={{ fontSize: '14px', marginBottom: '6px', display: 'block' }}>Discount Name</label><input type="text" placeholder="e.g. Summer Skincare Sale" className="w-full bg-white text-ink" style={{ border: '1px solid var(--color-line)', borderRadius: '8px', padding: '12px', fontSize: '14px', height: '40px' }} /></div>
              <div className="grid grid-cols-2" style={{ gap: '16px' }}>
                <div><label className="text-ink-secondary" style={{ fontSize: '14px', marginBottom: '6px', display: 'block' }}>Launch Date</label><input type="date" className="w-full bg-white text-ink" style={{ border: '1px solid var(--color-line)', borderRadius: '8px', padding: '12px', fontSize: '14px', height: '40px' }} /></div>
                <div><label className="text-ink-secondary" style={{ fontSize: '14px', marginBottom: '6px', display: 'block' }}>End Date</label><input type="date" className="w-full bg-white text-ink" style={{ border: '1px solid var(--color-line)', borderRadius: '8px', padding: '12px', fontSize: '14px', height: '40px' }} /></div>
              </div>
              <div><label className="text-ink-secondary" style={{ fontSize: '14px', marginBottom: '6px', display: 'block' }}>Discount Type</label><div className="flex items-center" style={{ gap: '8px' }}><label className="flex items-center text-ink" style={{ gap: '6px', fontSize: '14px' }}><input type="radio" name="dtype" defaultChecked /> Percentage</label><label className="flex items-center text-ink" style={{ gap: '6px', fontSize: '14px' }}><input type="radio" name="dtype" /> Fixed Amount</label></div></div>
              <div><label className="text-ink-secondary" style={{ fontSize: '14px', marginBottom: '6px', display: 'block' }}>Discount Value</label><input type="number" placeholder="20" className="w-full bg-white text-ink" style={{ border: '1px solid var(--color-line)', borderRadius: '8px', padding: '12px', fontSize: '14px', height: '40px' }} /></div>
              <div><label className="text-ink-secondary" style={{ fontSize: '14px', marginBottom: '6px', display: 'block' }}>Apply To</label><div className="flex flex-col" style={{ gap: '8px' }}><label className="flex items-center text-ink" style={{ gap: '8px', fontSize: '14px' }}><input type="radio" name="applyto" defaultChecked /> All Products</label><label className="flex items-center text-ink" style={{ gap: '8px', fontSize: '14px' }}><input type="radio" name="applyto" /> Specific Category</label><label className="flex items-center text-ink" style={{ gap: '8px', fontSize: '14px' }}><input type="radio" name="applyto" /> Specific Products</label></div></div>
              <div className="flex items-center justify-end" style={{ gap: '12px' }}><button onClick={() => setShowModal(false)} className="text-ink-secondary" style={{ fontSize: '16px', fontWeight: 500, padding: '8px 16px' }}>Cancel</button><button onClick={() => setShowModal(false)} className="bg-ink text-white" style={{ borderRadius: 'var(--radius-pill)', padding: '8px 24px', fontSize: '16px', fontWeight: 500, height: '48px' }}>Create Discount</button></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}