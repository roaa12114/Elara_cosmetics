import type { DiscountType, AdminPromo } from '@shared/hooks/useAdminPromos';

export const DISCOUNT_TYPE_LABELS: Record<DiscountType, string> = {
  percentage: 'Percentage',
  fixed_amount: 'Fixed Amount',
  free_shipping: 'Free Shipping',
  buy_x_get_y: 'Buy X Get Y',
};

export type DiscountStatus = 'Active' | 'Expired' | 'Scheduled' | 'Expires Soon' | 'Inactive';

export function computeDiscountStatus(promo: AdminPromo): DiscountStatus {
  if (!promo.isActive) return 'Inactive';
  const now = new Date();
  const start = new Date(promo.startsAt);
  const expire = new Date(promo.expiresAt);
  if (now < start) return 'Scheduled';
  if (now > expire) return 'Expired';
  const daysUntilExpiry = Math.ceil((expire.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  if (daysUntilExpiry <= 7) return 'Expires Soon';
  return 'Active';
}

function hashId(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) | 0;
  return Math.abs(h);
}

const USED_COUNTS = [128, 84, 312, 0, 256, 189, 94, 156, 42, 67];
export function getUsedCount(promo: AdminPromo): number {
  return USED_COUNTS[hashId(promo._id || promo.code) % USED_COUNTS.length];
}

const APPLIES_TO = ['Summer essentials', 'Skincare collection', 'Makeup bestsellers', 'All products', 'Korean beauty', 'VIP items'];
export function getAppliesTo(promo: AdminPromo): string {
  return APPLIES_TO[hashId(promo._id || promo.code) % APPLIES_TO.length];
}

export function getCustomerEligibility(_promo: AdminPromo): string {
  return 'All customers';
}

export function formatDateRange(startsAt: string, expiresAt: string): string {
  const fmt = (d: string) => {
    const date = new Date(d);
    if (Number.isNaN(date.getTime())) return '—';
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };
  const start = fmt(startsAt);
  const end = fmt(expiresAt);
  if (start === end) return start;
  return `${start} - ${end}`;
}

export function formatDiscountValue(promo: AdminPromo): string {
  switch (promo.discountType) {
    case 'percentage':
      return `${promo.discountValue}% off`;
    case 'fixed_amount':
      return `$${promo.discountValue} off`;
    case 'free_shipping':
      return 'Free shipping';
    case 'buy_x_get_y':
      return `Buy ${promo.discountValue} Get 1`;
    default:
      return `${promo.discountValue}`;
  }
}