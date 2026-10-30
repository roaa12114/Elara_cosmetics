import { Banknote, Plus, CheckCircle2, Clock } from 'lucide-react';
import { sellerStats, payouts } from '../data/sellerStaticData';
import { formatCurrency } from '@shared/lib/utils';

const STATUS_COLORS: Record<string, string> = {
  Completed: 'bg-success/20 text-success',
  Pending: 'bg-warning/20 text-warning',
  Failed: 'bg-danger/20 text-danger',
};

export function SellerPayoutsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Top bar */}
      <header className="bg-white border-b border-line px-8 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-sans font-bold text-ink" style={{ fontSize: '20px' }}>Payouts</h1>
            <p className="text-body3 text-ink-muted mt-1">Manage your withdrawal requests</p>
          </div>
          <button
            className="rounded-pill bg-ink text-white text-body2 font-medium px-4 h-10 flex items-center gap-2 hover:bg-ink/90 transition-colors"
            disabled={sellerStats.availableEarnings < 100}
            title={sellerStats.availableEarnings < 100 ? 'Minimum payout is $100' : 'Request a payout'}
          >
            <Plus className="w-4 h-4" />
            Request Payout
          </button>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 p-8 flex flex-col" style={{ gap: '24px' }}>
        {/* Summary cards */}
        <div className="grid grid-cols-1 md:grid-cols-3" style={{ gap: '16px' }}>
          <div className="rounded-card-sm border border-line-strong bg-white p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-body3 text-ink-muted uppercase tracking-wide">Available for Payout</span>
              <Banknote className="w-5 h-5 text-success" />
            </div>
            <div className="text-h3 font-bold text-success">{formatCurrency(sellerStats.availableEarnings)}</div>
            <div className="text-body3 text-ink-muted mt-2">Min payout: $100</div>
          </div>

          <div className="rounded-card-sm border border-line-strong bg-white p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-body3 text-ink-muted uppercase tracking-wide">Pending Payout</span>
              <Clock className="w-5 h-5 text-warning" />
            </div>
            <div className="text-h3 font-bold text-warning">{formatCurrency(sellerStats.pendingEarnings)}</div>
            <div className="text-body3 text-ink-muted mt-2">Processing</div>
          </div>

          <div className="rounded-card-sm border border-line-strong bg-white p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-body3 text-ink-muted uppercase tracking-wide">Total Withdrawn</span>
              <CheckCircle2 className="w-5 h-5 text-brand" />
            </div>
            <div className="text-h3 font-bold text-ink">{formatCurrency(11901.5)}</div>
            <div className="text-body3 text-ink-muted mt-2">All time</div>
          </div>
        </div>

        {/* Payout history table */}
        <div className="rounded-card-sm border border-line-strong bg-white p-5">
          <h3 className="font-sans font-semibold text-ink mb-4" style={{ fontSize: '16px' }}>Payout History</h3>
          <table className="w-full text-body2">
            <thead>
              <tr className="border-b border-line text-left text-body3 text-ink-muted uppercase tracking-wide">
                <th className="py-2 font-medium">Payout ID</th>
                <th className="py-2 font-medium">Date</th>
                <th className="py-2 font-medium text-right">Amount</th>
                <th className="py-2 font-medium">Method</th>
                <th className="py-2 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {payouts.map((p) => (
                <tr key={p.id} className="border-b border-line last:border-0">
                  <td className="py-3 font-medium text-ink">{p.id}</td>
                  <td className="py-3 text-ink-secondary">{p.date}</td>
                  <td className="py-3 text-right font-semibold text-ink">{formatCurrency(p.amount)}</td>
                  <td className="py-3 text-ink-secondary">{p.method}</td>
                  <td className="py-3">
                    <span className={`rounded-pill px-2 py-0.5 text-body3 font-medium ${STATUS_COLORS[p.status]}`}>
                      {p.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Bank account info */}
        <div className="rounded-card-sm border border-line-strong bg-white p-5">
          <h3 className="font-sans font-semibold text-ink mb-4" style={{ fontSize: '16px' }}>Linked Bank Account</h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center" style={{ gap: '12px' }}>
              <div className="rounded-card-sm bg-primary-light w-10 h-10 flex items-center justify-center">
                <Banknote className="w-5 h-5 text-brand" />
              </div>
              <div>
                <div className="text-body1 font-medium text-ink">Bank Transfer •• 4521</div>
                <div className="text-body3 text-ink-muted">Cairo Bank · EG</div>
              </div>
            </div>
            <button className="text-body2 text-brand hover:underline">Change</button>
          </div>
        </div>
      </div>
    </div>
  );
}
