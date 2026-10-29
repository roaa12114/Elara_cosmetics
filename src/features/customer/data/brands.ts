export type Brand = {
  name: string;
  logo: string;
  letter: string;
  searchTerm: string;
};

function firstLetter(name: string): string {
  const cleaned = name.replace(/[^A-Za-z]/g, '');
  return cleaned[0]?.toUpperCase() ?? '?';
}

function b(name: string, filename: string, searchTerm?: string): Brand {
  return {
    name,
    logo: '/images/brands/' + filename,
    letter: firstLetter(name),
    searchTerm: searchTerm ?? name,
  };
}

export function categorySlug(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

export function brandSlug(name: string): string {
  return categorySlug(name);
}

export const brandsByCategorySlug: Record<string, { title: string; brands: Brand[] }> = {
  makeup: {
    title: 'Makeup',
    brands: [
      b('Topface', 'topface.png', 'Topface'),
      b('NARS', 'nars.png', 'NARS'),
      b('Charlotte Tilbury', 'charlotte-tilbury.png', 'Charlotte Tilbury'),
      b("L'Oreal Paris", 'loreal-paris.png', 'Oreal Paris'),
      b('Fenty Beauty', 'fenty-beauty.png', 'Fenty Beauty'),
      b('e.l.f.', 'elf.png', 'e.l.f.'),
      b('MAC', 'mac.png', 'MAC'),
      b('Maybelline', 'maybelline.png', 'Maybelline'),
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
  'korean-beauty': {
    title: 'Korean Beauty',
    brands: [
      b('COSRX', 'cosrx.png'),
      b('Anua', 'anua.png'),
      b('Beauty of Joseon', 'beauty-of-joseon.png'),
    ],
  },
};

export function getBrandLetters(brands: Brand[]): string[] {
  return Array.from(new Set(brands.map((b) => b.letter))).sort();
}

export function groupBrandsByLetter(brands: Brand[]): Record<string, Brand[]> {
  return brands.reduce<Record<string, Brand[]>>((acc, brand) => {
    (acc[brand.letter] = acc[brand.letter] ?? []).push(brand);
    return acc;
  }, {});
}