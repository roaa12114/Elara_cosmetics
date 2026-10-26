import { Button } from '@/shared/ui';
import { useProducts } from '@shared/hooks/useProducts';
import { useCategories } from '@shared/hooks/useCategories';
import { ProductCard } from '../components/ProductCard';
import { CategoryCard } from '../components/CategoryCard';
import { SkeletonCard } from '../components/SkeletonCard';
import type { Category, Product } from '@shared/types';

export function HomePage() {
  const categories = useCategories({ limit: 6 });
  const newProducts = useProducts({ sort: 'newest', limit: 8 });
  const bestValue = useProducts({ sort: 'price_asc', limit: 4 });

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
      <BestValueSection
        products={bestValue.data?.products ?? []}
        isLoading={bestValue.isLoading}
      />
      <BrandPromosSection />
    </div>
  );
}

function HeroSection() {
  return (
    <section className="rounded-card bg-primary-light p-12 lg:p-20 relative overflow-hidden">
      <div className="max-w-2xl relative z-10">
        <h1 className="text-title font-semibold text-brand">Beauty Starts With You.</h1>
        <p className="mt-4 text-body1 text-ink-secondary">
          Premium skincare and makeup essentials, curated for your every day beauty ritual.
        </p>
        <Button type="button" className="mt-6">Shop Now</Button>
      </div>
      {/* Hero image area — placeholder until real cosmetic product assets are available */}
      <div
        aria-label="Hero image placeholder"
        className="hidden lg:block absolute right-0 top-0 bottom-0 w-2/5 bg-gradient-to-br from-primary to-primary-light opacity-50"
      />
    </section>
  );
}

function BlackFridayPromo() {
  return (
    <section className="rounded-card bg-ink p-10 lg:p-14 text-center">
      <div className="text-body2 font-bold uppercase tracking-widest text-primary">Limited time</div>
      <div className="mt-2 text-h5 font-semibold text-white">Black Friday Sale — Up to 40% off</div>
      <div className="mt-1 text-body2 text-ink-muted">
        Static marketing banner — promos managed by admin via /admin/banners (no public read endpoint yet).
      </div>
    </section>
  );
}

function ShopByCategorySection({ categories, isLoading }: { categories: Category[]; isLoading: boolean }) {
  return (
    <section className="space-y-6">
      <SectionHeader title="Shop by Category" />
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[0, 1, 2].map((i) => <SkeletonCard key={i} />)}
        </div>
      ) : categories.length === 0 ? (
        <EmptyState message="No categories yet — check back soon." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((c) => <CategoryCard key={c._id} category={c} />)}
        </div>
      )}
    </section>
  );
}

function NewAndNoteworthySection({ products, isLoading }: { products: Product[]; isLoading: boolean }) {
  return (
    <section className="space-y-6">
      <SectionHeader title="New & Noteworthy" />
      {isLoading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => <SkeletonCard key={i} />)}
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

function BundleAndSaveSection() {
  return (
    <section className="space-y-6">
      <SectionHeader title="Bundle & Save" />
      <EmptyState message="Curated bundles coming soon." />
    </section>
  );
}

function BestValueSection({ products, isLoading }: { products: Product[]; isLoading: boolean }) {
  return (
    <section className="space-y-6">
      <SectionHeader title="Best Value" />
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

function BrandPromosSection() {
  return (
    <section className="space-y-6">
      <SectionHeader title="Brands We Love" />
      <EmptyState message="Brand directory coming soon." />
    </section>
  );
}

function SectionHeader({ title }: { title: string }) {
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-h5 font-semibold text-ink">{title}</h2>
      <span className="text-body2 font-bold text-ink-muted cursor-not-allowed" aria-disabled="true" title="Catalog page coming soon">
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
