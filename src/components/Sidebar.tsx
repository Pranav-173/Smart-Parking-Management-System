import React from 'react';

export type TabType = 'monitor' | 'navigation' | 'conditions' | 'analytics' | 'about';

interface SidebarProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  vacantCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  isCollapsed,
  vacantCount,
}) => {
  const navItems: { id: TabType; label: string; badge?: string }[] = [
    { id: 'monitor', label: 'Live Monitor' },
    { id: 'navigation', label: 'Navigation', badge: `${vacantCount} free` },
    { id: 'conditions', label: 'Conditions Test' },
    { id: 'analytics', label: 'Analytics' },
    { id: 'about', label: 'About Project' },
  ];

  return (
    <aside
      className={`${
        isCollapsed ? 'w-16' : 'w-56'
      } border-r border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col justify-between shrink-0 transition-all duration-200 select-none z-20`}
    >
      <div>
        {/* Brand Header */}
        <div className="h-16 px-5 border-b border-slate-200/80 dark:border-slate-800 flex items-center">
          {!isCollapsed ? (
            <div className="min-w-0">
              <h1 className="text-sm font-semibold text-slate-900 dark:text-slate-100 tracking-tight">
                SmartPark AI
              </h1>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Vision Guidance System
              </p>
            </div>
          ) : (
            <span className="font-bold text-slate-900 dark:text-slate-100 text-xs mx-auto">
              SP
            </span>
          )}
        </div>

        {/* Navigation Tabs without icons */}
        <nav className="p-2.5 space-y-1">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-colors ${
                  isActive
                    ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 font-semibold shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200 font-medium'
                }`}
                title={isCollapsed ? item.label : undefined}
              >
                {!isCollapsed ? (
                  <>
                    <span className="truncate text-left">{item.label}</span>
                    {item.badge && (
                      <span
                        className={`text-[10px] font-mono font-medium px-2 py-0.5 rounded-md ${
                          isActive
                            ? 'bg-white/20 text-white dark:bg-slate-900/20 dark:text-slate-900'
                            : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200/50 dark:border-emerald-800/40'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </>
                ) : (
                  <span className="text-[11px] font-semibold mx-auto">
                    {item.label.slice(0, 2)}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Cornerstone Project Tag */}
      {!isCollapsed && (
        <div className="p-3 m-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 text-xs">
          <span className="font-semibold text-slate-700 dark:text-slate-300 text-[11px] block mb-0.5">
            Cornerstone Project
          </span>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
            Pranav K. & Sharoon K.
            <br />
            Guide: Mr. M Seshanna
          </p>
        </div>
      )}
    </aside>
  );
};
