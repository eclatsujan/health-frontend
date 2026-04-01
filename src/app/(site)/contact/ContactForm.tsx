'use client';

import PageShell from '@/components/site/PageShell';
import type { FormEvent } from 'react';

export default function ContactForm() {
  function onSubmit(e: FormEvent) {
    e.preventDefault();
  }

  return (
    <PageShell
      eyebrow="Contact"
      title="Get in touch"
      subtitle="Questions about listings or partnerships — we’ll connect this form to your backend when you’re ready."
    >
      <form className="mx-auto max-w-md space-y-4" onSubmit={onSubmit}>
        <div>
          <label htmlFor="name" className="font-body text-sm font-medium text-on-surface">
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            className="font-body mt-1.5 w-full rounded-lg border border-outline-variant/30 bg-surface-container-lowest px-3 py-2.5 text-sm text-on-surface shadow-sm focus:border-primary-container focus:outline-none focus:ring-2 focus:ring-primary-container/20"
            placeholder="Your name"
          />
        </div>
        <div>
          <label htmlFor="email" className="font-body text-sm font-medium text-on-surface">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            className="font-body mt-1.5 w-full rounded-lg border border-outline-variant/30 bg-surface-container-lowest px-3 py-2.5 text-sm text-on-surface shadow-sm focus:border-primary-container focus:outline-none focus:ring-2 focus:ring-primary-container/20"
            placeholder="you@example.com"
          />
        </div>
        <div>
          <label htmlFor="msg" className="font-body text-sm font-medium text-on-surface">
            Message
          </label>
          <textarea
            id="msg"
            name="message"
            rows={5}
            className="font-body mt-1.5 w-full resize-y rounded-lg border border-outline-variant/30 bg-surface-container-lowest px-3 py-2.5 text-sm text-on-surface shadow-sm focus:border-primary-container focus:outline-none focus:ring-2 focus:ring-primary-container/20"
            placeholder="How can we help?"
          />
        </div>
        <button
          type="submit"
          className="font-body w-full rounded-lg bg-primary-container py-2.5 text-sm font-semibold text-on-primary shadow-sm transition hover:brightness-95"
        >
          Send message
        </button>
      </form>
    </PageShell>
  );
}
