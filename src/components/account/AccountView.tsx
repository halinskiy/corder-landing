"use client";

import { useState } from "react";

import { MOCK_USER, formatBillingDate } from "@/lib/account-mock";
import type {
  NotificationPrefs,
  SubscriptionPlan,
  SubscriptionStatus,
  UserAccount,
} from "@/lib/account-types";

const DATA_SOURCE =
  "projects/corder-landing/src/components/account/AccountView.tsx";

/**
 * Logged-in /account surface. Phase 1: state is seeded from the mock
 * file; all writes are local-only (PATCH /me / DELETE /me will hook
 * in during Phase 3). Five sections rendered top to bottom.
 */
export function AccountView() {
  const [user, setUser] = useState<UserAccount>(MOCK_USER);

  return (
    <div className="account-sections" data-source={DATA_SOURCE}>
      <ProfileSection user={user} setUser={setUser} />
      <SubscriptionSection user={user} />
      <NotificationsSection user={user} setUser={setUser} />
      <ReferralSection user={user} />
      <DangerSection email={user.email} />
    </div>
  );
}

// ---------------------------------------------------------------------------
//  Profile
// ---------------------------------------------------------------------------

function ProfileSection({
  user,
  setUser,
}: {
  user: UserAccount;
  setUser: (u: UserAccount) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(user.name);

  function save() {
    setUser({ ...user, name: draft.trim() || user.name });
    setEditing(false);
  }
  function cancel() {
    setDraft(user.name);
    setEditing(false);
  }

  return (
    <section className="account-card" aria-labelledby="profile-heading">
      <h2 id="profile-heading" className="account-card__heading">
        Profile
      </h2>
      <dl className="account-defs">
        <div className="account-defs__row">
          <dt>Email</dt>
          <dd className="account-defs__value">{user.email}</dd>
        </div>
        <div className="account-defs__row">
          <dt>Name</dt>
          <dd className="account-defs__value account-defs__value--editable">
            {editing ? (
              <span className="account-name-edit">
                <input
                  type="text"
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  className="account-name-edit__input"
                  autoFocus
                  aria-label="Edit display name"
                />
                <button
                  type="button"
                  className="account-name-edit__save"
                  onClick={save}
                >
                  Save
                </button>
                <button
                  type="button"
                  className="account-name-edit__cancel"
                  onClick={cancel}
                >
                  Cancel
                </button>
              </span>
            ) : (
              <span className="account-name-display">
                <span>{user.name}</span>
                <button
                  type="button"
                  className="account-name-edit__edit"
                  onClick={() => setEditing(true)}
                  aria-label="Edit name"
                >
                  Edit
                </button>
              </span>
            )}
          </dd>
        </div>
        <div className="account-defs__row">
          <dt>Apple ID</dt>
          <dd className="account-defs__value account-defs__value--muted">
            {user.appleId ?? (
              <em>
                Not connected. Sign in with Apple from the Mac app to link
                your subscription across devices.
              </em>
            )}
          </dd>
        </div>
        <div className="account-defs__row">
          <dt>Member since</dt>
          <dd className="account-defs__value account-defs__value--muted">
            {formatBillingDate(user.createdAt)}
          </dd>
        </div>
      </dl>
    </section>
  );
}

// ---------------------------------------------------------------------------
//  Subscription
// ---------------------------------------------------------------------------

const PLAN_LABEL: Record<SubscriptionPlan, string> = {
  free: "Free",
  pro_monthly: "Pro Monthly",
  pro_annual: "Pro Annual",
};

const STATUS_LABEL: Record<SubscriptionStatus, string> = {
  active: "Active",
  trialing: "Trialing",
  past_due: "Past due",
  canceled: "Canceled",
  paused: "Paused",
};

function SubscriptionSection({ user }: { user: UserAccount }) {
  const sub = user.subscription;
  const planLabel = PLAN_LABEL[sub.plan];
  const statusLabel = STATUS_LABEL[sub.status];
  const nextBilling = formatBillingDate(sub.nextBillingAt);

  return (
    <section className="account-card" aria-labelledby="sub-heading">
      <h2 id="sub-heading" className="account-card__heading">
        Subscription
      </h2>
      <div className="account-sub-row">
        <span
          className={`account-plan-badge account-plan-badge--${sub.plan}`}
        >
          {planLabel}
        </span>
        <span className="account-sub-status" data-status={sub.status}>
          {statusLabel}
        </span>
      </div>
      {nextBilling ? (
        <p className="account-sub-line">
          Next billing on <strong>{nextBilling}</strong>.
        </p>
      ) : (
        <p className="account-sub-line">
          Free tier. Upgrade to Pro anytime from the pricing page.
        </p>
      )}
      <div className="account-sub-actions">
        {sub.managePortalUrl ? (
          <a
            href={sub.managePortalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="cta-pill cta-pill--ghost account-sub-manage"
          >
            Manage subscription
          </a>
        ) : (
          <a
            href="/#pricing"
            className="cta-pill cta-pill--primary account-sub-upgrade"
          >
            Upgrade to Pro
          </a>
        )}
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
//  Notifications
// ---------------------------------------------------------------------------

const NOTIFICATION_FIELDS: ReadonlyArray<{
  key: keyof NotificationPrefs;
  label: string;
  body: string;
}> = [
  {
    key: "productUpdates",
    label: "Product updates",
    body: "New versions, breaking changes, important announcements.",
  },
  {
    key: "tipsAndTricks",
    label: "Tips & tricks",
    body: "Monthly digest of workflows other Corder users came up with.",
  },
  {
    key: "newFeatures",
    label: "Early access to new features",
    body: "Heads-up when a beta is open. Opt-in, no spam.",
  },
];

function NotificationsSection({
  user,
  setUser,
}: {
  user: UserAccount;
  setUser: (u: UserAccount) => void;
}) {
  function toggle(key: keyof NotificationPrefs) {
    setUser({
      ...user,
      notifications: {
        ...user.notifications,
        [key]: !user.notifications[key],
      },
    });
  }
  return (
    <section className="account-card" aria-labelledby="notif-heading">
      <h2 id="notif-heading" className="account-card__heading">
        Notifications
      </h2>
      <ul className="account-toggle-list">
        {NOTIFICATION_FIELDS.map((field) => {
          const value = user.notifications[field.key];
          return (
            <li key={field.key} className="account-toggle-item">
              <div className="account-toggle-text">
                <div className="account-toggle-label">{field.label}</div>
                <p className="account-toggle-body">{field.body}</p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={value}
                aria-label={field.label}
                className={`account-toggle${value ? " account-toggle--on" : ""}`}
                onClick={() => toggle(field.key)}
              >
                <span className="account-toggle__thumb" />
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

// ---------------------------------------------------------------------------
//  Referrals
// ---------------------------------------------------------------------------

function ReferralSection({ user }: { user: UserAccount }) {
  const shareUrl = `https://getcorder.com/?ref=${user.referral.code}`;
  const [copied, setCopied] = useState(false);

  function copyLink() {
    if (typeof navigator === "undefined" || !navigator.clipboard) return;
    navigator.clipboard
      .writeText(shareUrl)
      .then(() => {
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1800);
      })
      .catch(() => {
        setCopied(false);
      });
  }

  return (
    <section className="account-card" aria-labelledby="ref-heading">
      <h2 id="ref-heading" className="account-card__heading">
        Refer a friend
      </h2>
      <p className="account-ref-explain">
        Share your link. Whoever signs up through it and stays Pro for at
        least one month gets a free month -- and so do you.
      </p>
      <div className="account-ref-row">
        <code className="account-ref-link" aria-label="Your referral link">
          {shareUrl}
        </code>
        <button
          type="button"
          className="cta-pill cta-pill--ghost account-ref-copy"
          onClick={copyLink}
          aria-live="polite"
        >
          {copied ? "Copied" : "Copy link"}
        </button>
      </div>
      <dl className="account-ref-stats">
        <div className="account-ref-stat">
          <dt>Qualified referrals</dt>
          <dd>{user.referral.qualifiedCount}</dd>
        </div>
        <div className="account-ref-stat">
          <dt>Free months earned</dt>
          <dd>{user.referral.freeMonthsEarned}</dd>
        </div>
      </dl>
    </section>
  );
}

// ---------------------------------------------------------------------------
//  Danger zone
// ---------------------------------------------------------------------------

function DangerSection({ email }: { email: string }) {
  const [confirming, setConfirming] = useState(false);
  const [typed, setTyped] = useState("");
  const armed = typed === "DELETE";

  function reset() {
    setTyped("");
    setConfirming(false);
  }

  function confirmDelete() {
    if (!armed) return;
    // Phase 1 mock: would call DELETE /me + show a goodbye screen.
    // Phase 3 wires this to the Worker which kicks off the 30-day
    // grace deletion + cancels the Paddle subscription.
    alert(
      `Account ${email} marked for deletion.\n\n(Phase 1 mock — no real deletion happens yet.)`,
    );
    reset();
  }

  return (
    <section
      className="account-card account-danger"
      aria-labelledby="danger-heading"
    >
      <h2 id="danger-heading" className="account-card__heading">
        Delete account
      </h2>
      <p className="account-danger__body">
        Permanently delete your account and cancel any active subscription.
        We keep your data for 30 days in case you change your mind, then
        delete it completely.
      </p>
      {!confirming ? (
        <button
          type="button"
          className="account-danger__trigger"
          onClick={() => setConfirming(true)}
        >
          Delete account…
        </button>
      ) : (
        <div className="account-danger__confirm">
          <p>
            Type <code>DELETE</code> below to confirm. This cannot be undone
            after the 30-day grace window.
          </p>
          <input
            type="text"
            className="account-danger__input"
            value={typed}
            onChange={(e) => setTyped(e.target.value)}
            placeholder="DELETE"
            aria-label="Type DELETE to confirm"
            autoFocus
          />
          <div className="account-danger__buttons">
            <button
              type="button"
              className="cta-pill cta-pill--ghost"
              onClick={reset}
            >
              Cancel
            </button>
            <button
              type="button"
              className="account-danger__final"
              onClick={confirmDelete}
              disabled={!armed}
              aria-disabled={!armed}
            >
              Delete account
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
