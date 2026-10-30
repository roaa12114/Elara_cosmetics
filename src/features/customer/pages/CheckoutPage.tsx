import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CreditCard, Truck, ShieldCheck, ArrowRight, Lock } from 'lucide-react';
import { useCart } from '@shared/hooks/useCart';
import { useOrders } from '@shared/hooks/useOrders';
import { useCreateOrder } from '@shared/hooks/useCreateOrder';
import { useCheckout } from '@shared/hooks/useCheckout';
import { useAuth } from '@shared/lib/useAuth';
import { useToast } from '@/shared/ui';
import { formatCurrency } from '@shared/lib/utils';
import type { PromoValidationData, ShippingAddress } from '@shared/types';



const ADDRESS_STORAGE_KEY = 'elara_last_address';
const PROMO_STORAGE_KEY = 'elara_active_promo';


const EGYPT_GOVERNORATES = [
  'Cairo',
  'Giza',
  'Alexandria',
  'Dakahlia',
  'Red Sea',
  'Beheira',
  'Faiyum',
  'Gharbia',
  'Ismailia',
  'Menofia',
  'Minya',
  'Qalyubia',
  'New Valley',
  'Suez',
  'Aswan',
  'Assiut',
  'Beni Suef',
  'Port Said',
  'Damietta',
  'Sharqia',
  'South Sinai',
  'Kafr El Sheikh',
  'Matrouh',
  'Luxor',
  'Qena',
  'North Sinai',
  'Sohag',
];




interface CheckoutFormState {
  email: string;
  firstName: string;
  lastName: string;
  street: string;
  apartment: string;
  city: string;
  state: string; 
  postalCode: string;
  phone: string;
  country: string;
}

const EMPTY_FORM: CheckoutFormState = {
  email: '',
  firstName: '',
  lastName: '',
  street: '',
  apartment: '',
  city: '',
  state: 'Cairo',
  postalCode: '',
  phone: '',
  country: 'Egypt',
};

