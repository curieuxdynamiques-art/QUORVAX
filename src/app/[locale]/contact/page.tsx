'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import PageHeader from '@/components/PageHeader';

export default function ContactPage() {
  const t = useTranslations('Contact');
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // TODO: 后续接入后端 API（如 /api/contact 或 Resend / SendGrid）
    // 目前仅做前端演示
    setSubmitted(true);
    setForm({ name: '', email: '', subject: '', message: '' });
  }

  return (
    <div>
      <PageHeader title={t('title')} />

      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
          {/* Contact info */}
          <aside className="space-y-6">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
                {t('emailLabel')}
              </h3>
              <p className="mt-1 font-medium text-slate-900">support@voltkey.eu</p>
            </div>
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
                {t('phoneLabel')}
              </h3>
              <p className="mt-1 font-medium text-slate-900">+49 (0)30 1234 5678</p>
            </div>
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
                {t('addressLabel')}
              </h3>
              <p className="mt-1 font-medium text-slate-900">
                Friedrichstraße 68<br />
                10117 Berlin, Germany
              </p>
            </div>
            <div className="rounded-lg bg-slate-50 p-4 text-sm text-slate-600">
              🕒 Mon–Fri: 9:00–18:00 (CET)
              <br />
              Sat: 10:00–14:00
            </div>
          </aside>

          {/* Form */}
          <div className="lg:col-span-2">
            {submitted ? (
              <div className="rounded-xl border border-green-200 bg-green-50 p-8 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </div>
                <p className="mt-4 font-semibold text-slate-900">{t('success')}</p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="mt-4 text-sm font-medium text-brand-600 hover:text-brand-700"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="space-y-5 rounded-xl border border-slate-200 bg-white p-6"
              >
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-slate-700">
                      {t('name')}
                    </label>
                    <input
                      id="name"
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                      {t('email')}
                    </label>
                    <input
                      id="email"
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-slate-700">
                    {t('subject')}
                  </label>
                  <input
                    id="subject"
                    type="text"
                    required
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-slate-700">
                    {t('message')}
                  </label>
                  <textarea
                    id="message"
                    required
                    rows={6}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full rounded-md bg-brand-600 px-6 py-3 text-sm font-semibold text-white hover:bg-brand-700 sm:w-auto"
                >
                  {t('send')}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
