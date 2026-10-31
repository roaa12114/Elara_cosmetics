import { useState } from 'react';
import { Banknote, Download, X, AlertTriangle, CheckCircle2, Clock, Calendar } from 'lucide-react';
import { SellerNavbar } from '../components/SellerNavbar';
import { sellerStats } from '../data/sellerStaticData';
import { formatCurrency } from '@shared/lib/utils';

const PAYOUT_HISTORY = [
  { id: 'PAY-0019', date: 'Jun 15, 2026', amount: 3100.00, method: 'Barclays Bank Transfer ****4821', reference: 'LMPR-JUN15-001', status: 'Paid' },
  { id: 'PAY-0018', date: 'Jul 15, 2026', amount: 980.25, method: 'Barclays Bank Transfer ****4821', reference: 'LMPR-JUL15-001', status: 'Paid' },
  { id: 'PAY-0017', date: 'Aug 15, 2026', amount: 2650.50, method: 'Barclays Bank Transfer ****4821', reference: 'LMPR-AUG15-001', status: 'Paid' },
  { id: 'PAY-0016', date: 'Sep 15, 2026', amount: 1890.75, method: 'Barclays Bank Transfer ****4821', reference: 'LMPR-SEP15-001', status: 'Paid' },
  { id: 'PAY-0015', date: 'Oct 15, 2026', amount: 2160.25, method: 'Barclays Bank Transfer ****4821', reference: 'LMPR-OCT15-001', status: 'Paid' },
];

const QUICK_AMOUNTS = [500, 1000, 2000, sellerStats.availableEarnings];
const MIN_PAYOUT = 50;
const PLATFORM_FEE_PERCENT = 7;

type ModalState = 'closed' | 'request' | 'confirm' | 'success';

