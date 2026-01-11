'use client';

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { useSocket } from './socket';
import { useAuth } from './auth';
import { Message } from '@/types';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'message' | 'info' | 'success' | 'error';
  timestamp: Date;
  read: boolean;
  conversationId?: string;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { onNewMessage } = useSocket();
  const { user } = useAuth();

  const playNotificationSound = useCallback(() => {
    try {
      const audio = new Audio('/notification.mp3');
      audio.volume = 0.5;
      audio.play().catch(() => {
        // Ignore audio play errors (browser might block autoplay)
      });
    } catch {
      // Ignore if audio not available
    }
  }, []);

  const showBrowserNotification = useCallback((title: string, body: string) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, {
        body,
        icon: '/favicon.ico',
        tag: 'oralsuite-message',
      });
    }
  }, []);

  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: crypto.randomUUID(),
      timestamp: new Date(),
      read: false,
    };

    setNotifications((prev) => [newNotification, ...prev].slice(0, 50)); // Keep last 50
    playNotificationSound();

    // Show browser notification if page is not focused
    if (document.hidden) {
      showBrowserNotification(notification.title, notification.message);
    }
  }, [playNotificationSound, showBrowserNotification]);

  // Request notification permission on mount
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  // Listen for new messages and create notifications
  useEffect(() => {
    const unsubscribe = onNewMessage((message: Message) => {
      // Don't notify for own messages
      if (message.senderId === user?.id) return;

      const senderName = message.sender?.firstName
        ? `${message.sender.firstName} ${message.sender.lastName || ''}`
        : message.sender?.email || 'Usuario';

      addNotification({
        title: `Nuevo mensaje de ${senderName}`,
        message: message.content.length > 100
          ? message.content.substring(0, 100) + '...'
          : message.content,
        type: 'message',
        conversationId: message.conversationId,
      });
    });

    return unsubscribe;
  }, [onNewMessage, user?.id, addNotification]);

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        clearNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}
