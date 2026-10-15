import { ParkingSlot, ConditionMetrics } from '../types/parking';

// Create 60 realistic slots across 4 rows / zones
// Zone A: row 1 (y: 65), Zone B: row 2 (y: 195), Zone C: row 3 (y: 335), Zone D: row 4 (y: 475)
// Driving lanes run at y: 130, y: 265, y: 405, and vertical access avenues at x: 90 and x: 860
export const initialSlots: ParkingSlot[] = [
  // ZONE A (Top Row: A-01 to A-15)
  ...Array.from({ length: 15 }, (_, i) => {
    const num = i + 1;
    const x = 120 + i * 48;
    const isOccupied = [1, 2, 4, 5, 7, 8, 10, 11, 13, 14, 15].includes(num);
    const colors = ['#E2E8F0', '#3B82F6', '#EF4444', '#10B981', '#64748B', '#F59E0B', '#1E293B'];
    const types: ('Sedan' | 'SUV' | 'Hatchback' | 'Electric' | 'Pickup')[] = ['Sedan', 'SUV', 'Hatchback', 'Electric'];
    return {
      id: `A-${num < 10 ? '0' + num : num}`,
      zone: 'A' as const,
      number: num,
      status: isOccupied ? ('occupied' as const) : ('vacant' as const),
      x,
      y: 65,
      width: 42,
      height: 58,
      vehicleType: isOccupied ? types[num % types.length] : undefined,
      vehicleColor: isOccupied ? colors[num % colors.length] : undefined,
      confidence: isOccupied ? Number((0.92 + (num % 7) * 0.01).toFixed(2)) : Number((0.89 + (num % 5) * 0.02).toFixed(2)),
      occupiedSince: isOccupied ? `${Math.floor(num * 7 + 12)}m ago` : undefined,
      distanceFromEntry: 110 + num * 6,
    };
  }),

  // ZONE B (Upper-Mid Row: B-01 to B-15)
  ...Array.from({ length: 15 }, (_, i) => {
    const num = i + 1;
    const x = 120 + i * 48;
    const isOccupied = [2, 3, 6, 7, 9, 12, 13, 14].includes(num);
    const colors = ['#38BDF8', '#F97316', '#64748B', '#0F172A', '#E2E8F0'];
    const types: ('Sedan' | 'SUV' | 'Hatchback' | 'Electric' | 'Pickup')[] = ['SUV', 'Sedan', 'Electric', 'Hatchback'];
    return {
      id: `B-${num < 10 ? '0' + num : num}`,
      zone: 'B' as const,
      number: num,
      status: isOccupied ? ('occupied' as const) : ('vacant' as const),
      x,
      y: 195,
      width: 42,
      height: 58,
      vehicleType: isOccupied ? types[num % types.length] : undefined,
      vehicleColor: isOccupied ? colors[num % colors.length] : undefined,
      confidence: isOccupied ? Number((0.91 + (num % 8) * 0.01).toFixed(2)) : Number((0.90 + (num % 4) * 0.02).toFixed(2)),
      occupiedSince: isOccupied ? `${Math.floor(num * 5 + 8)}m ago` : undefined,
      distanceFromEntry: 80 + num * 6,
    };
  }),

  // ZONE C (Lower-Mid Row: C-01 to C-15)
  ...Array.from({ length: 15 }, (_, i) => {
    const num = i + 1;
    const x = 120 + i * 48;
    const isOccupied = [1, 3, 4, 5, 8, 10, 11, 14, 15].includes(num);
    const colors = ['#E2E8F0', '#475569', '#EF4444', '#10B981', '#3B82F6'];
    const types: ('Sedan' | 'SUV' | 'Hatchback' | 'Electric' | 'Pickup')[] = ['Sedan', 'Hatchback', 'SUV', 'Electric'];
    return {
      id: `C-${num < 10 ? '0' + num : num}`,
      zone: 'C' as const,
      number: num,
      status: isOccupied ? ('occupied' as const) : ('vacant' as const),
      x,
      y: 335,
      width: 42,
      height: 58,
      vehicleType: isOccupied ? types[num % types.length] : undefined,
      vehicleColor: isOccupied ? colors[num % colors.length] : undefined,
      confidence: isOccupied ? Number((0.93 + (num % 6) * 0.01).toFixed(2)) : Number((0.91 + (num % 4) * 0.02).toFixed(2)),
      occupiedSince: isOccupied ? `${Math.floor(num * 6 + 15)}m ago` : undefined,
      distanceFromEntry: 50 + num * 6,
    };
  }),

  // ZONE D (Bottom Row: D-01 to D-15)
  ...Array.from({ length: 15 }, (_, i) => {
    const num = i + 1;
    const x = 120 + i * 48;
    const isOccupied = [2, 4, 6, 7, 9, 10, 12, 13].includes(num);
    const colors = ['#3B82F6', '#E2E8F0', '#0F172A', '#8B5CF6'];
    const types: ('Sedan' | 'SUV' | 'Hatchback' | 'Electric' | 'Pickup')[] = ['Electric', 'Sedan', 'SUV', 'Pickup'];
    return {
      id: `D-${num < 10 ? '0' + num : num}`,
      zone: 'D' as const,
      number: num,
      status: isOccupied ? ('occupied' as const) : ('vacant' as const),
      x,
      y: 475,
      width: 42,
      height: 58,
      vehicleType: isOccupied ? types[num % types.length] : undefined,
      vehicleColor: isOccupied ? colors[num % colors.length] : undefined,
      confidence: isOccupied ? Number((0.94 + (num % 5) * 0.01).toFixed(2)) : Number((0.93 + (num % 4) * 0.01).toFixed(2)),
      occupiedSince: isOccupied ? `${Math.floor(num * 4 + 5)}m ago` : undefined,
      distanceFromEntry: 25 + num * 6,
    };
  }),
];

