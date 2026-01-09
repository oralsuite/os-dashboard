'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Conversation, Message, CreateConversationDto, SendMessageDto } from '@/types';
import { api } from '@/lib/api';
import { useSocket } from '@/lib/socket';

export function useConversations() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { onNewMessage } = useSocket();

  const fetchConversations = useCallback(async () => {
    try {
      setLoading(true);
      const data = await api.getConversations();
      setConversations(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar conversaciones');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  // Listen for new messages to update conversation list
  useEffect(() => {
    const unsubscribe = onNewMessage((message: Message) => {
      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === message.conversationId
            ? { ...conv, lastMessageAt: new Date().toISOString() }
            : conv
        ).sort((a, b) =>
          new Date(b.lastMessageAt || 0).getTime() - new Date(a.lastMessageAt || 0).getTime()
        )
      );
    });

    return unsubscribe;
  }, [onNewMessage]);

  const createConversation = async (data: CreateConversationDto) => {
    const conversation = await api.createConversation(data);
    setConversations((prev) => [conversation, ...prev]);
    return conversation;
  };

  return {
    conversations,
    loading,
    error,
    refresh: fetchConversations,
    createConversation,
  };
}

export function useChat(conversationId: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);

  const { joinConversation, leaveConversation, sendMessage: socketSendMessage, setTyping, onNewMessage, onUserTyping, isConnected } = useSocket();
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const fetchMessages = useCallback(async () => {
    try {
      setLoading(true);
      const [conversationData, messagesData] = await Promise.all([
        api.getConversation(conversationId),
        api.getMessages(conversationId),
      ]);
      setConversation(conversationData);
      // Messages come in DESC order from API, reverse for display
      setMessages(messagesData.reverse());
      setError(null);

      // Mark as read
      await api.markAsRead(conversationId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar mensajes');
    } finally {
      setLoading(false);
    }
  }, [conversationId]);

  // Fetch initial messages
  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  // Join/leave conversation room via WebSocket
  useEffect(() => {
    if (isConnected && conversationId) {
      joinConversation(conversationId);

      return () => {
        leaveConversation(conversationId);
      };
    }
  }, [isConnected, conversationId, joinConversation, leaveConversation]);

  // Listen for new messages
  useEffect(() => {
    const unsubscribe = onNewMessage((message: Message) => {
      if (message.conversationId === conversationId) {
        setMessages((prev) => {
          // Avoid duplicates
          if (prev.some((m) => m.id === message.id)) {
            return prev;
          }
          return [...prev, message];
        });

        // Mark as read since we're viewing this conversation
        api.markAsRead(conversationId);
      }
    });

    return unsubscribe;
  }, [conversationId, onNewMessage]);

  // Listen for typing indicator
  useEffect(() => {
    const unsubscribe = onUserTyping((data) => {
      if (data.isTyping) {
        setTypingUsers((prev) =>
          prev.includes(data.userId) ? prev : [...prev, data.userId]
        );
      } else {
        setTypingUsers((prev) => prev.filter((id) => id !== data.userId));
      }
    });

    return unsubscribe;
  }, [onUserTyping]);

  const sendMessage = async (content: string) => {
    // Clear typing indicator when sending
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }
    setTyping(conversationId, false);

    if (isConnected) {
      // Use WebSocket for real-time
      socketSendMessage(conversationId, content);
    } else {
      // Fallback to REST API
      const data: SendMessageDto = {
        conversationId,
        content,
      };
      const message = await api.sendMessage(data);
      setMessages((prev) => [...prev, message]);
      return message;
    }
  };

  const handleTyping = useCallback(() => {
    setTyping(conversationId, true);

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout to stop typing after 2 seconds of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      setTyping(conversationId, false);
    }, 2000);
  }, [conversationId, setTyping]);

  return {
    conversation,
    messages,
    loading,
    error,
    typingUsers,
    isConnected,
    refresh: fetchMessages,
    sendMessage,
    handleTyping,
  };
}
