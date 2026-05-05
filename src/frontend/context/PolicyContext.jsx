import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../utils/api.js';

const PolicyContext = createContext(null);

export function PolicyProvider({ children }) {
  const [data, setData] = useState({ products: [], users: [], policies: [], claims: [], notifications: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function refresh() {
    setError('');
    try {
      setData(await api('/api/bootstrap'));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  const value = useMemo(() => ({ data, loading, error, refresh }), [data, loading, error]);
  return <PolicyContext.Provider value={value}>{children}</PolicyContext.Provider>;
}

export function usePolicyData() {
  const context = useContext(PolicyContext);
  if (!context) throw new Error('usePolicyData must be used inside PolicyProvider');
  return context;
}
