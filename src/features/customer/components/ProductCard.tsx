import { useState } from 'react';
import { Heart, ShoppingCart } from 'lucide-react';
import type { Product } from '@shared/types';
import { formatCurrency } from '@shared/lib/utils';
import { Button } from '@/shared/ui';

// Card is non-clickable for now (product details page comes in script 11).
// When that ships, wrap the image area in <Link to={'/products/' + product._id}>.
// Heart + Add-to-cart buttons are visual-only (disabled) per Rule #4 — wishlist
// page comes in 08, cart page in 12.
export function ProductCard({ product }: { product: Product }) {
  const [imageError, setImageError] = useState(false);
  const image = product.images[0];
  const showImage = image && !imageError;

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
        <button
          type="button"
          disabled
          aria-label="Add to wishlist"
          title="Wishlist page coming soon"
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
        <Button type="button" disabled fullWidth variant="primary">
          <ShoppingCart className="w-4 h-4" />
          Add to cart
        </Button>
      </div>
    </div>
  );
}
