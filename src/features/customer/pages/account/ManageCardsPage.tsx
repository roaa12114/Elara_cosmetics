import { CreditCard, ShieldCheck, Lock } from 'lucide-react';

export function ManageCardsPage() {
  return (
    <div className="flex flex-col" style={{ gap: '24px' }}>
      <div>
        <h2 className="font-sans font-bold text-ink" style={{ fontSize: '24px' }}>Manage Cards</h2>
        <p className="text-body2 text-ink-muted mt-1">Your saved payment methods</p>
      </div>

      <div className="rounded-card-sm border border-dashed border-line-strong bg-white p-12 text-center">
        <div className="rounded-full bg-primary-light w-20 h-20 flex items-center justify-center mx-auto mb-4">
          <CreditCard className="w-10 h-10 text-brand" />
        </div>
        <h3 className="font-sans font-bold text-ink mb-2" style={{ fontSize: '20px' }}>
          Saved Cards Coming Soon
        </h3>
        <p className="text-body1 text-ink-secondary max-w-md mx-auto mb-6">
          We don't store your card details — all payments are processed
          securely by Stripe on their hosted checkout page. Soon you'll be able
          to manage your Stripe-saved cards here.
        </p>

        <div className="flex items-center justify-center flex-wrap" style={{ gap: '24px' }}>
          <div className="flex items-center text-body2 text-ink-secondary" style={{ gap: '6px' }}>
            <ShieldCheck className="w-5 h-5 text-success" />
            <span>256-bit SSL encryption</span>
          </div>
          <div className="flex items-center text-body2 text-ink-secondary" style={{ gap: '6px' }}>
            <Lock className="w-5 h-5 text-success" />
            <span>PCI DSS compliant</span>
          </div>
        </div>
      </div>
    </div>
  );
}