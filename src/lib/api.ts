import {
  User,
  Patient,
  Order,
  Conversation,
  Message,
  DentistProfile,
  LaboratoryProfile,
  CreatePatientDto,
  UpdatePatientDto,
  CreateOrderDto,
  UpdateOrderDto,
  UpdateStatusDto,
  UpdateDentistProfileDto,
  UpdateLaboratoryProfileDto,
  CreateConversationDto,
  SendMessageDto,
  OrderStatusHistory,
} from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

class ApiClient {
  private token: string | null = null;

  setToken(token: string) {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('accessToken', token);
    }
  }

  getToken(): string | null {
    if (this.token) return this.token;
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('accessToken');
    }
    return this.token;
  }

  clearToken() {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = this.getToken();

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      if (response.status === 401) {
        this.clearToken();
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
      }
      const error = await response.json().catch(() => ({ message: 'Error de conexión' }));
      throw new Error(
        Array.isArray(error.message) ? error.message[0] : error.message
      );
    }

    // Handle empty responses
    if (response.status === 204) {
      return {} as T;
    }

    // Check if response has content
    const text = await response.text();
    if (!text) {
      return {} as T;
    }

    return JSON.parse(text);
  }

  // Auth
  getMe() {
    return this.request<User>('/auth/me');
  }

  // Users
  getDentists() {
    return this.request<User[]>('/users/dentists');
  }

  getLaboratories() {
    return this.request<User[]>('/users/laboratories');
  }

  updateDentistProfile(data: UpdateDentistProfileDto) {
    return this.request<DentistProfile>('/users/profile/dentist', {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  updateLaboratoryProfile(data: UpdateLaboratoryProfileDto) {
    return this.request<LaboratoryProfile>('/users/profile/laboratory', {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  // Patients
  getPatients() {
    return this.request<Patient[]>('/patients');
  }

  getPatient(id: string) {
    return this.request<Patient>(`/patients/${id}`);
  }

  createPatient(data: CreatePatientDto) {
    return this.request<Patient>('/patients', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  updatePatient(id: string, data: UpdatePatientDto) {
    return this.request<Patient>(`/patients/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  deletePatient(id: string) {
    return this.request<void>(`/patients/${id}`, {
      method: 'DELETE',
    });
  }

  // Orders
  getOrders() {
    return this.request<Order[]>('/orders');
  }

  getOrder(id: string) {
    return this.request<Order>(`/orders/${id}`);
  }

  createOrder(data: CreateOrderDto) {
    return this.request<Order>('/orders', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  updateOrder(id: string, data: UpdateOrderDto) {
    return this.request<Order>(`/orders/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  updateOrderStatus(id: string, data: UpdateStatusDto) {
    return this.request<Order>(`/orders/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  getOrderHistory(id: string) {
    return this.request<OrderStatusHistory[]>(`/orders/${id}/history`);
  }

  // Chat
  getConversations() {
    return this.request<Conversation[]>('/chat/conversations');
  }

  getConversation(id: string) {
    return this.request<Conversation>(`/chat/conversations/${id}`);
  }

  createConversation(data: CreateConversationDto) {
    return this.request<Conversation>('/chat/conversations', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  getMessages(conversationId: string, limit = 50, offset = 0) {
    return this.request<Message[]>(
      `/chat/conversations/${conversationId}/messages?limit=${limit}&offset=${offset}`
    );
  }

  sendMessage(data: SendMessageDto) {
    return this.request<Message>('/chat/messages', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  markAsRead(conversationId: string) {
    return this.request<void>(`/chat/conversations/${conversationId}/read`, {
      method: 'POST',
    });
  }
}

export const api = new ApiClient();
