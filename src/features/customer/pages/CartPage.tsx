import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "@shared/hooks/useCart";
import { useProduct } from "@shared/hooks/useProduct";
import { useUpdateCartItem } from "@shared/hooks/useUpdateCartItem";
import { useRemoveCartItem } from "@shared/hooks/useRemoveCartItem";
import { useValidatePromo } from "@shared/hooks/useValidatePromo";
import { useToast } from "@/shared/ui";
import { formatCurrency } from "@shared/lib/utils";
import { useAuth } from "@shared/lib/useAuth";
import type { CartItem, PromoValidationData } from "@shared/types";
import { ProductCard } from "../components/ProductCard";
import { useProducts } from "@shared/hooks/useProducts";

const PROMO_STORAGE_KEY = "elara_active_promo";

export function CartPage() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const { data: cartData, isLoading } = useCart();
  const updateItem = useUpdateCartItem();
  const removeItem = useRemoveCartItem();
  const validatePromo = useValidatePromo();

  
  
  const [promoInput, setPromoInput] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<PromoValidationData | null>(
    () => {
      if (typeof window === "undefined") return null;
      const stored = window.localStorage.getItem(PROMO_STORAGE_KEY);
      return stored ? (JSON.parse(stored) as PromoValidationData) : null;
    },
  );

  const cart = cartData?.cart;
  const items = cart?.items ?? [];

  
  const relatedProducts = useProducts({ sort: "newest", limit: 4 });

  function handleApplyPromo(e: React.FormEvent) {
    e.preventDefault();
    const code = promoInput.trim().toUpperCase();
    if (!code) return;
    if (items.length === 0) {
      toast.error("Add items to your cart before applying a promo code.");
      return;
    }
    validatePromo.mutate(
      { code },
      {
        onSuccess: (data) => {
          setAppliedPromo(data);
          window.localStorage.setItem(PROMO_STORAGE_KEY, JSON.stringify(data));
          toast.success(
            `Promo "${data.promo.code}" applied — ${data.promo.discountValue}% off`,
          );
        },
        onError: (err: unknown) => {
          const error = err as { message?: string };
          toast.error(error?.message ?? "Invalid promo code");
          setAppliedPromo(null);
          window.localStorage.removeItem(PROMO_STORAGE_KEY);
        },
      },
    );
  }

  function handleRemovePromo() {
    setAppliedPromo(null);
    setPromoInput("");
    window.localStorage.removeItem(PROMO_STORAGE_KEY);
    +toast.show("Promo code removed");
  }

  function handleCheckout() {
    if (!isAuthenticated) {
      +toast.show("Please sign in to checkout.");
      navigate("/sign-in?redirect=/checkout");
      return;
    }
    if (items.length === 0) {
      toast.error("Your cart is empty.");
      return;
    }
    navigate("/checkout");
  }

  
  if (!isLoading && items.length === 0) {
    return (
      <div
        className="mx-auto w-full max-w-[1280px] px-6 lg:px-20 py-16 flex flex-col items-center text-center"
        style={{ gap: "24px" }}
      >
        <div className="rounded-full bg-primary-light w-24 h-24 flex items-center justify-center">
          <ShoppingBag className="w-12 h-12 text-brand" />
        </div>
        <h1 className="font-serif text-h4 font-semibold text-ink">
          Your cart is empty
        </h1>
        <p className="text-body1 text-ink-muted max-w-md">
          Looks like you haven't added anything yet. Browse our products and
          find something you love.
        </p>
        <Link
          to="/offers"
          className="rounded-pill bg-ink text-white font-bold flex items-center justify-center hover:bg-ink/90 transition-colors no-underline"
          style={{ height: "56px", padding: "8px 24px", gap: "8px" }}
        >
          Start Shopping
          <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    );
  }

  
  
  
  const subtotal = cart?.subtotal ?? 0;
  const shipping = cart?.shipping ?? 0;
  const tax = cart?.tax ?? 0;
  const discount = appliedPromo?.discount ?? 0;
  
  
  
  
  const total = Math.max(0, (cart?.total ?? 0) - discount);

  return (
    <div
      className="mx-auto w-full max-w-[1280px] px-6 lg:px-20 py-10 flex flex-col"
      style={{ gap: "48px" }}
    >
      {/* Breadcrumb */}
      <nav
        className="flex items-center gap-2 text-body1"
        aria-label="Breadcrumb"
      >
        <Link to="/" className="text-ink-secondary hover:text-ink">
          Home
        </Link>
        <span className="text-ink-muted">/</span>
        <span className="text-ink font-medium">Cart</span>
      </nav>

      {/* Title + item count */}
      <div className="flex items-end justify-between">
        <h1 className="font-serif text-h3 font-bold text-ink">Shopping Cart</h1>
        <span className="text-body1 text-ink-muted">
          {cart?.itemsCount ?? 0} item{(cart?.itemsCount ?? 0) !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Main 2-column layout: items list (left) + summary (right) */}
      <div
        className="grid grid-cols-1 lg:grid-cols-[1fr_400px]"
        style={{ gap: "48px" }}
      >
        {/* === LEFT: Cart items === */}
        <div className="flex flex-col" style={{ gap: "24px" }}>
          {isLoading ? (
            <>
              {[0, 1].map((i) => (
                <div
                  key={i}
                  className="h-32 rounded-card-sm border border-line-strong animate-pulse bg-line"
                />
              ))}
            </>
          ) : (
            items.map((item) => (
              <CartLine
                key={item.product._id}
                item={item}
                onUpdateQuantity={(qty) =>
                  updateItem.mutate({
                    productId: item.product._id,
                    quantity: qty,
                  })
                }
                onRemove={() =>
                  removeItem.mutate({ productId: item.product._id })
                }
                isUpdating={updateItem.isPending}
                isRemoving={removeItem.isPending}
              />
            ))
          )}
        </div>

        {/* === RIGHT: Order summary === */}
        <aside className="lg:sticky lg:top-8 self-start">
          <div
            className="rounded-card-sm border border-line-strong bg-white p-6 flex flex-col"
            style={{ gap: "24px" }}
          >
            <div className="flex items-center justify-between">
              <h2
                className="font-sans font-bold text-ink"
                style={{ fontSize: "20px" }}
              >
                Order Summary
              </h2>
              <span className="rounded-pill bg-primary-200 text-ink-secondary text-body3 font-medium px-3 py-1">
                {cart?.itemsCount ?? 0} Items
              </span>
            </div>

            {/* Summary line items */}
            <div className="flex flex-col" style={{ gap: "12px" }}>
              <SummaryRow label="Subtotal" value={formatCurrency(subtotal)} />
              <SummaryRow label="Delivery" value={formatCurrency(shipping)} />
              <SummaryRow label="Tax (14%)" value={formatCurrency(tax)} />
              {discount > 0 && (
                <SummaryRow
                  label={`Discount (${appliedPromo?.promo.code})`}
                  value={`-${formatCurrency(discount)}`}
                  valueClassName="text-success"
                />
              )}
              <div className="border-t border-line pt-3 mt-1">
                <SummaryRow
                  label="Total"
                  value={formatCurrency(total)}
                  labelClassName="font-bold text-ink"
                  valueClassName="font-bold text-ink"
                  size="lg"
                />
              </div>
            </div>

            {/* Promo code */}
            {appliedPromo ? (
              <div className="rounded-card-sm border border-success/30 bg-success/5 p-3 flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-body2 font-semibold text-success">
                    {appliedPromo.promo.code} applied
                  </span>
                  <span className="text-body3 text-ink-muted">
                    {appliedPromo.promo.discountValue}% off — you saved{" "}
                    {formatCurrency(appliedPromo.discount)}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleRemovePromo}
                  className="text-body2 text-ink-muted hover:text-danger"
                >
                  Remove
                </button>
              </div>
            ) : (
              <form
                onSubmit={handleApplyPromo}
                className="flex flex-col"
                style={{ gap: "8px" }}
              >
                <label className="text-body2 font-medium text-ink-secondary">
                  Promo code
                </label>
                <div className="flex" style={{ gap: "8px" }}>
                  <input
                    type="text"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    placeholder="Enter promo code"
                    className="flex-1 rounded-card-sm border border-line-strong px-3 h-11 text-body2 text-ink placeholder:text-ink-muted focus:outline-none focus:border-brand"
                  />
                  <button
                    type="submit"
                    disabled={validatePromo.isPending || !promoInput.trim()}
                    className="rounded-card-sm bg-ink text-white font-medium px-5 h-11 text-body2 hover:bg-ink/90 transition-colors disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {validatePromo.isPending ? "Checking..." : "Apply"}
                  </button>
                </div>
                <p className="text-body3 text-ink-muted">
                  Try{" "}
                  <button
                    type="button"
                    onClick={() => setPromoInput("WELCOME20")}
                    className="text-brand underline"
                  >
                    WELCOME20
                  </button>{" "}
                  for 20% off.
                </p>
              </form>
            )}

            {/* Checkout button */}
            <button
              type="button"
              onClick={handleCheckout}
              disabled={items.length === 0}
              className="rounded-pill bg-ink text-white font-bold flex items-center justify-center hover:bg-ink/90 transition-colors disabled:cursor-not-allowed disabled:opacity-60"
              style={{ height: "56px", gap: "8px" }}
            >
              Checkout
              <ArrowRight className="w-5 h-5" />
            </button>

            {/* Trust line */}
            <p className="text-body3 text-ink-muted text-center">
              Secure payment via Stripe. You'll review your order before paying.
            </p>

            <Link
              to="/offers"
              className="text-body2 text-brand hover:underline text-center"
            >
              Continue shopping
            </Link>
          </div>
        </aside>
      </div>

      {/* === Related products === */}
      <section className="flex flex-col" style={{ gap: "32px" }}>
        <div className="flex flex-col items-center" style={{ gap: "12px" }}>
          <h2
            className="font-serif font-bold text-center text-ink-secondary"
            style={{ fontSize: "32px", lineHeight: "38px" }}
          >
            You May Also Like
          </h2>
          <div
            style={{ width: "93px", borderTop: "5px solid var(--color-ink)" }}
          />
        </div>
        {relatedProducts.isLoading ? (
          <div
            className="w-full grid grid-cols-2 lg:grid-cols-4"
            style={{ gap: "24px" }}
          >
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-80 rounded-card-sm border border-line-strong animate-pulse bg-line"
              />
            ))}
          </div>
        ) : relatedProducts.data?.products?.length ? (
          <div
            className="w-full grid grid-cols-2 lg:grid-cols-4"
            style={{ gap: "24px" }}
          >
            {relatedProducts.data.products.slice(0, 4).map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        ) : null}
      </section>
    </div>
  );
}


