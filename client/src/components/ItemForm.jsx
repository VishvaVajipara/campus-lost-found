import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import Alert from './Alert';
import { CATEGORIES, todayInputValue } from '../utils/helpers';

const EMPTY_VALUES = {
  title: '',
  category: '',
  description: '',
  location: '',
  date: '',
  contactInfo: '',
};

// Small helper: label + input + error text
function Field({ label, htmlFor, error, children }) {
  return (
    <div>
      <label htmlFor={htmlFor} className="label">{label}</label>
      {children}
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}

// One form used for: report lost, report found, and edit report.
// type = "lost" or "found". onSubmit receives the form values.
function ItemForm({ type, initialValues, submitLabel, submitting, error, onSubmit }) {
  const [values, setValues] = useState(initialValues || EMPTY_VALUES);
  const [errors, setErrors] = useState({});

  const isLost = type === 'lost';

  // Update one field as the user types, and clear that field's error
  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
    setErrors({ ...errors, [name]: '' });
  };

  // Check the form before sending it to the server
  const validate = () => {
    const newErrors = {};
    if (!values.title.trim()) newErrors.title = 'Please enter the item name';
    if (!values.category) newErrors.category = 'Please choose a category';
    if (!values.description.trim()) newErrors.description = 'Please describe the item';
    if (!values.location.trim()) newErrors.location = 'Please enter the location';
    if (!values.date) newErrors.date = 'Please choose a date';
    else if (values.date > todayInputValue()) newErrors.date = 'The date cannot be in the future';
    if (!values.contactInfo.trim()) newErrors.contactInfo = 'Please enter how people can reach you';
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // stop the browser from reloading the page
    const newErrors = validate();
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      onSubmit(values);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card space-y-5 p-6 sm:p-8" noValidate>
      <Alert type="error" message={error} />

      <Field label="Item name" htmlFor="title" error={errors.title}>
        <input id="title" name="title" className="input" maxLength={80} placeholder="e.g. Blue college ID card" value={values.title} onChange={handleChange} />
      </Field>

      <Field label="Category" htmlFor="category" error={errors.category}>
        <select id="category" name="category" className="input" value={values.category} onChange={handleChange}>
          <option value="">Select a category</option>
          {CATEGORIES.map((category) => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </Field>

      <Field label="Description" htmlFor="description" error={errors.description}>
        <textarea
          id="description"
          name="description"
          rows={4}
          maxLength={1000}
          className="input"
          placeholder="Colour, brand, marks or anything that helps identify the item"
          value={values.description}
          onChange={handleChange}
        />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label={isLost ? 'Where did you lose it?' : 'Where did you find it?'} htmlFor="location" error={errors.location}>
          <input id="location" name="location" className="input" maxLength={100} placeholder="e.g. Central library, 2nd floor" value={values.location} onChange={handleChange} />
        </Field>

        <Field label={isLost ? 'Date lost' : 'Date found'} htmlFor="date" error={errors.date}>
          <input id="date" name="date" type="date" max={todayInputValue()} className="input" value={values.date} onChange={handleChange} />
        </Field>
      </div>

      <Field label="Contact information" htmlFor="contactInfo" error={errors.contactInfo}>
        <input id="contactInfo" name="contactInfo" className="input" maxLength={100} placeholder="Your email or phone number" value={values.contactInfo} onChange={handleChange} />
      </Field>

      <button type="submit" className="btn btn-primary w-full sm:w-auto" disabled={submitting}>
        {submitting && <Loader2 size={16} className="animate-spin" />}
        {submitting ? 'Saving...' : submitLabel}
      </button>
    </form>
  );
}

export default ItemForm;
