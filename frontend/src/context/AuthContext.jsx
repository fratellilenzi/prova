import { createContext, useContext, useMemo, useState } from 'react';
import { api, setAuthToken } from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    if (token) {
      setAuthToken(token);
    }
    return {
      token,
      user: user ? JSON.parse(user) : null
    };
  });

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    setSession(data.token, data.user);
  };

  const register = async (nome, email, password) => {
    const { data } = await api.post('/auth/register', { nome, email, password });
    setSession(data.token, data.user);
  };

  const logout = () => {
    setSession(null, null);
  };

  function setSession(token, user) {
    if (token) {
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    setAuthToken(token);
    setAuth({ token, user });
  }

  const value = useMemo(
    () => ({
      token: auth.token,
      user: auth.user,
      isAuthenticated: Boolean(auth.token),
      login,
      register,
      logout
    }),
    [auth]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
