'use client';

import { useState, useEffect, useCallback } from 'react';
import { User } from '@/types';
import { api } from '@/lib/api';

export function useDentists() {
  const [dentists, setDentists] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDentists = useCallback(async () => {
    try {
      setLoading(true);
      const data = await api.getDentists();
      setDentists(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar odontólogos');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDentists();
  }, [fetchDentists]);

  return {
    dentists,
    loading,
    error,
    refresh: fetchDentists,
  };
}
