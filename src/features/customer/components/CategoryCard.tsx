import { useState } from 'react';
import type { Category } from '@shared/types';

// Card is non-clickable for now (catalog page comes in script 11/12).
export function CategoryCard({ category }: { category: Category }) {
  const [imageError, setImageError] = useState(false);
  const showImage = category.image && !imageError;

  return (
    <div className="rounded-card border border-line bg-white overflow-hidden flex flex-col">
      <div className="aspect-[4/3] bg-surface">
        {showImage ? (
          <img
            src={category.image}
            alt={category.name}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-1 text-ink-muted">
            <div className="text-h6 font-semibold">No image</div>
            <div className="text-body2">Upload via admin</div>
          </div>
        )}
      </div>
      <div className="p-6 text-center flex flex-col gap-1">
        <div className="text-h6 font-semibold text-ink">{category.name}</div>
        {category.description && (
          <div className="text-body2 text-ink-secondary">{category.description}</div>
        )}
      </div>
    </div>
  );
}
