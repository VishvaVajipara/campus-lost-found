import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createItem } from '../services/itemService';
import { getErrorMessage } from '../services/api';
import ItemForm from '../components/ItemForm';

// One page used for both /report/lost and /report/found. The "type" prop decides which.
function ReportItem({ type }) {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const isLost = type === 'lost';

  const handleSubmit = async (values) => {
    setSubmitting(true);
    setError('');
    try {
      await createItem({ ...values, type });
      navigate('/my-reports', { state: { message: 'Your report has been posted.' } });
    } catch (err) {
      setError(getErrorMessage(err));
      setSubmitting(false);
    }
  };

  return (
    <div className="page max-w-2xl">
      <h1 className="text-2xl font-bold text-slate-900">{isLost ? 'Report a lost item' : 'Report a found item'}</h1>
      <p className="mb-6 text-sm text-slate-600">
        {isLost
          ? 'Tell us what you lost. Other students will be able to find your report and contact you.'
          : 'Tell us what you found. The owner will be able to find your report and contact you.'}
      </p>

      {/* key makes React reset the form when switching between lost and found */}
      <ItemForm key={type} type={type} submitLabel="Post report" submitting={submitting} error={error} onSubmit={handleSubmit} />
    </div>
  );
}

export default ReportItem;
