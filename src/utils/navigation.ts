import { ParkingSlot, NavigationRoute, NavigationStep } from '../types/parking';

export function calculateRouteToSlot(slot: ParkingSlot, isRerouted = false, rerouteReason?: string): NavigationRoute {
  const entryX = 60;
  const entryY = 520;

  // Determine lane Y based on slot zone
  let laneY = 445; // default row D lane
  let zoneName = 'Row D (South Bay)';
  if (slot.zone === 'C') {
    laneY = 305;
    zoneName = 'Row C (Central South)';
  } else if (slot.zone === 'B') {
    laneY = 165;
    zoneName = 'Row B (Central North)';
  } else if (slot.zone === 'A') {
    laneY = 165; // access from lane between A & B
    zoneName = 'Row A (North Bay)';
  }

  const slotCenterX = slot.x + slot.width / 2;
  const slotCenterY = slot.y + slot.height / 2;

  // Waypoints along legal driving lanes
  const pathPoints = [
    { x: entryX, y: entryY },
    { x: 80, y: entryY },
    { x: 80, y: laneY },
    { x: slotCenterX, y: laneY },
    { x: slotCenterX, y: slotCenterY },
  ];

  // Distances in meters (scaled for lot)
  const verticalMeters = Math.round(Math.abs(entryY - laneY) * 0.12);
  const horizontalMeters = Math.round(Math.abs(slotCenterX - 80) * 0.14);
  const totalDistance = Math.max(18, verticalMeters + horizontalMeters + 8);
  const driveSeconds = Math.round((totalDistance / 3.5) + 6); // ~12 km/h
  const walkMinutes = Number(((totalDistance * 0.8) / 75).toFixed(1));

  const steps: NavigationStep[] = [
    {
      id: 1,
      instruction: 'Enter Lot via Gate 1',
      detail: 'Proceed straight along West Access Avenue for 10m',
      distanceMeters: 10,
      icon: 'straight',
    },
    {
      id: 2,
      instruction: `Turn Right into ${zoneName}`,
      detail: `Drive down the driving lane past ${Math.max(1, slot.number - 1)} bays`,
      distanceMeters: horizontalMeters,
      icon: 'right',
    },
    {
      id: 3,
      instruction: `Arrive at Slot ${slot.id}`,
      detail: `Pull into vacant bay ${slot.id} on your ${slot.zone === 'A' || slot.zone === 'C' ? 'left' : 'right'}`,
      distanceMeters: 8,
      icon: 'arrive',
    },
  ];

  return {
    targetSlotId: slot.id,
    totalDistanceMeters: totalDistance,
    estimatedDriveSeconds: driveSeconds,
    estimatedWalkMinutes: walkMinutes,
    steps,
    pathPoints,
    isRerouted,
    rerouteReason,
  };
}

export function findNearestVacantSlot(slots: ParkingSlot[]): ParkingSlot | null {
  const vacantSlots = slots.filter((s) => s.status === 'vacant');
  if (vacantSlots.length === 0) return null;

  // Sort by calculated distance from entry gate (80, 520)
  return [...vacantSlots].sort((a, b) => a.distanceFromEntry - b.distanceFromEntry)[0];
}
