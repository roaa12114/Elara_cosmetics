import { SellerNavbar } from '../components/SellerNavbar';
import { SellerOverviewTabs } from '../components/SellerOverviewTabs';
import { sellerStats, revenueTrend, recentOrders, categoryRevenue } from '../data/sellerStaticData';
import { formatCurrency } from '@shared/lib/utils';

const STATUS_STYLES: Record<string, { bg: string; text: string }> = {
  Delivered: { bg: 'var(--color-status-delivered-bg)', text: 'var(--color-success-text)' },
  Shipped: { bg: 'var(--color-status-shipped-bg)', text: 'var(--color-danger-dark)' },
  Processing: { bg: 'var(--color-status-processing-bg)', text: 'var(--color-info-text)' },
  Pending: { bg: 'var(--color-status-pending-bg)', text: 'var(--color-warning-text)' },
  Cancelled: { bg: 'var(--color-status-shipped-bg)', text: 'var(--color-danger-dark)' },
};

const CATEGORY_COLORS = ['#CD778B', '#E3A1B0', '#D98A9C', '#98465C'];

export function SalesOverViewPage() {
  const maxRevenue = Math.max(...revenueTrend.map((d) => d.value));
  const totalCategoryRev = categoryRevenue.reduce((s, c) => s + c.revenue, 0);

  return (
    <div className="flex flex-col min-h-screen">
      <SellerNavbar />
      <div className="flex flex-col" style={{ padding: '32px', gap: '24px' }}>
        <div className="bg-white" style={{ borderRadius: '0 0 8px 8px' }}><SellerOverviewTabs /></div>

        {/* 6 Stat cards */}
        <div className="grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
          <StatCard label="Total Revenue" value={formatCurrency(sellerStats.totalRevenue)} change="↑ 12.4%" changeText="vs last month" />
          <StatCard label="Total Orders" value={String(sellerStats.totalOrders)} change="↑ 8.1%" changeColor="var(--color-success-text)" changeText="this month" />
          <StatCard label="Avg. Order Value" value={formatCurrency(sellerStats.avgOrderValue)} change="↑ 3.6%" changeColor="var(--color-success-text)" changeText="vs last month" />
          <StatCard label="Gross Revenue" value={formatCurrency(sellerStats.grossRevenue)} subtitle="before fees" />
          <StatCard label="Net Revenue" value={formatCurrency(sellerStats.netRevenue)} subtitle="after fees" />
          <StatCard label="Refund Rate" value={`${sellerStats.refundRate}%`} subtitle="of total orders" />
        </div>

        {/* Revenue Trend */}
        <div className="bg-white" style={{ border: '1px solid var(--color-line)', borderRadius: '8px', padding: '20px' }}>
          <h3 className="font-bold text-ink" style={{ fontSize: '16px', lineHeight: '22px', marginBottom: '16px' }}>Revenue Trend — November 2024</h3>
          <RevenueTrendChart data={revenueTrend} maxRevenue={maxRevenue} />
        </div>

        {/* Recent Orders + Revenue by Category */}
        <div className="grid" style={{ gridTemplateColumns: '456px 1fr', gap: '24px' }}>
          {/* Recent Orders with avatars */}
          <div className="bg-white" style={{ border: '1px solid var(--color-line)', borderRadius: '8px', padding: '24px' }}>
            <h3 className="font-bold text-ink" style={{ fontSize: '16px', lineHeight: '22px', marginBottom: '24px' }}>Recent Orders</h3>
            <div className="flex flex-col" style={{ gap: '24px' }}>
              {recentOrders.slice(0, 5).map((o) => {
                const st = STATUS_STYLES[o.status] ?? STATUS_STYLES.Pending;
                return (
                  <div key={o.id} className="flex items-center justify-between">
                    <div className="flex items-center" style={{ gap: '8px' }}>
                      <div className="rounded-full bg-primary-light shrink-0" style={{ width: '55px', height: '55px' }} />
                      <div className="flex flex-col" style={{ gap: '12px' }}>
                        <span className="text-ink" style={{ fontSize: '14px', lineHeight: '20px' }}>{o.customer}</span>
                        <span className="text-ink-faint" style={{ fontSize: '12px', lineHeight: '16px' }}>{o.product}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end" style={{ gap: '12px' }}>
                      <span className="font-bold text-ink" style={{ fontSize: '14px', lineHeight: '20px', textAlign: 'right' }}>{formatCurrency(o.amount)}</span>
                      <span className="inline-flex items-center justify-center" style={{ background: st.bg, color: st.text, borderRadius: '6px', padding: '12px', fontSize: '12px', fontWeight: 500, height: '32px', width: '93px' }}>{o.status}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Revenue by Category bars */}
          <div className="bg-white" style={{ border: '1px solid var(--color-line)', borderRadius: '8px', padding: '24px' }}>
            <h3 className="font-bold text-ink" style={{ fontSize: '16px', lineHeight: '22px', marginBottom: '16px' }}>Revenue by Category</h3>
            <div className="flex flex-col" style={{ gap: '14px' }}>
              {categoryRevenue.map((c, i) => (
                <div key={c.name} className="flex flex-col" style={{ gap: '6px' }}>
                  <div className="flex items-center justify-between" style={{ height: '20px' }}>
                    <span className="text-ink" style={{ fontSize: '14px', lineHeight: '20px' }}>{c.name}</span>
                    <span className="text-ink" style={{ fontSize: '14px', lineHeight: '20px' }}>{formatCurrency(c.revenue)}</span>
                  </div>
                  <div className="bg-white" style={{ borderRadius: '200px', height: '8px', border: '1px solid var(--color-line)' }}>
                    <div style={{ borderRadius: '200px', height: '100%', width: `${(c.revenue / totalCategoryRev) * 100}%`, background: CATEGORY_COLORS[i % CATEGORY_COLORS.length] }} />
                  </div>
                  <span className="text-ink" style={{ fontSize: '12px', lineHeight: '16px' }}>{c.percentage}% of total</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, change, changeColor, changeText, subtitle }: {
  label: string; value: string; change?: string; changeColor?: string; changeText?: string; subtitle?: string;
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
          {(changeText || subtitle) && <span style={{ fontSize: '12px', lineHeight: '16px', color: 'var(--color-ink-faint)' }}>{changeText ?? subtitle}</span>}
        </div>
      )}
    </div>
  );
}

function RevenueTrendChart({ data, maxRevenue }: { data: { day: string; value: number }[]; maxRevenue: number }) {
  const chartWidth = 1080, chartHeight = 220;
  const padding = { left: 83, right: 0, top: 1, bottom: 30 };
  const points = data.map((d, i) => ({ x: padding.left + (i / (data.length - 1)) * (chartWidth - padding.left - padding.right), y: chartHeight - padding.bottom - (d.value / maxRevenue) * (chartHeight - padding.top - padding.bottom - 20), ...d }));
  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const areaPath = `M ${points[0].x} ${chartHeight - padding.bottom} ${points.map((p) => `L ${p.x} ${p.y}`).join(' ')} L ${points[points.length - 1].x} ${chartHeight - padding.bottom} Z`;
  const yLabels = ['£0k', '£1k', '£2k', '£3k', '£4k'];
  return (
    <svg width="100%" height={chartHeight + 20} viewBox={`0 0 ${chartWidth} ${chartHeight + 20}`} className="overflow-visible">
      {[0, 1, 2, 3, 4].map((i) => { const y = padding.top + (i / 4) * (chartHeight - padding.top - padding.bottom); return <line key={i} x1={padding.left} y1={y} x2={chartWidth} y2={y} stroke="var(--color-chart-grid)" strokeWidth="1" strokeDasharray="4 4" />; })}
      {yLabels.map((label, i) => { const y = padding.top + (i / 4) * (chartHeight - padding.top - padding.bottom); return <text key={label} x={padding.left - 8} y={y + 4} textAnchor="end" fill="var(--color-ink)" style={{ fontSize: '14px', fontFamily: 'Manrope' }}>{label}</text>; })}
      <defs><linearGradient id="salesOverviewGradient" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#C06478" stopOpacity="0.12" /><stop offset="95%" stopColor="#C06478" stopOpacity="0" /></linearGradient></defs>
      <path d={areaPath} fill="url(#salesOverviewGradient)" />
      <path d={linePath} fill="none" stroke="var(--color-ink)" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
      {points.map((p, i) => (<g key={i}><circle cx={p.x} cy={p.y} r="4" fill="var(--color-ink)" /><text x={p.x} y={chartHeight - padding.bottom + 16} textAnchor="middle" fill="var(--color-ink)" style={{ fontSize: '14px', fontFamily: 'Manrope' }}>{p.day}</text></g>))}
    </svg>
  );
}