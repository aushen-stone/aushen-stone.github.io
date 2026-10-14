"use client";

import React, { useEffect, useRef } from "react";
import { X } from "lucide-react";

type QuoteDialogProps = {
  open: boolean;
  /** Called after the dialog closes (close button, Escape or backdrop click). */
  onClose: () => void;
  eyebrow: string;
  title: string;
  titleId: string;
  children: React.ReactNode;
};

export function QuoteDialog({ open, onClose, eyebrow, title, titleId, children }: QuoteDialogProps) {
  const dialogRef = useRef<HTMLDialogElement | null>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog || !open) return;

    if (!dialog.open) dialog.showModal();
    dialog.querySelector<HTMLInputElement>("input:not([tabindex='-1'])")?.focus();
  }, [open]);

  const close = () => {
    dialogRef.current?.close();
  };

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      onClose={onClose}
      onClick={(event) => {
        // Clicks on the backdrop target the dialog element itself.
        if (event.target === event.currentTarget) close();
      }}
      className="m-auto max-h-[calc(100dvh-2rem)] w-[min(calc(100%-2rem),36rem)] overflow-y-auto bg-[#F8F5F1] p-0 text-[#1a1c18] shadow-2xl backdrop:bg-[#1a1c18]/60"
    >
      {open && (
        <div className="p-5 sm:p-7">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500">{eyebrow}</p>
              <h2
                id={titleId}
                className="mt-2 font-serif text-[1.55rem] leading-tight sm:text-[1.85rem]"
              >
                {title}
              </h2>
            </div>
            <button
              type="button"
              onClick={close}
              className="-mr-1 shrink-0 p-1 text-gray-500 transition-colors hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a1c18]"
              aria-label="Close quote request"
            >
              <X size={20} strokeWidth={1.5} />
            </button>
          </div>

          {children}
        </div>
      )}
    </dialog>
  );
}
