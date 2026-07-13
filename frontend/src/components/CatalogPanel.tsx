import { useState, useEffect, useMemo, useCallback, useRef, memo } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Plus, ChevronDown, ChevronRight } from 'lucide-react';
import { catalogApi } from '../services/api';
import type { CatalogItem } from '../types';

interface CatalogPanelProps {
  onAddItem: (item: CatalogItem) => void;
  onAddAssembly: (items: CatalogItem[]) => void;
}

const CATEGORY_META: Record<string, { icon: string; color: string; group: string }> = {
  '0': { icon: '🚧', color: 'bg-yellow-50 border-yellow-200 text-yellow-800', group: 'materials' },
  '1': { icon: '🔨', color: 'bg-amber-50 border-amber-200 text-amber-800', group: 'materials' },
  '2': { icon: '🧱', color: 'bg-orange-50 border-orange-200 text-orange-800', group: 'materials' },
  '3': { icon: '🔌', color: 'bg-blue-50 border-blue-200 text-blue-800', group: 'materials' },
  '4': { icon: '🎨', color: 'bg-purple-50 border-purple-200 text-purple-800', group: 'materials' },
  '5': { icon: '🚿', color: 'bg-cyan-50 border-cyan-200 text-cyan-800', group: 'materials' },
  '6': { icon: '🍳', color: 'bg-amber-50 border-amber-200 text-amber-800', group: 'materials' },
  '7': { icon: '👷', color: 'bg-rose-50 border-rose-200 text-rose-800', group: 'labor' },
  '8': { icon: '⚙️', color: 'bg-indigo-50 border-indigo-200 text-indigo-800', group: 'equipment' },
  '9': { icon: '📋', color: 'bg-gray-50 border-gray-200 text-gray-800', group: 'materials' },
  '11': { icon: '⚡', color: 'bg-yellow-50 border-yellow-200 text-yellow-800', group: 'materials' },
  '12': { icon: '🔧', color: 'bg-blue-50 border-blue-200 text-blue-800', group: 'materials' },
  '13': { icon: '🏗', color: 'bg-orange-50 border-orange-200 text-orange-800', group: 'materials' },
  '14': { icon: '🖌', color: 'bg-purple-50 border-purple-200 text-purple-800', group: 'materials' },
  '15': { icon: '🧱', color: 'bg-amber-50 border-amber-200 text-amber-800', group: 'materials' },
};

const ASSEMBLIES = [
  { name: 'Baño Completo', icon: '🚿', items: ['5-001', '5-002', '5-004', '5-006', '5-007', '5-008', 'MO-014'] },
  { name: 'Cocina Básica', icon: '🍳', items: ['6-001', '6-003', '6-004', '6-005', '6-007', '6-008'] },
  { name: 'Instalación Eléctrica', icon: '⚡', items: ['3-001', '3-002', 'MO-004'] },
  { name: 'Fontanería Completa', icon: '🔧', items: ['3-010', 'MO-006'] },
  { name: 'Pared + Pintura', icon: '🎨', items: ['2-002', 'MO-012', '4-001', 'MO-010'] },
  { name: 'Suelo Cerámico', icon: '🧱', items: ['MC-002', 'MO-014'] },
];

type FilterTab = 'all' | 'materials' | 'labor' | 'equipment';

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