export function SellerPayoutsPage() {
  const [modal, setModal] = useState<ModalState>('closed');
  const [amount, setAmount] = useState('');
  const [selectedQuick, setSelectedQuick] = useState<number | null>(null);

  const available = sellerStats.availableEarnings;
  const pending = sellerStats.pendingEarnings;
  const totalPaid = 9780.75;
  const nextPayoutDate = 'Dec 15, 2024';

  function openRequestModal() { setAmount(''); setSelectedQuick(null); setModal('request'); }
  function handleQuickAmount(val: number) { setSelectedQuick(val); setAmount(String(val)); }
  function reviewPayout() { const val = parseFloat(amount); if (isNaN(val) || val < MIN_PAYOUT || val > available) return; setModal('confirm'); }
  function confirmPayout() { setModal('success'); }
  function closeModal() { setModal('closed'); }

  const currentAmount = parseFloat(amount) || 0;
  const remainingBalance = available - currentAmount;

  return (
    <div className="flex flex-col min-h-screen">
      <SellerNavbar />
      <div className="flex flex-col" style={{ padding: '32px', gap: '24px' }}>
        <h1 className="font-bold text-ink" style={{ fontSize: '20px' }}>Payouts</h1>

        <div className="grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
          <div className="bg-white" style={{ borderRadius: '8px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div className="flex items-center justify-between"><span className="text-ink-secondary" style={{ fontSize: '14px' }}>Available Balance</span><Banknote className="w-4 h-4 text-ink-faint" /></div>
            <span className="font-bold text-ink" style={{ fontSize: '24px' }}>{formatCurrency(available)}</span>
            <span className="text-ink-faint" style={{ fontSize: '12px' }}>ready to withdraw</span>
          </div>
          <div className="bg-white" style={{ borderRadius: '8px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div className="flex items-center justify-between"><span className="text-ink-secondary" style={{ fontSize: '14px' }}>Total Paid Out</span><CheckCircle2 className="w-4 h-4 text-ink-faint" /></div>
            <span className="font-bold text-ink" style={{ fontSize: '24px' }}>{formatCurrency(totalPaid)}</span>
            <span className="text-ink-faint" style={{ fontSize: '12px' }}>all time</span>
          </div>
          <div className="bg-white" style={{ borderRadius: '8px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div className="flex items-center justify-between"><span className="text-ink-secondary" style={{ fontSize: '14px' }}>Pending Payout</span><Clock className="w-4 h-4 text-ink-faint" /></div>
            <span className="font-bold text-ink" style={{ fontSize: '24px' }}>{formatCurrency(pending)}</span>
            <span className="text-ink-faint" style={{ fontSize: '12px' }}>processing</span>
          </div>
          <div className="bg-white" style={{ borderRadius: '8px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div className="flex items-center justify-between"><span className="text-ink-secondary" style={{ fontSize: '14px' }}>Next Payout</span><Calendar className="w-4 h-4 text-ink-faint" /></div>
            <span className="font-bold text-ink" style={{ fontSize: '20px' }}>{nextPayoutDate}</span>
            <span className="text-ink-faint" style={{ fontSize: '12px' }}>scheduled</span>
          </div>
        </div>

        <div className="bg-white" style={{ border: '1px solid var(--color-line)', borderRadius: '8px', padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="flex flex-col" style={{ gap: '8px' }}>
            <div><span className="text-ink-faint" style={{ fontSize: '14px' }}>Balance</span><span className="font-bold text-ink" style={{ fontSize: '28px', marginLeft: '12px' }}>{formatCurrency(available)}</span></div>
            <p className="text-ink-faint" style={{ fontSize: '14px' }}>Plus {formatCurrency(pending)} pending. Funds typically arrive in 2–5 business days.</p>
          </div>
          <div className="flex items-center" style={{ gap: '12px' }}>
            <button className="flex items-center text-ink-secondary" style={{ border: '1px solid var(--color-ink-secondary)', borderRadius: 'var(--radius-pill)', padding: '8px 16px', gap: '8px', fontSize: '16px', fontWeight: 500, height: '48px' }}><Download className="w-4 h-4" /> Download Statement</button>
            <button onClick={openRequestModal} className="flex items-center bg-ink text-white" style={{ borderRadius: 'var(--radius-pill)', padding: '8px 24px', gap: '8px', fontSize: '16px', fontWeight: 500, height: '48px' }}><Banknote className="w-5 h-5" /> Request Payout</button>
          </div>
        </div>

        <div className="bg-white" style={{ border: '1px solid var(--color-line)', borderRadius: '8px', padding: '20px' }}>
          <div className="grid grid-cols-4" style={{ gap: '24px' }}>
            <div><span className="text-ink-faint" style={{ fontSize: '12px', textTransform: 'uppercase' }}>Platform Fee</span><p className="text-ink" style={{ fontSize: '14px', marginTop: '4px' }}>{PLATFORM_FEE_PERCENT}% of total sales</p></div>
            <div><span className="text-ink-faint" style={{ fontSize: '12px', textTransform: 'uppercase' }}>Minimum Payout</span><p className="text-ink" style={{ fontSize: '14px', marginTop: '4px' }}>{formatCurrency(MIN_PAYOUT)}</p></div>
            <div><span className="text-ink-faint" style={{ fontSize: '12px', textTransform: 'uppercase' }}>Processing Time</span><p className="text-ink" style={{ fontSize: '14px', marginTop: '4px' }}>2–5 business days</p></div>
            <div><span className="text-ink-faint" style={{ fontSize: '12px', textTransform: 'uppercase' }}>Methods</span><p className="text-ink" style={{ fontSize: '14px', marginTop: '4px' }}>Bank Transfer, PayPal, Stripe</p></div>
          </div>
        </div>

        <div className="bg-white overflow-hidden" style={{ border: '1px solid var(--color-line)', borderRadius: '8px' }}>
          <div style={{ padding: '24px', borderBottom: '1px solid var(--color-line)' }}><h3 className="font-bold text-ink" style={{ fontSize: '16px' }}>Payout History</h3></div>
          <table className="w-full">
            <thead><tr style={{ borderBottom: '1px solid var(--color-line)', background: '#FFF9F9' }}>
              <th className="text-left font-bold text-ink-secondary" style={{ padding: '12px 16px', fontSize: '12px', textTransform: 'uppercase' }}>Payout ID</th>
              <th className="text-left font-bold text-ink-secondary" style={{ padding: '12px 16px', fontSize: '12px', textTransform: 'uppercase' }}>Date</th>
              <th className="text-right font-bold text-ink-secondary" style={{ padding: '12px 16px', fontSize: '12px', textTransform: 'uppercase' }}>Amount</th>
              <th className="text-left font-bold text-ink-secondary" style={{ padding: '12px 16px', fontSize: '12px', textTransform: 'uppercase' }}>Method</th>
              <th className="text-left font-bold text-ink-secondary" style={{ padding: '12px 16px', fontSize: '12px', textTransform: 'uppercase' }}>Reference</th>
              <th className="text-center font-bold text-ink-secondary" style={{ padding: '12px 16px', fontSize: '12px', textTransform: 'uppercase' }}>Status</th>
            </tr></thead>
            <tbody>{PAYOUT_HISTORY.map((p) => (
              <tr key={p.id} style={{ borderBottom: '1px solid var(--color-line)' }} className="hover:bg-surface transition-colors">
                <td className="font-medium text-ink" style={{ padding: '12px 16px', fontSize: '14px' }}>{p.id}</td>
                <td className="text-ink-faint" style={{ padding: '12px 16px', fontSize: '14px' }}>{p.date}</td>
                <td className="text-right font-bold text-ink" style={{ padding: '12px 16px', fontSize: '14px' }}>{formatCurrency(p.amount)}</td>
                <td className="text-ink-secondary" style={{ padding: '12px 16px', fontSize: '14px' }}>{p.method}</td>
                <td className="text-ink-faint font-mono" style={{ padding: '12px 16px', fontSize: '14px' }}>{p.reference}</td>
                <td style={{ padding: '12px 16px', textAlign: 'center' }}><span className="inline-flex items-center justify-center" style={{ background: 'var(--color-status-delivered-bg)', color: 'var(--color-success-text)', borderRadius: '6px', padding: '6px 12px', fontSize: '12px', fontWeight: 500 }}>{p.status}</span></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      </div>

      {modal === 'request' && (
        <Modal onClose={closeModal} title="Request Payout">
          <div className="flex flex-col" style={{ gap: '20px' }}>
            <div>
              <label className="text-ink-secondary" style={{ fontSize: '14px', marginBottom: '8px', display: 'block' }}>Quick Select</label>
              <div className="grid grid-cols-4" style={{ gap: '8px' }}>
                {QUICK_AMOUNTS.map((val) => (
                  <button key={val} onClick={() => handleQuickAmount(val)} className={selectedQuick === val ? 'bg-ink text-white' : 'text-ink-secondary'} style={{ borderRadius: '8px', padding: '12px', fontSize: '16px', fontWeight: 500, border: selectedQuick === val ? 'none' : '1px solid var(--color-line)' }}>{formatCurrency(val)}</button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-ink-secondary" style={{ fontSize: '14px', marginBottom: '6px', display: 'block' }}>Custom Amount (min {formatCurrency(MIN_PAYOUT)})</label>
              <input type="number" min={MIN_PAYOUT} max={available} value={amount} onChange={(e) => { setAmount(e.target.value); setSelectedQuick(null); }} placeholder="0.00" className="w-full bg-white text-ink" style={{ border: '1px solid var(--color-line)', borderRadius: '8px', padding: '12px', fontSize: '18px', height: '48px' }} />
              {amount && parseFloat(amount) > available && <p className="text-danger-dark" style={{ fontSize: '12px', marginTop: '4px' }}>Amount exceeds available balance.</p>}
            </div>
            <div>
              <label className="text-ink-secondary" style={{ fontSize: '14px', marginBottom: '6px', display: 'block' }}>Payment Method</label>
              <div className="flex items-center bg-white" style={{ border: '1px solid var(--color-line)', borderRadius: '8px', padding: '12px 16px', gap: '12px' }}>
                <Banknote className="w-5 h-5 text-brand" /><div><div className="text-ink" style={{ fontSize: '14px' }}>Barclays Bank Transfer</div><div className="text-ink-faint" style={{ fontSize: '12px' }}>****4821</div></div>
              </div>
            </div>
            <div className="flex items-center justify-end" style={{ gap: '12px' }}>
              <button onClick={closeModal} className="text-ink-secondary" style={{ fontSize: '16px', fontWeight: 500, padding: '8px 16px' }}>Cancel</button>
              <button onClick={reviewPayout} disabled={!amount || parseFloat(amount) < MIN_PAYOUT || parseFloat(amount) > available} className="bg-ink text-white" style={{ borderRadius: 'var(--radius-pill)', padding: '8px 24px', fontSize: '16px', fontWeight: 500, height: '48px', opacity: (!amount || parseFloat(amount) < MIN_PAYOUT || parseFloat(amount) > available) ? 0.6 : 1, cursor: (!amount || parseFloat(amount) < MIN_PAYOUT || parseFloat(amount) > available) ? 'not-allowed' : 'pointer' }}>Review Payout</button>
            </div>
          </div>
        </Modal>
      )}

      {modal === 'confirm' && (
        <Modal onClose={closeModal} title="Confirm Payout">
          <div className="flex flex-col" style={{ gap: '20px' }}>
            <div className="bg-surface" style={{ borderRadius: '8px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="flex justify-between"><span className="text-ink-secondary" style={{ fontSize: '14px' }}>Amount</span><span className="font-bold text-ink" style={{ fontSize: '24px' }}>{formatCurrency(currentAmount)}</span></div>
              <div className="flex justify-between"><span className="text-ink-secondary" style={{ fontSize: '14px' }}>Method</span><span className="text-ink" style={{ fontSize: '14px' }}>Bank Transfer (Barclays ****4821)</span></div>
              <div className="flex justify-between"><span className="text-ink-secondary" style={{ fontSize: '14px' }}>Processing Time</span><span className="text-ink" style={{ fontSize: '14px' }}>2–5 business days</span></div>
              <div className="flex justify-between" style={{ paddingTop: '12px', borderTop: '1px solid var(--color-line)' }}><span className="text-ink-secondary" style={{ fontSize: '14px' }}>Remaining Balance</span><span className="font-bold text-ink" style={{ fontSize: '16px' }}>{formatCurrency(remainingBalance)}</span></div>
            </div>
            <div className="flex items-start" style={{ gap: '8px' }}><AlertTriangle className="w-5 h-5 text-warning shrink-0 mt-0.5" /><p className="text-ink-secondary" style={{ fontSize: '14px' }}>This payout cannot be cancelled once confirmed.</p></div>
            <div className="flex items-center justify-end" style={{ gap: '12px' }}>
              <button onClick={() => setModal('request')} className="text-ink-secondary" style={{ fontSize: '16px', fontWeight: 500, padding: '8px 16px' }}>Back</button>
              <button onClick={confirmPayout} className="bg-ink text-white" style={{ borderRadius: 'var(--radius-pill)', padding: '8px 24px', fontSize: '16px', fontWeight: 500, height: '48px' }}>Confirm Payout</button>
            </div>
          </div>
        </Modal>
      )}

      {modal === 'success' && (
        <Modal onClose={closeModal}>
          <div className="flex flex-col items-center" style={{ gap: '16px', padding: '24px' }}>
            <div className="rounded-full flex items-center justify-center" style={{ width: '64px', height: '64px', background: 'var(--color-status-delivered-bg)' }}><CheckCircle2 className="w-8 h-8" style={{ color: 'var(--color-success-text)' }} /></div>
            <h3 className="font-bold text-ink" style={{ fontSize: '20px' }}>Payout Requested!</h3>
            <p className="text-ink-secondary text-center" style={{ fontSize: '14px' }}>Your payout of {formatCurrency(currentAmount)} has been submitted. Funds will arrive in 2–5 business days.</p>
            <button onClick={closeModal} className="bg-ink text-white" style={{ borderRadius: 'var(--radius-pill)', padding: '8px 32px', fontSize: '16px', fontWeight: 500, height: '48px', marginTop: '8px' }}>Done</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

function Modal({ children, onClose, title }: { children: React.ReactNode; onClose: () => void; title?: string }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.4)' }} onClick={onClose}>
      <div className="bg-white" style={{ borderRadius: '16px', padding: '32px', maxWidth: '500px', width: '90%', boxShadow: '0px 20px 40px rgba(0,0,0,0.15)' }} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between" style={{ marginBottom: '24px' }}>
          {title && <h2 className="font-bold text-ink" style={{ fontSize: '20px' }}>{title}</h2>}
          <button onClick={onClose} className="text-ink-faint hover:text-ink"><X className="w-5 h-5" /></button>
        </div>
        {children}
      </div>
    </div>
  );
}