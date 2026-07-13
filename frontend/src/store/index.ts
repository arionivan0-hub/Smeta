import { create } from 'zustand';
import { toast } from 'react-hot-toast';
import type { Estimate, EstimateListItem, Chapter, Position, CatalogItem, Template } from '../types';
import { estimatesApi, catalogApi, templatesApi } from '../services/api';

interface LoadingStates {
  estimates: boolean;
  estimateDetail: boolean;
  catalog: boolean;
  templates: boolean;
}

interface AppState {
  estimates: EstimateListItem[];
  currentEstimate: Estimate | null;
  catalogItems: CatalogItem[];
  templates: Template[];
  categories: { [key: string]: string };
  loadingStates: LoadingStates;
  error: string | null;

  fetchEstimates: () => Promise<void>;
  fetchEstimate: (id: number) => Promise<void>;
  createEstimate: (data: { name: string; project_name?: string; client_name?: string; location?: string }) => Promise<Estimate>;
  updateEstimate: (id: number, data: Partial<Estimate>) => Promise<void>;
  deleteEstimate: (id: number) => Promise<void>;

  addChapter: (estimateId: number, data: { code: string; name: string }) => Promise<Chapter>;
  updateChapter: (chapterId: number, data: Partial<Chapter>) => Promise<void>;
  deleteChapter: (chapterId: number) => Promise<void>;

  addPosition: (chapterId: number, data: Omit<Position, 'id' | 'chapter_id'>) => Promise<Position>;
  updatePosition: (positionId: number, data: Partial<Position>) => Promise<void>;
  deletePosition: (positionId: number) => Promise<void>;

  fetchCatalog: (params?: { category?: string; search?: string }) => Promise<void>;
  searchCatalog: (q: string) => Promise<CatalogItem[]>;

  fetchTemplates: () => Promise<void>;
  applyTemplate: (templateId: number, name: string) => Promise<number>;

  fetchCategories: () => Promise<void>;
}

const initialLoading: LoadingStates = {
  estimates: false,
  estimateDetail: false,
  catalog: false,
  templates: false,
};

