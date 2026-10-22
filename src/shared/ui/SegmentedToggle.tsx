import { cx } from "../lib/cx";

type Option = {
  value: string;
  label: string;
};

type SegmentedToggleProps = {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  label?: string;
  className?: string;
};

export function SegmentedToggle({ options, value, onChange, label, className }: SegmentedToggleProps) {
  return (
    <div
      role="tablist"
      aria-label={label}
      className={cx("inline-flex items-center gap-5 rounded-pill bg-white px-6 py-2 shadow-brand-sm", className)}
    >
      {options.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(option.value)}
            className={cx(
              "rounded-pill text-body1 font-bold transition-colors",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
              active ? "h-12 min-w-[137px] bg-ink px-3 text-white" : "h-10 px-4 text-ink-secondary hover:text-ink",
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
