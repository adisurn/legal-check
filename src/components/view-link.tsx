import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

export function ViewLink({
  view,
  children,
  className,
  onNavigate,
}: {
  view: string;
  children: ReactNode;
  className?: string;
  onNavigate?: () => void;
}) {
  return (
    <Link to="/" search={{ view }} className={className} onClick={onNavigate}>
      {children}
    </Link>
  );
}
