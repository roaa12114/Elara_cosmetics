import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, MoreVertical, Pencil, Trash2, Eye } from 'lucide-react';
import { SellerNavbar } from '../components/SellerNavbar';
import { useProducts } from '@shared/hooks/useProducts';
import { useAuth } from '@shared/lib/useAuth';
import { useDeleteProduct } from '@shared/hooks/useDeleteProduct';
import { useToast } from '@/shared/ui';
import { formatCurrency, formatDate } from '@shared/lib/utils';
import type { Product } from '@shared/types';

const CATEGORIES = ['All Categories', 'Korean Beauty', 'Makeup', 'Skincare'];
const STATUSES = ['All Status', 'Active', 'Inactive'];
const SORTS = [
  { label: 'Date (newest)', value: 'newest' as const },
  { label: 'Date (oldest)', value: 'oldest' as const },
  { label: 'Price (low to high)', value: 'price_asc' as const },
  { label: 'Price (high to low)', value: 'price_desc' as const },
];

export function SellerProductsPage() {
  const { user } = useAuth();
  const toast = useToast();
  const deleteProduct = useDeleteProduct();
  const [categoryFilter, setCategoryFilter] = useState('All Categories');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [sort, setSort] = useState<'newest' | 'oldest' | 'price_asc' | 'price_desc'>('newest');
  const [page, setPage] = useState(1);
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const limit = 10;
  const { data, isLoading } = useProducts({ sort, page, limit: 100 });

  const sellerId = user?.id;
  const allSellerProducts = (data?.products ?? []).filter(
    (p) => typeof p.seller === 'object' && p.seller._id === sellerId,
  );

  const filtered = allSellerProducts.filter((p) => {
    if (categoryFilter !== 'All Categories' && p.category?.name !== categoryFilter) return false;
    if (statusFilter === 'Active' && !p.isActive) return false;
    if (statusFilter === 'Inactive' && p.isActive) return false;
    return true;
  });

  const totalPages = Math.ceil(filtered.length / limit) || 1;
  const paginated = filtered.slice((page - 1) * limit, page * limit);

  function handleDelete(p: Product) {
    if (!confirm(`Delete "${p.name}"? This will deactivate the product.`)) return;
    deleteProduct.mutate(
      { productId: p._id },
      {
        onSuccess: () => toast.success(`"${p.name}" deleted`),
        onError: (err: unknown) => {
          const error = err as { message?: string };
          toast.error(error?.message ?? 'Failed to delete product');
        },
      },
    );
    setOpenMenu(null);
  }

  return (
    <div className="flex flex-col min-h-screen">
      <SellerNavbar />
      <div className="flex flex-col" style={{ padding: '32px', gap: '24px' }}>
        <div className="flex items-center justify-between">
          <h1 className="font-bold text-ink" style={{ fontSize: '20px' }}>Products</h1>
          <Link to="/seller/products/new" className="flex items-center bg-ink text-white no-underline"
            style={{ borderRadius: 'var(--radius-pill)', padding: '8px 16px', gap: '8px', fontSize: '18px', fontWeight: 500, height: '48px' }}>
            <Plus className="w-5 h-5" /> Add Product
          </Link>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center" style={{ gap: '8px' }}>
            <select value={categoryFilter} onChange={(e) => { setCategoryFilter(e.target.value); setPage(1); }}
              className="bg-white text-ink-secondary" style={{ border: '1px solid var(--color-line)', borderRadius: '8px', padding: '8px 16px', fontSize: '14px', height: '40px' }}>
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
            <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
              className="bg-white text-ink-secondary" style={{ border: '1px solid var(--color-line)', borderRadius: '8px', padding: '8px 16px', fontSize: '14px', height: '40px' }}>
              {STATUSES.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
          <select value={sort} onChange={(e) => { setSort(e.target.value as typeof sort); setPage(1); }}
            className="bg-white text-ink-secondary" style={{ border: '1px solid var(--color-line)', borderRadius: '8px', padding: '8px 16px', fontSize: '14px', height: '40px' }}>
            {SORTS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </div>

        {isLoading ? (
          <div className="bg-white" style={{ border: '1px solid var(--color-line)', borderRadius: '8px', padding: '48px', textAlign: 'center' }}>
            <p className="text-ink-faint">Loading products...</p>
          </div>
        ) : paginated.length === 0 ? (
          <div className="bg-white" style={{ border: '1px solid var(--color-line)', borderRadius: '8px', padding: '48px', textAlign: 'center' }}>
            <p className="text-ink" style={{ fontSize: '18px', fontWeight: 600, marginBottom: '8px' }}>No products yet</p>
            <p className="text-ink-faint" style={{ fontSize: '14px', marginBottom: '16px' }}>Create your first product to start selling.</p>
            <Link to="/seller/products/new" className="inline-flex items-center bg-ink text-white no-underline"
              style={{ borderRadius: 'var(--radius-pill)', padding: '8px 16px', gap: '8px', fontSize: '16px', fontWeight: 500 }}>
              <Plus className="w-4 h-4" /> Add Product
            </Link>
          </div>
        ) : (
          <div className="bg-white overflow-hidden" style={{ border: '1px solid var(--color-line)', borderRadius: '8px' }}>
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: '1px solid var(--color-line)', background: '#FFF9F9' }}>
                  <th className="text-left font-bold text-ink-secondary" style={{ padding: '12px 16px', fontSize: '12px', textTransform: 'uppercase' }}>Product</th>
                  <th className="text-left font-bold text-ink-secondary" style={{ padding: '12px 16px', fontSize: '12px', textTransform: 'uppercase' }}>Category</th>
                  <th className="text-right font-bold text-ink-secondary" style={{ padding: '12px 16px', fontSize: '12px', textTransform: 'uppercase' }}>Price</th>
                  <th className="text-center font-bold text-ink-secondary" style={{ padding: '12px 16px', fontSize: '12px', textTransform: 'uppercase' }}>Stock</th>
                  <th className="text-center font-bold text-ink-secondary" style={{ padding: '12px 16px', fontSize: '12px', textTransform: 'uppercase' }}>Status</th>
                  <th className="text-left font-bold text-ink-secondary" style={{ padding: '12px 16px', fontSize: '12px', textTransform: 'uppercase' }}>Date</th>
                  <th className="text-center font-bold text-ink-secondary" style={{ padding: '12px 16px', fontSize: '12px', textTransform: 'uppercase' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((p) => (
                  <tr key={p._id} style={{ borderBottom: '1px solid var(--color-line)' }} className="hover:bg-surface transition-colors">
                    <td style={{ padding: '12px 16px' }}>
                      <Link to={`/seller/products/${p._id}`} className="flex items-center no-underline" style={{ gap: '12px' }}>
                        <div className="rounded-card-sm bg-primary-light shrink-0 overflow-hidden" style={{ width: '40px', height: '40px' }}>
                          {p.images?.[0] && <img src={p.images[0]} alt="" className="w-full h-full object-cover" />}
                        </div>
                        <span className="text-ink font-medium" style={{ fontSize: '14px' }}>{p.name}</span>
                      </Link>
                    </td>
                    <td className="text-ink-faint" style={{ padding: '12px 16px', fontSize: '14px' }}>{p.category?.name ?? '—'}</td>
                    <td className="text-right font-bold text-ink" style={{ padding: '12px 16px', fontSize: '14px' }}>{formatCurrency(p.price)}</td>
                    <td className="text-center" style={{ padding: '12px 16px' }}>
                      <span style={{ fontSize: '14px', color: p.stock === 0 ? 'var(--color-danger-dark)' : p.stock <= 5 ? 'var(--color-warning-text)' : 'var(--color-ink)' }}>
                        {p.stock}
                      </span>
                    </td>
                    <td className="text-center" style={{ padding: '12px 16px' }}>
                      <span className="inline-flex items-center justify-center" style={{
                        background: p.isActive ? 'var(--color-status-delivered-bg)' : 'var(--color-status-out-of-stock-bg)',
                        color: p.isActive ? 'var(--color-success-text)' : '#171315',
                        borderRadius: '6px', padding: '6px 12px', fontSize: '12px', fontWeight: 500,
                      }}>
                        {p.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="text-ink-faint" style={{ padding: '12px 16px', fontSize: '14px' }}>{formatDate(p.createdAt)}</td>
                    <td style={{ padding: '12px 16px', textAlign: 'center', position: 'relative' }}>
                      <button onClick={() => setOpenMenu(openMenu === p._id ? null : p._id)} className="text-ink-faint hover:text-ink" aria-label="Actions">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                      {openMenu === p._id && (
                        <div className="absolute bg-white shadow-lg z-50" style={{ right: '16px', top: '48px', border: '1px solid var(--color-line)', borderRadius: '8px', padding: '4px', minWidth: '120px' }}>
                          <Link to={`/seller/products/${p._id}`} onClick={() => setOpenMenu(null)} className="flex items-center text-ink hover:bg-surface no-underline" style={{ padding: '8px 12px', gap: '8px', fontSize: '14px', borderRadius: '4px' }}>
                            <Eye className="w-4 h-4" /> View
                          </Link>
                          <Link to={`/seller/products/${p._id}/edit`} onClick={() => setOpenMenu(null)} className="flex items-center text-ink hover:bg-surface no-underline" style={{ padding: '8px 12px', gap: '8px', fontSize: '14px', borderRadius: '4px' }}>
                            <Pencil className="w-4 h-4" /> Edit
                          </Link>
                          <button onClick={() => handleDelete(p)} className="flex items-center text-danger-dark hover:bg-danger-dark/5 w-full" style={{ padding: '8px 12px', gap: '8px', fontSize: '14px', borderRadius: '4px' }}>
                            <Trash2 className="w-4 h-4" /> Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {filtered.length > 0 && (
          <div className="flex items-center justify-between">
            <span className="text-ink-faint" style={{ fontSize: '14px' }}>
              Showing {(page - 1) * limit + 1}-{Math.min(page * limit, filtered.length)} of {filtered.length}
            </span>
            <div className="flex items-center" style={{ gap: '4px' }}>
              <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page <= 1}
                className="text-ink-faint" style={{ border: '1px solid var(--color-line)', borderRadius: '8px', padding: '6px 12px', fontSize: '14px' }}>Prev</button>
              <span className="bg-ink text-white" style={{ borderRadius: '8px', padding: '6px 12px', fontSize: '14px', fontWeight: 500 }}>{page}</span>
              <button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page >= totalPages}
                className="text-ink-faint" style={{ border: '1px solid var(--color-line)', borderRadius: '8px', padding: '6px 12px', fontSize: '14px' }}>Next</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}