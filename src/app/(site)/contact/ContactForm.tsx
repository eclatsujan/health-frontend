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
          <label htmlFor="name" className="font-ui text-sm font-medium text-slate-700">
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            className="font-ui mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm focus:border-[#0d9488] focus:outline-none focus:ring-2 focus:ring-[#0d9488]/20"
            placeholder="Your name"
          />
        </div>
        <div>
          <label htmlFor="email" className="font-ui text-sm font-medium text-slate-700">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            className="font-ui mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm focus:border-[#0d9488] focus:outline-none focus:ring-2 focus:ring-[#0d9488]/20"
            placeholder="you@example.com"
          />
        </div>
        <div>
          <label htmlFor="msg" className="font-ui text-sm font-medium text-slate-700">
            Message
          </label>
          <textarea
            id="msg"
            name="message"
            rows={5}
            className="font-ui mt-1.5 w-full resize-y rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm focus:border-[#0d9488] focus:outline-none focus:ring-2 focus:ring-[#0d9488]/20"
            placeholder="How can we help?"
          />
        </div>
        <button
          type="submit"
          className="font-ui w-full rounded-lg bg-[#0d9488] py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0f766e]"
        >
          Send message
        </button>
      </form>
    </PageShell>
  );
}
