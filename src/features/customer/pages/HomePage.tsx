import type { ReactNode } from 'react';
import { Button } from '@/shared/ui';
import { useProducts } from '@shared/hooks/useProducts';
import { useCategories } from '@shared/hooks/useCategories';
import { ProductCard } from '../components/ProductCard';
import { CategoryCard } from '../components/CategoryCard';
import { SkeletonCard } from '../components/SkeletonCard';
import { DecorImage } from '../components/Decorimage';
import type { Category, Product } from '@shared/types';

const contentWidth = 'mx-auto w-full max-w-[1440px] px-20';
const canvas = 'absolute left-1/2 top-0 h-full w-[1440px] -translate-x-1/2';

export function HomePage() {
  const categories = useCategories({ limit: 3 });
  const newProducts = useProducts({ sort: 'newest', limit: 8 });
  const bestValue = useProducts({ sort: 'price_asc', limit: 8 });

  return (
    <div className="flex flex-col gap-20 pb-20">
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
      <BestValueSection
        products={bestValue.data?.products ?? []}
        isLoading={bestValue.isLoading}
      />
    </div>
  );
}

function HeroSection() {
  return (
    <section className="relative h-[610px] w-full overflow-hidden bg-primary-light">
      <div className={canvas}>
        <DecorImage
          src="/images/home/hero-left.png"
          className="absolute left-[521px] top-px h-[609px] w-[532px] object-contain"
        />
        <DecorImage
          src="/images/home/hero-right.png"
          className="absolute left-[1070px] top-px h-[608px] w-[559px] object-contain"
        />
        <div className="relative z-10 mx-auto flex w-[679px] flex-col items-center pt-36 text-center">
          <h1 className="text-title font-semibold text-brand">Beauty Starts With You.</h1>
          <p className="mt-4 w-[628px] text-h5 text-ink-secondary">
            Premium skincare and makeup essentials, curated for your every day beauty ritual
          </p>
          <Button type="button" disabled title="Coming soon" className="mt-12 h-14 w-[542px]">
            Shop Now
          </Button>
        </div>
      </div>
    </section>
  );
}

function BlackFridayPromo() {
  return (
    <section className="relative h-[479px] w-full overflow-hidden bg-ink">
      <div className={canvas}>
        <DecorImage
          src="/images/home/promo-left.png"
          className="absolute left-0 top-0 h-[479px] w-[484px] object-contain"
        />
        <div className="absolute left-[527px] top-1/2 flex w-[385px] -translate-y-1/2 flex-col">
          <h2 className="text-title font-semibold text-white">Black Friday Sale Up to 40% off</h2>
          <p className="mt-4 text-body1 text-white/80">
            Discover exclusive beauty deals made for your everyday glow
          </p>
          <Button type="button" variant="outline" disabled title="Coming soon" className="mt-12 h-14 w-full">
            Shop Now
          </Button>
        </div>
        <DecorImage
          src="/images/home/promo-right.png"
          className="absolute left-[955px] top-[31px] h-[416px] w-[408px] object-contain"
        />
      </div>
    </section>
  );
}

function ShopByCategorySection({ categories, isLoading }: { categories: Category[]; isLoading: boolean }) {
  const [first, second, third] = categories;

  return (
    <section className={contentWidth}>
      <SectionTitle>Shop by Category</SectionTitle>
      {isLoading ? (
        <div className="grid grid-cols-2 gap-6">
          <div className="h-[298px] animate-pulse rounded-card bg-line" />
          <div className="h-[298px] animate-pulse rounded-card bg-line" />
          <div className="col-span-2 h-[298px] animate-pulse rounded-card bg-line" />
        </div>
      ) : categories.length === 0 ? (
        <EmptyState message="No categories yet — check back soon." />
      ) : (
        <div className="grid grid-cols-2 gap-6">
          {first && <CategoryCard category={first} />}
          {second && <CategoryCard category={second} />}
          {third && <CategoryCard category={third} wide className="col-span-2" />}
        </div>
      )}
    </section>
  );
}

function NewAndNoteworthySection({ products, isLoading }: { products: Product[]; isLoading: boolean }) {
  return (
    <section className={contentWidth}>
      <SectionTitle>New &amp; Noteworthy</SectionTitle>
      <ProductGrid products={products} isLoading={isLoading} skeletons={8} />
      <ViewAllButton />
    </section>
  );
}

function BundleAndSaveSection() {
  return (
    <section className={contentWidth}>
      <SectionTitle>Bundle &amp; Save</SectionTitle>
      <EmptyState message="Curated bundles coming soon." />
    </section>
  );
}

function BrandPromosSection() {
  return (
    <section className={contentWidth}>
      <SectionTitle>Brands We Love</SectionTitle>
      <EmptyState message="Brand directory coming soon." />
    </section>
  );
}

function BestValueSection({ products, isLoading }: { products: Product[]; isLoading: boolean }) {
  return (
    <section className={contentWidth}>
      <SectionTitle>Best Value</SectionTitle>
      <ProductGrid products={products} isLoading={isLoading} skeletons={8} />
      <ViewAllButton />
    </section>
  );
}

function ProductGrid({
  products,
  isLoading,
  skeletons,
}: {
  products: Product[];
  isLoading: boolean;
  skeletons: number;
}) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-4 gap-6">
        {Array.from({ length: skeletons }, (_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return <EmptyState message="No products yet — check back soon." />;
  }

  return (
    <div className="grid grid-cols-4 gap-6">
      {products.map((p) => (
        <ProductCard key={p._id} product={p} />
      ))}
    </div>
  );
}

function ViewAllButton() {
  return (
    <Button type="button" variant="outline" disabled title="Coming soon" className="mx-auto mt-10 h-14 w-[385px]">
      View All
    </Button>
  );
}

function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <div className="mb-10 flex flex-col items-center gap-2.5">
      <h2 className="text-title font-semibold text-ink">{children}</h2>
      <span className="h-0.5 w-[93px] bg-primary" />
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