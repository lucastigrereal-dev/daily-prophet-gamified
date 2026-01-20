# Exemplos de Código - Filtros Avançados

## Snippets Úteis para Referência e Reutilização

---

## 1. Debounce Pattern

```typescript
// Hook de debounce para search input
const [searchQuery, setSearchQuery] = useState('');
const [searchInput, setSearchInput] = useState('');

useEffect(() => {
  const timer = setTimeout(() => {
    setSearchQuery(searchInput);
  }, 300); // 300ms delay

  return () => clearTimeout(timer);
}, [searchInput]);

// No JSX
<input
  value={searchInput}
  onChange={(e) => setSearchInput(e.target.value)}
  placeholder="Buscar..."
/>
```

---

## 2. URL Params Sync

```typescript
import { useRouter, useSearchParams } from 'next/navigation';

// Ler params iniciais
const searchParams = useSearchParams();
const initialQuery = searchParams.get('q') || '';

// Atualizar params
const updateURLParams = useCallback(() => {
  const params = new URLSearchParams();

  if (searchQuery) params.set('q', searchQuery);
  if (selectedItems.length > 0) params.set('items', selectedItems.join(','));

  const queryString = params.toString();
  const newUrl = queryString ? `/page?${queryString}` : '/page';
  router.replace(newUrl, { scroll: false });
}, [searchQuery, selectedItems, router]);

useEffect(() => {
  updateURLParams();
}, [updateURLParams]);
```

---

## 3. Multi-Select Checkbox Pattern

```typescript
// Estado
const [selectedItems, setSelectedItems] = useState<string[]>([]);

// Toggle function
const toggleItem = (item: string) => {
  setSelectedItems(prev =>
    prev.includes(item)
      ? prev.filter(i => i !== item)
      : [...prev, item]
  );
};

// JSX
<label className="flex items-center gap-2 cursor-pointer">
  <input
    type="checkbox"
    checked={selectedItems.includes('item1')}
    onChange={() => toggleItem('item1')}
    className="w-4 h-4 rounded border-gray-600 text-purple-600"
  />
  <span>Item 1</span>
</label>
```

---

## 4. Range Slider with Display

```typescript
// Estado
const [minValue, setMinValue] = useState(0);

// JSX
<div>
  <div className="flex justify-between text-sm mb-2">
    <span className="text-gray-400">Valor Mínimo</span>
    <span className="text-purple-400 font-semibold">{minValue}%</span>
  </div>
  <input
    type="range"
    min="0"
    max="100"
    step="1"
    value={minValue}
    onChange={(e) => setMinValue(Number(e.target.value))}
    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-600"
  />
</div>
```

---

## 5. Date Filter Buttons

```typescript
type DateFilter = 'todos' | 'hoje' | 'semana' | 'mes' | 'customizado';

const [dateFilter, setDateFilter] = useState<DateFilter>('todos');

// Helper function
const isInDateRange = (dateStr: string): boolean => {
  const date = new Date(dateStr);
  const now = new Date();

  if (dateFilter === 'todos') return true;

  if (dateFilter === 'hoje') {
    return date.toDateString() === now.toDateString();
  }

  if (dateFilter === 'semana') {
    const weekAgo = new Date(now);
    weekAgo.setDate(weekAgo.getDate() - 7);
    return date >= weekAgo;
  }

  if (dateFilter === 'mes') {
    const monthAgo = new Date(now);
    monthAgo.setMonth(monthAgo.getMonth() - 1);
    return date >= monthAgo;
  }

  return true;
};

// JSX
<div className="flex gap-2">
  {['todos', 'hoje', 'semana', 'mes'].map(filter => (
    <button
      key={filter}
      onClick={() => setDateFilter(filter as DateFilter)}
      className={`px-4 py-2 rounded-lg transition-colors ${
        dateFilter === filter
          ? 'bg-purple-600 text-white'
          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
      }`}
    >
      {filter.charAt(0).toUpperCase() + filter.slice(1)}
    </button>
  ))}
</div>
```

