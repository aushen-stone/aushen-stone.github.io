"use client";

import { usePathname } from "next/navigation";

export function PageOffset({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return <div className={isHome ? "" : "pt-[var(--nav-h-expanded)]"}>{children}</div>;
}
