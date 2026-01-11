'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth';
import { useOrder } from '@/hooks/useOrders';
import { OrderStatusBadge, OrderTimeline } from '@/components/orders';
import { Card, CardContent, CardHeader, CardTitle, Button, LoadingScreen, Modal, Select } from '@/components/ui';
import { formatDate, formatDateTime, getWorkTypeLabel, getMaterialLabel, getPriorityLabel, getPriorityColor, getStatusLabel } from '@/lib/utils';
import { OrderStatus, OrderStatusHistory } from '@/types';
import { api } from '@/lib/api';

const statusTransitions: Record<OrderStatus, OrderStatus[]> = {
  DRAFT: ['PENDING', 'CANCELLED'],
  PENDING: ['ACCEPTED', 'CANCELLED'],
  ACCEPTED: ['IN_PROGRESS', 'CANCELLED'],
  IN_PROGRESS: ['READY', 'CANCELLED'],
  READY: ['SHIPPED', 'CANCELLED'],
  SHIPPED: ['DELIVERED', 'CANCELLED'],
  DELIVERED: [],
  CANCELLED: [],
};

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { order, loading, error, refresh } = useOrder(params.id as string);

  const [history, setHistory] = useState<OrderStatusHistory[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [newStatus, setNewStatus] = useState<OrderStatus | ''>('');
  const [statusNotes, setStatusNotes] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const isDentist = user?.role === 'DENTIST';
  const isLaboratory = user?.role === 'LABORATORY';

  useEffect(() => {
    if (params.id) {
      api.getOrderHistory(params.id as string)
        .then(setHistory)
        .catch(console.error)
        .finally(() => setLoadingHistory(false));
    }
  }, [params.id]);

  const handleUpdateStatus = async () => {
    if (!newStatus || !order) return;

    setUpdatingStatus(true);
    try {
      await api.updateOrderStatus(order.id, {
        status: newStatus,
        notes: statusNotes || undefined,
      });
      setShowStatusModal(false);
      setNewStatus('');
      setStatusNotes('');
      refresh();
      // Refresh history
      const newHistory = await api.getOrderHistory(order.id);
      setHistory(newHistory);
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingStatus(false);
    }
  };

  if (loading) {
    return <LoadingScreen />;
  }

  if (error || !order) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">{error || 'Orden no encontrada'}</p>
        <Link href="/dashboard/orders" className="text-blue-600 hover:text-blue-700 mt-4 inline-block">
          Volver a órdenes
        </Link>
      </div>
    );
  }

  const availableStatuses = statusTransitions[order.status] || [];
  const canUpdateStatus = isLaboratory && availableStatuses.length > 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
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
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900">Orden #{order.orderNumber}</h1>
              <OrderStatusBadge status={order.status} />
              <span className={`px-2 py-0.5 rounded text-xs font-medium ${getPriorityColor(order.priority)}`}>
                {getPriorityLabel(order.priority)}
              </span>
            </div>
            <p className="text-gray-500 mt-1">Creada el {formatDateTime(order.createdAt)}</p>
          </div>
        </div>

        <div className="flex gap-2">
          {canUpdateStatus && (
            <Button onClick={() => setShowStatusModal(true)}>
              Actualizar Estado
            </Button>
          )}
          <Link href={`/dashboard/chat?orderId=${order.id}`}>
            <Button variant="outline">
              <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              Chat
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Details */}
          <Card>
            <CardHeader>
              <CardTitle>Detalles de la Orden</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-2 gap-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Paciente</dt>
                  <dd className="text-sm text-gray-900 mt-1">{order.patientName || 'No especificado'}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    {isDentist ? 'Laboratorio' : 'Dentista'}
                  </dt>
                  <dd className="text-sm text-gray-900 mt-1">
                    {isDentist
                      ? order.laboratory?.laboratoryProfile?.businessName || '-'
                      : order.dentist?.dentistProfile
                      ? `${order.dentist.dentistProfile.firstName} ${order.dentist.dentistProfile.lastName}`
                      : '-'}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Fecha de entrega</dt>
                  <dd className="text-sm text-gray-900 mt-1">{formatDate(order.dueDate) || 'No especificada'}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Entrega estimada</dt>
                  <dd className="text-sm text-gray-900 mt-1">{formatDate(order.estimatedDelivery) || 'Pendiente'}</dd>
                </div>
              </dl>

              {order.notes && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <dt className="text-sm font-medium text-gray-500">Notas</dt>
                  <dd className="text-sm text-gray-900 mt-1">{order.notes}</dd>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Items */}
          <Card>
            <CardHeader>
              <CardTitle>Trabajos ({order.items.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div key={item.id} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">
                          {getWorkTypeLabel(item.workType)}
                          {item.workTypeOther && ` - ${item.workTypeOther}`}
                        </h4>
                        <div className="mt-2 space-y-1 text-sm text-gray-600">
                          {item.teethNumbers && item.teethNumbers.length > 0 && (
                            <p>Piezas: {item.teethNumbers.join(', ')}</p>
                          )}
                          {item.material && (
                            <p>Material: {getMaterialLabel(item.material)}</p>
                          )}
                          {item.shade && (
                            <p>Color: {item.shade}</p>
                          )}
                          {item.description && (
                            <p>Descripción: {item.description}</p>
                          )}
                        </div>
                      </div>
                      <span className="text-sm text-gray-500">Cantidad: {item.quantity}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - Timeline */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Historial de Estados</CardTitle>
            </CardHeader>
            <CardContent>
              {loadingHistory ? (
                <p className="text-gray-500 text-sm">Cargando...</p>
              ) : (
                <OrderTimeline history={history} />
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Status Update Modal */}
      <Modal
        isOpen={showStatusModal}
        onClose={() => setShowStatusModal(false)}
        title="Actualizar Estado"
        size="md"
      >
        <div className="space-y-4">
          <Select
            id="newStatus"
            label="Nuevo estado"
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value as OrderStatus)}
            options={availableStatuses.map((s) => ({ value: s, label: getStatusLabel(s) }))}
            placeholder="Selecciona un estado"
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notas (opcional)
            </label>
            <textarea
              value={statusNotes}
              onChange={(e) => setStatusNotes(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Motivo del cambio de estado..."
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => setShowStatusModal(false)}>
              Cancelar
            </Button>
            <Button onClick={handleUpdateStatus} loading={updatingStatus} disabled={!newStatus}>
              Actualizar
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
