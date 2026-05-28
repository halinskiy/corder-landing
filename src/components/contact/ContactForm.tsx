"use client";

import { useState, type FormEvent } from "react";

import { trackEvent } from "@/lib/track";

const DATA_SOURCE = "projects/corder-landing/src/components/contact/ContactForm.tsx";

const ENDPOINT = process.env.NEXT_PUBLIC_CONTACT_ENDPOINT;

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

type Status = "idle" | "submitting" | "sent" | "error";

/**
 * ContactForm -- POSTs to a Cloudflare Worker (Resend) when the
 * NEXT_PUBLIC_CONTACT_ENDPOINT env var is set; the maker receives the
 * message in their inbox without the user ever opening a mail client.
 *
 * If the env var is missing (local dev, no backend yet) the form
 * gracefully falls back to a mailto: trigger so the page still has a
 * usable contact channel.
 */
export function ContactForm({ copy }: { copy: ContactCopy }) {
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorText, setErrorText] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!email.trim() || !message.trim()) {
      setStatus("error");
      setErrorText("Please add your email and a message.");
      return;
    }

    const trimmedSubject = subject.trim();
    const fullSubject = copy.subjectPrefix
      ? trimmedSubject
        ? `${copy.subjectPrefix}: ${trimmedSubject}`
        : copy.subjectPrefix
      : trimmedSubject || "Corder, hello";

    trackEvent("contact_submit_click", {
      hasEmail: !!email.trim(),
      hasSubject: !!trimmedSubject,
      messageLength: message.trim().length,
      prefix: copy.subjectPrefix ?? "",
    });

    // No backend endpoint configured -- fall back to mailto so the
    // page still gives the user somewhere to go.
    if (!ENDPOINT) {
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
      window.location.href = href;
      return;
    }

    setStatus("submitting");
    setErrorText(null);

    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          subject: fullSubject,
          message: message.trim(),
          source: copy.subjectPrefix ?? "contact",
        }),
      });
      if (res.ok) {
        setStatus("sent");
        return;
      }
      const data = (await res.json().catch(() => ({}))) as {
        error?: string;
      };
      setStatus("error");
      setErrorText(
        data.error === "invalid_email"
          ? "That email address doesn't look right."
          : "Something went wrong sending the message. Try again in a moment."
      );
    } catch {
      setStatus("error");
      setErrorText(
        "Couldn't reach the server. Check your connection and try again."
      );
    }
  }

  if (status === "sent") {
    return (
      <div
        data-component="ContactFormSuccess"
        data-source={DATA_SOURCE}
        className="contact-form__success"
        role="status"
        aria-live="polite"
      >
        Thanks. The maker will reply to{" "}
        <strong>{email.trim()}</strong> shortly.
      </div>
    );
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
          disabled={status === "submitting"}
          className="contact-form__input"
        />
      </label>

      <label className="contact-form__field">
        <span className="contact-form__label">{copy.subjectLabel}</span>
        <input
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder={copy.subjectPlaceholder}
          disabled={status === "submitting"}
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
          disabled={status === "submitting"}
          className="contact-form__textarea"
        />
      </label>

      <button
        type="submit"
        disabled={status === "submitting"}
        data-track-event="contact_submit"
        className="cta-pill cta-pill--primary inline-flex h-12 w-full items-center justify-center rounded-[var(--radius-pill)] px-6 text-[16px] font-medium disabled:cursor-progress disabled:opacity-70"
      >
        {status === "submitting" ? "Sending..." : ENDPOINT ? "Send message" : copy.submitCta}
      </button>

      {errorText && (
        <p className="contact-form__error" role="alert">
          {errorText}
        </p>
      )}

      {!ENDPOINT && (
        <p className="contact-form__submit-note">{copy.submitNote}</p>
      )}
    </form>
  );
}
