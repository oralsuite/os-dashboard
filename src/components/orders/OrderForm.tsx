'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Input, Select, Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { CreateOrderDto, CreateOrderItemDto, WorkType, MaterialType, User, Patient } from '@/types';
import { getWorkTypeLabel, getMaterialLabel } from '@/lib/utils';
import { api } from '@/lib/api';

interface OrderFormProps {
  laboratories: User[];
  patients: Patient[];
}

const workTypes: WorkType[] = [
  'CROWN',
  'BRIDGE',
  'DENTURE',
  'IMPLANT',
  'VENEER',
  'INLAY_ONLAY',
  'ORTHODONTICS',
  'OTHER',
];

const materials: MaterialType[] = [
  'ZIRCONIA',
  'PORCELAIN',
  'METAL_CERAMIC',
  'ACRYLIC',
  'COMPOSITE',
  'TITANIUM',
  'GOLD',
  'OTHER',
];

const shades = ['A1', 'A2', 'A3', 'A3.5', 'A4', 'B1', 'B2', 'B3', 'B4', 'C1', 'C2', 'C3', 'C4', 'D2', 'D3', 'D4'];

export function OrderForm({ laboratories, patients }: OrderFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<CreateOrderDto>({
    laboratoryId: '',
    patientId: '',
    patientName: '',
    priority: 'normal',
    notes: '',
    dueDate: '',
    items: [
      {
        workType: 'CROWN',
        teethNumbers: [],
        material: undefined,
        shade: '',
        description: '',
        quantity: 1,
      },
    ],
  });

  const [teethInput, setTeethInput] = useState<string[]>(['']);

  const handleAddItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          workType: 'CROWN',
          teethNumbers: [],
          material: undefined,
          shade: '',
          description: '',
          quantity: 1,
        },
      ],
    }));
    setTeethInput((prev) => [...prev, '']);
  };

  const handleRemoveItem = (index: number) => {
    if (formData.items.length <= 1) return;
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
    setTeethInput((prev) => prev.filter((_, i) => i !== index));
  };

  const handleItemChange = (index: number, field: keyof CreateOrderItemDto, value: unknown) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    }));
  };

  const handleTeethChange = (index: number, value: string) => {
    setTeethInput((prev) => prev.map((t, i) => (i === index ? value : t)));
    const teeth = value
      .split(',')
      .map((t) => parseInt(t.trim()))
      .filter((t) => !isNaN(t) && t > 0 && t < 49);
    handleItemChange(index, 'teethNumbers', teeth);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.laboratoryId) {
      setError('Selecciona un laboratorio');
      return;
    }

    if (formData.items.length === 0) {
      setError('Agrega al menos un trabajo');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const orderData: CreateOrderDto = {
        ...formData,
        patientId: formData.patientId || undefined,
        patientName: formData.patientName || undefined,
        dueDate: formData.dueDate || undefined,
        items: formData.items.map((item) => ({
          ...item,
          material: item.material || undefined,
          shade: item.shade || undefined,
          description: item.description || undefined,
          teethNumbers: item.teethNumbers?.length ? item.teethNumbers : undefined,
        })),
      };

      const order = await api.createOrder(orderData);
      router.push(`/dashboard/orders/${order.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear la orden');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg">{error}</div>
      )}

      {/* Basic Info */}
      <Card>
        <CardHeader>
          <CardTitle>Información General</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              id="laboratoryId"
              label="Laboratorio *"
              value={formData.laboratoryId}
              onChange={(e) => setFormData((prev) => ({ ...prev, laboratoryId: e.target.value }))}
              options={laboratories.map((lab) => ({
                value: lab.id,
                label: lab.laboratoryProfile?.businessName || lab.email,
              }))}
              placeholder="Selecciona un laboratorio"
            />

            <Select
              id="patientId"
              label="Paciente"
              value={formData.patientId || ''}
              onChange={(e) => setFormData((prev) => ({ ...prev, patientId: e.target.value, patientName: '' }))}
              options={[
                { value: '', label: 'Ninguno (ingresar nombre manual)' },
                ...patients.map((p) => ({
                  value: p.id,
                  label: `${p.firstName} ${p.lastName}`,
                })),
              ]}
            />

            {!formData.patientId && (
              <Input
                id="patientName"
                label="Nombre del paciente"
                value={formData.patientName || ''}
                onChange={(e) => setFormData((prev) => ({ ...prev, patientName: e.target.value }))}
                placeholder="Nombre del paciente"
              />
            )}

            <Select
              id="priority"
              label="Prioridad"
              value={formData.priority || 'normal'}
              onChange={(e) => setFormData((prev) => ({ ...prev, priority: e.target.value }))}
              options={[
                { value: 'normal', label: 'Normal' },
                { value: 'urgent', label: 'Urgente' },
                { value: 'express', label: 'Express' },
              ]}
            />

            <Input
              id="dueDate"
              label="Fecha de entrega"
              type="date"
              value={formData.dueDate || ''}
              onChange={(e) => setFormData((prev) => ({ ...prev, dueDate: e.target.value }))}
            />
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notas para el laboratorio
            </label>
            <textarea
              value={formData.notes || ''}
              onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Instrucciones especiales, indicaciones del paciente, etc."
            />
          </div>
        </CardContent>
      </Card>

      {/* Items */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Trabajos</CardTitle>
            <Button type="button" variant="outline" size="sm" onClick={handleAddItem}>
              + Agregar trabajo
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {formData.items.map((item, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg relative">
                {formData.items.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(index)}
                    className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Select
                    id={`workType-${index}`}
                    label="Tipo de trabajo *"
                    value={item.workType}
                    onChange={(e) => handleItemChange(index, 'workType', e.target.value)}
                    options={workTypes.map((t) => ({ value: t, label: getWorkTypeLabel(t) }))}
                  />

                  <Input
                    id={`teeth-${index}`}
                    label="Piezas dentales"
                    value={teethInput[index] || ''}
                    onChange={(e) => handleTeethChange(index, e.target.value)}
                    placeholder="Ej: 11, 12, 21"
                  />

                  <Input
                    id={`quantity-${index}`}
                    label="Cantidad"
                    type="number"
                    min={1}
                    value={item.quantity || 1}
                    onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value) || 1)}
                  />

                  <Select
                    id={`material-${index}`}
                    label="Material"
                    value={item.material || ''}
                    onChange={(e) => handleItemChange(index, 'material', e.target.value || undefined)}
                    options={[
                      { value: '', label: 'Sin especificar' },
                      ...materials.map((m) => ({ value: m, label: getMaterialLabel(m) })),
                    ]}
                  />

                  <Select
                    id={`shade-${index}`}
                    label="Color"
                    value={item.shade || ''}
                    onChange={(e) => handleItemChange(index, 'shade', e.target.value)}
                    options={[
                      { value: '', label: 'Sin especificar' },
                      ...shades.map((s) => ({ value: s, label: s })),
                    ]}
                  />
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Descripción
                  </label>
                  <textarea
                    value={item.description || ''}
                    onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Detalles adicionales del trabajo"
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Submit */}
      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancelar
        </Button>
        <Button type="submit" loading={loading}>
          Crear Orden
        </Button>
      </div>
    </form>
  );
}
