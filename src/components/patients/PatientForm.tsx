'use client';

import { useState, useEffect } from 'react';
import { Button, Input, Modal } from '@/components/ui';
import { Patient, CreatePatientDto, UpdatePatientDto } from '@/types';

interface PatientFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreatePatientDto | UpdatePatientDto) => Promise<void>;
  patient?: Patient | null;
}

export function PatientForm({ isOpen, onClose, onSubmit, patient }: PatientFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    identifier: '',
    birthDate: '',
    notes: '',
  });

  useEffect(() => {
    if (patient) {
      setFormData({
        firstName: patient.firstName,
        lastName: patient.lastName,
        identifier: patient.identifier || '',
        birthDate: patient.birthDate?.split('T')[0] || '',
        notes: patient.notes || '',
      });
    } else {
      setFormData({
        firstName: '',
        lastName: '',
        identifier: '',
        birthDate: '',
        notes: '',
      });
    }
    setError(null);
  }, [patient, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      setError('El nombre y apellido son obligatorios');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data: CreatePatientDto | UpdatePatientDto = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        identifier: formData.identifier.trim() || undefined,
        birthDate: formData.birthDate || undefined,
        notes: formData.notes.trim() || undefined,
      };
      await onSubmit(data);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar el paciente');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={patient ? 'Editar Paciente' : 'Nuevo Paciente'}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm">{error}</div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <Input
            id="firstName"
            label="Nombre *"
            value={formData.firstName}
            onChange={(e) => setFormData((prev) => ({ ...prev, firstName: e.target.value }))}
            placeholder="Juan"
          />

          <Input
            id="lastName"
            label="Apellido *"
            value={formData.lastName}
            onChange={(e) => setFormData((prev) => ({ ...prev, lastName: e.target.value }))}
            placeholder="Pérez"
          />
        </div>

        <Input
          id="identifier"
          label="Identificador (DNI, Cédula)"
          value={formData.identifier}
          onChange={(e) => setFormData((prev) => ({ ...prev, identifier: e.target.value }))}
          placeholder="12345678"
        />

        <Input
          id="birthDate"
          label="Fecha de nacimiento"
          type="date"
          value={formData.birthDate}
          onChange={(e) => setFormData((prev) => ({ ...prev, birthDate: e.target.value }))}
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Notas
          </label>
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Alergias, condiciones médicas, etc."
          />
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" loading={loading}>
            {patient ? 'Guardar Cambios' : 'Crear Paciente'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
