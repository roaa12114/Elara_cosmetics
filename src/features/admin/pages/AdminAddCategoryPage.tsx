import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Image as ImageIcon } from 'lucide-react';
import { AdminNavbar } from '../components/AdminNavbar';
import { useCreateCategory } from '@shared/hooks/useCreateCategory';
import { useToast } from '@/shared/ui';

export function AdminAddCategoryPage() {
  const navigate = useNavigate();
  const toast = useToast();
  const createCategory = useCreateCategory();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !description.trim()) {
      toast.error('Name and description are required');
      return;
    }
    createCategory.mutate(
      { name: name.trim(), description: description.trim(), image: image.trim() || 'https://placehold.co/400x400' },
      {
        onSuccess: () => {
          toast.success(`"${name.trim()}" created successfully`);
          navigate('/admin/categories');
        },
        onError: (err: { message?: string }) => toast.error(err?.message ?? 'Failed to create category'),
      },
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <AdminNavbar />
      <div className="flex flex-col" style={{ padding: '32px', gap: '24px', maxWidth: '600px' }}>
        <Link to="/admin/categories" className="flex items-center text-ink-secondary hover:text-ink no-underline" style={{ gap: '8px', fontSize: '16px' }}>
          <ArrowLeft className="w-5 h-5" /> Back to Categories
        </Link>
        <h1 className="font-bold text-ink" style={{ fontSize: '20px' }}>Add Category</h1>

        <form onSubmit={handleSubmit} className="bg-white" style={{ border: '1px solid var(--color-line)', borderRadius: '8px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Image URL */}
          <div className="flex flex-col" style={{ gap: '6px' }}>
            <label className="text-ink-secondary" style={{ fontSize: '14px' }}>Category Image (URL)</label>
            <div className="flex items-center" style={{ gap: '12px' }}>
              <div className="rounded-card-sm bg-primary-light flex items-center justify-center shrink-0" style={{ width: '64px', height: '64px' }}>
                {image ? <img src={image} alt="Preview" className="rounded-card-sm object-cover" style={{ width: '64px', height: '64px' }} /> : <ImageIcon className="w-6 h-6 text-ink-faint" />}
              </div>
              <input
                type="url"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="flex-1 bg-white text-ink"
                style={{ border: '1px solid var(--color-line)', borderRadius: '8px', padding: '12px', fontSize: '14px', height: '40px' }}
              />
            </div>
            <p className="text-ink-faint" style={{ fontSize: '12px' }}>Paste an image URL. The backend stores images as URL strings.</p>
          </div>

          {/* Name */}
          <div className="flex flex-col" style={{ gap: '6px' }}>
            <label className="text-ink-secondary" style={{ fontSize: '14px' }}>Category Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Makeup"
              className="w-full bg-white text-ink"
              style={{ border: '1px solid var(--color-line)', borderRadius: '8px', padding: '12px', fontSize: '14px', height: '40px' }}
              required
            />
          </div>

          {/* Description */}
          <div className="flex flex-col" style={{ gap: '6px' }}>
            <label className="text-ink-secondary" style={{ fontSize: '14px' }}>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Discover makeup products for everyday wear and special occasions..."
              rows={3}
              className="w-full bg-white text-ink"
              style={{ border: '1px solid var(--color-line)', borderRadius: '8px', padding: '12px', fontSize: '14px', resize: 'vertical' }}
              required
            />
          </div>

          {/* Status note */}
          <div className="flex flex-col" style={{ gap: '6px' }}>
            <label className="text-ink-secondary" style={{ fontSize: '14px' }}>Status</label>
            <span className="inline-flex items-center" style={{ background: 'var(--color-status-delivered-bg)', color: 'var(--color-success-text)', borderRadius: '6px', padding: '8px 16px', fontSize: '14px', fontWeight: 500, width: 'fit-content' }}>
              Active
            </span>
            <p className="text-ink-faint" style={{ fontSize: '12px' }}>New categories are created as Active by default. The backend does not accept a status field on creation.</p>
          </div>
        </form>

        <div className="flex items-center justify-end" style={{ gap: '12px' }}>
          <Link to="/admin/categories" className="text-ink-secondary no-underline" style={{ fontSize: '16px', fontWeight: 500, padding: '8px 16px' }}>Cancel</Link>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={createCategory.isPending}
            className="bg-ink text-white"
            style={{ borderRadius: 'var(--radius-pill)', padding: '8px 24px', fontSize: '16px', fontWeight: 500, height: '48px', opacity: createCategory.isPending ? 0.6 : 1 }}
          >
            {createCategory.isPending ? 'Creating...' : 'Create Category'}
          </button>
        </div>
      </div>
    </div>
  );
}