---

## 6. Custom Date Range

```typescript
const [customDateStart, setCustomDateStart] = useState('');
const [customDateEnd, setCustomDateEnd] = useState('');

// Validation
const isValidDateRange = (start: string, end: string): boolean => {
  if (!start || !end) return true;
  return new Date(start) <= new Date(end);
};

// Filter logic
const isInCustomRange = (dateStr: string): boolean => {
  const date = new Date(dateStr);

  if (customDateStart && customDateEnd) {
    const start = new Date(customDateStart);
    const end = new Date(customDateEnd);
    end.setHours(23, 59, 59, 999);
    return date >= start && date <= end;
  }

  if (customDateStart) {
    return date >= new Date(customDateStart);
  }

  if (customDateEnd) {
    const end = new Date(customDateEnd);
    end.setHours(23, 59, 59, 999);
    return date <= end;
  }

  return true;
};

// JSX
<div className="grid grid-cols-2 gap-3">
  <div>
    <label className="text-gray-500 text-xs mb-1 block">Data Inicial</label>
    <input
      type="date"
      value={customDateStart}
      onChange={(e) => setCustomDateStart(e.target.value)}
      className="w-full bg-gray-700 text-white rounded-lg px-3 py-2"
    />
  </div>
  <div>
    <label className="text-gray-500 text-xs mb-1 block">Data Final</label>
    <input
      type="date"
      value={customDateEnd}
      onChange={(e) => setCustomDateEnd(e.target.value)}
      className="w-full bg-gray-700 text-white rounded-lg px-3 py-2"
    />
  </div>
</div>
```

---

## 7. useMemo Filtered List

```typescript
const filteredItems = useMemo(() => {
  return items.filter((item) => {
    // Text search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const text = item.name?.toLowerCase() || '';
      if (!text.includes(query)) return false;
    }

    // Multi-select filter
    if (selectedCategories.length > 0) {
      if (!selectedCategories.includes(item.category)) return false;
    }

    // Range filter
    if (item.value < minValue) return false;

    // Date filter
    if (item.date && !isInDateRange(item.date)) return false;

    return true;
  });
}, [
  items,
  searchQuery,
  selectedCategories,
  minValue,
  dateFilter
]);
```

---

## 8. Clear All Filters Function

```typescript
const clearAllFilters = () => {
  // Text search
  setSearchInput('');
  setSearchQuery('');

  // Multi-selects
  setSelectedCategories([]);
  setSelectedTags([]);

  // Date filters
  setDateFilter('todos');
  setCustomDateStart('');
  setCustomDateEnd('');

  // Range filters
  setMinValue(0);
  setMaxValue(100);

  // Checkboxes
  setOnlyFavorites(false);
};

// JSX
{hasActiveFilters && (
  <button
    onClick={clearAllFilters}
    className="text-sm text-purple-400 hover:text-purple-300"
  >
    Limpar Todos os Filtros
  </button>
)}
```

---

## 9. Active Filters Checker

```typescript
const hasActiveFilters =
  searchQuery ||
  selectedCategories.length > 0 ||
  selectedTags.length > 0 ||
  dateFilter !== 'todos' ||
  customDateStart ||
  customDateEnd ||
  minValue > 0 ||
  maxValue < 100 ||
  onlyFavorites;

// Count active filters
const activeFiltersCount = [
  searchQuery && 'search',
  selectedCategories.length > 0 && `${selectedCategories.length} categoria(s)`,
  selectedTags.length > 0 && `${selectedTags.length} tag(s)`,
  dateFilter !== 'todos' && 'data',
  minValue > 0 && 'mínimo',
  maxValue < 100 && 'máximo',
  onlyFavorites && 'favoritos'
].filter(Boolean).length;
```

---

## 10. Suspense Wrapper Pattern

