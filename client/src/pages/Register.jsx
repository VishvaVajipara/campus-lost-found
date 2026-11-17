import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getErrorMessage } from '../services/api';
import Alert from '../components/Alert';

function Register() {
  const { user, register } = useAuth();
  const navigate = useNavigate();

  const [values, setValues] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Already logged in? Go straight to the dashboard
  if (user) return <Navigate to="/dashboard" replace />;

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const validate = () => {
    const newErrors = {};
    if (values.name.trim().length < 2) newErrors.name = 'Name must be at least 2 characters';
    if (!/^\S+@\S+\.\S+$/.test(values.email)) newErrors.email = 'Enter a valid email address';
    if (values.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (values.confirmPassword !== values.password) newErrors.confirmPassword = 'Passwords do not match';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');

    const newErrors = validate();
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setSubmitting(true);
    try {
      await register(values);
      navigate('/dashboard');
    } catch (error) {
      setServerError(getErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-md px-4 py-12">
      <h1 className="text-2xl font-bold text-slate-900">Create your account</h1>
      <p className="mt-1 text-sm text-slate-600">Use your college email so other students can trust your reports.</p>

      <form onSubmit={handleSubmit} className="card mt-6 space-y-4 p-6" noValidate>
        <Alert type="error" message={serverError} />

        <div>
          <label htmlFor="name" className="label">Full name</label>
          <input id="name" name="name" className="input" placeholder="Your full name" value={values.name} onChange={handleChange} />
          {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
        </div>

        <div>
          <label htmlFor="email" className="label">College email</label>
          <input id="email" name="email" type="email" className="input" placeholder="you@college.edu" value={values.email} onChange={handleChange} />
          {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
        </div>

        <div>
          <label htmlFor="password" className="label">Password</label>
          <input id="password" name="password" type="password" className="input" placeholder="At least 6 characters" value={values.password} onChange={handleChange} />
          {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
        </div>

        <div>
          <label htmlFor="confirmPassword" className="label">Confirm password</label>
          <input id="confirmPassword" name="confirmPassword" type="password" className="input" placeholder="Type the password again" value={values.confirmPassword} onChange={handleChange} />
          {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
        </div>

        <button type="submit" className="btn btn-primary w-full" disabled={submitting}>
          {submitting && <Loader2 size={16} className="animate-spin" />}
          {submitting ? 'Creating account...' : 'Create account'}
        </button>
      </form>

      <p className="mt-5 text-center text-sm text-slate-600">
        Already have an account?{' '}
        <Link to="/login" className="font-semibold text-indigo-600 hover:text-indigo-800">Log in</Link>
      </p>
    </div>
  );
}

export default Register;
