'use client';

import { useState } from 'react';
import { OdontogramModal } from './OdontogramModal';

interface TeethSelectorProps {
  id?: string;
  label?: string;
  value: number[];
  onChange: (teeth: number[]) => void;
  error?: string;
}

export function TeethSelector({ id, label, value, onChange, error }: TeethSelectorProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleRemoveTooth = (tooth: number) => {
    onChange(value.filter((t) => t !== tooth));
  };

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}

      <div className="relative">
        {/* Display area */}
        <div
          className={`min-h-[42px] w-full px-3 py-2 border rounded-lg bg-white flex flex-wrap items-center gap-1 cursor-pointer transition-colors ${
            error ? 'border-red-300' : 'border-gray-300 hover:border-gray-400'
          }`}
          onClick={() => setIsModalOpen(true)}
        >
          {value.length > 0 ? (
            value.map((tooth) => (
              <span
                key={tooth}
                className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
              >
                {tooth}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveTooth(tooth);
                  }}
                  className="ml-1 text-blue-600 hover:text-blue-800"
                >
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            ))
          ) : (
            <span className="text-gray-400 text-sm">Seleccionar piezas dentales...</span>
          )}

          {/* Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsModalOpen(true);
            }}
            className="ml-auto flex-shrink-0 p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
            title="Abrir odontograma"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
              />
            </svg>
          </button>
        </div>

        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>

      {/* Modal */}
      <OdontogramModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedTeeth={value}
        onConfirm={onChange}
      />
    </div>
  );
}
