import { useState } from 'react';
import { Plus, MoreVertical, Pencil, Trash2 } from 'lucide-react';
import { AdminNavbar } from '../components/AdminNavbar';
import { useToast } from '@/shared/ui';
import { formatCurrency } from '@shared/lib/utils';
import { shippingMethods, deliveryAreas, shippingStats } from '../data/adminShippingStaticData';
import type { ShippingMethod, DeliveryArea } from '../data/adminShippingStaticData';

type Tab = 'methods' | 'areas';

export function AdminShippingPage() {
  const toast = useToast();
  const [tab, setTab] = useState<Tab>('methods');
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  function handleToggle(item: ShippingMethod | DeliveryArea) {
    toast.show(`${item.isActive ? 'Disable' : 'Enable'} is in demo mode — no backend endpoint for "${item.name}"`);
    setOpenMenu(null);
  }
  function handleEdit(item: ShippingMethod | DeliveryArea) {
    toast.show(`Edit is in demo mode — no backend endpoint for "${item.name}"`);
    setOpenMenu(null);
  }
  function handleDelete(item: ShippingMethod | DeliveryArea) {
    if (!window.confirm(`Delete "${item.name}"? This cannot be undone.`)) return;
    toast.show(`Delete is in demo mode — no backend endpoint for "${item.name}"`);
    setOpenMenu(null);
  }

  return (
    <div className="flex flex-col min-h-screen">
      <AdminNavbar />
      <div className="flex flex-col" style={{ padding: '32px', gap: '24px' }}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-bold text-ink" style={{ fontSize: '20px' }}>Shipping Management</h1>
            <p className="text-ink-faint" style={{ fontSize: '14px' }}>Manage shipping methods and delivery areas</p>
          </div>
          <button
            onClick={() => toast.show(tab === 'methods' ? 'Add shipping method is in demo mode' : 'Add delivery area is in demo mode')}
            className="flex items-center bg-ink text-white"
            style={{ borderRadius: 'var(--radius-pill)', padding: '8px 16px', gap: '8px', fontSize: '16px', fontWeight: 500, height: '48px' }}
          >
            <Plus className="w-5 h-5" /> {tab === 'methods' ? 'Add Shipping Method' : 'Add Delivery Area'}
          </button>
        </div>

        {/* Stat cards */}
        <div className="grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
          <StatCard label="Active Methods" value={String(shippingStats.activeMethods)} change="+12.4%" />
          <StatCard label="Shipping Methods" value={String(shippingStats.totalMethods)} change="+8.1%" />
          <StatCard label="Delivery Areas" value={String(shippingStats.deliveryAreas)} change="+8.1%" />
          <StatCard label="Orders in Transit" value={String(shippingStats.ordersInTransit)} change="+8.1%" />
        </div>

        {/* Tabs */}
        <div className="flex items-center" style={{ gap: '4px', borderBottom: '1px solid var(--color-line)' }}>
          <button
            onClick={() => { setTab('methods'); setOpenMenu(null); }}
            className={tab === 'methods' ? 'text-ink font-medium' : 'text-ink-faint'}
            style={{ padding: '12px 16px', fontSize: '14px', fontWeight: 500, borderBottom: tab === 'methods' ? '2px solid var(--color-ink)' : '2px solid transparent', marginBottom: '-1px' }}
          >
            Shipping Methods
          </button>
          <button
            onClick={() => { setTab('areas'); setOpenMenu(null); }}
            className={tab === 'areas' ? 'text-ink font-medium' : 'text-ink-faint'}
            style={{ padding: '12px 16px', fontSize: '14px', fontWeight: 500, borderBottom: tab === 'areas' ? '2px solid var(--color-ink)' : '2px solid transparent', marginBottom: '-1px' }}
          >
            Delivery Areas
          </button>
        </div>

        {/* Table */}
        {tab === 'methods' ? (
          <div className="bg-white overflow-hidden" style={{ border: '1px solid var(--color-line)', borderRadius: '8px' }}>
            <table className="w-full">
              <thead><tr style={{ borderBottom: '1px solid var(--color-line)', background: '#FFF9F9' }}>
                <th className="text-left font-bold text-ink-secondary" style={{ padding: '12px 16px', fontSize: '12px', textTransform: 'uppercase' }}>Method</th>
                <th className="text-left font-bold text-ink-secondary" style={{ padding: '12px 16px', fontSize: '12px', textTransform: 'uppercase' }}>Delivery Time</th>
                <th className="text-right font-bold text-ink-secondary" style={{ padding: '12px 16px', fontSize: '12px', textTransform: 'uppercase' }}>Cost</th>
                <th className="text-center font-bold text-ink-secondary" style={{ padding: '12px 16px', fontSize: '12px', textTransform: 'uppercase' }}>Status</th>
                <th className="text-center font-bold text-ink-secondary" style={{ padding: '12px 16px', fontSize: '12px', textTransform: 'uppercase' }}>Actions</th>
              </tr></thead>
              <tbody>
                {shippingMethods.map((m: ShippingMethod) => (
                  <tr key={m._id} style={{ borderBottom: '1px solid var(--color-line)' }} className="hover:bg-surface transition-colors">
                    <td className="font-medium text-ink" style={{ padding: '12px 16px', fontSize: '14px' }}>{m.name}</td>
                    <td className="text-ink-faint" style={{ padding: '12px 16px', fontSize: '14px' }}>{m.deliveryTime}</td>
                    <td className="text-right font-bold text-ink" style={{ padding: '12px 16px', fontSize: '14px' }}>{m.cost === 0 ? 'Free' : formatCurrency(m.cost)}</td>
                    <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                      <span className="inline-flex items-center justify-center" style={{
                        background: m.isActive ? 'var(--color-status-delivered-bg)' : 'var(--color-status-out-of-stock-bg)',
                        color: m.isActive ? 'var(--color-success-text)' : '#171315',
                        borderRadius: '6px', padding: '6px 12px', fontSize: '12px', fontWeight: 500,
                      }}>
                        {m.isActive ? 'Enabled' : 'Disabled'}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'center', position: 'relative' }}>
                      <button onClick={() => setOpenMenu(openMenu === m._id ? null : m._id)} className="text-ink-faint hover:text-ink"><MoreVertical className="w-4 h-4" /></button>
                      {openMenu === m._id && (
                        <div className="absolute bg-white shadow-lg z-50" style={{ right: '16px', top: '48px', border: '1px solid var(--color-line)', borderRadius: '8px', padding: '4px', minWidth: '160px' }}>
                          <button onClick={() => handleEdit(m)} className="flex items-center text-ink hover:bg-surface w-full" style={{ padding: '8px 12px', gap: '8px', fontSize: '14px', borderRadius: '4px' }}><Pencil className="w-4 h-4" /> Edit</button>
                          <button onClick={() => handleToggle(m)} className="flex items-center text-ink hover:bg-surface w-full" style={{ padding: '8px 12px', gap: '8px', fontSize: '14px', borderRadius: '4px' }}>{m.isActive ? 'Disable' : 'Enable'}</button>
                          <div style={{ height: '1px', background: 'var(--color-line)', margin: '4px 0' }} />
                          <button onClick={() => handleDelete(m)} className="flex items-center text-danger-dark hover:bg-danger-dark/5 w-full" style={{ padding: '8px 12px', gap: '8px', fontSize: '14px', borderRadius: '4px' }}><Trash2 className="w-4 h-4" /> Delete</button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="bg-white overflow-hidden" style={{ border: '1px solid var(--color-line)', borderRadius: '8px' }}>
            <table className="w-full">
              <thead><tr style={{ borderBottom: '1px solid var(--color-line)', background: '#FFF9F9' }}>
                <th className="text-left font-bold text-ink-secondary" style={{ padding: '12px 16px', fontSize: '12px', textTransform: 'uppercase' }}>Area</th>
                <th className="text-right font-bold text-ink-secondary" style={{ padding: '12px 16px', fontSize: '12px', textTransform: 'uppercase' }}>Cost</th>
                <th className="text-left font-bold text-ink-secondary" style={{ padding: '12px 16px', fontSize: '12px', textTransform: 'uppercase' }}>Delivery Time</th>
                <th className="text-center font-bold text-ink-secondary" style={{ padding: '12px 16px', fontSize: '12px', textTransform: 'uppercase' }}>Status</th>
                <th className="text-center font-bold text-ink-secondary" style={{ padding: '12px 16px', fontSize: '12px', textTransform: 'uppercase' }}>Actions</th>
              </tr></thead>
              <tbody>
                {deliveryAreas.map((a: DeliveryArea) => (
                  <tr key={a._id} style={{ borderBottom: '1px solid var(--color-line)' }} className="hover:bg-surface transition-colors">
                    <td className="font-medium text-ink" style={{ padding: '12px 16px', fontSize: '14px' }}>{a.name}</td>
                    <td className="text-right font-bold text-ink" style={{ padding: '12px 16px', fontSize: '14px' }}>{formatCurrency(a.cost)}</td>
                    <td className="text-ink-faint" style={{ padding: '12px 16px', fontSize: '14px' }}>{a.deliveryTime}</td>
                    <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                      <span className="inline-flex items-center justify-center" style={{
                        background: a.isActive ? 'var(--color-status-delivered-bg)' : 'var(--color-status-out-of-stock-bg)',
                        color: a.isActive ? 'var(--color-success-text)' : '#171315',
                        borderRadius: '6px', padding: '6px 12px', fontSize: '12px', fontWeight: 500,
                      }}>
                        {a.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'center', position: 'relative' }}>
                      <button onClick={() => setOpenMenu(openMenu === a._id ? null : a._id)} className="text-ink-faint hover:text-ink"><MoreVertical className="w-4 h-4" /></button>
                      {openMenu === a._id && (
                        <div className="absolute bg-white shadow-lg z-50" style={{ right: '16px', top: '48px', border: '1px solid var(--color-line)', borderRadius: '8px', padding: '4px', minWidth: '160px' }}>
                          <button onClick={() => handleEdit(a)} className="flex items-center text-ink hover:bg-surface w-full" style={{ padding: '8px 12px', gap: '8px', fontSize: '14px', borderRadius: '4px' }}><Pencil className="w-4 h-4" /> Edit</button>
                          <button onClick={() => handleToggle(a)} className="flex items-center text-ink hover:bg-surface w-full" style={{ padding: '8px 12px', gap: '8px', fontSize: '14px', borderRadius: '4px' }}>{a.isActive ? 'Deactivate' : 'Activate'}</button>
                          <div style={{ height: '1px', background: 'var(--color-line)', margin: '4px 0' }} />
                          <button onClick={() => handleDelete(a)} className="flex items-center text-danger-dark hover:bg-danger-dark/5 w-full" style={{ padding: '8px 12px', gap: '8px', fontSize: '14px', borderRadius: '4px' }}><Trash2 className="w-4 h-4" /> Delete</button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <p className="text-ink-faint" style={{ fontSize: '12px' }}>Shipping data is frontend mock — the backend has no shipping endpoints yet.</p>
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