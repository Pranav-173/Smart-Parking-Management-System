import React from 'react';
import { Sun, Moon, RefreshCw } from 'lucide-react';

interface NavbarProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
  selectedLot: string;
  onSelectLot: (lot: string) => void;
  onResetLot: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  darkMode,
  onToggleDarkMode,
  selectedLot,
  onSelectLot,
  onResetLot,
}) => {
  return (
    <header className="h-16 px-4 md:px-6 border-b border-slate-200/80 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between gap-4 transition-colors">
      {/* Location Selector */}
      <div className="flex items-center gap-2.5 min-w-0">
        <label
          htmlFor="lot-select"
          className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider shrink-0 hidden sm:inline"
        >
          Location
        </label>
        <select
          id="lot-select"
          value={selectedLot}
          onChange={(e) => onSelectLot(e.target.value)}
          className="text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700/80 rounded-xl px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-slate-400 cursor-pointer max-w-[200px] sm:max-w-xs truncate transition-colors"
        >
          <option value="metro">Metro Parking</option>
          <option value="mall">Mall Parking</option>
          <option value="restaurent">Restaurent parking</option>
        </select>

        {/* Reset button */}
        <button
          onClick={onResetLot}
          title="Reset lot layout"
          className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors shrink-0"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Theme Toggle */}
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={onToggleDarkMode}
          className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
          title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          aria-label="Toggle theme"
        >
          {darkMode ? (
            <Sun className="w-4 h-4 text-slate-300" />
          ) : (
            <Moon className="w-4 h-4 text-slate-600" />
          )}
        </button>
      </div>
    </header>
  );
};
