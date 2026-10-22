import { forwardRef, useId, useState } from "react";
import type { InputHTMLAttributes } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cx } from "../lib/cx";

type TextFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
};

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(function TextField(
  { label, error, type = "text", className, id, ...props },
  ref,
) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const errorId = inputId + "-error";
  const [visible, setVisible] = useState(false);
  const isPassword = type === "password";

  return (
    <div className="flex w-full flex-col gap-2">
      <label htmlFor={inputId} className="sr-only">
        {label}
      </label>
      <div
        className={cx(
          "flex h-12 w-full items-center gap-3 rounded-pill border bg-white px-5 py-3 focus-within:border-brand",
          error ? "border-danger" : "border-line",
          className,
        )}
      >
        <input
          ref={ref}
          id={inputId}
          type={isPassword && visible ? "text" : type}
          placeholder={label}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          className="min-w-0 flex-1 bg-transparent text-body2 text-ink outline-none placeholder:text-ink-secondary"
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setVisible((current) => !current)}
            aria-label={visible ? "Hide password" : "Show password"}
            className="shrink-0 text-ink-secondary hover:text-ink"
          >
            {visible ? <EyeOff size={24} /> : <Eye size={24} />}
          </button>
        )}
      </div>
      {error && (
        <p id={errorId} role="alert" className="px-5 text-body2 text-danger">
          {error}
        </p>
      )}
    </div>
  );
});
