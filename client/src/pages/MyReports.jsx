import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CheckCircle2, Pencil, Trash2, Undo2, Inbox, Plus } from 'lucide-react';
import { fetchMyItems, updateItemStatus, deleteItem } from '../services/itemService';
import { getErrorMessage } from '../services/api';
import ItemCard from '../components/ItemCard';
import Loading from '../components/Loading';
import EmptyState from '../components/EmptyState';
import ConfirmDialog from '../components/ConfirmDialog';
import Alert from '../components/Alert';

const TABS = [
  { value: 'all', label: 'All' },
  { value: 'lost', label: 'Lost' },
  { value: 'found', label: 'Found' },
  { value: 'resolved', label: 'Resolved' },
];

function MyReports() {
  const location = useLocation();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('all');
  const [message, setMessage] = useState(location.state?.message || ''); // message sent from another page
  const [error, setError] = useState('');
  const [busyId, setBusyId] = useState(null); // id of the item currently being updated
  const [itemToDelete, setItemToDelete] = useState(null); // item waiting for delete confirmation

  useEffect(() => {
    const loadItems = async () => {
      try {
        setItems(await fetchMyItems());
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };
    loadItems();
  }, []);

  // Switch between "active" and "resolved"
  const handleToggleStatus = async (item) => {
    const newStatus = item.status === 'resolved' ? 'active' : 'resolved';
    setBusyId(item._id);
    setMessage('');
    setError('');
    try {
      const updated = await updateItemStatus(item._id, newStatus);
      // Replace the old item in the list with the updated one
      setItems(items.map((current) => (current._id === updated._id ? updated : current)));
      setMessage(newStatus === 'resolved' ? 'Marked as resolved.' : 'Report reopened.');
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setBusyId(null);
    }
  };

  const handleConfirmDelete = async () => {
    setBusyId(itemToDelete._id);
    setMessage('');
    setError('');
    try {
      await deleteItem(itemToDelete._id);
      setItems(items.filter((current) => current._id !== itemToDelete._id));
      setMessage('Report deleted.');
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setBusyId(null);
      setItemToDelete(null);
    }
  };

  // Apply the selected tab
  const visibleItems = items.filter((item) => {
    if (tab === 'lost') return item.type === 'lost';
    if (tab === 'found') return item.type === 'found';
    if (tab === 'resolved') return item.status === 'resolved';
    return true;
  });

  return (
    <div className="page">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My reports</h1>
          <p className="text-sm text-slate-600">Edit, resolve or delete the items you have posted.</p>
        </div>
        <div className="flex gap-3">
          <Link to="/report/lost" className="btn btn-primary"><Plus size={16} /> Lost</Link>
          <Link to="/report/found" className="btn btn-secondary"><Plus size={16} /> Found</Link>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        <Alert type="success" message={message} />
        <Alert type="error" message={error} />
      </div>

      {loading ? (
        <Loading text="Loading your reports..." />
      ) : items.length === 0 ? (
        <div className="mt-6">
          <EmptyState
            icon={Inbox}
            title="You have not posted anything yet"
            message="When you report a lost or found item it will appear here."
            action={<Link to="/report/lost" className="btn btn-primary">Report an item</Link>}
          />
        </div>
      ) : (
        <>
          <div className="mt-6 inline-flex rounded-lg bg-slate-100 p-1">
            {TABS.map((t) => (
              <button
                key={t.value}
                onClick={() => setTab(t.value)}
                className={`rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${
                  tab === t.value ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {visibleItems.length === 0 ? (
            <p className="mt-8 text-center text-sm text-slate-500">No reports in this tab.</p>
          ) : (
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {visibleItems.map((item) => (
                <ItemCard key={item._id} item={item}>
                  <div className="flex flex-wrap gap-2">
                    <button className="btn btn-secondary px-3 py-1.5" disabled={busyId === item._id} onClick={() => handleToggleStatus(item)}>
                      {item.status === 'resolved' ? <><Undo2 size={15} /> Reopen</> : <><CheckCircle2 size={15} /> Resolve</>}
                    </button>
                    <Link to={`/items/${item._id}/edit`} className="btn btn-secondary px-3 py-1.5">
                      <Pencil size={15} /> Edit
                    </Link>
                    <button className="btn btn-secondary px-3 py-1.5 text-red-600 hover:bg-red-50" disabled={busyId === item._id} onClick={() => setItemToDelete(item)}>
                      <Trash2 size={15} /> Delete
                    </button>
                  </div>
                </ItemCard>
              ))}
            </div>
          )}
        </>
      )}

      <ConfirmDialog
        open={itemToDelete !== null}
        title="Delete this report?"
        message={itemToDelete ? `"${itemToDelete.title}" will be permanently removed. This cannot be undone.` : ''}
        confirmLabel="Delete"
        loading={busyId !== null && itemToDelete !== null}
        onConfirm={handleConfirmDelete}
        onCancel={() => setItemToDelete(null)}
      />
    </div>
  );
}

export default MyReports;
