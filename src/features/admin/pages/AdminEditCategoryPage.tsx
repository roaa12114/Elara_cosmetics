import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Image as ImageIcon } from 'lucide-react';
import { AdminNavbar } from '../components/AdminNavbar';
import { useCategories } from '@shared/hooks/useCategories';
import { useToast } from '@/shared/ui';

export function AdminEditCategoryPage() {
  const { id } = useParams();
  const toast = useToast();
  const { data, isLoading } = useCategories({ limit: 100 });
  const category = data?.categories?.find((c) => c._id === id);

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <AdminNavbar />
        <div className="flex-1 flex items-center justify-center"><p className="text-ink-faint">Loading...</p></div>
      </div>
    );
  }
  if (!category) {
    return (
      <div className="flex flex-col min-h-screen">
        <AdminNavbar />
        <div className="flex-1 flex items-center justify-center"><p className="text-ink">Category not found</p></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <AdminNavbar />
      <div className="flex flex-col" style={{ padding: '32px', gap: '24px', maxWidth: '600px' }}>
        <Link to="/admin/categories" className="flex items-center text-ink-secondary hover:text-ink no-underline" style={{ gap: '8px', fontSize: '16px' }}>
          <ArrowLeft className="w-5 h-5" /> Back to Categories
        </Link>
        <h1 className="font-bold text-ink" style={{ fontSize: '20px' }}>Edit Category</h1>

        <div className="bg-white" style={{ border: '1px solid var(--color-line)', borderRadius: '8px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Image */}
          <div className="flex flex-col" style={{ gap: '6px' }}>
            <label className="text-ink-secondary" style={{ fontSize: '14px' }}>Category Image (URL)</label>
            <div className="flex items-center" style={{ gap: '12px' }}>
              <div className="rounded-card-sm bg-primary-light flex items-center justify-center shrink-0" style={{ width: '64px', height: '64px' }}>
                {category.image ? <img src={category.image} alt={category.name} className="rounded-card-sm object-cover" style={{ width: '64px', height: '64px' }} /> : <ImageIcon className="w-6 h-6 text-ink-faint" />}
              </div>
              <input
                type="url"
                defaultValue={category.image}
                className="flex-1 bg-white text-ink"
                style={{ border: '1px solid var(--color-line)', borderRadius: '8px', padding: '12px', fontSize: '14px', height: '40px' }}
              />
            </div>
          </div>

          {/* Name */}
          <div className="flex flex-col" style={{ gap: '6px' }}>
            <label className="text-ink-secondary" style={{ fontSize: '14px' }}>Category Name</label>
            <input
              type="text"
              defaultValue={category.name}
              className="w-full bg-white text-ink"
              style={{ border: '1px solid var(--color-line)', borderRadius: '8px', padding: '12px', fontSize: '14px', height: '40px' }}
            />
          </div>

          {/* Description */}
          <div className="flex flex-col" style={{ gap: '6px' }}>
            <label className="text-ink-secondary" style={{ fontSize: '14px' }}>Description</label>
            <textarea
              defaultValue={category.description}
              rows={3}
              className="w-full bg-white text-ink"
              style={{ border: '1px solid var(--color-line)', borderRadius: '8px', padding: '12px', fontSize: '14px', resize: 'vertical' }}
            />
          </div>

          {/* Status (read-only) */}
          <div className="flex flex-col" style={{ gap: '6px' }}>
            <label className="text-ink-secondary" style={{ fontSize: '14px' }}>Status</label>
            <span className="inline-flex items-center" style={{
              background: category.isActive ? 'var(--color-status-delivered-bg)' : 'var(--color-status-out-of-stock-bg)',
              color: category.isActive ? 'var(--color-success-text)' : '#171315',
              borderRadius: '6px', padding: '8px 16px', fontSize: '14px', fontWeight: 500, width: 'fit-content',
            }}>
              {category.isActive ? 'Active' : 'Inactive'}
            </span>
            <p className="text-ink-faint" style={{ fontSize: '12px' }}>Status changes require a backend PATCH endpoint (not yet available).</p>
          </div>
        </div>

        <div className="flex items-center justify-end" style={{ gap: '12px' }}>
          <Link to="/admin/categories" className="text-ink-secondary no-underline" style={{ fontSize: '16px', fontWeight: 500, padding: '8px 16px' }}>Cancel</Link>
          <button
            onClick={() => toast.show('Category editing is in demo mode — no PATCH endpoint available')}
            className="bg-ink text-white"
            style={{ borderRadius: 'var(--radius-pill)', padding: '8px 24px', fontSize: '16px', fontWeight: 500, height: '48px' }}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}