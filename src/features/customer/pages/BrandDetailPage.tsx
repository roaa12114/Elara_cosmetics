import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { brandsByCategorySlug, brandSlug } from '../data/brands';
import { useProducts } from '@shared/hooks/useProducts';
import { ProductCard } from '../components/ProductCard';
import { SkeletonCard } from '../components/SkeletonCard';
import { Button } from '@/shared/ui';
import type { Product, ProductsSort } from '@shared/types';

const SORT_OPTIONS: { value: ProductsSort; label: string }[] = [
  { value: 'newest', label: 'Newest' },
  { value: 'oldest', label: 'Oldest' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
];

// Dynamic filter pills per category
const CATEGORY_PILLS: Record<string, string[]> = {
  makeup: ['All Product', 'Skin', 'Eyes', 'Cheeks', 'Eyebrows', 'Lips', 'Brushes', 'Offers'],
  skincare: ['All Product', 'Face Care', 'Body Care', 'Men Care', 'Sun Care'],
  'korean-beauty': ['All Product', 'Skin', 'Sun', 'Offers'],
};

const CATEGORY_KEYWORDS: Record<string, Record<string, string[] | null>> = {
  makeup: {
    'All Product': null,
    'Skin': ['foundation', 'filter', 'primer', 'cream', 'cleanser', 'sunscreen', 'toner', 'serum', 'moisturizer', 'lotion', 'corrector', 'wash', 'water', 'gel', 'spf', 'repair'],
    'Eyes': ['mascara', 'eyeliner', 'eyeshadow', 'eye'],
    'Cheeks': ['blush', 'bronzer', 'contour', 'highlighter', 'skinfinish'],
    'Eyebrows': ['brow'],
    'Lips': ['lip', 'gloss', 'lipstick'],
    'Brushes': ['brush'],
    'Offers': null,
  },
  skincare: {
    'All Product': null,
    'Face Care': ['cream', 'cleanser', 'serum', 'wash', 'toner', 'moisturizer', 'lotion', 'gel', 'foam', 'water', 'corrector', 'repair', 'effaclar', 'toleriane', 'lipikar', 'aquaporin', 'dermatoclean', 'urea', 'pigment', 'hydro', 'niacinamide', 'ceramide', 'hyalu', 'retinal', 'hydrance', 'balancium'],
    'Body Care': ['body', 'hand'],
    'Men Care': ['men', 'shave'],
    'Sun Care': ['sun', 'spf', 'sunscreen', 'anthelios'],
    'Offers': null,
  },
  'korean-beauty': {
    'All Product': null,
    'Skin': ['cream', 'cleanser', 'serum', 'wash', 'toner', 'moisturizer', 'lotion', 'gel', 'foam', 'water', 'essence', 'mucin', 'niacinamide', 'ceramide', 'heartleaf', 'relief', 'glow', 'red bean', 'snail', 'bha', 'blackhead', 'balancium', 'apricot'],
    'Sun': ['sun', 'spf', 'sunscreen'],
    'Offers': null,
  },
};

export function BrandDetailPage() {
  const { categorySlug: slug, brandSlug: bSlug } = useParams();
  const entry = slug ? brandsByCategorySlug[slug] : undefined;
  const brand = entry?.brands.find((b) => brandSlug(b.name) === bSlug);

  const [sort, setSort] = useState<ProductsSort>('newest');
  const [page, setPage] = useState(1);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [activeFilter, setActiveFilter] = useState('All Product');

  // Dynamic pills + keywords based on category
  const filterPills = CATEGORY_PILLS[slug ?? 'makeup'] ?? CATEGORY_PILLS['makeup'];
  const filterKeywords = CATEGORY_KEYWORDS[slug ?? 'makeup'] ?? CATEGORY_KEYWORDS['makeup'];

  const { data, isLoading, isFetching } = useProducts({
    search: brand?.searchTerm,
    sort,
    page,
    limit: 20,
  });

  const resultCount = data?.total ?? 0;
  const hasNextPage = data?.hasNextPage ?? false;

  const filteredProducts = activeFilter === 'All Product'
    ? allProducts
    : activeFilter === 'Offers'
      ? allProducts.filter((p) => p.price < 100)
      : allProducts.filter((p) => {
          const keywords = filterKeywords[activeFilter];
          if (!keywords) return true;
          const nameLower = p.name.toLowerCase();
          return keywords.some((kw) => nameLower.includes(kw));
        });

  const displayCount = activeFilter === 'All Product' ? resultCount : filteredProducts.length;

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (!data) return;
    if (page === 1) {
      setAllProducts(data.products);
    } else {
      setAllProducts((prev) => {
        const existingIds = new Set(prev.map((p) => p._id));
        const newProducts = data.products.filter((p) => !existingIds.has(p._id));
        return [...prev, ...newProducts];
      });
    }
  }, [data, page]);
  /* eslint-enable react-hooks/set-state-in-effect */

  function handleSortChange(newSort: ProductsSort) {
    setSort(newSort);
    setPage(1);
    setAllProducts([]);
  }

  function handleViewMore() {
    setPage((p) => p + 1);
  }

  if (!entry || !brand) {
    return (
      <div className="max-w-[1280px] mx-auto px-6 lg:px-20 py-16 text-center">
        <h1 className="text-h5 font-semibold text-ink">Brand not found</h1>
        <Link to={slug ? `/brands/${slug}` : '/'} className="mt-6 inline-block text-body1 font-bold text-brand hover:underline">
          Back to brands →
        </Link>
      </div>
    );
  }

  const isFirstLoad = isLoading && page === 1;

  return (
    <div className="max-w-[1280px] mx-auto px-6 lg:px-20 py-10 flex flex-col" style={{ gap: '40px' }}>
      <nav className="flex items-center gap-2 text-body1" aria-label="Breadcrumb">
        <Link to="/" className="text-ink-secondary hover:text-ink">Home</Link>
        <span className="text-ink-muted">/</span>
        <span className="text-ink-secondary">Products</span>
        <span className="text-ink-muted">/</span>
        <Link to={`/brands/${slug}`} className="text-ink-secondary hover:text-ink">{entry.title}</Link>
        <span className="text-ink-muted">/</span>
        <span className="text-ink font-medium">{brand.name}</span>
      </nav>

      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center flex-wrap gap-2">
          {filterPills.map((pill) => (
            <button
              key={pill}
              type="button"
              onClick={() => setActiveFilter(pill)}
              className={
                activeFilter === pill
                  ? 'bg-ink text-white rounded-pill px-4 py-2 text-body2 font-medium'
                  : 'border border-ink text-ink-secondary rounded-pill px-4 py-2 text-body2 font-medium hover:border-brand hover:text-brand transition-colors'
              }
            >
              {pill}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4 shrink-0">
          <span className="text-h5 font-bold text-ink-secondary">{displayCount} Result{displayCount !== 1 ? 's' : ''}</span>
          <div className="relative">
            <select
              value={sort}
              onChange={(e) => handleSortChange(e.target.value as ProductsSort)}
              className="appearance-none border border-line rounded-card-sm bg-white pl-4 pr-10 py-2 text-body2 text-ink-secondary focus:border-brand focus:outline-none cursor-pointer"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-secondary pointer-events-none" />
          </div>
        </div>
      </div>

      <hr className="border-line" />

      {isFirstLoad ? (
        <div className="grid grid-cols-2 lg:grid-cols-4" style={{ gap: '24px' }}>
          {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => <SkeletonCard key={i} />)}
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="rounded-card border border-dashed border-line-strong bg-white p-12 text-center text-body1 text-ink-muted">
          No {brand.name} products yet.
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4" style={{ gap: '24px' }}>
            {filteredProducts.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
          {hasNextPage && (
            <div className="flex justify-center pt-8">
              <Button type="button" variant="outline" onClick={handleViewMore} loading={isFetching && page > 1}>
                View More
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}