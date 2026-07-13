import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useStore } from '../store';

// Mock API
vi.mock('../services/api', () => ({
  estimatesApi: {
    list: vi.fn().mockResolvedValue([]),
    get: vi.fn().mockResolvedValue({ id: 1, name: 'Test', chapters: [] }),
    create: vi.fn().mockResolvedValue({ id: 1, name: 'Test' }),
    update: vi.fn().mockResolvedValue({}),
    delete: vi.fn().mockResolvedValue({}),
    createChapter: vi.fn().mockResolvedValue({ id: 1, name: 'Chapter 1' }),
    updateChapter: vi.fn().mockResolvedValue({}),
    deleteChapter: vi.fn().mockResolvedValue({}),
    createPosition: vi.fn().mockResolvedValue({ id: 1, name: 'Position 1' }),
    updatePosition: vi.fn().mockResolvedValue({}),
    deletePosition: vi.fn().mockResolvedValue({}),
  },
  catalogApi: {
    list: vi.fn().mockResolvedValue([]),
    search: vi.fn().mockResolvedValue([]),
    create: vi.fn().mockResolvedValue({}),
    delete: vi.fn().mockResolvedValue({}),
    getCategories: vi.fn().mockResolvedValue({}),
  },
  templatesApi: {
    list: vi.fn().mockResolvedValue([]),
    apply: vi.fn().mockResolvedValue({ estimate_id: 1 }),
    create: vi.fn().mockResolvedValue({}),
    delete: vi.fn().mockResolvedValue({}),
  },
  importExportApi: {
    exportPdf: vi.fn().mockResolvedValue({ data: new Blob() }),
    exportExcel: vi.fn().mockResolvedValue({ data: new Blob() }),
  },
}));

describe('Store', () => {
  beforeEach(() => {
    // Reset store state
    useStore.setState({
      estimates: [],
      currentEstimate: null,
      catalogItems: [],
      templates: [],
      categories: {},
      loadingStates: {
        estimates: false,
        estimateDetail: false,
        catalog: false,
        templates: false,
      },
      error: null,
    });
  });

  describe('fetchEstimates', () => {
    it('should set loading to true while fetching', async () => {
      const { fetchEstimates } = useStore.getState();
      const promise = fetchEstimates();

      expect(useStore.getState().loadingStates.estimates).toBe(true);

      await promise;
      expect(useStore.getState().loadingStates.estimates).toBe(false);
    });

    it('should populate estimates on success', async () => {
      const { fetchEstimates } = useStore.getState();
      await fetchEstimates();

      expect(useStore.getState().estimates).toEqual([]);
    });

    it('should handle errors gracefully', async () => {
      const { estimatesApi } = await import('../services/api');
      (estimatesApi.list as any).mockRejectedValueOnce(new Error('Network error'));

      const { fetchEstimates } = useStore.getState();
      await fetchEstimates();

      expect(useStore.getState().loadingStates.estimates).toBe(false);
      expect(useStore.getState().estimates).toEqual([]);
    });
  });

  describe('fetchEstimate', () => {
    it('should set estimateDetail loading state', async () => {
      const { fetchEstimate } = useStore.getState();
      const promise = fetchEstimate(1);

      expect(useStore.getState().loadingStates.estimateDetail).toBe(true);

      await promise;
      expect(useStore.getState().loadingStates.estimateDetail).toBe(false);
    });

    it('should populate currentEstimate on success', async () => {
      const { fetchEstimate } = useStore.getState();
      await fetchEstimate(1);

      expect(useStore.getState().currentEstimate).toEqual({ id: 1, name: 'Test', chapters: [] });
    });
  });

  describe('createEstimate', () => {
    it('should create estimate and refresh list', async () => {
      const { createEstimate } = useStore.getState();
      const result = await createEstimate({ name: 'New Estimate' });

      expect(result).toEqual({ id: 1, name: 'Test' });
    });
  });

  describe('deleteEstimate', () => {
    it('should delete estimate and refresh list', async () => {
      const { deleteEstimate } = useStore.getState();
      await deleteEstimate(1);

      // Should have called delete API
      const { estimatesApi } = await import('../services/api');
      expect(estimatesApi.delete).toHaveBeenCalledWith(1);
    });
  });

  describe('addChapter', () => {
    it('should add chapter and refresh estimate', async () => {
      useStore.setState({
        currentEstimate: { id: 1, name: 'Test', chapters: [] } as any,
      });

      const { addChapter } = useStore.getState();
      const result = await addChapter(1, { code: '0', name: 'Chapter 1' });

      expect(result).toEqual({ id: 1, name: 'Chapter 1' });
    });
  });

  describe('deleteChapter', () => {
    it('should delete chapter and refresh estimate', async () => {
      useStore.setState({
        currentEstimate: { id: 1, name: 'Test', chapters: [] } as any,
      });

      const { deleteChapter } = useStore.getState();
      await deleteChapter(1);

      const { estimatesApi } = await import('../services/api');
      expect(estimatesApi.deleteChapter).toHaveBeenCalledWith(1);
    });
  });

  describe('addPosition', () => {
    it('should add position and refresh estimate', async () => {
      useStore.setState({
        currentEstimate: { id: 1, name: 'Test', chapters: [] } as any,
      });

      const { addPosition } = useStore.getState();
      const result = await addPosition(1, {
        code: 'MO-001',
        description: 'Test Position',
        unit: 'ud',
        quantity: 1,
        unit_price: 100,
        total_price: 100,
        order: 0,
      });

      expect(result).toEqual({ id: 1, name: 'Position 1' });
    });
  });

  describe('updatePosition', () => {
    it('should update position and refresh estimate', async () => {
      useStore.setState({
        currentEstimate: { id: 1, name: 'Test', chapters: [] } as any,
      });

      const { updatePosition } = useStore.getState();
      await updatePosition(1, { quantity: 5 });

      const { estimatesApi } = await import('../services/api');
      expect(estimatesApi.updatePosition).toHaveBeenCalledWith(1, { quantity: 5 });
    });
  });

  describe('deletePosition', () => {
    it('should delete position and refresh estimate', async () => {
      useStore.setState({
        currentEstimate: { id: 1, name: 'Test', chapters: [] } as any,
      });

      const { deletePosition } = useStore.getState();
      await deletePosition(1);

      const { estimatesApi } = await import('../services/api');
      expect(estimatesApi.deletePosition).toHaveBeenCalledWith(1);
    });
  });

  describe('fetchCatalog', () => {
    it('should set catalog loading state', async () => {
      const { fetchCatalog } = useStore.getState();
      const promise = fetchCatalog();

      expect(useStore.getState().loadingStates.catalog).toBe(true);

      await promise;
      expect(useStore.getState().loadingStates.catalog).toBe(false);
    });
  });

  describe('fetchTemplates', () => {
    it('should set templates loading state', async () => {
      const { fetchTemplates } = useStore.getState();
      const promise = fetchTemplates();

      expect(useStore.getState().loadingStates.templates).toBe(true);

      await promise;
      expect(useStore.getState().loadingStates.templates).toBe(false);
    });
  });

  describe('applyTemplate', () => {
    it('should apply template and return estimate id', async () => {
      const { applyTemplate } = useStore.getState();
      const result = await applyTemplate(1, 'New Estimate');

      expect(result).toBe(1);
    });
  });
});
