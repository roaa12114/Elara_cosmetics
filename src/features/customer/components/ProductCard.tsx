import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, Plus, Star } from "lucide-react";
import type { Product } from "@shared/types";
import { formatCurrency } from "@shared/lib/utils";
import { useToast } from "@/shared/ui";
import { useAuth } from "@/shared/lib/useAuth";
import { useAddToCart } from "@shared/hooks/useAddToCart";
import { useAddToWishlist } from "@shared/hooks/useAddToWishlist";

const NEW_PRODUCT_MS = 7 * 24 * 60 * 60 * 1000;

function isNewProduct(createdAt: string): boolean {
  const created = new Date(createdAt).getTime();
  if (Number.isNaN(created)) return false;
  return Date.now() - created < NEW_PRODUCT_MS;
}

type ProductCardProps = {
  product: Product;
  rating?: number;
  originalPrice?: number;
  saleBadge?: string;
  soldCount?: string;
  countdown?: string;
  tag?: string;
};

export function ProductCard({
  product,
  rating = 4.5,
  originalPrice,
  saleBadge,
  soldCount,
  countdown,
  tag,
}: ProductCardProps) {
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
      navigate("/sign-in");
      return;
    }
    addToCart.mutate(
      { productId: product._id, quantity: 1 },
      {
        onSuccess: () => toast.success("Added to cart"),
        onError: (err: unknown) => {
          const error = err as { message?: string };
          toast.error(error?.message ?? "Failed to add to cart");
        },
      },
    );
  }

  function handleAddToWishlist() {
    if (!isAuthenticated) {
      navigate("/sign-in");
      return;
    }
    addToWishlist.mutate(
      { productId: product._id },
      {
        onSuccess: () => toast.success("Added to wishlist"),
        onError: (err: unknown) => {
          const error = err as { message?: string };
          toast.error(error?.message ?? "Failed to add to wishlist");
        },
      },
    );
  }

  return (
    <div
      className="rounded-card-sm bg-surface border border-primary-light flex flex-col"
      style={{ padding: "0 0 24px", gap: "24px" }}
    >
      {/* === Image area === */}

      <div
        className="relative bg-white rounded-t-card-sm overflow-hidden"
        style={{ aspectRatio: "300 / 289", minHeight: "289px" }}
      >
        {" "}
        {/* Product image centered with drop shadow */}
        {showImage ? (
          <img
            src={image}
            alt={product.name}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 object-contain"
            style={{
              width: "230px",
              height: "254px",
              filter: "drop-shadow(0px 8px 24px rgba(102, 102, 102, 0.16))",
            }}
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 text-ink-muted">
            <div className="text-h6 font-semibold">No image</div>
            <div className="text-body2">Upload via admin</div>
          </div>
        )}
        {/* Top row: badges (left) + heart (right) */}
        <div
          className="absolute top-0 left-0 right-0 flex justify-between items-start p-3"
          style={{ gap: "200px" }}
        >
          <div className="flex flex-col gap-2 items-start">
            {showNewBadge && (
              <span
                className="bg-white rounded-pill flex items-center justify-center"
                style={{
                  width: "49px",
                  height: "24px",
                  gap: "10px",
                  padding: "4px 12px",
                }}
              >
                <span className="font-medium text-body3 text-brand">New</span>
              </span>
            )}
            {saleBadge && (
              <span
                className="bg-gold rounded-pill flex items-center justify-center"
                style={{ height: "24px", gap: "10px", padding: "4px 12px" }}
              >
                <span className="font-medium text-body3 text-white">
                  {saleBadge}
                </span>
              </span>
            )}
            {soldCount && (
              <span
                className="bg-danger-dark rounded-pill flex items-center justify-center"
                style={{ height: "24px", gap: "10px", padding: "4px 12px" }}
              >
                <span className="font-medium text-body3 text-white">
                  {soldCount}
                </span>
              </span>
            )}
            {countdown && (
              <span
                className="bg-danger-dark rounded-pill flex items-center justify-center"
                style={{ height: "24px", gap: "10px", padding: "4px 12px" }}
              >
                <span className="font-medium text-body3 text-white">
                  Ends in: {countdown}
                </span>
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={handleAddToWishlist}
            disabled={addToWishlist.isPending}
            aria-label="Add to wishlist"
            className="w-6 h-6 flex items-center justify-center text-ink hover:text-brand transition-colors disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Heart className="w-6 h-6" />
          </button>
        </div>
        {/* Rating pill — bottom-left of image area */}
        <div
          className="absolute flex items-end"
          style={{ left: "12px", bottom: "12px" }}
        >
          <div
            className="bg-line rounded-pill flex items-center"
            style={{
              width: "54px",
              height: "24px",
              padding: "4px",
              gap: "4px",
            }}
          >
            <Star className="w-4 h-4 fill-gold text-gold" />
            <span className="text-body3 text-ink">{rating.toFixed(1)}</span>
          </div>
        </div>
      </div>

      {/* === Content area === */}
      <div
        className="flex items-end justify-between relative"
        style={{ padding: "0 24px", gap: "35px" }}
      >
        <div className="flex flex-col" style={{ gap: "8px" }}>
          {tag && (
            <span
              className="self-start bg-primary-light text-brand rounded-pill"
              style={{ padding: "4px 12px" }}
            >
              <span className="font-medium text-body3">{tag}</span>
            </span>
          )}
          {/* Category label (seller name as fallback) */}
          <div className="text-body2 text-secondary-400">
            {product.seller.name}
          </div>
          {/* Product name */}
          <div className="text-body1 text-secondary-800 line-clamp-2">
            {product.name}
          </div>
          {/* Price row */}
          <div className="flex items-end" style={{ gap: "2px" }}>
            <span className="text-body2 font-semibold text-ink">
              {formatCurrency(product.price)}
            </span>
            {originalPrice && originalPrice > product.price && (
              <span
                className="text-body3 text-ink-muted line-through"
                style={{ marginLeft: "4px", marginBottom: "2px" }}
              >
                {formatCurrency(originalPrice)}
              </span>
            )}
          </div>
        </div>
        {/* + button */}
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={addToCart.isPending}
          aria-label="Add to cart"
          title="Add to cart"
          className="rounded-pill bg-ink text-white flex items-center justify-center hover:bg-ink/90 transition-colors disabled:cursor-not-allowed disabled:opacity-60 shrink-0"
          style={{ width: "40px", height: "40px" }}
        >
          {addToCart.isPending ? (
            <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
          ) : (
            <Plus className="w-6 h-6" />
          )}
        </button>
      </div>
    </div>
  );
}
