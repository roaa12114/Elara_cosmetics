import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { MoreVertical, Eye, RefreshCw, Printer, XCircle, Download } from 'lucide-react';
import { AdminNavbar } from '../components/AdminNavbar';
import { useToast } from '@/shared/ui';
import { formatCurrency } from '@shared/lib/utils';
import { mockOrders, STATUS_DISPLAY } from '../data/adminOrderStaticData';
import type { AdminOrderRow, OrderStatus } from '../data/adminOrderStaticData';

type StatusKey = 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled' | 'Pending';
const STATUS_STYLES: Record<StatusKey, { bg: string; text: string }> = {
  Processing: { bg: 'var(--color-status-processing-bg)', text: 'var(--color-info-text)' },
  Shipped: { bg: 'var(--color-status-shipped-bg)', text: 'var(--color-info-text)' },
  Delivered: { bg: 'var(--color-status-delivered-bg)', text: 'var(--color-success-text)' },
  Cancelled: { bg: 'var(--color-status-out-of-stock-bg)', text: 'var(--color-danger-dark)' },
  Pending: { bg: 'var(--color-status-pending-bg)', text: 'var(--color-warning-text)' },
};

type PaymentKey = 'Paid' | 'Pending' | 'Failed' | 'Refunded';
const PAYMENT_STYLES: Record<PaymentKey, { bg: string; text: string }> = {
  Paid: { bg: 'var(--color-status-delivered-bg)', text: 'var(--color-success-text)' },
  Pending: { bg: 'var(--color-status-pending-bg)', text: 'var(--color-warning-text)' },
  Failed: { bg: 'var(--color-status-out-of-stock-bg)', text: 'var(--color-danger-dark)' },
  Refunded: { bg: 'var(--color-status-shipped-bg)', text: 'var(--color-info-text)' },
};

const FILTERS = ['All', 'Processing', 'Pending', 'Shipped', 'Delivered', 'Cancelled'] as const;
type FilterValue = (typeof FILTERS)[number];
const PAGE_SIZE = 10;