const CatalogRow = memo(function CatalogRow({ item, onAdd }: { item: CatalogItem; onAdd: (item: CatalogItem) => void }) {
  const isLabor = item.category === '7';
  const isEquipment = item.category === '8';

  const badge = isLabor ? { label: 'MO', color: 'bg-rose-100 text-rose-700' }
    : isEquipment ? { label: 'MQ', color: 'bg-indigo-100 text-indigo-700' }
    : null;

  const priceColor = isLabor ? 'text-rose-600'
    : isEquipment ? 'text-indigo-600'
    : item.price < 20 ? 'text-green-600'
    : item.price < 100 ? 'text-amber-600'
    : 'text-red-600';

  return (
    <button onClick={() => onAdd(item)}
      className="w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-blue-50 rounded-lg border border-transparent hover:border-blue-200 group transition-all">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] text-gray-400 font-mono">{item.code}</span>
          {badge && (
            <span className={`text-[9px] font-bold px-1 py-0.5 rounded ${badge.color}`}>{badge.label}</span>
          )}
        </div>
        <p className="text-sm text-gray-800 truncate">{item.description}</p>
        <span className="text-xs text-gray-400">{item.unit}</span>
      </div>
      <div className="text-right flex-shrink-0">
        <p className={`text-sm font-bold ${priceColor}`}>€{item.price.toFixed(2)}</p>
        {(isLabor || isEquipment) && (
          <p className="text-[10px] text-gray-400">{item.unit === 'hora' ? '/hora' : item.unit === 'dia' ? '/dia' : ''}</p>
        )}
        <Plus size={14} className="text-blue-500 opacity-0 group-hover:opacity-100 ml-auto mt-0.5 transition-opacity" />
      </div>
    </button>
  );
});

