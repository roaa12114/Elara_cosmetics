export function HomePage() {
  return (
    <div className="space-y-8">
      <section className="rounded-card bg-primary-light p-12 text-center">
        <h1 className="text-title font-semibold text-brand">Beauty Starts With You</h1>
        <p className="mt-3 text-body1 text-ink-secondary">
          Phase 1 — foundation scaffold. Real home content in Phase 4.
        </p>
      </section>
      <section className="grid grid-cols-3 gap-4">
        {['Makeup', 'Skincare', 'Korean Beauty'].map((label) => (
          <div key={label} className="rounded-card border border-line bg-white p-8 text-center">
            <h2 className="text-h6 font-semibold text-ink">{label}</h2>
            <p className="mt-2 text-body2 text-ink-secondary">Placeholder card</p>
          </div>
        ))}
      </section>
    </div>
  );
}
