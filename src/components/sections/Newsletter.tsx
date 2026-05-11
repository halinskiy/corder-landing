"use client";

import { useState } from "react";

import { copy } from "@/content/copy";

const DATA_SOURCE = "projects/corder-landing/src/components/sections/Newsletter.tsx";

export function Newsletter() {
  const { newsletter } = copy;
  const [status, setStatus] = useState<"idle" | "submitted">("idle");
  const [email, setEmail] = useState("");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!email.trim()) return;
    setStatus("submitted");
  }

  return (
    <section
      id="newsletter"
      data-component="Newsletter"
      data-source={DATA_SOURCE}
      data-tokens="color-bg,color-border,color-text,color-text-muted,color-accent,radius-pill,font-serif,font-sans"
      className="newsletter"
    >
      <div className="page-container">
        <div className="newsletter__inner">
          <h2 className="newsletter__heading">{newsletter.heading}</h2>
          <p className="newsletter__subhead">{newsletter.subhead}</p>

          {status === "idle" ? (
            <form className="newsletter__form" onSubmit={handleSubmit} noValidate>
              <input
                type="email"
                required
                placeholder={newsletter.placeholder}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="newsletter__input"
                aria-label="Email address"
              />
              <button type="submit" className="newsletter__submit">
                {newsletter.cta}
              </button>
            </form>
          ) : (
            <p className="newsletter__status" role="status" aria-live="polite">
              {newsletter.successMessage}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
