"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { copy } from "@/content/copy";

const DATA_SOURCE =
  "projects/corder-landing/src/components/case/CaseContactModal.tsx";

const LEAD_ENDPOINT = "https://corder-api.empqwork.workers.dev/case-lead";

/**
 * CaseContactModal -- the "Get this for your product" contact card.
 *
 * The shell is a 1:1 port of the Corder app's update modal: dimmed
 * overlay with `perspective`, a white card that TILTS after the cursor
 * (rotateX/rotateY via CSS variables, rAF-coalesced writes, max 11deg,
 * radial sheen following the pointer, snap-back transition on leave)
 * and the same enter/exit keyframes. Content: a 2-field lead form
 * (email + message → the corder-api Worker → Resend) plus direct
 * social buttons.
 */
type ModalState = "idle" | "sending" | "sent" | "error";

export function CaseContactModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const t = copy.caseStudy.modal;
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [leaving, setLeaving] = useState(false);
  const [state, setState] = useState<ModalState>("idle");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  // Animated close: play the card/overlay exit keyframes, THEN unmount.
  const close = useCallback(() => {
    setLeaving(true);
    window.setTimeout(() => {
      setLeaving(false);
      onClose();
    }, 200);
  }, [onClose]);

  // Esc closes; body scroll locks while open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, close]);

  // Cursor tilt -- ported 1:1 from the Corder update modal (rect caching,
  // rAF coalescing, 11deg max, sheen coordinates, snap-back class).
  useEffect(() => {
    if (!open) return;
    const overlay = overlayRef.current;
    const card = cardRef.current;
    if (!overlay || !card) return;
    let oRect = overlay.getBoundingClientRect();
    let cRect = card.getBoundingClientRect();
    const remeasure = () => {
      oRect = overlay.getBoundingClientRect();
      cRect = card.getBoundingClientRect();
    };
    let raf = 0;
    let px = 0;
    let py = 0;
    const max = 11;
    const apply = () => {
      raf = 0;
      const nx = ((px - oRect.left) / oRect.width) * 2 - 1;
      const ny = ((py - oRect.top) / oRect.height) * 2 - 1;
      card.style.setProperty("--tilt-x", `${(-ny * max).toFixed(2)}deg`);
      card.style.setProperty("--tilt-y", `${(nx * max).toFixed(2)}deg`);
      const sx = ((px - cRect.left) / cRect.width) * 100;
      const sy = ((py - cRect.top) / cRect.height) * 100;
      card.style.setProperty("--tilt-shine-x", `${sx.toFixed(1)}%`);
      card.style.setProperty("--tilt-shine-y", `${sy.toFixed(1)}%`);
    };
    const onMove = (e: MouseEvent) => {
      px = e.clientX;
      py = e.clientY;
      card.classList.remove("tilt-snap-back");
      if (!raf) raf = requestAnimationFrame(apply);
    };
    const reset = () => {
      if (raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
      card.classList.add("tilt-snap-back");
      card.style.setProperty("--tilt-x", "0deg");
      card.style.setProperty("--tilt-y", "0deg");
      card.style.setProperty("--tilt-shine-x", "50%");
      card.style.setProperty("--tilt-shine-y", "50%");
    };
    overlay.addEventListener("mousemove", onMove);
    overlay.addEventListener("mouseleave", reset);
    window.addEventListener("resize", remeasure);
    return () => {
      overlay.removeEventListener("mousemove", onMove);
      overlay.removeEventListener("mouseleave", reset);
      window.removeEventListener("resize", remeasure);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [open]);

  const submit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (state === "sending") return;
      setState("sending");
      try {
        const r = await fetch(LEAD_ENDPOINT, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ email, message }),
        });
        setState(r.ok ? "sent" : "error");
      } catch {
        setState("error");
      }
    },
    [email, message, state],
  );

  if (!open) return null;

  return (
    <div
      ref={overlayRef}
      className={`case-modal-overlay${leaving ? " is-leaving" : ""}`}
      onMouseDown={(e) => {
        if (e.target === overlayRef.current) close();
      }}
      data-component="CaseContactModal"
      data-source={DATA_SOURCE}
      role="dialog"
      aria-modal="true"
      aria-label={t.heading}
    >
      <div ref={cardRef} className={`case-modal-card${leaving ? " is-leaving" : ""}`}>
        <span className="case-modal-sheen" aria-hidden />
        <button
          type="button"
          className="case-modal-x"
          aria-label="Close"
          onClick={close}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </button>

        {state === "sent" ? (
          <div className="case-modal-body">
            <h3 className="case-modal-heading">{t.sentTitle}</h3>
            <p className="case-modal-sub">{t.sentBody}</p>
          </div>
        ) : (
          <form className="case-modal-body" onSubmit={submit}>
            <h3 className="case-modal-heading">{t.heading}</h3>
            <p className="case-modal-sub">{t.sub}</p>
            <input
              type="email"
              required
              className="case-modal-input"
              placeholder={t.emailPlaceholder}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoFocus
            />
            <textarea
              required
              minLength={4}
              rows={4}
              className="case-modal-input case-modal-textarea"
              placeholder={t.messagePlaceholder}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            {state === "error" && (
              <p className="case-modal-error">{t.errorBody}</p>
            )}
            <button
              type="submit"
              className="cta-pill cta-pill--primary inline-flex h-12 w-full items-center justify-center rounded-[var(--radius-pill)] text-[15px] font-medium"
              disabled={state === "sending"}
              data-track-event="case_lead_submit"
            >
              {state === "sending" ? t.sendingLabel : t.submitLabel}
            </button>
          </form>
        )}

        <div className="case-modal-socials">
          <p className="case-modal-socials__label">{t.socialsLabel}</p>
          <div className="case-modal-socials__grid">
            {t.socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="me noopener noreferrer"
                className="case-modal-social"
                data-track-event="case_social_click"
              >
                <SocialIcon name={s.icon} />
                <span className="case-modal-social__text">
                  <span className="case-modal-social__label">{s.label}</span>
                  {"meta" in s && s.meta && (
                    <span className="case-modal-social__meta">{s.meta}</span>
                  )}
                </span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* lucide icon paths (same set as the rest of the site). */
function SocialIcon({ name }: { name: string }) {
  const common = {
    width: 18,
    height: 18,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };
  switch (name) {
    case "send":
      return (
        <svg {...common}>
          <path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z" />
          <path d="m21.854 2.147-10.94 10.939" />
        </svg>
      );
    case "chat":
      return (
        <svg {...common}>
          <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
        </svg>
      );
    case "linkedin":
      return (
        <svg {...common}>
          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
          <rect width="4" height="12" x="2" y="9" />
          <circle cx="4" cy="4" r="2" />
        </svg>
      );
    case "instagram":
      return (
        <svg {...common}>
          <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
          <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
        </svg>
      );
    case "x":
      return (
        <svg {...common}>
          <path d="M4 4l16 16" />
          <path d="M20 4L4 20" />
        </svg>
      );
    default:
      return null;
  }
}
