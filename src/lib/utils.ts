import { OrderStatus, WorkType, MaterialType } from '@/types';

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function formatDate(date: string | null): string {
  if (!date) return '-';
  return new Date(date).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

export function formatDateTime(date: string | null): string {
  if (!date) return '-';
  return new Date(date).toLocaleString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function getStatusLabel(status: OrderStatus): string {
  const labels: Record<OrderStatus, string> = {
    DRAFT: 'Borrador',
    PENDING: 'Pendiente',
    ACCEPTED: 'Aceptada',
    IN_PROGRESS: 'En proceso',
    READY: 'Lista',
    SHIPPED: 'Enviada',
    DELIVERED: 'Entregada',
    CANCELLED: 'Cancelada',
  };
  return labels[status];
}

export function getStatusColor(status: OrderStatus): string {
  const colors: Record<OrderStatus, string> = {
    DRAFT: 'bg-gray-100 text-gray-700',
    PENDING: 'bg-yellow-100 text-yellow-700',
    ACCEPTED: 'bg-blue-100 text-blue-700',
    IN_PROGRESS: 'bg-purple-100 text-purple-700',
    READY: 'bg-green-100 text-green-700',
    SHIPPED: 'bg-cyan-100 text-cyan-700',
    DELIVERED: 'bg-emerald-100 text-emerald-700',
    CANCELLED: 'bg-red-100 text-red-700',
  };
  return colors[status];
}

export function getWorkTypeLabel(type: WorkType): string {
  const labels: Record<WorkType, string> = {
    CROWN: 'Corona',
    BRIDGE: 'Puente',
    DENTURE: 'Prótesis',
    IMPLANT: 'Implante',
    VENEER: 'Carilla',
    INLAY_ONLAY: 'Inlay/Onlay',
    ORTHODONTICS: 'Ortodoncia',
    OTHER: 'Otro',
  };
  return labels[type];
}

export function getMaterialLabel(material: MaterialType): string {
  const labels: Record<MaterialType, string> = {
    ZIRCONIA: 'Zirconia',
    PORCELAIN: 'Porcelana',
    METAL_CERAMIC: 'Metal-cerámica',
    ACRYLIC: 'Acrílico',
    COMPOSITE: 'Composite',
    TITANIUM: 'Titanio',
    GOLD: 'Oro',
    OTHER: 'Otro',
  };
  return labels[material];
}

export function getPriorityLabel(priority: string): string {
  const labels: Record<string, string> = {
    normal: 'Normal',
    urgent: 'Urgente',
    express: 'Express',
  };
  return labels[priority] || priority;
}

export function getPriorityColor(priority: string): string {
  const colors: Record<string, string> = {
    normal: 'bg-gray-100 text-gray-700',
    urgent: 'bg-orange-100 text-orange-700',
    express: 'bg-red-100 text-red-700',
  };
  return colors[priority] || 'bg-gray-100 text-gray-700';
}

export function getInitials(firstName: string, lastName: string): string {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

export function getUserDisplayName(user: {
  dentistProfile?: { firstName: string; lastName: string } | null;
  laboratoryProfile?: { businessName: string } | null;
  email: string;
}): string {
  if (user.dentistProfile) {
    return `${user.dentistProfile.firstName} ${user.dentistProfile.lastName}`;
  }
  if (user.laboratoryProfile) {
    return user.laboratoryProfile.businessName;
  }
  return user.email;
}
