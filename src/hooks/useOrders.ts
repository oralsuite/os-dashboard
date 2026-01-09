'use client';

import { useState, useEffect, useCallback } from 'react';
import { Order, CreateOrderDto, UpdateOrderDto, UpdateStatusDto } from '@/types';
import { api } from '@/lib/api';

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const data = await api.getOrders();
      setOrders(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar órdenes');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const createOrder = async (data: CreateOrderDto) => {
    const order = await api.createOrder(data);
    setOrders((prev) => [order, ...prev]);
    return order;
  };

  const updateOrder = async (id: string, data: UpdateOrderDto) => {
    const order = await api.updateOrder(id, data);
    setOrders((prev) => prev.map((o) => (o.id === id ? order : o)));
    return order;
  };

  const updateStatus = async (id: string, data: UpdateStatusDto) => {
    const order = await api.updateOrderStatus(id, data);
    setOrders((prev) => prev.map((o) => (o.id === id ? order : o)));
    return order;
  };

  return {
    orders,
    loading,
    error,
    refresh: fetchOrders,
    createOrder,
    updateOrder,
    updateStatus,
  };
}

export function useOrder(id: string) {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrder = useCallback(async () => {
    try {
      setLoading(true);
      const data = await api.getOrder(id);
      setOrder(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar orden');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  return { order, loading, error, refresh: fetchOrder };
}
