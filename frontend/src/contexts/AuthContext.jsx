import { createContext, useContext, useEffect, useState } from 'react';
import { api } from '../api/client.js';
const AuthContext = createContext(null);
export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user') || 'null'));
  const login = async (email, password) => { const { data } = await api.post('/auth/login', { email, password }); localStorage.setItem('token', data.token); localStorage.setItem('user', JSON.stringify(data.user)); setUser(data.user); };
  const register = async (payload) => api.post('/auth/register', payload);
  const updateProfile = async (fullName) => { const {data}=await api.put('/auth/profile',{fullName}); localStorage.setItem('user',JSON.stringify(data.user)); setUser(data.user); return data.user; };
  const logout = () => { localStorage.removeItem('token'); localStorage.removeItem('user'); setUser(null); };
  useEffect(() => { if (localStorage.getItem('token')) api.get('/auth/me').then(({ data }) => setUser(data.user)).catch(logout); }, []);
  return <AuthContext.Provider value={{ user, login, register, updateProfile, logout }}>{children}</AuthContext.Provider>;
}
export const useAuth = () => useContext(AuthContext);
