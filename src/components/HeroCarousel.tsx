'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import Image from 'next/image';

type Slide = {
  image: string;
  titleKey: 'slide1Title' | 'slide2Title' | 'slide3Title';
  descKey: 'slide1Desc' | 'slide2Desc' | 'slide3Desc';
  ctaKey: 'slide1Cta' | 'slide2Cta' | 'slide3Cta';
  href: '/products' | '/products' | '/products';
  align: 'left' | 'center' | 'right';
};

const slides: Slide[] = [
  { image: '/hero-1.jpg', titleKey: 'slide1Title', descKey: 'slide1Desc', ctaKey: 'slide1Cta', href: '/products', align: 'left' },
  { image: '/hero-2.jpg', titleKey: 'slide2Title', descKey: 'slide2Desc', ctaKey: 'slide2Cta', href: '/products', align: 'left' },
  { image: '/hero-3.jpg', titleKey: 'slide3Title', descKey: 'slide3Desc', ctaKey: 'slide3Cta', href: '/products', align: 'left' },
];

export default function HeroCarousel() {
  const t = useTranslations('Hero');
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => setCurrent((c) => (c + 1) % slides.length), []);
  const prev = useCallback(() => setCurrent((c) => (c - 1 + slides.length) % slides.length), []);

  useEffect(() => {
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [next]);

  return (
    <section className="relative h-[70vh] min-h-[500px] w-full overflow-hidden bg-slate-900">
      {/* Slides */}
      {slides.map((slide, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            i === current ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          <Image
            src={slide.image}
            alt=""
            fill
            priority={i === 0}
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />
        </div>
      ))}

      {/* Content */}
      <div className="relative z-10 flex h-full items-center">
        <div className="mx-auto w-full max-w-7xl px-6">
          <div className="max-w-xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-sm font-medium text-white backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-brand-400" />
              {t('badge')}
            </span>
            <h1 className="mt-5 text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
              {t(slides[current].titleKey)}
            </h1>
            <p className="mt-5 text-lg text-white/80 sm:text-xl">
              {t(slides[current].descKey)}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href={slides[current].href}
                className="rounded-lg bg-brand-600 px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-brand-600/30 transition-all hover:bg-brand-700 hover:shadow-xl"
              >
                {t(slides[current].ctaKey)}
              </Link>
              <Link
                href="/about"
                className="rounded-lg border border-white/30 bg-white/10 px-8 py-3.5 text-base font-semibold text-white backdrop-blur transition-colors hover:bg-white/20"
              >
                {t('secondaryCta')}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Arrows */}
      <button
        onClick={prev}
        aria-label="Previous"
        className="absolute left-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/15 p-2.5 text-white backdrop-blur transition-colors hover:bg-white/30"
      >
        <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
      </button>
      <button
        onClick={next}
        aria-label="Next"
        className="absolute right-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/15 p-2.5 text-white backdrop-blur transition-colors hover:bg-white/30"
      >
        <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
      </button>

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            aria-label={`Slide ${i + 1}`}
            className={`h-2.5 rounded-full transition-all ${
              i === current ? 'w-8 bg-brand-500' : 'w-2.5 bg-white/40 hover:bg-white/60'
            }`}
          />
        ))}
      </div>
    </section>
  );
}
