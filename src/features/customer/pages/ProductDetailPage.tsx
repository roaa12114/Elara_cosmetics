import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Heart, ShoppingCart, Plus, Minus, Star } from 'lucide-react';
import { useProduct } from '@shared/hooks/useProduct';
import { useProducts } from '@shared/hooks/useProducts';
import { ProductCard } from '../components/ProductCard';
import { SkeletonCard } from '../components/SkeletonCard';
import { Button, useToast } from '@/shared/ui';
import { useAuth } from '@/shared/lib/useAuth';
import { useAddToCart } from '@shared/hooks/useAddToCart';
import { useAddToWishlist } from '@shared/hooks/useAddToWishlist';
import { formatCurrency } from '@shared/lib/utils';
import { api } from '@shared/lib/api-client';
import { categorySlug } from '../data/brands';
import type { Product } from '@shared/types';

const NEW_PRODUCT_MS = 7 * 24 * 60 * 60 * 1000;

function isNewProduct(createdAt: string): boolean {
  const created = new Date(createdAt).getTime();
  if (Number.isNaN(created)) return false;
  return Date.now() - created < NEW_PRODUCT_MS;
}

type Review = {
  reviewer?: { name?: string } | string | null;
  user?: { name?: string } | string | null;
  name?: string;
  rating?: number;
  comment?: string;
  text?: string;
  message?: string;
  createdAt?: string;
  date?: string;
};

function getReviewerName(review: Review): string {
  if (review.reviewer && typeof review.reviewer === 'object' && review.reviewer.name) return review.reviewer.name;
  if (typeof review.reviewer === 'string' && review.reviewer.trim()) return review.reviewer;
  if (review.user && typeof review.user === 'object' && review.user.name) return review.user.name;
  if (typeof review.user === 'string' && review.user.trim()) return review.user;
  if (review.name) return review.name;
  return 'Anonymous';
}

function getReviewText(review: Review): string {
  return review.comment ?? review.text ?? review.message ?? '';
}

