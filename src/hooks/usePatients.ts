'use client';

import { useState, useEffect, useCallback } from 'react';
import { Patient, CreatePatientDto, UpdatePatientDto } from '@/types';
import { api } from '@/lib/api';

export function usePatients() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPatients = useCallback(async () => {
    try {
      setLoading(true);
      const data = await api.getPatients();
      setPatients(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar pacientes');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  const createPatient = async (data: CreatePatientDto) => {
    const patient = await api.createPatient(data);
    setPatients((prev) => [patient, ...prev]);
    return patient;
  };

  const updatePatient = async (id: string, data: UpdatePatientDto) => {
    const patient = await api.updatePatient(id, data);
    setPatients((prev) => prev.map((p) => (p.id === id ? patient : p)));
    return patient;
  };

  const deletePatient = async (id: string) => {
    await api.deletePatient(id);
    setPatients((prev) => prev.filter((p) => p.id !== id));
  };

  return {
    patients,
    loading,
    error,
    refresh: fetchPatients,
    createPatient,
    updatePatient,
    deletePatient,
  };
}

export function usePatient(id: string) {
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPatient = useCallback(async () => {
    try {
      setLoading(true);
      const data = await api.getPatient(id);
      setPatient(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar paciente');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchPatient();
  }, [fetchPatient]);

  return { patient, loading, error, refresh: fetchPatient };
}
