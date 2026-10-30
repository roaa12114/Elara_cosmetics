import { Link } from "react-router-dom";
import { useProducts } from "@shared/hooks/useProducts";
import { useCategories } from "@shared/hooks/useCategories";
import { ProductCard } from "../components/ProductCard";
import { CategoryCard } from "../components/CategoryCard";
import { SkeletonCard } from "../components/SkeletonCard";
import { formatCurrency } from "@shared/lib/utils";
import { Heart, Plus, Star } from "lucide-react";
import type { Category, Product } from "@shared/types";
import { bundles } from "../data/bundles";

export function HomePage() {
  const categories = useCategories({ limit: 3 });
  const newProducts = useProducts({ sort: "newest", limit: 8 });
  const bestDeals = useProducts({ sort: "price_asc", limit: 4 });

  return (
    <div className="flex flex-col" style={{ gap: "80px" }}>
      <HeroSection />
      <BlackFridayPromo />
      <div
        className="mx-auto w-full max-w-[1440px] px-6 lg:px-20 flex flex-col"
        style={{ gap: "80px" }}
      >
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
    </div>
  );
}


function HeroSection() {
  return (
    <section
      className="relative w-full overflow-hidden"
      style={{
        height: "610px",
        background:
          "linear-gradient(180deg, rgba(255, 235, 240, 0.3) 0%, rgba(204, 98, 122, 0.1) 100%)",
      }}
    >
      <img
        src="/images/home/hero-left.png"
        alt=""
        className="absolute hidden lg:block object-contain"
        style={{ width: "532px", height: "609px", left: "-11px", top: "0.5px" }}
      />
      <img
        src="/images/home/hero-right.png"
        alt=""
        className="absolute hidden lg:block object-contain"
        style={{ width: "auto", height: "608px", right: "0", top: "1px" }}
      />
      <div
        className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center"
        style={{ top: "144px", gap: "48px", width: "679px" }}
      >
        <div
          className="flex flex-col items-center justify-center"
          style={{ gap: "16px", width: "100%" }}
        >
          <h1
            className="font-serif font-bold text-center text-ink"
            style={{ fontSize: "64px", lineHeight: "76px", width: "100%" }}
          >
            Beauty Starts With You.
          </h1>
          <p
            className="font-sans font-normal text-center text-ink-muted"
            style={{ fontSize: "32px", lineHeight: "45px", width: "628px" }}
          >
            Premium skincare and makeup essentials, curated for your every day
            beauty ritual.
          </p>
        </div>
        <ShopNowButton width="542px" to="/offers" />
      </div>
    </section>
  );
}


function BlackFridayPromo() {
  return (
    <section
      className="w-full flex items-center justify-center"
      style={{ gap: "43px", height: "479px" }}
    >
      <img
        src="/images/home/promo-left.png"
        alt=""
        className="hidden lg:block object-contain"
        style={{ width: "484px", height: "479px" }}
      />
      <div
        className="flex flex-col items-end"
        style={{ width: "385px", gap: "48px" }}
      >
        <div
          className="flex flex-col items-end"
          style={{ gap: "16px", width: "385px" }}
        >
          <h2
            className="font-sans font-bold text-center text-ink-secondary"
            style={{ fontSize: "40px", lineHeight: "48px", width: "385px" }}
          >
            Black Friday Sale Up to 40% off
          </h2>
          <p
            className="font-sans font-medium text-center text-ink-muted"
            style={{ fontSize: "24px", lineHeight: "30px", width: "360px" }}
          >
            Discover exclusive beauty deals made for your everday glow
          </p>
        </div>
        <ShopNowButton width="385px" to="/offers" />
      </div>
      <img
        src="/images/home/promo-right.png"
        alt=""
        className="hidden lg:block object-contain"
        style={{ width: "408px", height: "416px" }}
      />
    </section>
  );
}


function ShopNowButton({ width, to }: { width: string; to: string }) {
  return (
    <Link
      to={to}
      className="rounded-pill bg-ink text-white font-bold flex items-center justify-center transition-colors hover:bg-ink/90 no-underline"
      style={{ width, height: "56px", padding: "8px 16px", gap: "8px" }}
    >
      <span style={{ fontSize: "18px", lineHeight: "28px" }}>Shop Now</span>
    </Link>
  );
}


