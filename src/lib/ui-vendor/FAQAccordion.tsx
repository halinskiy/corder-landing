"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useState, type ReactNode } from "react";

import { cn } from "./cn";
import { EASE_OUT } from "./motion";

/* -------------------------------------------------------------------------- */
/*  Types                                                                      */
/* -------------------------------------------------------------------------- */

export type FAQItemData = {
  question: string;
  answer: ReactNode;
};

export type FAQAccordionProps = {
  items: FAQItemData[];
  /**
   * Behaviour: 'single' keeps at most one panel open at a time, 'multi'
   * lets every panel be toggled independently. Default 'multi' —
   * matches the behaviour we promoted from booquarium where the reader
   * can pin multiple answers open while comparing.
   */
  mode?: "single" | "multi";
  /** Optional class on the wrapper. */
  className?: string;
  dataSource?: string;
  /**
   * Fires each time an item flips state. `isOpen` is the NEW state after
   * the toggle. Used by Corder Faq.tsx to send a `faq_open` analytics
   * event when an item expands (ad-test instrumentation).
   */
  onItemToggle?: (index: number, isOpen: boolean) => void;
};

const DATA_SOURCE_DEFAULT = "ui-kit/components/section/FAQAccordion.tsx";

/* -------------------------------------------------------------------------- */
/*  FAQAccordion                                                               */
/* -------------------------------------------------------------------------- */

/**
 * Headless FAQ accordion — accepts an items array, renders question/answer
 * pairs with a top/bottom hairline and a rotating +/− glyph.
 *
 * Default behaviour: `multi` (every item toggles independently). Pass
 * `mode="single"` for radio-style single-open behaviour.
 *
 * Respects `prefers-reduced-motion` — skips the expand animation and
 * shows/hides panels synchronously when reduced motion is requested.
 */
export function FAQAccordion({
  items,
  mode = "multi",
  className,
  dataSource,
  onItemToggle,
}: FAQAccordionProps) {
  const [openIndices, setOpenIndices] = useState<number[]>([]);

  const toggle = (idx: number) => {
    setOpenIndices((prev) => {
      const wasOpen = prev.includes(idx);
      const nextOpen = !wasOpen;
      // Notify consumer with the new state. Fires on every toggle, both
      // open and close; the consumer decides which transitions matter.
      onItemToggle?.(idx, nextOpen);
      if (mode === "single") {
        return wasOpen ? [] : [idx];
      }
      return wasOpen ? prev.filter((i) => i !== idx) : [...prev, idx];
    });
  };

  return (
    <div
      data-component="FAQAccordion"
      data-source={dataSource ?? DATA_SOURCE_DEFAULT}
      data-tokens="color-border,color-text,color-text-muted,font-serif,ease-out"
      className={cn("flex w-full flex-col", className)}
    >
      {items.map((item, i) => (
        <FAQItem
          key={i}
          question={item.question}
          answer={item.answer}
          isLast={i === items.length - 1}
          open={openIndices.includes(i)}
          onToggle={() => toggle(i)}
          dataSource={dataSource}
        />
      ))}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  FAQItem — used internally; exported for consumers that need fine control. */
/* -------------------------------------------------------------------------- */

export function FAQItem({
  question,
  answer,
  isLast,
  open,
  onToggle,
  dataSource,
}: {
  question: string;
  answer: ReactNode;
  isLast: boolean;
  open: boolean;
  onToggle: () => void;
  dataSource?: string;
}) {
  const prefersReduced = useReducedMotion();

  return (
    <div
      data-component="FAQItem"
      data-source={dataSource ?? DATA_SOURCE_DEFAULT}
      data-tokens="color-border,color-text,color-text-muted,font-serif,ease-out"
      className={cn(
        "border-t border-[var(--color-border)]",
        isLast && "border-b",
      )}
    >
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-6 py-5 text-left transition-opacity duration-150 hover:opacity-70 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)]"
        aria-expanded={open}
      >
        <span
          className="font-serif font-medium text-[var(--color-text)]"
          style={{
            fontSize: "clamp(17px, 1.4vw, 20px)",
            lineHeight: 1.3,
          }}
        >
          {question}
        </span>
        <span
          aria-hidden
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[var(--color-border)] transition-transform duration-300 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)]"
          style={{ transform: open ? "rotate(45deg)" : "rotate(0deg)" }}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path
              d="M6 2v8M2 6h8"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={prefersReduced ? false : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={prefersReduced ? undefined : { height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: EASE_OUT }}
            style={{ overflow: "hidden" }}
          >
            <div
              className="pb-5 pr-8 text-[16px] leading-[1.65] text-[var(--color-text-muted)]"
              style={{ maxWidth: "640px" }}
            >
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
