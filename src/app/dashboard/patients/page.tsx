'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { usePatients } from '@/hooks/usePatients';
import { PatientList, PatientForm } from '@/components/patients';
import { Button } from '@/components/ui';
import { Patient, CreatePatientDto, UpdatePatientDto } from '@/types';

export default function PatientsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { patients, loading, error, createPatient, updatePatient, deletePatient } = usePatients();

  const [showForm, setShowForm] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);

  // Only dentists can see patients
  useEffect(() => {
    if (user && user.role !== 'DENTIST') {
      router.replace('/dashboard');
    }
  }, [user, router]);

  const handleCreateOrUpdate = async (data: CreatePatientDto | UpdatePatientDto) => {
    if (editingPatient) {
      await updatePatient(editingPatient.id, data as UpdatePatientDto);
    } else {
      await createPatient(data as CreatePatientDto);
    }
    setShowForm(false);
    setEditingPatient(null);
  };

  const handleEdit = (patient: Patient) => {
    setEditingPatient(patient);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    await deletePatient(id);
  };

  const handleClose = () => {
    setShowForm(false);
    setEditingPatient(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pacientes</h1>
          <p className="text-gray-500 mt-1">Gestiona los pacientes de tu clínica</p>
        </div>

        <Button onClick={() => setShowForm(true)}>
          <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nuevo Paciente
        </Button>
      </div>

      <PatientList
        patients={patients}
        loading={loading}
        error={error}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <PatientForm
        isOpen={showForm}
        onClose={handleClose}
        onSubmit={handleCreateOrUpdate}
        patient={editingPatient}
      />
    </div>
  );
}
