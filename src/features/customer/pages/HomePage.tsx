import { Button } from '@/shared/ui';
import { useProducts } from '@shared/hooks/useProducts';
import { useCategories } from '@shared/hooks/useCategories';
import { ProductCard } from '../components/ProductCard';
import { CategoryCard } from '../components/CategoryCard';
import { SkeletonCard } from '../components/SkeletonCard';
import { formatCurrency } from '@shared/lib/utils';
import { ShoppingCart } from 'lucide-react';
import type { Category, Product } from '@shared/types';

export function HomePage() {
  const categories = useCategories({ limit: 6 });
  const newProducts = useProducts({ sort: 'newest', limit: 8 });
  const bestDeals = useProducts({ sort: 'price_asc', limit: 4 });

  return (
    <div className="space-y-16">
      <HeroSection />
      <BlackFridayPromo />
      <ShopByCategorySection
        categories={categories.data?.categories ?? []}
        isLoading={categories.isLoading}
      />
      <NewAndNoteworthySection
        products={newProducts.data?.products ?? []}
        isLoading={newProducts.isLoading}
      />
      <BundleAndSaveSection />
      <BrandPromosSection />
      <BestDealsSection
        products={bestDeals.data?.products ?? []}
        isLoading={bestDeals.isLoading}
      />
    </div>
  );
}

// === Section 1: Hero — flex layout, images on both sides ===
function HeroSection() {
  return (
    <section className="rounded-card bg-primary-light overflow-hidden">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 px-6 py-12 lg:py-20">
        <img
          src="/images/home/hero-left.png"
          alt=""
          className="hidden lg:block w-1/4 max-h-96 object-contain"
        />
        <div className="flex-1 text-center">
          <h1 className="text-title font-semibold text-brand">Beauty Starts With You.</h1>
          <p className="mt-4 text-body1 text-ink-secondary">
            Premium skincare and makeup essentials, curated for your every day beauty ritual.
          </p>
          <Button type="button" className="mt-6">Shop Now</Button>
        </div>
        <img
          src="/images/home/hero-right.png"
          alt=""
          className="hidden lg:block w-1/4 max-h-96 object-contain"
        />
      </div>
    </section>
  );
}

// === Section 2: Black Friday promo — WHITE bg per Figma (was black) ===
function BlackFridayPromo() {
  return (
    <section className="rounded-card bg-white border border-line overflow-hidden">
      <div className="flex items-center justify-between gap-4 px-6 py-10 lg:py-14">
        <img
          src="/images/home/promo-left.png"
          alt=""
          className="hidden lg:block w-1/4 max-h-80 object-contain"
        />
        <div className="flex-1 text-center">
          <div className="text-body2 font-bold uppercase tracking-widest text-brand">
            Limited time
          </div>
          <div className="mt-2 text-h5 font-semibold text-ink">
            Black Friday Sale — Up to 40% off
          </div>
          <div className="mt-1 text-body2 text-ink-secondary">
            Discover exclusive beauty deals made for your everyday glow.
          </div>
        </div>
        <img
          src="/images/home/promo-right.png"
          alt=""
          className="hidden lg:block w-1/4 max-h-80 object-contain"
        />
      </div>
    </section>
  );
}

// === Section 3: Shop by Category (real data from /categories) ===
function ShopByCategorySection({ categories, isLoading }: { categories: Category[]; isLoading: boolean }) {
  return (
    <section className="space-y-6">
      <SectionHeader title="Shop by Category" />
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[0, 1, 2].map((i) => <SkeletonCard key={i} />)}
        </div>
      ) : categories.length === 0 ? (
        <EmptyState message="No categories yet — create them via admin to see this section." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((c) => <CategoryCard key={c._id} category={c} />)}
        </div>
      )}
    </section>
  );
}

// === Section 4: New & Noteworthy (real data from /products?sort=newest) ===
function NewAndNoteworthySection({ products, isLoading }: { products: Product[]; isLoading: boolean }) {
  return (
    <section className="space-y-6">
      <SectionHeader title="New & Noteworthy" />
      {isLoading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => <SkeletonCard key={i} />)}
        </div>
      ) : products.length === 0 ? (
        <EmptyState message="No products yet — sellers need to list products." />
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((p) => <ProductCard key={p._id} product={p} />)}
        </div>
      )}
    </section>
  );
}

