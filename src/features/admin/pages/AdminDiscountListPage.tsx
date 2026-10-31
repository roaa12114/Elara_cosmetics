import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Plus, MoreVertical, Copy, Pencil, Trash2, Ban } from 'lucide-react';
import { AdminNavbar } from '../components/AdminNavbar';
import { useAdminPromos } from '@shared/hooks/useAdminPromos';
import { useToast } from '@/shared/ui';
import {
  DISCOUNT_TYPE_LABELS,
  computeDiscountStatus,
  getUsedCount,
  formatDateRange,
} from '../data/adminDiscountStaticData';
import type { AdminPromo } from '@shared/hooks/useAdminPromos';
import type { DiscountStatus } from '../data/adminDiscountStaticData';

const STATUS_STYLES: Record<DiscountStatus, { bg: string; text: string }> = {
  Active: { bg: 'var(--color-status-delivered-bg)', text: 'var(--color-success-text)' },
  Expired: { bg: 'var(--color-status-out-of-stock-bg)', text: '#171315' },
  Scheduled: { bg: 'var(--color-status-pending-bg)', text: 'var(--color-warning-text)' },
  'Expires Soon': { bg: 'var(--color-status-pending-bg)', text: 'var(--color-warning-text)' },
  Inactive: { bg: 'var(--color-status-out-of-stock-bg)', text: '#171315' },
};

const FILTERS = ['All', 'Active', 'Scheduled', 'Expires Soon', 'Expired', 'Inactive'] as const;
type FilterValue = (typeof FILTERS)[number];
const PAGE_SIZE = 10;

