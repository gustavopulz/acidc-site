import type { ReactNode } from "react";

export default function Section({
  id,
  title,
  subtitle,
  children,
}: {
  id?: string;
  title?: string;
  subtitle?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="relative py-8 sm:py-10">
      <div className="absolute inset-0 -z-10 opacity-40" aria-hidden>
        <div className="h-full w-full bg-grid bg-[size:32px_32px]"></div>
      </div>
      <div className="mx-auto max-w-6xl px-4">
        {title && (
          <div className="mb-6">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-400 via-ember to-white">
                {title}
              </span>
            </h2>
            {subtitle && (
              <p className="text-white/70 mt-2 max-w-3xl">{subtitle}</p>
            )}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}
