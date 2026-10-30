import { RotateCcw, Mail, Phone } from 'lucide-react';

export function ReturnsPage() {
  return (
    <div className="flex flex-col" style={{ gap: '24px' }}>
      <div>
        <h2 className="font-sans font-bold text-ink" style={{ fontSize: '24px' }}>Returns</h2>
        <p className="text-body2 text-ink-muted mt-1">Return or exchange items from your orders</p>
      </div>

      <div className="rounded-card-sm border border-dashed border-line-strong bg-white p-12 text-center">
        <div className="rounded-full bg-primary-light w-20 h-20 flex items-center justify-center mx-auto mb-4">
          <RotateCcw className="w-10 h-10 text-brand" />
        </div>
        <h3 className="font-sans font-bold text-ink mb-2" style={{ fontSize: '20px' }}>
          Returns Coming Soon
        </h3>
        <p className="text-body1 text-ink-secondary max-w-md mx-auto mb-6">
          We're building a self-service returns flow. In the meantime, contact
          our support team to start a return or exchange.
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