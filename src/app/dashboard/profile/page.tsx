'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth';
import { Card, CardContent, CardHeader, CardTitle, Button, Input } from '@/components/ui';
import { UpdateDentistProfileDto, UpdateLaboratoryProfileDto } from '@/types';
import { api } from '@/lib/api';

export default function ProfilePage() {
  const { user, refreshUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isDentist = user?.role === 'DENTIST';
  const isLaboratory = user?.role === 'LABORATORY';

  const [dentistForm, setDentistForm] = useState<UpdateDentistProfileDto>({
    firstName: user?.dentistProfile?.firstName || '',
    lastName: user?.dentistProfile?.lastName || '',
    licenseNumber: user?.dentistProfile?.licenseNumber || '',
    specialization: user?.dentistProfile?.specialization || '',
    clinicName: user?.dentistProfile?.clinicName || '',
    clinicAddress: user?.dentistProfile?.clinicAddress || '',
    clinicPhone: user?.dentistProfile?.clinicPhone || '',
    clinicCity: user?.dentistProfile?.clinicCity || '',
    clinicState: user?.dentistProfile?.clinicState || '',
  });

  const [labForm, setLabForm] = useState<UpdateLaboratoryProfileDto>({
    businessName: user?.laboratoryProfile?.businessName || '',
    taxId: user?.laboratoryProfile?.taxId || '',
    contactName: user?.laboratoryProfile?.contactName || '',
    address: user?.laboratoryProfile?.address || '',
    city: user?.laboratoryProfile?.city || '',
    state: user?.laboratoryProfile?.state || '',
    postalCode: user?.laboratoryProfile?.postalCode || '',
    phone: user?.laboratoryProfile?.phone || '',
    website: user?.laboratoryProfile?.website || '',
    description: user?.laboratoryProfile?.description || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      if (isDentist) {
        await api.updateDentistProfile(dentistForm);
      } else if (isLaboratory) {
        await api.updateLaboratoryProfile(labForm);
      }
      await refreshUser();
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar perfil');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Mi Perfil</h1>
        <p className="text-gray-500 mt-1">Actualiza tu información personal</p>
      </div>

      {/* Account Info */}
      <Card>
        <CardHeader>
          <CardTitle>Información de Cuenta</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-2 gap-4">
            <div>
              <dt className="text-sm font-medium text-gray-500">Email</dt>
              <dd className="text-sm text-gray-900 mt-1">{user?.email}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Rol</dt>
              <dd className="text-sm text-gray-900 mt-1">
                {isDentist ? 'Dentista' : isLaboratory ? 'Laboratorio' : 'Admin'}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Estado</dt>
              <dd className="mt-1">
                <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${user?.isVerified ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                  {user?.isVerified ? 'Verificado' : 'Pendiente'}
                </span>
              </dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      {/* Profile Form */}
      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>
              {isDentist ? 'Información del Dentista' : 'Información del Laboratorio'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="mb-4 bg-red-50 text-red-600 px-4 py-3 rounded-lg">{error}</div>
            )}
            {success && (
              <div className="mb-4 bg-green-50 text-green-600 px-4 py-3 rounded-lg">
                Perfil actualizado correctamente
              </div>
            )}

            {isDentist && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    id="firstName"
                    label="Nombre"
                    value={dentistForm.firstName || ''}
                    onChange={(e) => setDentistForm((prev) => ({ ...prev, firstName: e.target.value }))}
                  />
                  <Input
                    id="lastName"
                    label="Apellido"
                    value={dentistForm.lastName || ''}
                    onChange={(e) => setDentistForm((prev) => ({ ...prev, lastName: e.target.value }))}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    id="licenseNumber"
                    label="Número de Licencia"
                    value={dentistForm.licenseNumber || ''}
                    onChange={(e) => setDentistForm((prev) => ({ ...prev, licenseNumber: e.target.value }))}
                  />
                  <Input
                    id="specialization"
                    label="Especialización"
                    value={dentistForm.specialization || ''}
                    onChange={(e) => setDentistForm((prev) => ({ ...prev, specialization: e.target.value }))}
                  />
                </div>

                <Input
                  id="clinicName"
                  label="Nombre de la Clínica"
                  value={dentistForm.clinicName || ''}
                  onChange={(e) => setDentistForm((prev) => ({ ...prev, clinicName: e.target.value }))}
                />

                <Input
                  id="clinicAddress"
                  label="Dirección de la Clínica"
                  value={dentistForm.clinicAddress || ''}
                  onChange={(e) => setDentistForm((prev) => ({ ...prev, clinicAddress: e.target.value }))}
                />

                <div className="grid grid-cols-3 gap-4">
                  <Input
                    id="clinicCity"
                    label="Ciudad"
                    value={dentistForm.clinicCity || ''}
                    onChange={(e) => setDentistForm((prev) => ({ ...prev, clinicCity: e.target.value }))}
                  />
                  <Input
                    id="clinicState"
                    label="Estado/Provincia"
                    value={dentistForm.clinicState || ''}
                    onChange={(e) => setDentistForm((prev) => ({ ...prev, clinicState: e.target.value }))}
                  />
                  <Input
                    id="clinicPhone"
                    label="Teléfono"
                    value={dentistForm.clinicPhone || ''}
                    onChange={(e) => setDentistForm((prev) => ({ ...prev, clinicPhone: e.target.value }))}
                  />
                </div>
              </div>
            )}

            {isLaboratory && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    id="businessName"
                    label="Nombre del Laboratorio"
                    value={labForm.businessName || ''}
                    onChange={(e) => setLabForm((prev) => ({ ...prev, businessName: e.target.value }))}
                  />
                  <Input
                    id="taxId"
                    label="NIF/CIF"
                    value={labForm.taxId || ''}
                    onChange={(e) => setLabForm((prev) => ({ ...prev, taxId: e.target.value }))}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    id="contactName"
                    label="Nombre de Contacto"
                    value={labForm.contactName || ''}
                    onChange={(e) => setLabForm((prev) => ({ ...prev, contactName: e.target.value }))}
                  />
                  <Input
                    id="phone"
                    label="Teléfono"
                    value={labForm.phone || ''}
                    onChange={(e) => setLabForm((prev) => ({ ...prev, phone: e.target.value }))}
                  />
                </div>

                <Input
                  id="address"
                  label="Dirección"
                  value={labForm.address || ''}
                  onChange={(e) => setLabForm((prev) => ({ ...prev, address: e.target.value }))}
                />

                <div className="grid grid-cols-3 gap-4">
                  <Input
                    id="city"
                    label="Ciudad"
                    value={labForm.city || ''}
                    onChange={(e) => setLabForm((prev) => ({ ...prev, city: e.target.value }))}
                  />
                  <Input
                    id="state"
                    label="Estado/Provincia"
                    value={labForm.state || ''}
                    onChange={(e) => setLabForm((prev) => ({ ...prev, state: e.target.value }))}
                  />
                  <Input
                    id="postalCode"
                    label="Código Postal"
                    value={labForm.postalCode || ''}
                    onChange={(e) => setLabForm((prev) => ({ ...prev, postalCode: e.target.value }))}
                  />
                </div>

                <Input
                  id="website"
                  label="Sitio Web"
                  value={labForm.website || ''}
                  onChange={(e) => setLabForm((prev) => ({ ...prev, website: e.target.value }))}
                  placeholder="https://..."
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Descripción
                  </label>
                  <textarea
                    value={labForm.description || ''}
                    onChange={(e) => setLabForm((prev) => ({ ...prev, description: e.target.value }))}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Describe los servicios de tu laboratorio..."
                  />
                </div>
              </div>
            )}

            <div className="mt-6 flex justify-end">
              <Button type="submit" loading={loading}>
                Guardar Cambios
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