export const useStore = create<AppState>((set, get) => ({
  estimates: [],
  currentEstimate: null,
  catalogItems: [],
  templates: [],
  categories: {},
  loadingStates: { ...initialLoading },
  error: null,

  fetchEstimates: async () => {
    set((s) => ({ loadingStates: { ...s.loadingStates, estimates: true }, error: null }));
    try {
      const estimates = await estimatesApi.list();
      set((s) => ({ estimates, loadingStates: { ...s.loadingStates, estimates: false } }));
    } catch (e: any) {
      set((s) => ({ loadingStates: { ...s.loadingStates, estimates: false }, error: e?.message || 'Error loading estimates' }));
      toast.error('Error loading estimates');
    }
  },

  fetchEstimate: async (id) => {
    set((s) => ({ loadingStates: { ...s.loadingStates, estimateDetail: true }, error: null }));
    try {
      const estimate = await estimatesApi.get(id);
      set((s) => ({ currentEstimate: estimate, loadingStates: { ...s.loadingStates, estimateDetail: false } }));
    } catch (e: any) {
      set((s) => ({ loadingStates: { ...s.loadingStates, estimateDetail: false }, error: e?.message || 'Estimate not found' }));
      toast.error('Error loading estimate');
    }
  },

  createEstimate: async (data) => {
    try {
      const estimate = await estimatesApi.create(data);
      await get().fetchEstimates();
      return estimate;
    } catch (e: any) {
      toast.error('Error creating estimate');
      throw e;
    }
  },

  updateEstimate: async (id, data) => {
    try {
      await estimatesApi.update(id, data);
      const estimate = await estimatesApi.get(id);
      set({ currentEstimate: estimate });
    } catch (e: any) {
      toast.error('Error updating estimate');
      throw e;
    }
  },

  deleteEstimate: async (id) => {
    try {
      await estimatesApi.delete(id);
      await get().fetchEstimates();
      toast.success('Estimate deleted');
    } catch (e: any) {
      toast.error('Error deleting estimate');
      throw e;
    }
  },

  addChapter: async (estimateId, data) => {
    try {
      const chapters = get().currentEstimate?.chapters || [];
      const chapter = await estimatesApi.createChapter(estimateId, {
        ...data,
        order: chapters.length,
      });
      const estimate = await estimatesApi.get(estimateId);
      set({ currentEstimate: estimate });
      return chapter;
    } catch (e: any) {
      toast.error('Error adding chapter');
      throw e;
    }
  },

  updateChapter: async (chapterId, data) => {
    try {
      await estimatesApi.updateChapter(chapterId, data);
      const estimate = get().currentEstimate;
      if (estimate) {
        const updated = await estimatesApi.get(estimate.id);
        set({ currentEstimate: updated });
      }
    } catch (e: any) {
      toast.error('Error updating chapter');
      throw e;
    }
  },

  deleteChapter: async (chapterId) => {
    try {
      await estimatesApi.deleteChapter(chapterId);
      const estimate = get().currentEstimate;
      if (estimate) {
        const updated = await estimatesApi.get(estimate.id);
        set({ currentEstimate: updated });
      }
      toast.success('Chapter deleted');
    } catch (e: any) {
      toast.error('Error deleting chapter');
      throw e;
    }
  },

  addPosition: async (chapterId, data) => {
    try {
      const position = await estimatesApi.createPosition(chapterId, data);
      const estimate = get().currentEstimate;
      if (estimate) {
        const updated = await estimatesApi.get(estimate.id);
        set({ currentEstimate: updated });
      }
      return position;
    } catch (e: any) {
      toast.error('Error adding position');
      throw e;
    }
  },

  updatePosition: async (positionId, data) => {
    try {
      await estimatesApi.updatePosition(positionId, data);
      const estimate = get().currentEstimate;
      if (estimate) {
        const updated = await estimatesApi.get(estimate.id);
        set({ currentEstimate: updated });
      }
    } catch (e: any) {
      toast.error('Error updating position');
      throw e;
    }
  },

  deletePosition: async (positionId) => {
    try {
      await estimatesApi.deletePosition(positionId);
      const estimate = get().currentEstimate;
      if (estimate) {
        const updated = await estimatesApi.get(estimate.id);
        set({ currentEstimate: updated });
      }
      toast.success('Position deleted');
    } catch (e: any) {
      toast.error('Error deleting position');
      throw e;
    }
  },

  fetchCatalog: async (params) => {
    set((s) => ({ loadingStates: { ...s.loadingStates, catalog: true } }));
    try {
      const items = await catalogApi.list(params);
      set((s) => ({ catalogItems: items, loadingStates: { ...s.loadingStates, catalog: false } }));
    } catch (e: any) {
      set((s) => ({ loadingStates: { ...s.loadingStates, catalog: false } }));
      toast.error('Error loading catalog');
    }
  },

  searchCatalog: async (q) => {
    try {
      return await catalogApi.search(q);
    } catch (e: any) {
      return [];
    }
  },

  fetchTemplates: async () => {
    set((s) => ({ loadingStates: { ...s.loadingStates, templates: true } }));
    try {
      const templates = await templatesApi.list();
      set((s) => ({ templates, loadingStates: { ...s.loadingStates, templates: false } }));
    } catch (e: any) {
      set((s) => ({ loadingStates: { ...s.loadingStates, templates: false } }));
      toast.error('Error loading templates');
    }
  },

  applyTemplate: async (templateId, name) => {
    try {
      const result = await templatesApi.apply(templateId, name);
      await get().fetchEstimates();
      return result.estimate_id;
    } catch (e: any) {
      toast.error('Error applying template');
      throw e;
    }
  },

  fetchCategories: async () => {
    try {
      const categories = await catalogApi.getCategories();
      set({ categories });
    } catch (e: any) {
      // Silent fail for categories
    }
  },
}));