// === Section 5: Bundle & Save — STATIC (per user override of Rule 3) ===
// No /bundles endpoint (Rule 7). User chose static decoration over empty state.
const bundleCards = [
  { name: 'Glow Essential Bundle', subtitle: 'Daily care for healthy skin', price: 200, originalPrice: 250, badge: 'Best Seller', productCount: 3, rating: 4.5 },
  { name: 'Glow Essential Bundle', subtitle: 'Daily care for healthy skin', price: 200, originalPrice: 250, badge: 'New', productCount: 3, rating: 4.5 },
  { name: 'Glow Essential Bundle', subtitle: 'Daily care for healthy skin', price: 200, originalPrice: 250, badge: 'Save 20%', productCount: 3, rating: 4.5, countdown: '15:34:21' },
  { name: 'Glow Essential Bundle', subtitle: 'Daily care for healthy skin', price: 200, originalPrice: 250, badge: 'Save 20%', productCount: 3, rating: 4.5, countdown: '15:34:21' },
];

function BundleAndSaveSection() {
  return (
    <section className="space-y-6">
      <SectionHeader title="Bundle & Save" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {bundleCards.map((b, i) => <StaticBundleCard key={i} bundle={b} />)}
      </div>
    </section>
  );
}

// === Section 6: Brand Promos — STATIC (per user override of Rule 3) ===
const brandPromos = [
  { name: 'COSRX', discount: '50%' },
  { name: 'Charlotte Tilbury', discount: '50%' },
  { name: 'Anua', discount: '20%' },
  { name: 'Charlotte Tilbury', discount: '45%' },
  { name: 'elf', discount: '10%' },
];

function BrandPromosSection() {
  return (
    <section className="space-y-6">
      <SectionHeader title="Brands We Love" />
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {brandPromos.map((b, i) => (
          <div
            key={i}
            className="rounded-card bg-primary-light p-6 flex flex-col items-center justify-center gap-2 aspect-square"
          >
            <div className="text-h5 font-bold text-brand">{b.discount}</div>
            <div className="text-body2 text-ink-secondary text-center">{b.name}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

// === Section 7: Best Deals for You (real /products?sort=price_asc) ===
function BestDealsSection({ products, isLoading }: { products: Product[]; isLoading: boolean }) {
  return (
    <section className="space-y-6">
      <SectionHeader title="Best Deals for You" />
      {isLoading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {[0, 1, 2, 3].map((i) => <SkeletonCard key={i} />)}
        </div>
      ) : products.length === 0 ? (
        <EmptyState message="No products yet — check back soon." />
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((p) => <ProductCard key={p._id} product={p} />)}
        </div>
      )}
    </section>
  );
}

// === Static bundle card (used by Bundle & Save section) ===
function StaticBundleCard({ bundle }: { bundle: typeof bundleCards[number] }) {
  return (
    <div className="rounded-card border border-line bg-white overflow-hidden flex flex-col">
      <div className="relative aspect-square bg-primary-light">
        {bundle.badge && (
          <span className="absolute top-3 left-3 bg-danger text-white text-xs font-bold uppercase tracking-wider px-2 py-1 rounded-pill">
            {bundle.badge}
          </span>
        )}
        {bundle.countdown && (
          <span className="absolute top-3 right-3 bg-ink text-white text-xs font-bold px-2 py-1 rounded-pill">
            Ends in: {bundle.countdown}
          </span>
        )}
        <div className="absolute inset-0 flex items-center justify-center text-ink-muted text-body2">
          Static decoration
        </div>
      </div>
      <div className="p-4 flex flex-col gap-2 flex-1">
        <div className="text-body1 font-semibold text-ink">{bundle.name}</div>
        <div className="text-body2 text-ink-muted">{bundle.subtitle}</div>
        <div className="text-body2 text-ink-muted">
          {bundle.rating} ★ · {bundle.productCount} products
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-body1 font-bold text-brand">{formatCurrency(bundle.price)}</span>
          <span className="text-body2 text-ink-muted line-through">
            {formatCurrency(bundle.originalPrice)}
          </span>
        </div>
      </div>
      <div className="px-4 pb-4">
        <Button type="button" fullWidth variant="primary" disabled title="Bundle cart flow coming soon">
          <ShoppingCart className="w-4 h-4" />
          Add to cart
        </Button>
      </div>
    </div>
  );
}

// === Shared sub-components ===
function SectionHeader({ title }: { title: string }) {
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-h5 font-semibold text-ink">{title}</h2>
      <span
        className="text-body2 font-bold text-ink-muted cursor-not-allowed"
        aria-disabled="true"
        title="Catalog page coming soon"
      >
        View All →
      </span>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-card border border-dashed border-line-strong bg-white p-12 text-center text-body1 text-ink-muted">
      {message}
    </div>
  );
}
