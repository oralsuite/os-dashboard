'use client';

import { Conversation } from '@/types';
import { useAuth } from '@/lib/auth';
import { formatDateTime, getUserDisplayName } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface ConversationListProps {
  conversations: Conversation[];
  selectedId?: string;
  onSelect: (conversation: Conversation) => void;
}

export function ConversationList({ conversations, selectedId, onSelect }: ConversationListProps) {
  const { user } = useAuth();
  const isDentist = user?.role === 'DENTIST';

  if (conversations.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        No hay conversaciones aún
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-100">
      {conversations.map((conversation) => {
        const otherParty = isDentist ? conversation.laboratory : conversation.dentist;
        const otherName = otherParty ? getUserDisplayName(otherParty) : 'Usuario';
        const isSelected = conversation.id === selectedId;
        const lastMessage = conversation.messages?.[conversation.messages.length - 1];

        return (
          <button
            key={conversation.id}
            onClick={() => onSelect(conversation)}
            className={cn(
              'w-full p-4 text-left hover:bg-gray-50 transition-colors',
              isSelected && 'bg-blue-50'
            )}
          >
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600 font-medium shrink-0">
                {otherName.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-gray-900 truncate">{otherName}</h3>
                  {conversation.lastMessageAt && (
                    <span className="text-xs text-gray-500 shrink-0">
                      {formatDateTime(conversation.lastMessageAt)}
                    </span>
                  )}
                </div>
                {conversation.order && (
                  <p className="text-xs text-blue-600 mt-0.5">
                    Orden #{conversation.order.orderNumber}
                  </p>
                )}
                {lastMessage && (
                  <p className="text-sm text-gray-500 truncate mt-1">
                    {lastMessage.content}
                  </p>
                )}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
