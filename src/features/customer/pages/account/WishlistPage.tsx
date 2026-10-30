import { Link } from 'react-router-dom';
import { Heart, Trash2, Plus } from 'lucide-react';
import { useWishlist } from '@shared/hooks/useWishlist';
import { useRemoveFromWishlist } from '@shared/hooks/useRemoveFromWishlist';
import { useAddToCart } from '@shared/hooks/useAddToCart';
import { useToast } from '@/shared/ui';
import { formatCurrency } from '@shared/lib/utils';
import type { WishlistItem } from '@shared/types';

export function WishlistPage() {
  const { data, isLoading } = useWishlist({ limit: 50 });
  const removeItem = useRemoveFromWishlist();
  const addToCart = useAddToCart();
  const toast = useToast();

  const items = data?.wishlist ?? [];

  async function handleAddToCart(item: WishlistItem) {
    try {
      await addToCart.mutateAsync({ productId: item._id, quantity: 1 });
      toast.success(`Added "${item.name}" to cart`);
    } catch (err) {
      const error = err as { message?: string };
      toast.error(error?.message ?? 'Failed to add to cart');
    }
  }

  function handleRemove(item: WishlistItem) {
    removeItem.mutate(
      { productId: item._id },
      {
        onSuccess: () => toast.show(`Removed "${item.name}" from wishlist`),
        onError: (err: unknown) => {
          const error = err as { message?: string };
          toast.error(error?.message ?? 'Failed to remove item');
        },
      },
    );
  }

  return (
    <div className="flex flex-col" style={{ gap: '24px' }}>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-sans font-bold text-ink" style={{ fontSize: '24px' }}>My Wishlist</h2>
          <p className="text-body2 text-ink-muted mt-1">
            {items.length} item{items.length !== 1 ? 's' : ''} saved
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: '16px' }}>
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-32 rounded-card-sm border border-line-strong animate-pulse bg-line" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-card-sm border border-dashed border-line-strong bg-white p-12 text-center">
          <Heart className="w-12 h-12 text-ink-muted mx-auto mb-3" />
          <h3 className="font-sans font-semibold text-ink mb-1">Your wishlist is empty</h3>
          <p className="text-body2 text-ink-muted mb-4">
            Tap the heart icon on any product to save it here for later.
          </p>
          <Link
            to="/offers"
            className="inline-block rounded-pill bg-ink text-white font-bold px-6 py-3 text-body2 hover:bg-ink/90 transition-colors no-underline"
          >
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: '16px' }}>
          {items.map((item) => (
            <WishlistRow
              key={item._id}
              item={item}
              onAddToCart={() => handleAddToCart(item)}
              onRemove={() => handleRemove(item)}
              isAdding={addToCart.isPending}
              isRemoving={removeItem.isPending}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function WishlistRow({
  item,
  onAddToCart,
  onRemove,
  isAdding,
  isRemoving,
}: {
  item: WishlistItem;
  onAddToCart: () => void;
  onRemove: () => void;
  isAdding: boolean;
  isRemoving: boolean;
}) {
  const outOfStock = item.stock === 0 || !item.isActive;
  return (
    <div className="rounded-card-sm border border-line-strong bg-white p-4 flex" style={{ gap: '16px' }}>
      <Link
        to={`/products/${item._id}`}
        className="shrink-0 rounded-card-sm overflow-hidden bg-primary-light flex items-center justify-center no-underline"
        style={{ width: '96px', height: '96px' }}
      >
        {item.images?.[0] ? (
          <img
            src={item.images[0]}
            alt={item.name}
            className="object-contain"
            style={{ maxWidth: '85%', maxHeight: '85%' }}
          />
        ) : (
          <Heart className="w-8 h-8 text-brand" />
        )}
      </Link>

      <div className="flex-1 flex flex-col justify-between min-w-0" style={{ gap: '8px' }}>
        <div className="flex flex-col" style={{ gap: '4px' }}>
          <Link
            to={`/products/${item._id}`}
            className="text-body1 font-semibold text-ink hover:text-brand no-underline line-clamp-2"
          >
            {item.name}
          </Link>
          <span className="text-body2 font-bold text-ink">{formatCurrency(item.price)}</span>
          {outOfStock && (
            <span className="text-body3 text-danger">Out of stock</span>
          )}
        </div>

        <div className="flex items-center" style={{ gap: '8px' }}>
          <button
            type="button"
            onClick={onAddToCart}
            disabled={isAdding || outOfStock}
            className="rounded-pill bg-ink text-white font-medium flex items-center justify-center hover:bg-ink/90 transition-colors disabled:cursor-not-allowed disabled:opacity-60"
            style={{ height: '36px', padding: '0 14px', gap: '6px' }}
          >
            <Plus className="w-4 h-4" />
            <span className="text-body2">Add to Cart</span>
          </button>
          <button
            type="button"
            onClick={onRemove}
            disabled={isRemoving}
            aria-label="Remove from wishlist"
            title="Remove from wishlist"
            className="rounded-pill border border-line-strong text-ink-muted hover:text-danger hover:border-danger flex items-center justify-center transition-colors disabled:cursor-not-allowed disabled:opacity-50"
            style={{ width: '36px', height: '36px' }}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}