import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  interactive?: boolean;
};

export function Card({ children, className = "", interactive = false }: Props) {
  return (
    <div className={`glass-card ${interactive ? "glass-card-interactive" : ""} ${className}`}>
      {children}
    </div>
  );
}
