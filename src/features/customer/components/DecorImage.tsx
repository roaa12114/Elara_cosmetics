import { useState } from "react";

type DecorImageProps = {
  src: string;
  className?: string;
};

export function DecorImage({ src, className }: DecorImageProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return null;
  }

  return (
    <img
      src={src}
      alt=""
      aria-hidden="true"
      className={className}
      onError={() => {
        if (import.meta.env.DEV) console.warn(`Image not found: ${src}`);
        setFailed(true);
      }}
    />
  );
}
