import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Trash2, FileText } from 'lucide-react';
import toast from 'react-hot-toast';
import { useStore } from '../store';

export default function Estimates() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { estimates, fetchEstimates, createEstimate, deleteEstimate } = useStore();
  const [showNew, setShowNew] = useState(false);
  const [form, setForm] = useState({ name: '', project_name: '', client_name: '', location: '' });

  useEffect(() => {
    fetchEstimates();
  }, [fetchEstimates]);

  const handleCreate = async () => {
    if (!form.name.trim()) {
      toast.error(t('estimates.name_required'));
      return;
    }
    try {
      const estimate = await createEstimate(form);
      toast.success(t('estimates.created_success'));
      setShowNew(false);
      setForm({ name: '', project_name: '', client_name: '', location: '' });
      navigate(`/estimates/${estimate.id}`);
    } catch {
      toast.error(t('estimates.error_create'));
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm(t('estimates.confirm_delete'))) {
      try {
        await deleteEstimate(id);
        toast.success(t('estimates.deleted'));
      } catch {
        toast.error(t('estimates.error_delete'));
      }
    }
  };

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{t('estimates.title')}</h1>
        <button
          onClick={() => setShowNew(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-500 text-white rounded-xl text-sm font-medium hover:bg-blue-600 shadow-lg shadow-blue-500/25 transition-all hover:shadow-xl hover:shadow-blue-500/30"
        >
          <Plus size={16} />
          {t('estimates.new')}
        </button>
      </div>

      {showNew && (
        <div className="bg-white rounded-2xl shadow-sm shadow-slate-200/50 border border-slate-200/60 p-6 mb-6">
          <h3 className="text-base font-semibold text-slate-900 mb-4">{t('estimates.new')}</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">{t('estimates.name')} *</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
                placeholder={t('estimates.project_name')}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">{t('estimates.project')}</label>
              <input
                type="text"
                value={form.project_name}
                onChange={(e) => setForm({ ...form, project_name: e.target.value })}
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
                placeholder={t('estimates.project_name')}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">{t('estimates.client')}</label>
              <input
                type="text"
                value={form.client_name}
                onChange={(e) => setForm({ ...form, client_name: e.target.value })}
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
                placeholder={t('estimates.client_name')}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">{t('estimates.location')}</label>
              <input
                type="text"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
                placeholder={t('estimates.location_name')}
              />
            </div>
          </div>
          <div className="flex gap-2 mt-5">
            <button
              onClick={handleCreate}
              className="px-5 py-2.5 bg-blue-500 text-white rounded-xl text-sm font-medium hover:bg-blue-600 shadow-lg shadow-blue-500/25 transition-all"
            >
              {t('common.create')}
            </button>
            <button
              onClick={() => setShowNew(false)}
              className="px-5 py-2.5 bg-slate-100 text-slate-600 rounded-xl text-sm font-medium hover:bg-slate-200 transition-colors"
            >
              {t('common.cancel')}
            </button>
          </div>
        </div>
      )}

      {estimates.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm shadow-slate-200/50 border border-slate-200/60 p-12 text-center">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
            <FileText className="text-slate-300" size={22} />
          </div>
          <p className="text-sm text-slate-400">{t('estimates.no_estimates')}</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm shadow-slate-200/50 border border-slate-200/60 overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-50/80 border-b border-slate-200/60">
              <tr>
                <th className="px-6 py-3 text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wider">{t('estimates.name')}</th>
                <th className="px-6 py-3 text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wider">{t('estimates.project')}</th>
                <th className="px-6 py-3 text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wider">{t('estimates.client')}</th>
                <th className="px-6 py-3 text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wider">{t('estimates.status')}</th>
                <th className="px-6 py-3 text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wider">{t('estimates.created')}</th>
                <th className="px-6 py-3 text-right text-[11px] font-semibold text-slate-400 uppercase tracking-wider">{t('estimates.actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {estimates.map((estimate) => (
                <tr key={estimate.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-3.5">
                    <Link to={`/estimates/${estimate.id}`} className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline">
                      {estimate.name}
                    </Link>
                  </td>
                  <td className="px-6 py-3.5 text-sm text-slate-500">{estimate.project_name}</td>
                  <td className="px-6 py-3.5 text-sm text-slate-500">{estimate.client_name}</td>
                  <td className="px-6 py-3.5">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                      estimate.status === 'active'
                        ? 'bg-emerald-50 text-emerald-600'
                        : estimate.status === 'draft'
                        ? 'bg-amber-50 text-amber-600'
                        : 'bg-slate-100 text-slate-500'
                    }`}>
                      {estimate.status}
                    </span>
                  </td>
                  <td className="px-6 py-3.5 text-sm text-slate-400 tabular-nums">
                    {new Date(estimate.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-3.5 text-right">
                    <button
                      onClick={() => handleDelete(estimate.id)}
                      className="text-slate-300 hover:text-red-500 p-1.5 rounded-lg hover:bg-red-50 transition-all"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
