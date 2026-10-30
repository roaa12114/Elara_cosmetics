import { useParams, Link } from 'react-router-dom';
import { Ban, ArrowLeft, Mail, Phone } from 'lucide-react';

export function CancelItemsPage() {
  const { id } = useParams();

  return (
    <div className="flex flex-col" style={{ gap: '24px' }}>
      <nav className="flex items-center gap-2 text-body2" aria-label="Breadcrumb">
        <Link to="/account/orders" className="text-ink-secondary hover:text-ink no-underline">My Orders</Link>
        <span className="text-ink-muted">/</span>
        {id ? (
          <>
            <Link to={`/account/orders/${id}`} className="text-ink-secondary hover:text-ink no-underline">Order Details</Link>
            <span className="text-ink-muted">/</span>
          </>
        ) : null}
        <span className="text-ink font-medium">Cancel items</span>
      </nav>

      {id && (
        <Link to={`/account/orders/${id}`} className="inline-flex items-center text-body2 text-ink-secondary hover:text-ink no-underline" style={{ gap: '6px' }}>
          <ArrowLeft className="w-4 h-4" />
          Back to Order Details
        </Link>
      )}

      <div className="rounded-card-sm border border-dashed border-line-strong bg-white p-12 text-center">
        <div className="rounded-full bg-danger/10 w-20 h-20 flex items-center justify-center mx-auto mb-4">
          <Ban className="w-10 h-10 text-danger" />
        </div>
        <h3 className="font-sans font-bold text-ink mb-2" style={{ fontSize: '20px' }}>
          Self-Service Cancel Coming Soon
        </h3>
        <p className="text-body1 text-ink-secondary max-w-md mx-auto mb-6">
          Online cancellation isn't available yet. If your order hasn't shipped,
          please contact our support team right away — they can cancel it for
          you before it leaves the warehouse.
        </p>

        <div className="flex items-center justify-center flex-wrap" style={{ gap: '24px' }}>
          <a
            href="mailto:Elara.shop23@gmail.com"
            className="flex items-center text-body2 text-ink hover:text-brand no-underline"
            style={{ gap: '8px' }}
          >
            <Mail className="w-5 h-5" />
            Elara.shop23@gmail.com
          </a>
          <a
            href="tel:0123456789"
            className="flex items-center text-body2 text-ink hover:text-brand no-underline"
            style={{ gap: '8px' }}
          >
            <Phone className="w-5 h-5" />
            0123456789
          </a>
        </div>
      </div>
    </div>
  );
}