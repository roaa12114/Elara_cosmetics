import { TrendingUp, Wallet, DollarSign, Clock, Percent } from 'lucide-react';
import { SellerNavbar } from '../components/SellerNavbar';
import { earningsStats, monthlyEarnings, netEarningsTrend, transactions } from '../data/sellerStaticData';
import { formatCurrency } from '@shared/lib/utils';

const TYPE_STYLES: Record<string, { bg: string; text: string }> = {
  Sale: { bg: 'var(--color-status-delivered-bg)', text: 'var(--color-success-text)' },
  Refund: { bg: 'var(--color-status-out-of-stock-bg)', text: '#171315' },
};
const STATUS_STYLES: Record<string, { bg: string; text: string }> = {
  Completed: { bg: 'var(--color-status-delivered-bg)', text: 'var(--color-success-text)' },
  Pending: { bg: 'var(--color-status-pending-bg)', text: 'var(--color-warning-text)' },
};

export function SellerEarningsPage() {
  const maxGross = Math.max(...monthlyEarnings.map((d) => d.gross));
  const maxNetTrend = Math.max(...netEarningsTrend.map((d) => d.value));

  return (
    <div className="flex flex-col min-h-screen">
      <SellerNavbar />
      <div className="flex flex-col" style={{ padding: '32px', gap: '24px' }}>
        <h1 className="font-bold text-ink" style={{ fontSize: '20px' }}>Earnings</h1>
        <div className="grid" style={{ gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px' }}>
          <StatCard icon={DollarSign} label="Total Earnings" value={formatCurrency(earningsStats.totalEarnings)} subtitle="gross sales" />
          <StatCard icon={Wallet} label="Net Earnings" value={formatCurrency(earningsStats.netEarnings)} subtitle="after fees" />
          <StatCard icon={TrendingUp} label="Withdrawn" value={formatCurrency(earningsStats.withdrawn)} subtitle="all time" />
          <StatCard icon={Clock} label="Pending" value={formatCurrency(earningsStats.pending)} subtitle="processing" alert={earningsStats.pending > 0} />
          <StatCard icon={Percent} label="Platform Fee" value={formatCurrency(earningsStats.platformFee)} subtitle="total fees" />
        </div>
        <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          <div className="bg-white" style={{ border: '1px solid var(--color-line)', borderRadius: '8px', padding: '24px' }}>
            <div className="flex items-center justify-between" style={{ marginBottom: '16px' }}>
              <h3 className="font-bold text-ink" style={{ fontSize: '16px' }}>Monthly Earnings</h3>
              <div className="flex items-center" style={{ gap: '12px' }}>
                <span className="flex items-center text-ink-faint" style={{ gap: '4px', fontSize: '12px' }}><span style={{ width: '10px', height: '10px', background: 'var(--color-ink)', borderRadius: '2px' }} /> Gross</span>
                <span className="flex items-center text-ink-faint" style={{ gap: '4px', fontSize: '12px' }}><span style={{ width: '10px', height: '10px', background: 'var(--color-revenue-line)', borderRadius: '2px' }} /> Net</span>
              </div>
            </div>
            <div className="flex items-end" style={{ gap: '16px', height: '200px' }}>
              {monthlyEarnings.map((d) => (
                <div key={d.month} className="flex flex-col items-center" style={{ flex: '1', gap: '8px' }}>
                  <div className="flex items-end" style={{ gap: '4px', height: '160px' }}>
                    <div style={{ width: '20px', height: `${(d.gross / maxGross) * 100}%`, background: 'var(--color-ink)', borderRadius: '4px 4px 0 0' }} title={`Gross: ${formatCurrency(d.gross)}`} />
                    <div style={{ width: '20px', height: `${(d.net / maxGross) * 100}%`, background: 'var(--color-revenue-line)', borderRadius: '4px 4px 0 0' }} title={`Net: ${formatCurrency(d.net)}`} />
                  </div>
                  <span className="text-ink-faint" style={{ fontSize: '12px' }}>{d.month}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white" style={{ border: '1px solid var(--color-line)', borderRadius: '8px', padding: '24px' }}>
            <h3 className="font-bold text-ink" style={{ fontSize: '16px', marginBottom: '16px' }}>Net Earnings Trend</h3>
            <NetEarningsChart data={netEarningsTrend} maxValue={maxNetTrend} />
          </div>
        </div>
        <div className="bg-white overflow-hidden" style={{ border: '1px solid var(--color-line)', borderRadius: '8px' }}>
          <div style={{ padding: '24px', borderBottom: '1px solid var(--color-line)' }}><h3 className="font-bold text-ink" style={{ fontSize: '16px' }}>Transaction History</h3></div>
          <table className="w-full">
            <thead><tr style={{ borderBottom: '1px solid var(--color-line)', background: '#FFF9F9' }}>
              <th className="text-left font-bold text-ink-secondary" style={{ padding: '12px 16px', fontSize: '12px', textTransform: 'uppercase' }}>ID</th>
              <th className="text-left font-bold text-ink-secondary" style={{ padding: '12px 16px', fontSize: '12px', textTransform: 'uppercase' }}>Date</th>
              <th className="text-left font-bold text-ink-secondary" style={{ padding: '12px 16px', fontSize: '12px', textTransform: 'uppercase' }}>Description</th>
              <th className="text-right font-bold text-ink-secondary" style={{ padding: '12px 16px', fontSize: '12px', textTransform: 'uppercase' }}>Gross</th>
              <th className="text-right font-bold text-ink-secondary" style={{ padding: '12px 16px', fontSize: '12px', textTransform: 'uppercase' }}>Fee</th>
              <th className="text-right font-bold text-ink-secondary" style={{ padding: '12px 16px', fontSize: '12px', textTransform: 'uppercase' }}>Net</th>
              <th className="text-center font-bold text-ink-secondary" style={{ padding: '12px 16px', fontSize: '12px', textTransform: 'uppercase' }}>Type</th>
              <th className="text-center font-bold text-ink-secondary" style={{ padding: '12px 16px', fontSize: '12px', textTransform: 'uppercase' }}>Status</th>
            </tr></thead>
            <tbody>{transactions.map((t) => {
              const typeSt = TYPE_STYLES[t.type] ?? TYPE_STYLES.Sale;
              const stSt = STATUS_STYLES[t.status] ?? STATUS_STYLES.Pending;
              return (
                <tr key={t.id} style={{ borderBottom: '1px solid var(--color-line)' }} className="hover:bg-surface transition-colors">
                  <td className="font-medium text-ink" style={{ padding: '12px 16px', fontSize: '14px' }}>{t.id}</td>
                  <td className="text-ink-faint" style={{ padding: '12px 16px', fontSize: '14px' }}>{t.date}</td>
                  <td className="text-ink-secondary" style={{ padding: '12px 16px', fontSize: '14px' }}>{t.description}</td>
                  <td className="text-right" style={{ padding: '12px 16px', fontSize: '14px', color: t.gross < 0 ? 'var(--color-danger-dark)' : 'var(--color-ink)', fontWeight: 600 }}>{t.gross < 0 ? '-' : ''}{formatCurrency(Math.abs(t.gross))}</td>
                  <td className="text-right text-ink-faint" style={{ padding: '12px 16px', fontSize: '14px' }}>{formatCurrency(t.fee)}</td>
                  <td className="text-right font-bold" style={{ padding: '12px 16px', fontSize: '14px', color: t.net < 0 ? 'var(--color-danger-dark)' : 'var(--color-ink)' }}>{t.net < 0 ? '-' : ''}{formatCurrency(Math.abs(t.net))}</td>
                  <td style={{ padding: '12px 16px', textAlign: 'center' }}><span className="inline-flex items-center justify-center" style={{ background: typeSt.bg, color: typeSt.text, borderRadius: '6px', padding: '6px 12px', fontSize: '12px', fontWeight: 500 }}>{t.type}</span></td>
                  <td style={{ padding: '12px 16px', textAlign: 'center' }}><span className="inline-flex items-center justify-center" style={{ background: stSt.bg, color: stSt.text, borderRadius: '6px', padding: '6px 12px', fontSize: '12px', fontWeight: 500 }}>{t.status}</span></td>
                </tr>
              );
            })}</tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, subtitle, alert }: {
  icon: typeof DollarSign; label: string; value: string; subtitle: string; alert?: boolean;
}) {
  return (
    <div className="bg-white" style={{ borderRadius: '8px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <div className="flex items-center justify-between">
        <span className="text-ink-secondary" style={{ fontSize: '14px', lineHeight: '20px' }}>{label}</span>
        <Icon className="w-4 h-4" style={{ color: alert ? 'var(--color-warning-text)' : 'var(--color-ink-faint)' }} />
      </div>
      <span className="font-bold" style={{ fontSize: '20px', lineHeight: '24px', color: alert ? 'var(--color-warning-text)' : 'var(--color-ink)' }}>{value}</span>
      <span className="text-ink-faint" style={{ fontSize: '12px', lineHeight: '16px' }}>{subtitle}</span>
    </div>
  );
}

function NetEarningsChart({ data, maxValue }: { data: { month: string; value: number }[]; maxValue: number }) {
  const chartWidth = 450, chartHeight = 200;
  const padding = { left: 50, right: 10, top: 10, bottom: 25 };
  const points = data.map((d, i) => ({ x: padding.left + (i / (data.length - 1)) * (chartWidth - padding.left - padding.right), y: chartHeight - padding.bottom - (d.value / maxValue) * (chartHeight - padding.top - padding.bottom - 20), ...d }));
  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const areaPath = `M ${points[0].x} ${chartHeight - padding.bottom} ${points.map((p) => `L ${p.x} ${p.y}`).join(' ')} L ${points[points.length - 1].x} ${chartHeight - padding.bottom} Z`;
  return (
    <svg width="100%" height={chartHeight} viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="overflow-visible">
      {[0, 1, 2, 3].map((i) => { const y = padding.top + (i / 3) * (chartHeight - padding.top - padding.bottom); return <line key={i} x1={padding.left} y1={y} x2={chartWidth} y2={y} stroke="var(--color-chart-grid)" strokeWidth="1" strokeDasharray="4 4" />; })}
      <defs><linearGradient id="earningsGradient" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#C06478" stopOpacity="0.12" /><stop offset="95%" stopColor="#C06478" stopOpacity="0" /></linearGradient></defs>
      <path d={areaPath} fill="url(#earningsGradient)" />
      <path d={linePath} fill="none" stroke="var(--color-revenue-line)" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
      {points.map((p, i) => (<g key={i}><circle cx={p.x} cy={p.y} r="3" fill="var(--color-revenue-line)" /><text x={p.x} y={chartHeight - padding.bottom + 16} textAnchor="middle" fill="var(--color-ink-faint)" style={{ fontSize: '11px', fontFamily: 'Manrope' }}>{p.month}</text></g>))}
    </svg>
  );
}