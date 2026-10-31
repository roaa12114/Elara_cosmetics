import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Pencil, Ban } from 'lucide-react';
import { AdminNavbar } from '../components/AdminNavbar';
import { useAdminUsers } from '@shared/hooks/useAdminUsers';
import { adminCustomerDetail } from '../data/adminStaticData';
import { formatCurrency, formatDate } from '@shared/lib/utils';

const STATUS_STYLES: Record<string, { bg: string; text: string }> = {
  Active: { bg: 'var(--color-status-delivered-bg)', text: 'var(--color-success-text)' },
  Blocked: { bg: 'var(--color-status-out-of-stock-bg)', text: '#171315' },
  Delivered: { bg: 'var(--color-status-delivered-bg)', text: 'var(--color-success-text)' },
  Cancelled: { bg: 'var(--color-status-shipped-bg)', text: 'var(--color-danger-dark)' },
  Processing: { bg: 'var(--color-status-processing-bg)', text: 'var(--color-info-text)' },
};

export function AdminCustomerDetailPage() {
  const { id } = useParams();
  const { data, isLoading } = useAdminUsers({ role: 'customer', limit: 100 });
  const user = data?.users?.find((u) => u._id === id);
  const d = adminCustomerDetail; // static stats + orders
  const st = STATUS_STYLES[user?.isActive ? 'Active' : 'Blocked'] ?? STATUS_STYLES.Active;

  if (isLoading) return (<div className="flex flex-col min-h-screen"><AdminNavbar /><div className="flex-1 flex items-center justify-center"><p className="text-ink-faint">Loading...</p></div></div>);
  if (!user) return (<div className="flex flex-col min-h-screen"><AdminNavbar /><div className="flex-1 flex items-center justify-center"><div className="text-center"><p className="text-ink" style={{ fontSize: '18px', fontWeight: 600 }}>Customer not found</p><Link to="/admin/customers" className="text-brand hover:underline">← Back to customers</Link></div></div></div>);

  return (
    <div className="flex flex-col min-h-screen">
      <AdminNavbar />
      <div className="flex flex-col" style={{ padding: '32px', gap: '24px' }}>
        <Link to="/admin/customers" className="flex items-center text-ink-secondary hover:text-ink no-underline" style={{ gap: '8px', fontSize: '16px' }}><ArrowLeft className="w-5 h-5" /> Back to Customers</Link>

        {/* Header */}
        <div className="bg-white" style={{ border: '1px solid var(--color-line)', borderRadius: '8px', padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div className="flex items-center" style={{ gap: '16px' }}>
            <div className="rounded-full bg-primary text-brand font-bold flex items-center justify-center" style={{ width: '64px', height: '64px', fontSize: '24px' }}>{user.name.split(' ').slice(0, 2).map((s) => s[0]?.toUpperCase()).join('')}</div>
            <div>
              <h1 className="font-bold text-ink" style={{ fontSize: '24px' }}>{user.name}</h1>
              <p className="text-ink-faint" style={{ fontSize: '14px' }}>{user.email}</p>
              <div className="flex items-center" style={{ gap: '8px', marginTop: '8px' }}>
                <span className="inline-flex items-center justify-center" style={{ background: st.bg, color: st.text, borderRadius: '6px', padding: '4px 12px', fontSize: '12px', fontWeight: 500 }}>{user.isActive ? 'Active' : 'Blocked'}</span>
                <span className="text-ink-faint" style={{ fontSize: '14px' }}>Registered {formatDate(user.createdAt)}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center" style={{ gap: '8px' }}>
            <Link to={`/admin/customers/${user._id}/edit`} className="flex items-center bg-ink text-white no-underline" style={{ borderRadius: 'var(--radius-pill)', padding: '8px 16px', gap: '6px', fontSize: '14px', fontWeight: 500 }}><Pencil className="w-4 h-4" /> Edit Profile</Link>
            <Link to={`/admin/customers/${user._id}/block`} className="flex items-center text-danger-dark no-underline" style={{ border: '1px solid var(--color-danger-dark)', borderRadius: 'var(--radius-pill)', padding: '8px 16px', gap: '6px', fontSize: '14px', fontWeight: 500 }}><Ban className="w-4 h-4" /> Block</Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
          {[
            { label: 'Total Orders', value: String(d.stats.totalOrders), change: `+${d.stats.totalOrdersChange}%` },
            { label: 'Total Spent', value: formatCurrency(d.stats.totalSpent), change: `+${d.stats.totalSpentChange}%` },
            { label: 'Avg Order', value: formatCurrency(d.stats.avgOrder), change: `+${d.stats.avgOrderChange}%` },
            { label: 'Last Order', value: d.stats.lastOrder, change: '' },
          ].map((s) => (
            <div key={s.label} className="bg-white" style={{ borderRadius: '8px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <span className="text-ink-secondary" style={{ fontSize: '14px' }}>{s.label}</span>
              <span className="font-bold text-ink" style={{ fontSize: '20px' }}>{s.value}</span>
              {s.change && <span className="text-success-text" style={{ fontSize: '12px' }}>↑ {s.change}</span>}
            </div>
          ))}
        </div>

        {/* Address + Preferences */}
        <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          <div className="bg-white" style={{ border: '1px solid var(--color-line)', borderRadius: '8px', padding: '24px' }}>
            <h3 className="font-bold text-ink" style={{ fontSize: '16px', marginBottom: '16px' }}>Address</h3>
            <div className="flex flex-col" style={{ gap: '4px' }}>
              <span className="text-ink" style={{ fontSize: '14px' }}>{user.address?.street || '—'}</span>
              <span className="text-ink-secondary" style={{ fontSize: '14px' }}>{[user.address?.city, user.address?.state, user.address?.postalCode].filter(Boolean).join(', ') || '—'}</span>
              <span className="text-ink-secondary" style={{ fontSize: '14px' }}>{user.address?.country || '—'}</span>
            </div>
          </div>
          <div className="bg-white" style={{ border: '1px solid var(--color-line)', borderRadius: '8px', padding: '24px' }}>
            <h3 className="font-bold text-ink" style={{ fontSize: '16px', marginBottom: '16px' }}>Preferences</h3>
            <div className="flex flex-wrap" style={{ gap: '8px' }}>
              {d.preferences.map((p) => <span key={p} className="inline-flex items-center bg-primary-light text-brand rounded-pill" style={{ padding: '6px 12px', fontSize: '12px', fontWeight: 500 }}>{p}</span>)}
            </div>
          </div>
        </div>

        {/* Recent orders */}
        <div className="bg-white overflow-hidden" style={{ border: '1px solid var(--color-line)', borderRadius: '8px' }}>
          <div className="flex items-center justify-between" style={{ padding: '24px', borderBottom: '1px solid var(--color-line)' }}>
            <h3 className="font-bold text-ink" style={{ fontSize: '16px' }}>Recent Orders</h3>
            <Link to={`/admin/customers/${user._id}/orders`} className="text-brand no-underline" style={{ fontSize: '14px' }}>View all</Link>
          </div>
          <table className="w-full">
            <thead><tr style={{ borderBottom: '1px solid var(--color-line)', background: '#FFF9F9' }}>
              <th className="text-left font-bold text-ink-secondary" style={{ padding: '12px 16px', fontSize: '12px', textTransform: 'uppercase' }}>Order ID</th>
              <th className="text-left font-bold text-ink-secondary" style={{ padding: '12px 16px', fontSize: '12px', textTransform: 'uppercase' }}>Date</th>
              <th className="text-center font-bold text-ink-secondary" style={{ padding: '12px 16px', fontSize: '12px', textTransform: 'uppercase' }}>Items</th>
              <th className="text-right font-bold text-ink-secondary" style={{ padding: '12px 16px', fontSize: '12px', textTransform: 'uppercase' }}>Amount</th>
              <th className="text-left font-bold text-ink-secondary" style={{ padding: '12px 16px', fontSize: '12px', textTransform: 'uppercase' }}>Payment</th>
              <th className="text-center font-bold text-ink-secondary" style={{ padding: '12px 16px', fontSize: '12px', textTransform: 'uppercase' }}>Status</th>
            </tr></thead>
            <tbody>{d.orders.map((o) => { const ost = STATUS_STYLES[o.status] ?? STATUS_STYLES.Processing; return (
              <tr key={o.id} style={{ borderBottom: '1px solid var(--color-line)' }}>
                <td className="font-medium text-ink" style={{ padding: '12px 16px', fontSize: '14px' }}>{o.id}</td>
                <td className="text-ink-faint" style={{ padding: '12px 16px', fontSize: '14px' }}>{o.date}</td>
                <td className="text-center text-ink" style={{ padding: '12px 16px', fontSize: '14px' }}>{o.items}</td>
                <td className="text-right font-bold text-ink" style={{ padding: '12px 16px', fontSize: '14px' }}>{formatCurrency(o.amount)}</td>
                <td className="text-ink-secondary" style={{ padding: '12px 16px', fontSize: '14px' }}>{o.payment}</td>
                <td style={{ padding: '12px 16px', textAlign: 'center' }}><span className="inline-flex items-center justify-center" style={{ background: ost.bg, color: ost.text, borderRadius: '6px', padding: '6px 12px', fontSize: '12px', fontWeight: 500 }}>{o.status}</span></td>
              </tr>
            );})}</tbody>
          </table>
        </div>
      </div>
    </div>
  );
}