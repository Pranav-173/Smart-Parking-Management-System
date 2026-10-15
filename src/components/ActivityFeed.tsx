import React from 'react';
import { ActivityEvent } from '../types/parking';
import { Clock, ArrowUpRight, ArrowDownLeft, AlertTriangle } from 'lucide-react';

interface ActivityFeedProps {
  events: ActivityEvent[];
  onClearEvents: () => void;
}

export const ActivityFeed: React.FC<ActivityFeedProps> = ({ events, onClearEvents }) => {
  return (
    <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-4 sm:p-5 shadow-xs">
      <div className="flex items-center justify-between gap-3 mb-3 pb-2 border-b border-slate-100 dark:border-slate-800">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Activity Log
        </h3>
        <button
          onClick={onClearEvents}
          className="text-[11px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
        >
          Clear
        </button>
      </div>

      <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1">
        {events.length === 0 ? (
          <div className="py-6 text-center text-xs text-slate-400">
            No recent activity recorded.
          </div>
        ) : (
          events.slice(0, 8).map((event) => {
            const isVacated = event.type === 'vacated';
            const isRerouted = event.type === 'rerouted';

            return (
              <div
                key={event.id}
                className="flex items-center justify-between gap-2 p-2 rounded-lg bg-slate-50/70 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/60 text-xs"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                      isVacated
                        ? 'bg-emerald-500'
                        : isRerouted
                        ? 'bg-amber-500'
                        : 'bg-slate-400'
                    }`}
                  />
                  <p className="text-slate-700 dark:text-slate-300 font-medium truncate">
                    {event.message}
                  </p>
                </div>

                <span className="text-[10px] font-mono text-slate-400 shrink-0">
                  {event.timestamp}
                </span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
