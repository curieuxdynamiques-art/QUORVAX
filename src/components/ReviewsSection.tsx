'use client';

import { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';

type Review = {
  id: string;
  rating: number;
  text: string;
  author: string;
  date: string;
  messageFrom?: string;
};

const MOCK_REVIEWS: Review[] = [
  {
    id: 'r1',
    rating: 5,
    text: 'Received in good condition.',
    author: 'John Manson',
    date: '13 July 2026'
  },
  {
    id: 'r2',
    rating: 5,
    text: 'Arrived promptly as expected. Really well packaged with clear instructions.',
    author: 'Fiona D',
    date: '30 June 2026'
  },
  {
    id: 'r3',
    rating: 3,
    text: 'Returned item – been 1 month still not received refund.',
    author: 'Amazon Customer',
    date: '29 June 2026',
    messageFrom: 'Amazon takes responsibility for this fulfillment-related experience.'
  },
  {
    id: 'r4',
    rating: 2,
    text: "I didn't receive these items. Please advise",
    author: 'Sarah Wells',
    date: '28 June 2026',
    messageFrom: 'Amazon takes responsibility for this fulfillment-related experience.'
  },
  {
    id: 'r5',
    rating: 5,
    text: 'Great service. Very happy customer.',
    author: 'Amazon Customer',
    date: '22 June 2026'
  },
  {
    id: 'r6',
    rating: 5,
    text: 'Excellent quality and fast delivery. Will order again.',
    author: 'Mark T.',
    date: '15 June 2026'
  },
  {
    id: 'r7',
    rating: 4,
    text: 'Good value for money. Packaging could be better.',
    author: 'Lisa K.',
    date: '10 June 2026'
  }
];

const TIME_PERIODS = ['1 month', '3 months', '6 months', '12 months', 'All'] as const;
const INITIAL_VISIBLE = 2;

function StarRow({ count, total, label }: { count: number; total: number; label: string }) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div className="flex items-center gap-2">
      <span className="w-7 text-xs text-slate-600">{label}</span>
      <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-slate-200">
        <div
          className="h-full rounded-full bg-amber-400"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="w-8 text-right text-xs text-slate-500">{pct}%</span>
    </div>
  );
}

function StarDisplay({ rating, size = 'sm' }: { rating: number; size?: 'sm' | 'md' | 'lg' }) {
  const cls = size === 'lg' ? 'text-lg' : size === 'sm' ? 'text-sm' : 'text-base';
  return (
    <span className={`${cls} text-amber-400 tracking-tight`}>
      {'★'.repeat(rating)}
      <span className="text-slate-300">{'★'.repeat(5 - rating)}</span>
    </span>
  );
}