export default function CatalogPanel({ onAddItem, onAddAssembly }: CatalogPanelProps) {
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const [allItems, setAllItems] = useState<CatalogItem[]>([]);
  const [categories, setCategories] = useState<Record<string, string>>({});
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'catalog' | 'assemblies'>('catalog');
  const [filter, setFilter] = useState<FilterTab>('all');
  const [loading, setLoading] = useState(false);
  const mountedRef = useRef(true);

  const debouncedSearch = useDebounce(search, 200);

  useEffect(() => {
    mountedRef.current = true;
    catalogApi.getCategories().then(setCategories);
    loadAllItems();
    return () => { mountedRef.current = false; };
  }, []);

  const loadAllItems = useCallback(async () => {
    setLoading(true);
    try {
      const data = await catalogApi.list({ search: undefined });
      if (mountedRef.current) setAllItems(data);
    } catch {
      if (mountedRef.current) setAllItems([]);
    }
    if (mountedRef.current) setLoading(false);
  }, []);

  const handleAssemblyClick = useCallback(async (assembly: typeof ASSEMBLIES[0]) => {
    const allFound: CatalogItem[] = [];
    for (const code of assembly.items) {
      const found = allItems.find(i => i.code === code);
      if (found) {
        allFound.push(found);
      } else {
        try {
          const results = await catalogApi.search(code);
          if (results.length) allFound.push(results[0]);
        } catch {}
      }
    }
    if (allFound.length) onAddAssembly(allFound);
  }, [allItems, onAddAssembly]);

  const displayItems = useMemo(() => {
    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase();
      return allItems.filter(i =>
        i.description.toLowerCase().includes(q) ||
        i.code.toLowerCase().includes(q)
      );
    }
    if (expandedCategory) {
      return allItems.filter(i => i.category === expandedCategory);
    }
    return [];
  }, [allItems, debouncedSearch, expandedCategory]);

  const grouped = useMemo(() => {
    return allItems.reduce((acc, item) => {
      if (!acc[item.category]) acc[item.category] = 0;
      acc[item.category]++;
      return acc;
    }, {} as Record<string, number>);
  }, [allItems]);

  const filteredCategories = useMemo(() => {
    return Object.entries(categories).filter(([key]) => {
      if (filter === 'all') return true;
      return CATEGORY_META[key]?.group === filter;
    });
  }, [categories, filter]);

  const getGroupLabel = useCallback((group: FilterTab) => {
    switch (group) {
      case 'materials': return `📦 ${t('catalog_panel.materials')}`;
      case 'labor': return `👷 ${t('catalog_panel.labor')}`;
      case 'equipment': return `⚙️ ${t('catalog_panel.equipment')}`;
      default: return `🔍 ${t('catalog_panel.all_categories')}`;
    }
  }, [t]);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearch(val);
    if (val) setExpandedCategory(null);
  }, []);

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col h-full">
      <div className="p-3 border-b border-gray-200">
        <div className="flex gap-1 mb-2">
          <button onClick={() => setActiveTab('catalog')}
            className={`flex-1 text-xs font-medium py-1.5 rounded-lg transition-colors ${
              activeTab === 'catalog' ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:bg-gray-100'
            }`}>
            📖 {t('catalog_panel.catalog_tab')}
          </button>
          <button onClick={() => setActiveTab('assemblies')}
            className={`flex-1 text-xs font-medium py-1.5 rounded-lg transition-colors ${
              activeTab === 'assemblies' ? 'bg-purple-100 text-purple-700' : 'text-gray-500 hover:bg-gray-100'
            }`}>
            🔗 {t('catalog_panel.assemblies_tab')}
          </button>
        </div>

        {activeTab === 'catalog' && (
          <div className="flex gap-0.5 mb-2 bg-gray-100 rounded-lg p-0.5">
            {(['all', 'materials', 'labor', 'equipment'] as FilterTab[]).map((f) => (
              <button key={f} onClick={() => { setFilter(f); setExpandedCategory(null); }}
                className={`flex-1 text-[10px] font-medium py-1 rounded transition-colors ${
                  filter === f ? 'bg-white shadow text-gray-800' : 'text-gray-500 hover:text-gray-700'
                }`}>
                {getGroupLabel(f)}
              </button>
            ))}
          </div>
        )}

        <div className="relative">
          <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" value={search}
            onChange={handleSearchChange}
            placeholder={t('catalog_panel.search_placeholder')}
            className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {activeTab === 'assemblies' ? (
          <div className="p-2 space-y-1">
            <p className="text-[10px] text-gray-400 px-2 pb-1">{t('catalog_panel.assembly_hint')}</p>
            {ASSEMBLIES.map((assembly, idx) => (
              <button key={idx} onClick={() => handleAssemblyClick(assembly)}
                className="w-full flex items-center gap-3 px-3 py-2.5 text-left hover:bg-purple-50 rounded-lg border border-transparent hover:border-purple-200 transition-all group">
                <span className="text-lg">{assembly.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{assembly.name}</p>
                  <p className="text-xs text-gray-400">{assembly.items.length} {t('estimates.positions')}</p>
                </div>
                <Plus size={14} className="text-purple-500 opacity-0 group-hover:opacity-100" />
              </button>
            ))}
          </div>
        ) : debouncedSearch ? (
          <div className="p-2">
            {loading && <p className="text-xs text-gray-400 p-2">{t('catalog_panel.loading')}</p>}
            {!loading && displayItems.length === 0 && (
              <p className="text-xs text-gray-400 p-2">{t('catalog_panel.no_results')}</p>
            )}
            {displayItems.map((item) => (
              <CatalogRow key={item.id} item={item} onAdd={onAddItem} />
            ))}
          </div>
        ) : (
          <div className="p-1">
            {filteredCategories.map(([key, name]) => {
              const isExpanded = expandedCategory === key;
              const count = grouped[key] || 0;
              const meta = CATEGORY_META[key] || { icon: '', color: 'bg-gray-50 border-gray-200', group: '' };
              return (
                <div key={key}>
                  <button onClick={() => setExpandedCategory(isExpanded ? null : key)}
                    className={`w-full flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg border transition-colors ${
                      isExpanded ? meta.color : 'text-gray-700 hover:bg-gray-50 border-transparent'
                    }`}>
                    {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                    <span className="text-base">{meta.icon}</span>
                    <span className="flex-1 text-left">{name}</span>
                    {count > 0 && (
                      <span className="text-xs bg-white/60 text-gray-600 px-1.5 py-0.5 rounded">{count}</span>
                    )}
                  </button>
                  {isExpanded && (
                    <div className="ml-2 border-l-2 border-gray-100">
                      {loading && <p className="text-xs text-gray-400 p-2">{t('catalog_panel.loading')}</p>}
                      {!loading && count === 0 && (
                        <p className="text-xs text-gray-400 p-2 pl-4">{t('catalog_panel.no_results_short')}</p>
                      )}
                      {allItems
                        .filter(i => i.category === key)
                        .filter(i => {
                          if (filter === 'labor') return i.category === '7';
                          if (filter === 'equipment') return i.category === '8';
                          if (filter === 'materials') return i.category !== '7' && i.category !== '8';
                          return true;
                        })
                        .map((item) => (
                          <CatalogRow key={item.id} item={item} onAdd={onAddItem} />
                        ))
                      }
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
