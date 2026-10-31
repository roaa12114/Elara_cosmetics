import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, X, Plus } from 'lucide-react';
import { SellerNavbar } from '../components/SellerNavbar';
import { useCategories } from '@shared/hooks/useCategories';
import { useCreateProduct } from '@shared/hooks/useCreateProduct';
import { useToast } from '@/shared/ui';
import type { CreateProductRequest } from '@shared/types';

const PRODUCT_META_KEY = 'elara_product_meta';

export function SellerAddProductPage() {
  const navigate = useNavigate();
  const toast = useToast();
  const { data: catData } = useCategories({ limit: 10 });
  const createProduct = useCreateProduct();
  const categories = catData?.categories ?? [];

  const [form, setForm] = useState({
    name: '', description: '', price: '', stock: '', category: '',
    images: [''], brand: '', ingredients: '',
  });

  function updateField<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }
  function updateImage(index: number, value: string) {
    setForm((f) => { const images = [...f.images]; images[index] = value; return { ...f, images }; });
  }
  function addImageField() { setForm((f) => ({ ...f, images: [...f.images, ''] })); }
  function removeImageField(index: number) { setForm((f) => ({ ...f, images: f.images.filter((_, i) => i !== index) })); }

  async function handleSubmit() {
    if (!form.name.trim() || !form.price || !form.stock || !form.category) {
      toast.error('Please fill in product name, price, stock, and category.'); return;
    }
    const body: CreateProductRequest = {
      name: form.name.trim(), description: form.description.trim(),
      price: parseFloat(form.price), stock: parseInt(form.stock, 10),
      category: form.category, images: form.images.filter((url) => url.trim() !== ''),
    };
    try {
      const result = await createProduct.mutateAsync(body);
      const productId = result.product._id;
      localStorage.setItem(`${PRODUCT_META_KEY}_${productId}`, JSON.stringify({
        brand: form.brand.trim(), ingredients: form.ingredients.trim(),
      }));
      toast.success('Product created successfully');
      navigate(`/seller/products/${productId}`);
    } catch (err) {
      const error = err as { message?: string };
      toast.error(error?.message ?? 'Failed to create product');
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <SellerNavbar />
      <div className="flex flex-col" style={{ padding: '32px', gap: '24px', maxWidth: '900px' }}>
        <div className="flex items-center" style={{ gap: '12px' }}>
          <Link to="/seller/products" className="text-ink-secondary hover:text-ink no-underline"><ArrowLeft className="w-5 h-5" /></Link>
          <h1 className="font-bold text-ink" style={{ fontSize: '20px' }}>Add New Product</h1>
        </div>

        <Section title="Product Images">
          <div className="flex flex-col" style={{ gap: '8px' }}>
            {form.images.map((url, i) => (
              <div key={i} className="flex items-center" style={{ gap: '8px' }}>
                <div className="rounded-card-sm bg-primary-light shrink-0 overflow-hidden flex items-center justify-center" style={{ width: '64px', height: '64px' }}>
                  {url ? <img src={url} alt="" className="w-full h-full object-cover" /> : <span className="text-ink-faint" style={{ fontSize: '12px' }}>No img</span>}
                </div>
                <input type="url" value={url} onChange={(e) => updateImage(i, e.target.value)} placeholder="https://example.com/image.jpg"
                  className="flex-1 bg-white text-ink" style={{ border: '1px solid var(--color-line)', borderRadius: '8px', padding: '8px 12px', fontSize: '14px', height: '40px' }} />
                {form.images.length > 1 && (<button onClick={() => removeImageField(i)} className="text-ink-faint hover:text-danger"><X className="w-4 h-4" /></button>)}
              </div>
            ))}
            <button onClick={addImageField} className="flex items-center text-ink-secondary hover:text-ink" style={{ gap: '6px', fontSize: '14px' }}>
              <Plus className="w-4 h-4" /> Add another image
            </button>
          </div>
        </Section>

        <Section title="Basic Information">
          <Field label="Product Name" required>
            <input type="text" value={form.name} onChange={(e) => updateField('name', e.target.value)} placeholder="e.g. Velvet Luxe Lipstick"
              className="w-full bg-white text-ink" style={{ border: '1px solid var(--color-line)', borderRadius: '8px', padding: '8px 12px', fontSize: '14px', height: '40px' }} />
          </Field>
          <Field label="Category" required>
            <select value={form.category} onChange={(e) => updateField('category', e.target.value)}
              className="w-full bg-white text-ink" style={{ border: '1px solid var(--color-line)', borderRadius: '8px', padding: '8px 12px', fontSize: '14px', height: '40px' }}>
              <option value="">Select category</option>
              {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
            </select>
          </Field>
          <Field label="Brand" hint="Stored locally (not synced to backend yet)">
            <input type="text" value={form.brand} onChange={(e) => updateField('brand', e.target.value)} placeholder="e.g. Lumière"
              className="w-full bg-white text-ink" style={{ border: '1px solid var(--color-line)', borderRadius: '8px', padding: '8px 12px', fontSize: '14px', height: '40px' }} />
          </Field>
          <Field label="Description">
            <textarea value={form.description} onChange={(e) => updateField('description', e.target.value)} placeholder="Describe your product..." rows={4}
              className="w-full bg-white text-ink" style={{ border: '1px solid var(--color-line)', borderRadius: '8px', padding: '8px 12px', fontSize: '14px', resize: 'vertical' }} />
          </Field>
        </Section>

        <Section title="Pricing & Inventory">
          <div className="grid grid-cols-2" style={{ gap: '16px' }}>
            <Field label="Price (£)" required>
              <input type="number" step="0.01" min="0" value={form.price} onChange={(e) => updateField('price', e.target.value)} placeholder="0.00"
                className="w-full bg-white text-ink" style={{ border: '1px solid var(--color-line)', borderRadius: '8px', padding: '8px 12px', fontSize: '14px', height: '40px' }} />
            </Field>
            <Field label="Stock Quantity" required>
              <input type="number" min="0" value={form.stock} onChange={(e) => updateField('stock', e.target.value)} placeholder="0"
                className="w-full bg-white text-ink" style={{ border: '1px solid var(--color-line)', borderRadius: '8px', padding: '8px 12px', fontSize: '14px', height: '40px' }} />
            </Field>
          </div>
        </Section>

        <Section title="Ingredients" subtitle="Stored locally — not synced to backend yet">
          <textarea value={form.ingredients} onChange={(e) => updateField('ingredients', e.target.value)} placeholder="Aqua, Glycerin, Hyaluronic Acid..." rows={3}
            className="w-full bg-white text-ink" style={{ border: '1px solid var(--color-line)', borderRadius: '8px', padding: '8px 12px', fontSize: '14px', resize: 'vertical' }} />
        </Section>

        <div className="flex items-center justify-end" style={{ gap: '12px' }}>
          <Link to="/seller/products" className="text-ink-secondary hover:text-ink no-underline" style={{ fontSize: '16px', fontWeight: 500, padding: '8px 16px' }}>Cancel</Link>
          <button onClick={handleSubmit} disabled={createProduct.isPending}
            className="bg-ink text-white" style={{ borderRadius: 'var(--radius-pill)', padding: '8px 24px', fontSize: '16px', fontWeight: 500, height: '48px', display: 'flex', alignItems: 'center', gap: '8px', opacity: createProduct.isPending ? 0.6 : 1, cursor: createProduct.isPending ? 'not-allowed' : 'pointer' }}>
            {createProduct.isPending ? 'Saving...' : 'Save Product'}
          </button>
        </div>
      </div>
    </div>
  );
}

function Section({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div className="bg-white" style={{ border: '1px solid var(--color-line)', borderRadius: '8px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div>
        <h3 className="font-bold text-ink" style={{ fontSize: '16px' }}>{title}</h3>
        {subtitle && <p className="text-ink-faint" style={{ fontSize: '12px', marginTop: '4px' }}>{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}

function Field({ label, required, hint, children }: { label: string; required?: boolean; hint?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col" style={{ gap: '6px' }}>
      <label className="text-ink-secondary" style={{ fontSize: '14px' }}>{label}{required && <span className="text-danger"> *</span>}</label>
      {children}
      {hint && <p className="text-ink-faint" style={{ fontSize: '12px' }}>{hint}</p>}
    </div>
  );
}