function CartLine({
  item,
  onUpdateQuantity,
  onRemove,
  isUpdating,
  isRemoving,
}: {
  item: CartItem;
  onUpdateQuantity: (qty: number) => void;
  onRemove: () => void;
  isUpdating: boolean;
  isRemoving: boolean;
}) {
  const { product, quantity, lineTotal } = item;
  
  
  
  const { data: fullProduct } = useProduct(product._id);
  const brandName = fullProduct?.product?.seller?.name;
  const categoryName = fullProduct?.product?.category?.name;
  const toast = useToast();

  function handleDecrement() {
    if (quantity <= 1) {
      
      onRemove();
      return;
    }
    onUpdateQuantity(quantity - 1);
  }

  function handleIncrement() {
    if (quantity >= product.stock) {
      toast.error(`Only ${product.stock} in stock.`);
      return;
    }
    onUpdateQuantity(quantity + 1);
  }

  return (
    <div
      className="rounded-card-sm border border-line-strong bg-white p-4 flex"
      style={{ gap: "24px" }}
    >
      {/* Image */}
      <Link
        to={`/products/${product._id}`}
        className="shrink-0 rounded-card-sm overflow-hidden bg-primary-light flex items-center justify-center no-underline"
        style={{ width: "120px", height: "120px" }}
      >
        {product.images?.[0] ? (
          <img
            src={product.images[0]}
            alt={product.name}
            className="object-contain"
            style={{ maxWidth: "90%", maxHeight: "90%" }}
          />
        ) : (
          <ShoppingBag className="w-8 h-8 text-ink-muted" />
        )}
      </Link>

      {/* Info */}
      <div
        className="flex-1 flex flex-col justify-between"
        style={{ gap: "8px" }}
      >
        <div className="flex flex-col" style={{ gap: "4px" }}>
          {/* Brand / category line (small, muted) */}
          {brandName && (
            <span className="text-body3 text-ink-muted uppercase tracking-wide">
              {brandName}
            </span>
          )}
          {!brandName && categoryName && (
            <span className="text-body3 text-ink-muted uppercase tracking-wide">
              {categoryName}
            </span>
          )}
          {/* Product name */}
          <Link
            to={`/products/${product._id}`}
            className="text-body1 font-semibold text-ink hover:text-brand no-underline line-clamp-2"
          >
            {product.name}
          </Link>
          {/* Unit price */}
          <span className="text-body2 text-ink-muted">
            {formatCurrency(product.price)} each
          </span>
        </div>

        {/* Quantity selector + remove */}
        <div className="flex items-center justify-between">
          <div
            className="flex items-center rounded-pill border border-line-strong bg-white"
            style={{ gap: "0" }}
          >
            <button
              type="button"
              onClick={handleDecrement}
              disabled={isUpdating || isRemoving}
              aria-label="Decrease quantity"
              className="flex items-center justify-center text-ink hover:text-brand transition-colors disabled:cursor-not-allowed disabled:opacity-50"
              style={{ width: "36px", height: "36px" }}
            >
              <Minus className="w-4 h-4" />
            </button>
            <span
              className="font-sans font-medium text-ink text-center"
              style={{ minWidth: "40px" }}
            >
              {quantity}
            </span>
            <button
              type="button"
              onClick={handleIncrement}
              disabled={isUpdating || isRemoving || quantity >= product.stock}
              aria-label="Increase quantity"
              className="flex items-center justify-center text-ink hover:text-brand transition-colors disabled:cursor-not-allowed disabled:opacity-50"
              style={{ width: "36px", height: "36px" }}
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center" style={{ gap: "16px" }}>
            <span className="text-body1 font-bold text-ink">
              {formatCurrency(lineTotal)}
            </span>
            <button
              type="button"
              onClick={onRemove}
              disabled={isRemoving}
              aria-label="Remove item"
              title="Remove from cart"
              className="text-ink-muted hover:text-danger transition-colors disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Stock warning if low */}
        {product.stock > 0 && product.stock <= 5 && (
          <p className="text-body3 text-warning">
            Only {product.stock} left in stock — order soon.
          </p>
        )}
        {product.stock === 0 && (
          <p className="text-body3 text-danger">Out of stock.</p>
        )}
      </div>
    </div>
  );
}


function SummaryRow({
  label,
  value,
  labelClassName = "text-ink-secondary",
  valueClassName = "text-ink",
  size = "md",
}: {
  label: string;
  value: string;
  labelClassName?: string;
  valueClassName?: string;
  size?: "md" | "lg";
}) {
  return (
    <div className="flex items-center justify-between">
      <span
        className={
          size === "lg"
            ? `text-body1 ${labelClassName}`
            : `text-body2 ${labelClassName}`
        }
      >
        {label}
      </span>
      <span
        className={
          size === "lg"
            ? `font-sans ${valueClassName}`
            : `text-body2 font-semibold ${valueClassName}`
        }
        style={size === "lg" ? { fontSize: "24px" } : undefined}
      >
        {value}
      </span>
    </div>
  );
}
