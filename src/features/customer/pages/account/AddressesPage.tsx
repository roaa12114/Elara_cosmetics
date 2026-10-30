import { Link } from 'react-router-dom';
import { MapPin, ArrowRight } from 'lucide-react';
import { useOrders } from '@shared/hooks/useOrders';
import { formatDateTime } from '@shared/lib/utils';
import type { ShippingAddress } from '@shared/types';

export function AddressesPage() {
  const { data, isLoading } = useOrders({ limit: 50 });
  const orders = data?.orders ?? [];

  const seen = new Set<string>();
  const addresses: { address: ShippingAddress; lastUsed: string }[] = [];
  for (const o of orders) {
    const sa = o.shippingAddress;
    if (!sa) continue;
    const key = `${sa.street}|${sa.city}|${sa.state}`.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    addresses.push({ address: sa, lastUsed: o.createdAt });
  }

  return (
    <div className="flex flex-col" style={{ gap: '24px' }}>
      <div>
        <h2 className="font-sans font-bold text-ink" style={{ fontSize: '24px' }}>My Addresses</h2>
        <p className="text-body2 text-ink-muted mt-1">
          Addresses you've used in past orders.{' '}
          <Link to="/checkout" className="text-brand hover:underline">Add a new one at checkout →</Link>
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: '16px' }}>
          {[0, 1].map((i) => (
            <div key={i} className="h-40 rounded-card-sm border border-line-strong animate-pulse bg-line" />
          ))}
        </div>
      ) : addresses.length === 0 ? (
        <div className="rounded-card-sm border border-dashed border-line-strong bg-white p-12 text-center">
          <MapPin className="w-12 h-12 text-ink-muted mx-auto mb-3" />
          <h3 className="font-sans font-semibold text-ink mb-1">No saved addresses yet</h3>
          <p className="text-body2 text-ink-muted mb-4">
            Place your first order and the shipping address you enter will appear here.
          </p>
          <Link
            to="/offers"
            className="inline-flex items-center rounded-pill bg-ink text-white font-bold px-6 py-3 text-body2 hover:bg-ink/90 transition-colors no-underline"
            style={{ gap: '8px' }}
          >
            Start Shopping
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: '16px' }}>
            {addresses.map((entry) => {
              const sa = entry.address;
              return (
                <div
                  key={`${sa.street}-${sa.city}`}
                  className="rounded-card-sm border border-line-strong bg-white p-5 flex flex-col"
                  style={{ gap: '12px' }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center" style={{ gap: '8px' }}>
                      <div className="rounded-card-sm bg-primary-light w-9 h-9 flex items-center justify-center">
                        <MapPin className="w-4 h-4 text-brand" />
                      </div>
                      <span className="text-body1 font-semibold text-ink">{sa.city}</span>
                    </div>
                  </div>

                  <div className="text-body2 text-ink flex flex-col" style={{ gap: '2px' }}>
                    <span className="font-medium">{sa.fullName}</span>
                    <span className="text-ink-secondary">{sa.street}</span>
                    <span className="text-ink-muted">
                      {[sa.city, sa.state, sa.postalCode].filter(Boolean).join(', ')}
                    </span>
                    <span className="text-ink-muted">{sa.country}</span>
                    <span className="text-ink-muted mt-2">Phone: {sa.phone}</span>
                  </div>

                  <div className="text-body3 text-ink-muted mt-2 border-t border-line pt-2">
                    Last used {formatDateTime(entry.lastUsed)}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="rounded-card-sm border border-line-strong bg-primary-light/30 p-4 text-body2 text-ink-secondary text-center">
            To use a new address, just enter it during checkout — it'll appear here after your order is placed.
          </div>
        </>
      )}
    </div>
  );
}