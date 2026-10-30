import { Search, Download } from 'lucide-react';
import { recentOrders } from '../data/sellerStaticData';
import { formatCurrency } from '@shared/lib/utils';

const STATUS_COLORS: Record<string, string> = {
  Delivered: 'bg-success/20 text-success',
  Shipped: 'bg-brand/20 text-brand',
  Processing: 'bg-warning/20 text-warning',
  Pending: 'bg-info/20 text-info',
  Cancelled: 'bg-danger/20 text-danger',
};

const FILTER_TABS = ['All Orders', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

export function SellerOrdersPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Top bar */}
      <header className="bg-white border-b border-line px-8 py-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="font-sans font-bold text-ink" style={{ fontSize: '20px' }}>Orders</h1>
            <p className="text-body3 text-ink-muted mt-1">{recentOrders.length} orders total</p>
          </div>
          <div className="flex items-center" style={{ gap: '8px' }}>
            <button className="rounded-pill border border-line-strong text-body2 font-medium px-4 h-10 flex items-center gap-2 hover:border-ink transition-colors">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>

        {/* Search + filter tabs */}
        <div className="flex items-center justify-between">
          <div className="flex items-center border border-line-strong rounded-card-sm overflow-hidden h-10" style={{ minWidth: '300px' }}>
            <input
              type="search"
              placeholder="Search by order ID or customer name..."
              className="flex-1 h-full bg-transparent px-4 text-body2 focus:outline-none"
            />
            <div className="bg-line h-full flex items-center justify-center px-3">
              <Search className="w-4 h-4 text-ink-muted" />
            </div>
          </div>
          <div className="flex items-center" style={{ gap: '6px' }}>
            {FILTER_TABS.map((tab, i) => (
              <button
                key={tab}
                className={`rounded-pill px-3 py-1.5 text-body3 font-medium transition-colors ${
                  i === 0
                    ? 'bg-ink text-white'
                    : 'border border-line-strong text-ink-secondary hover:border-ink'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Orders table */}
      <div className="flex-1 p-8">
        <div className="rounded-card-sm border border-line-strong bg-white overflow-hidden">
          <table className="w-full text-body2">
            <thead className="bg-surface">
              <tr className="text-left text-body3 text-ink-muted uppercase tracking-wide border-b border-line">
                <th className="px-4 py-3 font-medium">Order ID</th>
                <th className="px-4 py-3 font-medium">Customer</th>
                <th className="px-4 py-3 font-medium">Product</th>
                <th className="px-4 py-3 font-medium text-right">Amount</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((o) => (
                <tr key={o.id} className="border-b border-line last:border-0 hover:bg-surface transition-colors cursor-pointer">
                  <td className="px-4 py-3 font-medium text-ink">{o.id}</td>
                  <td className="px-4 py-3 text-ink-secondary">{o.customer}</td>
                  <td className="px-4 py-3 text-ink-secondary">{o.product}</td>
                  <td className="px-4 py-3 text-right font-semibold text-ink">{formatCurrency(o.amount)}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-pill px-2 py-0.5 text-body3 font-medium ${STATUS_COLORS[o.status]}`}>
                      {o.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-body3 text-ink-muted">Nov 15, 2024</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-4">
          <span className="text-body3 text-ink-muted">Showing 1-{recentOrders.length} of {recentOrders.length}</span>
          <div className="flex items-center" style={{ gap: '4px' }}>
            <button className="rounded-card-sm border border-line-strong px-3 py-1.5 text-body3 text-ink-muted cursor-not-allowed" disabled>Prev</button>
            <button className="rounded-card-sm bg-ink text-white px-3 py-1.5 text-body3 font-medium">1</button>
            <button className="rounded-card-sm border border-line-strong px-3 py-1.5 text-body3 text-ink-muted cursor-not-allowed" disabled>Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}