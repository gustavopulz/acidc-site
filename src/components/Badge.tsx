import type { ReactNode } from "react";
import { cn } from "../lib/cn";

export default function Badge({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-xs text-white/80 ring-1 ring-white/15",
        className
      )}
    >
      {children}
    </span>
  );
}
