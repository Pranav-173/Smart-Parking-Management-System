import React from 'react';
import { NavigationRoute, ParkingSlot } from '../types/parking';
import { Navigation, AlertTriangle, RotateCcw } from 'lucide-react';

interface NavigationCardProps {
  route: NavigationRoute | null;
  onFindNearestSlot: () => void;
  onClearNavigation: () => void;
  onSimulateRerouteConflict: () => void;
  vacantSlotsCount: number;
  nearestVacantSlot: ParkingSlot | null;
}

export const NavigationCard: React.FC<NavigationCardProps> = ({
  route,
  onFindNearestSlot,
  onClearNavigation,
  onSimulateRerouteConflict,
  vacantSlotsCount,
  nearestVacantSlot,
}) => {
  return (
    <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-4 sm:p-5 shadow-xs">
      <div className="flex items-center justify-between gap-3 mb-3 pb-2.5 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Bay Navigation
          </h3>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1.5">
          {route ? (
            <>
              <button
                onClick={onSimulateRerouteConflict}
                className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                title="Test conflict"
              >
                Conflict Test
              </button>
              <button
                onClick={onClearNavigation}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg transition-colors"
                title="Clear navigation"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </>
          ) : (
            <button
              onClick={onFindNearestSlot}
              disabled={vacantSlotsCount === 0}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200 disabled:opacity-50 transition-all shadow-xs"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>Find Nearest Bay</span>
            </button>
          )}
        </div>
      </div>

      {/* Reroute Alert Banner */}
      {route?.isRerouted && (
        <div className="mb-3 p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/40 text-amber-900 dark:text-amber-200 flex items-start gap-2 text-xs">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div className="text-[11px]">
            <span className="font-semibold">Re-routed:</span>{' '}
            {route.rerouteReason || 'Bay was occupied mid-route. Path updated.'}
          </div>
        </div>
      )}

      {/* Navigation State */}
      {route ? (
        <div className="space-y-3">
          {/* Destination KPI Strip */}
          <div className="grid grid-cols-4 gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-center text-xs">
            <div>
              <span className="text-[10px] text-slate-400 block">Bay</span>
              <span className="font-mono text-sm font-bold text-slate-900 dark:text-slate-100">
                {route.targetSlotId}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block">Distance</span>
              <span className="font-mono text-sm font-bold text-slate-900 dark:text-slate-100">
                {route.totalDistanceMeters}m
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block">Drive</span>
              <span className="font-mono text-sm font-bold text-slate-900 dark:text-slate-100">
                {route.estimatedDriveSeconds}s
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block">Walk</span>
              <span className="font-mono text-sm font-bold text-slate-900 dark:text-slate-100">
                {route.estimatedWalkMinutes}m
              </span>
            </div>
          </div>

          {/* Turn-by-Turn Instruction List */}
          <div className="space-y-1">
            {route.steps.map((step, idx) => (
              <div
                key={step.id}
                className="flex items-center gap-2 p-1.5 rounded-lg bg-slate-50/80 dark:bg-slate-800/30 text-xs"
              >
                <div className="w-4 h-4 rounded-md bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center font-mono font-medium text-[9px] shrink-0">
                  {idx + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-slate-700 dark:text-slate-300 truncate text-[11px]">
                    {step.instruction}
                  </p>
                </div>
                <span className="font-mono text-[10px] text-slate-400 shrink-0">
                  {step.distanceMeters}m
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-4 px-2 rounded-xl bg-slate-50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800/60">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Select a bay or calculate shortest path
          </p>
          {nearestVacantSlot && (
            <button
              onClick={onFindNearestSlot}
              className="mt-1.5 text-xs font-medium text-slate-800 dark:text-slate-200 hover:underline"
            >
              Nearest: Bay {nearestVacantSlot.id} ({nearestVacantSlot.distanceFromEntry}m) →
            </button>
          )}
        </div>
      )}
    </div>
  );
};
