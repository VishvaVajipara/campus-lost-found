import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Tag, MapPin, Calendar, User, Mail, Phone } from 'lucide-react';
import { fetchItemById } from '../services/itemService';
import { getErrorMessage } from '../services/api';
import { formatDate, isValidEmail } from '../utils/helpers';
import { TypeBadge, StatusBadge } from '../components/Badges';
import Loading from '../components/Loading';
import Alert from '../components/Alert';

// One row in the details list
function DetailRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3">
      <Icon size={18} className="mt-0.5 shrink-0 text-slate-400" />
      <div>
        <p className="text-xs text-slate-500">{label}</p>
        <p className="text-sm font-medium text-slate-900">{value}</p>
      </div>
    </div>
  );
}

function ItemDetails() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadItem = async () => {
      try {
        setItem(await fetchItemById(id));
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };
    loadItem();
  }, [id]);

  if (loading) return <Loading text="Loading item..." />;

  // Decide which contact button to show
  // Same rule as the form: anything that is not a valid email is treated as a phone number
  const isEmail = item && isValidEmail(item.contactInfo);
  const isPhone = item && !isEmail && /^\+?[\d\s()-]+$/.test(item.contactInfo);

  return (
    <div className="page max-w-3xl">
      <Link to="/items" className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-slate-900">
        <ArrowLeft size={16} /> Back to browse
      </Link>

      {error && <Alert type="error" message={error} />}

      {item && (
        <div className="card p-6 sm:p-8">
          {item.image && (
            <img src={item.image} alt={item.title} className="mb-6 max-h-96 w-full rounded-xl bg-slate-50 object-contain" />
          )}
          <div className="flex flex-wrap items-center gap-2">
            <TypeBadge type={item.type} />
            <StatusBadge status={item.status} />
          </div>

          <h1 className="mt-3 text-2xl font-bold text-slate-900">{item.title}</h1>

          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <DetailRow icon={Tag} label="Category" value={item.category} />
            <DetailRow icon={MapPin} label={item.type === 'lost' ? 'Lost at' : 'Found at'} value={item.location} />
            <DetailRow icon={Calendar} label={item.type === 'lost' ? 'Date lost' : 'Date found'} value={formatDate(item.date)} />
            <DetailRow icon={User} label="Posted by" value={item.user?.name || 'Unknown student'} />
          </div>

          <div className="mt-6 border-t border-slate-100 pt-6">
            <h2 className="text-sm font-semibold text-slate-900">Description</h2>
            <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-slate-600">{item.description}</p>
          </div>

          <div className="mt-6 rounded-xl bg-indigo-50 p-5">
            <h2 className="text-sm font-semibold text-indigo-900">Contact</h2>
            <p className="mt-1 break-words text-sm text-indigo-800">{item.contactInfo}</p>

            {isEmail && (
              <a
                className="btn btn-primary mt-4"
                href={`mailto:${item.contactInfo}?subject=${encodeURIComponent(`Regarding your ${item.type} item: ${item.title}`)}`}
              >
                <Mail size={16} /> Send email
              </a>
            )}
            {!isEmail && isPhone && (
              <a className="btn btn-primary mt-4" href={`tel:${item.contactInfo.replace(/[^\d+]/g, '')}`}>
                <Phone size={16} /> Call
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default ItemDetails;
