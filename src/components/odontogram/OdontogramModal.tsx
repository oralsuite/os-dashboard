'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Modal } from '@/components/ui';
import { Button } from '@/components/ui';
import { DentitionType } from './teethData';

// Dynamic import to avoid SSR issues with Three.js
const Odontogram3D = dynamic(
  () => import('./Odontogram3D').then((mod) => mod.Odontogram3D),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[400px] bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="text-gray-500">Cargando odontograma...</div>
      </div>
    ),
  }
);

interface OdontogramModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedTeeth: number[];
  onConfirm: (teeth: number[]) => void;
}

export function OdontogramModal({ isOpen, onClose, selectedTeeth, onConfirm }: OdontogramModalProps) {
  const [tempSelected, setTempSelected] = useState<number[]>(selectedTeeth);
  const [dentitionType, setDentitionType] = useState<DentitionType>('adult');

  useEffect(() => {
    if (isOpen) {
      setTempSelected(selectedTeeth);
    }
  }, [isOpen, selectedTeeth]);

  const handleConfirm = () => {
    onConfirm(tempSelected);
    onClose();
  };

  const handleCancel = () => {
    setTempSelected(selectedTeeth);
    onClose();
  };

  const handleClearAll = () => {
    setTempSelected([]);
  };

  return (
    <Modal isOpen={isOpen} onClose={handleCancel} title="Seleccionar Piezas Dentales" size="xl">
      <div className="space-y-4">
        {/* Dentition Type Toggle */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Tipo de dentición:</span>
            <div className="inline-flex rounded-lg border border-gray-200 p-1 bg-gray-50">
              <button
                type="button"
                onClick={() => {
                  setDentitionType('adult');
                  setTempSelected([]);
                }}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  dentitionType === 'adult'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Adulto (32)
              </button>
              <button
                type="button"
                onClick={() => {
                  setDentitionType('pediatric');
                  setTempSelected([]);
                }}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  dentitionType === 'pediatric'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Pediátrico (20)
              </button>
            </div>
          </div>
          {tempSelected.length > 0 && (
            <button
              type="button"
              onClick={handleClearAll}
              className="text-sm text-red-600 hover:text-red-700"
            >
              Limpiar selección
            </button>
          )}
        </div>

        {/* 3D Odontogram */}
        <Odontogram3D
          selectedTeeth={tempSelected}
          onSelect={setTempSelected}
          dentitionType={dentitionType}
        />

        {/* Instructions */}
        <p className="text-sm text-gray-500 text-center">
          Haz clic en los dientes para seleccionarlos. Usa el mouse para rotar la vista.
        </p>

        {/* Selected teeth summary */}
        {tempSelected.length > 0 && (
          <div className="bg-blue-50 rounded-lg p-3">
            <p className="text-sm font-medium text-blue-800 mb-2">
              Piezas seleccionadas ({tempSelected.length}):
            </p>
            <div className="flex flex-wrap gap-1">
              {tempSelected.map((tooth) => (
                <span
                  key={tooth}
                  className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                >
                  {tooth}
                  <button
                    type="button"
                    onClick={() => setTempSelected(tempSelected.filter((t) => t !== tooth))}
                    className="ml-1 text-blue-600 hover:text-blue-800"
                  >
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="outline" onClick={handleCancel}>
            Cancelar
          </Button>
          <Button type="button" onClick={handleConfirm}>
            Confirmar
          </Button>
        </div>
      </div>
    </Modal>
  );
}
