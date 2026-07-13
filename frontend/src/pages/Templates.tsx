import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Layers, Play } from 'lucide-react';
import toast from 'react-hot-toast';
import { useStore } from '../store';

export default function Templates() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { templates, fetchTemplates, applyTemplate } = useStore();
  const [applyName, setApplyName] = useState('');
  const [applyId, setApplyId] = useState<number | null>(null);

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  const handleApply = async () => {
    if (!applyId || !applyName.trim()) return;
    try {
      const estimateId = await applyTemplate(applyId, applyName);
      toast.success(t('templates.applied'));
      setApplyId(null);
      setApplyName('');
      navigate(`/estimates/${estimateId}`);
    } catch {
      toast.error(t('templates.error_apply'));
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      residencial: 'bg-blue-100 text-blue-800',
      reforma: 'bg-green-100 text-green-800',
      comercial: 'bg-purple-100 text-purple-800',
      industrial: 'bg-orange-100 text-orange-800',
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">{t('templates.title')}</h1>
        </div>

        {templates.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <Layers className="mx-auto text-gray-300 mb-4" size={48} />
            <p className="text-gray-500">{t('templates.no_templates')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map((template) => (
              <div key={template.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-gray-900">{template.name}</h3>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium mt-1 ${getCategoryColor(template.category)}`}>
                      {template.category}
                    </span>
                  </div>
                </div>

                {template.description && (
                  <p className="text-sm text-gray-600 mb-4">{template.description}</p>
                )}

                <div className="text-sm text-gray-500 mb-4">
                  <span className="font-medium">{template.chapters_json.length}</span> {t('templates.chapters').toLowerCase()}
                  {' • '}
                  <span className="font-medium">
                    {template.chapters_json.reduce((sum, ch) => sum + (ch.positions?.length || 0), 0)}
                  </span> {t('estimates.position').toLowerCase()}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setApplyId(template.id)}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
                  >
                    <Play size={14} />
                    {t('templates.apply')}
                  </button>
                </div>

                {applyId === template.id && (
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('templates.apply_as')}</label>
                    <input
                      type="text"
                      value={applyName}
                      onChange={(e) => setApplyName(e.target.value)}
                      placeholder={t('estimates.name')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm mb-2"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={handleApply}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
                      >
                        {t('common.confirm')}
                      </button>
                      <button
                        onClick={() => { setApplyId(null); setApplyName(''); }}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-300"
                      >
                        {t('common.cancel')}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
