'use client';

import { Suspense, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text, PerspectiveCamera } from '@react-three/drei';
import { Tooth3D } from './Tooth3D';
import { getTeethData, calculateToothPosition, DentitionType } from './teethData';

interface Odontogram3DProps {
  selectedTeeth: number[];
  onSelect: (teeth: number[]) => void;
  dentitionType: DentitionType;
}

function TeethScene({ selectedTeeth, onSelect, dentitionType }: Odontogram3DProps) {
  const teeth = getTeethData(dentitionType);

  const handleToothSelect = useCallback((toothNumber: number) => {
    if (selectedTeeth.includes(toothNumber)) {
      onSelect(selectedTeeth.filter((n) => n !== toothNumber));
    } else {
      onSelect([...selectedTeeth, toothNumber].sort((a, b) => a - b));
    }
  }, [selectedTeeth, onSelect]);

  return (
    <>
      {/* Camera */}
      <PerspectiveCamera makeDefault position={[0, 5, 8]} fov={50} />

      {/* Lights */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 10, 5]} intensity={0.8} castShadow />
      <directionalLight position={[-5, 10, -5]} intensity={0.4} />
      <pointLight position={[0, 5, 5]} intensity={0.3} />

      {/* Teeth */}
      {teeth.map((tooth) => {
        const position = calculateToothPosition(tooth, dentitionType);
        const isUpper = tooth.quadrant <= 2;
        return (
          <Tooth3D
            key={tooth.number}
            number={tooth.number}
            position={position}
            isSelected={selectedTeeth.includes(tooth.number)}
            onSelect={handleToothSelect}
            toothType={tooth.type}
            isUpper={isUpper}
          />
        );
      })}

      {/* Labels */}
      <Text
        position={[-3, 2.2, 0]}
        fontSize={0.3}
        color="#6b7280"
        anchorX="center"
      >
        Superior Derecho
      </Text>
      <Text
        position={[3, 2.2, 0]}
        fontSize={0.3}
        color="#6b7280"
        anchorX="center"
      >
        Superior Izquierdo
      </Text>
      <Text
        position={[-3, -2.2, 0]}
        fontSize={0.3}
        color="#6b7280"
        anchorX="center"
      >
        Inferior Derecho
      </Text>
      <Text
        position={[3, -2.2, 0]}
        fontSize={0.3}
        color="#6b7280"
        anchorX="center"
      >
        Inferior Izquierdo
      </Text>

      {/* Center line */}
      <mesh position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.01, 0.01, 4, 8]} />
        <meshBasicMaterial color="#d1d5db" />
      </mesh>

      {/* Orbit Controls */}
      <OrbitControls
        enablePan={false}
        minDistance={5}
        maxDistance={15}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 2}
      />
    </>
  );
}

function LoadingFallback() {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshBasicMaterial color="#e5e7eb" wireframe />
    </mesh>
  );
}

export function Odontogram3D({ selectedTeeth, onSelect, dentitionType }: Odontogram3DProps) {
  return (
    <div className="w-full h-[400px] bg-gradient-to-b from-gray-50 to-gray-100 rounded-lg overflow-hidden">
      <Canvas>
        <Suspense fallback={<LoadingFallback />}>
          <TeethScene
            selectedTeeth={selectedTeeth}
            onSelect={onSelect}
            dentitionType={dentitionType}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
