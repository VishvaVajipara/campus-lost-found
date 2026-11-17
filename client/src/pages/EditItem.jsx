import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { fetchItemById, updateItem } from '../services/itemService';
import { getErrorMessage } from '../services/api';
import { dateToInputValue } from '../utils/helpers';
import ItemForm from '../components/ItemForm';
import Loading from '../components/Loading';
import Alert from '../components/Alert';

function EditItem() {
  const { id } = useParams(); // the :id from the URL
  const { user } = useAuth();
  const navigate = useNavigate();

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    const loadItem = async () => {
      try {
        setItem(await fetchItemById(id));
      } catch (err) {
        setLoadError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };
    loadItem();
  }, [id]);

  const handleSubmit = async (values) => {
    setSubmitting(true);
    setSubmitError('');
    try {
      await updateItem(id, { ...values, type: item.type });
      navigate('/my-reports', { state: { message: 'Your report has been updated.' } });
    } catch (err) {
      setSubmitError(getErrorMessage(err));
      setSubmitting(false);
    }
  };

  if (loading) return <Loading text="Loading report..." />;

  // The server also blocks this, but we hide the form for other users too
  const isOwner = item && item.user?._id === user.id;

  return (
    <div className="page max-w-2xl">
      <Link to="/my-reports" className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-slate-900">
        <ArrowLeft size={16} /> Back to my reports
      </Link>

      {loadError && <Alert type="error" message={loadError} />}

      {item && !isOwner && <Alert type="error" message="You can only edit your own reports." />}

      {item && isOwner && (
        <>
          <h1 className="mb-6 text-2xl font-bold text-slate-900">Edit {item.type} report</h1>
          <ItemForm
            type={item.type}
            initialValues={{
              title: item.title,
              category: item.category,
              description: item.description,
              location: item.location,
              date: dateToInputValue(item.date),
              contactInfo: item.contactInfo,
            }}
            submitLabel="Save changes"
            submitting={submitting}
            error={submitError}
            onSubmit={handleSubmit}
          />
        </>
      )}
    </div>
  );
}

export default EditItem;