function getReviewDate(review: Review): string {
  const raw = review.createdAt ?? review.date;
  if (!raw) return '';
  const d = new Date(raw);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function getReviewRating(review: Review): number {
  const r = typeof review.rating === 'number' ? review.rating : 0;
  return Math.max(0, Math.min(5, Math.round(r)));
}

function StarRow({ rating }: { rating: number }) {
  return (
    <div className="flex items-center" style={{ gap: '2px' }}>
      {[0, 1, 2, 3, 4].map((i) => (
        <Star key={i} className={`w-4 h-4 ${i < rating ? 'fill-gold text-gold' : 'text-line-strong'}`} />
      ))}
    </div>
  );
}

export function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { isAuthenticated } = useAuth();

  const { data, isLoading } = useProduct(id);
  const product = data?.product;

  const relatedQuery = useProducts({ limit: 100 });

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState<'black' | 'red'>('black');
  const [activeTab, setActiveTab] = useState<'Product Info' | 'How to Use' | 'Ingredients'>('Product Info');

  const addToCart = useAddToCart();
  const addToWishlist = useAddToWishlist();

  const reviewsQuery = useQuery({
    queryKey: ['product-reviews', id],
    queryFn: () => api.get<{ reviews?: Review[]; total?: number }>(`/products/${id}/reviews`),
    enabled: !!id,
  });
  const reviews: Review[] = Array.isArray(reviewsQuery.data?.reviews) ? reviewsQuery.data!.reviews : [];
  const reviewsLoading = reviewsQuery.isLoading;

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    setSelectedImageIndex(0);
    setImageErrors({});
    setQuantity(1);
  }, [product?._id]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const images = product?.images ?? [];
  const safeIndex = images.length === 0 ? 0 : Math.min(selectedImageIndex, images.length - 1);
  const visibleImage = images[safeIndex];
  const hasVisibleImage = !!visibleImage && !imageErrors[safeIndex];
  const showNewBadge = product ? isNewProduct(product.createdAt) : false;

  const maxQty = product?.stock ?? 0;
  const canIncrease = quantity < maxQty;
  const canDecrease = quantity > 1;

  function handleIncrease() { if (canIncrease) setQuantity((q) => q + 1); }
  function handleDecrease() { if (canDecrease) setQuantity((q) => q - 1); }

  function handleAddToCart() {
    if (!product) return;
    if (!isAuthenticated) { navigate('/sign-in'); return; }
    addToCart.mutate({ productId: product._id, quantity }, {
      onSuccess: () => toast.success('Added to cart'),
      onError: (err: unknown) => { const error = err as { message?: string }; toast.error(error?.message ?? 'Failed to add to cart'); },
    });
  }

  function handleAddToWishlist() {
    if (!product) return;
    if (!isAuthenticated) { navigate('/sign-in'); return; }
    addToWishlist.mutate({ productId: product._id }, {
      onSuccess: () => toast.success('Added to wishlist'),
      onError: (err: unknown) => { const error = err as { message?: string }; toast.error(error?.message ?? 'Failed to add to wishlist'); },
    });
  }

  const relatedProducts: Product[] = product
    ? (relatedQuery.data?.products ?? [])
        .filter((p) => p.category._id === product.category._id && p._id !== product._id)
        .slice(0, 4)
    : [];

  if (isLoading) {
    return (
      <div className="mx-auto w-full max-w-[1280px] px-6 lg:px-20 py-10 flex flex-col" style={{ gap: '40px' }}>
        <div className="grid grid-cols-1 lg:grid-cols-2" style={{ gap: '48px' }}>
          <SkeletonCard /><SkeletonCard />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-[1280px] mx-auto px-6 lg:px-20 py-16 text-center">
        <h1 className="text-h5 font-semibold text-ink">Product not found</h1>
        <Link to="/" className="mt-6 inline-block text-body1 font-bold text-brand hover:underline">Back to home →</Link>
      </div>
    );
  }

  const catSlug = categorySlug(product.category.name);

  return (
    <div className="mx-auto w-full max-w-[1280px] px-6 lg:px-20 py-10 flex flex-col" style={{ gap: '40px' }}>
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-body1" aria-label="Breadcrumb">
        <Link to="/" className="text-ink-secondary hover:text-ink">Home</Link>
        <span className="text-ink-muted">/</span>
        <span className="text-ink-secondary">Products</span>
        <span className="text-ink-muted">/</span>
        <Link to={`/brands/${catSlug}`} className="text-ink-secondary hover:text-ink">{product.category.name}</Link>
        <span className="text-ink-muted">/</span>
        <span className="text-ink font-medium">{product.name}</span>
      </nav>

      {/* 2-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2" style={{ gap: '48px' }}>
        {/* Left: image gallery */}
        <div className="flex flex-col" style={{ gap: '16px' }}>
          <div className="bg-white rounded-card-sm border border-primary-light overflow-hidden relative flex items-center justify-center" style={{ aspectRatio: '1 / 1', minHeight: '400px' }}>
            {hasVisibleImage ? (
              <img src={visibleImage} alt={product.name} className="object-contain" style={{ maxWidth: '100%', maxHeight: '100%', width: '80%', height: '80%', filter: 'drop-shadow(0px 8px 24px rgba(102, 102, 102, 0.16))' }} onError={() => setImageErrors((prev) => ({ ...prev, [safeIndex]: true }))} />
            ) : (
              <div className="flex flex-col items-center justify-center gap-1 text-ink-muted">
                <div className="text-h6 font-semibold">No image</div>
                <div className="text-body2">Upload via admin</div>
              </div>
            )}
          </div>
          {images.length > 0 && (
            <div className="flex items-center flex-wrap" style={{ gap: '12px' }}>
              {images.map((img, idx) => {
                const isErrored = imageErrors[idx];
                const isSelected = idx === safeIndex;
                return (
                  <button key={`${img}-${idx}`} type="button" onClick={() => setSelectedImageIndex(idx)} aria-label={`View image ${idx + 1}`} aria-pressed={isSelected}
                    className={`bg-white rounded-card-sm border overflow-hidden flex items-center justify-center transition-colors ${isSelected ? 'border-brand' : 'border-line hover:border-line-strong'}`}
                    style={{ width: '80px', height: '80px', padding: '4px' }}>
                    {isErrored ? <span className="text-body3 text-ink-muted">No img</span> : (
                      <img src={img} alt={`${product.name} ${idx + 1}`} className="object-contain" style={{ maxWidth: '100%', maxHeight: '100%' }} onError={() => setImageErrors((prev) => ({ ...prev, [idx]: true }))} />
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Right: product info */}
        <div className="flex flex-col" style={{ gap: '24px' }}>
          <div className="flex items-start justify-between" style={{ gap: '16px' }}>
            <div className="flex items-center" style={{ gap: '8px' }}>
              {showNewBadge && (
                <span className="bg-white rounded-pill flex items-center justify-center border border-primary-light" style={{ padding: '4px 12px', height: '24px' }}>
                  <span className="font-medium text-body3 text-brand">New</span>
                </span>
              )}
              {product.stock === 0 && (
                <span className="rounded-pill flex items-center justify-center" style={{ backgroundColor: '#D1C4C9', color: '#6B6265', padding: '4px 12px', height: '24px' }}>
                  <span className="font-medium text-body3" style={{ color: '#6B6265' }}>Out of Stock</span>
                </span>
              )}
            </div>
            <button type="button" onClick={handleAddToWishlist} disabled={addToWishlist.isPending} aria-label="Add to wishlist"
              className="w-6 h-6 flex items-center justify-center text-ink hover:text-brand transition-colors disabled:cursor-not-allowed disabled:opacity-60">
              <Heart className="w-6 h-6" />
            </button>
          </div>

          <h1 className="font-sans" style={{ fontSize: '32px', fontWeight: 500, color: '#6B6265', lineHeight: '38px', margin: 0 }}>{product.name}</h1>
          <div style={{ fontSize: '16px', color: '#8C7B81' }}>{product.category.name}</div>
          <div className="font-sans" style={{ fontSize: '24px', fontWeight: 500, color: '#51424A', lineHeight: '30px' }}>Size: 50ml</div>

          <div className="flex flex-col" style={{ gap: '12px' }}>
            <div className="font-sans" style={{ fontSize: '16px', color: '#8C7B81', letterSpacing: '0.05em' }}>BLUSH COLOR: Black Cherry</div>
            <div className="flex items-center" style={{ gap: '12px' }}>
              <button type="button" onClick={() => setSelectedColor('red')} aria-label="Black Cherry color" aria-pressed={selectedColor === 'red'} className="rounded-full transition-all"
                style={{ width: '32px', height: '32px', backgroundColor: '#55273E', border: selectedColor === 'red' ? '2px solid #98465c' : '2px solid transparent', cursor: 'pointer' }} />
              <button type="button" onClick={() => setSelectedColor('black')} aria-label="Black color" aria-pressed={selectedColor === 'black'} className="rounded-full transition-all"
                style={{ width: '32px', height: '32px', backgroundColor: '#1A1A1A', border: selectedColor === 'black' ? '2px solid #98465c' : '2px solid transparent', cursor: 'pointer' }} />
            </div>
          </div>

          <div className="font-sans" style={{ fontSize: '32px', fontWeight: 700, color: '#000000', lineHeight: '38px' }}>{formatCurrency(product.price)}</div>
          <div style={{ fontSize: '18px', color: '#51424A' }}>Current Stock: {product.stock}</div>

          <div className="flex items-center" style={{ gap: '16px' }}>
            <div className="flex items-center rounded-pill border border-line-strong bg-white" style={{ padding: '4px' }}>
              <button type="button" onClick={handleDecrease} disabled={!canDecrease} aria-label="Decrease quantity" className="flex items-center justify-center text-ink hover:text-brand transition-colors disabled:cursor-not-allowed disabled:opacity-50" style={{ width: '32px', height: '32px' }}>
                <Minus className="w-4 h-4" />
              </button>
              <span className="font-sans font-medium text-ink" style={{ minWidth: '40px', textAlign: 'center', fontSize: '16px' }}>{quantity}</span>
              <button type="button" onClick={handleIncrease} disabled={!canIncrease} aria-label="Increase quantity" className="flex items-center justify-center text-ink hover:text-brand transition-colors disabled:cursor-not-allowed disabled:opacity-50" style={{ width: '32px', height: '32px' }}>
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          <Button type="button" variant="primary" fullWidth onClick={handleAddToCart} loading={addToCart.isPending} disabled={product.stock === 0}>
            <ShoppingCart className="w-5 h-5" />
            Add to Cart
          </Button>
        </div>
      </div>

      {/* Description with 3 tabs */}
      <section className="flex flex-col" style={{ gap: '16px' }}>
        <div className="flex items-center gap-2">
          {(['Product Info', 'How to Use', 'Ingredients'] as const).map((tab) => (
            <button key={tab} type="button" onClick={() => setActiveTab(tab)}
              className={activeTab === tab ? 'bg-ink text-white rounded-pill px-6 py-2 text-body2 font-medium' : 'border border-ink text-ink-secondary rounded-pill px-6 py-2 text-body2 font-medium hover:border-brand hover:text-brand transition-colors'}>
              {tab}
            </button>
          ))}
        </div>
        <p className="text-body1 text-ink-secondary" style={{ lineHeight: '28px', whiteSpace: 'pre-wrap' }}>
          {activeTab === 'Product Info' ? (product.description || 'No description available.') : 'Information not available.'}
        </p>
      </section>

      {/* Reviews */}
      <section className="flex flex-col" style={{ gap: '16px' }}>
        <h2 className="font-sans font-bold text-ink" style={{ fontSize: '24px', lineHeight: '30px' }}>Reviews</h2>
        {reviewsLoading ? (
          <div className="text-body2 text-ink-muted">Loading reviews…</div>
        ) : reviews.length === 0 ? (
          <div className="rounded-card-sm border border-dashed border-line-strong bg-white p-8 text-center text-body1 text-ink-muted">No reviews yet</div>
        ) : (
          <ul className="flex flex-col" style={{ gap: '16px', listStyle: 'none', padding: 0, margin: 0 }}>
            {reviews.map((review, idx) => {
              const rating = getReviewRating(review);
              const name = getReviewerName(review);
              const text = getReviewText(review);
              const date = getReviewDate(review);
              return (
                <li key={idx} className="rounded-card-sm border border-line bg-white p-5 flex flex-col" style={{ gap: '8px' }}>
                  <div className="flex items-center justify-between" style={{ gap: '12px' }}>
                    <span className="font-semibold text-ink text-body1">{name}</span>
                    {date && <span className="text-body3 text-ink-muted">{date}</span>}
                  </div>
                  <StarRow rating={rating} />
                  {text && <p className="text-body2 text-ink-secondary" style={{ lineHeight: '24px' }}>{text}</p>}
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {/* Related products */}
      <section className="flex flex-col" style={{ gap: '32px' }}>
        <h2 className="font-sans" style={{ fontSize: '32px', fontWeight: 600, color: '#6B6265', lineHeight: '38px' }}>Related Products</h2>
        {relatedQuery.isLoading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4" style={{ gap: '24px' }}>
            {[0, 1, 2, 3].map((i) => <SkeletonCard key={i} />)}
          </div>
        ) : relatedProducts.length === 0 ? (
          <div className="rounded-card-sm border border-dashed border-line-strong bg-white p-12 text-center text-body1 text-ink-muted">No related products found.</div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4" style={{ gap: '24px' }}>
            {relatedProducts.map((p) => <ProductCard key={p._id} product={p} />)}
          </div>
        )}
      </section>
    </div>
  );
}