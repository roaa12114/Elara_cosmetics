import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import {
  CheckCircle2,
  Truck,
  Package,
  Home,
  CreditCard,
  ArrowLeft,
  ShoppingCart,
} from 'lucide-react';
import { useOrderDetail } from '@shared/hooks/useOrderDetail';
import { useAddToCart } from '@shared/hooks/useAddToCart';
import { useToast } from '@/shared/ui';
import { useProducts } from '@shared/hooks/useProducts';
import { formatCurrency, formatDateTime } from '@shared/lib/utils';
import type { OrderStatus } from '@shared/types';
import { ProductCard } from '../../components/ProductCard';

const TIMELINE: { status: OrderStatus; label: string; icon: typeof Package }[] = [
  { status: 'pending', label: 'Order Placed', icon: CheckCircle2 },
  { status: 'processing', label: 'Processing', icon: Package },
  { status: 'shipped', label: 'Shipped', icon: Truck },
  { status: 'delivered', label: 'Delivered', icon: Home },
];

function statusIndex(status: OrderStatus): number {
  const idx = TIMELINE.findIndex((t) => t.status === status);
  if (idx >= 0) return idx;
  return -1;
}

export function OrderDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { data, isLoading } = useOrderDetail(id);
  const addToCart = useAddToCart();
  const [buyingAgain, setBuyingAgain] = useState(false);

  const related = useProducts({ sort: 'newest', limit: 4 });

  const order = data?.order;

  if (isLoading) {
    return (
      <div className="rounded-card-sm border border-line-strong bg-white p-8 animate-pulse">
        <div className="h-8 w-64 bg-line rounded mb-6" />
        <div className="h-32 bg-line rounded-card-sm mb-6" />
        <div className="h-48 bg-line rounded-card-sm" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="rounded-card-sm border border-line-strong bg-white p-8 text-center">
        <h2 className="font-sans font-bold text-ink mb-2">Order not found</h2>
        <p className="text-body2 text-ink-muted mb-4">This order may have been removed.</p>
        <Link to="/account/orders" className="text-brand hover:underline">← Back to My Orders</Link>
      </div>
    );
  }

  const currentStep = statusIndex(order.status);
  const isCancelled = order.status === 'cancelled';
  const isReturned = order.status === 'returned';

  async function handleBuyAgain() {
    if (!order) return;
    setBuyingAgain(true);
    try {
      for (const item of order.items) {
        await addToCart.mutateAsync({ productId: item.product, quantity: item.quantity });
      }
      toast.success(`Added ${order.items.length} item${order.items.length !== 1 ? 's' : ''} to cart`);
      navigate('/cart');
    } catch (err) {
      const error = err as { message?: string };
      toast.error(error?.message ?? 'Failed to add items to cart');
    } finally {
      setBuyingAgain(false);
    }
  }

  const address = order.shippingAddress;

  return (
    <div className="flex flex-col" style={{ gap: '24px' }}>
      <nav className="flex items-center gap-2 text-body2" aria-label="Breadcrumb">
        <Link to="/account/orders" className="text-ink-secondary hover:text-ink no-underline">My Orders</Link>
        <span className="text-ink-muted">/</span>
        <span className="text-ink font-medium">{order.orderNumber}</span>
      </nav>

      <Link to="/account/orders" className="inline-flex items-center text-body2 text-ink-secondary hover:text-ink no-underline" style={{ gap: '6px' }}>
        <ArrowLeft className="w-4 h-4" />
        Back to My Orders
      </Link>

      <div className="rounded-card-sm border border-line-strong bg-white p-6 flex items-start justify-between flex-wrap" style={{ gap: '16px' }}>
        <div>
          <h2 className="font-sans font-bold text-ink" style={{ fontSize: '24px' }}>
            Order {order.orderNumber}
          </h2>
          <p className="text-body2 text-ink-muted mt-1">
            Placed on {formatDateTime(order.createdAt)}
          </p>
        </div>
        <div className="flex flex-col items-end" style={{ gap: '8px' }}>
          <span className={`rounded-pill px-3 py-1 text-body2 font-medium capitalize ${
            isCancelled ? 'bg-danger/20 text-danger' :
            isReturned ? 'bg-line text-ink-muted' :
            'bg-success/20 text-success'
          }`}>
            {order.status}
          </span>
          {!isCancelled && !isReturned && (
            <button
              type="button"
              onClick={handleBuyAgain}
              disabled={buyingAgain}
              className="rounded-pill bg-ink text-white font-bold flex items-center justify-center hover:bg-ink/90 transition-colors disabled:cursor-not-allowed disabled:opacity-60"
              style={{ height: '40px', padding: '0 16px', gap: '8px' }}
            >
              <ShoppingCart className="w-4 h-4" />
              {buyingAgain ? 'Adding...' : 'Buy Again'}
            </button>
          )}
        </div>
      </div>

      {!isCancelled && !isReturned && (
        <section className="rounded-card-sm border border-line-strong bg-white p-6">
          <h3 className="font-sans font-semibold text-ink mb-6" style={{ fontSize: '18px' }}>Order Status</h3>
          <div className="flex items-center justify-between">
            {TIMELINE.map((step, i) => {
              const Icon = step.icon;
              const isComplete = i < currentStep;
              const isCurrent = i === currentStep;
              return (
                <div key={step.status} className="flex items-center flex-1 last:flex-none">
                  <div className="flex flex-col items-center" style={{ gap: '8px' }}>
                    <div className={`rounded-full w-10 h-10 flex items-center justify-center transition-colors ${
                      isComplete ? 'bg-success text-white' :
                      isCurrent ? 'bg-ink text-white' :
                      'bg-line text-ink-muted'
                    }`}>
                      {isComplete ? <CheckCircle2 className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                    </div>
                    <span className={`text-body3 font-medium ${isCurrent || isComplete ? 'text-ink' : 'text-ink-muted'}`}>
                      {step.label}
                    </span>
                  </div>
                  {i < TIMELINE.length - 1 && (
                    <div className={`flex-1 h-0.5 mx-2 ${i < currentStep ? 'bg-success' : 'bg-line'}`} />
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {isCancelled && (
        <div className="rounded-card-sm border border-danger/30 bg-danger/5 p-4 text-body2 text-danger">
          This order was cancelled.
        </div>
      )}
      {isReturned && (
        <div className="rounded-card-sm border border-line-strong bg-line/30 p-4 text-body2 text-ink-muted">
          This order was returned.
        </div>
      )}

      <section className="rounded-card-sm border border-line-strong bg-white p-6 flex flex-col" style={{ gap: '16px' }}>
        <h3 className="font-sans font-semibold text-ink" style={{ fontSize: '18px' }}>
          Items ({order.items.length})
        </h3>
        <div className="flex flex-col" style={{ gap: '12px' }}>
          {order.items.map((item) => (
            <div key={item.product} className="flex items-center py-3 border-b border-line last:border-0" style={{ gap: '16px' }}>
              <Link
                to={`/products/${item.product}`}
                className="shrink-0 rounded-card-sm overflow-hidden bg-primary-light flex items-center justify-center no-underline"
                style={{ width: '64px', height: '64px' }}
              >
                <Package className="w-8 h-8 text-brand" />
              </Link>
              <div className="flex-1 min-w-0">
                <Link to={`/products/${item.product}`} className="text-body1 font-medium text-ink hover:text-brand no-underline line-clamp-2">
                  {item.name}
                </Link>
                <div className="text-body3 text-ink-muted mt-1">
                  Qty: {item.quantity} · {formatCurrency(item.price)} each
                </div>
              </div>
              <div className="text-body1 font-bold text-ink shrink-0">
                {formatCurrency(item.price * item.quantity)}
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: '16px' }}>
        <section className="rounded-card-sm border border-line-strong bg-white p-6">
          <div className="flex items-center mb-4" style={{ gap: '8px' }}>
            <Home className="w-5 h-5 text-brand" />
            <h3 className="font-sans font-semibold text-ink" style={{ fontSize: '16px' }}>Shipping Address</h3>
          </div>
          <div className="text-body2 text-ink flex flex-col" style={{ gap: '2px' }}>
            <span className="font-medium">{address.fullName}</span>
            <span className="text-ink-secondary">{address.street}</span>
            <span className="text-ink-muted">
              {[address.city, address.state, address.postalCode].filter(Boolean).join(', ')
            }</span>
            <span className="text-ink-muted">{address.country}</span>
            <span className="text-ink-muted mt-2">Phone: {address.phone}</span>
          </div>
        </section>

        <section className="rounded-card-sm border border-line-strong bg-white p-6">
          <div className="flex items-center mb-4" style={{ gap: '8px' }}>
            <CreditCard className="w-5 h-5 text-brand" />
            <h3 className="font-sans font-semibold text-ink" style={{ fontSize: '16px' }}>Payment</h3>
          </div>
          <div className="flex flex-col" style={{ gap: '8px' }}>
            <div className="flex items-center justify-between">
              <span className="text-body2 text-ink-secondary">Total Amount</span>
              <span className="text-body1 font-bold text-ink">{formatCurrency(order.totalAmount)}</span>
            </div>
            <div className="text-body3 text-ink-muted mt-2">
              Paid via Stripe (this order's payment was processed securely).
            </div>
          </div>
        </section>
      </div>

      <section className="flex flex-col" style={{ gap: '24px' }}>
        <div className="flex flex-col items-center" style={{ gap: '12px' }}>
          <h2 className="font-serif font-bold text-center text-ink-secondary" style={{ fontSize: '28px' }}>
            You Might Also Like
          </h2>
          <div style={{ width: '80px', borderTop: '4px solid var(--color-ink)' }} />
        </div>
        {related.isLoading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4" style={{ gap: '24px' }}>
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="h-80 rounded-card-sm border border-line-strong animate-pulse bg-line" />
            ))}
          </div>
        ) : related.data?.products?.length ? (
          <div className="grid grid-cols-2 lg:grid-cols-4" style={{ gap: '24px' }}>
            {related.data.products.slice(0, 4).map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        ) : null}
      </section>
    </div>
  );
}