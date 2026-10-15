import React from 'react';

interface KPICardsProps {
  totalSlots: number;
  vacantSlots: number;
  occupiedSlots: number;
  occupancyRate: number;
}

export const KPICards: React.FC<KPICardsProps> = ({
  totalSlots,
  vacantSlots,
  occupiedSlots,
  occupancyRate,
}) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {/* 1. Total Bays */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block">
          Total Bays
        </span>
        <div className="mt-1">
          <span className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 font-mono tabular-nums">
            {totalSlots}
          </span>
        </div>
      </div>

      {/* 2. Available */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <span className="text-[11px] font-medium text-emerald-700 dark:text-emerald-400 block">
          Available
        </span>
        <div className="mt-1">
          <span className="text-2xl sm:text-3xl font-bold text-emerald-700 dark:text-emerald-400 font-mono tabular-nums">
            {vacantSlots}
          </span>
        </div>
        <div className="mt-2.5 w-full bg-slate-100 dark:bg-slate-800 h-1 rounded-full overflow-hidden">
          <div
            className="bg-emerald-600/80 dark:bg-emerald-500/80 h-full rounded-full transition-all duration-300"
            style={{ width: `${(vacantSlots / totalSlots) * 100}%` }}
          />
        </div>
      </div>

      {/* 3. Occupied */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block">
          Occupied
        </span>
        <div className="mt-1">
          <span className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-slate-200 font-mono tabular-nums">
            {occupiedSlots}
          </span>
        </div>
        <div className="mt-2.5 w-full bg-slate-100 dark:bg-slate-800 h-1 rounded-full overflow-hidden">
          <div
            className="bg-slate-400 dark:bg-slate-600 h-full rounded-full transition-all duration-300"
            style={{ width: `${(occupiedSlots / totalSlots) * 100}%` }}
          />
        </div>
      </div>

      {/* 4. Occupancy Rate */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block">
          Occupancy Rate
        </span>
        <div className="mt-1">
          <span className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 font-mono tabular-nums">
            {occupancyRate.toFixed(1)}%
          </span>
        </div>
      </div>
    </div>
  );
};
