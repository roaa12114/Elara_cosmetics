import { forwardRef } from "react";
import type { ChangeEvent, ComponentProps } from "react";
import { TextField } from "./TextField";

type TokenInputProps = Omit<ComponentProps<typeof TextField>, "type" | "label"> & {
  label?: string;
};

export const TokenInput = forwardRef<HTMLInputElement, TokenInputProps>(function TokenInput(
  { label = "Confirmation token", onChange, ...props },
  ref,
) {
  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    event.target.value = event.target.value.replace(/\s+/g, "");
    onChange?.(event);
  }

  return (
    <TextField
      ref={ref}
      label={label}
      type="text"
      autoComplete="one-time-code"
      autoCapitalize="off"
      autoCorrect="off"
      spellCheck={false}
      onChange={handleChange}
      {...props}
    />
  );
});
