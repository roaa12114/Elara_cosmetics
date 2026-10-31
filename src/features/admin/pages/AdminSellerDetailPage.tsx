import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Pencil, Ban, FileText } from 'lucide-react';
import { AdminNavbar } from '../components/AdminNavbar';
import { useAdminSellers } from '@shared/hooks/useAdminSellers';
import { getSellerProfile } from '../data/adminSellerStaticData';
import { formatCurrency, formatDate, initialsOf } from '@shared/lib/utils';

type StatusKey = 'Active' | 'Blocked';
const STATUS_STYLES: Record<StatusKey, { bg: string; text: string }> = {
  Active: { bg: 'var(--color-status-delivered-bg)', text: 'var(--color-success-text)' },
  Blocked: { bg: 'var(--color-status-out-of-stock-bg)', text: '#171315' },
};

type StockStatus = 'In Stock' | 'Low Stock' | 'Out of Stock';
const STOCK_STYLES: Record<StockStatus, { color: string }> = {
  'In Stock': { color: 'var(--color-success-text)' },
  'Low Stock': { color: 'var(--color-warning-text)' },
  'Out of Stock': { color: 'var(--color-danger-dark)' },
};

export function AdminSellerDetailPage() {
  const { id } = useParams();
  const { data, isLoading } = useAdminSellers({ limit: 100 });
  const seller = data?.sellers?.find((s) => s._id === id);

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <AdminNavbar />
        <div className="flex-1 flex items-center justify-center"><p className="text-ink-faint">Loading...</p></div>
      </div>
    );
  }
  if (!seller) {
    return (
      <div className="flex flex-col min-h-screen">
        <AdminNavbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-ink" style={{ fontSize: '18px', fontWeight: 600 }}>Seller not found</p>
            <Link to="/admin/sellers" className="text-brand hover:underline">← Back to sellers</Link>
          </div>
        </div>
      </div>
    );
  }

  const profile = getSellerProfile(seller._id);
  const status: StatusKey = seller.isActive ? 'Active' : 'Blocked';
  const st = STATUS_STYLES[status];
  const stats = profile.stats ?? { totalProducts: 0, totalOrders: 0, totalRevenue: 0, totalPayouts: 0 };
  const catalog = profile.catalog ?? [];

  const statCards = [
    { label: 'Total Products', value: String(stats.totalProducts) },
    { label: 'Total Orders', value: stats.totalOrders.toLocaleString() },
    { label: 'Total Revenue', value: formatCurrency(stats.totalRevenue) },
    { label: 'Total Payouts', value: formatCurrency(stats.totalPayouts) },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <AdminNavbar />
      <div className="flex flex-col" style={{ padding: '32px', gap: '24px' }}>
        <Link to="/admin/sellers" className="flex items-center text-ink-secondary hover:text-ink no-underline" style={{ gap: '8px', fontSize: '16px' }}>
          <ArrowLeft className="w-5 h-5" /> Back to Sellers
        </Link>

        {/* Header */}
        <div className="bg-white" style={{ border: '1px solid var(--color-line)', borderRadius: '8px', padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div className="flex items-center" style={{ gap: '16px' }}>
            <div className="rounded-full bg-primary text-brand font-bold flex items-center justify-center" style={{ width: '64px', height: '64px', fontSize: '24px' }}>
              {initialsOf(seller.name)}
            </div>
            <div>
              <h1 className="font-bold text-ink" style={{ fontSize: '24px' }}>{seller.name}</h1>
              <p className="text-ink-faint" style={{ fontSize: '14px' }}>{seller.email}</p>
              <div className="flex items-center" style={{ gap: '8px', marginTop: '8px' }}>
                <span className="inline-flex items-center justify-center" style={{ background: st.bg, color: st.text, borderRadius: '6px', padding: '4px 12px', fontSize: '12px', fontWeight: 500 }}>{status}</span>
                <span className="text-ink-faint" style={{ fontSize: '14px' }}>Joined {formatDate(seller.createdAt)}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center" style={{ gap: '8px' }}>
            <Link to={`/admin/sellers/${seller._id}/application`} className="flex items-center bg-white text-ink no-underline" style={{ border: '1px solid var(--color-line)', borderRadius: 'var(--radius-pill)', padding: '8px 16px', gap: '6px', fontSize: '14px', fontWeight: 500 }}>
              <FileText className="w-4 h-4" /> View Application
            </Link>
            <Link to={`/admin/sellers/${seller._id}/edit`} className="flex items-center bg-ink text-white no-underline" style={{ borderRadius: 'var(--radius-pill)', padding: '8px 16px', gap: '6px', fontSize: '14px', fontWeight: 500 }}>
              <Pencil className="w-4 h-4" /> Edit Profile
            </Link>
            <Link to={`/admin/sellers/${seller._id}/block`} className="flex items-center text-danger-dark no-underline" style={{ border: '1px solid var(--color-danger-dark)', borderRadius: 'var(--radius-pill)', padding: '8px 16px', gap: '6px', fontSize: '14px', fontWeight: 500 }}>
              <Ban className="w-4 h-4" /> Block
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
          {statCards.map((s) => (
            <div key={s.label} className="bg-white" style={{ borderRadius: '8px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <span className="text-ink-secondary" style={{ fontSize: '14px' }}>{s.label}</span>
              <span className="font-bold text-ink" style={{ fontSize: '20px' }}>{s.value}</span>
            </div>
          ))}
        </div>

        {/* Store info */}
        <div className="bg-white" style={{ border: '1px solid var(--color-line)', borderRadius: '8px', padding: '24px' }}>
          <h3 className="font-bold text-ink" style={{ fontSize: '16px', marginBottom: '16px' }}>Store Information</h3>
          <div className="grid grid-cols-2" style={{ gap: '16px' }}>
            <div><span className="text-ink-faint" style={{ fontSize: '12px', textTransform: 'uppercase' }}>Store Name</span><p className="text-ink" style={{ fontSize: '14px' }}>{profile.storeName}</p></div>
            <div><span className="text-ink-faint" style={{ fontSize: '12px', textTransform: 'uppercase' }}>Business Type</span><p className="text-ink" style={{ fontSize: '14px' }}>{profile.businessType}</p></div>
            <div><span className="text-ink-faint" style={{ fontSize: '12px', textTransform: 'uppercase' }}>Specialty</span><p className="text-ink" style={{ fontSize: '14px' }}>{profile.specialty || '—'}</p></div>
            <div><span className="text-ink-faint" style={{ fontSize: '12px', textTransform: 'uppercase' }}>Phone</span><p className="text-ink" style={{ fontSize: '14px' }}>{seller.phone || '—'}</p></div>
          </div>
          {profile.storeDescription && (
            <div style={{ marginTop: '16px' }}>
              <span className="text-ink-faint" style={{ fontSize: '12px', textTransform: 'uppercase' }}>Store Description</span>
              <p className="text-ink" style={{ fontSize: '14px', marginTop: '4px' }}>{profile.storeDescription}</p>
            </div>
          )}
        </div>

        {/* Store Catalog */}
        <div className="bg-white overflow-hidden" style={{ border: '1px solid var(--color-line)', borderRadius: '8px' }}>
          <div style={{ padding: '24px', borderBottom: '1px solid var(--color-line)' }}>
            <h3 className="font-bold text-ink" style={{ fontSize: '16px' }}>Store Catalog</h3>
          </div>
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--color-line)', background: '#FFF9F9' }}>
                <th className="text-left font-bold text-ink-secondary" style={{ padding: '12px 16px', fontSize: '12px', textTransform: 'uppercase' }}>Product</th>
                <th className="text-right font-bold text-ink-secondary" style={{ padding: '12px 16px', fontSize: '12px', textTransform: 'uppercase' }}>Price</th>
                <th className="text-center font-bold text-ink-secondary" style={{ padding: '12px 16px', fontSize: '12px', textTransform: 'uppercase' }}>Stock</th>
                <th className="text-center font-bold text-ink-secondary" style={{ padding: '12px 16px', fontSize: '12px', textTransform: 'uppercase' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {catalog.length === 0 ? (
                <tr><td colSpan={4} className="text-ink-faint text-center" style={{ padding: '32px' }}>No products in catalog</td></tr>
              ) : catalog.map((p, i) => (
                <tr key={i} style={{ borderBottom: '1px solid var(--color-line)' }}>
                  <td className="font-medium text-ink" style={{ padding: '12px 16px', fontSize: '14px' }}>{p.name}</td>
                  <td className="text-right font-bold text-ink" style={{ padding: '12px 16px', fontSize: '14px' }}>{formatCurrency(p.price)}</td>
                  <td className="text-center text-ink" style={{ padding: '12px 16px', fontSize: '14px' }}>{p.stock}</td>
                  <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                    <span style={{ fontSize: '14px', color: STOCK_STYLES[p.status].color, fontWeight: 500 }}>{p.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}