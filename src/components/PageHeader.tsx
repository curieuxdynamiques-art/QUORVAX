export default function PageHeader({
  title,
  subtitle
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <header className="border-b border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
        <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-3 text-slate-600">{subtitle}</p>
        )}
      </div>
    </header>
  );
}
