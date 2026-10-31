import { Link } from 'react-router-dom';
import { AdminNavbar } from '../components/AdminNavbar';
import {
  adminStats,
  adminRevenueTrend,
  adminRecentCustomers,
  adminRecentOrders,
  adminTopProducts,
  adminLowStock,
  adminRecentSellers,
  adminPendingItems,
} from '../data/adminStaticData';
import { useAdminUsers } from '@shared/hooks/useAdminUsers';
import { formatCurrency, formatDate } from '@shared/lib/utils';
import type { AdminUser } from '@shared/hooks/useAdminUsers';

type StatusKey = 'Active' | 'Pending' | 'Blocked' | 'Delivered' | 'Cancelled' | 'Processing' | 'Approved';

const STATUS_STYLES: Record<StatusKey, { bg: string; text: string }> = {
  Active: { bg: 'var(--color-status-delivered-bg)', text: 'var(--color-success-text)' },
  Pending: { bg: 'var(--color-status-pending-bg)', text: 'var(--color-warning-text)' },
  Blocked: { bg: 'var(--color-status-out-of-stock-bg)', text: '#171315' },
  Delivered: { bg: 'var(--color-status-delivered-bg)', text: 'var(--color-success-text)' },
  Cancelled: { bg: 'var(--color-status-shipped-bg)', text: 'var(--color-danger-dark)' },
  Processing: { bg: 'var(--color-status-processing-bg)', text: 'var(--color-info-text)' },
  Approved: { bg: 'var(--color-status-delivered-bg)', text: 'var(--color-success-text)' },
};

function statusKeyFor(u: AdminUser): StatusKey {
  return u.isActive ? 'Active' : 'Blocked';
}

