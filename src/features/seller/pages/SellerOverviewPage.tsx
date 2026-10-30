import { Link } from 'react-router-dom';
import { TrendingUp, TrendingDown, Plus } from 'lucide-react';
import { SellerNavbar } from '../components/SellerNavbar';
import { SellerOverviewTabs } from '../components/SellerOverviewTabs';
import {
  sellerStats,
  revenueTrend,
  topProducts,
  recentOrders,
  activityFeed,
  lowStockAlerts,
} from '../data/sellerStaticData';
import { formatCurrency } from '@shared/lib/utils';

const STATUS_STYLES: Record<string, { bg: string; text: string }> = {
  Delivered: { bg: 'var(--color-status-delivered-bg)', text: 'var(--color-success-text)' },
  Shipped: { bg: 'var(--color-status-shipped-bg)', text: 'var(--color-danger-dark)' },
  Processing: { bg: 'var(--color-status-processing-bg)', text: 'var(--color-info-text)' },
  Pending: { bg: 'var(--color-status-pending-bg)', text: 'var(--color-warning-text)' },
  Cancelled: { bg: 'var(--color-status-shipped-bg)', text: 'var(--color-danger-dark)' },
};

const STOCK_STYLES: Record<string, { bg: string; text: string }> = {
  'In stock': { bg: 'var(--color-status-delivered-bg)', text: 'var(--color-success-text)' },
  'Low stock': { bg: 'var(--color-status-pending-bg)', text: 'var(--color-warning-text)' },
  'Out of stock': { bg: 'var(--color-status-out-of-stock-bg)', text: '#171315' },
};

