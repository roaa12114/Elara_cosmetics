// Static brand decoration per user override of Rule 3.
// Backend has no /brands endpoint (Rule 7 — confirmed via curl 404 on production).
// User manually maintains this list + places logo PNGs at /public/images/brands/<filename>.
// When backend is extended with /brands endpoints, replace this file with a TanStack Query hook.

export type Brand = {
  name: string;
  logo: string;     // path under /public/, e.g. "/images/brands/topface.png"
  letter: string;   // first letter for A-Z grouping
};

function firstLetter(name: string): string {
  // Strip non-alphabetic chars (apostrophes, periods, digits, spaces), take first alpha
  const cleaned = name.replace(/[^A-Za-z]/g, '');
  return cleaned[0]?.toUpperCase() ?? '?';
}

function b(name: string, filename: string): Brand {
  return { name, logo: '/images/brands/' + filename, letter: firstLetter(name) };
}

// Slugify a name into a URL-safe slug (e.g. "Korean Beauty" → "korean-beauty", "L'Oreal Paris" → "loreal-paris")
export function categorySlug(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

export function brandSlug(name: string): string {
  return categorySlug(name);
}

// Brand list per category. Brand names are CORRECTED from Figma typos:
//   TobFace → Topface / Mack → MAC / Maybline → Maybelline /
//   La Roche-posay → La Roche-Posay / Neutrogens → Neutrogena / Avena → Avene
export const brandsByCategorySlug: Record<string, { title: string; brands: Brand[] }> = {
  makeup: {
    title: 'Makeup',
    brands: [
      b('Topface', 'topface.png'),
      b('NARS', 'nars.png'),
      b('Charlotte Tilbury', 'charlotte-tilbury.png'),
      b("L'Oreal Paris", 'loreal-paris.png'),
      b('Fenty Beauty', 'fenty-beauty.png'),
      b('e.l.f.', 'elf.png'),
      b('MAC', 'mac.png'),
      b('Maybelline', 'maybelline.png'),
    ],
  },
  skincare: {
    title: 'Skincare',
    brands: [
      b('Nivea', 'nivea.png'),
      b('La Roche-Posay', 'la-roche-posay.png'),
      b('Neutrogena', 'neutrogena.png'),
      b('Avene', 'avene.png'),
      b('Eucerin', 'eucerin.png'),
    ],
  },
  // NOTE: Figma's "Korean Products" column only listed "Skincare" and "Mackup"
  // (which look like typos). I used the visible brand logos on the right side
  // (COSRX, Anua, Beauty of Joseon) instead. Update this list to add more
  // Korean Beauty brands as you export their logos.
  'korean-beauty': {
    title: 'Korean Beauty',
    brands: [
      b('COSRX', 'cosrx.png'),
      b('Anua', 'anua.png'),
      b('Beauty of Joseon', 'beauty-of-joseon.png'),
    ],
  },
};

// Sorted unique letters across a brand list — used for the A-Z index.
// Only shows letters that have actual brands (e.g. Makeup → C, E, F, L, M, N, T).
export function getBrandLetters(brands: Brand[]): string[] {
  return Array.from(new Set(brands.map((b) => b.letter))).sort();
}

// Group brands by first letter — used to render letter sections
export function groupBrandsByLetter(brands: Brand[]): Record<string, Brand[]> {
  return brands.reduce<Record<string, Brand[]>>((acc, brand) => {
    (acc[brand.letter] = acc[brand.letter] ?? []).push(brand);
    return acc;
  }, {});
}