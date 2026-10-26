import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div className="mx-auto max-w-md px-4 py-24 text-center">
      <p className="text-5xl font-extrabold text-indigo-600">404</p>
      <h1 className="mt-4 text-xl font-bold text-slate-900">Page not found</h1>
      <p className="mt-2 text-sm text-slate-600">The page you are looking for does not exist or has been moved.</p>
      <Link to="/" className="btn btn-primary mt-6">Go to home</Link>
    </div>
  );
}

export default NotFound;
