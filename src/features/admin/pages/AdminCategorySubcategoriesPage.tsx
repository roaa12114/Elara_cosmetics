import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Plus, MoreVertical, Pencil, Eye, Ban, Trash2 } from 'lucide-react';
import { AdminNavbar } from '../components/AdminNavbar';
import { useCategories } from '@shared/hooks/useCategories';
import { useToast } from '@/shared/ui';
import { getSubcategoriesForCategory } from '../data/adminCategoryStaticData';

type StatusKey = 'Active' | 'Inactive';
const STATUS_STYLES: Record<StatusKey, { bg: string; text: string }> = {
  Active: { bg: 'var(--color-status-delivered-bg)', text: 'var(--color-success-text)' },
  Inactive: { bg: 'var(--color-status-out-of-stock-bg)', text: '#171315' },
};

export function AdminCategorySubcategoriesPage() {
  const { id } = useParams();
  const toast = useToast();
  const { data, isLoading } = useCategories({ limit: 100 });
  const category = data?.categories?.find((c) => c._id === id);
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const subcategories = category ? getSubcategoriesForCategory(category._id) : [];

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
      <div className="flex flex-col" style={{ padding: '32px', gap: '24px' }}>
        <Link to="/admin/categories" className="flex items-center text-ink-secondary hover:text-ink no-underline" style={{ gap: '8px', fontSize: '16px' }}>
          <ArrowLeft className="w-5 h-5" /> Back to Categories
        </Link>

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <nav className="flex items-center text-ink-faint" style={{ gap: '8px', fontSize: '14px', marginBottom: '4px' }}>
              <Link to="/admin" className="hover:text-ink no-underline">Home</Link><span>/</span>
              <Link to="/admin/categories" className="hover:text-ink no-underline">Category</Link><span>/</span>
              <span className="text-ink font-medium">Subcategory</span>
            </nav>
            <h1 className="font-bold text-ink" style={{ fontSize: '20px' }}>{category.name}</h1>
            <p className="text-ink-faint" style={{ fontSize: '14px' }}>Manage subcategories within {category.name}</p>
          </div>
          <button
            onClick={() => toast.show('Subcategory creation is in demo mode — no backend endpoint')}
            className="flex items-center bg-ink text-white no-underline"
            style={{ borderRadius: 'var(--radius-pill)', padding: '8px 16px', gap: '8px', fontSize: '16px', fontWeight: 500, height: '48px' }}
          >
            <Plus className="w-5 h-5" /> Add Subcategory
          </button>
        </div>

        {/* Table */}
        <div className="bg-white overflow-hidden" style={{ border: '1px solid var(--color-line)', borderRadius: '8px' }}>
          <div style={{ padding: '24px', borderBottom: '1px solid var(--color-line)' }}>
            <h3 className="font-bold text-ink" style={{ fontSize: '16px' }}>Manage Subcategory</h3>
          </div>
          <table className="w-full">
            <thead><tr style={{ borderBottom: '1px solid var(--color-line)', background: '#FFF9F9' }}>
              <th className="text-left font-bold text-ink-secondary" style={{ padding: '12px 16px', fontSize: '12px', textTransform: 'uppercase' }}>Subcategory</th>
              <th className="text-center font-bold text-ink-secondary" style={{ padding: '12px 16px', fontSize: '12px', textTransform: 'uppercase' }}>Products</th>
              <th className="text-center font-bold text-ink-secondary" style={{ padding: '12px 16px', fontSize: '12px', textTransform: 'uppercase' }}>Status</th>
              <th className="text-left font-bold text-ink-secondary" style={{ padding: '12px 16px', fontSize: '12px', textTransform: 'uppercase' }}>Created</th>
              <th className="text-center font-bold text-ink-secondary" style={{ padding: '12px 16px', fontSize: '12px', textTransform: 'uppercase' }}>Actions</th>
            </tr></thead>
            <tbody>
              {subcategories.length === 0 ? (
                <tr><td colSpan={5} className="text-ink-faint text-center" style={{ padding: '32px' }}>No subcategories</td></tr>
              ) : subcategories.map((s) => {
                const status: StatusKey = s.isActive ? 'Active' : 'Inactive';
                const st = STATUS_STYLES[status];
                return (
                  <tr key={s._id} style={{ borderBottom: '1px solid var(--color-line)' }} className="hover:bg-surface transition-colors">
                    <td className="font-medium text-ink" style={{ padding: '12px 16px', fontSize: '14px' }}>{s.name}</td>
                    <td className="text-center text-ink" style={{ padding: '12px 16px', fontSize: '14px' }}>{s.productsCount}</td>
                    <td style={{ padding: '12px 16px', textAlign: 'center' }}><span className="inline-flex items-center justify-center" style={{ background: st.bg, color: st.text, borderRadius: '6px', padding: '6px 12px', fontSize: '12px', fontWeight: 500 }}>{status}</span></td>
                    <td className="text-ink-faint" style={{ padding: '12px 16px', fontSize: '14px' }}>{s.createdAt}</td>
                    <td style={{ padding: '12px 16px', textAlign: 'center', position: 'relative' }}>
                      <button onClick={() => setOpenMenu(openMenu === s._id ? null : s._id)} className="text-ink-faint hover:text-ink"><MoreVertical className="w-4 h-4" /></button>
                      {openMenu === s._id && (
                        <div className="absolute bg-white shadow-lg z-50" style={{ right: '16px', top: '48px', border: '1px solid var(--color-line)', borderRadius: '8px', padding: '4px', minWidth: '160px' }}>
                          <button onClick={() => { toast.show('Edit subcategory is in demo mode'); setOpenMenu(null); }} className="flex items-center text-ink hover:bg-surface w-full" style={{ padding: '8px 12px', gap: '8px', fontSize: '14px', borderRadius: '4px' }}><Pencil className="w-4 h-4" /> Edit Category</button>
                          <button className="flex items-center text-ink hover:bg-surface w-full" style={{ padding: '8px 12px', gap: '8px', fontSize: '14px', borderRadius: '4px' }}><Eye className="w-4 h-4" /> View Products</button>
                          <button onClick={() => { toast.show('Toggle status is in demo mode'); setOpenMenu(null); }} className="flex items-center text-ink hover:bg-surface w-full" style={{ padding: '8px 12px', gap: '8px', fontSize: '14px', borderRadius: '4px' }}><Ban className="w-4 h-4" /> {s.isActive ? 'Deactivate' : 'Activate'}</button>
                          <div style={{ height: '1px', background: 'var(--color-line)', margin: '4px 0' }} />
                          <button onClick={() => { toast.show('Delete is in demo mode'); setOpenMenu(null); }} className="flex items-center text-danger-dark hover:bg-danger-dark/5 w-full" style={{ padding: '8px 12px', gap: '8px', fontSize: '14px', borderRadius: '4px' }}><Trash2 className="w-4 h-4" /> Delete</button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <p className="text-ink-faint" style={{ fontSize: '12px' }}>Subcategories are frontend mock data — the backend does not have a subcategory concept yet.</p>
      </div>
    </div>
  );
}