function StatCard({ label, value, change }: { label: string; value: string; change: string }) {
  return (
    <div className="bg-white" style={{ borderRadius: '8px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <span className="text-ink-secondary" style={{ fontSize: '14px' }}>{label}</span>
      <span className="font-bold text-ink" style={{ fontSize: '24px' }}>{value}</span>
      <span className="text-success-text" style={{ fontSize: '12px' }}>+ {change}</span>
    </div>
  );
}

export function AdminDashboardPage() {
  const { data: usersData } = useAdminUsers({ role: 'customer', limit: 5 });
  const maxRevenue = Math.max(...adminRevenueTrend.map((d) => d.value));
  const liveUsers: AdminUser[] = usersData?.users ?? [];

  return (
    <div className="flex flex-col min-h-screen">
      <AdminNavbar />
      <div className="flex flex-col" style={{ padding: '32px', gap: '24px' }}>
        <h1 className="font-bold text-ink" style={{ fontSize: '20px' }}>Dashboard</h1>

        {/* 4 stat cards */}
        <div className="grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
          <StatCard label="Total Revenue" value={formatCurrency(adminStats.totalRevenue)} change={`+${adminStats.revenueChange}%`} />
          <StatCard label="Orders" value={String(adminStats.totalOrders)} change={`+${adminStats.ordersChange}%`} />
          <StatCard label="Customers" value={adminStats.totalCustomers.toLocaleString()} change={`+${adminStats.customersChange}%`} />
          <StatCard label="Sellers" value={String(adminStats.totalSellers)} change={`+${adminStats.sellersChange}%`} />
        </div>

        {/* Revenue chart + Pending items */}
        <div className="grid" style={{ gridTemplateColumns: '1fr 360px', gap: '24px' }}>
          <div className="bg-white" style={{ border: '1px solid var(--color-line)', borderRadius: '8px', padding: '24px' }}>
            <h3 className="font-bold text-ink" style={{ fontSize: '16px', marginBottom: '16px' }}>Revenue Trend — November 2024</h3>
            <svg width="100%" height="220" viewBox="0 0 600 220" className="overflow-visible">
              {[0, 1, 2, 3].map((i) => {
                const y = 10 + (i / 3) * 175;
                return <line key={i} x1="50" y1={y} x2="590" y2={y} stroke="var(--color-chart-grid)" strokeWidth="1" strokeDasharray="4 4" />;
              })}
              <defs>
                <linearGradient id="adminRevGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#C06478" stopOpacity="0.12" />
                  <stop offset="95%" stopColor="#C06478" stopOpacity="0" />
                </linearGradient>
              </defs>
              {(() => {
                const pts = adminRevenueTrend.map((d, i) => ({
                  x: 50 + (i / (adminRevenueTrend.length - 1)) * 540,
                  y: 195 - (d.value / maxRevenue) * 175,
                  day: d.day,
                }));
                const linePath = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
                const areaPath = `M ${pts[0].x} 195 ${pts.map((p) => `L ${p.x} ${p.y}`).join(' ')} L ${pts[pts.length - 1].x} 195 Z`;
                return (
                  <>
                    <path d={areaPath} fill="url(#adminRevGrad)" />
                    <path d={linePath} fill="none" stroke="var(--color-revenue-line)" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
                    {pts.map((p, i) => (
                      <g key={i}>
                        <circle cx={p.x} cy={p.y} r="3" fill="var(--color-revenue-line)" />
                        <text x={p.x} y={212} textAnchor="middle" fill="var(--color-ink-faint)" style={{ fontSize: '11px', fontFamily: 'Manrope' }}>{p.day}</text>
                      </g>
                    ))}
                  </>
                );
              })()}
            </svg>
          </div>

          <div className="bg-white" style={{ border: '1px solid var(--color-line)', borderRadius: '8px', padding: '24px' }}>
            <h3 className="font-bold text-ink" style={{ fontSize: '16px', marginBottom: '16px' }}>Pending Items</h3>
            <div className="flex flex-col" style={{ gap: '16px' }}>
              {adminPendingItems.map((p, i) => (
                <div key={i} className="flex items-start" style={{ gap: '12px' }}>
                  <div className="rounded-full bg-brand shrink-0" style={{ width: '8px', height: '8px', marginTop: '6px' }} />
                  <div className="flex-1">
                    <p className="text-ink" style={{ fontSize: '14px' }}>{p.text}</p>
                    <span className="text-ink-faint" style={{ fontSize: '12px' }}>{p.type}</span>
                  </div>
                  <button className="bg-ink text-white" style={{ borderRadius: 'var(--radius-pill)', padding: '4px 12px', fontSize: '12px', fontWeight: 500 }}>{p.action}</button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent customers + Recent orders */}
        <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          <div className="bg-white overflow-hidden" style={{ border: '1px solid var(--color-line)', borderRadius: '8px' }}>
            <div className="flex items-center justify-between" style={{ padding: '24px', borderBottom: '1px solid var(--color-line)' }}>
              <h3 className="font-bold text-ink" style={{ fontSize: '16px' }}>Recent Customers</h3>
              <Link to="/admin/customers" className="text-brand no-underline" style={{ fontSize: '14px' }}>View all</Link>
            </div>
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: '1px solid var(--color-line)', background: '#FFF9F9' }}>
                  <th className="text-left font-bold text-ink-secondary" style={{ padding: '12px 16px', fontSize: '12px', textTransform: 'uppercase' }}>Name</th>
                  <th className="text-left font-bold text-ink-secondary" style={{ padding: '12px 16px', fontSize: '12px', textTransform: 'uppercase' }}>Date</th>
                  <th className="text-center font-bold text-ink-secondary" style={{ padding: '12px 16px', fontSize: '12px', textTransform: 'uppercase' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {(liveUsers.length > 0 ? liveUsers : adminRecentCustomers).slice(0, 5).map((c) => {
                  const isLive = '_id' in c;
                  const status = isLive ? statusKeyFor(c as AdminUser) : (c as typeof adminRecentCustomers[number]).status as StatusKey;
                  const st = STATUS_STYLES[status] ?? STATUS_STYLES.Active;
                  const name = c.name;
                  const email = c.email;
                  const date = isLive ? formatDate((c as AdminUser).createdAt) : (c as typeof adminRecentCustomers[number]).date;
                  const key = isLive ? (c as AdminUser)._id : email;
                  return (
                    <tr key={key} style={{ borderBottom: '1px solid var(--color-line)' }}>
                      <td style={{ padding: '12px 16px' }}>
                        <div className="text-ink font-medium" style={{ fontSize: '14px' }}>{name}</div>
                        <div className="text-ink-faint" style={{ fontSize: '12px' }}>{email}</div>
                      </td>
                      <td className="text-ink-faint" style={{ padding: '12px 16px', fontSize: '14px' }}>{date}</td>
                      <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                        <span className="inline-flex items-center justify-center" style={{ background: st.bg, color: st.text, borderRadius: '6px', padding: '4px 10px', fontSize: '12px', fontWeight: 500 }}>{status}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="bg-white overflow-hidden" style={{ border: '1px solid var(--color-line)', borderRadius: '8px' }}>
            <div className="flex items-center justify-between" style={{ padding: '24px', borderBottom: '1px solid var(--color-line)' }}>
              <h3 className="font-bold text-ink" style={{ fontSize: '16px' }}>Recent Orders</h3>
            </div>
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: '1px solid var(--color-line)', background: '#FFF9F9' }}>
                  <th className="text-left font-bold text-ink-secondary" style={{ padding: '12px 16px', fontSize: '12px', textTransform: 'uppercase' }}>Order</th>
                  <th className="text-left font-bold text-ink-secondary" style={{ padding: '12px 16px', fontSize: '12px', textTransform: 'uppercase' }}>Customer</th>
                  <th className="text-right font-bold text-ink-secondary" style={{ padding: '12px 16px', fontSize: '12px', textTransform: 'uppercase' }}>Amount</th>
                  <th className="text-center font-bold text-ink-secondary" style={{ padding: '12px 16px', fontSize: '12px', textTransform: 'uppercase' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {adminRecentOrders.map((o) => {
                  const st = STATUS_STYLES[o.status as StatusKey] ?? STATUS_STYLES.Processing;
                  return (
                    <tr key={o.id} style={{ borderBottom: '1px solid var(--color-line)' }}>
                      <td className="font-medium text-ink" style={{ padding: '12px 16px', fontSize: '14px' }}>{o.id}</td>
                      <td className="text-ink-muted" style={{ padding: '12px 16px', fontSize: '14px' }}>{o.customer}</td>
                      <td className="text-right font-bold text-ink" style={{ padding: '12px 16px', fontSize: '14px' }}>{formatCurrency(o.amount)}</td>
                      <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                        <span className="inline-flex items-center justify-center" style={{ background: st.bg, color: st.text, borderRadius: '6px', padding: '4px 10px', fontSize: '12px', fontWeight: 500 }}>{o.status}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top products + Low stock + Recent sellers */}
        <div className="grid" style={{ gridTemplateColumns: '1fr 1fr 1fr', gap: '24px' }}>
          <div className="bg-white overflow-hidden" style={{ border: '1px solid var(--color-line)', borderRadius: '8px' }}>
            <div style={{ padding: '24px', borderBottom: '1px solid var(--color-line)' }}>
              <h3 className="font-bold text-ink" style={{ fontSize: '16px' }}>Top Products</h3>
            </div>
            <div className="flex flex-col" style={{ padding: '16px', gap: '12px' }}>
              {adminTopProducts.map((p) => (
                <div key={p.name} className="flex items-center justify-between">
                  <div>
                    <div className="text-ink font-medium" style={{ fontSize: '14px' }}>{p.name}</div>
                    <div className="text-ink-faint" style={{ fontSize: '12px' }}>{p.units} units</div>
                  </div>
                  <div className="flex items-center" style={{ gap: '8px' }}>
                    <span className="text-ink font-bold" style={{ fontSize: '14px' }}>{formatCurrency(p.revenue)}</span>
                    <span className="text-success-text" style={{ fontSize: '12px' }}>+{p.change}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white overflow-hidden" style={{ border: '1px solid var(--color-line)', borderRadius: '8px' }}>
            <div style={{ padding: '24px', borderBottom: '1px solid var(--color-line)' }}>
              <h3 className="font-bold text-ink" style={{ fontSize: '16px' }}>Low Stock Alerts</h3>
            </div>
            <div className="flex flex-col" style={{ padding: '16px', gap: '12px' }}>
              {adminLowStock.map((p) => (
                <div key={p.name} className="flex items-center justify-between">
                  <span className="text-ink" style={{ fontSize: '14px' }}>{p.name}</span>
                  <span style={{ fontSize: '14px', color: p.stock === 0 ? 'var(--color-danger-dark)' : 'var(--color-warning-text)' }}>{p.stock} left</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white overflow-hidden" style={{ border: '1px solid var(--color-line)', borderRadius: '8px' }}>
            <div style={{ padding: '24px', borderBottom: '1px solid var(--color-line)' }}>
              <h3 className="font-bold text-ink" style={{ fontSize: '16px' }}>Recent Sellers</h3>
            </div>
            <table className="w-full">
              <tbody>
                {adminRecentSellers.map((s) => {
                  const st = STATUS_STYLES[s.status as StatusKey] ?? STATUS_STYLES.Approved;
                  return (
                    <tr key={s.email} style={{ borderBottom: '1px solid var(--color-line)' }}>
                      <td style={{ padding: '12px 16px' }}>
                        <div className="text-ink font-medium" style={{ fontSize: '14px' }}>{s.name}</div>
                        <div className="text-ink-faint" style={{ fontSize: '12px' }}>{s.date}</div>
                      </td>
                      <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                        <span className="inline-flex items-center justify-center" style={{ background: st.bg, color: st.text, borderRadius: '6px', padding: '4px 10px', fontSize: '12px', fontWeight: 500 }}>{s.status}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}