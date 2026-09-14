"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export interface DialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  className?: string;
}

/**
 * Built on the native <dialog> element: focus trapping, ESC-to-close, and
 * a top-layer backdrop all come from the browser for free, so this stays
 * a small client component instead of a hand-rolled focus-trap + portal.
 */
export function Dialog({ open, onClose, title, children, className }: DialogProps) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (open && !el.open) {
      el.showModal();
    } else if (!open && el.open) {
      el.close();
    }
  }, [open]);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => {
        if (e.target === ref.current) onClose();
      }}
      aria-labelledby="dialog-title"
      className={cn(
        // min(28rem, 100vw-2rem) keeps a >=16px gutter on every side even
        // on the narrowest phones, while capping at max-w-md on larger screens.
        "w-[min(28rem,calc(100vw-2rem))] rounded-sm border border-border bg-elevated p-6 text-foreground backdrop:bg-background/80",
        className,
      )}
    >
      <div className="mb-4 flex items-start justify-between gap-4">
        <h2 id="dialog-title" className="text-lg font-medium">
          {title}
        </h2>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="-m-1.5 p-1.5 text-foreground-muted transition-colors duration-base hover:text-foreground"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
      {children}
    </dialog>
  );
}
