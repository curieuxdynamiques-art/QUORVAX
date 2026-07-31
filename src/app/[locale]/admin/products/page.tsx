'use client';

import { useEffect, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import Image from 'next/image';
import { CATEGORY_LIST, formatPrice, type Product, type ProductCategory, type Locale } from '@/data/products';
import { useProductManager, slugify } from '@/store/product-manager';
import AdminShell from '@/components/AdminShell';

type EditingProduct = Partial<Product> & { id?: string };

const emptyProduct: EditingProduct = {
  category: 'mouse',
  name: { en: '', de: '', fr: '' },
  description: { en: '', de: '', fr: '' },
  price: 0,
  currency: 'EUR',
  image: '',
  wireless: false,
  inStock: true,
  ceCertified: true,
  specs: [],
};

export default function ProductManagerPage() {
  const t = useTranslations('ProductManager');
  const tc = useTranslations('Products.categories');
  const locale = useLocale() as Locale;
  const [mounted, setMounted] = useState(false);

  const store = useProductManager();
  const [editing, setEditing] = useState<EditingProduct | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState<'all' | ProductCategory>('all');

  useEffect(() => {
    setMounted(true);
  }, []);

  const filtered = store.products.filter((p) => {
    const matchSearch =
      !search ||
      p.name.en.toLowerCase().includes(search.toLowerCase()) ||
      p.name.de.toLowerCase().includes(search.toLowerCase()) ||
      p.name.fr.toLowerCase().includes(search.toLowerCase()) ||
      p.slug.toLowerCase().includes(search.toLowerCase());
    const matchCategory = filterCategory === 'all' || p.category === filterCategory;
    return matchSearch && matchCategory;
  });

  function handleAddNew() {
    setEditing({ ...emptyProduct });
    setShowForm(true);
  }

  function handleEdit(product: Product) {
    setEditing({ ...product });
    setShowForm(true);
  }

  function handleSave() {
    if (!editing) return;
    if (!editing.name?.en) return;

    const productData = {
      category: editing.category || 'mouse',
      name: editing.name || { en: '', de: '', fr: '' },
      description: editing.description || { en: '', de: '', fr: '' },
      price: editing.price || 0,
      currency: 'EUR' as const,
      image: editing.image || '',
      gallery: editing.gallery,
      wireless: editing.wireless || false,
      inStock: editing.inStock ?? true,
      ceCertified: editing.ceCertified ?? true,
      specs: editing.specs || [],
      slug: editing.slug || slugify(editing.name.en),
    };

    if (editing.id) {
      store.updateProduct(editing.id, productData);
    } else {
      store.addProduct(productData);
    }
    setEditing(null);
    setShowForm(false);
  }

  function handleDelete(id: string) {
    if (confirm(t('deleteConfirm'))) {
      store.deleteProduct(id);
    }
  }

  function handleCancel() {
    setEditing(null);
    setShowForm(false);
  }

  function addSpec() {
    if (!editing) return;
    setEditing({
      ...editing,
      specs: [
        ...(editing.specs || []),
        { label: { en: '', de: '', fr: '' }, value: { en: '', de: '', fr: '' } },
      ],
    });
  }

  function updateSpec(index: number, field: 'label' | 'value', lang: Locale, value: string) {
    if (!editing?.specs) return;
    const newSpecs = [...editing.specs];
    newSpecs[index] = {
      ...newSpecs[index],
      [field]: { ...newSpecs[index][field], [lang]: value },
    };
    setEditing({ ...editing, specs: newSpecs });
  }

  function removeSpec(index: number) {
    if (!editing?.specs) return;
    setEditing({
      ...editing,
      specs: editing.specs.filter((_, i) => i !== index),
    });
  }

  if (!mounted) {
    return <AdminShell><div className="p-8" /></AdminShell>;
  }

  return (
    <AdminShell>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{t('title')}</h1>
            <p className="mt-1 text-slate-600">{t('subtitle')}</p>
          </div>
          <button
            type="button"
            onClick={handleAddNew}
            className="rounded-md bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
          >
            + {t('addProduct')}
          </button>
        </div>

      {/* Form */}
      {showForm && editing && (
        <div className="mb-8 rounded-xl border border-slate-200 bg-white p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">
              {editing.id ? t('editProduct') : t('addProduct')}
            </h2>
            <button
              type="button"
              onClick={handleCancel}
              className="text-slate-400 hover:text-slate-600"
            >
              ✕
            </button>
          </div>

          <div className="space-y-5">
            {/* Category & Price */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <label className="block text-sm font-medium text-slate-700">{t('category')}</label>
                <select
                  value={editing.category}
                  onChange={(e) => setEditing({ ...editing, category: e.target.value as ProductCategory })}
                  className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                >
                  {CATEGORY_LIST.map((cat) => (
                    <option key={cat} value={cat}>{tc(cat)}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">{t('price')} (€)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={editing.price ?? 0}
                  onChange={(e) => setEditing({ ...editing, price: parseFloat(e.target.value) || 0 })}
                  className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">{t('slug')}</label>
                <input
                  type="text"
                  value={editing.slug || ''}
                  onChange={(e) => setEditing({ ...editing, slug: e.target.value })}
                  placeholder={editing.name?.en ? slugify(editing.name.en) : 'auto-generated'}
                  className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                />
              </div>
            </div>

            {/* Image URL */}
            <div>
              <label className="block text-sm font-medium text-slate-700">{t('imageUrl')}</label>
              <div className="mt-1 flex items-center gap-3">
                <input
                  type="url"
                  value={editing.image || ''}
                  onChange={(e) => setEditing({ ...editing, image: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="block w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                />
                {editing.image && (
                  <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-md border border-slate-200">
                    <Image src={editing.image} alt="preview" fill sizes="48px" className="object-cover" />
                  </div>
                )}
              </div>
            </div>

            {/* Multi-language names */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {(['en', 'de', 'fr'] as Locale[]).map((lang) => (
                <div key={lang}>
                  <label className="block text-sm font-medium text-slate-700">
                    {t('name')} ({lang.toUpperCase()})
                  </label>
                  <input
                    type="text"
                    value={editing.name?.[lang] || ''}
                    onChange={(e) =>
                      setEditing({
                        ...editing,
                        name: { ...editing.name, [lang]: e.target.value } as Record<Locale, string>,
                      })
                    }
                    className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                  />
                </div>
              ))}
            </div>

            {/* Multi-language descriptions */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {(['en', 'de', 'fr'] as Locale[]).map((lang) => (
                <div key={lang}>
                  <label className="block text-sm font-medium text-slate-700">
                    {t('description')} ({lang.toUpperCase()})
                  </label>
                  <textarea
                    rows={3}
                    value={editing.description?.[lang] || ''}
                    onChange={(e) =>
                      setEditing({
                        ...editing,
                        description: { ...editing.description, [lang]: e.target.value } as Record<Locale, string>,
                      })
                    }
                    className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                  />
                </div>
              ))}
            </div>

            {/* Toggles */}
            <div className="flex flex-wrap gap-6">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={editing.wireless || false}
                  onChange={(e) => setEditing({ ...editing, wireless: e.target.checked })}
                  className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                />
                <span className="text-sm font-medium text-slate-700">{t('wireless')}</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={editing.inStock ?? true}
                  onChange={(e) => setEditing({ ...editing, inStock: e.target.checked })}
                  className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                />
                <span className="text-sm font-medium text-slate-700">{t('inStock')}</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={editing.ceCertified ?? true}
                  onChange={(e) => setEditing({ ...editing, ceCertified: e.target.checked })}
                  className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                />
                <span className="text-sm font-medium text-slate-700">{t('ceCertified')}</span>
              </label>
            </div>

            {/* Specs Editor */}
            <div>
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-slate-700">{t('specs')}</label>
                <button
                  type="button"
                  onClick={addSpec}
                  className="text-sm font-semibold text-brand-600 hover:text-brand-700"
                >
                  + {t('addSpec')}
                </button>
              </div>
              <div className="mt-2 space-y-3">
                {(editing.specs || []).map((spec, i) => (
                  <div key={i} className="rounded-lg border border-slate-200 p-3">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-500">{t('spec')} #{i + 1}</span>
                      <button
                        type="button"
                        onClick={() => removeSpec(i)}
                        className="text-xs text-red-500 hover:text-red-700"
                      >
                        {t('remove')}
                      </button>
                    </div>
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                      {(['en', 'de', 'fr'] as Locale[]).map((lang) => (
                        <div key={`spec-${i}-${lang}`} className="space-y-1">
                          <input
                            type="text"
                            placeholder={`${t('specLabel')} (${lang.toUpperCase()})`}
                            value={spec.label[lang]}
                            onChange={(e) => updateSpec(i, 'label', lang, e.target.value)}
                            className="block w-full rounded-md border border-slate-200 px-2 py-1.5 text-xs focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                          />
                          <input
                            type="text"
                            placeholder={`${t('specValue')} (${lang.toUpperCase()})`}
                            value={spec.value[lang]}
                            onChange={(e) => updateSpec(i, 'value', lang, e.target.value)}
                            className="block w-full rounded-md border border-slate-200 px-2 py-1.5 text-xs focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex gap-3 border-t border-slate-200 pt-4">
              <button
                type="button"
                onClick={handleSave}
                disabled={!editing.name?.en}
                className="rounded-md bg-brand-600 px-6 py-2 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-50"
              >
                {t('save')}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="rounded-md border border-slate-300 px-6 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                {t('cancel')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          type="text"
          placeholder={t('searchPlaceholder')}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="block w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 sm:max-w-xs"
        />
        <div className="flex flex-wrap gap-2">
          {(['all', ...CATEGORY_LIST] as const).map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setFilterCategory(cat)}
              className={`rounded-md px-3 py-1.5 text-sm font-medium ${
                filterCategory === cat
                  ? 'bg-brand-600 text-white'
                  : 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
              }`}
            >
              {cat === 'all' ? t('allCategories') : tc(cat)}
            </button>
          ))}
        </div>
        <span className="ml-auto text-sm text-slate-500">
          {filtered.length} {t('productsCount')}
        </span>
      </div>

      {/* Product Table */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                <th className="px-4 py-3">{t('image')}</th>
                <th className="px-4 py-3">{t('name')}</th>
                <th className="px-4 py-3">{t('category')}</th>
                <th className="px-4 py-3">{t('price')}</th>
                <th className="px-4 py-3">{t('status')}</th>
                <th className="px-4 py-3 text-right">{t('actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <div className="relative h-12 w-12 overflow-hidden rounded-md bg-slate-100">
                      <Image src={p.image} alt={p.name[locale]} fill sizes="48px" className="object-cover" />
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-slate-900">{p.name[locale] || p.name.en}</p>
                    <p className="text-xs text-slate-400">{p.slug}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                      {tc(p.category)}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-semibold text-slate-900">{formatPrice(p.price, locale)}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {p.inStock && (
                        <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                          {t('inStock')}
                        </span>
                      )}
                      {!p.inStock && (
                        <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">
                          {t('outOfStock')}
                        </span>
                      )}
                      {p.wireless && (
                        <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">
                          {t('wireless')}
                        </span>
                      )}
                      {p.ceCertified && (
                        <span className="rounded-full bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-700">
                          CE
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => handleEdit(p)}
                        className="rounded-md border border-slate-300 px-3 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50"
                      >
                        {t('edit')}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(p.id)}
                        className="rounded-md border border-red-200 bg-red-50 px-3 py-1 text-xs font-medium text-red-700 hover:bg-red-100"
                      >
                        {t('delete')}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-slate-500">{t('noProducts')}</p>
          </div>
        )}
      </div>
    </div>
    </AdminShell>
  );
}
