import { useEffect, useState, useMemo, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Plus, Trash2, Download, GripVertical, Pencil } from 'lucide-react';
import toast from 'react-hot-toast';
import { useStore } from '../store';
import { importExportApi, estimatesApi } from '../services/api';
import CatalogPanel from '../components/CatalogPanel';
import type { CatalogItem } from '../types';

export default function EstimateEditor() {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const {
    currentEstimate, fetchEstimate, loadingStates,
    addChapter, deleteChapter,
    addPosition, updatePosition, deletePosition,
  } = useStore();

  const [selectedChapterId, setSelectedChapterId] = useState<number | null>(null);
  const [showNewChapter, setShowNewChapter] = useState(false);
  const [newChapterName, setNewChapterName] = useState('');
  const [editingField, setEditingField] = useState<{ positionId: number; field: string } | null>(null);
  const [editValue, setEditValue] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', project_name: '', client_name: '', location: '' });

  useEffect(() => {
    if (id) fetchEstimate(parseInt(id));
  }, [id, fetchEstimate]);

  useEffect(() => {
    if (currentEstimate?.chapters?.length && !selectedChapterId) {
      setSelectedChapterId(currentEstimate.chapters[0].id);
    }
  }, [currentEstimate, selectedChapterId]);

  const handleAddFromCatalog = useCallback(async (item: CatalogItem) => {
    const targetId = selectedChapterId || currentEstimate?.chapters?.[0]?.id;
    if (!targetId) {
      toast.error(t('editor.create_chapter_first'));
      return;
    }
    await addPosition(targetId, {
      code: item.code,
      description: item.description,
      unit: item.unit,
      quantity: 1,
      unit_price: item.price,
      total_price: item.price,
      catalog_item_id: item.id,
      order: 0,
    });
    toast.success(`+ ${item.description}`);
  }, [selectedChapterId, currentEstimate, addPosition, t]);

  const handleAddAssembly = useCallback(async (catalogItems: CatalogItem[]) => {
    const targetId = selectedChapterId || currentEstimate?.chapters?.[0]?.id;
    if (!targetId) {
      toast.error(t('editor.create_chapter_first'));
      return;
    }
    for (const item of catalogItems) {
      await addPosition(targetId, {
        code: item.code,
        description: item.description,
        unit: item.unit,
        quantity: 1,
        unit_price: item.price,
        total_price: item.price,
        catalog_item_id: item.id,
        order: 0,
      });
    }
    toast.success(`${catalogItems.length} ${t('editor.positions_added')}`);
  }, [selectedChapterId, currentEstimate, addPosition, t]);

  const handleAddChapter = useCallback(async () => {
    if (!id || !newChapterName.trim()) return;
    const code = String(currentEstimate?.chapters?.length || 0);
    await addChapter(parseInt(id), { code, name: newChapterName.trim() });
    setNewChapterName('');
    setShowNewChapter(false);
    toast.success(t('editor.chapter_added'));
  }, [id, newChapterName, currentEstimate, addChapter, t]);

  const startEdit = useCallback((positionId: number, field: string, currentValue: string | number) => {
    setEditingField({ positionId, field });
    setEditValue(String(currentValue));
  }, []);

  const commitEdit = useCallback(async (positionId: number, field: string) => {
    const numVal = parseFloat(editValue) || 0;
    const update: Record<string, unknown> = {};

    if (field === 'quantity' || field === 'unit_price') {
      update[field] = numVal;
      const pos = currentEstimate?.chapters
        ?.flatMap(ch => ch.positions)
        ?.find(p => p.id === positionId);
      if (pos) {
        const q = field === 'quantity' ? numVal : pos.quantity;
        const p = field === 'unit_price' ? numVal : pos.unit_price;
        update.total_price = q * p;
      }
    } else {
      update[field] = editValue;
    }

    await updatePosition(positionId, update);
    setEditingField(null);
  }, [editValue, currentEstimate, updatePosition]);

  const handleExportPdf = useCallback(async () => {
    if (!id) return;
    try {
      const response = await importExportApi.exportPdf(parseInt(id));
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const a = document.createElement('a');
      a.href = url;
      a.download = `presupuesto_${currentEstimate?.name.replace(/\s/g, '_')}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
      toast.success('PDF exportado');
    } catch { toast.error(t('common.error')); }
  }, [id, currentEstimate, t]);

  const handleExportExcel = useCallback(async () => {
    if (!id) return;
    try {
      const response = await importExportApi.exportExcel(parseInt(id));
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const a = document.createElement('a');
      a.href = url;
      a.download = `presupuesto_${currentEstimate?.name.replace(/\s/g, '_')}.xlsx`;
      a.click();
      window.URL.revokeObjectURL(url);
      toast.success('Excel exportado');
    } catch { toast.error(t('common.error')); }
  }, [id, currentEstimate, t]);

  const totalGeneral = useMemo(() => currentEstimate?.chapters?.reduce((sum, ch) =>
    sum + ch.positions.reduce((s, p) => s + p.total_price, 0), 0) ?? 0, [currentEstimate?.chapters]);

  const totalPositions = useMemo(() => currentEstimate?.chapters?.reduce((s, ch) => s + ch.positions.length, 0) ?? 0, [currentEstimate?.chapters]);

  const openEditModal = useCallback(() => {
    if (currentEstimate) {
      setEditForm({
        name: currentEstimate.name,
        project_name: currentEstimate.project_name || '',
        client_name: currentEstimate.client_name || '',
        location: currentEstimate.location || '',
      });
      setShowEditModal(true);
    }
  }, [currentEstimate]);

  const handleSaveEstimate = useCallback(async () => {
    if (!id || !editForm.name.trim()) return;
    try {
      await estimatesApi.update(parseInt(id), editForm);
      await fetchEstimate(parseInt(id));
      setShowEditModal(false);
      toast.success(t('editor.estimate_updated'));
    } catch {
      toast.error(t('common.error'));
    }
  }, [id, editForm, fetchEstimate, t]);

  if (loadingStates.estimateDetail || !currentEstimate) {
    return <div className="p-8 flex items-center justify-center"><p className="text-gray-500">{t('common.loading')}</p></div>;
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <CatalogPanel onAddItem={handleAddFromCatalog} onAddAssembly={handleAddAssembly} />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="h-14 px-5 border-b border-slate-200/80 bg-white flex items-center gap-3 flex-shrink-0">
          <button onClick={() => navigate('/estimates')} className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-lg hover:bg-slate-100">
            <ArrowLeft size={18} />
          </button>
          <div className="flex-1 min-w-0 cursor-pointer hover:bg-slate-50 rounded-lg px-2 py-1 -mx-2 transition-colors" onClick={openEditModal}>
            <h1 className="text-[15px] font-semibold text-slate-900 truncate">{currentEstimate.name}</h1>
            <p className="text-[11px] text-slate-400 truncate">
              {currentEstimate.project_name}
              {currentEstimate.client_name && ` · ${currentEstimate.client_name}`}
              {currentEstimate.location && ` · ${currentEstimate.location}`}
            </p>
          </div>
          <button onClick={openEditModal}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all"
            title={t('common.edit')}>
            <Pencil size={14} />
          </button>
          <div className="flex items-center gap-1.5">
            <button onClick={handleExportPdf}
              className="px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-xs font-medium hover:bg-red-100 transition-colors flex items-center gap-1.5">
              <Download size={12} /> PDF
            </button>
            <button onClick={handleExportExcel}
              className="px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-lg text-xs font-medium hover:bg-emerald-100 transition-colors flex items-center gap-1.5">
              <Download size={12} /> Excel
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto bg-slate-50/50">
          {currentEstimate.chapters.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full">
              <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
                <span className="text-3xl">🏗️</span>
              </div>
              <p className="text-base font-semibold text-slate-700 mb-1">{t('editor.no_chapters')}</p>
              <p className="text-sm text-slate-400 mb-5">{t('editor.add_chapter_hint')}</p>
              <button onClick={() => setShowNewChapter(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-500 text-white rounded-xl text-sm font-medium hover:bg-blue-600 shadow-lg shadow-blue-500/25 transition-all hover:shadow-xl hover:shadow-blue-500/30">
                <Plus size={16} /> {t('editor.first_chapter')}
              </button>
            </div>
          ) : (
            <div className="p-4 space-y-3">
              {currentEstimate.chapters.map((chapter) => {
                const chapterTotal = chapter.positions.reduce((s, p) => s + p.total_price, 0);
                const isSelected = selectedChapterId === chapter.id;
                return (
                  <div key={chapter.id}
                    className={`bg-white rounded-xl border transition-all cursor-pointer ${
                      isSelected ? 'border-blue-300 shadow-md shadow-blue-500/5 ring-1 ring-blue-100' : 'border-slate-200/60 shadow-sm hover:shadow hover:border-slate-300'
                    }`}
                    onClick={() => setSelectedChapterId(chapter.id)}
                  >
                    <div className="px-4 py-3 flex items-center gap-3 border-b border-slate-100">
                      <GripVertical size={14} className="text-slate-300" />
                      <span className="text-[11px] font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">{chapter.code}</span>
                      <span className="font-semibold text-[13px] text-slate-900 flex-1">{chapter.name}</span>
                      <span className="text-[11px] text-slate-400 mr-1 tabular-nums">{chapter.positions.length} {t('estimates.positions')}</span>
                      <span className="text-sm font-bold text-slate-700 tabular-nums">€{chapterTotal.toLocaleString('es-ES', { minimumFractionDigits: 2 })}</span>
                      <button onClick={(e) => { e.stopPropagation(); deleteChapter(chapter.id); }}
                        className="text-slate-300 hover:text-red-500 ml-1 p-1 rounded-md hover:bg-red-50 transition-all">
                        <Trash2 size={14} />
                      </button>
                    </div>

                    {chapter.positions.length > 0 ? (
                      <div className="divide-y divide-slate-50">
                        <div className="px-4 py-2 flex items-center gap-2 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                          <span className="w-16">{t('estimates.code')}</span>
                          <span className="flex-1">{t('estimates.description')}</span>
                          <span className="w-10 text-center">{t('estimates.unit')}</span>
                          <span className="w-20 text-right">{t('estimates.quantity')}</span>
                          <span className="w-24 text-right">{t('estimates.unit_price')}</span>
                          <span className="w-28 text-right">{t('estimates.amount')}</span>
                          <span className="w-5"></span>
                        </div>
                        {chapter.positions.map((pos) => (
                          <div key={pos.id} className="px-4 py-1.5 flex items-center gap-2 text-sm hover:bg-gray-50 group">
                            <span className="w-16 text-xs font-mono text-gray-400">{pos.code}</span>
                            <span className="flex-1 text-gray-800 truncate text-sm">{pos.description}</span>
                            <span className="w-10 text-center text-xs text-gray-400">{pos.unit}</span>

                            <div className="w-20 text-right">
                              {editingField?.positionId === pos.id && editingField.field === 'quantity' ? (
                                <input type="number" value={editValue} autoFocus min="0" step="1"
                                  className="w-full text-right px-1 py-0.5 border border-blue-400 rounded text-sm bg-blue-50"
                                  onChange={(e) => setEditValue(e.target.value)}
                                  onBlur={() => commitEdit(pos.id, 'quantity')}
                                  onKeyDown={(e) => { if (e.key === 'Enter') commitEdit(pos.id, 'quantity'); if (e.key === 'Escape') setEditingField(null); }}
                                  onClick={(e) => e.stopPropagation()} />
                              ) : (
                                <span className="cursor-pointer hover:bg-blue-50 rounded px-1 py-0.5 text-sm text-gray-600"
                                  onClick={(e) => { e.stopPropagation(); startEdit(pos.id, 'quantity', pos.quantity); }}>
                                  {pos.quantity.toLocaleString('es-ES')}
                                </span>
                              )}
                            </div>

                            <div className="w-24 text-right">
                              {editingField?.positionId === pos.id && editingField.field === 'unit_price' ? (
                                <input type="number" value={editValue} autoFocus step="0.01" min="0"
                                  className="w-full text-right px-1 py-0.5 border border-blue-400 rounded text-sm bg-blue-50"
                                  onChange={(e) => setEditValue(e.target.value)}
                                  onBlur={() => commitEdit(pos.id, 'unit_price')}
                                  onKeyDown={(e) => { if (e.key === 'Enter') commitEdit(pos.id, 'unit_price'); if (e.key === 'Escape') setEditingField(null); }}
                                  onClick={(e) => e.stopPropagation()} />
                              ) : (
                                <span className="cursor-pointer hover:bg-blue-50 rounded px-1 py-0.5 text-sm text-gray-600"
                                  onClick={(e) => { e.stopPropagation(); startEdit(pos.id, 'unit_price', pos.unit_price); }}>
                                  €{pos.unit_price.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                                </span>
                              )}
                            </div>

                            <span className="w-28 text-right font-bold text-gray-900 text-sm flex-shrink-0">
                              €{pos.total_price.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                            </span>

                            <button onClick={(e) => { e.stopPropagation(); deletePosition(pos.id); }}
                              className="w-5 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Trash2 size={12} />
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="px-4 py-8 text-center text-xs text-gray-400">
                        👉 {t('editor.select_chapter')}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Bottom bar */}
        <div className="h-12 px-5 bg-white border-t border-slate-200/80 flex items-center justify-between flex-shrink-0">
          <button onClick={() => setShowNewChapter(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-600 rounded-lg text-xs font-medium hover:bg-slate-200 transition-colors">
            <Plus size={14} /> {t('editor.chapter_name')}
          </button>
          <div className="flex items-center gap-4">
            <span className="text-[11px] text-slate-400 tabular-nums">{totalPositions} {t('estimates.positions')} {t('estimates.in')} {currentEstimate.chapters.length} {t('estimates.chapters')}</span>
            <div className="bg-slate-900 text-white px-4 py-1.5 rounded-lg flex items-center gap-2.5">
              <span className="text-[11px] font-medium opacity-60">{t('common.total')}</span>
              <span className="text-sm font-bold tabular-nums">€{totalGeneral.toLocaleString('es-ES', { minimumFractionDigits: 2 })}</span>
            </div>
          </div>
        </div>
      </div>

      {showNewChapter && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-96 border border-slate-200/60">
            <h3 className="text-base font-semibold text-slate-900 mb-4">{t('estimates.add_chapter')}</h3>
            <input type="text" value={newChapterName}
              onChange={(e) => setNewChapterName(e.target.value)}
              placeholder={t('editor.chapter_name_placeholder')}
              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-700 placeholder:text-slate-400 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
              autoFocus
              onKeyDown={(e) => { if (e.key === 'Enter') handleAddChapter(); }} />
            <div className="flex gap-2">
              <button onClick={handleAddChapter} className="flex-1 px-4 py-2.5 bg-blue-500 text-white rounded-xl text-sm font-medium hover:bg-blue-600 shadow-lg shadow-blue-500/25 transition-all">
                {t('common.create')}
              </button>
              <button onClick={() => { setShowNewChapter(false); setNewChapterName(''); }}
                className="px-4 py-2.5 bg-slate-100 text-slate-600 rounded-xl text-sm font-medium hover:bg-slate-200 transition-colors">
                {t('common.cancel')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Estimate Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-lg border border-slate-200/60">
            <h3 className="text-base font-semibold text-slate-900 mb-5">{t('editor.edit_estimate')}</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">{t('estimates.name')} *</label>
                <input type="text" value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
                  autoFocus />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">{t('estimates.client')}</label>
                  <input type="text" value={editForm.client_name}
                    onChange={(e) => setEditForm({ ...editForm, client_name: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
                    placeholder={t('estimates.client_name')} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">{t('estimates.project')}</label>
                  <input type="text" value={editForm.project_name}
                    onChange={(e) => setEditForm({ ...editForm, project_name: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
                    placeholder={t('estimates.project_name')} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">{t('estimates.location')}</label>
                <input type="text" value={editForm.location}
                  onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
                  placeholder={t('estimates.location_name')} />
              </div>
            </div>
            <div className="flex gap-2 mt-6">
              <button onClick={handleSaveEstimate}
                disabled={!editForm.name.trim()}
                className="flex-1 px-4 py-2.5 bg-blue-500 text-white rounded-xl text-sm font-medium hover:bg-blue-600 shadow-lg shadow-blue-500/25 transition-all disabled:opacity-50">
                {t('common.save')}
              </button>
              <button onClick={() => setShowEditModal(false)}
                className="px-4 py-2.5 bg-slate-100 text-slate-600 rounded-xl text-sm font-medium hover:bg-slate-200 transition-colors">
                {t('common.cancel')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
