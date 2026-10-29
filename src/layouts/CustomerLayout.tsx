import { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { ShoppingCart, Heart, Search, ChevronDown } from "lucide-react";
import { useAuth } from "@shared/lib/useAuth";
import { useToast } from "@/shared/ui";
import { useSubscribeNewsletter } from "@shared/hooks/useSubscribeNewsletter";
import { useCart } from "@shared/hooks/useCart";

const navLinks = [
  { to: "/", label: "Home", status: "active" as const },
  { to: "/products", label: "Products", status: "pending" as const },
  { to: "/bundles", label: "Bundles", status: "pending" as const },
  { to: "/offers", label: "Offers", status: "pending" as const },
];

const shopLinks = [
  { label: "Home", to: "/" },
  { label: "Products", to: null },
  { label: "Care", to: "/brands/skincare" },
  { label: "Makeup", to: "/brands/makeup" },
  { label: "Korean", to: "/brands/korean-beauty" },
];

const exploreLinks = [
  { label: "Bundles", to: null },
  { label: "Gifts", to: null },
];

const customerCareLinks = [
  { label: "Help Center", to: null },
  { label: "Contact Us", to: null },
  { label: "Track Order", to: null },
];

const myAccountLinks = [
  { label: "Orders", to: null },
  { label: "Wishlist", to: null },
  { label: "Addresses", to: null },
];

const paymentMethods = ["Mastercard", "Visa", "Apple Pay", "OPay"];

export function CustomerLayout() {
  const { user, isAuthenticated } = useAuth();
  const toast = useToast();
  const subscribe = useSubscribeNewsletter();
  const { data: cartData } = useCart();
  const cartCount = cartData?.cart?.itemsCount ?? 0;
  const [email, setEmail] = useState("");

  function handleSubscribe(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    subscribe.mutate(
      { email: email.trim() },
      {
        onSuccess: () => {
          toast.success("Subscribed successfully");
          setEmail("");
        },
        onError: (err: unknown) => {
          const error = err as { message?: string };
          toast.error(error?.message ?? "Failed to subscribe");
        },
      },
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-surface">
      {/* === HEADER === */}
      <header className="bg-white">
        {/* Top row */}
        <div className="mx-auto flex h-[99px] w-full max-w-[1440px] items-center justify-between gap-6 px-20">
          <Link to="/" className="font-bold text-h5 text-ink">
            Elara
          </Link>

          {/* Search bar (disabled — no search results page) */}
          <div className="flex-1 max-w-[624px] relative">
            <div className="flex items-center border border-brand rounded-pill overflow-hidden h-10">
              <input
                type="search"
                placeholder="Search"
                disabled
                aria-label="Search products"
                title="Search results page coming soon"
                className="flex-1 h-full bg-transparent pl-6 pr-3 text-body2 text-ink placeholder:text-ink-muted focus:outline-none disabled:cursor-not-allowed disabled:opacity-60"
              />
              <div className="bg-ink h-full flex items-center justify-center px-5">
                <Search className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>

          {/* Right side: Hi name / English */}
          <div className="flex items-center gap-4 text-body2">
            {isAuthenticated && user ? (
              <span className="flex items-center gap-1 text-ink">
                Hi, {user.name.split(" ")[0]}
                <ChevronDown className="w-4 h-4" />
              </span>
            ) : (
              <span
                className="text-ink-muted cursor-not-allowed"
                aria-disabled="true"
                title="Sign in to see your account"
              >
                Login
              </span>
            )}
            <span
              className="text-ink-muted cursor-not-allowed"
              aria-disabled="true"
              title="Coming soon"
            >
              English
            </span>
          </div>
        </div>

        {/* Bottom row: pink nav */}
        <div className="bg-primary">
          <div className="mx-auto flex h-20 w-full max-w-[1440px] items-center justify-between px-20 text-body2 font-medium">
            {/* Left: nav items */}
            <div className="flex items-center gap-4">
              {navLinks.map((l) =>
                l.status === "active" ? (
                  <Link
                    key={l.to}
                    to={l.to}
                    className="text-ink hover:text-white"
                  >
                    {l.label}
                  </Link>
                ) : (
                  <span
                    key={l.to}
                    className="text-ink-muted cursor-not-allowed"
                    aria-disabled="true"
                  >
                    {l.label}
                  </span>
                ),
              )}
            </div>
            {/* Right: cart, heart, My Order */}
            <div className="flex items-center gap-4">
              <button
                type="button"
                disabled
                aria-label="Cart"
                title="Cart page coming soon"
                className="relative text-ink-muted hover:text-brand disabled:cursor-not-allowed disabled:opacity-60"
              >
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-brand text-white text-xs font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1">
                    {cartCount}
                  </span>
                )}
              </button>
              <button
                type="button"
                disabled
                aria-label="Wishlist"
                title="Wishlist page coming soon"
                className="text-ink-muted hover:text-brand disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Heart className="w-5 h-5" />
              </button>
              <span
                className="text-ink-muted cursor-not-allowed"
                aria-disabled="true"
                title="My Orders page coming soon"
              >
                My Order
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="w-full flex-1 pb-16">
        <Outlet />
      </main>

      {/* === FOOTER === */}
      <footer>
        {/* Newsletter strip */}
        <div className="bg-[#F8E8ED]">
          <div className="mx-auto flex w-full max-w-[1440px] items-center justify-between px-20 py-8 gap-8">
            <p className="text-h6 font-semibold text-ink-secondary max-w-md">
              Be the first one to know about new products, offers
            </p>
            <form
              onSubmit={handleSubscribe}
              className="flex items-center gap-2"
            >
              <input
                type="email"
                required
                placeholder="Your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={subscribe.isPending}
                className="border border-brand rounded-pill bg-transparent px-6 h-12 text-body2 text-ink placeholder:text-ink-muted focus:outline-none focus:border-brand"
              />
              <button
                type="submit"
                disabled={subscribe.isPending}
                className="bg-ink text-white rounded-pill px-6 h-12 text-body1 font-medium hover:bg-ink/90 transition-colors disabled:cursor-not-allowed disabled:opacity-60"
              >
                {subscribe.isPending ? "Subscribing..." : "Subscribe"}
              </button>
            </form>
          </div>
        </div>

        {/* Main footer */}
        <div className="bg-primary-light">
          <div className="mx-auto grid w-full max-w-[1440px] grid-cols-6 gap-8 px-20 py-12">
            {/* Brand column */}
            <div className="col-span-2 flex flex-col gap-3">
              <div className="font-bold text-h6 text-brand">Elara</div>
              <p className="text-body2 text-ink-secondary">
                ELARA is your destination for premium beauty and self-care
                essentials. Glow with confidence, every day.
              </p>
            </div>

            {/* Footer link columns */}
            {[
              { title: "Shop", links: shopLinks },
              { title: "Explore", links: exploreLinks },
              { title: "Customer Care", links: customerCareLinks },
              { title: "My Account", links: myAccountLinks },
            ].map((col) => (
              <div key={col.title} className="flex flex-col gap-3">
                <div className="text-body1 font-semibold text-ink">
                  {col.title}
                </div>
                <ul className="flex flex-col gap-2">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      {link.to ? (
                        <Link
                          to={link.to}
                          className="text-body2 text-ink-secondary hover:text-ink"
                        >
                          {link.label}
                        </Link>
                      ) : (
                        <span
                          className="text-body2 text-ink-secondary cursor-not-allowed"
                          aria-disabled="true"
                        >
                          {link.label}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Bottom row */}
          <div className="border-t border-line-strong">
            <div className="mx-auto flex w-full max-w-[1440px] items-center justify-between gap-3 px-20 py-4">
              <div className="text-body2 text-ink-muted">
                © {new Date().getFullYear()} Elara Skincare &amp; Makeup
              </div>
              <div className="flex gap-3 items-center text-body2 text-ink-muted">
                {paymentMethods.map((m, i) => (
                  <span key={m} className="flex items-center gap-3">
                    {i > 0 && <span>·</span>}
                    <span>{m}</span>
                  </span>
                ))}
                <span>·</span>
                <span>Privacy Policy</span>
                <span>·</span>
                <span>Terms &amp; Conditions</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
