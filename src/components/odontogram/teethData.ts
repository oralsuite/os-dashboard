import { ToothType } from './Tooth3D';

interface ToothData {
  number: number;
  type: ToothType;
  quadrant: 1 | 2 | 3 | 4;
  position: number;
}

// Adult teeth (32 teeth) - FDI notation
// Quadrant 1: Upper Right (11-18)
// Quadrant 2: Upper Left (21-28)
// Quadrant 3: Lower Left (31-38)
// Quadrant 4: Lower Right (41-48)
export const ADULT_TEETH: ToothData[] = [
  // Upper Right (Quadrant 1) - from center to back
  { number: 11, type: 'incisor', quadrant: 1, position: 1 },
  { number: 12, type: 'incisor', quadrant: 1, position: 2 },
  { number: 13, type: 'canine', quadrant: 1, position: 3 },
  { number: 14, type: 'premolar', quadrant: 1, position: 4 },
  { number: 15, type: 'premolar', quadrant: 1, position: 5 },
  { number: 16, type: 'molar', quadrant: 1, position: 6 },
  { number: 17, type: 'molar', quadrant: 1, position: 7 },
  { number: 18, type: 'molar', quadrant: 1, position: 8 },

  // Upper Left (Quadrant 2) - from center to back
  { number: 21, type: 'incisor', quadrant: 2, position: 1 },
  { number: 22, type: 'incisor', quadrant: 2, position: 2 },
  { number: 23, type: 'canine', quadrant: 2, position: 3 },
  { number: 24, type: 'premolar', quadrant: 2, position: 4 },
  { number: 25, type: 'premolar', quadrant: 2, position: 5 },
  { number: 26, type: 'molar', quadrant: 2, position: 6 },
  { number: 27, type: 'molar', quadrant: 2, position: 7 },
  { number: 28, type: 'molar', quadrant: 2, position: 8 },

  // Lower Left (Quadrant 3) - from center to back
  { number: 31, type: 'incisor', quadrant: 3, position: 1 },
  { number: 32, type: 'incisor', quadrant: 3, position: 2 },
  { number: 33, type: 'canine', quadrant: 3, position: 3 },
  { number: 34, type: 'premolar', quadrant: 3, position: 4 },
  { number: 35, type: 'premolar', quadrant: 3, position: 5 },
  { number: 36, type: 'molar', quadrant: 3, position: 6 },
  { number: 37, type: 'molar', quadrant: 3, position: 7 },
  { number: 38, type: 'molar', quadrant: 3, position: 8 },

  // Lower Right (Quadrant 4) - from center to back
  { number: 41, type: 'incisor', quadrant: 4, position: 1 },
  { number: 42, type: 'incisor', quadrant: 4, position: 2 },
  { number: 43, type: 'canine', quadrant: 4, position: 3 },
  { number: 44, type: 'premolar', quadrant: 4, position: 4 },
  { number: 45, type: 'premolar', quadrant: 4, position: 5 },
  { number: 46, type: 'molar', quadrant: 4, position: 6 },
  { number: 47, type: 'molar', quadrant: 4, position: 7 },
  { number: 48, type: 'molar', quadrant: 4, position: 8 },
];

// Pediatric teeth (20 teeth) - FDI notation
// Quadrant 5: Upper Right (51-55)
// Quadrant 6: Upper Left (61-65)
// Quadrant 7: Lower Left (71-75)
// Quadrant 8: Lower Right (81-85)
export const PEDIATRIC_TEETH: ToothData[] = [
  // Upper Right (Quadrant 5) - from center to back
  { number: 51, type: 'incisor', quadrant: 1, position: 1 },
  { number: 52, type: 'incisor', quadrant: 1, position: 2 },
  { number: 53, type: 'canine', quadrant: 1, position: 3 },
  { number: 54, type: 'molar', quadrant: 1, position: 4 },
  { number: 55, type: 'molar', quadrant: 1, position: 5 },

  // Upper Left (Quadrant 6) - from center to back
  { number: 61, type: 'incisor', quadrant: 2, position: 1 },
  { number: 62, type: 'incisor', quadrant: 2, position: 2 },
  { number: 63, type: 'canine', quadrant: 2, position: 3 },
  { number: 64, type: 'molar', quadrant: 2, position: 4 },
  { number: 65, type: 'molar', quadrant: 2, position: 5 },

  // Lower Left (Quadrant 7) - from center to back
  { number: 71, type: 'incisor', quadrant: 3, position: 1 },
  { number: 72, type: 'incisor', quadrant: 3, position: 2 },
  { number: 73, type: 'canine', quadrant: 3, position: 3 },
  { number: 74, type: 'molar', quadrant: 3, position: 4 },
  { number: 75, type: 'molar', quadrant: 3, position: 5 },

  // Lower Right (Quadrant 8) - from center to back
  { number: 81, type: 'incisor', quadrant: 4, position: 1 },
  { number: 82, type: 'incisor', quadrant: 4, position: 2 },
  { number: 83, type: 'canine', quadrant: 4, position: 3 },
  { number: 84, type: 'molar', quadrant: 4, position: 4 },
  { number: 85, type: 'molar', quadrant: 4, position: 5 },
];

export type DentitionType = 'adult' | 'pediatric';

export function getTeethData(dentitionType: DentitionType) {
  return dentitionType === 'adult' ? ADULT_TEETH : PEDIATRIC_TEETH;
}

export function calculateToothPosition(
  tooth: ToothData,
  dentitionType: DentitionType
): [number, number, number] {
  const maxTeethPerQuadrant = dentitionType === 'adult' ? 8 : 5;
  const spacing = 0.55;
  const archRadius = dentitionType === 'adult' ? 3.5 : 2.5;

  // Calculate X position (left-right)
  let x: number;
  if (tooth.quadrant === 1 || tooth.quadrant === 4) {
    // Right side - negative X
    x = -tooth.position * spacing;
  } else {
    // Left side - positive X
    x = tooth.position * spacing;
  }

  // Calculate Y position (up-down)
  const y = tooth.quadrant <= 2 ? 1 : -1;

  // Calculate Z position (front-back) - create arch curve
  const normalizedPos = tooth.position / maxTeethPerQuadrant;
  const z = -normalizedPos * archRadius * 0.5;

  return [x, y, z];
}