export function AdminDiscountListPage() {
  const toast = useToast();
  const [filter, setFilter] = useState<FilterValue>('All');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const { data, isLoading } = useAdminPromos({ limit: 100 });
  const allPromos: AdminPromo[] = data?.promos ?? [];

  const filteredPromos = useMemo(() => {
    const q = search.trim().toLowerCase();
    return allPromos.filter((p) => {
      const status = computeDiscountStatus(p);
      if (filter !== 'All' && status !== filter) return false;
      if (q && !p.code.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [allPromos, filter, search]);

  const total = filteredPromos.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * PAGE_SIZE;
  const pagedPromos = filteredPromos.slice(start, start + PAGE_SIZE);

  const activeCount = allPromos.filter((p) => computeDiscountStatus(p) === 'Active').length;
  const expiredCount = allPromos.filter((p) => computeDiscountStatus(p) === 'Expired').length;
  const totalRedemptions = allPromos.reduce((sum, p) => sum + getUsedCount(p), 0);

  function handleCopy(p: AdminPromo) {
    navigator.clipboard.writeText(p.code).then(() => toast.success(`Copied "${p.code}" to clipboard`));
    setOpenMenu(null);
  }
  function handleEdit(p: AdminPromo) {
    toast.show(`Edit is in demo mode — no PATCH endpoint for "${p.code}"`);
    setOpenMenu(null);
  }
  function handleToggle(p: AdminPromo) {
    toast.show(`${p.isActive ? 'Deactivate' : 'Activate'} is in demo mode — no toggle endpoint for "${p.code}"`);
    setOpenMenu(null);
  }
  function handleDelete(p: AdminPromo) {
    if (!window.confirm(`Delete discount "${p.code}"? This cannot be undone.`)) return;
    toast.show(`Delete is in demo mode — no DELETE endpoint for "${p.code}"`);
    setOpenMenu(null);
  }

  return (
    <div className="flex flex-col min-h-screen">
      <AdminNavbar />
      <div className="flex flex-col" style={{ padding: '32px', gap: '24px' }}>
        <div className="flex items-center justify-between">
          <h1 className="font-bold text-ink" style={{ fontSize: '20px' }}>Discounts</h1>
          <Link to="/admin/discounts/new" className="flex items-center bg-ink text-white no-underline" style={{ borderRadius: 'var(--radius-pill)', padding: '8px 16px', gap: '8px', fontSize: '16px', fontWeight: 500, height: '48px' }}>
            <Plus className="w-5 h-5" /> Create discount
          </Link>
        </div>

        <div className="grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
          <StatCard label="Total Discounts" value={String(allPromos.length)} change="+12%" />
          <StatCard label="Active" value={String(activeCount)} change="3 expiring this week" />
          <StatCard label="Expired" value={String(expiredCount)} />
          <StatCard label="Total Redemptions" value={totalRedemptions.toLocaleString()} change="+8.5%" />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center overflow-hidden" style={{ minWidth: '300px', height: '40px', border: '1px solid var(--color-line)', borderRadius: '8px' }}>
            <input type="search" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="Search by code..." className="flex-1 h-full bg-transparent px-4 text-body2 focus:outline-none" />
          </div>
          <div className="flex items-center" style={{ gap: '6px' }}>
            {FILTERS.map((f) => (
              <button key={f} onClick={() => { setFilter(f); setPage(1); }} className={filter === f ? 'bg-ink text-white' : 'text-ink-secondary'} style={{ borderRadius: 'var(--radius-pill)', padding: '8px 16px', fontSize: '14px', fontWeight: 500, border: filter === f ? 'none' : '1px solid var(--color-line)' }}>{f}</button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="bg-white" style={{ border: '1px solid var(--color-line)', borderRadius: '8px', padding: '48px', textAlign: 'center' }}><p className="text-ink-faint">Loading discounts...</p></div>
        ) : pagedPromos.length === 0 ? (
          <div className="bg-white" style={{ border: '1px solid var(--color-line)', borderRadius: '8px', padding: '48px', textAlign: 'center' }}>
            <p className="text-ink" style={{ fontSize: '18px', fontWeight: 600 }}>No discounts found</p>
            <p className="text-ink-faint" style={{ fontSize: '14px', marginTop: '8px' }}>{search.trim() ? `No discounts match "${search.trim()}".` : 'Try adjusting your filters.'}</p>
          </div>
        ) : (
          <div className="bg-white overflow-hidden" style={{ border: '1px solid var(--color-line)', borderRadius: '8px' }}>
            <table className="w-full">
              <thead><tr style={{ borderBottom: '1px solid var(--color-line)', background: '#FFF9F9' }}>
                <th className="text-left font-bold text-ink-secondary" style={{ padding: '12px 16px', fontSize: '12px', textTransform: 'uppercase' }}>Code</th>
                <th className="text-left font-bold text-ink-secondary" style={{ padding: '12px 16px', fontSize: '12px', textTransform: 'uppercase' }}>Type</th>
                <th className="text-center font-bold text-ink-secondary" style={{ padding: '12px 16px', fontSize: '12px', textTransform: 'uppercase' }}>Status</th>
                <th className="text-center font-bold text-ink-secondary" style={{ padding: '12px 16px', fontSize: '12px', textTransform: 'uppercase' }}>Used / Limit</th>
                <th className="text-left font-bold text-ink-secondary" style={{ padding: '12px 16px', fontSize: '12px', textTransform: 'uppercase' }}>Period</th>
                <th className="text-center font-bold text-ink-secondary" style={{ padding: '12px 16px', fontSize: '12px', textTransform: 'uppercase' }}>Actions</th>
              </tr></thead>
              <tbody>
                {pagedPromos.map((p: AdminPromo) => {
                  const status = computeDiscountStatus(p);
                  const st = STATUS_STYLES[status];
                  const used = getUsedCount(p);
                  const limit = p.usageLimit ?? Infinity;
                  return (
                    <tr key={p._id} style={{ borderBottom: '1px solid var(--color-line)' }} className="hover:bg-surface transition-colors">
                      <td style={{ padding: '12px 16px' }}>
                        <div className="flex items-center" style={{ gap: '8px' }}>
                          <span className="text-ink font-medium font-mono" style={{ fontSize: '14px' }}>{p.code}</span>
                          <button onClick={() => handleCopy(p)} className="text-ink-faint hover:text-ink"><Copy className="w-3.5 h-3.5" /></button>
                        </div>
                      </td>
                      <td className="text-ink-faint" style={{ padding: '12px 16px', fontSize: '14px' }}>{DISCOUNT_TYPE_LABELS[p.discountType]}</td>
                      <td style={{ padding: '12px 16px', textAlign: 'center' }}><span className="inline-flex items-center justify-center" style={{ background: st.bg, color: st.text, borderRadius: '6px', padding: '6px 12px', fontSize: '12px', fontWeight: 500 }}>{status}</span></td>
                      <td className="text-center text-ink" style={{ padding: '12px 16px', fontSize: '14px' }}>{used} / {limit === Infinity ? '∞' : limit}</td>
                      <td className="text-ink-faint" style={{ padding: '12px 16px', fontSize: '14px' }}>{formatDateRange(p.startsAt, p.expiresAt)}</td>
                      <td style={{ padding: '12px 16px', textAlign: 'center', position: 'relative' }}>
                        <button onClick={() => setOpenMenu(openMenu === p._id ? null : p._id)} className="text-ink-faint hover:text-ink"><MoreVertical className="w-4 h-4" /></button>
                        {openMenu === p._id && (
                          <div className="absolute bg-white shadow-lg z-50" style={{ right: '16px', top: '48px', border: '1px solid var(--color-line)', borderRadius: '8px', padding: '4px', minWidth: '160px' }}>
                            <button onClick={() => handleCopy(p)} className="flex items-center text-ink hover:bg-surface w-full" style={{ padding: '8px 12px', gap: '8px', fontSize: '14px', borderRadius: '4px' }}><Copy className="w-4 h-4" /> Copy Code</button>
                            <button onClick={() => handleEdit(p)} className="flex items-center text-ink hover:bg-surface w-full" style={{ padding: '8px 12px', gap: '8px', fontSize: '14px', borderRadius: '4px' }}><Pencil className="w-4 h-4" /> Edit</button>
                            <button onClick={() => handleToggle(p)} className="flex items-center text-ink hover:bg-surface w-full" style={{ padding: '8px 12px', gap: '8px', fontSize: '14px', borderRadius: '4px' }}><Ban className="w-4 h-4" /> {p.isActive ? 'Deactivate' : 'Activate'}</button>
                            <div style={{ height: '1px', background: 'var(--color-line)', margin: '4px 0' }} />
                            <button onClick={() => handleDelete(p)} className="flex items-center text-danger-dark hover:bg-danger-dark/5 w-full" style={{ padding: '8px 12px', gap: '8px', fontSize: '14px', borderRadius: '4px' }}><Trash2 className="w-4 h-4" /> Delete</button>
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

        {total > 0 && (
          <div className="flex items-center justify-between">
            <span className="text-ink-faint" style={{ fontSize: '14px' }}>Showing {start + 1}-{Math.min(start + PAGE_SIZE, total)} of {total}{filter !== 'All' && ` (filtered from ${allPromos.length})`}</span>
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