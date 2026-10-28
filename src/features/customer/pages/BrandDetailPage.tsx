import { Link, useParams } from 'react-router-dom';
import { brandsByCategorySlug, brandSlug } from '../data/brands';

// Placeholder page — backend has no /brands endpoint yet, so we can't show real brand products.
// When the backend is extended with /brands endpoints + Product.brandId field, replace this
// page with a real one that fetches /products?brandId=X and renders a product grid.
export function BrandDetailPage() {
  const { categorySlug: slug, brandSlug: bSlug } = useParams();
  const entry = slug ? brandsByCategorySlug[slug] : undefined;
  const brand = entry?.brands.find((b) => brandSlug(b.name) === bSlug);

  if (!entry || !brand) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-16 text-center">
        <h1 className="text-h5 font-semibold text-ink">Brand not found</h1>
        <Link
          to={slug ? `/brands/${slug}` : '/'}
          className="mt-6 inline-block text-body1 font-bold text-brand hover:underline"
        >
          Back to brands →
        </Link>
      </div>
    );
  }

  return (
    <div
      className="max-w-7xl mx-auto px-6 py-16 flex flex-col items-center text-center"
      style={{ gap: '24px' }}
    >
      <img src={brand.logo} alt={brand.name} className="max-h-32 object-contain" />
      <h1 className="text-h5 font-semibold text-ink">{brand.name}</h1>
      <p className="text-body1 text-ink-secondary max-w-xl">
        The backend doesn't have a brands endpoint yet. When it's extended with{' '}
        <code className="bg-surface px-2 py-1 rounded-pill text-body2">/brands</code> and
        a <code className="bg-surface px-2 py-1 rounded-pill text-body2">brandId</code> field
        on products, this page will show {brand.name} products from {entry.title}.
      </p>
      <Link
        to={`/brands/${slug}`}
        className="mt-4 text-body1 font-bold text-brand hover:underline"
      >
        ← Back to {entry.title} brands
      </Link>
    </div>
  );
}