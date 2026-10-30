import { Plus, Tag, Copy } from 'lucide-react';
import { sellerPromotions } from '../data/sellerStaticData';
import { formatCurrency } from '@shared/lib/utils';

const STATUS_COLORS: Record<string, string> = {
  Active: 'bg-success/20 text-success',
  Expired: 'bg-line text-ink-muted',
  Scheduled: 'bg-info/20 text-info',
};

export function SellerPromotionsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Top bar */}
      <header className="bg-white border-b border-line px-8 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-sans font-bold text-ink" style={{ fontSize: '20px' }}>Promotions</h1>
            <p className="text-body3 text-ink-muted mt-1">Create and manage discount codes for your products</p>
          </div>
          <button className="rounded-pill bg-ink text-white text-body2 font-medium px-4 h-10 flex items-center gap-2 hover:bg-ink/90 transition-colors">
            <Plus className="w-4 h-4" />
            Create Promotion
          </button>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 p-8 flex flex-col" style={{ gap: '24px' }}>
        {/* Summary cards */}
        <div className="grid grid-cols-2 md:grid-cols-4" style={{ gap: '16px' }}>
          <div className="rounded-card-sm border border-line-strong bg-white p-4">
            <div className="text-body3 text-ink-muted uppercase tracking-wide">Active Promos</div>
            <div className="text-h5 font-bold text-ink mt-1">{sellerPromotions.filter((p) => p.status === 'Active').length}</div>
          </div>
          <div className="rounded-card-sm border border-line-strong bg-white p-4">
            <div className="text-body3 text-ink-muted uppercase tracking-wide">Total Uses</div>
            <div className="text-h5 font-bold text-ink mt-1">{sellerPromotions.reduce((s, p) => s + p.uses, 0)}</div>
          </div>
          <div className="rounded-card-sm border border-line-strong bg-white p-4">
            <div className="text-body3 text-ink-muted uppercase tracking-wide">Discount Given</div>
            <div className="text-h5 font-bold text-ink mt-1">{formatCurrency(4820)}</div>
          </div>
          <div className="rounded-card-sm border border-line-strong bg-white p-4">
            <div className="text-body3 text-ink-muted uppercase tracking-wide">Expired</div>
            <div className="text-h5 font-bold text-ink-muted mt-1">{sellerPromotions.filter((p) => p.status === 'Expired').length}</div>
          </div>
        </div>

        {/* Promotions table */}
        <div className="rounded-card-sm border border-line-strong bg-white p-5">
          <h3 className="font-sans font-semibold text-ink mb-4" style={{ fontSize: '16px' }}>All Promotions</h3>
          <table className="w-full text-body2">
            <thead>
              <tr className="border-b border-line text-left text-body3 text-ink-muted uppercase tracking-wide">
                <th className="py-2 font-medium">Code</th>
                <th className="py-2 font-medium">Type</th>
                <th className="py-2 font-medium">Discount</th>
                <th className="py-2 font-medium text-right">Uses</th>
                <th className="py-2 font-medium">Expires</th>
                <th className="py-2 font-medium">Status</th>
                <th className="py-2 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sellerPromotions.map((p) => (
                <tr key={p.code} className="border-b border-line last:border-0">
                  <td className="py-3">
                    <div className="flex items-center" style={{ gap: '8px' }}>
                      <Tag className="w-4 h-4 text-brand" />
                      <span className="font-mono font-semibold text-ink">{p.code}</span>
                      <button
                        className="text-ink-muted hover:text-ink"
                        title="Copy code"
                        onClick={() => navigator.clipboard?.writeText(p.code)}
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                    </div>
                  </td>
                  <td className="py-3 text-ink-secondary">{p.type}</td>
                  <td className="py-3 text-ink font-medium">{p.value}</td>
                  <td className="py-3 text-right text-ink-secondary">{p.uses}</td>
                  <td className="py-3 text-body3 text-ink-muted">{p.expiresAt}</td>
                  <td className="py-3">
                    <span className={`rounded-pill px-2 py-0.5 text-body3 font-medium ${STATUS_COLORS[p.status]}`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="py-3 text-right">
                    <button className="text-body3 text-brand hover:underline mr-3">Edit</button>
                    <button className="text-body3 text-danger hover:underline">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Note */}
        <div className="rounded-card-sm border border-line-strong bg-primary-light/30 p-4 text-body2 text-ink-secondary">
          Promotion management is currently in demo mode. Codes shown above are for display only —
          use the admin dashboard to create backend-validated promo codes.
        </div>
      </div>
    </div>
  );
}