import type { ReactNode } from "react";

type AuthCardProps = {
  title: string;
  subtitle?: string;
  toggle?: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
};

export function AuthCard({ title, subtitle, toggle, footer, children }: AuthCardProps) {
  return (
    <section className="mx-auto flex w-full max-w-[978px] flex-col items-center gap-[46px] rounded-card bg-white px-6 py-14 shadow-brand">
      {toggle}
      <div className="flex w-full max-w-[640px] flex-col items-center gap-8">
        <header className="flex flex-col items-center gap-2 text-center text-ink-secondary">
          <h1 className="text-title font-semibold">{title}</h1>
          {subtitle && <p className="text-body1 font-medium">{subtitle}</p>}
        </header>
        <div className="flex w-full flex-col gap-5">{children}</div>
        {footer && <div className="flex items-center gap-3 text-body1 font-bold text-ink-secondary">{footer}</div>}
      </div>
    </section>
  );
}
