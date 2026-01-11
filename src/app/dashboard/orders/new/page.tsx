'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { useLaboratories } from '@/hooks/useLaboratories';
import { usePatients } from '@/hooks/usePatients';
import { OrderForm } from '@/components/orders';
import { LoadingScreen } from '@/components/ui';

export default function NewOrderPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { laboratories, loading: loadingLabs } = useLaboratories();
  const { patients, loading: loadingPatients } = usePatients();

  // Only dentists can create orders
  useEffect(() => {
    if (user && user.role !== 'DENTIST') {
      router.replace('/dashboard/orders');
    }
  }, [user, router]);

  if (loadingLabs || loadingPatients) {
    return <LoadingScreen />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard/orders"
          className="flex items-center justify-center h-10 w-10 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
        >
          <svg className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Nueva Orden de Trabajo</h1>
          <p className="text-gray-500 mt-1">Crea una nueva orden para enviar a un laboratorio</p>
        </div>
      </div>

      <OrderForm laboratories={laboratories} patients={patients} />
    </div>
  );
}
