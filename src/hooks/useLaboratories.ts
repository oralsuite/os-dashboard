'use client';

import { useState, useEffect, useCallback } from 'react';
import { User } from '@/types';
import { api } from '@/lib/api';

export function useLaboratories() {
  const [laboratories, setLaboratories] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLaboratories = useCallback(async () => {
    try {
      setLoading(true);
      const data = await api.getLaboratories();
      setLaboratories(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar laboratorios');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLaboratories();
  }, [fetchLaboratories]);

  return {
    laboratories,
    loading,
    error,
    refresh: fetchLaboratories,
  };
}
