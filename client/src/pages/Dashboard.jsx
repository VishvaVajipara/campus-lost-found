import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PackageSearch, PackageCheck, CheckCircle2, Plus, Inbox } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { fetchDashboardStats } from '../services/itemService';
import { getErrorMessage } from '../services/api';
import ItemCard from '../components/ItemCard';
import Loading from '../components/Loading';
import EmptyState from '../components/EmptyState';
import Alert from '../components/Alert';

// One number card (Lost / Found / Resolved)
function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className="card flex items-center gap-4 p-5">
      <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${color}`}>
        <Icon size={24} />
      </div>
      <div>
        <p className="text-3xl font-bold text-slate-900">{value}</p>
        <p className="text-sm text-slate-500">{label}</p>
      </div>
    </div>
  );
}

function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Load the numbers from the backend when the page opens
  useEffect(() => {
    const loadStats = async () => {
      try {
        setStats(await fetchDashboardStats());
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, []);

  return (
    <div className="page">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Hello, {user.name.split(' ')[0]}</h1>
          <p className="text-sm text-slate-600">Here is what is happening on campus.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link to="/report/lost" className="btn btn-primary"><Plus size={16} /> Report lost item</Link>
          <Link to="/report/found" className="btn btn-secondary"><Plus size={16} /> Report found item</Link>
        </div>
      </div>

      {loading && <Loading text="Loading dashboard..." />}

      {error && <div className="mt-6"><Alert type="error" message={error} /></div>}

      {stats && (
        <>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <StatCard icon={PackageSearch} label="Lost items (active)" value={stats.totalLost} color="bg-rose-50 text-rose-600" />
            <StatCard icon={PackageCheck} label="Found items (active)" value={stats.totalFound} color="bg-emerald-50 text-emerald-600" />
            <StatCard icon={CheckCircle2} label="Resolved items" value={stats.totalResolved} color="bg-indigo-50 text-indigo-600" />
          </div>

          <div className="mt-10 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">Recently posted</h2>
            <Link to="/items" className="text-sm font-semibold text-indigo-600 hover:text-indigo-800">View all</Link>
          </div>

          <div className="mt-4">
            {stats.recentItems.length === 0 ? (
              <EmptyState
                icon={Inbox}
                title="No reports yet"
                message="Be the first to post a lost or found item."
                action={<Link to="/report/lost" className="btn btn-primary">Report an item</Link>}
              />
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {stats.recentItems.map((item) => (
                  <ItemCard key={item._id} item={item} />
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default Dashboard;
