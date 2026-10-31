import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Plus, MoreVertical, Pencil, Eye, Ban, Trash2 } from 'lucide-react';
import { AdminNavbar } from '../components/AdminNavbar';
import { useAdminBanners } from '@shared/hooks/useAdminBanners';
import { useToast } from '@/shared/ui';
import { getBannerDisplay } from '../data/adminBannerStaticData';
import type { AdminBanner } from '@shared/hooks/useAdminBanners';

type BannerStatus = 'Active' | 'Scheduled' | 'Inactive';
const STATUS_STYLES: Record<BannerStatus, { bg: string; text: string }> = {
  Active: { bg: 'var(--color-status-delivered-bg)', text: 'var(--color-success-text)' },
  Scheduled: { bg: 'var(--color-status-pending-bg)', text: 'var(--color-warning-text)' },
  Inactive: { bg: 'var(--color-status-out-of-stock-bg)', text: '#171315' },
};

const FILTERS = ['All', 'Active', 'Scheduled', 'Inactive'] as const;
type FilterValue = (typeof FILTERS)[number];
const PAGE_SIZE = 10;

export function AdminContentListPage() {
  const toast = useToast();
  const [filter, setFilter] = useState<FilterValue>('All');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const { data, isLoading } = useAdminBanners({ limit: 100 });
  const allBanners: AdminBanner[] = data?.banners ?? [];

  const filteredBanners = useMemo(() => {
    const q = search.trim().toLowerCase();
    return allBanners.filter((b) => {
      const display = getBannerDisplay(b);
      if (filter !== 'All' && display.status !== filter) return false;
      if (q && !b.title.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [allBanners, filter, search]);

  const total = filteredBanners.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * PAGE_SIZE;
  const pagedBanners = filteredBanners.slice(start, start + PAGE_SIZE);

  const activeCount = allBanners.filter((b) => getBannerDisplay(b).status === 'Active').length;
  const scheduledCount = allBanners.filter((b) => getBannerDisplay(b).status === 'Scheduled').length;
  const inactiveCount = allBanners.filter((b) => getBannerDisplay(b).status === 'Inactive').length;

  function handleEdit(b: AdminBanner) { toast.show(`Edit is in demo mode — no PATCH endpoint for "${b.title}"`); setOpenMenu(null); }
  function handleToggle(b: AdminBanner) { toast.show(`${b.isActive ? 'Deactivate' : 'Activate'} is in demo mode for "${b.title}"`); setOpenMenu(null); }
  function handleDelete(b: AdminBanner) { if (!window.confirm(`Delete "${b.title}"?`)) return; toast.show(`Delete is in demo mode — no DELETE endpoint for "${b.title}"`); setOpenMenu(null); }

  return (
    <div className="flex flex-col min-h-screen">
      <AdminNavbar />
      <div className="flex flex-col" style={{ padding: '32px', gap: '24px' }}>
        <div className="flex items-center justify-between">
          <h1 className="font-bold text-ink" style={{ fontSize: '20px' }}>Content management</h1>
          <Link to="/admin/content/new" className="flex items-center bg-ink text-white no-underline" style={{ borderRadius: 'var(--radius-pill)', padding: '8px 16px', gap: '8px', fontSize: '16px', fontWeight: 500, height: '48px' }}>
            <Plus className="w-5 h-5" /> Add Banner
          </Link>
        </div>

        <div className="grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
          <StatCard label="Total Banners" value={String(allBanners.length)} />
          <StatCard label="Active" value={String(activeCount)} />
          <StatCard label="Scheduled" value={String(scheduledCount)} />
          <StatCard label="Inactive" value={String(inactiveCount)} />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center overflow-hidden" style={{ minWidth: '300px', height: '40px', border: '1px solid var(--color-line)', borderRadius: '8px' }}>
            <input type="search" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="Search banners..." className="flex-1 h-full bg-transparent px-4 text-body2 focus:outline-none" />
          </div>
          <div className="flex items-center" style={{ gap: '6px' }}>
            {FILTERS.map((f) => (
              <button key={f} onClick={() => { setFilter(f); setPage(1); }} className={filter === f ? 'bg-ink text-white' : 'text-ink-secondary'} style={{ borderRadius: 'var(--radius-pill)', padding: '8px 16px', fontSize: '14px', fontWeight: 500, border: filter === f ? 'none' : '1px solid var(--color-line)' }}>{f}</button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="bg-white" style={{ border: '1px solid var(--color-line)', borderRadius: '8px', padding: '48px', textAlign: 'center' }}><p className="text-ink-faint">Loading banners...</p></div>
        ) : pagedBanners.length === 0 ? (
          <div className="bg-white" style={{ border: '1px solid var(--color-line)', borderRadius: '8px', padding: '48px', textAlign: 'center' }}>
            <p className="text-ink" style={{ fontSize: '18px', fontWeight: 600 }}>No banners found</p>
            <p className="text-ink-faint" style={{ fontSize: '14px', marginTop: '8px' }}>{search.trim() ? `No banners match "${search.trim()}".` : 'Try adjusting your filters.'}</p>
          </div>
        ) : (
          <div className="bg-white overflow-hidden" style={{ border: '1px solid var(--color-line)', borderRadius: '8px' }}>
            <table className="w-full">
              <thead><tr style={{ borderBottom: '1px solid var(--color-line)', background: '#FFF9F9' }}>
                <th className="text-left font-bold text-ink-secondary" style={{ padding: '12px 16px', fontSize: '12px', textTransform: 'uppercase' }}>Banner</th>
                <th className="text-left font-bold text-ink-secondary" style={{ padding: '12px 16px', fontSize: '12px', textTransform: 'uppercase' }}>Title</th>
                <th className="text-left font-bold text-ink-secondary" style={{ padding: '12px 16px', fontSize: '12px', textTransform: 'uppercase' }}>Placement</th>
                <th className="text-center font-bold text-ink-secondary" style={{ padding: '12px 16px', fontSize: '12px', textTransform: 'uppercase' }}>Status</th>
                <th className="text-left font-bold text-ink-secondary" style={{ padding: '12px 16px', fontSize: '12px', textTransform: 'uppercase' }}>Schedule</th>
                <th className="text-center font-bold text-ink-secondary" style={{ padding: '12px 16px', fontSize: '12px', textTransform: 'uppercase' }}>Actions</th>
              </tr></thead>
              <tbody>
                {pagedBanners.map((b: AdminBanner) => {
                  const display = getBannerDisplay(b);
                  const st = STATUS_STYLES[display.status];
                  return (
                    <tr key={b._id} style={{ borderBottom: '1px solid var(--color-line)' }} className="hover:bg-surface transition-colors">
                      <td style={{ padding: '12px 16px' }}>
                        {b.image ? <img src={b.image} alt={b.title} className="rounded-card-sm object-cover" style={{ width: '64px', height: '36px' }} /> : <div className="rounded-card-sm bg-primary-light" style={{ width: '64px', height: '36px' }} />}
                      </td>
                      <td className="font-medium text-ink" style={{ padding: '12px 16px', fontSize: '14px' }}>{b.title}</td>
                      <td className="text-ink-faint" style={{ padding: '12px 16px', fontSize: '14px' }}>{display.placement}</td>
                      <td style={{ padding: '12px 16px', textAlign: 'center' }}><span className="inline-flex items-center justify-center" style={{ background: st.bg, color: st.text, borderRadius: '6px', padding: '6px 12px', fontSize: '12px', fontWeight: 500 }}>{display.status}</span></td>
                      <td className="text-ink-faint" style={{ padding: '12px 16px', fontSize: '14px' }}>{display.startDate} - {display.endDate}</td>
                      <td style={{ padding: '12px 16px', textAlign: 'center', position: 'relative' }}>
                        <button onClick={() => setOpenMenu(openMenu === b._id ? null : b._id)} className="text-ink-faint hover:text-ink"><MoreVertical className="w-4 h-4" /></button>
                        {openMenu === b._id && (
                          <div className="absolute bg-white shadow-lg z-50" style={{ right: '16px', top: '48px', border: '1px solid var(--color-line)', borderRadius: '8px', padding: '4px', minWidth: '160px' }}>
                            <Link to={`/admin/content/${b._id}`} onClick={() => setOpenMenu(null)} className="flex items-center text-ink hover:bg-surface no-underline" style={{ padding: '8px 12px', gap: '8px', fontSize: '14px', borderRadius: '4px' }}><Eye className="w-4 h-4" /> View Banner</Link>
                            <button onClick={() => handleEdit(b)} className="flex items-center text-ink hover:bg-surface w-full" style={{ padding: '8px 12px', gap: '8px', fontSize: '14px', borderRadius: '4px' }}><Pencil className="w-4 h-4" /> Edit Banner</button>
                            <button onClick={() => handleToggle(b)} className="flex items-center text-ink hover:bg-surface w-full" style={{ padding: '8px 12px', gap: '8px', fontSize: '14px', borderRadius: '4px' }}><Ban className="w-4 h-4" /> {b.isActive ? 'Deactivate' : 'Activate'}</button>
                            <div style={{ height: '1px', background: 'var(--color-line)', margin: '4px 0' }} />
                            <button onClick={() => handleDelete(b)} className="flex items-center text-danger-dark hover:bg-danger-dark/5 w-full" style={{ padding: '8px 12px', gap: '8px', fontSize: '14px', borderRadius: '4px' }}><Trash2 className="w-4 h-4" /> Delete</button>
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
            <span className="text-ink-faint" style={{ fontSize: '14px' }}>Showing {start + 1}-{Math.min(start + PAGE_SIZE, total)} of {total}{filter !== 'All' && ` (filtered from ${allBanners.length})`}</span>
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

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white" style={{ borderRadius: '8px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <span className="text-ink-secondary" style={{ fontSize: '14px' }}>{label}</span>
      <span className="font-bold text-ink" style={{ fontSize: '24px' }}>{value}</span>
    </div>
  );
}