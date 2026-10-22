import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-surface">
      <div className="text-center">
        <h1 className="text-title font-semibold text-brand">404</h1>
        <p className="mt-4 text-body1 text-ink-secondary">Page not found.</p>
        <Link to="/" className="mt-6 inline-block text-body1 font-bold text-brand hover:underline">
          Back to home →
        </Link>
      </div>
    </div>
  );
}