// Conditions Environmental Presets
export const conditionPresets: Record<string, ConditionMetrics> = {
  day: {
    condition: 'day',
    name: 'Daylight (Clear)',
    description: 'Optimum ambient sunlight, clean asphalt contrast, minimal glare.',
    accuracyWithoutEnhancement: 97.4,
    accuracyWithEnhancement: 98.9,
    avgConfidence: 94.2,
    falsePositiveRate: 0.8,
    inferenceMs: 38.2,
  },
  night: {
    condition: 'night',
    name: 'Night (Low Light)',
    description: 'Dim illumination from sodium/LED floodlights, vehicle headlight glare, ISO sensor noise.',
    accuracyWithoutEnhancement: 78.6,
    accuracyWithEnhancement: 96.1,
    avgConfidence: 89.4,
    falsePositiveRate: 3.4,
    inferenceMs: 41.5,
  },
  rain: {
    condition: 'rain',
    name: 'Rain & Wet Pavement',
    description: 'Water droplet refraction on lens, specular street puddle reflections, wiper motion blur.',
    accuracyWithoutEnhancement: 74.2,
    accuracyWithEnhancement: 95.3,
    avgConfidence: 88.1,
    falsePositiveRate: 4.1,
    inferenceMs: 42.8,
  },
  shadow: {
    condition: 'shadow',
    name: 'High Dynamic Range Shadows',
    description: 'Harsh structural tree and building cast shadows causing localized underexposure across bays.',
    accuracyWithoutEnhancement: 81.5,
    accuracyWithEnhancement: 96.8,
    avgConfidence: 91.0,
    falsePositiveRate: 2.2,
    inferenceMs: 39.7,
  },
  occlusion: {
    condition: 'occlusion',
    name: 'Partial Bay Occlusion',
    description: 'Tall SUVs, pillars, or passing delivery vans partially obstructing slot boundary lines.',
    accuracyWithoutEnhancement: 72.8,
    accuracyWithEnhancement: 94.6,
    avgConfidence: 87.5,
    falsePositiveRate: 4.8,
    inferenceMs: 43.1,
  },
};


