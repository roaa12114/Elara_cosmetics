import { useState } from 'react';
import type { Category } from '@shared/types';
import { cx } from '@shared/lib/cx';

type CategoryCardProps = {
  category: Category;
  wide?: boolean;
  className?: string;
};

export function CategoryCard({ category, wide = false, className }: CategoryCardProps) {
  const [imageError, setImageError] = useState(false);
  const showImage = category.image && !imageError;

  return (
    <div className={cx('relative h-[298px] overflow-hidden rounded-card bg-primary-light', className)}>
      <div
        className={cx(
          'absolute top-1/2 flex w-[304px] -translate-y-1/2 flex-col gap-1 text-center',
          wide ? 'left-1/2 -translate-x-1/2' : 'left-6',
        )}
      >
        <h3 className="text-h5 font-semibold text-ink">{category.name}</h3>
        {category.description && <p className="text-body2 text-ink-secondary">{category.description}</p>}
      </div>
      {showImage && (
        <img
          src={category.image}
          alt=""
          aria-hidden="true"
          className={cx('absolute right-0 top-0 h-full object-cover', wide ? 'w-[436px]' : 'w-[326px]')}
          onError={() => setImageError(true)}
        />
      )}
    </div>
  );
}