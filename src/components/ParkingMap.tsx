import React, { useState } from 'react';
import { ParkingSlot, NavigationRoute } from '../types/parking';

interface ParkingMapProps {
  slots: ParkingSlot[];
  navigationRoute: NavigationRoute | null;
  selectedSlot: ParkingSlot | null;
  onSelectSlot: (slot: ParkingSlot) => void;
  onNavigateToSlot: (slot: ParkingSlot) => void;
}

export const ParkingMap: React.FC<ParkingMapProps> = ({
  slots,
  navigationRoute,
  selectedSlot,
  onSelectSlot,
  onNavigateToSlot,
}) => {
  const [hoveredSlot, setHoveredSlot] = useState<ParkingSlot | null>(null);

  // Group zones
  const zones: { id: 'A' | 'B' | 'C' | 'D'; name: string; y: number }[] = [
    { id: 'A', name: 'Zone A', y: 48 },
    { id: 'B', name: 'Zone B', y: 178 },
    { id: 'C', name: 'Zone C', y: 318 },
    { id: 'D', name: 'Zone D', y: 458 },
  ];

  // SVG route path
  const routePathD = navigationRoute
    ? navigationRoute.pathPoints
        .map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
        .join(' ')
    : '';

  return (
    <div className="relative w-full rounded-2xl bg-slate-900 border border-slate-800 p-3 sm:p-4 shadow-xs overflow-hidden select-none">
      {/* Map Header & Legend */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3 text-xs">
        <span className="font-semibold text-slate-200">
          Parking Layout (60 Bays)
        </span>

        {/* Legend */}
        <div className="flex items-center gap-3 text-[11px] text-slate-300">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-xs bg-emerald-500"></span>
            <span>Available</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-xs bg-slate-500"></span>
            <span>Occupied</span>
          </div>
          {navigationRoute && (
            <div className="flex items-center gap-1.5 text-slate-300">
              <span className="w-2.5 h-0.5 bg-sky-400"></span>
              <span>Active Route</span>
            </div>
          )}
        </div>
      </div>

      {/* SVG Canvas */}
      <div className="w-full aspect-[920/560] max-h-[560px] relative">
        <svg
          viewBox="0 0 920 560"
          className="w-full h-full rounded-xl bg-slate-950"
        >
          {/* Defs */}
          <defs>
            <pattern id="roadPattern" width="40" height="40" patternUnits="userSpaceOnUse">
              <rect width="40" height="40" fill="#0b0f19" />
              <circle cx="20" cy="20" r="0.6" fill="#1e293b" opacity="0.3" />
            </pattern>
          </defs>

          {/* Ground */}
          <rect width="920" height="560" fill="url(#roadPattern)" rx="10" />

          {/* Perimeter */}
          <rect
            x="20"
            y="20"
            width="880"
            height="520"
            fill="none"
            stroke="#1e293b"
            strokeWidth="2"
            rx="8"
          />

          {/* Access Avenues */}
          <rect x="40" y="30" width="70" height="500" fill="#0f172a" rx="4" />
          <rect x="850" y="30" width="40" height="500" fill="#0f172a" rx="4" />

          {/* West Avenue center line */}
          <line
            x1="75"
            y1="40"
            x2="75"
            y2="520"
            stroke="#334155"
            strokeWidth="1.5"
            strokeDasharray="6 6"
          />

          {/* Horizontal Driving Lanes */}
          {[158, 298, 438].map((laneY, idx) => (
            <g key={idx}>
              <rect x="110" y={laneY - 20} width="740" height="40" fill="#0f172a" opacity="0.7" />
              <line
                x1="110"
                y1={laneY}
                x2="850"
                y2={laneY}
                stroke="#334155"
                strokeWidth="1.5"
                strokeDasharray="8 8"
              />
            </g>
          ))}

          {/* Zone Section Labels */}
          {zones.map((zone) => (
            <text
              key={zone.id}
              x="120"
              y={zone.y}
              fill="#64748b"
              fontSize="10"
              fontWeight="600"
              letterSpacing="0.5"
            >
              {zone.name}
            </text>
          ))}

          {/* Entry Gate */}
          <g transform="translate(30, 490)">
            <rect x="0" y="0" width="70" height="38" fill="#1e293b" rx="4" stroke="#334155" />
            <text x="35" y="16" fill="#10b981" fontSize="9" fontWeight="bold" textAnchor="middle">
              ENTRY
            </text>
            <text x="35" y="28" fill="#64748b" fontSize="8" textAnchor="middle">
              GATE 1
            </text>
          </g>

          {/* Exit Gate */}
          <g transform="translate(830, 30)">
            <rect x="0" y="0" width="65" height="36" fill="#1e293b" rx="4" stroke="#334155" />
            <text x="32" y="16" fill="#94a3b8" fontSize="9" fontWeight="bold" textAnchor="middle">
              EXIT
            </text>
            <text x="32" y="28" fill="#64748b" fontSize="8" textAnchor="middle">
              GATE
            </text>
          </g>

          {/* 60 Parking Bays */}
          {slots.map((slot) => {
            const isTarget = navigationRoute?.targetSlotId === slot.id;
            const isSelected = selectedSlot?.id === slot.id;
            const isVacant = slot.status === 'vacant';

            return (
              <g
                key={slot.id}
                transform={`translate(${slot.x}, ${slot.y})`}
                onClick={() => {
                  onSelectSlot(slot);
                  if (isVacant) {
                    onNavigateToSlot(slot);
                  }
                }}
                onMouseEnter={() => setHoveredSlot(slot)}
                onMouseLeave={() => setHoveredSlot(null)}
                className="cursor-pointer"
              >
                {/* Slot Ground Bay */}
                <rect
                  x="0"
                  y="0"
                  width={slot.width}
                  height={slot.height}
                  rx="3"
                  fill={
                    isTarget
                      ? '#0f2942'
                      : isSelected
                      ? '#1e293b'
                      : isVacant
                      ? '#064e3b'
                      : '#111827'
                  }
                  stroke={
                    isTarget
                      ? '#38bdf8'
                      : isSelected
                      ? '#64748b'
                      : isVacant
                      ? '#059669'
                      : '#1e293b'
                  }
                  strokeWidth={isTarget || isSelected ? '2' : '1'}
                  opacity={isVacant ? 0.45 : 0.9}
                />

                {/* Bay Painted Boundary Lines */}
                <path
                  d={`M 0 0 L 0 ${slot.height} M ${slot.width} 0 L ${slot.width} ${slot.height}`}
                  stroke={isVacant ? '#10b981' : '#334155'}
                  strokeWidth="1"
                  opacity={isVacant ? 0.6 : 0.4}
                />

                {/* Occupied Car Vector */}
                {!isVacant && (
                  <g transform={`translate(${slot.width / 2 - 12}, ${slot.height / 2 - 20})`}>
                    <rect
                      x="1"
                      y="1"
                      width="22"
                      height="38"
                      rx="4"
                      fill={slot.vehicleColor || '#475569'}
                      stroke="#0f172a"
                      strokeWidth="1"
                      opacity="0.85"
                    />
                    <rect x="3" y="7" width="18" height="6" rx="1.5" fill="#0f172a" opacity="0.7" />
                    <rect x="3" y="27" width="18" height="5" rx="1" fill="#0f172a" opacity="0.7" />
                  </g>
                )}

                {/* Slot Label */}
                <text
                  x={slot.width / 2}
                  y={isVacant ? slot.height / 2 - 2 : 11}
                  fill={isVacant ? '#a7f3d0' : '#cbd5e1'}
                  fontSize="9"
                  fontWeight="600"
                  fontFamily="monospace"
                  textAnchor="middle"
                >
                  {slot.id}
                </text>

                {/* Vacant Indicator */}
                {isVacant && (
                  <text
                    x={slot.width / 2}
                    y={slot.height / 2 + 10}
                    fill="#34d399"
                    fontSize="7"
                    fontWeight="500"
                    textAnchor="middle"
                  >
                    FREE
                  </text>
                )}

                {/* Target Outline */}
                {isTarget && (
                  <rect
                    x="-1"
                    y="-1"
                    width={slot.width + 2}
                    height={slot.height + 2}
                    rx="4"
                    fill="none"
                    stroke="#38bdf8"
                    strokeWidth="1.5"
                    strokeDasharray="4 2"
                  />
                )}
              </g>
            );
          })}

          {/* Active Navigation Path */}
          {navigationRoute && (
            <g>
              <path
                d={routePathD}
                fill="none"
                stroke="#38bdf8"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="8 6"
              />

              {/* Start Vehicle Marker at Gate */}
              <g transform="translate(60, 520)">
                <circle cx="0" cy="0" r="7" fill="#0284c7" />
                <circle cx="0" cy="0" r="3" fill="#ffffff" />
              </g>

              {/* Target Arrival Marker */}
              {(() => {
                const targetSlot = slots.find((s) => s.id === navigationRoute.targetSlotId);
                if (!targetSlot) return null;
                const tx = targetSlot.x + targetSlot.width / 2;
                const ty = targetSlot.y + targetSlot.height / 2;
                return (
                  <g transform={`translate(${tx}, ${ty})`}>
                    <circle cx="0" cy="0" r="7" fill="#059669" />
                    <text x="0" y="3" fill="#ffffff" fontSize="8" fontWeight="bold" textAnchor="middle">
                      ✓
                    </text>
                  </g>
                );
              })()}
            </g>
          )}
        </svg>

        {/* Hover Tooltip */}
        {hoveredSlot && (
          <div
            className="absolute z-20 pointer-events-none bg-slate-900 text-white border border-slate-700/80 rounded-lg p-2 shadow-lg text-xs"
            style={{
              left: `${Math.min(82, Math.max(8, (hoveredSlot.x / 920) * 100))}%`,
              top: `${Math.max(6, (hoveredSlot.y / 560) * 100 - 12)}%`,
              transform: 'translate(-50%, -100%)',
            }}
          >
            <div className="flex items-center justify-between gap-3 font-semibold pb-1 mb-1 border-b border-slate-800">
              <span className="font-mono text-slate-200">Bay {hoveredSlot.id}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded font-normal ${
                  hoveredSlot.status === 'vacant'
                    ? 'bg-emerald-950 text-emerald-300'
                    : 'bg-slate-800 text-slate-300'
                }`}
              >
                {hoveredSlot.status === 'vacant' ? 'Available' : 'Occupied'}
              </span>
            </div>
            <div className="text-[11px] text-slate-400 space-y-0.5">
              <p>Distance: <strong className="text-slate-200">{hoveredSlot.distanceFromEntry}m</strong></p>
              {hoveredSlot.status === 'occupied' ? (
                <p>Parked: <span className="text-slate-200">{hoveredSlot.vehicleType}</span></p>
              ) : (
                <p className="text-emerald-400 font-medium">Click to navigate</p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Map Sub-bar Status */}
      <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-400">
        <span>Speed limit: 10 km/h</span>
        <span className="font-mono">60 bays mapped</span>
      </div>
    </div>
  );
};
