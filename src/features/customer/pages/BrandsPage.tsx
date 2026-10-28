import { useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  brandsByCategorySlug,
  getBrandLetters,
  groupBrandsByLetter,
  brandSlug,
} from '../data/brands';

export function BrandsPage() {
  const { categorySlug: slug } = useParams();
  const entry = slug ? brandsByCategorySlug[slug] : undefined;
  const letterRefs = useRef<Record<string, HTMLDivElement | null>>({});

  if (!entry) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-16 text-center">
        <h1 className="text-h5 font-semibold text-ink">Unknown category</h1>
        <p className="mt-4 text-body2 text-ink-secondary">
          We don't have a brand list for this category yet.
        </p>
        <Link to="/" className="mt-6 inline-block text-body1 font-bold text-brand hover:underline">
          Back to home →
        </Link>
      </div>
    );
  }

  const letters = getBrandLetters(entry.brands);
  const grouped = groupBrandsByLetter(entry.brands);

  function scrollToLetter(letter: string) {
    letterRefs.current[letter]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  return (
    <div
      className="max-w-[1281px] mx-auto px-6 lg:px-20 py-10 flex flex-col"
      style={{ gap: '40px' }}
    >
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-body1" aria-label="Breadcrumb">
        <Link to="/" className="text-ink-secondary hover:text-ink">Home</Link>
        <span className="text-ink-muted">/</span>
        <span className="text-ink-secondary">{entry.title}</span>
        <span className="text-ink-muted">/</span>
        <span className="text-ink font-medium">All Brands</span>
      </nav>

      {/* Title + letter index */}
      <div className="flex flex-col items-center" style={{ gap: '32px' }}>
        <h1 className="font-semibold text-ink-secondary" style={{ fontSize: '24px', lineHeight: '28px' }}>
          All Brands
        </h1>

        <div className="flex items-center flex-wrap justify-center" style={{ gap: '40px' }}>
          {letters.map((letter) => (
            <button
              key={letter}
              type="button"
              onClick={() => scrollToLetter(letter)}
              className="font-semibold text-ink-muted hover:text-brand transition-colors"
              style={{ fontSize: '20px', lineHeight: '28px' }}
              aria-label={`Jump to brands starting with ${letter}`}
            >
              {letter}
            </button>
          ))}
        </div>
      </div>

      {/* Horizontal line */}
      <hr className="w-full border-line" />

      {/* Brand sections by letter */}
      <div className="flex flex-col" style={{ gap: '40px' }}>
        {Object.entries(grouped)
          .sort(([a], [c]) => a.localeCompare(c))
          .map(([letter, brands]) => (
            <div
              key={letter}
              ref={(el) => { letterRefs.current[letter] = el; }}
              className="flex flex-col scroll-mt-24"
              style={{ gap: '20px' }}
            >
              <h2 className="font-semibold text-ink-secondary" style={{ fontSize: '32px', lineHeight: '38px' }}>
                {letter}
              </h2>
              <div
                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
                style={{ gap: '24px' }}
              >
                {brands.map((brand) => (
                  <Link
                    key={brand.name}
                    to={`/brands/${slug}/${brandSlug(brand.name)}`}
                    className="rounded-card-sm bg-white border border-line p-6 flex flex-col items-center justify-center hover:shadow-brand-sm transition-shadow"
                    style={{ aspectRatio: '288 / 228' }}
                  >
                    <img
                      src={brand.logo}
                      alt={brand.name}
                      className="max-w-full max-h-[140px] object-contain"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                    <div className="mt-3 text-body2 text-ink-secondary text-center">{brand.name}</div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}