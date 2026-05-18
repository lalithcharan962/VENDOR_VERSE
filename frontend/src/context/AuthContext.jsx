import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [authData, setAuthData] = useState(() => {
    const stored = localStorage.getItem('vendorverse_auth');
    return stored ? JSON.parse(stored) : { user: null, token: null };
  });

  useEffect(() => {
    if (authData?.user && authData?.token) {
      localStorage.setItem('vendorverse_auth', JSON.stringify(authData));
    } else {
      localStorage.removeItem('vendorverse_auth');
    }
  }, [authData]);

  const login = (data) => setAuthData({ user: data.user, token: data.token });
  const logout = () => setAuthData({ user: null, token: null });

  return (
    <AuthContext.Provider value={{ user: authData.user, token: authData.token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
