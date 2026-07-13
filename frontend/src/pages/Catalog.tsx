import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Plus, Trash2, Pencil, X, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import { useStore } from '../store';
import type { CatalogItem } from '../types';

export default function Catalog() {
  const { t } = useTranslation();
  const { catalogItems, fetchCatalog, categories, fetchCategories } = useStore();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<CatalogItem | null>(null);
  const [form, setForm] = useState({ code: '', description: '', unit: 'ud', category: '0', price: 0, source: 'custom' });

  useEffect(() => {
    fetchCatalog();
    fetchCategories();
  }, [fetchCatalog, fetchCategories]);

  useEffect(() => {
    fetchCatalog({ category: selectedCategory || undefined, search: search || undefined });
  }, [search, selectedCategory, fetchCatalog]);

  const openAddModal = () => {
    setEditingItem(null);
    setForm({ code: '', description: '', unit: 'ud', category: '0', price: 0, source: 'custom' });
    setShowModal(true);
  };

  const openEditModal = (item: CatalogItem) => {
    setEditingItem(item);
    setForm({
      code: item.code,
      description: item.description,
      unit: item.unit,
      category: item.category,
      price: item.price,
      source: item.source,
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.code || !form.description) {
      toast.error(t('catalog.code_desc_required'));
      return;
    }
    try {
      const { catalogApi } = await import('../services/api');
      if (editingItem) {
        await catalogApi.update(editingItem.id, form);
        toast.success(t('catalog.item_updated'));
      } else {
        await catalogApi.create(form);
        toast.success(t('catalog.item_added'));
      }
      setShowModal(false);
      fetchCatalog();
    } catch {
      toast.error(editingItem ? t('catalog.error_update') : t('catalog.error_add'));
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm(t('catalog.confirm_delete'))) return;
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
    <div className="p-6 lg:p-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{t('catalog.title')}</h1>
          <p className="text-sm text-slate-500 mt-1">{catalogItems.length} {t('catalog.items_count')}</p>
        </div>
        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-500 text-white rounded-xl text-sm font-medium hover:bg-blue-600 shadow-lg shadow-blue-500/25 transition-all"
        >
          <Plus size={16} />
          {t('catalog.add')}
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('catalog.search')}
            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
          />
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
        >
          <option value="">{t('catalog.all_categories')}</option>
          {Object.entries(categories).map(([key, value]) => (
            <option key={key} value={key}>{key} - {value}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50/80 border-b border-slate-200/60">
            <tr>
              <th className="px-5 py-3 text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wider">{t('catalog.code')}</th>
              <th className="px-5 py-3 text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wider">{t('catalog.description')}</th>
              <th className="px-5 py-3 text-center text-[11px] font-semibold text-slate-400 uppercase tracking-wider">{t('catalog.unit')}</th>
              <th className="px-5 py-3 text-center text-[11px] font-semibold text-slate-400 uppercase tracking-wider">{t('catalog.category')}</th>
              <th className="px-5 py-3 text-right text-[11px] font-semibold text-slate-400 uppercase tracking-wider">{t('catalog.price')}</th>
              <th className="px-5 py-3 text-right text-[11px] font-semibold text-slate-400 uppercase tracking-wider">{t('estimates.actions')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {catalogItems.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="px-5 py-3 font-mono text-xs text-slate-500">{item.code}</td>
                <td className="px-5 py-3 text-sm text-slate-800">{item.description}</td>
                <td className="px-5 py-3 text-sm text-slate-500 text-center">{item.unit}</td>
                <td className="px-5 py-3 text-center">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-slate-100 text-slate-600">
                    {categories[item.category] || item.category}
                  </span>
                </td>
                <td className="px-5 py-3 text-sm font-semibold text-slate-900 text-right tabular-nums">€{item.price.toFixed(2)}</td>
                <td className="px-5 py-3 text-right">
                  <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => openEditModal(item)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-blue-500 hover:bg-blue-50 transition-all"
                      title={t('common.edit')}
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all"
                      title={t('common.delete')}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {catalogItems.length === 0 && (
          <div className="p-12 text-center">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-3">
              <Search className="text-slate-300" size={20} />
            </div>
            <p className="text-sm text-slate-400">{t('common.no_data')}</p>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-lg border border-slate-200/60">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-semibold text-slate-900">
                {editingItem ? t('catalog.edit_item') : t('catalog.add_item')}
              </h3>
              <button onClick={() => setShowModal(false)} className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">{t('catalog.code')} *</label>
                  <input
                    type="text"
                    value={form.code}
                    onChange={(e) => setForm({ ...form, code: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
                    placeholder="MO-030"
                    disabled={!!editingItem}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">{t('catalog.unit')}</label>
                  <select
                    value={form.unit}
                    onChange={(e) => setForm({ ...form, unit: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
                  >
                    <option value="ud">ud (unidad)</option>
                    <option value="m2">m2 (metro cuadrado)</option>
                    <option value="ml">ml (metro lineal)</option>
                    <option value="m3">m3 (metro cubico)</option>
                    <option value="kg">kg (kilogramo)</option>
                    <option value="hora">hora</option>
                    <option value="dia">dia</option>
                    <option value="%">%</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">{t('catalog.description')} *</label>
                <input
                  type="text"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
                  placeholder={t('catalog.description_placeholder')}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">{t('catalog.category')}</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
                  >
                    {Object.entries(categories).map(([key, value]) => (
                      <option key={key} value={key}>{value}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">{t('catalog.price')} (EUR)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={form.price || ''}
                    onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
                    placeholder="0.00"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              <button
                onClick={handleSave}
                disabled={!form.code || !form.description}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-500 text-white rounded-xl text-sm font-medium hover:bg-blue-600 shadow-lg shadow-blue-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Check size={16} />
                {editingItem ? t('common.save') : t('common.add')}
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2.5 bg-slate-100 text-slate-600 rounded-xl text-sm font-medium hover:bg-slate-200 transition-colors"
              >
                {t('common.cancel')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
