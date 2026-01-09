'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useConversations, useChat } from '@/hooks/useChat';
import { ConversationList, ChatWindow } from '@/components/chat';
import { Card, Spinner, Button, Modal, Select } from '@/components/ui';
import { Conversation } from '@/types';
import { useAuth } from '@/lib/auth';
import { useLaboratories } from '@/hooks/useLaboratories';

export default function ChatPage() {
  const searchParams = useSearchParams();
  const orderIdParam = searchParams.get('orderId');
  const { user } = useAuth();
  const { conversations, loading, createConversation, refresh } = useConversations();
  const { laboratories } = useLaboratories();
  const isDentist = user?.role === 'DENTIST';

  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [showNewChat, setShowNewChat] = useState(false);
  const [selectedLabId, setSelectedLabId] = useState('');
  const [creatingChat, setCreatingChat] = useState(false);

  // Auto-select or create conversation for order
  useEffect(() => {
    if (orderIdParam && conversations.length > 0) {
      const orderConversation = conversations.find(c => c.orderId === orderIdParam);
      if (orderConversation) {
        setSelectedConversation(orderConversation);
      }
    }
  }, [orderIdParam, conversations]);

  const handleSelectConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation);
  };

  const handleCreateConversation = async () => {
    if (!selectedLabId) return;

    setCreatingChat(true);
    try {
      const conversation = await createConversation({
        laboratoryId: selectedLabId,
        orderId: orderIdParam || undefined,
      });
      setSelectedConversation(conversation);
      setShowNewChat(false);
      setSelectedLabId('');
      refresh();
    } catch (err) {
      console.error(err);
    } finally {
      setCreatingChat(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mensajes</h1>
          <p className="text-gray-500 mt-1">
            Comunícate con {isDentist ? 'laboratorios' : 'dentistas'}
          </p>
        </div>

        {isDentist && (
          <Button onClick={() => setShowNewChat(true)}>
            <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Nueva Conversación
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-240px)]">
        {/* Conversations List */}
        <Card padding="none" className="lg:col-span-1 overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Conversaciones</h2>
          </div>
          <div className="overflow-y-auto h-[calc(100%-57px)]">
            {loading ? (
              <div className="flex justify-center py-8">
                <Spinner />
              </div>
            ) : conversations.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                <p>No hay conversaciones</p>
                {isDentist && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={() => setShowNewChat(true)}
                  >
                    Iniciar conversación
                  </Button>
                )}
              </div>
            ) : (
              <ConversationList
                conversations={conversations}
                selectedId={selectedConversation?.id}
                onSelect={handleSelectConversation}
              />
            )}
          </div>
        </Card>

        {/* Chat Window */}
        <Card padding="none" className="lg:col-span-2 overflow-hidden flex flex-col">
          {selectedConversation ? (
            <ChatContent conversationId={selectedConversation.id} />
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <svg className="h-12 w-12 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <p>Selecciona una conversación para comenzar</p>
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* New Conversation Modal */}
      <Modal
        isOpen={showNewChat}
        onClose={() => setShowNewChat(false)}
        title="Nueva Conversación"
        size="md"
      >
        <div className="space-y-4">
          <Select
            id="laboratoryId"
            label="Selecciona un laboratorio"
            value={selectedLabId}
            onChange={(e) => setSelectedLabId(e.target.value)}
            options={laboratories.map((lab) => ({
              value: lab.id,
              label: lab.laboratoryProfile?.businessName || lab.email,
            }))}
            placeholder="Selecciona..."
          />

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => setShowNewChat(false)}>
              Cancelar
            </Button>
            <Button
              onClick={handleCreateConversation}
              loading={creatingChat}
              disabled={!selectedLabId}
            >
              Iniciar Conversación
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

function ChatContent({ conversationId }: { conversationId: string }) {
  const { conversation, messages, loading, sendMessage, typingUsers, isConnected, handleTyping } = useChat(conversationId);

  return (
    <ChatWindow
      conversation={conversation}
      messages={messages}
      loading={loading}
      onSendMessage={sendMessage}
      typingUsers={typingUsers}
      isConnected={isConnected}
      onTyping={handleTyping}
    />
  );
}
