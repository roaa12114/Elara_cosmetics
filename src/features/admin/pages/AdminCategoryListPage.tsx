import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Plus, MoreVertical, Pencil, FolderTree, Eye, Ban, Trash2 } from 'lucide-react';
import { AdminNavbar } from '../components/AdminNavbar';
import { useCategories } from '@shared/hooks/useCategories';
import { useToast } from '@/shared/ui';
import { formatDate } from '@shared/lib/utils';
import { getProductsCountForCategory, getSubcategoriesCountForCategory } from '../data/adminCategoryStaticData';
import type { Category } from '@shared/types';

type StatusKey = 'Active' | 'Inactive';
const STATUS_STYLES: Record<StatusKey, { bg: string; text: string }> = {
  Active: { bg: 'var(--color-status-delivered-bg)', text: 'var(--color-success-text)' },
  Inactive: { bg: 'var(--color-status-out-of-stock-bg)', text: '#171315' },
};

const FILTERS = ['All', 'Active', 'Inactive'] as const;
type FilterValue = (typeof FILTERS)[number];
const PAGE_SIZE = 10;

export function AdminCategoryListPage() {
  const toast = useToast();
  const [filter, setFilter] = useState<FilterValue>('All');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const { data, isLoading } = useCategories({ limit: 100 });
  const allCategories: Category[] = data?.categories ?? [];

  const filteredCategories = useMemo(() => {
    const q = search.trim().toLowerCase();
    return allCategories.filter((c) => {
      if (filter === 'Active' && !c.isActive) return false;
      if (filter === 'Inactive' && c.isActive) return false;
      if (q && !c.name.toLowerCase().includes(q) && !c.description.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [allCategories, filter, search]);

  const total = filteredCategories.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * PAGE_SIZE;
  const pagedCategories = filteredCategories.slice(start, start + PAGE_SIZE);

  const activeCount = allCategories.filter((c) => c.isActive).length;
  const inactiveCount = allCategories.filter((c) => !c.isActive).length;
  const productsAssigned = allCategories.reduce((sum, c) => sum + getProductsCountForCategory(c._id), 0);

  function handleDeactivate(c: Category) {
    toast.show(`Deactivate is in demo mode — no backend endpoint for "${c.name}"`);
    setOpenMenu(null);
  }
  function handleDelete(c: Category) {
    if (!window.confirm(`Delete "${c.name}"? This cannot be undone.`)) return;
    toast.show(`Delete is in demo mode — no backend endpoint for "${c.name}"`);
    setOpenMenu(null);
  }

  return (
    <div className="flex flex-col min-h-screen">
      <AdminNavbar />
      <div className="flex flex-col" style={{ padding: '32px', gap: '24px' }}>
        <div className="flex items-center justify-between">
          <h1 className="font-bold text-ink" style={{ fontSize: '20px' }}>Category Management</h1>
          <Link to="/admin/categories/new" className="flex items-center bg-ink text-white no-underline" style={{ borderRadius: 'var(--radius-pill)', padding: '8px 16px', gap: '8px', fontSize: '16px', fontWeight: 500, height: '48px' }}>
            <Plus className="w-5 h-5" /> Add Category
          </Link>
        </div>

        {/* Stat cards */}
        <div className="grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
          <StatCard label="Active Categories" value={String(activeCount)} change="+12.4%" />
          <StatCard label="Total Categories" value={String(allCategories.length)} change="+8.1%" />
          <StatCard label="Products Assigned" value={String(productsAssigned)} change="+8.1%" />
          <StatCard label="Inactive Categories" value={String(inactiveCount)} change="+8.1%" />
        </div>

        {/* Search + filters */}
        <div className="flex items-center justify-between">
          <div className="flex items-center overflow-hidden" style={{ minWidth: '300px', height: '40px', border: '1px solid var(--color-line)', borderRadius: '8px' }}>
            <input type="search" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="Search categories..." className="flex-1 h-full bg-transparent px-4 text-body2 focus:outline-none" />
          </div>
          <div className="flex items-center" style={{ gap: '6px' }}>
            {FILTERS.map((f) => (
              <button key={f} onClick={() => { setFilter(f); setPage(1); }} className={filter === f ? 'bg-ink text-white' : 'text-ink-secondary'} style={{ borderRadius: 'var(--radius-pill)', padding: '8px 16px', fontSize: '14px', fontWeight: 500, border: filter === f ? 'none' : '1px solid var(--color-line)' }}>{f}</button>
            ))}
          </div>
        </div>

        {/* Table */}
        {isLoading ? (
          <div className="bg-white" style={{ border: '1px solid var(--color-line)', borderRadius: '8px', padding: '48px', textAlign: 'center' }}><p className="text-ink-faint">Loading categories...</p></div>
        ) : pagedCategories.length === 0 ? (
          <div className="bg-white" style={{ border: '1px solid var(--color-line)', borderRadius: '8px', padding: '48px', textAlign: 'center' }}>
            <p className="text-ink" style={{ fontSize: '18px', fontWeight: 600 }}>No categories found</p>
            <p className="text-ink-faint" style={{ fontSize: '14px', marginTop: '8px' }}>{search.trim() ? `No categories match "${search.trim()}".` : 'Try adjusting your filters.'}</p>
          </div>
        ) : (
          <div className="bg-white overflow-hidden" style={{ border: '1px solid var(--color-line)', borderRadius: '8px' }}>
            <table className="w-full">
              <thead><tr style={{ borderBottom: '1px solid var(--color-line)', background: '#FFF9F9' }}>
                <th className="text-left font-bold text-ink-secondary" style={{ padding: '12px 16px', fontSize: '12px', textTransform: 'uppercase' }}>Category</th>
                <th className="text-center font-bold text-ink-secondary" style={{ padding: '12px 16px', fontSize: '12px', textTransform: 'uppercase' }}>Products</th>
                <th className="text-center font-bold text-ink-secondary" style={{ padding: '12px 16px', fontSize: '12px', textTransform: 'uppercase' }}>Subcategories</th>
                <th className="text-center font-bold text-ink-secondary" style={{ padding: '12px 16px', fontSize: '12px', textTransform: 'uppercase' }}>Status</th>
                <th className="text-left font-bold text-ink-secondary" style={{ padding: '12px 16px', fontSize: '12px', textTransform: 'uppercase' }}>Created</th>
                <th className="text-center font-bold text-ink-secondary" style={{ padding: '12px 16px', fontSize: '12px', textTransform: 'uppercase' }}>Actions</th>
              </tr></thead>
              <tbody>
                {pagedCategories.map((c: Category) => {
                  const status: StatusKey = c.isActive ? 'Active' : 'Inactive';
                  const st = STATUS_STYLES[status];
                  const products = getProductsCountForCategory(c._id);
                  const subcats = getSubcategoriesCountForCategory(c._id);
                  return (
                    <tr key={c._id} style={{ borderBottom: '1px solid var(--color-line)' }} className="hover:bg-surface transition-colors">
                      <td style={{ padding: '12px 16px' }}>
                        <div className="flex items-center" style={{ gap: '12px' }}>
                          {c.image ? (
                            <img src={c.image} alt={c.name} className="rounded-card-sm object-cover" style={{ width: '40px', height: '40px' }} />
                          ) : (
                            <div className="rounded-card-sm bg-primary-light flex items-center justify-center" style={{ width: '40px', height: '40px' }}><FolderTree className="w-5 h-5 text-brand" /></div>
                          )}
                          <div>
                            <span className="text-ink font-medium" style={{ fontSize: '14px' }}>{c.name}</span>
                            <div className="text-ink-faint" style={{ fontSize: '12px' }}>{c.description}</div>
                          </div>
                        </div>
                      </td>
                      <td className="text-center text-ink" style={{ padding: '12px 16px', fontSize: '14px' }}>{products}</td>
                      <td className="text-center text-ink" style={{ padding: '12px 16px', fontSize: '14px' }}>{subcats}</td>
                      <td style={{ padding: '12px 16px', textAlign: 'center' }}><span className="inline-flex items-center justify-center" style={{ background: st.bg, color: st.text, borderRadius: '6px', padding: '6px 12px', fontSize: '12px', fontWeight: 500 }}>{status}</span></td>
                      <td className="text-ink-faint" style={{ padding: '12px 16px', fontSize: '14px' }}>{formatDate(c.createdAt)}</td>
                      <td style={{ padding: '12px 16px', textAlign: 'center', position: 'relative' }}>
                        <button onClick={() => setOpenMenu(openMenu === c._id ? null : c._id)} className="text-ink-faint hover:text-ink"><MoreVertical className="w-4 h-4" /></button>
                        {openMenu === c._id && (
                          <div className="absolute bg-white shadow-lg z-50" style={{ right: '16px', top: '48px', border: '1px solid var(--color-line)', borderRadius: '8px', padding: '4px', minWidth: '180px' }}>
                            <Link to={`/admin/categories/${c._id}/edit`} onClick={() => setOpenMenu(null)} className="flex items-center text-ink hover:bg-surface no-underline" style={{ padding: '8px 12px', gap: '8px', fontSize: '14px', borderRadius: '4px' }}><Pencil className="w-4 h-4" /> Edit Category</Link>
                            <Link to={`/admin/categories/${c._id}/subcategories`} onClick={() => setOpenMenu(null)} className="flex items-center text-ink hover:bg-surface no-underline" style={{ padding: '8px 12px', gap: '8px', fontSize: '14px', borderRadius: '4px' }}><FolderTree className="w-4 h-4" /> Manage Subcategories</Link>
                            <button className="flex items-center text-ink hover:bg-surface w-full" style={{ padding: '8px 12px', gap: '8px', fontSize: '14px', borderRadius: '4px' }}><Eye className="w-4 h-4" /> View Products</button>
                            <button onClick={() => handleDeactivate(c)} className="flex items-center text-ink hover:bg-surface w-full" style={{ padding: '8px 12px', gap: '8px', fontSize: '14px', borderRadius: '4px' }}><Ban className="w-4 h-4" /> {c.isActive ? 'Deactivate' : 'Activate'}</button>
                            <div style={{ height: '1px', background: 'var(--color-line)', margin: '4px 0' }} />
                            <button onClick={() => handleDelete(c)} className="flex items-center text-danger-dark hover:bg-danger-dark/5 w-full" style={{ padding: '8px 12px', gap: '8px', fontSize: '14px', borderRadius: '4px' }}><Trash2 className="w-4 h-4" /> Delete</button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {total > 0 && (
          <div className="flex items-center justify-between">
            <span className="text-ink-faint" style={{ fontSize: '14px' }}>Showing {start + 1}-{Math.min(start + PAGE_SIZE, total)} of {total}{filter !== 'All' && ` (filtered from ${allCategories.length})`}</span>
            <div className="flex items-center" style={{ gap: '4px' }}>
              <button onClick={() => setPage(Math.max(1, currentPage - 1))} disabled={currentPage <= 1} className="text-ink-faint" style={{ border: '1px solid var(--color-line)', borderRadius: '8px', padding: '6px 12px', fontSize: '14px' }}>Prev</button>
              <span className="bg-ink text-white" style={{ borderRadius: '8px', padding: '6px 12px', fontSize: '14px', fontWeight: 500 }}>{currentPage} / {totalPages}</span>
              <button onClick={() => setPage(Math.min(totalPages, currentPage + 1))} disabled={currentPage >= totalPages} className="text-ink-faint" style={{ border: '1px solid var(--color-line)', borderRadius: '8px', padding: '6px 12px', fontSize: '14px' }}>Next</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value, change }: { label: string; value: string; change?: string }) {
  return (
    <div className="bg-white" style={{ borderRadius: '8px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <span className="text-ink-secondary" style={{ fontSize: '14px' }}>{label}</span>
      <span className="font-bold text-ink" style={{ fontSize: '24px' }}>{value}</span>
      {change && <span className="text-success-text" style={{ fontSize: '12px' }}>+ {change}</span>}
    </div>
  );
}