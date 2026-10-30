import { TrendingUp, Wallet, Clock, DollarSign } from 'lucide-react';
import { sellerStats, recentOrders } from '../data/sellerStaticData';
import { formatCurrency } from '@shared/lib/utils';

export function SellerEarningsPage() {
  const totalEarnings = sellerStats.availableEarnings + sellerStats.pendingEarnings;

  return (
    <div className="flex flex-col min-h-screen">
      {/* Top bar */}
      <header className="bg-white border-b border-line px-8 py-4">
        <h1 className="font-sans font-bold text-ink" style={{ fontSize: '20px' }}>Earnings</h1>
        <p className="text-body3 text-ink-muted mt-1">Track your earnings and revenue performance</p>
      </header>

      {/* Content */}
      <div className="flex-1 p-8 flex flex-col" style={{ gap: '24px' }}>
        {/* Summary cards */}
        <div className="grid grid-cols-1 md:grid-cols-3" style={{ gap: '16px' }}>
          <div className="rounded-card-sm border border-line-strong bg-white p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-body3 text-ink-muted uppercase tracking-wide">Total Earnings</span>
              <Wallet className="w-5 h-5 text-brand" />
            </div>
            <div className="text-h3 font-bold text-ink">{formatCurrency(totalEarnings)}</div>
            <div className="flex items-center text-body3 text-success mt-2">
              <TrendingUp className="w-3 h-3 mr-1" />
              +12.4% vs last month
            </div>
          </div>

          <div className="rounded-card-sm border border-line-strong bg-white p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-body3 text-ink-muted uppercase tracking-wide">Available</span>
              <DollarSign className="w-5 h-5 text-success" />
            </div>
            <div className="text-h3 font-bold text-success">{formatCurrency(sellerStats.availableEarnings)}</div>
            <button className="mt-3 rounded-pill bg-success text-white text-body2 font-medium px-4 h-9 hover:bg-success/90 transition-colors">
              Request Payout
            </button>
          </div>

          <div className="rounded-card-sm border border-line-strong bg-white p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-body3 text-ink-muted uppercase tracking-wide">Pending</span>
              <Clock className="w-5 h-5 text-warning" />
            </div>
            <div className="text-h3 font-bold text-warning">{formatCurrency(sellerStats.pendingEarnings)}</div>
            <div className="text-body3 text-ink-muted mt-3">Clears in 3-5 business days</div>
          </div>
        </div>

        {/* Earnings breakdown table */}
        <div className="rounded-card-sm border border-line-strong bg-white p-5">
          <h3 className="font-sans font-semibold text-ink mb-4" style={{ fontSize: '16px' }}>Recent Earnings</h3>
          <table className="w-full text-body2">
            <thead>
              <tr className="border-b border-line text-left text-body3 text-ink-muted uppercase tracking-wide">
                <th className="py-2 font-medium">Order</th>
                <th className="py-2 font-medium">Customer</th>
                <th className="py-2 font-medium">Product</th>
                <th className="py-2 font-medium text-right">Order Value</th>
                <th className="py-2 font-medium text-right">Your Earnings</th>
                <th className="py-2 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.slice(0, 6).map((o) => {
                const earnings = o.amount * 0.85; // 85% seller share (15% platform fee)
                return (
                  <tr key={o.id} className="border-b border-line last:border-0">
                    <td className="py-3 font-medium text-ink">{o.id}</td>
                    <td className="py-3 text-ink-secondary">{o.customer}</td>
                    <td className="py-3 text-ink-secondary">{o.product}</td>
                    <td className="py-3 text-right text-ink-secondary">{formatCurrency(o.amount)}</td>
                    <td className="py-3 text-right font-semibold text-success">{formatCurrency(earnings)}</td>
                    <td className="py-3">
                      <span className="text-body3 text-ink-muted">Paid</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Summary info */}
        <div className="rounded-card-sm border border-line-strong bg-primary-light/30 p-4 text-body2 text-ink-secondary">
          Earnings are calculated as 85% of each order value (15% platform fee).
          Available earnings can be withdrawn via the Payouts page.
        </div>
      </div>
    </div>
  );
}