export function AdminOrderListPage() {
  const toast = useToast();
  const [filter, setFilter] = useState<FilterValue>('All');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const filteredOrders = useMemo(() => {
    const q = search.trim().toLowerCase();
    return mockOrders.filter((o) => {
      if (filter !== 'All' && STATUS_DISPLAY[o.status as OrderStatus] !== filter) return false;
      if (q && !o.orderId.toLowerCase().includes(q) && !o.customerName.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [filter, search]);

  const total = filteredOrders.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * PAGE_SIZE;
  const pagedOrders = filteredOrders.slice(start, start + PAGE_SIZE);

  const completed = mockOrders.filter((o) => o.status === 'delivered').length;
  const pending = mockOrders.filter((o) => o.status === 'pending' || o.status === 'processing').length;
  const cancelled = mockOrders.filter((o) => o.status === 'cancelled').length;

  function handleRefund(o: AdminOrderRow) {
    toast.show(`Refund is in demo mode — no backend endpoint for ${o.orderId}`);
    setOpenMenu(null);
  }
  function handlePrint(o: AdminOrderRow) {
    toast.show(`Printing invoice for ${o.orderId}...`);
    setOpenMenu(null);
    setTimeout(() => window.print(), 500);
  }
  function handleCancel(o: AdminOrderRow) {
    if (!window.confirm(`Cancel order ${o.orderId}? This will notify ${o.customerName}.`)) return;
    toast.show(`Cancelling ${o.orderId} via PATCH /orders/admin/${o._id}/status...`);
    setOpenMenu(null);
  }

  return (
    <div className="flex flex-col min-h-screen">
      <AdminNavbar />
      <div className="flex flex-col" style={{ padding: '32px', gap: '24px' }}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-bold text-ink" style={{ fontSize: '20px' }}>Order Management</h1>
            <p className="text-ink-faint" style={{ fontSize: '14px' }}>Manage and track all customer orders</p>
          </div>
          <button onClick={() => toast.show('Export is in demo mode — no export endpoint')} className="flex items-center bg-white text-ink" style={{ border: '1px solid var(--color-line)', borderRadius: 'var(--radius-pill)', padding: '8px 16px', gap: '8px', fontSize: '16px', fontWeight: 500, height: '48px' }}>
            <Download className="w-5 h-5" /> Export Orders
          </button>
        </div>

        <div className="grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
          <StatCard label="Completed" value={String(completed)} change="+12.4%" />
          <StatCard label="Total Orders" value={String(mockOrders.length)} change="+8.1%" />
          <StatCard label="Pending" value={String(pending)} change="+8.1%" />
          <StatCard label="Cancelled" value={String(cancelled)} change="+8.1%" />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center overflow-hidden" style={{ minWidth: '300px', height: '40px', border: '1px solid var(--color-line)', borderRadius: '8px' }}>
            <input type="search" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="Search by order ID or customer..." className="flex-1 h-full bg-transparent px-4 text-body2 focus:outline-none" />
          </div>
          <div className="flex items-center" style={{ gap: '6px' }}>
            {FILTERS.map((f) => (
              <button key={f} onClick={() => { setFilter(f); setPage(1); }} className={filter === f ? 'bg-ink text-white' : 'text-ink-secondary'} style={{ borderRadius: 'var(--radius-pill)', padding: '8px 16px', fontSize: '14px', fontWeight: 500, border: filter === f ? 'none' : '1px solid var(--color-line)' }}>{f}</button>
            ))}
          </div>
        </div>

        {pagedOrders.length === 0 ? (
          <div className="bg-white" style={{ border: '1px solid var(--color-line)', borderRadius: '8px', padding: '48px', textAlign: 'center' }}>
            <p className="text-ink" style={{ fontSize: '18px', fontWeight: 600 }}>No orders found</p>
            <p className="text-ink-faint" style={{ fontSize: '14px', marginTop: '8px' }}>{search.trim() ? `No orders match "${search.trim()}".` : 'Try adjusting your filters.'}</p>
          </div>
        ) : (
          <div className="bg-white overflow-hidden" style={{ border: '1px solid var(--color-line)', borderRadius: '8px' }}>
            <table className="w-full">
              <thead><tr style={{ borderBottom: '1px solid var(--color-line)', background: '#FFF9F9' }}>
                <th className="text-left font-bold text-ink-secondary" style={{ padding: '12px 16px', fontSize: '12px', textTransform: 'uppercase' }}>Order ID</th>
                <th className="text-left font-bold text-ink-secondary" style={{ padding: '12px 16px', fontSize: '12px', textTransform: 'uppercase' }}>Customer</th>
                <th className="text-center font-bold text-ink-secondary" style={{ padding: '12px 16px', fontSize: '12px', textTransform: 'uppercase' }}>Items</th>
                <th className="text-right font-bold text-ink-secondary" style={{ padding: '12px 16px', fontSize: '12px', textTransform: 'uppercase' }}>Total</th>
                <th className="text-center font-bold text-ink-secondary" style={{ padding: '12px 16px', fontSize: '12px', textTransform: 'uppercase' }}>Payment</th>
                <th className="text-left font-bold text-ink-secondary" style={{ padding: '12px 16px', fontSize: '12px', textTransform: 'uppercase' }}>Date</th>
                <th className="text-center font-bold text-ink-secondary" style={{ padding: '12px 16px', fontSize: '12px', textTransform: 'uppercase' }}>Status</th>
                <th className="text-center font-bold text-ink-secondary" style={{ padding: '12px 16px', fontSize: '12px', textTransform: 'uppercase' }}>Actions</th>
              </tr></thead>
              <tbody>
                {pagedOrders.map((o: AdminOrderRow) => {
                  const st = STATUS_STYLES[STATUS_DISPLAY[o.status as OrderStatus] as StatusKey] ?? STATUS_STYLES.Pending;
                  const pst = PAYMENT_STYLES[o.paymentStatus as PaymentKey] ?? PAYMENT_STYLES.Pending;
                  return (
                    <tr key={o._id} style={{ borderBottom: '1px solid var(--color-line)' }} className="hover:bg-surface transition-colors">
                      <td className="font-medium text-ink" style={{ padding: '12px 16px', fontSize: '14px' }}>{o.orderId}</td>
                      <td style={{ padding: '12px 16px' }}><div className="text-ink" style={{ fontSize: '14px' }}>{o.customerName}</div><div className="text-ink-faint" style={{ fontSize: '12px' }}>{o.customerEmail}</div></td>
                      <td className="text-center text-ink" style={{ padding: '12px 16px', fontSize: '14px' }}>{o.itemsCount}</td>
                      <td className="text-right font-bold text-ink" style={{ padding: '12px 16px', fontSize: '14px' }}>{formatCurrency(o.total)}</td>
                      <td style={{ padding: '12px 16px', textAlign: 'center' }}><span className="inline-flex items-center justify-center" style={{ background: pst.bg, color: pst.text, borderRadius: '6px', padding: '4px 10px', fontSize: '12px', fontWeight: 500 }}>{o.paymentStatus}</span></td>
                      <td className="text-ink-faint" style={{ padding: '12px 16px', fontSize: '14px' }}>{o.date}</td>
                      <td style={{ padding: '12px 16px', textAlign: 'center' }}><span className="inline-flex items-center justify-center" style={{ background: st.bg, color: st.text, borderRadius: '6px', padding: '6px 12px', fontSize: '12px', fontWeight: 500 }}>{STATUS_DISPLAY[o.status as OrderStatus]}</span></td>
                      <td style={{ padding: '12px 16px', textAlign: 'center', position: 'relative' }}>
                        <button onClick={() => setOpenMenu(openMenu === o._id ? null : o._id)} className="text-ink-faint hover:text-ink"><MoreVertical className="w-4 h-4" /></button>
                        {openMenu === o._id && (
                          <div className="absolute bg-white shadow-lg z-50" style={{ right: '16px', top: '48px', border: '1px solid var(--color-line)', borderRadius: '8px', padding: '4px', minWidth: '160px' }}>
                            <Link to={`/admin/orders/${o.orderId}`} onClick={() => setOpenMenu(null)} className="flex items-center text-ink hover:bg-surface no-underline" style={{ padding: '8px 12px', gap: '8px', fontSize: '14px', borderRadius: '4px' }}><Eye className="w-4 h-4" /> View Order</Link>
                            <Link to={`/admin/orders/${o.orderId}/status`} onClick={() => setOpenMenu(null)} className="flex items-center text-ink hover:bg-surface no-underline" style={{ padding: '8px 12px', gap: '8px', fontSize: '14px', borderRadius: '4px' }}><RefreshCw className="w-4 h-4" /> Update Status</Link>
                            <button onClick={() => handleRefund(o)} className="flex items-center text-ink hover:bg-surface w-full" style={{ padding: '8px 12px', gap: '8px', fontSize: '14px', borderRadius: '4px' }}><RefreshCw className="w-4 h-4" /> Refund</button>
                            <button onClick={() => handlePrint(o)} className="flex items-center text-ink hover:bg-surface w-full" style={{ padding: '8px 12px', gap: '8px', fontSize: '14px', borderRadius: '4px' }}><Printer className="w-4 h-4" /> Print Invoice</button>
                            <div style={{ height: '1px', background: 'var(--color-line)', margin: '4px 0' }} />
                            <button onClick={() => handleCancel(o)} className="flex items-center text-danger-dark hover:bg-danger-dark/5 w-full" style={{ padding: '8px 12px', gap: '8px', fontSize: '14px', borderRadius: '4px' }}><XCircle className="w-4 h-4" /> Cancel Order</button>
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
            <span className="text-ink-faint" style={{ fontSize: '14px' }}>Showing {start + 1}-{Math.min(start + PAGE_SIZE, total)} of {total} Orders{filter !== 'All' && ` (filtered from ${mockOrders.length})`}</span>
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