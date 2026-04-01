'use client';

import { useEffect, useState, type FormEvent } from 'react';
import { createPortal } from 'react-dom';
import { directoryReviewsStoreUrl, postJson, type HttpError } from '@/api/publicApi';

function StarButton({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={`rounded p-0.5 transition ${active ? 'text-amber-400' : 'text-slate-300 hover:text-amber-300'}`}
    >
      <svg className="h-8 w-8 fill-current" viewBox="0 0 20 20" aria-hidden>
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    </button>
  );
}

/**
 * Modal to submit a public review for a hospital (by hospital URL slug).
 */
export default function HospitalReviewModal({
  slug,
  isOpen,
  onClose,
  onSubmitted,
}: {
  slug: string;
  isOpen: boolean;
  onClose: () => void;
  onSubmitted?: () => void;
}) {
  const [rating, setRating] = useState(5);
  const [authorName, setAuthorName] = useState('');
  const [authorEmail, setAuthorEmail] = useState('');
  const [body, setBody] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[] | string>>({});

  useEffect(() => {
    if (!isOpen) return;
    setError(null);
    setFieldErrors({});
    setSubmitting(false);
  }, [isOpen, slug]);

  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  function fieldErr(field: string) {
    const v = fieldErrors[field];
    if (!v) return null;
    return Array.isArray(v) ? v[0] : v;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setFieldErrors({});
    setSubmitting(true);
    try {
      await postJson(directoryReviewsStoreUrl('hospitals', slug), {
        rating,
        author_name: authorName.trim(),
        author_email: authorEmail.trim() || null,
        body: body.trim() || null,
      });
      setAuthorName('');
      setAuthorEmail('');
      setBody('');
      setRating(5);
      onSubmitted?.();
      onClose();
    } catch (err: unknown) {
      const e = err as HttpError;
      if (e.status === 422 && e.errors) {
        setFieldErrors(e.errors);
      } else {
        setError(e.message || 'Could not submit review');
      }
    } finally {
      setSubmitting(false);
    }
  }

  if (!isOpen) return null;

  const modal = (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center p-4 sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="hospital-review-modal-title"
    >
      <button type="button" className="absolute inset-0 bg-black/50" aria-label="Close" onClick={onClose} />
      <div className="relative z-10 max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
        <div className="flex items-start justify-between gap-4">
          <h2 id="hospital-review-modal-title" className="font-display text-lg font-bold text-slate-900">
            Write a review
          </h2>
          <button
            type="button"
            className="rounded-lg p-1 text-slate-500 hover:bg-slate-100 hover:text-slate-800"
            onClick={onClose}
            aria-label="Close"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <p className="font-ui mt-1 text-sm text-slate-600">Share your experience. Reviews may be moderated.</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {error ? <p className="font-ui rounded-md bg-red-50 px-3 py-2 text-sm text-red-800">{error}</p> : null}

          <div>
            <p className="font-ui text-sm font-medium text-slate-700">Rating</p>
            <div className="mt-2 flex gap-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <StarButton
                  key={n}
                  active={rating >= n}
                  label={`${n} star${n > 1 ? 's' : ''}`}
                  onClick={() => setRating(n)}
                />
              ))}
            </div>
            <p className="font-ui mt-1 text-xs text-slate-500">{rating} out of 5</p>
            {fieldErr('rating') ? <p className="font-ui mt-1 text-xs text-red-600">{fieldErr('rating')}</p> : null}
          </div>

          <div>
            <label htmlFor="rev-name-hospital" className="font-ui text-sm font-medium text-slate-700">
              Your name
            </label>
            <input
              id="rev-name-hospital"
              type="text"
              required
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              autoComplete="name"
              className="font-ui mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-[#0d9488] focus:outline-none focus:ring-2 focus:ring-[#0d9488]/20"
            />
            {fieldErr('author_name') ? (
              <p className="font-ui mt-1 text-xs text-red-600">{fieldErr('author_name')}</p>
            ) : null}
          </div>

          <div>
            <label htmlFor="rev-email-hospital" className="font-ui text-sm font-medium text-slate-700">
              Email <span className="font-normal text-slate-400">(optional)</span>
            </label>
            <input
              id="rev-email-hospital"
              type="email"
              value={authorEmail}
              onChange={(e) => setAuthorEmail(e.target.value)}
              autoComplete="email"
              className="font-ui mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-[#0d9488] focus:outline-none focus:ring-2 focus:ring-[#0d9488]/20"
            />
            {fieldErr('author_email') ? (
              <p className="font-ui mt-1 text-xs text-red-600">{fieldErr('author_email')}</p>
            ) : null}
          </div>

          <div>
            <label htmlFor="rev-body-hospital" className="font-ui text-sm font-medium text-slate-700">
              Your review <span className="font-normal text-slate-400">(optional)</span>
            </label>
            <textarea
              id="rev-body-hospital"
              rows={4}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="What went well? What could be better?"
              className="font-ui mt-1 w-full resize-y rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-[#0d9488] focus:outline-none focus:ring-2 focus:ring-[#0d9488]/20"
            />
            {fieldErr('body') ? <p className="font-ui mt-1 text-xs text-red-600">{fieldErr('body')}</p> : null}
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="font-ui flex-1 rounded-lg border border-slate-200 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="font-ui flex-1 rounded-lg bg-[#0d9488] py-2.5 text-sm font-semibold text-white hover:bg-[#0f766e] disabled:opacity-60"
            >
              {submitting ? 'Submitting…' : 'Submit review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  if (typeof document === 'undefined') return null;
  return createPortal(modal, document.body);
}