function ShopByCategorySection({
  categories,
  isLoading,
}: {
  categories: Category[];
  isLoading: boolean;
}) {
  return (
    <section
      className="flex flex-col items-center w-full"
      style={{ gap: "40px" }}
    >
      <SectionTitle title="Shop by Category" />
      {isLoading ? (
        <div
          className="w-full"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "24px",
          }}
        >
          {[0, 1].map((i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : categories.length === 0 ? (
        <EmptyState message="No categories yet — create them via admin to see this section." />
      ) : (
        <div className="w-full flex flex-col" style={{ gap: "24px" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${Math.min(categories.length, 2)}, 1fr)`,
              gap: "24px",
            }}
          >
            {categories.slice(0, 2).map((c) => (
              <CategoryCard key={c._id} category={c} />
            ))}
          </div>
          {categories.slice(2).map((c) => (
            <CategoryCard key={c._id} category={c} />
          ))}
        </div>
      )}
     </section>
  );
}


function NewAndNoteworthySection({
  products,
  isLoading,
}: {
  products: Product[];
  isLoading: boolean;
}) {
  return (
    <section
      className="flex flex-col items-center w-full"
      style={{ gap: "40px" }}
    >
      <SectionTitle title="New & Noteworthy" />
      {isLoading ? (
        <div
          className="w-full grid grid-cols-2 lg:grid-cols-4"
          style={{ gap: "24px" }}
        >
          {[0, 1, 2, 3].map((i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : products.length === 0 ? (
        <EmptyState message="No products yet — sellers need to list products." />
      ) : (
        <div
          className="w-full grid grid-cols-2 lg:grid-cols-4"
          style={{ gap: "24px" }}
        >
          {products.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      )}
       <ViewAllButton to="/offers" />
    </section>
  );
}


const bundleCards = bundles.slice(0, 4).map((b) => ({
  slug: b.slug,
  name: b.name,
  subtitle: b.description,
  price: b.price,
  originalPrice: b.originalPrice,
  badge: b.badge,
  badgeColor: (b.badgeColor === "ink" ? "gold" : b.badgeColor) as
    | "gold"
    | "danger",
}));

function BundleAndSaveSection() {
  return (
    <section
      className="flex flex-col items-center w-full"
      style={{ gap: "40px" }}
    >
      <SectionTitle title="Bundel & Save" />
      <div
        className="w-full grid grid-cols-2 lg:grid-cols-4"
        style={{ gap: "24px" }}
      >
        {bundleCards.map((b, i) => (
          <StaticBundleCard key={b.slug} bundle={b} index={i} />
        ))}
      </div>
      <ViewAllButton to="/bundles" />
    </section>
  );
}


const brandPromos = [
  { name: "COSRX", discount: "50%", image: "/images/home/brands/cosrx.png", to: "/brands/korean-beauty/cosrx" },
  { name: "Charlotte Tilbury", discount: "50%", image: "/images/home/brands/charlotte-tilbury.png", to: "/brands/makeup/charlotte-tilbury" },
  { name: "Anua", discount: "20%", image: "/images/home/brands/anua.png", to: "/brands/korean-beauty/anua" },
  { name: "Charlotte Tilbury", discount: "45%", image: "/images/home/brands/charlotte-tilbury-2.png", to: "/brands/makeup/charlotte-tilbury" },
  { name: "elf", discount: "10%", image: "/images/home/brands/elf.png", to: "/brands/makeup/e-l-f" },
];

function BrandPromosSection() {
  const topRow = brandPromos.slice(0, 2);
  const bottomRow = brandPromos.slice(2);
  return (
    <section
      className="flex flex-col items-center w-full"
      style={{ gap: "24px" }}
    >
      <div
        className="w-full grid grid-cols-1 lg:grid-cols-2"
        style={{ gap: "25px" }}
      >
        {topRow.map((b, i) => (
          <BrandPromoCard key={i} promo={b} />
        ))}
      </div>
      <div
        className="w-full grid grid-cols-1 md:grid-cols-3"
        style={{ gap: "24px" }}
      >
        {bottomRow.map((b, i) => (
          <BrandPromoCard key={i} promo={b} />
        ))}
      </div>
    </section>
  );
}


const bestDealDecorations = [
  { tag: "Fragrance", rating: 4.5, priceMultiplier: 2.5 },
  { tag: "Fragrance", rating: 4.5, priceMultiplier: 2.5 },
  { tag: "Fragrance", rating: 4.5, priceMultiplier: 2.5 },
  { tag: "Fragrance", rating: 4.5, priceMultiplier: 2.5 },
];

function BestDealsSection({
  products,
  isLoading,
}: {
  products: Product[];
  isLoading: boolean;
}) {
  return (
    <section
      className="flex flex-col items-center w-full"
      style={{ gap: "40px" }}
    >
      <SectionTitle title="Best Deals for You" />
      {isLoading ? (
        <div
          className="w-full grid grid-cols-2 lg:grid-cols-4"
          style={{ gap: "24px" }}
        >
          {[0, 1, 2, 3].map((i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : products.length === 0 ? (
        <EmptyState message="No products yet — check back soon." />
      ) : (
        <div
          className="w-full grid grid-cols-2 lg:grid-cols-4"
          style={{ gap: "24px" }}
        >
          {products.map((p, i) => {
            const deco = bestDealDecorations[i] ?? bestDealDecorations[0];
            return (
              <ProductCard
                key={p._id}
                product={p}
                rating={deco.rating}
                originalPrice={Math.round(p.price * deco.priceMultiplier)}
                tag={deco.tag}
              />
            );
          })}
        </div>
      )}
      <ViewAllButton to="/offers" />
    </section>
  );
}


type BundleCardData = {
  slug: string;
  name: string;
  subtitle: string;
  price: number;
  originalPrice?: number;
  badge?: string;
  badgeColor?: "gold" | "danger";
};

function StaticBundleCard({
  bundle,
  index,
}: {
  bundle: BundleCardData;
  index: number;
}) {
  const badgeBg =
    bundle.badgeColor === "gold"
      ? "bg-gold"
      : bundle.badgeColor === "danger"
        ? "bg-danger-dark"
        : "bg-white";
  const badgeText = bundle.badgeColor === "danger" ? "text-white" : "text-ink";

  return (
    <Link
      to={`/bundles/${bundle.slug}`}
      className="rounded-card-sm bg-surface border border-primary-light flex flex-col overflow-hidden no-underline transition-transform hover:scale-[1.02]"
      style={{ paddingBottom: "24px", gap: "24px" }}
    >
      <div
        className="relative bg-white flex items-center justify-center"
        style={{ height: "289px" }}
      >
        <img
          src={`/images/home/bundles/bundle-${index + 1}.png`}
          alt={bundle.name}
          className="max-w-full max-h-full object-contain"
          style={{
            width: "auto",
            height: "auto",
            maxHeight: "254px",
            maxWidth: "230px",
            filter: "drop-shadow(0px 8px 24px rgba(102, 102, 102, 0.16))",
          }}
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = "none";
          }}
        />
        {bundle.badge && (
          <div
            className="absolute top-0 left-0 right-0 flex justify-between items-start p-3"
            style={{ gap: "200px" }}
          >
            <span
              className={`${badgeBg} ${badgeText} rounded-pill flex items-center justify-center font-medium`}
              style={{ height: "24px", gap: "10px", padding: "4px 12px" }}
            >
              <span className="text-body3">{bundle.badge}</span>
            </span>
            <span
              aria-label="Add to wishlist"
              title="Wishlist coming soon"
              className="w-6 h-6 flex items-center justify-center text-ink cursor-not-allowed"
            >
              <Heart className="w-6 h-6" />
            </span>
          </div>
        )}
        {!bundle.badge && (
          <span
            aria-label="Add to wishlist"
            title="Wishlist coming soon"
            className="absolute top-3 right-3 w-6 h-6 flex items-center justify-center text-ink cursor-not-allowed"
          >
            <Heart className="w-6 h-6" />
          </span>
        )}
        <div
          className="absolute flex items-end"
          style={{ left: "12px", bottom: "12px" }}
        >
          <div
            className="bg-line rounded-pill flex items-center"
            style={{ width: "54px", height: "24px", padding: "4px", gap: "4px" }}
          >
            <Star className="w-4 h-4 fill-gold text-gold" />
            <span className="text-body3 text-ink">4.5</span>
          </div>
        </div>
      </div>
      <div className="flex flex-col" style={{ padding: "0 24px", gap: "16px" }}>
        <div className="flex flex-col" style={{ gap: "20px" }}>
          <div
            className="bg-primary-200 rounded-pill flex items-center justify-center self-start"
            style={{ width: "71px", height: "24px", padding: "8px", gap: "4px" }}
          >
            <span className="font-medium text-body3 text-ink-secondary">
              3 product
            </span>
          </div>
          <div className="flex flex-col" style={{ gap: "4px" }}>
            <div className="text-body1 text-secondary-800 line-clamp-1">
              {bundle.name}
            </div>
            <div className="text-body2 text-ink-muted line-clamp-1">
              {bundle.subtitle}
            </div>
          </div>
        </div>
        <div
          className="flex justify-between items-center"
          style={{ gap: "162px" }}
        >
          <div className="flex items-end" style={{ gap: "2px" }}>
            <span className="text-body2 font-semibold text-ink">
              {formatCurrency(bundle.price)}
            </span>
            {bundle.originalPrice && bundle.originalPrice > bundle.price && (
              <span
                className="text-body3 text-ink-muted line-through"
                style={{ marginLeft: "4px", marginBottom: "2px" }}
              >
                {formatCurrency(bundle.originalPrice)}
              </span>
            )}
          </div>
          <span
            aria-label="Add to cart"
            title="Bundle cart flow coming soon"
            className="rounded-pill bg-ink text-white flex items-center justify-center shrink-0 cursor-not-allowed opacity-70"
            style={{ width: "40px", height: "40px" }}
          >
            <Plus className="w-6 h-6" />
          </span>
        </div>
      </div>
    </Link>
  );
}


function BrandPromoCard({
  promo,
}: {
  promo: { name: string; discount: string; image: string; to?: string };
}) {
  if (promo.to) {
    return (
      <Link
        to={promo.to}
        className="rounded-card-sm overflow-hidden relative block no-underline transition-transform hover:scale-[1.02]"
        style={{ aspectRatio: "627 / 282" }}
      >
        <img
          src={promo.image}
          alt={promo.name}
          className="absolute inset-0 w-full h-full object-cover"
          style={{ objectPosition: "center center" }}
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = "none";
          }}
        />
      </Link>
    );
  }
  return (
    <div
      className="rounded-card-sm overflow-hidden relative cursor-not-allowed"
      style={{ aspectRatio: "627 / 282" }}
      title="Brand page coming soon"
    >
      <img
        src={promo.image}
        alt={promo.name}
        className="absolute inset-0 w-full h-full object-cover"
        style={{ objectPosition: "center center" }}
        onError={(e) => {
          (e.target as HTMLImageElement).style.display = "none";
        }}
      />
    </div>
  );
}


function SectionTitle({ title }: { title: string }) {
  return (
    <div className="flex flex-col items-center" style={{ gap: "12px" }}>
      <h2
        className="font-serif font-bold text-center text-ink-secondary"
        style={{ fontSize: "32px", lineHeight: "38px" }}
      >
        {title}
      </h2>
      <div style={{ width: "93px", borderTop: "5px solid var(--color-ink)" }} />
    </div>
  );
}


function ViewAllButton({
  to,
  disabled,
  label = "View All",
}: {
  to?: string;
  disabled?: boolean;
  label?: string;
}) {
  if (to) {
    return (
      <Link
        to={to}
        className="rounded-pill border border-ink font-bold flex items-center justify-center text-ink-secondary hover:bg-ink/5 transition-colors no-underline"
        style={{ width: "385px", height: "56px", padding: "8px 16px", gap: "8px" }}
      >
        <span style={{ fontSize: "18px", lineHeight: "28px" }}>{label}</span>
      </Link>
    );
  }
  return (
    <button
      type="button"
      disabled
      title={disabled ? "Coming soon" : undefined}
      className="rounded-pill border border-ink/40 font-bold flex items-center justify-center text-ink-muted/60 cursor-not-allowed"
      style={{ width: "385px", height: "56px", padding: "8px 16px", gap: "8px" }}
    >
      <span style={{ fontSize: "18px", lineHeight: "28px" }}>
        {disabled ? "Soon" : label}
      </span>
    </button>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-card-sm border border-dashed border-line-strong bg-white p-12 text-center text-body1 text-ink-muted">
      {message}
    </div>
  );
}