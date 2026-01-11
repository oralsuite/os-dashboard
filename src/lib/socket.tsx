'use client';

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { api } from './api';
import { Message } from '@/types';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  joinConversation: (conversationId: string) => void;
  leaveConversation: (conversationId: string) => void;
  sendMessage: (conversationId: string, content: string) => void;
  setTyping: (conversationId: string, isTyping: boolean) => void;
  onNewMessage: (callback: (message: Message) => void) => () => void;
  onUserTyping: (callback: (data: { userId: string; isTyping: boolean }) => void) => () => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:3000';

export function SocketProvider({ children }: { children: ReactNode }) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const token = api.getToken();
    if (!token) return;

    const socketInstance = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket', 'polling'],
    });

    socketInstance.on('connect', () => {
      console.log('Socket connected');
      setIsConnected(true);
    });

    socketInstance.on('disconnect', () => {
      console.log('Socket disconnected');
      setIsConnected(false);
    });

    socketInstance.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      setIsConnected(false);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  const joinConversation = useCallback((conversationId: string) => {
    socket?.emit('join_conversation', conversationId);
  }, [socket]);

  const leaveConversation = useCallback((conversationId: string) => {
    socket?.emit('leave_conversation', conversationId);
  }, [socket]);

  const sendMessage = useCallback((conversationId: string, content: string) => {
    socket?.emit('send_message', { conversationId, content });
  }, [socket]);

  const setTyping = useCallback((conversationId: string, isTyping: boolean) => {
    socket?.emit('typing', { conversationId, isTyping });
  }, [socket]);

  const onNewMessage = useCallback((callback: (message: Message) => void) => {
    if (!socket) return () => {};

    socket.on('new_message', callback);
    return () => {
      socket.off('new_message', callback);
    };
  }, [socket]);

  const onUserTyping = useCallback((callback: (data: { userId: string; isTyping: boolean }) => void) => {
    if (!socket) return () => {};

    socket.on('user_typing', callback);
    return () => {
      socket.off('user_typing', callback);
    };
  }, [socket]);

  return (
    <SocketContext.Provider
      value={{
        socket,
        isConnected,
        joinConversation,
        leaveConversation,
        sendMessage,
        setTyping,
        onNewMessage,
        onUserTyping,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
}
