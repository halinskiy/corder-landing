"use client";

import { useState, type FormEvent } from "react";

import { trackEvent } from "@/lib/track";

const DATA_SOURCE = "projects/corder-landing/src/components/contact/ContactForm.tsx";

type ContactCopy = {
  emailLabel: string;
  subjectLabel: string;
  messageLabel: string;
  subjectPlaceholder: string;
  messagePlaceholder: string;
  submitCta: string;
  submitNote: string;
  mailTo: string;
  subjectPrefix?: string;
};

/**
 * ContactForm -- pure-client form that builds a mailto: URL on submit.
 *
 * No backend hop. The button opens the user's default mail client
 * with Subject and Body pre-filled so they only have to hit Send.
 * Honest UX: makes the "submit" verb mean "open your mail app"
 * instead of pretending a fake POST went through.
 *
 * Tracking event still fires on submit so funnel analytics see the
 * contact-intent click even though we don't see the actual message.
 */
export function ContactForm({ copy }: { copy: ContactCopy }) {
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedSubject = subject.trim();
    const fullSubject = copy.subjectPrefix
      ? trimmedSubject
        ? `${copy.subjectPrefix}: ${trimmedSubject}`
        : copy.subjectPrefix
      : trimmedSubject || "Corder, hello";
    const body = [
      message.trim(),
      "",
      email.trim() ? `Reply to: ${email.trim()}` : "",
    ]
      .filter(Boolean)
      .join("\n");
    const href =
      `mailto:${copy.mailTo}` +
      `?subject=${encodeURIComponent(fullSubject)}` +
      `&body=${encodeURIComponent(body)}`;
    trackEvent("contact_submit_click", {
      hasEmail: !!email.trim(),
      hasSubject: !!subject.trim(),
      messageLength: message.trim().length,
      prefix: copy.subjectPrefix ?? "",
    });
    window.location.href = href;
  }

  return (
    <form
      onSubmit={handleSubmit}
      data-component="ContactForm"
      data-source={DATA_SOURCE}
      data-tokens="color-bg,color-text,color-border,color-accent,radius-button,font-sans"
      className="contact-form"
      noValidate
      aria-label="Contact Corder"
    >
      <label className="contact-form__field">
        <span className="contact-form__label">{copy.emailLabel}</span>
        <input
          type="email"
          inputMode="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="contact-form__input"
        />
      </label>

      <label className="contact-form__field">
        <span className="contact-form__label">{copy.subjectLabel}</span>
        <input
          type="text"
          required
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder={copy.subjectPlaceholder}
          className="contact-form__input"
        />
      </label>

      <label className="contact-form__field">
        <span className="contact-form__label">{copy.messageLabel}</span>
        <textarea
          required
          rows={6}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={copy.messagePlaceholder}
          className="contact-form__textarea"
        />
      </label>

      <button
        type="submit"
        data-track-event="contact_submit"
        className="cta-pill cta-pill--primary inline-flex h-12 w-full items-center justify-center rounded-[var(--radius-pill)] px-6 text-[16px] font-medium"
      >
        {copy.submitCta}
      </button>

      <p className="contact-form__submit-note">{copy.submitNote}</p>
    </form>
  );
}
