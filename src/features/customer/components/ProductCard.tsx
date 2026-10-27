import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, ShoppingCart } from 'lucide-react';
import type { Product } from '@shared/types';
import { formatCurrency } from '@shared/lib/utils';
import { Button, useToast } from '@/shared/ui';
import { useAuth } from '@/shared/lib/useAuth';
import { useAddToCart } from '@shared/hooks/useAddToCart';
import { useAddToWishlist } from '@shared/hooks/useAddToWishlist';

// "New" badge is data-driven: shows if the product was created within the last 7 days.
// Honest per Rule 5 — doesn't fake a "New" status.
const NEW_PRODUCT_MS = 7 * 24 * 60 * 60 * 1000;

function isNewProduct(createdAt: string): boolean {
  const created = new Date(createdAt).getTime();
  if (Number.isNaN(created)) return false;
  return Date.now() - created < NEW_PRODUCT_MS;
}

export function ProductCard({ product }: { product: Product }) {
  const [imageError, setImageError] = useState(false);
  const toast = useToast();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const addToCart = useAddToCart();
  const addToWishlist = useAddToWishlist();

  const image = product.images[0];
  const showImage = image && !imageError;
  const showNewBadge = isNewProduct(product.createdAt);

  function handleAddToCart() {
    if (!isAuthenticated) {
      navigate('/sign-in');
      return;
    }
    addToCart.mutate(
      { productId: product._id, quantity: 1 },
      {
        onSuccess: () => toast.success('Added to cart'),
        onError: (err: unknown) => {
          const error = err as { message?: string };
          toast.error(error?.message ?? 'Failed to add to cart');
        },
      }
    );
  }

  function handleAddToWishlist() {
    if (!isAuthenticated) {
      navigate('/sign-in');
      return;
    }
    addToWishlist.mutate(
      { productId: product._id },
      {
        onSuccess: () => toast.success('Added to wishlist'),
        onError: (err: unknown) => {
          const error = err as { message?: string };
          toast.error(error?.message ?? 'Failed to add to wishlist');
        },
      }
    );
  }

  return (
    <div className="rounded-card border border-line bg-white overflow-hidden flex flex-col">
      <div className="relative aspect-square bg-surface">
        {showImage ? (
          <img
            src={image}
            alt={product.name}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-1 text-ink-muted">
            <div className="text-h6 font-semibold">No image</div>
            <div className="text-body2">Upload via admin</div>
          </div>
        )}
        {showNewBadge && (
          <span className="absolute top-3 left-3 bg-brand text-white text-xs font-bold uppercase tracking-wider px-2 py-1 rounded-pill">
            New
          </span>
        )}
        <button
          type="button"
          onClick={handleAddToWishlist}
          disabled={addToWishlist.isPending}
          aria-label="Add to wishlist"
          className="absolute top-3 right-3 w-9 h-9 rounded-pill bg-white/90 shadow-brand-sm flex items-center justify-center text-ink-secondary hover:text-brand disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Heart className="w-4 h-4" />
        </button>
      </div>
      <div className="p-4 flex flex-col gap-1 flex-1">
        <div className="text-body2 text-ink-muted">{product.seller.name}</div>
        <div className="text-body1 font-semibold text-ink line-clamp-2">{product.name}</div>
        <div className="mt-1 text-body1 font-bold text-brand">{formatCurrency(product.price)}</div>
      </div>
      <div className="px-4 pb-4">
        <Button
          type="button"
          fullWidth
          variant="primary"
          onClick={handleAddToCart}
          loading={addToCart.isPending}
        >
          <ShoppingCart className="w-4 h-4" />
          Add to cart
        </Button>
      </div>
    </div>
  );
}
