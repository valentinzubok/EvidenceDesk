import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "ghost" | "icon";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  children: ReactNode;
};

const variantClass: Record<Variant, string> = {
  primary: "btn-primary",
  ghost: "btn-ghost",
  icon: "btn-icon",
};

export function Button({ variant = "primary", className = "", children, ...rest }: Props) {
  return (
    <button type="button" className={`${variantClass[variant]} ${className}`} {...rest}>
      {children}
    </button>
  );
}
