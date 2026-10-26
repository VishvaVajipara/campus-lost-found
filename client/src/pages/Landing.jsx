import { Link } from 'react-router-dom';
import { ClipboardList, Search, PackageCheck, PackageSearch } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const STEPS = [
  {
    icon: ClipboardList,
    title: 'Post a report',
    text: 'Lost something or found something? Describe it and say where and when.',
  },
  {
    icon: Search,
    title: 'Search the listings',
    text: 'Browse by category or location to see if someone has already reported it.',
  },
  {
    icon: PackageCheck,
    title: 'Get in touch and resolve',
    text: 'Use the contact details on the report, then mark it as resolved once it is returned.',
  },
];

function Landing() {
  const { user } = useAuth();

  return (
    <div>
      {/* Hero */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
          <h1 className="max-w-2xl text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
            Lost something on campus? Someone may have already found it.
          </h1>
          <p className="mt-5 max-w-xl text-lg text-slate-600">
            Campus Lost &amp; Found is a place for students to report missing belongings, list items they have found, and get them back to their owners.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            {user ? (
              <>
                <Link to="/dashboard" className="btn btn-primary">Go to dashboard</Link>
                <Link to="/items" className="btn btn-secondary">Browse items</Link>
              </>
            ) : (
              <>
                <Link to="/register" className="btn btn-primary">Create a free account</Link>
                <Link to="/login" className="btn btn-secondary">Log in</Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* How it works: these really are steps in order */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <h2 className="text-2xl font-bold text-slate-900">How it works</h2>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {STEPS.map((step) => (
            <div key={step.title} className="card p-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                <step.icon size={22} />
              </div>
              <h3 className="mt-4 font-semibold text-slate-900">{step.title}</h3>
              <p className="mt-1.5 text-sm text-slate-600">{step.text}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap gap-3">
          <Link to={user ? '/report/lost' : '/register'} className="btn btn-secondary">
            <PackageSearch size={17} /> I lost something
          </Link>
          <Link to={user ? '/report/found' : '/register'} className="btn btn-secondary">
            <PackageCheck size={17} /> I found something
          </Link>
        </div>
      </section>
    </div>
  );
}

export default Landing;
