import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, ChevronRight, Search } from 'lucide-react';
import { useOrders } from '@shared/hooks/useOrders';
import { formatCurrency, formatDateTime } from '@shared/lib/utils';
import type { Order, OrderStatus } from '@shared/types';

const FILTER_TABS: { label: string; value: 'all' | OrderStatus }[] = [
  { label: 'All Orders', value: 'all' },
  { label: 'In Progress', value: 'pending' },
  { label: 'Processing', value: 'processing' },
  { label: 'Shipped', value: 'shipped' },
  { label: 'Delivered', value: 'delivered' },
  { label: 'Canceled', value: 'cancelled' },
];

const STATUS_COLORS: Record<OrderStatus, string> = {
  pending: 'bg-warning/20 text-warning',
  processing: 'bg-info/20 text-info',
  shipped: 'bg-brand/20 text-brand',
  delivered: 'bg-success/20 text-success',
  cancelled: 'bg-danger/20 text-danger',
  returned: 'bg-line text-ink-muted',
};

export function MyOrdersPage() {
  const [activeFilter, setActiveFilter] = useState<'all' | OrderStatus>('all');
  const [search, setSearch] = useState('');

  const { data, isLoading } = useOrders({ page: 1, limit: 50 });
  const allOrders = data?.orders ?? [];

  const filtered = allOrders.filter((o) => {
    if (activeFilter !== 'all' && o.status !== activeFilter) return false;
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      return (
        o.orderNumber.toLowerCase().includes(q) ||
        o.items.some((i) => i.name.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="flex flex-col" style={{ gap: '24px' }}>
      <div className="flex items-center justify-between flex-wrap" style={{ gap: '16px' }}>
        <div>
          <h2 className="font-sans font-bold text-ink" style={{ fontSize: '24px' }}>My Orders</h2>
          <p className="text-body2 text-ink-muted mt-1">
            {allOrders.length} order{allOrders.length !== 1 ? 's' : ''} total
          </p>
        </div>
        <div className="flex items-center border border-line-strong rounded-card-sm overflow-hidden h-10" style={{ minWidth: '260px' }}>
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by order # or item name"
            className="flex-1 h-full bg-transparent px-3 text-body2 text-ink placeholder:text-ink-muted focus:outline-none"
          />
          <div className="bg-line h-full flex items-center justify-center px-3">
            <Search className="w-4 h-4 text-ink-muted" />
          </div>
        </div>
      </div>

      <div className="flex items-center flex-wrap" style={{ gap: '8px' }}>
        {FILTER_TABS.map((tab) => {
          const count = tab.value === 'all'
            ? allOrders.length
            : allOrders.filter((o) => o.status === tab.value).length;
          return (
            <button
              key={tab.value}
              type="button"
              onClick={() => setActiveFilter(tab.value)}
              className={`rounded-pill px-4 py-2 text-body2 font-medium transition-colors ${
                activeFilter === tab.value
                  ? 'bg-ink text-white'
                  : 'border border-line-strong text-ink-secondary hover:border-ink hover:text-ink'
              }`}
            >
              {tab.label}
              <span className="ml-2 text-body3 opacity-70">({count})</span>
            </button>
          );
        })}
      </div>

      {isLoading ? (
        <div className="flex flex-col" style={{ gap: '16px' }}>
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-32 rounded-card-sm border border-line-strong animate-pulse bg-line" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-card-sm border border-dashed border-line-strong bg-white p-12 text-center">
          <Package className="w-12 h-12 text-ink-muted mx-auto mb-3" />
          <h3 className="font-sans font-semibold text-ink mb-1">No orders found</h3>
          <p className="text-body2 text-ink-muted">
            {search.trim() || activeFilter !== 'all'
              ? 'Try a different filter or search term.'
              : 'Place your first order to see it here.'}
          </p>
          {!search.trim() && activeFilter === 'all' && (
            <Link
              to="/offers"
              className="inline-block mt-4 rounded-pill bg-ink text-white font-bold px-6 py-3 text-body2 hover:bg-ink/90 transition-colors no-underline"
            >
              Start Shopping
            </Link>
          )}
        </div>
      ) : (
        <div className="flex flex-col" style={{ gap: '16px' }}>
          {filtered.map((order) => (
            <OrderRow key={order._id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
}

function OrderRow({ order }: { order: Order }) {
  const firstItem = order.items[0];
  const extraItemsCount = order.items.length - 1;
  const statusColor = STATUS_COLORS[order.status];

  return (
    <Link
      to={`/account/orders/${order._id}`}
      className="rounded-card-sm border border-line-strong bg-white p-4 flex items-center hover:border-brand transition-colors no-underline"
      style={{ gap: '16px' }}
    >
      <div className="shrink-0 rounded-card-sm overflow-hidden bg-primary-light flex items-center justify-center" style={{ width: '72px', height: '72px' }}>
        {firstItem ? (
          <span className="text-body2 font-bold text-brand">
            {order.items.length}
          </span>
        ) : (
          <Package className="w-8 h-8 text-ink-muted" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center" style={{ gap: '8px' }}>
          <span className="text-body1 font-semibold text-ink">{order.orderNumber}</span>
          <span className={`rounded-pill px-2 py-0.5 text-body3 font-medium capitalize ${statusColor}`}>
            {order.status}
          </span>
        </div>
        <div className="text-body3 text-ink-muted mt-1">
          Placed {formatDateTime(order.createdAt)}
        </div>
        <div className="text-body2 text-ink-secondary mt-1 truncate">
          {firstItem?.name ?? '—'}
          {extraItemsCount > 0 && ` + ${extraItemsCount} more item${extraItemsCount !== 1 ? 's' : ''}`}
        </div>
      </div>

      <div className="flex flex-col items-end shrink-0" style={{ gap: '4px' }}>
        <span className="text-body1 font-bold text-ink">{formatCurrency(order.totalAmount)}</span>
        <span className="text-body3 text-ink-muted">{order.items.length} item{order.items.length !== 1 ? 's' : ''}</span>
      </div>

      <ChevronRight className="w-5 h-5 text-ink-muted shrink-0" />
    </Link>
  );
}