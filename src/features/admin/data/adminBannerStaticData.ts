import type { AdminBanner } from '@shared/hooks/useAdminBanners';

export type BannerStatus = 'Active' | 'Scheduled' | 'Inactive';

export interface BannerDisplay {
  description: string;
  placement: string;
  buttonText: string;
  startDate: string;
  endDate: string;
  status: BannerStatus;
  imageFilename: string;
  imageDimensions: string;
  imageFormat: string;
  imageSize: string;
}

function hashId(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) | 0;
  return Math.abs(h);
}

const DESCRIPTIONS = [
  'Premium skincare and makeup essentials, curated for your everyday beauty ritual.',
  'Discover our new collection of handcrafted beauty products.',
  'Get ready for summer with our exclusive skincare sale.',
  'Natural glow starts here. Shop our organic beauty line.',
];
const PLACEMENTS = ['Homepage Hero', 'Homepage Banner', 'Collection Page', 'Promo Bar'];
const BUTTON_TEXTS = ['Shop Now', 'Explore', 'Discover', 'Buy Now'];
const DATES = [
  { start: 'Jun 01, 2026', end: 'Jun 30, 2026' },
  { start: 'Jul 01, 2026', end: 'Jul 31, 2026' },
  { start: 'Aug 01, 2026', end: 'Aug 31, 2026' },
  { start: 'Sep 01, 2026', end: 'Sep 30, 2026' },
];
const FILENAMES = ['banner-summer-sale.jpg', 'banner-new-collection.jpg', 'banner-skincare.jpg', 'banner-glow.jpg'];

export function getBannerDisplay(banner: AdminBanner): BannerDisplay {
  const h = hashId(banner._id || banner.title);
  const dates = DATES[h % DATES.length];
  const now = new Date();
  const start = new Date(dates.start);
  const end = new Date(dates.end);
  let status: BannerStatus = 'Inactive';
  if (banner.isActive) {
    if (now < start) status = 'Scheduled';
    else if (now > end) status = 'Inactive';
    else status = 'Active';
  }
  return {
    description: DESCRIPTIONS[h % DESCRIPTIONS.length],
    placement: PLACEMENTS[h % PLACEMENTS.length],
    buttonText: BUTTON_TEXTS[h % BUTTON_TEXTS.length],
    startDate: dates.start,
    endDate: dates.end,
    status,
    imageFilename: FILENAMES[h % FILENAMES.length],
    imageDimensions: '1440 × 500 px',
    imageFormat: 'JPG',
    imageSize: '250 KB',
  };
}