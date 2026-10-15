export type SlotStatus = 'vacant' | 'occupied' | 'reserved';
export type SlotZone = 'A' | 'B' | 'C' | 'D';

export interface ParkingSlot {
  id: string; // e.g. "A-01"
  zone: SlotZone;
  number: number;
  status: SlotStatus;
  x: number; // coordinate on SVG map (0 - 900)
  y: number; // coordinate on SVG map (0 - 550)
  width: number;
  height: number;
  vehicleType?: 'Sedan' | 'SUV' | 'Hatchback' | 'Electric' | 'Pickup';
  vehicleColor?: string;
  confidence: number; // YOLO detection confidence (e.g. 0.94)
  occupiedSince?: string;
  distanceFromEntry: number; // meters from entry gate
}

export interface NavigationStep {
  id: number;
  instruction: string;
  detail: string;
  distanceMeters: number;
  icon: 'straight' | 'right' | 'left' | 'arrive';
}

export interface NavigationRoute {
  targetSlotId: string;
  totalDistanceMeters: number;
  estimatedDriveSeconds: number;
  estimatedWalkMinutes: number;
  steps: NavigationStep[];
  pathPoints: { x: number; y: number }[];
  isRerouted?: boolean;
  rerouteReason?: string;
}

export type ConditionType = 'day' | 'night' | 'rain' | 'shadow' | 'occlusion';

export interface ConditionMetrics {
  condition: ConditionType;
  name: string;
  description: string;
  accuracyWithoutEnhancement: number; // mAP%
  accuracyWithEnhancement: number; // mAP%
  avgConfidence: number;
  falsePositiveRate: number;
  inferenceMs: number;
}

export interface ActivityEvent {
  id: string;
  timestamp: string;
  type: 'vacated' | 'occupied' | 'rerouted' | 'system' | 'navigation';
  message: string;
  slotId?: string;
  zone?: SlotZone;
}

