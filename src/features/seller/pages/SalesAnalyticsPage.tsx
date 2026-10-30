import { SellerNavbar } from '../components/SellerNavbar';
import { SellerOverviewTabs } from '../components/SellerOverviewTabs';
import { sellerStats, yearlyRevenue, topProducts, categoryRevenue } from '../data/sellerStaticData';
import { formatCurrency } from '@shared/lib/utils';

export function SalesAnalyticsPage() {
  const maxYearly = Math.max(...yearlyRevenue.map((d) => d.value));
  const totalPct = categoryRevenue.reduce((s, c) => s + c.percentage, 0);
  const colors = ['#CD778B', '#D98A9C', '#E3A1B0', '#333333'];

  let cumulativeAngle = 0;
  const donutPaths = categoryRevenue.map((seg, i) => {
    const angle = (seg.percentage / totalPct) * 360;
    const startAngle = cumulativeAngle;
    const endAngle = cumulativeAngle + angle;
    cumulativeAngle = endAngle;
    const startRad = (startAngle - 90) * (Math.PI / 180);
    const endRad = (endAngle - 90) * (Math.PI / 180);
    const r = 55, cx = 65, cy = 65;
    const x1 = cx + r * Math.cos(startRad);
    const y1 = cy + r * Math.sin(startRad);
    const x2 = cx + r * Math.cos(endRad);
    const y2 = cy + r * Math.sin(endRad);
    const largeArc = angle > 180 ? 1 : 0;
    return { path: `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`, color: colors[i % colors.length], label: seg.name, percentage: seg.percentage };
  });

  return (
    <div className="flex flex-col min-h-screen">
      <SellerNavbar />
      <div className="flex flex-col" style={{ padding: '32px', gap: '24px' }}>
        <div className="bg-white" style={{ borderRadius: '0 0 8px 8px' }}><SellerOverviewTabs /></div>

        {/* Time period + filters */}
        <div className="flex items-center justify-between">
          <div className="flex items-center bg-white" style={{ borderRadius: 'var(--radius-pill)', padding: '12px', gap: '18px' }}>
            <button className="bg-ink-secondary text-white" style={{ borderRadius: '250px', padding: '8px', fontSize: '18px', fontWeight: 700, width: '126px', height: '48px' }}>Daily</button>
            <button className="text-ink-secondary" style={{ fontSize: '18px', fontWeight: 500 }}>Weekly</button>
            <button className="text-ink-secondary" style={{ fontSize: '18px', fontWeight: 500 }}>Monthly</button>
            <button className="text-ink-secondary" style={{ fontSize: '18px', fontWeight: 500 }}>Yearly</button>
          </div>
          <div className="flex items-center" style={{ gap: '8px' }}>
            <div className="flex items-center bg-white" style={{ border: '1px solid var(--color-line)', borderRadius: '220px', padding: '12px 20px', gap: '12px', height: '48px' }}>
              <span className="text-ink-faint" style={{ fontSize: '16px' }}>Select date range</span>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M7 10l5 5 5-5" stroke="var(--color-ink-faint)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <div className="flex items-center bg-white" style={{ border: '1px solid var(--color-line)', borderRadius: '220px', padding: '12px 20px', gap: '12px', height: '48px' }}>
              <span className="text-ink-faint" style={{ fontSize: '16px' }}>All Categories</span>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M7 10l5 5 5-5" stroke="var(--color-ink-faint)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
          </div>
        </div>

        {/* 4 KPI cards */}
        <div className="grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
          <KpiCard label="Total Revenue" value={formatCurrency(sellerStats.totalRevenue)} change="↑ 12.4%" changeText="vs prior period" />
          <KpiCard label="Total Orders" value={String(sellerStats.totalOrders)} change="↑ 8.1%" changeColor="var(--color-success-text)" changeText="this month" />
          <KpiCard label="Avg. Order Value" value={formatCurrency(sellerStats.avgOrderValue)} change="↑ 3.6%" changeColor="var(--color-success-text)" changeText="vs last month" />
          <KpiCard label="Active Products" value={String(sellerStats.activeProducts)} subtitle="of 8 listings" subtitleColor="var(--color-success-text)" />
        </div>

        {/* Revenue Over Time */}
        <div className="bg-white" style={{ border: '1px solid var(--color-line)', borderRadius: '8px', padding: '24px' }}>
          <h3 className="font-bold text-ink" style={{ fontSize: '16px', lineHeight: '22px', marginBottom: '16px' }}>Revenue Over Time</h3>
          <RevenueOverTimeChart data={yearlyRevenue} maxValue={maxYearly} />
        </div>

        {/* Products + Donut */}
        <div className="grid" style={{ gridTemplateColumns: '648px 1fr', gap: '24px' }}>
          <div className="bg-white" style={{ border: '1px solid var(--color-line)', borderRadius: '8px', padding: '24px' }}>
            <h3 className="font-bold text-ink" style={{ fontSize: '16px', lineHeight: '22px', marginBottom: '16px' }}>Best Performing Products</h3>
            <div className="flex flex-col" style={{ gap: '12px' }}>
              {topProducts.slice(0, 6).map((p, i) => {
                const maxRev = Math.max(...topProducts.map((tp) => tp.revenue));
                const barWidth = (p.revenue / maxRev) * 100;
                return (
                  <div key={p.name} className="flex flex-col" style={{ gap: '4px' }}>
                    <div className="flex items-center justify-between" style={{ height: '20px' }}>
                      <div className="flex items-center" style={{ gap: '8px' }}>
                        <span className="text-ink" style={{ fontSize: '14px' }}>{i + 1}.</span>
                        <span className="text-ink" style={{ fontSize: '14px' }}>{p.name}</span>
                      </div>
                      <span className="text-ink" style={{ fontSize: '12px' }}>{formatCurrency(p.revenue)}</span>
                    </div>
                    <div className="bg-white" style={{ borderRadius: '200px', height: '6px', border: '1px solid var(--color-line)' }}>
                      <div className="bg-ink" style={{ borderRadius: '200px', height: '100%', width: `${barWidth}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="bg-white" style={{ border: '1px solid var(--color-line)', borderRadius: '8px', padding: '24px' }}>
            <h3 className="font-bold text-ink" style={{ fontSize: '16px', lineHeight: '22px', marginBottom: '24px' }}>Sales by Category</h3>
            <div className="flex items-center" style={{ gap: '45px' }}>
              <svg width="130" height="130" viewBox="0 0 130 130" className="shrink-0">
                {donutPaths.map((seg) => (<path key={seg.label} d={seg.path} fill={seg.color} stroke="white" strokeWidth="2" />))}
              </svg>
              <div className="flex flex-col" style={{ gap: '6px' }}>
                {donutPaths.map((seg) => (
                  <div key={seg.label} className="flex items-center justify-between" style={{ width: '130px' }}>
                    <div className="flex items-center" style={{ gap: '8px' }}>
                      <span className="rounded-full" style={{ width: '10px', height: '10px', backgroundColor: seg.color }} />
                      <span className="text-ink" style={{ fontSize: '12px' }}>{seg.label}</span>
                    </div>
                    <span className="font-bold text-ink" style={{ fontSize: '14px' }}>{seg.percentage}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function KpiCard({ label, value, change, changeColor, changeText, subtitle, subtitleColor }: {
  label: string; value: string; change?: string; changeColor?: string; changeText?: string; subtitle?: string; subtitleColor?: string;
}) {
  return (
    <div className="bg-white" style={{ borderRadius: '8px', padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <span className="text-ink-secondary" style={{ fontSize: '14px', lineHeight: '20px' }}>{label}</span>
      <span className="font-bold text-ink" style={{ fontSize: '20px', lineHeight: '24px' }}>{value}</span>
      {(change || subtitle) && (
        <div className="flex items-center" style={{ gap: change ? '4px' : '8px' }}>
          {change && <span style={{ fontSize: '12px', lineHeight: '16px', color: changeColor ?? 'var(--color-ink-faint)' }}>{change}</span>}
          {(changeText || subtitle) && <span style={{ fontSize: '12px', lineHeight: '16px', color: subtitleColor ?? 'var(--color-ink-faint)' }}>{changeText ?? subtitle}</span>}
        </div>
      )}
    </div>
  );
}

function RevenueOverTimeChart({ data, maxValue }: { data: { year: string; value: number }[]; maxValue: number }) {
  const chartWidth = 1087, chartHeight = 240;
  const padding = { left: 83, right: 0, top: 1, bottom: 30 };
  const points = data.map((d, i) => ({ x: padding.left + (i / (data.length - 1)) * (chartWidth - padding.left - padding.right), y: chartHeight - padding.bottom - (d.value / maxValue) * (chartHeight - padding.top - padding.bottom - 20), ...d }));
  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const areaPath = `M ${points[0].x} ${chartHeight - padding.bottom} ${points.map((p) => `L ${p.x} ${p.y}`).join(' ')} L ${points[points.length - 1].x} ${chartHeight - padding.bottom} Z`;
  const yLabels = ['£0k', '£100k', '£200k', '£300k', '£400k'];
  return (
    <svg width="100%" height={chartHeight + 20} viewBox={`0 0 ${chartWidth} ${chartHeight + 20}`} className="overflow-visible">
      {[0, 1, 2, 3, 4].map((i) => { const y = padding.top + (i / 4) * (chartHeight - padding.top - padding.bottom); return <line key={i} x1={padding.left} y1={y} x2={chartWidth} y2={y} stroke="var(--color-chart-grid)" strokeWidth="1" strokeDasharray="4 4" />; })}
      {yLabels.map((label, i) => { const y = padding.top + (i / 4) * (chartHeight - padding.top - padding.bottom); return <text key={label} x={padding.left - 8} y={y + 4} textAnchor="end" fill="var(--color-ink)" style={{ fontSize: '14px', fontFamily: 'Manrope', fontWeight: 700 }}>{label}</text>; })}
      <defs><linearGradient id="yearlyGradient" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#C06478" stopOpacity="0.09" /><stop offset="95%" stopColor="#C06478" stopOpacity="0" /></linearGradient></defs>
      <path d={areaPath} fill="url(#yearlyGradient)" />
      <path d={linePath} fill="none" stroke="var(--color-ink)" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
      {points.map((p, i) => (<g key={i}><circle cx={p.x} cy={p.y} r="4" fill="var(--color-ink)" /><text x={p.x} y={chartHeight - padding.bottom + 16} textAnchor="middle" fill="var(--color-ink)" style={{ fontSize: '14px', fontFamily: 'Manrope', fontWeight: 700 }}>{p.year}</text></g>))}
    </svg>
  );
}