function FeedbackModal({
  open,
  onClose,
  onSubmit,
  t
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: { rating: number; name: string; text: string }) => void;
  t: ReturnType<typeof useTranslations<'Reviews'>>;
}) {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [name, setName] = useState('');
  const [text, setText] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!open) return null;

  const effectiveRating = hoverRating || rating;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !text.trim()) return;
    onSubmit({ rating, name: name.trim(), text: text.trim() });
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setRating(5);
      setName('');
      setText('');
      onClose();
    }, 1500);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div
        className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900">{t('leaveFeedback')}</h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {submitted ? (
          <div className="mt-6 py-8 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600">
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="font-semibold text-slate-900">{t('submitSuccess')}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            {/* Star rating */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">{t('yourRating')}</label>
              <div
                className="flex gap-1"
                onMouseLeave={() => setHoverRating(0)}
              >
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    className="text-3xl transition-colors"
                  >
                    <span className={star <= effectiveRating ? 'text-amber-400' : 'text-slate-300'}>
                      ★
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Name */}
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">{t('yourName')}</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
                placeholder={t('namePlaceholder')}
              />
            </div>

            {/* Review text */}
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">{t('yourReview')}</label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                required
                rows={4}
                className="w-full resize-none rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
                placeholder={t('reviewPlaceholder')}
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                {t('cancel')}
              </button>
              <button
                type="submit"
                className="flex-1 rounded-md bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
              >
                {t('submit')}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default function ReviewsSection() {
  const t = useTranslations('Reviews');
  const [starFilter, setStarFilter] = useState<string>('all');
  const [period, setPeriod] = useState<string>('12 months');
  const [expanded, setExpanded] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const total = MOCK_REVIEWS.length;
  const avgRating = useMemo(() => {
    const sum = MOCK_REVIEWS.reduce((s, r) => s + r.rating, 0);
    return total > 0 ? (sum / total).toFixed(1) : '0.0';
  }, [total]);

  const breakdown = useMemo(() => {
    const counts: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    MOCK_REVIEWS.forEach((r) => {
      counts[r.rating] = (counts[r.rating] || 0) + 1;
    });
    return counts;
  }, []);

  const filtered = useMemo(() => {
    if (starFilter === 'all') return MOCK_REVIEWS;
    const minStars = parseInt(starFilter, 10);
    return MOCK_REVIEWS.filter((r) => r.rating >= minStars);
  }, [starFilter]);

  const visibleCount = expanded ? filtered.length : Math.min(INITIAL_VISIBLE, filtered.length);
  const visible = filtered.slice(0, visibleCount);
  const hasMore = filtered.length > INITIAL_VISIBLE;

  const filterOptions = [
    { value: 'all', label: t('allStars') },
    { value: '5', label: `5 ${t('stars')}` },
    { value: '4', label: `4 ${t('stars')} & up` },
    { value: '3', label: `3 ${t('stars')} & up` },
    { value: '2', label: `2 ${t('stars')} & up` },
    { value: '1', label: `1 ${t('star')} & up` }
  ];

  return (
    <section className="border-t border-slate-100 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <h2 className="text-2xl font-bold text-slate-900">{t('title')}</h2>

        <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-[340px_1fr]">
          {/* Left: Summary */}
          <div>
            <div className="flex items-center gap-3">
              <StarDisplay rating={parseFloat(avgRating) >= 4.5 ? 5 : 4} size="lg" />
              <div>
                <div className="text-lg font-bold text-slate-900">
                  {avgRating} {t('outOf')} 5
                </div>
              </div>
              <div className="ml-auto flex items-center gap-2">
                <select
                  value={period}
                  onChange={(e) => setPeriod(e.target.value)}
                  className="rounded-md border border-slate-300 bg-white px-2 py-1 text-xs text-slate-700 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
                >
                  {TIME_PERIODS.map((p) => (
                    <option key={p} value={p}>
                      {p === 'All' ? t('allTime') : `${p}`}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <p className="mt-1 text-xs text-slate-500">
              {total} {t('ratings')}
            </p>

            {/* Star breakdown */}
            <div className="mt-4 space-y-1.5">
              {[5, 4, 3, 2, 1].map((star) => (
                <StarRow
                  key={star}
                  count={breakdown[star]}
                  total={total}
                  label={`${star} ${t('star')}`}
                />
              ))}
            </div>

            {/* Learn more */}
            <button
              type="button"
              className="mt-4 flex items-center gap-1 text-xs font-medium text-brand-600 hover:text-brand-700"
            >
              {t('learnMore')}
              <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Leave feedback */}
            <div className="mt-5 border-t border-slate-200 pt-4">
              <h3 className="text-sm font-semibold text-slate-900">{t('shareTitle')}</h3>
              <button
                type="button"
                onClick={() => setModalOpen(true)}
                className="mt-2 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
              >
                {t('leaveFeedback')}
              </button>
            </div>
          </div>

          {/* Right: Reviews list */}
          <div>
            {/* Filter bar */}
            <div className="mb-4 flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3">
              <span className="text-xs font-semibold text-slate-700">{t('filterBy')}</span>
              <select
                value={starFilter}
                onChange={(e) => {
                  setStarFilter(e.target.value);
                  setExpanded(false);
                }}
                className="rounded-md border border-slate-300 bg-white px-2 py-1 text-xs text-slate-700 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
              >
                {filterOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <p className="mb-4 text-xs text-slate-500">
              {filtered.length} {t('totalRatingsInfo', { total: filtered.length, period })}
            </p>

            {/* Visible reviews */}
            <div className="space-y-5">
              {visible.map((review) => (
                <article
                  key={review.id}
                  className="border-b border-slate-100 pb-4 last:border-b-0"
                >
                  <StarDisplay rating={review.rating} size="sm" />
                  <p className="mt-1.5 text-sm text-slate-800">
                    "{review.text}"
                  </p>
                  <p className="mt-0.5 text-xs text-slate-500">
                    {t('byLine', { author: review.author, date: review.date })}
                  </p>
                  {review.messageFrom && (
                    <p className="mt-1.5 text-xs text-slate-600">
                      <span className="font-semibold text-slate-700">{t('messageFrom')}:</span>{' '}
                      {review.messageFrom}
                    </p>
                  )}
                </article>
              ))}
            </div>

            {/* Show more / less */}
            {hasMore && (
              <div className="mt-4">
                <button
                  type="button"
                  onClick={() => setExpanded(!expanded)}
                  className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  {expanded ? t('showLess') : t('showMore', { count: filtered.length - INITIAL_VISIBLE })}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Feedback Modal */}
      <FeedbackModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={() => {}}
        t={t}
      />
    </section>
  );
}
