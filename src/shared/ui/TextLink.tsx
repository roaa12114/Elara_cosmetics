import { Link } from "react-router-dom";
import type { ComponentProps } from "react";
import { cx } from "../lib/cx";

export function TextLink({ className, ...props }: ComponentProps<typeof Link>) {
  return (
    <Link
      className={cx(
        "text-body1 font-bold text-brand hover:underline",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
        className,
      )}
      {...props}
    />
  );
}
