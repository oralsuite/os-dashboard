'use client';

import { OrderStatusHistory } from '@/types';
import { getStatusLabel, formatDateTime } from '@/lib/utils';

interface OrderTimelineProps {
  history: OrderStatusHistory[];
}

export function OrderTimeline({ history }: OrderTimelineProps) {
  if (history.length === 0) {
    return <p className="text-gray-500 text-sm">No hay historial de cambios</p>;
  }

  return (
    <div className="flow-root">
      <ul className="-mb-8">
        {history.map((event, index) => (
          <li key={event.id}>
            <div className="relative pb-8">
              {index !== history.length - 1 && (
                <span
                  className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                  aria-hidden="true"
                />
              )}
              <div className="relative flex space-x-3">
                <div>
                  <span className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center ring-8 ring-white">
                    <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                </div>
                <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                  <div>
                    <p className="text-sm text-gray-900">
                      {event.fromStatus ? (
                        <>
                          <span className="font-medium">{getStatusLabel(event.fromStatus)}</span>
                          {' → '}
                        </>
                      ) : null}
                      <span className="font-medium">{getStatusLabel(event.toStatus)}</span>
                    </p>
                    {event.notes && (
                      <p className="text-sm text-gray-500 mt-0.5">{event.notes}</p>
                    )}
                  </div>
                  <div className="whitespace-nowrap text-right text-sm text-gray-500">
                    {formatDateTime(event.changedAt)}
                  </div>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
