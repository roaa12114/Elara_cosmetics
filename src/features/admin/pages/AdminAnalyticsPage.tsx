import { AdminNavbar } from '../components/AdminNavbar';
import { formatCurrency } from '@shared/lib/utils';
import {
  analyticsStats,
  analyticsRevenueTrend,
  analyticsCategorySales,
  analyticsCategoryTotal,
  analyticsTopProducts,
  analyticsOrderStatuses,
  analyticsTotalOrders,
  analyticsCustomerGrowth,
  analyticsLowStock,
} from '../data/adminAnalyticsStaticData';

export function AdminAnalyticsPage() {
  const maxRevenue = Math.max(...analyticsRevenueTrend.map((d) => d.value));
  const maxProducts = Math.max(...analyticsTopProducts.map((p) => p.units));
  const maxGrowth = Math.max(...analyticsCustomerGrowth.map((d) => d.value));

  function donutPath(cx: number, cy: number, r: number, startAngle: number, endAngle: number) {
    const start = { x: cx + r * Math.cos(startAngle), y: cy + r * Math.sin(startAngle) };
    const end = { x: cx + r * Math.cos(endAngle), y: cy + r * Math.sin(endAngle) };
    const largeArc = endAngle - startAngle > Math.PI ? 1 : 0;
    return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 1 ${end.x} ${end.y}`;
  }

  let catAngle = -Math.PI / 2;
  const catArcs = analyticsCategorySales.map((s) => {
    const angle = (s.percentage / 100) * Math.PI * 2;
    const arc = { path: donutPath(80, 80, 60, catAngle, catAngle + angle), color: s.color, name: s.name, percentage: s.percentage };
    catAngle += angle;
    return arc;
  });

  let ordAngle = -Math.PI / 2;
  const ordArcs = analyticsOrderStatuses.map((s) => {
    const angle = (s.count / analyticsTotalOrders) * Math.PI * 2;
    const arc = { path: donutPath(80, 80, 60, ordAngle, ordAngle + angle), color: s.color, name: s.name, count: s.count };
    ordAngle += angle;
    return arc;
  });

  return (
    <div className="flex flex-col min-h-screen">
      <AdminNavbar />
      <div className="flex flex-col" style={{ padding: '32px', gap: '24px' }}>
        <h1 className="font-bold text-ink" style={{ fontSize: '20px' }}>Analytics</h1>

        <div className="grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
          <StatCard label="Total Revenue" value={formatCurrency(analyticsStats.totalRevenue)} change={`+${analyticsStats.revenueChange}%`} />
          <StatCard label="Total Orders" value={String(analyticsStats.totalOrders)} change={`+${analyticsStats.ordersChange}%`} />
          <StatCard label="Total Customers" value={analyticsStats.totalCustomers.toLocaleString()} change={`+${analyticsStats.customersChange}%`} />
          <StatCard label="Avg Order Value" value={formatCurrency(analyticsStats.avgOrderValue)} change={`+${analyticsStats.avgOrderChange}%`} />
        </div>

        {/* Revenue + Category donut */}
        <div className="grid" style={{ gridTemplateColumns: '1fr 320px', gap: '24px' }}>
          <div className="bg-white" style={{ border: '1px solid var(--color-line)', borderRadius: '8px', padding: '24px' }}>
            <h3 className="font-bold text-ink" style={{ fontSize: '16px', marginBottom: '16px' }}>Revenue Trend — November 2024</h3>
            <svg width="100%" height="220" viewBox="0 0 600 220" className="overflow-visible">
              {[0, 1, 2, 3].map((i) => { const y = 10 + (i / 3) * 175; return <line key={i} x1="50" y1={y} x2="590" y2={y} stroke="var(--color-chart-grid)" strokeWidth="1" strokeDasharray="4 4" />; })}
              <defs><linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#C06478" stopOpacity="0.12" /><stop offset="95%" stopColor="#C06478" stopOpacity="0" /></linearGradient></defs>
              {(() => { const pts = analyticsRevenueTrend.map((d, i) => ({ x: 50 + (i / (analyticsRevenueTrend.length - 1)) * 540, y: 195 - (d.value / maxRevenue) * 175, day: d.day })); const lp = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' '); const ap = `M ${pts[0].x} 195 ${pts.map((p) => `L ${p.x} ${p.y}`).join(' ')} L ${pts[pts.length - 1].x} 195 Z`; return (<><path d={ap} fill="url(#revGrad)" /><path d={lp} fill="none" stroke="var(--color-revenue-line)" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />{pts.map((p, i) => (<g key={i}><circle cx={p.x} cy={p.y} r="3" fill="var(--color-revenue-line)" /><text x={p.x} y={212} textAnchor="middle" fill="var(--color-ink-faint)" style={{ fontSize: '11px' }}>{p.day}</text></g>))}</>); })()}
            </svg>
          </div>

          <div className="bg-white" style={{ border: '1px solid var(--color-line)', borderRadius: '8px', padding: '24px' }}>
            <h3 className="font-bold text-ink" style={{ fontSize: '16px', marginBottom: '16px' }}>Category Sales</h3>
            <div className="flex items-center justify-center">
              <svg width="160" height="160" viewBox="0 0 160 160">
                {catArcs.map((a, i) => <path key={i} d={a.path} fill="none" stroke={a.color} strokeWidth="20" />)}
                <text x="80" y="75" textAnchor="middle" fill="var(--color-ink)" style={{ fontSize: '12px' }}>Total</text>
                <text x="80" y="95" textAnchor="middle" fill="var(--color-ink)" style={{ fontSize: '16px', fontWeight: 'bold' }}>{formatCurrency(analyticsCategoryTotal)}</text>
              </svg>
            </div>
            <div className="flex flex-col" style={{ gap: '8px', marginTop: '16px' }}>
              {catArcs.map((a) => (
                <div key={a.name} className="flex items-center justify-between">
                  <div className="flex items-center" style={{ gap: '8px' }}>
                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: a.color }} />
                    <span className="text-ink" style={{ fontSize: '14px' }}>{a.name}</span>
                  </div>
                  <span className="text-ink-faint" style={{ fontSize: '14px' }}>{a.percentage}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top products + Order status donut */}
        <div className="grid" style={{ gridTemplateColumns: '1fr 320px', gap: '24px' }}>
          <div className="bg-white" style={{ border: '1px solid var(--color-line)', borderRadius: '8px', padding: '24px' }}>
            <h3 className="font-bold text-ink" style={{ fontSize: '16px', marginBottom: '16px' }}>Top Products</h3>
            <div className="flex flex-col" style={{ gap: '12px' }}>
              {analyticsTopProducts.map((p) => (
                <div key={p.name}>
                  <div className="flex justify-between" style={{ marginBottom: '4px' }}>
                    <span className="text-ink" style={{ fontSize: '14px' }}>{p.name}</span>
                    <span className="text-ink-faint" style={{ fontSize: '14px' }}>{p.units} units</span>
                  </div>
                  <div style={{ height: '12px', background: 'var(--color-surface)', borderRadius: '6px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${(p.units / maxProducts) * 100}%`, background: 'var(--color-brand)', borderRadius: '6px' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white" style={{ border: '1px solid var(--color-line)', borderRadius: '8px', padding: '24px' }}>
            <h3 className="font-bold text-ink" style={{ fontSize: '16px', marginBottom: '16px' }}>Order Analysis</h3>
            <div className="flex items-center justify-center">
              <svg width="160" height="160" viewBox="0 0 160 160">
                {ordArcs.map((a, i) => <path key={i} d={a.path} fill="none" stroke={a.color} strokeWidth="20" />)}
                <text x="80" y="75" textAnchor="middle" fill="var(--color-ink)" style={{ fontSize: '12px' }}>Total</text>
                <text x="80" y="95" textAnchor="middle" fill="var(--color-ink)" style={{ fontSize: '16px', fontWeight: 'bold' }}>{analyticsTotalOrders}</text>
              </svg>
            </div>
            <div className="flex flex-col" style={{ gap: '6px', marginTop: '16px' }}>
              {ordArcs.map((a) => (
                <div key={a.name} className="flex items-center justify-between">
                  <div className="flex items-center" style={{ gap: '8px' }}>
                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: a.color }} />
                    <span className="text-ink" style={{ fontSize: '14px' }}>{a.name}</span>
                  </div>
                  <span className="text-ink-faint" style={{ fontSize: '14px' }}>{a.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Customer growth + Low stock */}
        <div className="grid" style={{ gridTemplateColumns: '1fr 320px', gap: '24px' }}>
          <div className="bg-white" style={{ border: '1px solid var(--color-line)', borderRadius: '8px', padding: '24px' }}>
            <h3 className="font-bold text-ink" style={{ fontSize: '16px', marginBottom: '16px' }}>Customer Growth</h3>
            <svg width="100%" height="200" viewBox="0 0 600 200" className="overflow-visible">
              {[0, 1, 2, 3].map((i) => { const y = 10 + (i / 3) * 160; return <line key={i} x1="50" y1={y} x2="590" y2={y} stroke="var(--color-chart-grid)" strokeWidth="1" strokeDasharray="4 4" />; })}
              {(() => { const pts = analyticsCustomerGrowth.map((d, i) => ({ x: 50 + (i / (analyticsCustomerGrowth.length - 1)) * 540, y: 180 - (d.value / maxGrowth) * 160, month: d.month })); const lp = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' '); return (<><path d={lp} fill="none" stroke="var(--color-revenue-line)" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />{pts.map((p, i) => (<g key={i}><circle cx={p.x} cy={p.y} r="3" fill="var(--color-revenue-line)" /><text x={p.x} y={196} textAnchor="middle" fill="var(--color-ink-faint)" style={{ fontSize: '11px' }}>{p.month}</text></g>))}</>); })()}
            </svg>
          </div>

          <div className="bg-white" style={{ border: '1px solid var(--color-line)', borderRadius: '8px', padding: '24px' }}>
            <h3 className="font-bold text-ink" style={{ fontSize: '16px', marginBottom: '16px' }}>Low Stock Alerts</h3>
            <div className="flex flex-col" style={{ gap: '12px' }}>
              {analyticsLowStock.map((item) => (
                <div key={item.sku} className="flex items-center justify-between" style={{ padding: '12px', background: 'var(--color-surface)', borderRadius: '8px' }}>
                  <div>
                    <div className="text-ink font-medium" style={{ fontSize: '14px' }}>{item.name}</div>
                    <div className="text-ink-faint" style={{ fontSize: '12px' }}>{item.sku}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-danger-dark" style={{ fontSize: '14px', fontWeight: 600 }}>{item.stock}/{item.threshold}</div>
                    <div className="text-ink-faint" style={{ fontSize: '12px' }}>Low stock</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
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