```typescript
import { Suspense } from 'react';

function PageContent() {
  const searchParams = useSearchParams(); // Requires Suspense!

  return (
    <div>
      {/* Your content */}
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-white text-xl">Carregando...</div>
        </div>
      </div>
    }>
      <PageContent />
    </Suspense>
  );
}
```

---

## 11. Results Counter Component

```typescript
interface CounterProps {
  filtered: number;
  total: number;
  hasActiveFilters: boolean;
  activeFiltersCount: number;
}

function ResultsCounter({ filtered, total, hasActiveFilters, activeFiltersCount }: CounterProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="text-gray-400 text-sm">
        <span className="text-purple-400 font-semibold text-lg">{filtered}</span>
        {' '}items encontrados de{' '}
        <span className="text-white font-semibold">{total}</span> no total
      </div>
      {hasActiveFilters && (
        <div className="flex items-center gap-2 text-xs">
          <span className="bg-purple-600 text-white px-2 py-1 rounded">
            {activeFiltersCount} filtro(s) ativo(s)
          </span>
        </div>
      )}
    </div>
  );
}
```

---

## 12. Sticky Filter Bar

```typescript
// Component structure
<div className="bg-gray-800 rounded-xl p-4 md:p-6 mb-6 sticky top-4 z-10">
  <div className="flex items-center justify-between mb-4">
    <h2 className="text-white font-semibold flex items-center gap-2">
      <span>🔍</span>
      Filtros
    </h2>
    {hasActiveFilters && (
      <button onClick={clearAllFilters}>
        Limpar Filtros
      </button>
    )}
  </div>

  {/* Filter content */}
</div>
```

---

## 13. Responsive Grid Layout

```typescript
// Formatos (2-3 columns)
<div className="grid grid-cols-2 md:grid-cols-3 gap-2">
  {/* Checkbox items */}
</div>

// Status (2-4 columns)
<div className="grid grid-cols-2 md:grid-cols-4 gap-2">
  {/* Checkbox items */}
</div>

// Procedimentos (1-3 columns)
<div className="grid grid-cols-1 md:grid-cols-3 gap-2">
  {/* Checkbox items */}
</div>
```

---

## 14. Clear Button with Icon

```typescript
{searchInput && (
  <button
    onClick={() => {
      setSearchInput('');
      setSearchQuery('');
    }}
    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
    aria-label="Limpar busca"
  >
    ✕
  </button>
)}
```

---

## 15. TypeScript Types

```typescript
// Filter types
type DateFilter = 'todos' | 'hoje' | 'semana' | 'mes' | 'customizado';
type Category = 'cat1' | 'cat2' | 'cat3';

// State types
interface FilterState {
  searchQuery: string;
  selectedCategories: Category[];
  dateFilter: DateFilter;
  customDateStart: string;
  customDateEnd: string;
  minValue: number;
  maxValue: number;
}

// Props types
interface FilterBarProps {
  onFilterChange: (filters: FilterState) => void;
  initialFilters?: Partial<FilterState>;
}
```

---

## 16. URL Params to State Parser

```typescript
function parseFiltersFromURL(searchParams: URLSearchParams): FilterState {
  return {
    searchQuery: searchParams.get('q') || '',
    selectedCategories: searchParams.get('categories')?.split(',').filter(Boolean) || [],
    dateFilter: (searchParams.get('dateFilter') as DateFilter) || 'todos',
    customDateStart: searchParams.get('dateStart') || '',
    customDateEnd: searchParams.get('dateEnd') || '',
    minValue: Number(searchParams.get('min') || 0),
    maxValue: Number(searchParams.get('max') || 100)
  };
}
```

---

## Uso dos Snippets

Copie e adapte estes snippets para:
- Outras páginas do sistema
- Novos componentes de filtro
- Features similares em outros projetos

Todos os exemplos são testados e funcionam no Daily Prophet Gamified!

---

**Nota**: Estes exemplos usam Tailwind CSS para estilização. Adapte as classes conforme seu framework CSS.
