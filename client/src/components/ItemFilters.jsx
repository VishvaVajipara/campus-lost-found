import { Search, X } from 'lucide-react';
import { CATEGORIES, DEFAULT_FILTERS } from '../utils/helpers';

const TYPE_TABS = [
  { value: '', label: 'All items' },
  { value: 'lost', label: 'Lost' },
  { value: 'found', label: 'Found' },
];

// Search box, filters and sorting for the Browse page.
// onChange(name, value) tells the parent which filter changed.
function ItemFilters({ filters, onChange, onClear }) {
  const hasActiveFilters = Object.keys(DEFAULT_FILTERS).some((key) => filters[key] !== DEFAULT_FILTERS[key]);

  return (
    <div className="card space-y-4 p-4 sm:p-5">
      {/* Lost / Found tabs */}
      <div className="inline-flex rounded-lg bg-slate-100 p-1">
        {TYPE_TABS.map((tab) => (
          <button
            key={tab.value}
            type="button"
            onClick={() => onChange('type', tab.value)}
            className={`rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${
              filters.type === tab.value ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <div className="relative sm:col-span-2 lg:col-span-2">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            className="input pl-9"
            placeholder="Search by item name"
            aria-label="Search by item name"
            value={filters.search}
            onChange={(e) => onChange('search', e.target.value)}
          />
        </div>

        <select className="input" aria-label="Category" value={filters.category} onChange={(e) => onChange('category', e.target.value)}>
          <option value="">All categories</option>
          {CATEGORIES.map((category) => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>

        <input
          type="text"
          className="input"
          placeholder="Location, e.g. Library"
          aria-label="Filter by location"
          value={filters.location}
          onChange={(e) => onChange('location', e.target.value)}
        />

        <select className="input" aria-label="Status" value={filters.status} onChange={(e) => onChange('status', e.target.value)}>
          <option value="active">Active only</option>
          <option value="resolved">Resolved only</option>
          <option value="all">Active and resolved</option>
        </select>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <select className="input w-auto" aria-label="Sort order" value={filters.sort} onChange={(e) => onChange('sort', e.target.value)}>
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
        </select>

        {hasActiveFilters && (
          <button type="button" onClick={onClear} className="inline-flex items-center gap-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-800">
            <X size={15} /> Clear filters
          </button>
        )}
      </div>
    </div>
  );
}

export default ItemFilters;