export function CheckoutPage() {
  const navigate = useNavigate();
  const toast = useToast();
  const { user, isAuthenticated } = useAuth();
  const { data: cartData, isLoading: cartLoading } = useCart();
  const { data: ordersData } = useOrders({ limit: 1 }); 
  const createOrder = useCreateOrder();
  const checkout = useCheckout();

  
  const [appliedPromo] = useState<PromoValidationData | null>(() => {
    if (typeof window === 'undefined') return null;
    const stored = window.localStorage.getItem(PROMO_STORAGE_KEY);
    return stored ? (JSON.parse(stored) as PromoValidationData) : null;
  });

  
  
  const [form, setForm] = useState<CheckoutFormState>(() => {
    if (typeof window === 'undefined') return EMPTY_FORM;
    const stored = window.localStorage.getItem(ADDRESS_STORAGE_KEY);
    const storedForm = stored ? (JSON.parse(stored) as Partial<CheckoutFormState>) : {};
    return { ...EMPTY_FORM, ...storedForm };
  });

  
  useEffect(() => {
    if (user?.email && !form.email) {
      setForm((f) => ({ ...f, email: user.email }));
    }
  }, [user, form.email]);

  
  useEffect(() => {
    if (user && !form.firstName && !form.phone) {
      const nameParts = user.name.split(' ');
      setForm((f) => ({
        ...f,
        firstName: nameParts[0] ?? '',
        lastName: nameParts.slice(1).join(' ') ?? '',
        phone: user.phone ?? '',
      }));
    }
  }, [user, form.firstName, form.phone]);

  
  
  
  const lastOrder = ordersData?.orders?.[0];
  useEffect(() => {
    if (!lastOrder?.shippingAddress) return;
    setForm((f) => {
      const sa = lastOrder.shippingAddress;
      
      const parts = (sa.fullName ?? '').split(' ');
      const firstName = parts[0] ?? '';
      const lastName = parts.slice(1).join(' ') ?? '';
      return {
        ...f,
        firstName: f.firstName || firstName,
        lastName: f.lastName || lastName,
        street: f.street || sa.street,
        city: f.city || sa.city,
        state: f.state || sa.state || 'Cairo',
        postalCode: f.postalCode || sa.postalCode,
        phone: f.phone || sa.phone,
        country: f.country || sa.country || 'Egypt',
      };
    });
  }, [lastOrder]);

  const cart = cartData?.cart;
  const items = cart?.items ?? [];

  
  useEffect(() => {
    if (!cartLoading && items.length === 0 && !createOrder.isPending) {
      navigate('/cart');
    }
  }, [cartLoading, items.length, createOrder.isPending, navigate]);

  function updateField<K extends keyof CheckoutFormState>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function buildShippingAddress(): ShippingAddress {
    
    const street = form.apartment.trim()
      ? `${form.street.trim()}, ${form.apartment.trim()}`
      : form.street.trim();
    return {
      fullName: `${form.firstName.trim()} ${form.lastName.trim()}`.trim(),
      phone: form.phone.trim(),
      street,
      city: form.city.trim(),
      state: form.state,
      postalCode: form.postalCode.trim(),
      country: form.country,
    };
  }

  function isFormValid(): boolean {
    return (
      form.email.trim() !== '' &&
      form.firstName.trim() !== '' &&
      form.lastName.trim() !== '' &&
      form.street.trim() !== '' &&
      form.city.trim() !== '' &&
      form.state.trim() !== '' &&
      form.phone.trim() !== '' &&
      form.country.trim() !== ''
    );
  }

  async function handlePlaceOrder() {
    if (!isAuthenticated) {
+      toast.show('Please sign in to place your order.');
      navigate('/sign-in?redirect=/checkout');
      return;
    }
    if (!cart || items.length === 0) {
      toast.error('Your cart is empty.');
      navigate('/cart');
      return;
    }
    if (!isFormValid()) {
      toast.error('Please fill in all required fields.');
      return;
    }

    const shippingAddress = buildShippingAddress();

    
    let orderId: string;
    try {
      const order = await createOrder.mutateAsync({
        cartId: cart.cartId,
        shippingAddress,
      });
      orderId = order.order._id;
    } catch (err) {
      const error = err as { message?: string };
      toast.error(error?.message ?? 'Failed to create order. Please try again.');
      return;
    }

    
    try {
      window.localStorage.setItem(ADDRESS_STORAGE_KEY, JSON.stringify(form));
    } catch {
      // ignore quota errors
    }

    
    try {
      const session = await checkout.mutateAsync({
        orderId,
        promoCode: appliedPromo?.promo.code,
      });
      if (session.url) {
        
        window.location.href = session.url;
      } else {
        toast.error('Stripe did not return a checkout URL.');
      }
    } catch (err) {
      const error = err as { message?: string };
      toast.error(error?.message ?? 'Failed to start Stripe checkout.');
      // The order was created with status "pending" — the user can retry
      // payment from their order history later (when that page exists).
    }
  }

  
  const subtotal = cart?.subtotal ?? 0;
  const shipping = cart?.shipping ?? 0;
  const tax = cart?.tax ?? 0;
  const discount = appliedPromo?.discount ?? 0;
  const total = Math.max(0, (cart?.total ?? 0) - discount);

  return (
    <div className="mx-auto w-full max-w-[1280px] px-6 lg:px-20 py-10 flex flex-col" style={{ gap: '40px' }}>
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-body1" aria-label="Breadcrumb">
        <Link to="/" className="text-ink-secondary hover:text-ink">Home</Link>
        <span className="text-ink-muted">/</span>
        <Link to="/cart" className="text-ink-secondary hover:text-ink">Cart</Link>
        <span className="text-ink-muted">/</span>
        <span className="text-ink font-medium">Checkout</span>
      </nav>

      {/* Title + delivery estimate */}
      <div className="flex items-end justify-between flex-wrap" style={{ gap: '16px' }}>
        <div className="flex items-center" style={{ gap: '16px' }}>
          <div className="rounded-pill bg-primary-light w-12 h-12 flex items-center justify-center">
            <CreditCard className="w-6 h-6 text-brand" />
          </div>
          <h1 className="font-serif text-h3 font-bold text-ink">Checkout</h1>
        </div>
        <div className="flex items-center text-body2 text-ink-secondary" style={{ gap: '8px' }}>
          <Truck className="w-5 h-5 text-brand" />
          <span>Delivery: 2-4 business days (confirmed after payment)</span>
        </div>
      </div>

      {/* Main 2-column layout: form (left) + summary (right) */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px]" style={{ gap: '48px' }}>
        {/* === LEFT: Form === */}
        <div className="flex flex-col" style={{ gap: '32px' }}>
          {/* Contact section */}
          <FormSection title="Contact" step={1}>
            <Field
              label="Email"
              required
              hint="Order confirmation will be sent here."
            >
              <input
                type="email"
                value={form.email}
                onChange={(e) => updateField('email', e.target.value)}
                placeholder="you@example.com"
                readOnly={!!user?.email}
                className={inputClass}
              />
            </Field>
          </FormSection>

          {/* Delivery section — inline address form */}
          <FormSection title="Delivery" step={2}>
            {/* Country */}
            <Field label="Country" required>
              <select
                value={form.country}
                onChange={(e) => updateField('country', e.target.value)}
                className={inputClass}
              >
                <option value="Egypt">Egypt</option>
              </select>
            </Field>

            {/* First name + Last name */}
            <div className="grid grid-cols-2" style={{ gap: '16px' }}>
              <Field label="First name" required>
                <input
                  type="text"
                  value={form.firstName}
                  onChange={(e) => updateField('firstName', e.target.value)}
                  className={inputClass}
                />
              </Field>
              <Field label="Last name" required>
                <input
                  type="text"
                  value={form.lastName}
                  onChange={(e) => updateField('lastName', e.target.value)}
                  className={inputClass}
                />
              </Field>
            </div>

            {/* Address */}
            <Field label="Address" required>
              <input
                type="text"
                value={form.street}
                onChange={(e) => updateField('street', e.target.value)}
                placeholder="Street address"
                className={inputClass}
              />
            </Field>

            {/* Apartment */}
            <Field label="Apartment, suite, etc. (optional)">
              <input
                type="text"
                value={form.apartment}
                onChange={(e) => updateField('apartment', e.target.value)}
                placeholder="Apt, suite, unit"
                className={inputClass}
              />
            </Field>

            {/* City + Governorate + Postal code */}
            <div className="grid grid-cols-3" style={{ gap: '16px' }}>
              <Field label="City" required>
                <input
                  type="text"
                  value={form.city}
                  onChange={(e) => updateField('city', e.target.value)}
                  className={inputClass}
                />
              </Field>
              <Field label="Governorate" required>
                <select
                  value={form.state}
                  onChange={(e) => updateField('state', e.target.value)}
                  className={inputClass}
                >
                  {EGYPT_GOVERNORATES.map((g) => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </Field>
              <Field label="Postal code (optional)">
                <input
                  type="text"
                  value={form.postalCode}
                  onChange={(e) => updateField('postalCode', e.target.value)}
                  className={inputClass}
                />
              </Field>
            </div>

            {/* Phone */}
            <Field label="Phone number" required hint="In case we need to contact you about delivery.">
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => updateField('phone', e.target.value)}
                placeholder="01XXXXXXXXX"
                className={inputClass}
              />
            </Field>
          </FormSection>

          {/* Pay With section — Stripe only, COD disabled */}
          <FormSection title="Pay With" step={3}>
            {/* Selected: Credit/Debit Card */}
            <label
              className="flex items-start rounded-card-sm border border-brand bg-primary-light/40 p-4 cursor-pointer"
              style={{ gap: '12px' }}
            >
              <input
                type="radio"
                name="payment"
                value="card"
                defaultChecked
                className="mt-1 accent-brand"
              />
              <div className="flex-1 flex flex-col" style={{ gap: '8px' }}>
                <div className="flex items-center justify-between">
                  <span className="text-body1 font-semibold text-ink">
                    Credit / Debit Card
                  </span>
                  <div className="flex items-center" style={{ gap: '6px' }}>
                    <PaymentBadge label="Visa" />
                    <PaymentBadge label="Mastercard" />
                    <PaymentBadge label="Amex" />
                  </div>
                </div>
                <p className="text-body2 text-ink-secondary">
                  You'll be redirected to Stripe to complete payment securely.
                  We never see or store your card details.
                </p>
                <div className="flex items-center text-body3 text-ink-muted" style={{ gap: '6px' }}>
                  <ShieldCheck className="w-4 h-4 text-success" />
                  <span>256-bit SSL encryption · PCI DSS compliant</span>
                </div>
              </div>
            </label>

            {/* Disabled: Cash on Delivery */}
            <label
              className="flex items-start rounded-card-sm border border-line-strong bg-line/30 p-4 opacity-60 cursor-not-allowed"
              style={{ gap: '12px' }}
              aria-disabled="true"
            >
              <input
                type="radio"
                name="payment"
                value="cod"
                disabled
                className="mt-1"
              />
              <div className="flex-1 flex flex-col" style={{ gap: '4px' }}>
                <div className="flex items-center justify-between">
                  <span className="text-body1 font-semibold text-ink-muted">
                    Cash on Delivery
                  </span>
                  <span className="rounded-pill bg-ink/10 text-ink-muted text-body3 px-2 py-0.5">
                    Unavailable
                  </span>
                </div>
                <p className="text-body2 text-ink-muted">
                  Currently unavailable. Please use a card payment.
                </p>
              </div>
            </label>
          </FormSection>
        </div>

        {/* === RIGHT: Order summary === */}
        <aside className="lg:sticky lg:top-8 self-start">
          <div className="rounded-card-sm border border-line-strong bg-white p-6 flex flex-col" style={{ gap: '24px' }}>
            <div className="flex items-center justify-between">
              <h2 className="font-sans font-bold text-ink" style={{ fontSize: '20px' }}>
                Order Summary
              </h2>
              <span className="rounded-pill bg-primary-200 text-ink-secondary text-body3 font-medium px-3 py-1">
                {cart?.itemsCount ?? 0} Items
              </span>
            </div>

            {/* Items list — compact (image + name + qty + price) */}
            <div className="flex flex-col" style={{ gap: '12px' }}>
              {items.map((item) => (
                <div key={item.product._id} className="flex items-center" style={{ gap: '12px' }}>
                  <div
                    className="shrink-0 rounded-card-sm overflow-hidden bg-primary-light flex items-center justify-center relative"
                    style={{ width: '56px', height: '56px' }}
                  >
                    {item.product.images?.[0] ? (
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="object-contain"
                        style={{ maxWidth: '85%', maxHeight: '85%' }}
                      />
                    ) : null}
                    {/* Qty badge */}
                    <span className="absolute -top-1 -right-1 bg-ink text-white text-xs font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-body2 text-ink line-clamp-2">
                      {item.product.name}
                    </div>
                  </div>
                  <span className="text-body2 font-semibold text-ink">
                    {formatCurrency(item.lineTotal)}
                  </span>
                </div>
              ))}
            </div>

            {/* Divider */}
            <div className="border-t border-line" />

            {/* Summary rows */}
            <div className="flex flex-col" style={{ gap: '12px' }}>
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

            {/* Place Order button */}
            <button
              type="button"
              onClick={handlePlaceOrder}
              disabled={
                createOrder.isPending ||
                checkout.isPending ||
                items.length === 0 ||
                !isFormValid()
              }
              className="rounded-pill bg-ink text-white font-bold flex items-center justify-center hover:bg-ink/90 transition-colors disabled:cursor-not-allowed disabled:opacity-60"
              style={{ height: '56px', gap: '8px' }}
            >
              {createOrder.isPending
                ? 'Creating order...'
                : checkout.isPending
                  ? 'Redirecting to Stripe...'
                  : (
                    <>
                      <Lock className="w-4 h-4" />
                      Place Order · {formatCurrency(total)}
                    </>
                  )}
            </button>

            {/* Trust line */}
            <p className="text-body3 text-ink-muted text-center flex items-center justify-center" style={{ gap: '6px' }}>
              <ShieldCheck className="w-4 h-4" />
              Secure checkout · Stripe encrypted
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}


function FormSection({
  title,
  step,
  children,
}: {
  title: string;
  step: number;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col" style={{ gap: '16px' }}>
      <div className="flex items-center" style={{ gap: '12px' }}>
        <span className="rounded-full bg-ink text-white font-bold w-7 h-7 flex items-center justify-center text-body2">
          {step}
        </span>
        <h2 className="font-sans font-bold text-ink" style={{ fontSize: '20px' }}>
          {title}
        </h2>
      </div>
      <div className="flex flex-col" style={{ gap: '12px' }}>
        {children}
      </div>
    </section>
  );
}


function Field({
  label,
  required,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col" style={{ gap: '6px' }}>
      <label className="text-body2 font-medium text-ink-secondary">
        {label}
        {required && <span className="text-danger"> *</span>}
      </label>
      {children}
      {hint && <p className="text-body3 text-ink-muted">{hint}</p>}
    </div>
  );
}

const inputClass =
  'rounded-card-sm border border-line-strong bg-white px-3 h-11 text-body2 text-ink placeholder:text-ink-muted focus:outline-none focus:border-brand transition-colors';


function PaymentBadge({ label }: { label: string }) {
  return (
    <span className="rounded-pill border border-line-strong bg-white text-body3 text-ink-secondary px-2 py-0.5 font-medium">
      {label}
    </span>
  );
}


function SummaryRow({
  label,
  value,
  labelClassName = 'text-ink-secondary',
  valueClassName = 'text-ink',
  size = 'md',
}: {
  label: string;
  value: string;
  labelClassName?: string;
  valueClassName?: string;
  size?: 'md' | 'lg';
}) {
  return (
    <div className="flex items-center justify-between">
      <span
        className={
          size === 'lg'
            ? `text-body1 ${labelClassName}`
            : `text-body2 ${labelClassName}`
        }
      >
        {label}
      </span>
      <span
        className={
          size === 'lg'
            ? `font-sans ${valueClassName}`
            : `text-body2 font-semibold ${valueClassName}`
        }
        style={size === 'lg' ? { fontSize: '24px' } : undefined}
      >
        {value}
      </span>
    </div>
  );
}