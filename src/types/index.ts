// === ENUMS ===

export type UserRole = 'DENTIST' | 'LABORATORY' | 'ADMIN';

export type OrderStatus =
  | 'DRAFT'
  | 'PENDING'
  | 'ACCEPTED'
  | 'IN_PROGRESS'
  | 'READY'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED';

export type WorkType =
  | 'CROWN'
  | 'BRIDGE'
  | 'DENTURE'
  | 'IMPLANT'
  | 'VENEER'
  | 'INLAY_ONLAY'
  | 'ORTHODONTICS'
  | 'OTHER';

export type MaterialType =
  | 'ZIRCONIA'
  | 'PORCELAIN'
  | 'METAL_CERAMIC'
  | 'ACRYLIC'
  | 'COMPOSITE'
  | 'TITANIUM'
  | 'GOLD'
  | 'OTHER';

// === ENTIDADES ===

export interface User {
  id: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  isVerified: boolean;
  lastLoginAt: string | null;
  createdAt: string;
  updatedAt: string;
  dentistProfile?: DentistProfile;
  laboratoryProfile?: LaboratoryProfile;
}

export interface DentistProfile {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  licenseNumber: string | null;
  specialization: string | null;
  clinicName: string | null;
  clinicAddress: string | null;
  clinicPhone: string | null;
  clinicCity: string | null;
  clinicState: string | null;
  avatarUrl: string | null;
  notificationEmail: boolean;
  notificationPush: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LaboratoryProfile {
  id: string;
  userId: string;
  businessName: string;
  taxId: string | null;
  contactName: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  postalCode: string | null;
  phone: string | null;
  website: string | null;
  description: string | null;
  logoUrl: string | null;
  workTypesOffered: WorkType[];
  materialsOffered: MaterialType[];
  averageTurnaroundDays: number;
  acceptsNewClients: boolean;
  notificationEmail: boolean;
  notificationPush: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Patient {
  id: string;
  dentistId: string;
  firstName: string;
  lastName: string;
  identifier: string | null;
  birthDate: string | null;
  notes: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  dentistId: string;
  laboratoryId: string;
  patientId: string | null;
  status: OrderStatus;
  patientName: string | null;
  patientIdentifier: string | null;
  priority: string;
  notes: string | null;
  internalNotes: string | null;
  dueDate: string | null;
  estimatedDelivery: string | null;
  shippedAt: string | null;
  deliveredAt: string | null;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
  dentist?: User;
  laboratory?: User;
  patient?: Patient;
  statusHistory?: OrderStatusHistory[];
}

export interface OrderItem {
  id: string;
  orderId: string;
  workType: WorkType;
  workTypeOther: string | null;
  teethNumbers: number[] | null;
  material: MaterialType | null;
  materialOther: string | null;
  shade: string | null;
  description: string | null;
  quantity: number;
  unitPrice: number | null;
  createdAt: string;
}

export interface OrderStatusHistory {
  id: string;
  orderId: string;
  fromStatus: OrderStatus | null;
  toStatus: OrderStatus;
  changedBy: string;
  changedAt: string;
  notes: string | null;
  changedByUser?: User;
}

export interface Conversation {
  id: string;
  orderId: string | null;
  dentistId: string;
  laboratoryId: string;
  isActive: boolean;
  lastMessageAt: string | null;
  createdAt: string;
  messages?: Message[];
  dentist?: User;
  laboratory?: User;
  order?: Order;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  isRead: boolean;
  readAt: string | null;
  createdAt: string;
  sender?: User;
}

// === DTOs ===

export interface CreatePatientDto {
  firstName: string;
  lastName: string;
  identifier?: string;
  birthDate?: string;
  notes?: string;
}

export interface UpdatePatientDto {
  firstName?: string;
  lastName?: string;
  identifier?: string;
  birthDate?: string;
  notes?: string;
}

export interface CreateOrderDto {
  laboratoryId: string;
  dentistId?: string;
  patientId?: string;
  patientName?: string;
  priority?: string;
  notes?: string;
  dueDate?: string;
  items: CreateOrderItemDto[];
}

export interface CreateOrderItemDto {
  workType: WorkType;
  workTypeOther?: string;
  teethNumbers?: number[];
  material?: MaterialType;
  materialOther?: string;
  shade?: string;
  description?: string;
  quantity?: number;
}

export interface UpdateOrderDto {
  notes?: string;
  internalNotes?: string;
  dueDate?: string;
  estimatedDelivery?: string;
  priority?: string;
}

export interface UpdateStatusDto {
  status: OrderStatus;
  notes?: string;
}

export interface UpdateDentistProfileDto {
  firstName?: string;
  lastName?: string;
  licenseNumber?: string;
  specialization?: string;
  clinicName?: string;
  clinicAddress?: string;
  clinicPhone?: string;
  clinicCity?: string;
  clinicState?: string;
  avatarUrl?: string;
  notificationEmail?: boolean;
  notificationPush?: boolean;
}

export interface UpdateLaboratoryProfileDto {
  businessName?: string;
  taxId?: string;
  contactName?: string;
  address?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  phone?: string;
  website?: string;
  description?: string;
  logoUrl?: string;
  acceptsNewClients?: boolean;
  notificationEmail?: boolean;
  notificationPush?: boolean;
}

export interface CreateConversationDto {
  laboratoryId: string;
  orderId?: string;
}

export interface SendMessageDto {
  conversationId: string;
  content: string;
}

// === ERROR ===

export interface ApiError {
  message: string | string[];
  error: string;
  statusCode: number;
}
