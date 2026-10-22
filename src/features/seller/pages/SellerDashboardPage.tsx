export function SellerDashboardPage() {
  return (
    <div className="p-8">
      <h1 className="text-title font-semibold text-ink">Seller Overview</h1>
      <p className="mt-2 text-body1 text-ink-secondary">
        Phase 1 — foundation scaffold. Real seller dashboard in Phase 3.
      </p>
      <div className="mt-8 grid grid-cols-3 gap-4">
        {[
          { label: 'Products', value: '—' },
          { label: 'Orders', value: '—' },
          { label: 'Inventory', value: '—' },
        ].map((s) => (
          <div key={s.label} className="rounded-card border border-line bg-white p-6">
            <div className="text-body2 text-ink-muted">{s.label}</div>
            <div className="mt-1 text-h5 font-semibold text-ink">{s.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
