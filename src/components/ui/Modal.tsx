"use client";

import type { ReactNode } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  className?: string;
};

export function Modal({ open, onClose, title, children, className = "" }: Props) {
  if (!open) return null;
  return (
    <div
      className="overlay-backdrop fixed inset-0 z-[70] flex items-center justify-center p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal
      onClick={onClose}
    >
      <div
        className={`glass-card max-w-lg w-full animate-fade-up ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        {title ? (
          <div className="mb-4 flex items-start justify-between gap-3">
            <h2 className="text-lg font-semibold text-white">{title}</h2>
            <button type="button" onClick={onClose} className="btn-icon !border-0" aria-label="Close">
              ✕
            </button>
          </div>
        ) : null}
        {children}
      </div>
    </div>
  );
}
