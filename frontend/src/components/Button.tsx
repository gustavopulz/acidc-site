import type { ButtonHTMLAttributes } from "react";
import { cn } from "../lib/cn";

export default function Button({
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost";
}) {
  const base =
    "inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-accent-500";
  const variant =
    props.variant === "ghost"
      ? "bg-transparent text-white/90 hover:bg-white/10"
      : "bg-accent-600 text-white hover:bg-accent-500 shadow-glow";
  return <button className={cn(base, variant, className)} {...props} />;
}
