import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ShoppingCart, Heart, Star } from 'lucide-react';
import { bundles, getBundleBySlug } from '../data/bundles';
import { Button } from '@/shared/ui';
import { formatCurrency } from '@shared/lib/utils';

export function BundleDetailPage() {
  const { bundleSlug } = useParams();
  const bundle = bundleSlug ? getBundleBySlug(bundleSlug) : undefined;
  const [quantity, setQuantity] = useState(1);

  if (!bundle) {
    return (
      <div className="max-w-[1280px] mx-auto px-6 lg:px-20 py-16 text-center">
        <h1 className="text-h5 font-semibold text-ink">Bundle not found</h1>
        <Link to="/bundles" className="mt-6 inline-block text-body1 font-bold text-brand hover:underline">Back to bundles →</Link>
      </div>
    );
  }

  const relatedBundles = bundles.filter((b) => b.slug !== bundle.slug).slice(0, 4);
  const badgeColors: Record<string, string> = { gold: 'bg-gold', danger: 'bg-danger-dark', ink: 'bg-ink' };

  return (
    <div className="mx-auto w-full max-w-[1280px] px-6 lg:px-20 py-10 flex flex-col" style={{ gap: '40px' }}>
      <nav className="flex items-center gap-2 text-body1" aria-label="Breadcrumb">
        <Link to="/" className="text-ink-secondary hover:text-ink">Home</Link>
        <span className="text-ink-muted">/</span>
        <Link to="/bundles" className="text-ink-secondary hover:text-ink">Bundles</Link>
        <span className="text-ink-muted">/</span>
        <span className="text-ink font-medium">{bundle.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2" style={{ gap: '48px' }}>
        <div className="flex flex-col" style={{ gap: '16px' }}>
          <div className="bg-white rounded-card-sm border border-primary-light overflow-hidden relative flex items-center justify-center" style={{ aspectRatio: '1 / 1', minHeight: '400px' }}>
            <img src={bundle.image} alt={bundle.name} className="object-contain" style={{ maxWidth: '100%', maxHeight: '100%', width: '70%', height: '70%', filter: 'drop-shadow(0px 8px 24px rgba(102, 102, 102, 0.16))' }} />
            {bundle.badge && (
              <span className={`absolute top-3 left-3 ${badgeColors[bundle.badgeColor]} rounded-pill flex items-center justify-center`} style={{ padding: '4px 12px', height: '24px' }}>
                <span className="font-medium text-body3 text-white">{bundle.badge}</span>
              </span>
            )}
            {bundle.countdown && (
              <span className="absolute top-3 right-3 bg-ink rounded-pill flex items-center justify-center" style={{ padding: '4px 12px', height: '24px' }}>
                <span className="font-medium text-body3 text-white">Ends in: {bundle.countdown}</span>
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-col" style={{ gap: '24px' }}>
          <div className="flex justify-end">
            <button type="button" disabled aria-label="Add to wishlist" title="Wishlist coming soon" className="w-6 h-6 flex items-center justify-center text-ink hover:text-brand transition-colors disabled:cursor-not-allowed disabled:opacity-60">
              <Heart className="w-6 h-6" />
            </button>
          </div>

          <h1 className="font-sans" style={{ fontSize: '32px', fontWeight: 500, color: '#6B6265', lineHeight: '38px', margin: 0 }}>{bundle.name}</h1>
          <div style={{ fontSize: '16px', color: '#8C7B81' }}>{bundle.category}</div>

          <div className="flex items-center" style={{ gap: '12px' }}>
            <div className="flex items-center" style={{ gap: '8px' }}>
              <Star className="w-5 h-5 fill-gold text-gold" />
              <span className="font-sans font-medium text-ink" style={{ fontSize: '20px' }}>{bundle.rating}</span>
            </div>
            <span style={{ fontSize: '18px', color: '#51424A' }}>· {bundle.productCount} products</span>
          </div>

          <div className="flex items-end" style={{ gap: '4px' }}>
            <span className="font-sans font-bold" style={{ fontSize: '32px', color: '#000' }}>{formatCurrency(bundle.price)}</span>
            <span className="text-body3 text-ink-muted line-through" style={{ marginBottom: '4px' }}>{formatCurrency(bundle.originalPrice)}</span>
          </div>

          <div className="flex items-center" style={{ gap: '16px' }}>
            <div className="flex items-center rounded-pill border border-line-strong bg-white" style={{ padding: '4px' }}>
              <button type="button" onClick={() => setQuantity(Math.max(1, quantity - 1))} disabled={quantity <= 1} className="flex items-center justify-center text-ink hover:text-brand transition-colors disabled:cursor-not-allowed disabled:opacity-50" style={{ width: '32px', height: '32px' }}>
                <span style={{ fontSize: '20px' }}>−</span>
              </button>
              <span className="font-sans font-medium text-ink" style={{ minWidth: '40px', textAlign: 'center', fontSize: '16px' }}>{quantity}</span>
              <button type="button" onClick={() => setQuantity(quantity + 1)} className="flex items-center justify-center text-ink hover:text-brand transition-colors" style={{ width: '32px', height: '32px' }}>
                <span style={{ fontSize: '20px' }}>+</span>
              </button>
            </div>
          </div>

          <Button type="button" variant="primary" fullWidth disabled title="Bundle cart flow coming soon">
            <ShoppingCart className="w-5 h-5" />
            Add to Cart
          </Button>
          <p className="text-body3 text-ink-muted text-center">Bundle purchases are not yet available. Add individual products to cart instead.</p>
        </div>
      </div>

      <section className="flex flex-col" style={{ gap: '16px' }}>
        <h2 className="font-sans font-bold text-ink" style={{ fontSize: '24px', lineHeight: '30px' }}>Bundle Description</h2>
        <p className="text-body1 text-ink-secondary" style={{ lineHeight: '28px', whiteSpace: 'pre-wrap' }}>{bundle.description}</p>
      </section>

      <section className="flex flex-col" style={{ gap: '32px' }}>
        <h2 className="font-sans" style={{ fontSize: '32px', fontWeight: 600, color: '#6B6265', lineHeight: '38px' }}>Related Bundles</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4" style={{ gap: '24px' }}>
          {relatedBundles.map((rb) => (
            <Link key={rb.slug} to={`/bundles/${rb.slug}`} className="rounded-card-sm bg-surface border border-primary-light flex flex-col cursor-pointer" style={{ padding: '0 0 24px', gap: '24px' }}>
              <div className="relative bg-primary-light rounded-t-card-sm overflow-hidden" style={{ aspectRatio: '1 / 1', minHeight: '150px' }}>
                <img src={rb.image} alt={rb.name} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 object-contain" style={{ width: '70%', height: '70%' }} />
              </div>
              <div className="flex flex-col" style={{ gap: '4px', padding: '0 16px' }}>
                <div className="text-body2 text-secondary-400">{rb.category}</div>
                <div className="text-body1 text-secondary-800 line-clamp-2">{rb.name}</div>
                <span className="text-body2 font-semibold text-ink">{formatCurrency(rb.price)}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}