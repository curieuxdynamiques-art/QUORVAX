import Link from 'next/link';

// 全局 404 兜底：当 URL 不包含有效 locale 时由根 layout 渲染
// 本地化 404 见 src/app/[locale]/not-found.tsx
export default function GlobalNotFound() {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-24 text-center">
      <p className="text-7xl font-extrabold text-brand-600">404</p>
      <h1 className="mt-4 text-3xl font-bold text-slate-900">Page Not Found</h1>
      <p className="mt-3 text-slate-600">
        The page you are looking for does not exist.
      </p>
      <Link
        href="/en"
        className="mt-8 inline-block rounded-lg bg-brand-600 px-6 py-3 text-sm font-semibold text-white hover:bg-brand-700"
      >
        Back to Home
      </Link>
    </div>
  );
}