export function SellerOverviewPage() {
  const maxRevenue = Math.max(...revenueTrend.map((d) => d.value));

  return (
    <div className="flex flex-col min-h-screen">
      <SellerNavbar />

      <div className="flex flex-col" style={{ padding: '32px', gap: '24px' }}>
        {/* Action buttons row */}
        <div className="flex items-center" style={{ gap: '8px' }}>
          <button className="flex items-center bg-ink text-white" style={{ height: '48px', borderRadius: 'var(--radius-pill)', padding: '8px 16px', gap: '8px', fontSize: '18px', fontWeight: 500 }}>
            <Plus className="w-5 h-5" />
            Add New Product
          </button>
          <button className="flex items-center text-ink-secondary" style={{ height: '48px', border: '1px solid var(--color-ink-secondary)', borderRadius: 'var(--radius-pill)', padding: '8px 16px', gap: '8px', fontSize: '18px', fontWeight: 500 }}>
            Manage Order
          </button>
          <button className="flex items-center text-ink-secondary" style={{ height: '48px', border: '1px solid var(--color-ink-secondary)', borderRadius: 'var(--radius-pill)', padding: '8px 16px', gap: '8px', fontSize: '18px', fontWeight: 500 }}>
            View Inventory
          </button>
        </div>

        {/* Tab nav */}
        <div className="bg-white" style={{ borderRadius: '0 0 8px 8px', padding: '0' }}>
          <SellerOverviewTabs />
        </div>

        {/* === 6 Stat cards (row 1) === */}
        <div className="grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
          <StatCard label="Total Revenue" value={formatCurrency(sellerStats.totalRevenue)} change="↑ 12.4%" changeText="vs last month" />
          <StatCard label="Total Orders" value={String(sellerStats.totalOrders)} change="↑ 8.1%" changeColor="var(--color-success-text)" changeText="this month" />
          <StatCard label="Active Products" value={String(sellerStats.activeProducts)} subtitle="of 8 listings" subtitleColor="var(--color-success-text)" />
          <StatCard label="Avg. Order Value" value={formatCurrency(sellerStats.avgOrderValue)} change="↑ 3.6%" changeColor="var(--color-success-text)" changeText="vs last month" />
        </div>

        {/* === 3 Stat cards (row 2) === */}
        <div className="grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
          <StatCard label="Pending Orders" value={String(sellerStats.pendingOrders)} subtitle="awaiting fulfilment" />
          <StatCard label="Low / Out of Stock" value={`${sellerStats.lowStock} / ${sellerStats.outOfStock}`} subtitle="products" />
          <StatCard label="Available Earnings" value={formatCurrency(sellerStats.availableEarnings)} subtitle="ready to withdraw" />
        </div>

        {/* === Revenue Trend chart (full width) === */}
        <RevenueTrendChart data={revenueTrend} maxRevenue={maxRevenue} />

        {/* === Top Selling Products + Recent Activity Feed === */}
        <div className="grid" style={{ gridTemplateColumns: '742px 1fr', gap: '24px' }}>
          {/* Top Selling Products table */}
          <div className="bg-white" style={{ border: '1px solid var(--color-card-border)', borderRadius: '16px', boxShadow: '0px 8px 16px -2px rgba(217, 138, 156, 0.07)', padding: '24px' }}>
            <div className="flex items-center justify-between" style={{ marginBottom: '20px' }}>
              <h3 className="font-bold text-product-name" style={{ fontSize: '16px', lineHeight: '22px' }}>Top Selling Products</h3>
              <button className="text-ink-secondary" style={{ border: '1px solid var(--color-ink-secondary)', borderRadius: 'var(--radius-pill)', padding: '8px 16px', fontSize: '18px', fontWeight: 500, height: '32px', display: 'flex', alignItems: 'center' }}>
                View All
              </button>
            </div>
            <table className="w-full" style={{ fontSize: '14px' }}>
              <thead>
                <tr style={{ background: '#FFF9F9', borderBottom: '1px solid var(--color-ink-faint)' }}>
                  <th className="text-center font-bold text-ink-secondary" style={{ padding: '12px', fontSize: '12px', textTransform: 'uppercase' }}>Rank</th>
                  <th className="text-center font-bold text-ink-secondary" style={{ padding: '12px', fontSize: '12px', textTransform: 'uppercase' }}>Image</th>
                  <th className="text-center font-bold text-ink-secondary" style={{ padding: '12px', fontSize: '12px', textTransform: 'uppercase' }}>Product Name</th>
                  <th className="text-center font-bold text-ink-secondary" style={{ padding: '12px', fontSize: '12px', textTransform: 'uppercase' }}>Category</th>
                  <th className="text-center font-bold text-ink-secondary" style={{ padding: '12px', fontSize: '12px', textTransform: 'uppercase' }}>Units Sold</th>
                  <th className="text-center font-bold text-ink-secondary" style={{ padding: '12px', fontSize: '12px', textTransform: 'uppercase' }}>Revenue</th>
                  <th className="text-center font-bold text-ink-secondary" style={{ padding: '12px', fontSize: '12px', textTransform: 'uppercase' }}>Trend</th>
                </tr>
              </thead>
              <tbody>
                {topProducts.slice(0, 5).map((p, i) => (
                  <tr key={p.name} style={{ borderBottom: '1px solid var(--color-ink-faint)' }}>
                    <td className="text-center text-product-name" style={{ padding: '12px', fontSize: '14px' }}>{i + 1}</td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>
                      <div className="rounded-card-sm bg-primary-light mx-auto" style={{ width: '40px', height: '40px' }} />
                    </td>
                    <td className="text-center text-product-name" style={{ padding: '12px', fontSize: '14px' }}>{p.name}</td>
                    <td className="text-center text-ink-faint" style={{ padding: '12px', fontSize: '14px' }}>Makeup</td>
                    <td className="text-center text-product-name" style={{ padding: '12px', fontSize: '14px' }}>{p.units.toLocaleString()}</td>
                    <td className="text-center text-product-name" style={{ padding: '12px', fontSize: '14px' }}>{formatCurrency(p.revenue)}</td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>
                      <span style={{ color: p.change > 0 ? 'var(--color-success-text)' : 'var(--color-danger-dark)', fontSize: '12px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        {p.change > 0 ? '↑' : '↓'} {Math.abs(p.change)}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Recent Activity Feed */}
          <div className="bg-white" style={{ border: '1px solid var(--color-card-border)', borderRadius: '16px', boxShadow: '0px 8px 16px -2px rgba(217, 138, 156, 0.07)', padding: '24px' }}>
            <div className="flex items-center justify-between" style={{ marginBottom: '20px' }}>
              <h3 className="font-bold text-product-name" style={{ fontSize: '14px', lineHeight: '20px' }}>Recent Activity Feed</h3>
              <button className="text-brand underline" style={{ fontSize: '14px', fontWeight: 500 }}>See all</button>
            </div>
            <div className="flex flex-col" style={{ gap: '16px' }}>
              {activityFeed.map((a, i) => (
                <div key={i} className="flex items-start" style={{ gap: '12px' }}>
                  <div className="rounded-full bg-brand shrink-0" style={{ width: '12px', height: '12px', marginTop: '4px' }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-product-name" style={{ fontSize: '14px', lineHeight: '20px' }}>{a.text}</p>
                    <p className="text-ink-faint" style={{ fontSize: '12px', lineHeight: '16px' }}>{a.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* === Recent Orders + Low Stock Alert === */}
        <div className="grid" style={{ gridTemplateColumns: '648px 1fr', gap: '24px' }}>
          {/* Recent Orders table */}
          <div className="bg-white" style={{ border: '1px solid var(--color-card-border)', borderRadius: '16px', boxShadow: '0px 8px 16px -2px rgba(217, 138, 156, 0.07)', padding: '24px' }}>
            <div className="flex items-center justify-between" style={{ marginBottom: '20px' }}>
              <h3 className="font-bold text-product-name" style={{ fontSize: '16px', lineHeight: '22px' }}>Recent Orders</h3>
              <Link to="/seller/orders" className="text-ink-secondary no-underline" style={{ border: '1px solid var(--color-ink-secondary)', borderRadius: 'var(--radius-pill)', padding: '8px 16px', fontSize: '18px', fontWeight: 500, height: '32px', display: 'flex', alignItems: 'center' }}>
                View All
              </Link>
            </div>
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: '1px solid var(--color-ink-faint)' }}>
                  <th className="text-center font-bold text-ink-secondary" style={{ padding: '12px', fontSize: '16px' }}>Order</th>
                  <th className="text-center font-bold text-ink-secondary" style={{ padding: '12px', fontSize: '16px' }}>Customer</th>
                  <th className="text-center font-bold text-ink-secondary" style={{ padding: '12px', fontSize: '16px' }}>Product</th>
                  <th className="text-center font-bold text-ink-secondary" style={{ padding: '12px', fontSize: '16px' }}>Amount</th>
                  <th className="text-center font-bold text-ink-secondary" style={{ padding: '12px', fontSize: '16px' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.slice(0, 5).map((o) => {
                  const st = STATUS_STYLES[o.status] ?? STATUS_STYLES.Pending;
                  return (
                    <tr key={o.id} style={{ borderBottom: '1px solid var(--color-ink-faint)' }}>
                      <td className="text-center text-ink" style={{ padding: '12px', fontSize: '14px' }}>{o.id}</td>
                      <td className="text-center text-ink-muted" style={{ padding: '12px', fontSize: '14px' }}>{o.customer}</td>
                      <td className="text-center text-ink-secondary" style={{ padding: '12px', fontSize: '14px' }}>{o.product}</td>
                      <td className="text-center font-bold text-ink-secondary" style={{ padding: '12px', fontSize: '14px' }}>{formatCurrency(o.amount)}</td>
                      <td style={{ padding: '12px', textAlign: 'center' }}>
                        <span className="inline-flex items-center justify-center" style={{ background: st.bg, color: st.text, borderRadius: '6px', padding: '12px', fontSize: '12px', fontWeight: 500, height: '32px' }}>
                          {o.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Low Stock Alert table */}
          <div className="bg-white" style={{ border: '1px solid var(--color-card-border)', borderRadius: '16px', boxShadow: '0px 8px 16px -2px rgba(217, 138, 156, 0.07)', padding: '24px' }}>
            <div className="flex items-center justify-between" style={{ marginBottom: '20px' }}>
              <h3 className="font-bold text-product-name" style={{ fontSize: '16px', lineHeight: '22px' }}>Low Stock Alert</h3>
              <Link to="/seller/inventory" className="text-ink-secondary no-underline" style={{ border: '1px solid var(--color-ink-secondary)', borderRadius: 'var(--radius-pill)', padding: '8px 16px', fontSize: '18px', fontWeight: 500, height: '32px', display: 'flex', alignItems: 'center' }}>
                View All
              </Link>
            </div>
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: '1px solid var(--color-ink-faint)' }}>
                  <th className="text-center font-bold text-ink-secondary" style={{ padding: '12px', fontSize: '16px' }}>Rank</th>
                  <th className="text-center font-bold text-ink-secondary" style={{ padding: '12px', fontSize: '16px' }}>Image</th>
                  <th className="text-center font-bold text-ink-secondary" style={{ padding: '12px', fontSize: '16px' }}>Product name</th>
                  <th className="text-center font-bold text-ink-secondary" style={{ padding: '12px', fontSize: '16px' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {lowStockAlerts.map((p, i) => {
                  const st = STOCK_STYLES[p.status] ?? STOCK_STYLES['In stock'];
                  return (
                    <tr key={p.sku} style={{ borderBottom: '1px solid var(--color-ink-faint)' }}>
                      <td className="text-center text-ink" style={{ padding: '12px', fontSize: '14px' }}>{i + 1}</td>
                      <td style={{ padding: '12px', textAlign: 'center' }}>
                        <div className="rounded-card-sm bg-primary-light mx-auto" style={{ width: '40px', height: '40px' }} />
                      </td>
                      <td className="text-center font-bold text-ink-secondary" style={{ padding: '12px', fontSize: '14px' }}>{p.name}</td>
                      <td style={{ padding: '12px', textAlign: 'center' }}>
                        <span className="inline-flex items-center justify-center" style={{ background: st.bg, color: st.text, borderRadius: '6px', padding: '12px', fontSize: '12px', fontWeight: 500, height: '32px' }}>
                          {p.status}
                        </span>
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

function StatCard({ label, value, change, changeColor, changeText, subtitle, subtitleColor }: {
  label: string; value: string; change?: string; changeColor?: string; changeText?: string; subtitle?: string; subtitleColor?: string;
}) {
  return (
    <div className="bg-white" style={{ borderRadius: '8px', padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <span className="text-ink-secondary" style={{ fontSize: '14px', lineHeight: '20px' }}>{label}</span>
        <span className="font-bold text-ink" style={{ fontSize: '20px', lineHeight: '24px' }}>{value}</span>
      </div>
      {(change || subtitle) && (
        <div className="flex items-center" style={{ gap: change ? '4px' : '8px' }}>
          {change && <span style={{ fontSize: '12px', lineHeight: '16px', color: changeColor ?? 'var(--color-ink-faint)' }}>{change}</span>}
          {(changeText || subtitle) && <span style={{ fontSize: '12px', lineHeight: '16px', color: subtitleColor ?? 'var(--color-ink-faint)' }}>{changeText ?? subtitle}</span>}
        </div>
      )}
    </div>
  );
}

function RevenueTrendChart({ data, maxRevenue }: { data: { day: string; value: number }[]; maxRevenue: number }) {
  const chartWidth = 1079;
  const chartHeight = 200;
  const padding = { left: 83, right: 0, top: 1, bottom: 30 };

  const points = data.map((d, i) => {
    const x = padding.left + (i / (data.length - 1)) * (chartWidth - padding.left - padding.right);
    const y = chartHeight - padding.bottom - (d.value / maxRevenue) * (chartHeight - padding.top - padding.bottom - 20);
    return { x, y, ...d };
  });

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const areaPath = `M ${points[0].x} ${chartHeight - padding.bottom} ${points.map((p) => `L ${p.x} ${p.y}`).join(' ')} L ${points[points.length - 1].x} ${chartHeight - padding.bottom} Z`;
  const yLabels = ['£0k', '£1k', '£2k', '£3k', '£4k'];

  return (
    <div className="bg-white" style={{ border: '1px solid var(--color-line)', borderRadius: '8px', padding: '24px' }}>
      <div className="flex items-center justify-between" style={{ marginBottom: '16px' }}>
        <h3 className="font-bold text-ink" style={{ fontSize: '16px', lineHeight: '22px' }}>Revenue Trend</h3>
        <div className="flex items-center" style={{ border: '1px solid var(--color-line-disabled)', borderRadius: '14px', height: '26px' }}>
          <button className="bg-ink text-white" style={{ borderRadius: '14px', padding: '4px 12px', fontSize: '12px', lineHeight: '16px' }}>revenue</button>
          <button className="text-ink-faint" style={{ padding: '4px 12px', fontSize: '12px', lineHeight: '16px' }}>orders</button>
        </div>
      </div>
      <svg width="100%" height={chartHeight + 20} viewBox={`0 0 ${chartWidth} ${chartHeight + 20}`} className="overflow-visible">
        {[0, 1, 2, 3, 4].map((i) => {
          const y = padding.top + (i / 4) * (chartHeight - padding.top - padding.bottom);
          return <line key={i} x1={padding.left} y1={y} x2={chartWidth} y2={y} stroke="var(--color-chart-grid)" strokeWidth="1" strokeDasharray="4 4" />;
        })}
        {yLabels.map((label, i) => {
          const y = padding.top + (i / 4) * (chartHeight - padding.top - padding.bottom);
          return <text key={label} x={padding.left - 8} y={y + 4} textAnchor="end" fill="var(--color-ink)" style={{ fontSize: '14px', fontFamily: 'Manrope' }}>{label}</text>;
        })}
        <defs>
          <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#C06478" stopOpacity="0.09" />
            <stop offset="95%" stopColor="#C06478" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={areaPath} fill="url(#revenueGradient)" />
        <path d={linePath} fill="none" stroke="var(--color-revenue-line)" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
        {points.map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r="4" fill="var(--color-ink)" />
            {i === 0 && (
              <g>
                <rect x={p.x + 8} y={p.y - 32} width="120" height="64" rx="8" fill="white" stroke="var(--color-line)" />
                <text x={p.x + 16} y={p.y - 12} fill="var(--color-ink)" style={{ fontSize: '14px', fontFamily: 'Manrope' }}>{p.day}</text>
                <text x={p.x + 16} y={p.y + 8} fill="var(--color-ink)" style={{ fontSize: '12px', fontFamily: 'Manrope' }}>Revenue : £{p.value.toLocaleString()}</text>
              </g>
            )}
            <text x={p.x} y={chartHeight - padding.bottom + 16} textAnchor="middle" fill="var(--color-ink)" style={{ fontSize: '14px', fontFamily: 'Manrope' }}>{p.day}</text>
          </g>
        ))}
      </svg>
    </div>
  );
}