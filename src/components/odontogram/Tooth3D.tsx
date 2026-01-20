'use client';

import { useRef, useState } from 'react';
import { Mesh } from 'three';

export type ToothType = 'incisor' | 'canine' | 'premolar' | 'molar';

interface Tooth3DProps {
  number: number;
  position: [number, number, number];
  isSelected: boolean;
  onSelect: (number: number) => void;
  toothType: ToothType;
  isUpper: boolean;
}

const COLORS = {
  default: '#f8f8f8',
  hover: '#93c5fd',
  selected: '#3b82f6',
  edge: '#d1d5db',
};

function getToothGeometry(toothType: ToothType): { width: number; height: number; depth: number } {
  switch (toothType) {
    case 'incisor':
      return { width: 0.35, height: 0.5, depth: 0.2 };
    case 'canine':
      return { width: 0.35, height: 0.55, depth: 0.25 };
    case 'premolar':
      return { width: 0.4, height: 0.45, depth: 0.35 };
    case 'molar':
      return { width: 0.55, height: 0.4, depth: 0.5 };
    default:
      return { width: 0.4, height: 0.45, depth: 0.3 };
  }
}

export function Tooth3D({ number, position, isSelected, onSelect, toothType, isUpper }: Tooth3DProps) {
  const meshRef = useRef<Mesh>(null);
  const [hovered, setHovered] = useState(false);

  const { width, height, depth } = getToothGeometry(toothType);
  const color = isSelected ? COLORS.selected : hovered ? COLORS.hover : COLORS.default;

  return (
    <group position={position}>
      {/* Main tooth body */}
      <mesh
        ref={meshRef}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(number);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = 'default';
        }}
      >
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial
          color={color}
          roughness={0.3}
          metalness={0.1}
        />
      </mesh>

      {/* Root (simplified) - only visible from certain angles */}
      <mesh position={[0, isUpper ? height * 0.6 : -height * 0.6, 0]}>
        <boxGeometry args={[width * 0.4, height * 0.4, depth * 0.4]} />
        <meshStandardMaterial
          color={color}
          roughness={0.4}
          metalness={0.05}
        />
      </mesh>

      {/* Crown surface detail for molars/premolars */}
      {(toothType === 'molar' || toothType === 'premolar') && (
        <mesh position={[0, isUpper ? -height * 0.25 : height * 0.25, 0]}>
          <boxGeometry args={[width * 0.8, height * 0.1, depth * 0.8]} />
          <meshStandardMaterial
            color={COLORS.edge}
            roughness={0.5}
            metalness={0}
          />
        </mesh>
      )}

      {/* Canine point */}
      {toothType === 'canine' && (
        <mesh position={[0, isUpper ? -height * 0.35 : height * 0.35, 0]}>
          <coneGeometry args={[width * 0.3, height * 0.2, 4]} />
          <meshStandardMaterial
            color={color}
            roughness={0.3}
            metalness={0.1}
          />
        </mesh>
      )}
    </group>
  );
}
