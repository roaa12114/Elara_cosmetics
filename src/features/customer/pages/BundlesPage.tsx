import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import { bundles } from '../data/bundles';
import type { Bundle } from '../data/bundles';
import { formatCurrency } from '@shared/lib/utils';

const FILTER_PILLS = ['All', 'Gift Bundle', 'Routine', 'Essentials'];

export function BundlesPage() {
  const [activeFilter, setActiveFilter] = useState('All');
  const filtered = activeFilter === 'All' ? bundles : bundles.filter((b) => b.type === activeFilter);

  return (
    <div className="max-w-[1280px] mx-auto px-6 lg:px-20 py-10 flex flex-col" style={{ gap: '40px' }}>
      <section className="rounded-card bg-primary-light p-12 lg:p-20 text-center">
        <h1 className="font-serif text-title font-semibold text-brand">Beauty Bundles For You</h1>
        <p className="mt-4 text-body1 text-ink-secondary">Curated Sets, better value.</p>
      </section>

      <nav className="flex items-center gap-2 text-body1" aria-label="Breadcrumb">
        <Link to="/" className="text-ink-secondary hover:text-ink">Home</Link>
        <span className="text-ink-muted">/</span>
        <span className="text-ink font-medium">Bundles</span>
      </nav>

      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center flex-wrap gap-2">
          {FILTER_PILLS.map((pill) => (
            <button key={pill} type="button" onClick={() => setActiveFilter(pill)}
              className={activeFilter === pill
                ? 'bg-ink text-white rounded-pill px-4 py-2 text-body2 font-medium'
                : 'border border-ink text-ink-secondary rounded-pill px-4 py-2 text-body2 font-medium hover:border-brand hover:text-brand transition-colors'}>
              {pill}
            </button>
          ))}
        </div>
        <span className="text-h5 font-bold text-ink-secondary">{filtered.length} Result{filtered.length !== 1 ? 's' : ''}</span>
      </div>

      <hr className="border-line" />

      <div className="grid grid-cols-2 lg:grid-cols-4" style={{ gap: '24px' }}>
        {filtered.map((bundle) => <BundleCard key={bundle.slug} bundle={bundle} />)}
      </div>
    </div>
  );
}

function BundleCard({ bundle }: { bundle: Bundle }) {
  const badgeColors: Record<string, string> = { gold: 'bg-gold', danger: 'bg-danger-dark', ink: 'bg-ink' };
  return (
    <Link to={`/bundles/${bundle.slug}`} className="rounded-card-sm bg-surface border border-primary-light flex flex-col cursor-pointer" style={{ padding: '0 0 24px', gap: '24px' }}>
      <div className="relative bg-primary-light rounded-t-card-sm overflow-hidden" style={{ aspectRatio: '1 / 1', minHeight: '200px' }}>
        <img src={bundle.image} alt={bundle.name} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 object-contain" style={{ width: '70%', height: '70%', filter: 'drop-shadow(0px 8px 24px rgba(102, 102, 102, 0.16))' }} />
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
      <div className="flex flex-col" style={{ gap: '8px', padding: '0 24px' }}>
        <div className="text-body2 text-secondary-400">{bundle.category}</div>
        <div className="text-body1 text-secondary-800 line-clamp-2">{bundle.name}</div>
        <div className="flex items-center gap-2">
          <Star className="w-4 h-4 fill-gold text-gold" />
          <span className="text-body3 text-ink">{bundle.rating}</span>
          <span className="text-body3 text-ink-muted">· {bundle.productCount} products</span>
        </div>
        <div className="flex items-end" style={{ gap: '4px' }}>
          <span className="text-body2 font-semibold text-ink">{formatCurrency(bundle.price)}</span>
          <span className="text-body3 text-ink-muted line-through" style={{ marginBottom: '2px' }}>{formatCurrency(bundle.originalPrice)}</span>
        </div>
      </div>
    </Link>
  );
}