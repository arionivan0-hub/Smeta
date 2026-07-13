import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Settings as SettingsIcon, Building2, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';

interface CompanyData {
  company_name: string;
  nif: string;
  address: string;
  phone: string;
  email: string;
  website: string;
}

export default function Settings() {
  const { t } = useTranslation();
  const [company, setCompany] = useState<CompanyData>({
    company_name: '',
    nif: '',
    address: '',
    phone: '',
    email: '',
    website: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const res = await axios.get('/api/settings/company');
      setCompany(res.data);
    } catch {
      // Settings not created yet
    }
    setLoading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await axios.put('/api/settings/company', company);
      toast.success(t('settings.saved'));
    } catch {
      toast.error(t('common.error'));
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="flex items-center gap-3 text-slate-400">
          <div className="w-5 h-5 border-2 border-slate-200 border-t-blue-500 rounded-full animate-spin" />
          <span className="text-sm font-medium">{t('common.loading')}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{t('settings.title')}</h1>
        <p className="text-sm text-slate-500 mt-1">{t('settings.description')}</p>
      </div>

      {/* Company Info */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6 mb-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
            <Building2 size={18} className="text-blue-500" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-slate-900">{t('settings.company_info')}</h2>
            <p className="text-xs text-slate-400">{t('settings.company_info_desc')}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
              {t('settings.company_name')} *
            </label>
            <input
              type="text"
              value={company.company_name}
              onChange={(e) => setCompany({ ...company, company_name: e.target.value })}
              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
              placeholder={t('settings.company_name_placeholder')}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
              {t('settings.nif')}
            </label>
            <input
              type="text"
              value={company.nif}
              onChange={(e) => setCompany({ ...company, nif: e.target.value })}
              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
              placeholder="B12345678"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
              {t('settings.phone')}
            </label>
            <input
              type="tel"
              value={company.phone}
              onChange={(e) => setCompany({ ...company, phone: e.target.value })}
              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
              placeholder="+34 600 000 000"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
              {t('settings.address')}
            </label>
            <input
              type="text"
              value={company.address}
              onChange={(e) => setCompany({ ...company, address: e.target.value })}
              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
              placeholder="Calle Ejemplo 123, 28001 Madrid"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
              {t('settings.email')}
            </label>
            <input
              type="email"
              value={company.email}
              onChange={(e) => setCompany({ ...company, email: e.target.value })}
              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
              placeholder="info@empresa.com"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
              {t('settings.website')}
            </label>
            <input
              type="url"
              value={company.website}
              onChange={(e) => setCompany({ ...company, website: e.target.value })}
              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
              placeholder="https://www.empresa.com"
            />
          </div>
        </div>
      </div>

      {/* Preview */}
      {company.company_name && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
              <SettingsIcon size={18} className="text-slate-500" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-slate-900">{t('settings.preview')}</h2>
              <p className="text-xs text-slate-400">{t('settings.preview_desc')}</p>
            </div>
          </div>

          <div className="border border-slate-200 rounded-xl p-5 bg-slate-50/50">
            <p className="text-lg font-bold text-slate-900">{company.company_name}</p>
            {company.nif && <p className="text-sm text-slate-600">NIF/CIF: {company.nif}</p>}
            {company.address && <p className="text-sm text-slate-600">{company.address}</p>}
            {(company.phone || company.email) && (
              <p className="text-sm text-slate-600">
                {[company.phone, company.email].filter(Boolean).join(' | ')}
              </p>
            )}
            {company.website && (
              <p className="text-sm text-blue-500">{company.website}</p>
            )}
          </div>
        </div>
      )}

      {/* Save button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving || !company.company_name.trim()}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-500 text-white rounded-xl text-sm font-medium hover:bg-blue-600 shadow-lg shadow-blue-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Save size={16} />
          )}
          {t('common.save')}
        </button>
      </div>
    </div>
  );
}
