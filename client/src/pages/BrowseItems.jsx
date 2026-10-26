import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, SearchX } from 'lucide-react';
import { fetchItems } from '../services/itemService';
import { getErrorMessage } from '../services/api';
import { DEFAULT_FILTERS } from '../utils/helpers';
import ItemCard from '../components/ItemCard';
import ItemFilters from '../components/ItemFilters';
import Loading from '../components/Loading';
import EmptyState from '../components/EmptyState';
import Alert from '../components/Alert';

function BrowseItems() {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [page, setPage] = useState(1);
  const [result, setResult] = useState({ items: [], totalPages: 1, totalItems: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch items whenever a filter or the page number changes.
  // The 300ms timer waits until the user stops typing before calling the server.
  useEffect(() => {
    let ignore = false; // prevents an old, slow response from overwriting a newer one
    setLoading(true);

    const timer = setTimeout(async () => {
      try {
        const data = await fetchItems({ ...filters, page });
        if (!ignore) {
          setResult(data);
          setError('');
        }
      } catch (err) {
        if (!ignore) setError(getErrorMessage(err));
      } finally {
        if (!ignore) setLoading(false);
      }
    }, 300);

    return () => {
      ignore = true;
      clearTimeout(timer);
    };
  }, [filters, page]);

  // Change one filter and go back to page 1
  const handleFilterChange = (name, value) => {
    setFilters({ ...filters, [name]: value });
    setPage(1);
  };

  const handleClear = () => {
    setFilters(DEFAULT_FILTERS);
    setPage(1);
  };

  return (
    <div className="page">
      <h1 className="text-2xl font-bold text-slate-900">Browse items</h1>
      <p className="text-sm text-slate-600">Search the lost and found reports posted by students.</p>

      <div className="mt-6">
        <ItemFilters filters={filters} onChange={handleFilterChange} onClear={handleClear} />
      </div>

      <div className="mt-6">
        {error && <Alert type="error" message={error} />}

        {loading ? (
          <Loading text="Loading items..." />
        ) : !error && result.items.length === 0 ? (
          <EmptyState
            icon={SearchX}
            title="No items found"
            message="Try different words or clear the filters. You can also post a report yourself."
            action={<Link to="/report/lost" className="btn btn-primary">Report an item</Link>}
          />
        ) : (
          <>
            <p className="mb-3 text-sm text-slate-500">{result.totalItems} item(s) found</p>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {result.items.map((item) => (
                <ItemCard key={item._id} item={item} />
              ))}
            </div>

            {result.totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-4">
                <button className="btn btn-secondary" disabled={page <= 1} onClick={() => setPage(page - 1)}>
                  <ChevronLeft size={16} /> Previous
                </button>
                <span className="text-sm text-slate-600">Page {page} of {result.totalPages}</span>
                <button className="btn btn-secondary" disabled={page >= result.totalPages} onClick={() => setPage(page + 1)}>
                  Next <ChevronRight size={16} />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default BrowseItems;
