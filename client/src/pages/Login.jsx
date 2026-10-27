import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getErrorMessage } from '../services/api';
import Alert from '../components/Alert';
import PasswordInput from '../components/PasswordInput';
import { isValidEmail } from '../utils/helpers';

function Login() {
  const { user, login } = useAuth();
  const navigate = useNavigate();

  const [values, setValues] = useState({ email: '', password: '' });
  const [emailError, setEmailError] = useState('');
  const [serverError, setServerError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (user) return <Navigate to="/dashboard" replace />;

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
    if (e.target.name === 'email') setEmailError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');

    if (!values.email.trim() || !values.password) {
      setServerError('Please enter your email and password');
      return;
    }
    if (!isValidEmail(values.email)) {
      setEmailError('Enter a valid email address, e.g. you@college.edu');
      return;
    }

    setSubmitting(true);
    try {
      await login(values.email.trim(), values.password);
      navigate('/dashboard');
    } catch (error) {
      setServerError(getErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-md px-4 py-12">
      <h1 className="text-2xl font-bold text-slate-900">Welcome back</h1>
      <p className="mt-1 text-sm text-slate-600">Log in to report or find items.</p>

      <form onSubmit={handleSubmit} className="card mt-6 space-y-4 p-6" noValidate>
        <Alert type="error" message={serverError} />

        <div>
          <label htmlFor="email" className="label">College email</label>
          <input id="email" name="email" type="email" className="input" placeholder="you@college.edu" value={values.email} onChange={handleChange} />
          {emailError && <p className="mt-1 text-sm text-red-600">{emailError}</p>}
        </div>

        <div>
          <label htmlFor="password" className="label">Password</label>
          <PasswordInput id="password" name="password" placeholder="Your password" autoComplete="current-password" value={values.password} onChange={handleChange} />
        </div>

        <button type="submit" className="btn btn-primary w-full" disabled={submitting}>
          {submitting && <Loader2 size={16} className="animate-spin" />}
          {submitting ? 'Logging in...' : 'Log in'}
        </button>
      </form>

      <p className="mt-5 text-center text-sm text-slate-600">
        New here?{' '}
        <Link to="/register" className="font-semibold text-indigo-600 hover:text-indigo-800">Create an account</Link>
      </p>
    </div>
  );
}

export default Login;
