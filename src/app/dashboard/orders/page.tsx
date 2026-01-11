'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/auth';
import { useOrders } from '@/hooks/useOrders';
import { OrderList } from '@/components/orders';
import { Button } from '@/components/ui';

export default function OrdersPage() {
  const { user } = useAuth();
  const { orders, loading, error } = useOrders();

  const isDentist = user?.role === 'DENTIST';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Órdenes de Trabajo</h1>
          <p className="text-gray-500 mt-1">
            {isDentist ? 'Gestiona tus órdenes enviadas a laboratorios' : 'Gestiona las órdenes recibidas'}
          </p>
        </div>

        {isDentist && (
          <Link href="/dashboard/orders/new">
            <Button>
              <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Nueva Orden
            </Button>
          </Link>
        )}
      </div>

      <OrderList orders={orders} loading={loading} error={error} />
    </div>
  );
}
