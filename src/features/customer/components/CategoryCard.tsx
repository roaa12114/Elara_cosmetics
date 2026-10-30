import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { Category } from '@shared/types';
import { categorySlug } from '../data/brands';

export function CategoryCard({ category }: { category: Category }) {
  const [imageError, setImageError] = useState(false);
  const showImage = category.image && !imageError;
  const slug = categorySlug(category.name);

  return (
    <Link
      to={`/brands/${slug}`}
      className="relative block w-full rounded-card-sm overflow-hidden bg-white transition-transform hover:scale-[1.02]"
      style={{ aspectRatio: '628 / 298' }}
    >
      {showImage ? (
        <img
          src={category.image}
          alt={category.name}
          className="absolute inset-0 w-full h-full object-cover"
          style={{ objectPosition: 'center center' }}
          onError={() => setImageError(true)}
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 text-ink-muted">
          <div className="text-h6 font-semibold">No image</div>
          <div className="text-body2">Set image URL in admin</div>
        </div>
      )}
    </Link>
  );
}