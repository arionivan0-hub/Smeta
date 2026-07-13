import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { FileText, Package, Zap, ArrowRight } from 'lucide-react';
import { useStore } from '../store';

const QUICK_START_ICONS = [
  { key: 'Casa Unifamiliar', icon: '\u{1F3E0}', color: 'from-blue-500 to-blue-600', bg: 'bg-blue-50', border: 'border-blue-100', hover: 'hover:border-blue-300 hover:shadow-blue-500/10' },
  { key: 'Reforma Integral', icon: '\u{1F527}', color: 'from-emerald-500 to-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100', hover: 'hover:border-emerald-300 hover:shadow-emerald-500/10' },
  { key: 'Local Comercial', icon: '\u{1F3EA}', color: 'from-violet-500 to-violet-600', bg: 'bg-violet-50', border: 'border-violet-100', hover: 'hover:border-violet-300 hover:shadow-violet-500/10' },
  { key: '__empty__', icon: '\u{1F4DD}', color: 'from-slate-400 to-slate-500', bg: 'bg-slate-50', border: 'border-slate-200', hover: 'hover:border-slate-300 hover:shadow-slate-500/10' },
];

export default function Dashboard() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { estimates, loadingStates, fetchEstimates, createEstimate, templates, fetchTemplates, applyTemplate } = useStore();
  const [creating, setCreating] = useState(false);
  const [customName, setCustomName] = useState('');
  const [clientName, setClientName] = useState('');
  const [projectName, setProjectName] = useState('');

  useEffect(() => {
    fetchEstimates();
    fetchTemplates();
  }, [fetchEstimates, fetchTemplates]);

  const handleQuickStart = async (templateName: string) => {
    if (templateName === '__empty__') {
      const name = customName.trim() || t('dashboard.new_estimate');
      const est = await createEstimate({
        name,
        project_name: projectName.trim(),
        client_name: clientName.trim(),
      });
      navigate(`/estimates/${est.id}`);
      return;
    }
    setCreating(true);
    try {
      const template = templates.find(t => t.name === templateName);
      if (template) {
        const name = customName.trim() || templateName;
        const result = await applyTemplate(template.id, name, clientName.trim(), projectName.trim());
        navigate(`/estimates/${result}`);
      }
    } catch {
      setCreating(false);
    }
  };

  const getTemplateName = (key: string) => {
    if (key === '__empty__') return t('dashboard.presupuesto_vacio');
    return key;
  };

  const getTemplateDesc = (key: string) => {
    const descs: Record<string, string> = {
      'Casa Unifamiliar': 'Vivienda nueva con acabados completos',
      'Reforma Integral': 'Remodelación completa de vivienda',
      'Local Comercial': 'Acondicionamiento de local',
      '__empty__': 'Empezar desde cero',
    };
    return descs[key] || key;
  };

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{t('dashboard.welcome')}</h1>
        <p className="text-sm text-slate-500 mt-1">{t('dashboard.description')}</p>
      </div>

      {/* Quick Start */}
      <div className="bg-white rounded-2xl shadow-sm shadow-slate-200/50 border border-slate-200/60 p-6 mb-6">
        <div className="flex items-center gap-2 mb-5">
          <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
            <Zap size={16} className="text-amber-500" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-slate-900">{t('dashboard.quick_start')}</h2>
            <p className="text-xs text-slate-400">{t('dashboard.quick_start_desc')}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
          {QUICK_START_ICONS.map((qs) => (
            <button key={qs.key}
              onClick={() => handleQuickStart(qs.key)}
              disabled={creating}
              className={`group relative flex flex-col items-center gap-3 p-5 rounded-xl border ${qs.border} ${qs.bg} ${qs.hover} transition-all duration-200 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed`}>
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${qs.color} flex items-center justify-center text-xl shadow-lg group-hover:scale-105 transition-transform`}>
                {qs.icon}
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-slate-800">{getTemplateName(qs.key)}</p>
                <p className="text-[11px] text-slate-400 mt-0.5">{getTemplateDesc(qs.key)}</p>
              </div>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <input type="text" value={customName}
            onChange={(e) => setCustomName(e.target.value)}
            placeholder={t('dashboard.empty_name')}
            className="px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all" />
          <input type="text" value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            placeholder={t('dashboard.client_name')}
            className="px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all" />
          <input type="text" value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            placeholder={t('dashboard.project_name')}
            className="px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all" />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <Link to="/estimates" className="bg-white rounded-2xl shadow-sm shadow-slate-200/50 border border-slate-200/60 p-5 hover:shadow-md hover:border-slate-300 transition-all group">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                <FileText className="text-blue-500" size={18} />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{estimates.length}</p>
                <p className="text-xs text-slate-400 font-medium">{t('dashboard.total_estimates')}</p>
              </div>
            </div>
            <ArrowRight size={16} className="text-slate-300 group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all" />
          </div>
        </Link>

        <Link to="/catalog" className="bg-white rounded-2xl shadow-sm shadow-slate-200/50 border border-slate-200/60 p-5 hover:shadow-md hover:border-slate-300 transition-all group">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center group-hover:bg-emerald-100 transition-colors">
                <Package className="text-emerald-500" size={18} />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">228</p>
                <p className="text-xs text-slate-400 font-medium">{t('nav.catalog')}</p>
              </div>
            </div>
            <ArrowRight size={16} className="text-slate-300 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all" />
          </div>
        </Link>

        <Link to="/templates" className="bg-white rounded-2xl shadow-sm shadow-slate-200/50 border border-slate-200/60 p-5 hover:shadow-md hover:border-slate-300 transition-all group">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center group-hover:bg-violet-100 transition-colors">
                <Package className="text-violet-500" size={18} />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{templates.length}</p>
                <p className="text-xs text-slate-400 font-medium">{t('nav.templates')}</p>
              </div>
            </div>
            <ArrowRight size={16} className="text-slate-300 group-hover:text-violet-400 group-hover:translate-x-0.5 transition-all" />
          </div>
        </Link>
      </div>

      {/* Recent Estimates */}
      <div className="bg-white rounded-2xl shadow-sm shadow-slate-200/50 border border-slate-200/60 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-900">{t('dashboard.recent')}</h2>
          <Link to="/estimates"
            className="text-xs text-blue-500 hover:text-blue-600 font-medium flex items-center gap-1 transition-colors">
            {t('common.see_all')} <ArrowRight size={12} />
          </Link>
        </div>
        {loadingStates.estimates ? (
          <div className="p-12 text-center">
            <div className="inline-flex items-center gap-2 text-slate-400">
              <div className="w-4 h-4 border-2 border-slate-200 border-t-blue-500 rounded-full animate-spin" />
              <span className="text-sm">{t('common.loading')}</span>
            </div>
          </div>
        ) : estimates.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-3">
              <FileText className="text-slate-300" size={20} />
            </div>
            <p className="text-sm text-slate-400">{t('estimates.no_estimates')}</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {estimates.slice(0, 5).map((estimate) => (
              <Link key={estimate.id} to={`/estimates/${estimate.id}`}
                className="flex items-center justify-between px-6 py-3.5 hover:bg-slate-50/50 transition-colors group">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-100 transition-colors">
                    <FileText size={14} className="text-blue-500" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">{estimate.name}</p>
                    <p className="text-xs text-slate-400 truncate">{estimate.project_name || estimate.client_name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0 ml-4">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                    estimate.status === 'active' ? 'bg-emerald-50 text-emerald-600'
                      : estimate.status === 'draft' ? 'bg-amber-50 text-amber-600'
                      : 'bg-slate-100 text-slate-500'
                  }`}>
                    {estimate.status}
                  </span>
                  <span className="text-xs text-slate-400 tabular-nums">
                    {new Date(estimate.created_at).toLocaleDateString()}
                  </span>
                  <ArrowRight size={14} className="text-slate-300 group-hover:text-blue-400 transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
