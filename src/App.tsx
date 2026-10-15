import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { initialSlots } from './data/mockParking';
import { ParkingSlot, NavigationRoute, ConditionType, ActivityEvent } from './types/parking';
import { calculateRouteToSlot, findNearestVacantSlot } from './utils/navigation';
import { Navbar } from './components/Navbar';
import { Sidebar, TabType } from './components/Sidebar';
import { KPICards } from './components/KPICards';
import { ParkingMap } from './components/ParkingMap';
import { ActivityFeed } from './components/ActivityFeed';
import { NavigationCard } from './components/NavigationCard';
import { ConditionsView } from './components/ConditionsView';
import { AnalyticsView } from './components/AnalyticsView';
import { AboutProjectView } from './components/AboutProjectView';
import {
  AlertTriangle,
  Info,
  X,
  CheckCircle2,
  Navigation,
} from 'lucide-react';

export default function App() {
  // Theme state
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('smartpark_theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      localStorage.setItem('smartpark_theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('smartpark_theme', 'light');
    }
  }, [darkMode]);

  // Main UI State
  const [activeTab, setActiveTab] = useState<TabType>('monitor');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [selectedLot, setSelectedLot] = useState<string>('metro');

  // Parking State
  const [slots, setSlots] = useState<ParkingSlot[]>(initialSlots);
  const [selectedSlot, setSelectedSlot] = useState<ParkingSlot | null>(null);
  const [navigationRoute, setNavigationRoute] = useState<NavigationRoute | null>(null);

  // Condition State for Environmental Test
  const [activeCondition, setActiveCondition] = useState<ConditionType>('day');

  // Toast Notifications
  const [toastMessage, setToastMessage] = useState<{ id: number; title: string; desc: string; type: 'info' | 'warn' | 'success' } | null>(null);

  // Activity Log Stream
  const [activityEvents, setActivityEvents] = useState<ActivityEvent[]>([
    {
      id: 'evt-1',
      timestamp: 'Just now',
      type: 'system',
      message: 'Vision detection active across 60 bays.',
    },
    {
      id: 'evt-2',
      timestamp: '42s ago',
      type: 'vacated',
      message: 'Bay B-08 is now available.',
      slotId: 'B-08',
      zone: 'B',
    },
    {
      id: 'evt-3',
      timestamp: '2m ago',
      type: 'occupied',
      message: 'Vehicle parked in bay A-04.',
      slotId: 'A-04',
      zone: 'A',
    },
  ]);

  const showToast = useCallback((title: string, desc: string, type: 'info' | 'warn' | 'success' = 'info') => {
    const id = Date.now();
    setToastMessage({ id, title, desc, type });
    setTimeout(() => {
      setToastMessage((cur) => (cur?.id === id ? null : cur));
    }, 4000);
  }, []);

  const addActivityEvent = useCallback((event: Omit<ActivityEvent, 'id' | 'timestamp'>) => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const newEvent: ActivityEvent = {
      ...event,
      id: `evt-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: timeStr,
    };
    setActivityEvents((prev) => [newEvent, ...prev.slice(0, 24)]);
  }, []);

  // Nearest vacant slot helper
  const nearestVacant = useMemo(() => findNearestVacantSlot(slots), [slots]);

  // Derived KPI metrics
  const totalSlots = slots.length;
  const vacantSlots = slots.filter((s) => s.status === 'vacant').length;
  const occupiedSlots = totalSlots - vacantSlots;
  const occupancyRate = (occupiedSlots / totalSlots) * 100;

  // Zone Breakdown
  const zoneStats = useMemo(() => {
    const zones = ['A', 'B', 'C', 'D'] as const;
    return zones.map((z) => {
      const zoneSlots = slots.filter((s) => s.zone === z);
      const free = zoneSlots.filter((s) => s.status === 'vacant').length;
      return {
        zone: z,
        total: zoneSlots.length,
        free,
        occupied: zoneSlots.length - free,
      };
    });
  }, [slots]);

  // Handle Finding Nearest Slot
  const handleFindNearestSlot = useCallback(() => {
    const target = findNearestVacantSlot(slots);
    if (!target) {
      showToast('Parking Lot Full', 'All bays are currently occupied.', 'warn');
      return;
    }
    const route = calculateRouteToSlot(target);
    setNavigationRoute(route);
    setSelectedSlot(target);
    showToast(
      'Route Computed',
      `Guiding to Bay ${target.id} (${target.distanceFromEntry}m away).`,
      'success'
    );
    addActivityEvent({
      type: 'navigation',
      message: `Guidance active to Bay ${target.id} (${target.distanceFromEntry}m).`,
      slotId: target.id,
      zone: target.zone,
    });
  }, [slots, showToast, addActivityEvent]);

  // Handle Manual Slot Navigation
  const handleNavigateToSlot = useCallback((slot: ParkingSlot) => {
    if (slot.status !== 'vacant') {
      showToast('Bay Unavailable', `Bay ${slot.id} is occupied.`, 'warn');
      return;
    }
    const route = calculateRouteToSlot(slot);
    setNavigationRoute(route);
    setSelectedSlot(slot);
    showToast(
      `Navigating to Bay ${slot.id}`,
      `Distance: ${route.totalDistanceMeters}m · Est drive: ${route.estimatedDriveSeconds}s`,
      'info'
    );
    addActivityEvent({
      type: 'navigation',
      message: `Driver selected Bay ${slot.id} for navigation.`,
      slotId: slot.id,
      zone: slot.zone,
    });
  }, [showToast, addActivityEvent]);

  // Clear Navigation
  const handleClearNavigation = useCallback(() => {
    setNavigationRoute(null);
    showToast('Navigation Cleared', 'Active route reset.', 'info');
  }, [showToast]);

  // Simulate Re-route Conflict (Mid-Route Contention)
  const handleSimulateRerouteConflict = useCallback(() => {
    if (!navigationRoute) return;

    const oldTargetId = navigationRoute.targetSlotId;
    setSlots((prev) =>
      prev.map((s) =>
        s.id === oldTargetId
          ? {
              ...s,
              status: 'occupied' as const,
              vehicleType: 'Sedan' as const,
              vehicleColor: '#475569',
              occupiedSince: 'Just now',
            }
          : s
      )
    );

    // Find new nearest vacant slot
    setTimeout(() => {
      setSlots((currentSlots) => {
        const nextTarget = findNearestVacantSlot(currentSlots.filter((s) => s.id !== oldTargetId));
        if (nextTarget) {
          const newRoute = calculateRouteToSlot(
            nextTarget,
            true,
            `Slot ${oldTargetId} was occupied mid-route. Re-routed to Bay ${nextTarget.id}.`
          );
          setNavigationRoute(newRoute);
          setSelectedSlot(nextTarget);
          showToast(
            'Re-routing Alert',
            `Slot ${oldTargetId} occupied. Re-routing to Bay ${nextTarget.id}`,
            'warn'
          );
          addActivityEvent({
            type: 'rerouted',
            message: `Bay ${oldTargetId} taken mid-route. Re-routed to ${nextTarget.id}.`,
            slotId: nextTarget.id,
            zone: nextTarget.zone,
          });
        }
        return currentSlots;
      });
    }, 100);
  }, [navigationRoute, showToast, addActivityEvent]);

  // Reset Lot to initial state
  const handleResetLot = useCallback(() => {
    setSlots(initialSlots);
    setNavigationRoute(null);
    setSelectedSlot(null);
    showToast('Lot Reset', 'Restored bays to initial distribution.', 'info');
    addActivityEvent({
      type: 'system',
      message: 'Topology reset to initial test state.',
    });
  }, [showToast, addActivityEvent]);

  // Handle lot change
  const handleSelectLot = (lot: string) => {
    setSelectedLot(lot);
    const lotNames: Record<string, string> = {
      metro: 'Metro Parking',
      mall: 'Mall Parking',
      restaurent: 'Restaurent parking',
    };
    showToast('Location Selected', `Switched to ${lotNames[lot] || lot}.`, 'info');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors font-sans selection:bg-slate-700 selection:text-white">
      {/* Top Navigation Bar */}
      <Navbar
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
        selectedLot={selectedLot}
        onSelectLot={handleSelectLot}
        onResetLot={handleResetLot}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar (No icons, clean typography) */}
        <Sidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          vacantCount={vacantSlots}
        />

        {/* Main Viewport */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-7 space-y-5 max-w-7xl mx-auto w-full">

          {/* TAB 1: LIVE MONITOR */}
          {activeTab === 'monitor' && (
            <div className="space-y-5">
              {/* 4 KPI Summary Cards */}
              <KPICards
                totalSlots={totalSlots}
                vacantSlots={vacantSlots}
                occupiedSlots={occupiedSlots}
                occupancyRate={occupancyRate}
              />

              {/* Main Map and Operations Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                {/* Left: Parking Map (8 cols) */}
                <div className="lg:col-span-8 space-y-4">
                  <ParkingMap
                    slots={slots}
                    navigationRoute={navigationRoute}
                    selectedSlot={selectedSlot}
                    onSelectSlot={setSelectedSlot}
                    onNavigateToSlot={handleNavigateToSlot}
                  />

                  {/* Zone Availability */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {zoneStats.map((z) => (
                      <div
                        key={z.zone}
                        className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center justify-between"
                      >
                        <div>
                          <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                            Zone {z.zone}
                          </span>
                          <span className="font-mono text-xs font-bold text-slate-800 dark:text-slate-200">
                            {z.free} / {z.total} Free
                          </span>
                        </div>
                        <span className="text-xs font-mono font-semibold text-slate-500">
                          {Math.round((z.free / z.total) * 100)}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right: Navigation Card & Activity Feed (4 cols) */}
                <div className="lg:col-span-4 space-y-4">
                  <NavigationCard
                    route={navigationRoute}
                    onFindNearestSlot={handleFindNearestSlot}
                    onClearNavigation={handleClearNavigation}
                    onSimulateRerouteConflict={handleSimulateRerouteConflict}
                    vacantSlotsCount={vacantSlots}
                    nearestVacantSlot={nearestVacant}
                  />

                  <ActivityFeed
                    events={activityEvents}
                    onClearEvents={() => setActivityEvents([])}
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: NAVIGATION */}
          {activeTab === 'navigation' && (
            <div className="space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <Navigation className="w-4 h-4 text-slate-500" />
                    Turn-by-Turn Navigation
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Select a vacant bay or calculate shortest path from entry gate.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleFindNearestSlot}
                    disabled={vacantSlots === 0}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200 disabled:opacity-50 transition-all shadow-xs"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    <span>Find Nearest Bay</span>
                  </button>
                  {navigationRoute && (
                    <button
                      onClick={handleSimulateRerouteConflict}
                      className="px-3 py-1.5 rounded-xl text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                    >
                      Test Conflict
                    </button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                <div className="lg:col-span-8">
                  <ParkingMap
                    slots={slots}
                    navigationRoute={navigationRoute}
                    selectedSlot={selectedSlot}
                    onSelectSlot={setSelectedSlot}
                    onNavigateToSlot={handleNavigateToSlot}
                  />
                </div>
                <div className="lg:col-span-4">
                  <NavigationCard
                    route={navigationRoute}
                    onFindNearestSlot={handleFindNearestSlot}
                    onClearNavigation={handleClearNavigation}
                    onSimulateRerouteConflict={handleSimulateRerouteConflict}
                    vacantSlotsCount={vacantSlots}
                    nearestVacantSlot={nearestVacant}
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: CONDITIONS TEST */}
          {activeTab === 'conditions' && (
            <ConditionsView
              activeCondition={activeCondition}
              onChangeCondition={setActiveCondition}
            />
          )}

          {/* TAB 4: ANALYTICS */}
          {activeTab === 'analytics' && <AnalyticsView />}

          {/* TAB 5: ABOUT PROJECT */}
          {activeTab === 'about' && <AboutProjectView />}
        </main>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 max-w-sm rounded-xl p-3 shadow-lg border flex items-start gap-2.5 bg-slate-900 text-white border-slate-700/80">
          {toastMessage.type === 'warn' ? (
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          ) : toastMessage.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          ) : (
            <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
          )}
          <div className="flex-1 min-w-0 text-xs">
            <h4 className="font-semibold text-slate-100">{toastMessage.title}</h4>
            <p className="text-slate-300 mt-0.5 leading-snug">{toastMessage.desc}</p>
          </div>
          <button
            onClick={() => setToastMessage(null)}
            className="text-slate-400 hover:text-white p-0.5"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
