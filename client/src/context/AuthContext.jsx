import { createContext, useContext, useEffect, useState } from 'react';
import api from '../services/api';

// Context lets any component read the logged-in user without passing props down
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  // "loading" is true while we check whether a saved token is still valid
  const [loading, setLoading] = useState(true);

  // Runs once when the app starts (and after every page refresh)
  useEffect(() => {
    const restoreLogin = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const { data } = await api.get('/auth/me');
        setUser(data.user);
      } catch (error) {
        // Remove the token only if the server says it is invalid or expired
        if (error.response && error.response.status === 401) {
          localStorage.removeItem('token');
        }
      } finally {
        setLoading(false);
      }
    };
    restoreLogin();
  }, []);

  // Saves the token in the browser and the user in React state
  const saveLogin = (data) => {
    localStorage.setItem('token', data.token);
    setUser(data.user);
  };

  const register = async (formData) => {
    const { data } = await api.post('/auth/register', formData);
    saveLogin(data);
  };

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    saveLogin(data);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Shortcut hook: const { user, login } = useAuth();
export const useAuth = () => useContext(AuthContext);
