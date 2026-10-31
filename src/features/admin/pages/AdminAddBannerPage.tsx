import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload } from 'lucide-react';
import { AdminNavbar } from '../components/AdminNavbar';
import { useCreateBanner } from '@shared/hooks/useCreateBanner';
import { useToast } from '@/shared/ui';

export function AdminAddBannerPage() {
  const navigate = useNavigate();
  const toast = useToast();
  const createBanner = useCreateBanner();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [placement, setPlacement] = useState('Homepage Hero');
  const [buttonText, setButtonText] = useState('Shop Now');
  const [link, setLink] = useState('/collections/sale');
  const [isActive, setIsActive] = useState(true);
  const [startDate, setStartDate] = useState(new Date().toISOString().slice(0, 10));
  const [endDate, setEndDate] = useState(() => { const d = new Date(); d.setMonth(d.getMonth() + 1); return d.toISOString().slice(0, 10); });

  function handleSubmit() {
    if (!title.trim()) { toast.error('Title is required'); return; }
    if (!image.trim()) { toast.error('Image URL is required'); return; }
    createBanner.mutate(
      { title: title.trim(), image: image.trim(), link: link.trim() || '/', sortOrder: 1, isActive },
      {
        onSuccess: () => { toast.success(`Banner "${title.trim()}" created`); navigate('/admin/content'); },
        onError: (err: { message?: string }) => toast.error(err?.message ?? 'Failed to create banner'),
      },
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <AdminNavbar />
      <div className="flex flex-col" style={{ padding: '32px', gap: '24px', maxWidth: '900px' }}>
        <Link to="/admin/content" className="flex items-center text-ink-secondary hover:text-ink no-underline" style={{ gap: '8px', fontSize: '16px' }}>
          <ArrowLeft className="w-5 h-5" /> Back to Content
        </Link>
        <h1 className="font-bold text-ink" style={{ fontSize: '20px' }}>Add Banner</h1>

        <div className="grid" style={{ gridTemplateColumns: '1fr 320px', gap: '24px', alignItems: 'start' }}>
          <div className="bg-white" style={{ border: '1px solid var(--color-line)', borderRadius: '8px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="flex flex-col" style={{ gap: '6px' }}>
              <label className="text-ink-secondary" style={{ fontSize: '14px' }}>Banner Image</label>
              <div className="flex flex-col items-center justify-center" style={{ border: '2px dashed var(--color-line)', borderRadius: '8px', padding: '32px', gap: '8px', minHeight: '120px' }}>
                {image ? <img src={image} alt="Preview" className="rounded-card-sm object-cover" style={{ maxWidth: '100%', maxHeight: '200px' }} /> : <><Upload className="w-8 h-8 text-ink-faint" /><p className="text-ink" style={{ fontSize: '14px' }}>Drop image here or browse from device</p><p className="text-ink-faint" style={{ fontSize: '12px' }}>Recommended 1440×500px · JPG, PNG, WebP</p></>}
              </div>
              <input type="url" value={image} onChange={(e) => setImage(e.target.value)} placeholder="https://example.com/banner.jpg" className="w-full bg-white text-ink" style={{ border: '1px solid var(--color-line)', borderRadius: '8px', padding: '12px', fontSize: '14px', height: '40px' }} />
            </div>
            <div className="flex flex-col" style={{ gap: '6px' }}>
              <label className="text-ink-secondary" style={{ fontSize: '14px' }}>Title <span style={{ color: 'var(--color-danger-dark)' }}>*</span></label>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Summer Sale" className="w-full bg-white text-ink" style={{ border: '1px solid var(--color-line)', borderRadius: '8px', padding: '12px', fontSize: '14px', height: '40px' }} />
            </div>
            <div className="flex flex-col" style={{ gap: '6px' }}>
              <label className="text-ink-secondary" style={{ fontSize: '14px' }}>Description</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Premium skincare and makeup essentials..." rows={2} className="w-full bg-white text-ink" style={{ border: '1px solid var(--color-line)', borderRadius: '8px', padding: '12px', fontSize: '14px', resize: 'vertical' }} />
              <p className="text-ink-faint" style={{ fontSize: '12px' }}>Note: description is frontend-only — the backend does not store it yet.</p>
            </div>
          </div>

          <div className="bg-white" style={{ border: '1px solid var(--color-line)', borderRadius: '8px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px', position: 'sticky', top: '24px' }}>
            <h3 className="font-bold text-ink" style={{ fontSize: '16px' }}>Banner Settings</h3>
            <div className="flex flex-col" style={{ gap: '6px' }}>
              <label className="text-ink-secondary" style={{ fontSize: '14px' }}>Placement</label>
              <select value={placement} onChange={(e) => setPlacement(e.target.value)} className="w-full bg-white text-ink" style={{ border: '1px solid var(--color-line)', borderRadius: '8px', padding: '12px', fontSize: '14px', height: '40px' }}>
                <option>Homepage Hero</option><option>Homepage Banner</option><option>Collection Page</option><option>Promo Bar</option>
              </select>
            </div>
            <div className="flex flex-col" style={{ gap: '6px' }}>
              <label className="text-ink-secondary" style={{ fontSize: '14px' }}>Button Text</label>
              <input type="text" value={buttonText} onChange={(e) => setButtonText(e.target.value)} className="w-full bg-white text-ink" style={{ border: '1px solid var(--color-line)', borderRadius: '8px', padding: '12px', fontSize: '14px', height: '40px' }} />
            </div>
            <div className="flex flex-col" style={{ gap: '6px' }}>
              <label className="text-ink-secondary" style={{ fontSize: '14px' }}>Link</label>
              <input type="text" value={link} onChange={(e) => setLink(e.target.value)} className="w-full bg-white text-ink" style={{ border: '1px solid var(--color-line)', borderRadius: '8px', padding: '12px', fontSize: '14px', height: '40px' }} />
            </div>
            <div className="flex flex-col" style={{ gap: '6px' }}>
              <label className="text-ink-secondary" style={{ fontSize: '14px' }}>Status</label>
              <label className="flex items-center text-ink" style={{ gap: '8px', fontSize: '14px' }}>
                <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} /> Active
              </label>
            </div>
            <div className="grid grid-cols-2" style={{ gap: '12px' }}>
              <div className="flex flex-col" style={{ gap: '6px' }}>
                <label className="text-ink-secondary" style={{ fontSize: '14px' }}>Start date</label>
                <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full bg-white text-ink" style={{ border: '1px solid var(--color-line)', borderRadius: '8px', padding: '12px', fontSize: '14px', height: '40px' }} />
              </div>
              <div className="flex flex-col" style={{ gap: '6px' }}>
                <label className="text-ink-secondary" style={{ fontSize: '14px' }}>End date</label>
                <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-full bg-white text-ink" style={{ border: '1px solid var(--color-line)', borderRadius: '8px', padding: '12px', fontSize: '14px', height: '40px' }} />
              </div>
            </div>
            <p className="text-ink-faint" style={{ fontSize: '12px' }}>Note: placement, dates, and button text are frontend-only — the backend stores title, image, link, sortOrder, isActive.</p>
          </div>
        </div>

        <div className="flex items-center justify-end" style={{ gap: '12px' }}>
          <Link to="/admin/content" className="text-ink-secondary no-underline" style={{ fontSize: '16px', fontWeight: 500, padding: '8px 16px' }}>Cancel</Link>
          <button onClick={handleSubmit} disabled={createBanner.isPending} className="bg-ink text-white" style={{ borderRadius: 'var(--radius-pill)', padding: '8px 24px', fontSize: '16px', fontWeight: 500, height: '48px', opacity: createBanner.isPending ? 0.6 : 1 }}>
            {createBanner.isPending ? 'Saving...' : 'Save banner'}
          </button>
        </div>
      </div>
    </div>
  );
}