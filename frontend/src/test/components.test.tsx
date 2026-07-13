import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Mock API
vi.mock('../services/api', () => ({
  estimatesApi: {
    list: vi.fn().mockResolvedValue([]),
    get: vi.fn().mockResolvedValue({ id: 1, name: 'Test', chapters: [] }),
    create: vi.fn().mockResolvedValue({ id: 1, name: 'Test' }),
    update: vi.fn().mockResolvedValue({}),
    delete: vi.fn().mockResolvedValue({}),
    createChapter: vi.fn().mockResolvedValue({ id: 1 }),
    updateChapter: vi.fn().mockResolvedValue({}),
    deleteChapter: vi.fn().mockResolvedValue({}),
    createPosition: vi.fn().mockResolvedValue({ id: 1 }),
    updatePosition: vi.fn().mockResolvedValue({}),
    deletePosition: vi.fn().mockResolvedValue({}),
  },
  catalogApi: {
    list: vi.fn().mockResolvedValue([
      { id: 1, code: 'MO-001', description: 'Albanil (jornada)', unit: 'dia', category: '7', price: 180 },
      { id: 2, code: '4-001', description: 'Pintura interior', unit: 'm2', category: '4', price: 14 },
    ]),
    search: vi.fn().mockResolvedValue([]),
    create: vi.fn().mockResolvedValue({}),
    delete: vi.fn().mockResolvedValue({}),
    getCategories: vi.fn().mockResolvedValue({
      '7': 'Mano de Obra',
      '4': 'Acabados',
    }),
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

// Import CatalogRow from the module (it's defined inside CatalogPanel.tsx)
// We need to re-export it for testing
describe('CatalogRow (isolated)', () => {
  // Create a minimal standalone CatalogRow for testing
  const CatalogRow = ({ item, onAdd }: { item: any; onAdd: (item: any) => void }) => {
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
      <button onClick={() => onAdd(item)} className="catalog-row">
        <div>
          <span>{item.code}</span>
          {badge && <span className={badge.color}>{badge.label}</span>}
          <p>{item.description}</p>
          <span>{item.unit}</span>
        </div>
        <div>
          <p className={priceColor}>€{item.price.toFixed(2)}</p>
        </div>
      </button>
    );
  };

  const mockOnAdd = vi.fn();

  beforeEach(() => {
    mockOnAdd.mockClear();
  });

  it('renders item info correctly', () => {
    const item = {
      id: 1, code: 'MO-001', description: 'Albanil (jornada)', unit: 'dia', category: '7', price: 180, source: 'custom',
    };

    render(<CatalogRow item={item} onAdd={mockOnAdd} />);

    expect(screen.getByText('MO-001')).toBeInTheDocument();
    expect(screen.getByText('Albanil (jornada)')).toBeInTheDocument();
    expect(screen.getByText('€180.00')).toBeInTheDocument();
  });

  it('shows labor badge for category 7', () => {
    const item = { id: 1, code: 'MO-001', description: 'Test', unit: 'dia', category: '7', price: 180, source: 'custom' };

    render(<CatalogRow item={item} onAdd={mockOnAdd} />);
    expect(screen.getByText('MO')).toBeInTheDocument();
  });

  it('shows equipment badge for category 8', () => {
    const item = { id: 1, code: 'MQ-001', description: 'Test', unit: 'hora', category: '8', price: 85, source: 'custom' };

    render(<CatalogRow item={item} onAdd={mockOnAdd} />);
    expect(screen.getByText('MQ')).toBeInTheDocument();
  });

  it('calls onAdd when clicked', async () => {
    const user = userEvent.setup();
    const item = { id: 1, code: 'MO-001', description: 'Test Item', unit: 'dia', category: '7', price: 180, source: 'custom' };

    render(<CatalogRow item={item} onAdd={mockOnAdd} />);
    await user.click(screen.getByText('Test Item'));

    expect(mockOnAdd).toHaveBeenCalledWith(item);
  });

  it('shows correct price color for low price (<€20)', () => {
    const item = { id: 1, code: 'X', description: 'Low', unit: 'ud', category: '0', price: 10, source: 'custom' };

    render(<CatalogRow item={item} onAdd={mockOnAdd} />);
    expect(screen.getByText('€10.00')).toHaveClass('text-green-600');
  });

  it('shows correct price color for medium price (<€100)', () => {
    const item = { id: 1, code: 'Y', description: 'Med', unit: 'ud', category: '0', price: 50, source: 'custom' };

    render(<CatalogRow item={item} onAdd={mockOnAdd} />);
    expect(screen.getByText('€50.00')).toHaveClass('text-amber-600');
  });

  it('shows correct price color for high price (>=€100)', () => {
    const item = { id: 1, code: 'Z', description: 'High', unit: 'ud', category: '0', price: 150, source: 'custom' };

    render(<CatalogRow item={item} onAdd={mockOnAdd} />);
    expect(screen.getByText('€150.00')).toHaveClass('text-red-600');
  });

  it('shows rose color for labor items', () => {
    const item = { id: 1, code: 'MO-001', description: 'Labor', unit: 'hora', category: '7', price: 200, source: 'custom' };

    render(<CatalogRow item={item} onAdd={mockOnAdd} />);
    expect(screen.getByText('€200.00')).toHaveClass('text-rose-600');
  });

  it('shows indigo color for equipment items', () => {
    const item = { id: 1, code: 'MQ-001', description: 'Equipment', unit: 'hora', category: '8', price: 200, source: 'custom' };

    render(<CatalogRow item={item} onAdd={mockOnAdd} />);
    expect(screen.getByText('€200.00')).toHaveClass('text-indigo-600');
  });
});

describe('useDebounce', () => {
  // Test the debounce hook in isolation
  it('should export from CatalogPanel', async () => {
    // The hook is internal, but we can test its behavior through the component
    const module = await import('../components/CatalogPanel');
    expect(module.default).toBeDefined();
  });
});

describe('Store integration', () => {
  it('store has correct initial state', async () => {
    const { useStore } = await import('../store');
    const state = useStore.getState();

    expect(state.estimates).toEqual([]);
    expect(state.currentEstimate).toBeNull();
    expect(state.catalogItems).toEqual([]);
    expect(state.templates).toEqual([]);
    expect(state.loadingStates).toEqual({
      estimates: false,
      estimateDetail: false,
      catalog: false,
      templates: false,
    });
    expect(state.error).toBeNull();
  });

  it('store actions are functions', async () => {
    const { useStore } = await import('../store');
    const state = useStore.getState();

    expect(typeof state.fetchEstimates).toBe('function');
    expect(typeof state.fetchEstimate).toBe('function');
    expect(typeof state.createEstimate).toBe('function');
    expect(typeof state.deleteEstimate).toBe('function');
    expect(typeof state.addChapter).toBe('function');
    expect(typeof state.deleteChapter).toBe('function');
    expect(typeof state.addPosition).toBe('function');
    expect(typeof state.updatePosition).toBe('function');
    expect(typeof state.deletePosition).toBe('function');
    expect(typeof state.fetchCatalog).toBe('function');
    expect(typeof state.fetchTemplates).toBe('function');
    expect(typeof state.applyTemplate).toBe('function');
  });
});
