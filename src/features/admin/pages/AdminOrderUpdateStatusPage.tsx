import { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import { AdminNavbar } from '../components/AdminNavbar';
import { useUpdateOrderStatus } from '@shared/hooks/useUpdateOrderStatus';
import { useToast } from '@/shared/ui';
import { getOrderDetail, STATUS_DISPLAY, ALL_STATUSES } from '../data/adminOrderStaticData';
import type { OrderStatus } from '@shared/hooks/useUpdateOrderStatus';

type StatusKey = 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled' | 'Pending';
const STATUS_STYLES: Record<StatusKey, { bg: string; text: string }> = {
  Processing: { bg: 'var(--color-status-processing-bg)', text: 'var(--color-info-text)' },
  Shipped: { bg: 'var(--color-status-shipped-bg)', text: 'var(--color-info-text)' },
  Delivered: { bg: 'var(--color-status-delivered-bg)', text: 'var(--color-success-text)' },
  Cancelled: { bg: 'var(--color-status-out-of-stock-bg)', text: 'var(--color-danger-dark)' },
  Pending: { bg: 'var(--color-status-pending-bg)', text: 'var(--color-warning-text)' },
};

export function AdminOrderUpdateStatusPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const updateStatus = useUpdateOrderStatus();
  const order = orderId ? getOrderDetail(orderId) : undefined;
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | null>(null);

  if (!order) {
    return (
      <div className="flex flex-col min-h-screen">
        <AdminNavbar />
        <div className="flex-1 flex items-center justify-center"><p className="text-ink">Order not found</p></div>
      </div>
    );
  }

  const currentDisplay = STATUS_DISPLAY[order.status as OrderStatus];

  function handleSubmit() {
    if (!selectedStatus) {
      toast.error('Please select a new status');
      return;
    }
    updateStatus.mutate(
      { orderId: order!._id, status: selectedStatus },
      {
        onSuccess: () => {
          toast.success(`Order ${order!.orderId} status updated to ${STATUS_DISPLAY[selectedStatus]}`);
          navigate(`/admin/orders/${order!.orderId}`);
        },
        onError: (err: { message?: string }) => toast.error(err?.message ?? 'Failed to update status'),
      },
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <AdminNavbar />
      <div className="flex flex-col" style={{ padding: '32px', gap: '24px', maxWidth: '600px' }}>
        <Link to={`/admin/orders/${order.orderId}`} className="flex items-center text-ink-secondary hover:text-ink no-underline" style={{ gap: '8px', fontSize: '16px' }}>
          <ArrowLeft className="w-5 h-5" /> Back to Order
        </Link>
        <h1 className="font-bold text-ink" style={{ fontSize: '20px' }}>Update Order Status</h1>

        <div className="bg-white" style={{ border: '1px solid var(--color-line)', borderRadius: '8px', padding: '24px' }}>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-bold text-ink" style={{ fontSize: '18px' }}>{order.orderId}</h2>
              <p className="text-ink-faint" style={{ fontSize: '14px' }}>{order.customer.name}</p>
              <p className="text-ink-faint" style={{ fontSize: '14px' }}>{order.date}</p>
            </div>
            <div className="flex flex-col items-end" style={{ gap: '4px' }}>
              <span className="text-ink-faint" style={{ fontSize: '12px', textTransform: 'uppercase' }}>Current Status</span>
              <span className="inline-flex items-center justify-center" style={{
                background: STATUS_STYLES[currentDisplay as StatusKey]?.bg ?? 'var(--color-line)',
                color: STATUS_STYLES[currentDisplay as StatusKey]?.text ?? 'var(--color-ink)',
                borderRadius: '6px', padding: '6px 16px', fontSize: '14px', fontWeight: 500,
              }}>
                {currentDisplay}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white" style={{ border: '1px solid var(--color-line)', borderRadius: '8px', padding: '24px' }}>
          <h3 className="font-bold text-ink" style={{ fontSize: '16px', marginBottom: '16px' }}>Select New Status</h3>
          <p className="text-ink-faint" style={{ fontSize: '14px', marginBottom: '16px' }}>
            This will call <code>PATCH /orders/admin/{order._id}/status</code> with the selected value.
          </p>
          <div className="flex flex-col" style={{ gap: '12px' }}>
            {ALL_STATUSES.map((s) => {
              const display = STATUS_DISPLAY[s];
              const st = STATUS_STYLES[display as StatusKey];
              const isSelected = selectedStatus === s;
              const isCurrent = order.status === s;
              return (
                <button
                  key={s}
                  onClick={() => setSelectedStatus(s)}
                  className="flex items-center justify-between"
                  style={{
                    padding: '16px',
                    border: isSelected ? '2px solid var(--color-ink)' : '1px solid var(--color-line)',
                    borderRadius: '8px',
                    cursor: isCurrent ? 'not-allowed' : 'pointer',
                    opacity: isCurrent ? 0.5 : 1,
                    background: isSelected ? 'var(--color-primary-light)' : 'white',
                  }}
                  disabled={isCurrent}
                >
                  <div className="flex items-center" style={{ gap: '12px' }}>
                    <div className="flex items-center justify-center" style={{
                      width: '20px', height: '20px', borderRadius: '50%',
                      border: isSelected ? '6px solid var(--color-ink)' : '2px solid var(--color-line)',
                    }} />
                    <span className="text-ink font-medium" style={{ fontSize: '14px' }}>{display}</span>
                  </div>
                  <div className="flex items-center" style={{ gap: '8px' }}>
                    {isCurrent && <span className="text-ink-faint" style={{ fontSize: '12px' }}>Current</span>}
                    <span className="inline-flex items-center" style={{ background: st?.bg, color: st?.text, borderRadius: '6px', padding: '4px 10px', fontSize: '12px', fontWeight: 500 }}>{display}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex items-center justify-end" style={{ gap: '12px' }}>
          <Link to={`/admin/orders/${order.orderId}`} className="text-ink-secondary no-underline" style={{ fontSize: '16px', fontWeight: 500, padding: '8px 16px' }}>Cancel</Link>
          <button
            onClick={handleSubmit}
            disabled={!selectedStatus || updateStatus.isPending}
            className="flex items-center bg-ink text-white"
            style={{ borderRadius: 'var(--radius-pill)', padding: '8px 24px', fontSize: '16px', fontWeight: 500, height: '48px', gap: '8px', opacity: (!selectedStatus || updateStatus.isPending) ? 0.5 : 1 }}
          >
            <RefreshCw className="w-5 h-5" /> {updateStatus.isPending ? 'Updating...' : 'Update Status'}
          </button>
        </div>
      </div>
    </div>
  );
}