// Architecture Comparison Matrix
export const systemComparison = [
  {
    feature: 'CapEx (Setup Cost per 100 slots)',
    proposed: '$120 - $180 total (1 Pi 5 + 1 Camera)',
    ultrasonic: '$3,500 - $6,000 (100 individual sensors + wiring)',
    anpr: '$1,200 - $2,500 (Entrance/exit gate cameras only)',
    apps: '$0 hardware, $800+ monthly listing fees',
    proposedWinner: true,
  },
  {
    feature: 'Slot-Level Real-Time Detection',
    proposed: 'Yes (Precise bay coordinates)',
    ultrasonic: 'Yes (Per slot ground sensor)',
    anpr: 'No (Only lot-level aggregate count)',
    apps: 'No (Relies on manual self-reporting)',
    proposedWinner: true,
  },
  {
    feature: 'In-Lot Turn-by-Turn Navigation',
    proposed: 'Yes (Shortest-path SVG/Vector route)',
    ultrasonic: 'Limited (Overhead LED indicators only)',
    anpr: 'No in-lot navigation capability',
    apps: 'External GPS to gate only',
    proposedWinner: true,
  },
  {
    feature: 'Installation & Civil Disruption',
    proposed: 'Zero asphalt drilling; single pole mount',
    ultrasonic: 'Heavy civil trenching & road closure',
    anpr: 'Moderate gate barrier infrastructure',
    apps: 'Software-only, no physical installation',
    proposedWinner: true,
  },
  {
    feature: 'Maintenance & Hardware Degradation',
    proposed: 'Minimal (Protected elevated camera box)',
    ultrasonic: 'High (Vehicle rollover damage, battery swap)',
    anpr: 'Moderate (Gate mechanical wear)',
    apps: 'Low hardware, high subscription overhead',
    proposedWinner: true,
  },
  {
    feature: 'Edge AI Latency',
    proposed: '~38 ms (On-device real-time inference)',
    ultrasonic: '1,000 - 3,000 ms (LoRaWAN/ZigBee polling)',
    anpr: '200 - 500 ms at barrier',
    apps: '10,000 - 30,000 ms (Cloud sync delay)',
    proposedWinner: true,
  },
];

// 24-Hour Occupancy Profile
export const hourlyOccupancyData = [
  { time: '00:00', occupancy: 12, rate: 20 },
  { time: '02:00', occupancy: 8, rate: 13 },
  { time: '04:00', occupancy: 7, rate: 11 },
  { time: '06:00', occupancy: 15, rate: 25 },
  { time: '08:00', occupancy: 42, rate: 70 },
  { time: '09:00', occupancy: 56, rate: 93 }, // Morning Peak
  { time: '10:00', occupancy: 54, rate: 90 },
  { time: '12:00', occupancy: 48, rate: 80 },
  { time: '14:00', occupancy: 51, rate: 85 },
  { time: '16:00', occupancy: 53, rate: 88 },
  { time: '17:30', occupancy: 58, rate: 96 }, // Evening Peak
  { time: '19:00', occupancy: 44, rate: 73 },
  { time: '21:00', occupancy: 28, rate: 46 },
  { time: '23:00', occupancy: 18, rate: 30 },
];

// Search Time & Environmental Impact
export const searchTimeComparison = [
  { metric: 'Morning Rush (8:30 - 10:00 AM)', withoutSystem: 16.4, withSystem: 2.8 },
  { metric: 'Mid-Day Lunch (12:00 - 1:30 PM)', withoutSystem: 11.2, withSystem: 1.9 },
  { metric: 'Evening Peak (5:00 - 7:00 PM)', withoutSystem: 17.8, withSystem: 3.1 },
  { metric: 'Off-Peak Hours', withoutSystem: 6.5, withSystem: 1.2 },
];

