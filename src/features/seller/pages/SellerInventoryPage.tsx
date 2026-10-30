import { Boxes, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export function SellerInventoryPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-white border-b border-line px-8 py-4">
        <h1 className="font-sans font-bold text-ink" style={{ fontSize: '20px' }}>Inventory</h1>
        <p className="text-body3 text-ink-muted mt-1">Track stock levels and manage inventory</p>
      </header>

      <div className="flex-1 p-8 flex items-center justify-center">
        <div className="rounded-card-sm border border-dashed border-line-strong bg-white p-12 text-center max-w-md">
          <div className="rounded-full bg-primary-light w-20 h-20 flex items-center justify-center mx-auto mb-4">
            <Boxes className="w-10 h-10 text-brand" />
          </div>
          <h2 className="font-sans font-bold text-ink mb-2" style={{ fontSize: '20px' }}>
            Inventory Management Coming Soon
          </h2>
          <p className="text-body1 text-ink-secondary mb-6">
            Stock level tracking, low-stock alerts, and bulk inventory updates
            are being built alongside the Products page.
          </p>
          <Link
            to="/seller"
            className="inline-flex items-center rounded-pill bg-ink text-white font-bold px-6 py-3 text-body2 hover:bg-ink/90 transition-colors no-underline"
            style={{ gap: '8px' }}
          >
            Back to Overview
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}