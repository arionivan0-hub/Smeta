import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Plus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useStore } from '../store';

export default function Catalog() {
  const { t } = useTranslation();
  const { catalogItems, fetchCatalog, categories, fetchCategories } = useStore();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ code: '', description: '', unit: 'ud', category: '0', price: 0, source: 'custom' });

  useEffect(() => {
    fetchCatalog();
    fetchCategories();
  }, [fetchCatalog, fetchCategories]);

  useEffect(() => {
    fetchCatalog({ category: selectedCategory || undefined, search: search || undefined });
  }, [search, selectedCategory, fetchCatalog]);

  const handleAdd = async () => {
    if (!form.code || !form.description) {
      toast.error(t('catalog.code_desc_required'));
      return;
    }
    try {
      const { catalogApi } = await import('../services/api');
      await catalogApi.create(form);
      toast.success(t('catalog.item_added'));
      setShowAdd(false);
      setForm({ code: '', description: '', unit: 'ud', category: '0', price: 0, source: 'custom' });
      fetchCatalog();
    } catch {
      toast.error(t('catalog.error_add'));
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const { catalogApi } = await import('../services/api');
      await catalogApi.delete(id);
      toast.success(t('catalog.item_deleted'));
      fetchCatalog();
    } catch {
      toast.error(t('catalog.error_delete'));
    }
  };

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">{t('catalog.title')}</h1>
          <button
            onClick={() => setShowAdd(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
          >
            <Plus size={16} />
            {t('catalog.add')}
          </button>
        </div>

        <div className="flex gap-4 mb-6">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t('catalog.search')}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">{t('catalog.all_categories')}</option>
            {Object.entries(categories).map(([key, value]) => (
              <option key={key} value={key}>{key} - {value}</option>
            ))}
          </select>
        </div>

        {showAdd && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">{t('catalog.add')}</h3>
            <div className="grid grid-cols-6 gap-4">
              <input
                type="text"
                placeholder={t('catalog.code')}
                value={form.code}
                onChange={(e) => setForm({ ...form, code: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
              <input
                type="text"
                placeholder={t('catalog.description')}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="col-span-2 px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
              <input
                type="text"
                placeholder={t('catalog.unit')}
                value={form.unit}
                onChange={(e) => setForm({ ...form, unit: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
              >
                {Object.entries(categories).map(([key, value]) => (
                  <option key={key} value={key}>{key} - {value}</option>
                ))}
              </select>
              <input
                type="number"
                placeholder={t('catalog.price')}
                value={form.price || ''}
                onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) || 0 })}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </div>
            <div className="flex gap-2 mt-4">
              <button
                onClick={handleAdd}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
              >
                {t('common.add')}
              </button>
              <button
                onClick={() => setShowAdd(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-300"
              >
                {t('common.cancel')}
              </button>
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('catalog.code')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('catalog.description')}</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">{t('catalog.unit')}</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">{t('catalog.category')}</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">{t('catalog.price')}</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">{t('catalog.source')}</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">{t('catalog.actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {catalogItems.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-mono text-sm">{item.code}</td>
                  <td className="px-6 py-4 text-sm">{item.description}</td>
                  <td className="px-6 py-4 text-sm text-center">{item.unit}</td>
                  <td className="px-6 py-4 text-sm text-center">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                      {item.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-right font-medium">€{item.price.toFixed(2)}</td>
                  <td className="px-6 py-4 text-sm text-center text-gray-500">{item.source}</td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-red-400 hover:text-red-600"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {catalogItems.length === 0 && (
            <div className="p-12 text-center text-gray-500">{t('common.no_data')}</div>
          )}
        </div>
      </div>
    </div>
  );
}