// Model Prediction Accuracy Progression (Training vs Validation across Epochs)
export const modelAccuracyProgression = [
  { epoch: 'Ep 5', trainAcc: 76.4, valAcc: 73.1, loss: 0.62 },
  { epoch: 'Ep 10', trainAcc: 82.1, valAcc: 79.5, loss: 0.48 },
  { epoch: 'Ep 15', trainAcc: 87.5, valAcc: 84.8, loss: 0.36 },
  { epoch: 'Ep 20', trainAcc: 91.2, valAcc: 88.9, loss: 0.27 },
  { epoch: 'Ep 25', trainAcc: 93.4, valAcc: 91.6, loss: 0.21 },
  { epoch: 'Ep 30', trainAcc: 95.1, valAcc: 93.8, loss: 0.16 },
  { epoch: 'Ep 35', trainAcc: 96.3, valAcc: 94.9, loss: 0.13 },
  { epoch: 'Ep 40', trainAcc: 97.0, valAcc: 95.7, loss: 0.11 },
  { epoch: 'Ep 45', trainAcc: 97.5, valAcc: 96.1, loss: 0.09 },
  { epoch: 'Ep 50', trainAcc: 97.8, valAcc: 96.5, loss: 0.07 },
];

// Model Precision Progression (Training vs Validation across Epochs)
export const modelPrecisionProgression = [
  { epoch: 'Ep 5', trainPrec: 77.8, valPrec: 74.2 },
  { epoch: 'Ep 10', trainPrec: 83.5, valPrec: 80.6 },
  { epoch: 'Ep 15', trainPrec: 88.2, valPrec: 85.3 },
  { epoch: 'Ep 20', trainPrec: 92.0, valPrec: 89.4 },
  { epoch: 'Ep 25', trainPrec: 94.1, valPrec: 92.1 },
  { epoch: 'Ep 30', trainPrec: 95.6, valPrec: 94.2 },
  { epoch: 'Ep 35', trainPrec: 96.7, valPrec: 95.3 },
  { epoch: 'Ep 40', trainPrec: 97.3, valPrec: 96.0 },
  { epoch: 'Ep 45', trainPrec: 97.9, valPrec: 96.4 },
  { epoch: 'Ep 50', trainPrec: 98.2, valPrec: 96.8 },
];

// Accuracy & Precision across Detection Confidence Thresholds
export const confidenceAccuracyData = [
  { threshold: '0.10', accuracy: 84.2, precision: 81.0, recall: 99.2 },
  { threshold: '0.20', accuracy: 89.5, precision: 86.4, recall: 98.7 },
  { threshold: '0.30', accuracy: 93.8, precision: 91.2, recall: 98.1 },
  { threshold: '0.40', accuracy: 95.9, precision: 94.8, recall: 96.9 },
  { threshold: '0.50', accuracy: 96.5, precision: 96.8, recall: 95.4 },
  { threshold: '0.60', accuracy: 95.8, precision: 97.5, recall: 92.1 },
  { threshold: '0.70', accuracy: 94.1, precision: 98.2, recall: 87.5 },
  { threshold: '0.80', accuracy: 90.7, precision: 98.9, recall: 80.2 },
  { threshold: '0.90', accuracy: 83.2, precision: 99.4, recall: 69.8 },
];

// Model Evaluation Report by Detection Class
export interface ModelClassMetric {
  className: string;
  testSamples: number;
  precision: number;
  recall: number;
  f1Score: number;
  accuracy: number;
}

export const modelEvaluationReport: ModelClassMetric[] = [
  { className: 'Car (Sedan)', testSamples: 1420, precision: 97.2, recall: 96.1, f1Score: 96.6, accuracy: 96.8 },
  { className: 'SUV / Large Vehicle', testSamples: 680, precision: 95.8, recall: 94.2, f1Score: 95.0, accuracy: 95.4 },
  { className: 'Vacant Bay', testSamples: 1850, precision: 98.1, recall: 97.5, f1Score: 97.8, accuracy: 97.9 },
  { className: 'All Classes (Overall)', testSamples: 3950, precision: 96.8, recall: 95.4, f1Score: 96.1, accuracy: 96.5 },
];

