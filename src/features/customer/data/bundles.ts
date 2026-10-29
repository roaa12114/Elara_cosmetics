export type Bundle = {
  slug: string;
  name: string;
  description: string;
  price: number;
  originalPrice: number;
  rating: number;
  productCount: number;
  badge: string;
  badgeColor: 'gold' | 'danger' | 'ink';
  countdown?: string;
  image: string;
  type: 'Gift Bundle' | 'Routine' | 'Essentials';
  category: string;
};

export const bundles: Bundle[] = [
  { slug: 'glow-essential-1', name: 'Glow Essential Bundle', description: 'Curated set for a radiant, glowing complexion. Includes cleanser, serum, and moisturizer.', price: 200, originalPrice: 500, rating: 4.5, productCount: 3, badge: 'Best Seller', badgeColor: 'gold', image: '/images/home/bundles/bundle-1.png', type: 'Gift Bundle', category: 'Skincare' },
  { slug: 'glow-essential-2', name: 'Daily Care Routine Set', description: 'Complete daily skincare routine with gentle cleanser, hydrating toner, and SPF moisturizer.', price: 180, originalPrice: 450, rating: 4.5, productCount: 3, badge: 'New', badgeColor: 'gold', image: '/images/home/bundles/bundle-2.png', type: 'Routine', category: 'Skincare' },
  { slug: 'glow-essential-3', name: 'Makeup Artist Essentials', description: 'Professional-grade makeup essentials for a flawless look. Foundation, blush, and lip color.', price: 220, originalPrice: 550, rating: 4.5, productCount: 3, badge: 'Save 20%', badgeColor: 'danger', countdown: '15:34:21', image: '/images/home/bundles/bundle-3.png', type: 'Essentials', category: 'Makeup' },
  { slug: 'glow-essential-4', name: 'Korean Glass Skin Set', description: 'Achieve the coveted Korean glass skin look with essence, serum, and sunscreen.', price: 250, originalPrice: 600, rating: 4.5, productCount: 3, badge: 'Save 20%', badgeColor: 'danger', countdown: '15:34:21', image: '/images/home/bundles/bundle-4.png', type: 'Gift Bundle', category: 'Korean Beauty' },
  { slug: 'brow-lash-care-set', name: 'Brow & Lash Care Serum Set', description: 'Complete brow and lash care routine with growth serum, conditioning gel, and sculpting wax.', price: 200, originalPrice: 500, rating: 4.6, productCount: 2, badge: 'Best Seller', badgeColor: 'gold', image: '/images/home/bundles/bundle-1.png', type: 'Essentials', category: 'Makeup' },
  { slug: 'night-repair-routine', name: 'Night Repair Routine', description: 'Overnight repair system with retinol serum, night cream, and eye treatment.', price: 190, originalPrice: 480, rating: 4.5, productCount: 3, badge: 'New', badgeColor: 'gold', image: '/images/home/bundles/bundle-2.png', type: 'Routine', category: 'Skincare' },
  { slug: 'travel-beauty-kit', name: 'Travel Beauty Essentials Kit', description: 'Compact travel-size makeup and skincare essentials for beauty on the go.', price: 150, originalPrice: 400, rating: 4.5, productCount: 4, badge: 'Save 20%', badgeColor: 'danger', image: '/images/home/bundles/bundle-3.png', type: 'Gift Bundle', category: 'Makeup' },
  { slug: 'korean-glow-routine', name: 'Korean Glow Routine Set', description: 'Achieve luminous Korean glass skin with toner, essence, and lightweight moisturizer.', price: 230, originalPrice: 520, rating: 4.5, productCount: 3, badge: 'Best Seller', badgeColor: 'gold', image: '/images/home/bundles/bundle-4.png', type: 'Routine', category: 'Korean Beauty' },
];

export function getBundleBySlug(slug: string): Bundle | undefined {
  return bundles.find((b) => b.slug === slug);
}