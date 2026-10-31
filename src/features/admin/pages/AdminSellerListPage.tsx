import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Eye, MoreVertical } from 'lucide-react';
import { AdminNavbar } from '../components/AdminNavbar';
import { useAdminSellers } from '@shared/hooks/useAdminSellers';
import { formatDate, initialsOf } from '@shared/lib/utils';
import { getSellerProfile } from '../data/adminSellerStaticData';
import type { AdminSeller } from '@shared/hooks/useAdminSellers';

type StatusKey = 'Active' | 'Blocked';

const STATUS_STYLES: Record<StatusKey, { bg: string; text: string }> = {
  Active: { bg: 'var(--color-status-delivered-bg)', text: 'var(--color-success-text)' },
  Blocked: { bg: 'var(--color-status-out-of-stock-bg)', text: '#171315' },
};

const FILTERS = ['All', 'Active', 'Blocked'] as const;
type FilterValue = (typeof FILTERS)[number];

const PAGE_SIZE = 10;

export function AdminSellerListPage() {
  const [filter, setFilter] = useState<FilterValue>('All');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const { data, isLoading } = useAdminSellers({ limit: 100 });
  const allSellers: AdminSeller[] = data?.sellers ?? [];

  const filteredSellers = useMemo(() => {
    const q = search.trim().toLowerCase();
    return allSellers.filter((s) => {
      if (filter === 'Active' && !s.isActive) return false;
      if (filter === 'Blocked' && s.isActive) return false;
      if (q) {
        const profile = getSellerProfile(s._id);
        const haystack = [s.name, s.email, profile.storeName].join(' ').toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [allSellers, filter, search]);

  const total = filteredSellers.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * PAGE_SIZE;
  const pagedSellers = filteredSellers.slice(start, start + PAGE_SIZE);

  return (
    <div className="flex flex-col min-h-screen">
      <AdminNavbar />
      <div className="flex flex-col" style={{ padding: '32px', gap: '24px' }}>
        <div className="flex items-center justify-between">
          <h1 className="font-bold text-ink" style={{ fontSize: '20px' }}>Sellers</h1>
          <Link to="/admin/sellers/new" className="flex items-center bg-ink text-white no-underline" style={{ borderRadius: 'var(--radius-pill)', padding: '8px 16px', gap: '8px', fontSize: '16px', fontWeight: 500, height: '48px' }}>
            <Plus className="w-5 h-5" /> Add Seller
          </Link>
        </div>

        <div className="grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
          <StatCard label="Total Sellers" value={String(allSellers.length)} />
          <StatCard label="Active" value={String(allSellers.filter((s) => s.isActive).length)} />
          <StatCard label="Blocked" value={String(allSellers.filter((s) => !s.isActive).length)} />
          <StatCard label="Filtered Results" value={String(total)} />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center overflow-hidden" style={{ minWidth: '300px', height: '40px', border: '1px solid var(--color-line)', borderRadius: '8px' }}>
            <input type="search" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="Search by name, email or store..." className="flex-1 h-full bg-transparent px-4 text-body2 focus:outline-none" />
          </div>
          <div className="flex items-center" style={{ gap: '6px' }}>
            {FILTERS.map((f) => (
              <button key={f} onClick={() => { setFilter(f); setPage(1); }} className={filter === f ? 'bg-ink text-white' : 'text-ink-secondary'} style={{ borderRadius: 'var(--radius-pill)', padding: '8px 16px', fontSize: '14px', fontWeight: 500, border: filter === f ? 'none' : '1px solid var(--color-line)' }}>{f}</button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="bg-white" style={{ border: '1px solid var(--color-line)', borderRadius: '8px', padding: '48px', textAlign: 'center' }}><p className="text-ink-faint">Loading sellers...</p></div>
        ) : pagedSellers.length === 0 ? (
          <div className="bg-white" style={{ border: '1px solid var(--color-line)', borderRadius: '8px', padding: '48px', textAlign: 'center' }}>
            <p className="text-ink" style={{ fontSize: '18px', fontWeight: 600 }}>No sellers found</p>
            <p className="text-ink-faint" style={{ fontSize: '14px', marginTop: '8px' }}>{filter === 'Blocked' ? 'No blocked sellers in the database.' : search.trim() ? `No sellers match "${search.trim()}".` : 'Try adjusting your filters.'}</p>
          </div>
        ) : (
          <div className="bg-white overflow-hidden" style={{ border: '1px solid var(--color-line)', borderRadius: '8px' }}>
            <table className="w-full">
              <thead><tr style={{ borderBottom: '1px solid var(--color-line)', background: '#FFF9F9' }}>
                <th className="text-left font-bold text-ink-secondary" style={{ padding: '12px 16px', fontSize: '12px', textTransform: 'uppercase' }}>Seller</th>
                <th className="text-left font-bold text-ink-secondary" style={{ padding: '12px 16px', fontSize: '12px', textTransform: 'uppercase' }}>Store</th>
                <th className="text-left font-bold text-ink-secondary" style={{ padding: '12px 16px', fontSize: '12px', textTransform: 'uppercase' }}>Business Type</th>
                <th className="text-left font-bold text-ink-secondary" style={{ padding: '12px 16px', fontSize: '12px', textTransform: 'uppercase' }}>Joined</th>
                <th className="text-center font-bold text-ink-secondary" style={{ padding: '12px 16px', fontSize: '12px', textTransform: 'uppercase' }}>Status</th>
                <th className="text-center font-bold text-ink-secondary" style={{ padding: '12px 16px', fontSize: '12px', textTransform: 'uppercase' }}>Actions</th>
              </tr></thead>
              <tbody>
                {pagedSellers.map((s: AdminSeller) => {
                  const status: StatusKey = s.isActive ? 'Active' : 'Blocked';
                  const st = STATUS_STYLES[status];
                  const profile = getSellerProfile(s._id);
                  return (
                    <tr key={s._id} style={{ borderBottom: '1px solid var(--color-line)' }} className="hover:bg-surface transition-colors">
                      <td style={{ padding: '12px 16px' }}>
                        <div className="flex items-center" style={{ gap: '10px' }}>
                          <div className="rounded-full bg-primary text-brand font-bold flex items-center justify-center shrink-0" style={{ width: '32px', height: '32px', fontSize: '12px' }}>{initialsOf(s.name)}</div>
                          <div>
                            <Link to={`/admin/sellers/${s._id}`} className="text-ink font-medium no-underline" style={{ fontSize: '14px' }}>{s.name}</Link>
                            <div className="text-ink-faint" style={{ fontSize: '12px' }}>{s.email}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <span className="text-ink" style={{ fontSize: '14px' }}>{profile.storeName}</span>
                        <div className="text-ink-faint" style={{ fontSize: '12px' }}>{profile.specialty}</div>
                      </td>
                      <td className="text-ink-faint" style={{ padding: '12px 16px', fontSize: '14px' }}>{profile.businessType}</td>
                      <td className="text-ink-faint" style={{ padding: '12px 16px', fontSize: '14px' }}>{formatDate(s.createdAt)}</td>
                      <td style={{ padding: '12px 16px', textAlign: 'center' }}><span className="inline-flex items-center justify-center" style={{ background: st.bg, color: st.text, borderRadius: '6px', padding: '6px 12px', fontSize: '12px', fontWeight: 500 }}>{status}</span></td>
                      <td style={{ padding: '12px 16px', textAlign: 'center', position: 'relative' }}>
                        <button onClick={() => setOpenMenu(openMenu === s._id ? null : s._id)} className="text-ink-faint hover:text-ink"><MoreVertical className="w-4 h-4" /></button>
                        {openMenu === s._id && (
                          <div className="absolute bg-white shadow-lg z-50" style={{ right: '16px', top: '48px', border: '1px solid var(--color-line)', borderRadius: '8px', padding: '4px', minWidth: '120px' }}>
                            <Link to={`/admin/sellers/${s._id}`} onClick={() => setOpenMenu(null)} className="flex items-center text-ink hover:bg-surface no-underline" style={{ padding: '8px 12px', gap: '8px', fontSize: '14px', borderRadius: '4px' }}><Eye className="w-4 h-4" /> View</Link>
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
            <span className="text-ink-faint" style={{ fontSize: '14px' }}>Showing {start + 1}-{Math.min(start + PAGE_SIZE, total)} of {total}{filter !== 'All' && ` (filtered from ${allSellers.length})`}</span>
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