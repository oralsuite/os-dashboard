'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth';
import { useLaboratories } from '@/hooks/useLaboratories';
import { Card, CardContent, Spinner, EmptyState, Button } from '@/components/ui';
import { getWorkTypeLabel, getMaterialLabel } from '@/lib/utils';

export default function LaboratoriesPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { laboratories, loading, error } = useLaboratories();

  // Only dentists can see laboratories list
  useEffect(() => {
    if (user && user.role !== 'DENTIST') {
      router.replace('/dashboard');
    }
  }, [user, router]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Laboratorios</h1>
        <p className="text-gray-500 mt-1">Encuentra laboratorios para enviar tus órdenes de trabajo</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-red-600">{error}</p>
        </div>
      ) : laboratories.length === 0 ? (
        <EmptyState
          icon={
            <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
          }
          title="No hay laboratorios disponibles"
          description="Aún no hay laboratorios registrados en la plataforma"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {laboratories.map((lab) => {
            const profile = lab.laboratoryProfile;
            if (!profile) return null;

            return (
              <Card key={lab.id} className="hover:shadow-md transition-shadow">
                <CardContent>
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 text-blue-600 font-bold text-lg shrink-0">
                      {profile.businessName.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate">{profile.businessName}</h3>
                      {profile.city && profile.state && (
                        <p className="text-sm text-gray-500">{profile.city}, {profile.state}</p>
                      )}
                    </div>
                  </div>

                  {profile.description && (
                    <p className="mt-4 text-sm text-gray-600 line-clamp-3">{profile.description}</p>
                  )}

                  <div className="mt-4 space-y-2">
                    {profile.workTypesOffered && profile.workTypesOffered.length > 0 && (
                      <div>
                        <p className="text-xs font-medium text-gray-500 mb-1">Trabajos</p>
                        <div className="flex flex-wrap gap-1">
                          {profile.workTypesOffered.slice(0, 4).map((type) => (
                            <span key={type} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">
                              {getWorkTypeLabel(type)}
                            </span>
                          ))}
                          {profile.workTypesOffered.length > 4 && (
                            <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">
                              +{profile.workTypesOffered.length - 4}
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {profile.averageTurnaroundDays > 0 && (
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Tiempo promedio:</span> {profile.averageTurnaroundDays} días
                      </p>
                    )}
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-100 flex gap-2">
                    <Link href={`/dashboard/orders/new?laboratoryId=${lab.id}`} className="flex-1">
                      <Button className="w-full" size="sm">
                        Crear Orden
                      </Button>
                    </Link>
                    <Link href={`/dashboard/chat?laboratoryId=${lab.id}`}>
                      <Button variant="outline" size="sm">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
