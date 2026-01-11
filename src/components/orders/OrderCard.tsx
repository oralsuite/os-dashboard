'use client';

import Link from 'next/link';
import { Order } from '@/types';
import { Card, CardContent } from '@/components/ui';
import { OrderStatusBadge } from './OrderStatusBadge';
import { formatDate, getWorkTypeLabel, getPriorityLabel, getPriorityColor, getUserDisplayName } from '@/lib/utils';
import { useAuth } from '@/lib/auth';

interface OrderCardProps {
  order: Order;
}

export function OrderCard({ order }: OrderCardProps) {
  const { user } = useAuth();
  const isDentist = user?.role === 'DENTIST';

  // Show laboratory name for dentists, dentist name for laboratories
  const otherPartyName = isDentist
    ? order.laboratory?.laboratoryProfile?.businessName || 'Laboratorio'
    : order.dentist?.dentistProfile
    ? `${order.dentist.dentistProfile.firstName} ${order.dentist.dentistProfile.lastName}`
    : 'Dentista';

  return (
    <Link href={`/dashboard/orders/${order.id}`}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer">
        <CardContent>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="font-semibold text-gray-900">#{order.orderNumber}</h3>
                <OrderStatusBadge status={order.status} />
                <span className={`px-2 py-0.5 rounded text-xs font-medium ${getPriorityColor(order.priority)}`}>
                  {getPriorityLabel(order.priority)}
                </span>
              </div>

              <div className="space-y-1 text-sm text-gray-600">
                <p>
                  <span className="font-medium">Paciente:</span> {order.patientName || 'No especificado'}
                </p>
                <p>
                  <span className="font-medium">{isDentist ? 'Laboratorio' : 'Dentista'}:</span> {otherPartyName}
                </p>
                <p>
                  <span className="font-medium">Trabajos:</span>{' '}
                  {order.items.map((item) => getWorkTypeLabel(item.workType)).join(', ')}
                </p>
              </div>
            </div>

            <div className="text-right text-sm text-gray-500">
              <p>{formatDate(order.createdAt)}</p>
              {order.dueDate && (
                <p className="text-xs mt-1">
                  Entrega: {formatDate(order.dueDate)}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
