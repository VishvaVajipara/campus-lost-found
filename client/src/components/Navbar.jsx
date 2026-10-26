import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Search, Menu, X, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false); // mobile menu

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate('/');
  };

  const closeMenu = () => setMenuOpen(false);

  // NavLink gives us "isActive" so we can highlight the current page
  const linkClass = ({ isActive }) =>
    `rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
      isActive ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
    }`;

  const loggedInLinks = [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/items', label: 'Browse' },
    { to: '/my-reports', label: 'My reports' },
    { to: '/report/lost', label: 'Report lost' },
    { to: '/report/found', label: 'Report found' },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link to={user ? '/dashboard' : '/'} className="flex items-center gap-2 font-bold text-slate-900" onClick={closeMenu}>
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
            <Search size={17} />
          </span>
          Campus Lost &amp; Found
        </Link>

        {/* Desktop menu */}
        <nav className="hidden items-center gap-1 lg:flex">
          {user ? (
            <>
              {loggedInLinks.map((link) => (
                <NavLink key={link.to} to={link.to} className={linkClass}>
                  {link.label}
                </NavLink>
              ))}
              <span className="mx-2 h-6 w-px bg-slate-200" />
              <span className="text-sm text-slate-600">{user.name.split(' ')[0]}</span>
              <button onClick={handleLogout} className="btn btn-secondary ml-2 px-3 py-2">
                <LogOut size={15} /> Log out
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={linkClass}>Log in</NavLink>
              <Link to="/register" className="btn btn-primary ml-2 px-4 py-2">Sign up</Link>
            </>
          )}
        </nav>

        {/* Mobile menu button */}
        <button
          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu panel */}
      {menuOpen && (
        <nav className="flex flex-col gap-1 border-t border-slate-100 bg-white px-4 py-3 lg:hidden">
          {user ? (
            <>
              <p className="px-3 py-1 text-sm text-slate-500">Signed in as {user.name}</p>
              {loggedInLinks.map((link) => (
                <NavLink key={link.to} to={link.to} className={linkClass} onClick={closeMenu}>
                  {link.label}
                </NavLink>
              ))}
              <button onClick={handleLogout} className="btn btn-secondary mt-2">
                <LogOut size={15} /> Log out
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={linkClass} onClick={closeMenu}>Log in</NavLink>
              <Link to="/register" className="btn btn-primary mt-1" onClick={closeMenu}>Sign up</Link>
            </>
          )}
        </nav>
      )}
    </header>
  );
}

export default Navbar;
