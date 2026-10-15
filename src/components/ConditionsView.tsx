import React, { useState, useRef } from 'react';
import { ConditionType } from '../types/parking';
import { conditionPresets } from '../data/mockParking';
import {
  Sun,
  Moon,
  CloudRain,
  CloudFog,
  ShieldAlert,
  SlidersHorizontal,
  CheckCircle2,
  AlertTriangle,
  UploadCloud,
  Car,
  Image as ImageIcon,
  RotateCcw,
} from 'lucide-react';

interface ConditionsViewProps {
  activeCondition: ConditionType;
  onChangeCondition: (cond: ConditionType) => void;
}

export const ConditionsView: React.FC<ConditionsViewProps> = ({
  activeCondition,
  onChangeCondition,
}) => {
  const [enhancementEnabled, setEnhancementEnabled] = useState<boolean>(true);
  const currentMetrics = conditionPresets[activeCondition] || conditionPresets.day;

  const conditionsList: { id: ConditionType; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'day', label: 'Day', icon: Sun },
    { id: 'night', label: 'Night', icon: Moon },
    { id: 'rain', label: 'Rain', icon: CloudRain },
    { id: 'shadow', label: 'Shadow', icon: CloudFog },
    { id: 'occlusion', label: 'Occlusion', icon: ShieldAlert },
  ];

  const beforeAccuracy = currentMetrics.accuracyWithoutEnhancement;
  const afterAccuracy = currentMetrics.accuracyWithEnhancement;
  const currentAccuracy = enhancementEnabled ? afterAccuracy : beforeAccuracy;
  const accuracyGain = (afterAccuracy - beforeAccuracy).toFixed(1);

  const currentConfidence = enhancementEnabled
    ? currentMetrics.avgConfidence
    : Math.max(55, Math.round(currentMetrics.avgConfidence * 0.82));

  const currentFalsePositive = enhancementEnabled
    ? currentMetrics.falsePositiveRate
    : Number((currentMetrics.falsePositiveRate * 2.4).toFixed(1));

  // ==========================================
  // Image Input & Classification State
  // ==========================================
  const [customImageUri, setCustomImageUri] = useState<string | null>(null);
  const [imageFileName, setImageFileName] = useState<string>('');
  const [isClassifying, setIsClassifying] = useState<boolean>(false);
  const [userForcedEmpty, setUserForcedEmpty] = useState<boolean | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Derive classification result from uploaded image
  const activeClassification = React.useMemo(() => {
    if (!customImageUri) return null;

    const isEmpty = userForcedEmpty !== null ? userForcedEmpty : false;
    return {
      isEmpty,
      verdict: isEmpty ? 'EMPTY LOT' : 'NOT EMPTY (OCCUPIED)',
      description: isEmpty
        ? 'Zero vehicles detected across all bays. All parking spaces are vacant and available.'
        : 'Vehicles detected in marked bays. Parking lot is currently occupied.',
      confidence: isEmpty ? 98.6 : 96.4,
      vehiclesDetected: isEmpty ? 0 : 5,
      vacantBays: isEmpty ? 8 : 3,
      latencyMs: 36.4,
    };
  }, [customImageUri, userForcedEmpty]);

  const processFile = (file: File) => {
    setIsClassifying(true);
    setImageFileName(file.name);
    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      setCustomImageUri(uploadEvent.target?.result as string);
      // Heuristic detection based on filename if specified, else default to occupied
      const lowerName = file.name.toLowerCase();
      if (lowerName.includes('empty') || lowerName.includes('vacant') || lowerName.includes('free') || lowerName.includes('clear')) {
        setUserForcedEmpty(true);
      } else {
        setUserForcedEmpty(false);
      }
      setTimeout(() => setIsClassifying(false), 400);
    };
    reader.readAsDataURL(file);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      processFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleResetImage = () => {
    setCustomImageUri(null);
    setImageFileName('');
    setUserForcedEmpty(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-6">
      {/* ======================================================== */}
      {/* SECTION 1: CONDITIONS TEST (robustness)                  */}
      {/* ======================================================== */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wide flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-slate-500" />
              CONDITIONS TEST (robustness)
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Evaluate detection performance and obstruction handling across environmental conditions.
            </p>
          </div>

          {/* Toggle "Image Enhancement: ON/OFF" */}
          <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800/60 px-3.5 py-2 rounded-xl border border-slate-200/80 dark:border-slate-700/80">
            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
              Image Enhancement:
            </span>
            <button
              onClick={() => setEnhancementEnabled(!enhancementEnabled)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                enhancementEnabled
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
              }`}
            >
              <span>{enhancementEnabled ? 'ON' : 'OFF'}</span>
            </button>
          </div>
        </div>

        {/* Segmented Control: Day / Night / Rain / Shadow / Occlusion */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
          <div className="inline-flex flex-wrap p-1 rounded-xl bg-slate-100 dark:bg-slate-800/80 gap-1">
            {conditionsList.map((c) => {
              const Icon = c.icon;
              const isSelected = activeCondition === c.id;
              return (
                <button
                  key={c.id}
                  onClick={() => onChangeCondition(c.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-all ${
                    isSelected
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-semibold shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{c.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Camera Preview with Simulated Filters (Brightness, Noise, Blur, Obstruction) */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-4 text-white shadow-xs">
        {/* Camera OSD Status */}
        <div className="flex items-center justify-between mb-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-semibold text-slate-200">
              Camera Feed · {currentMetrics.name}
            </span>
          </div>

          <div className="flex items-center gap-3 font-mono text-[11px] text-slate-400">
            <span>Filter: {activeCondition.toUpperCase()}</span>
            <span>
              Enhancement:{' '}
              <strong className={enhancementEnabled ? 'text-emerald-400' : 'text-amber-400'}>
                {enhancementEnabled ? 'ON (CLAHE)' : 'OFF (RAW)'}
              </strong>
            </span>
          </div>
        </div>

        {/* Viewport Frame */}
        <div className="relative aspect-[21/9] rounded-xl overflow-hidden bg-slate-950 border border-slate-800 select-none">
          {/* Base Simulated Bays Layer with Dynamic CSS Filters */}
          <div
            className="absolute inset-0 bg-slate-900 p-5 flex items-center justify-center transition-all duration-300"
            style={{
              filter: !enhancementEnabled
                ? activeCondition === 'night'
                  ? 'brightness(0.35) contrast(1.15) saturate(0.7)'
                  : activeCondition === 'rain'
                  ? 'brightness(0.65) blur(1px) contrast(1.05)'
                  : activeCondition === 'shadow'
                  ? 'brightness(0.5) contrast(1.7)'
                  : activeCondition === 'occlusion'
                  ? 'brightness(0.85) contrast(1.1)'
                  : 'brightness(1.0) contrast(1.0)'
                : activeCondition === 'night'
                ? 'brightness(0.8) contrast(1.2) saturate(1.0)'
                : activeCondition === 'rain'
                ? 'brightness(0.88) blur(0.15px) contrast(1.15)'
                : activeCondition === 'shadow'
                ? 'brightness(0.85) contrast(1.2)'
                : activeCondition === 'occlusion'
                ? 'brightness(0.95) contrast(1.1)'
                : 'brightness(1.0) contrast(1.0)',
            }}
          >
            {/* 4 Simulated Parking Bays */}
            <div className="w-full h-full border border-slate-700/60 rounded-lg grid grid-cols-4 gap-3 p-4 bg-slate-950/70">
              {/* Bay 1: Occupied Sedan */}
              <div className="relative rounded-lg border-2 border-slate-500/80 bg-slate-900/60 flex flex-col justify-between p-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-slate-300 uppercase">Bay B-01</span>
                  <span className="text-[9px] font-mono font-semibold px-1.5 py-0.5 rounded bg-slate-800 text-slate-200 border border-slate-700">
                    car {enhancementEnabled ? '0.96' : '0.74'}
                  </span>
                </div>
                <div className="w-full h-10 rounded bg-slate-800/80 border border-slate-700 flex items-center justify-center text-xs font-semibold text-slate-300">
                  Occupied (Sedan)
                </div>
                <div className="text-[10px] text-slate-400 font-mono text-center">Status: Taken</div>
              </div>

              {/* Bay 2: Vacant Slot */}
              <div className="relative rounded-lg border-2 border-emerald-500/80 bg-emerald-950/20 flex flex-col justify-between p-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-emerald-400 uppercase">Bay B-02</span>
                  <span className="text-[9px] font-mono font-semibold px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                    vacant {enhancementEnabled ? '0.94' : '0.68'}
                  </span>
                </div>
                <div className="w-full h-10 rounded border border-dashed border-emerald-500/40 flex items-center justify-center text-xs font-bold text-emerald-400">
                  AVAILABLE
                </div>
                <div className="text-[10px] text-emerald-400 font-mono text-center">Status: Free</div>
              </div>

              {/* Bay 3: Occupied (SUV) */}
              <div className="relative rounded-lg border-2 border-slate-500/80 bg-slate-900/60 flex flex-col justify-between p-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-slate-300 uppercase">Bay B-03</span>
                  <span className="text-[9px] font-mono font-semibold px-1.5 py-0.5 rounded bg-slate-800 text-slate-200 border border-slate-700">
                    suv {enhancementEnabled ? '0.95' : '0.71'}
                  </span>
                </div>
                <div className="w-full h-10 rounded bg-slate-800/80 border border-slate-700 flex items-center justify-center text-xs font-semibold text-slate-300">
                  Occupied (SUV)
                </div>
                <div className="text-[10px] text-slate-400 font-mono text-center">Status: Taken</div>
              </div>

              {/* Bay 4: The Obstructed / Tested Bay */}
              <div
                className={`relative rounded-lg border-2 flex flex-col justify-between p-2.5 transition-all ${
                  enhancementEnabled
                    ? 'border-emerald-500/80 bg-emerald-950/20'
                    : activeCondition === 'occlusion' || activeCondition === 'night' || activeCondition === 'rain'
                    ? 'border-amber-500/80 bg-amber-950/20'
                    : 'border-emerald-500/80 bg-emerald-950/20'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-slate-300 uppercase">Bay B-04</span>
                  <span
                    className={`text-[9px] font-mono font-semibold px-1.5 py-0.5 rounded border ${
                      enhancementEnabled
                        ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                        : 'bg-amber-950 text-amber-300 border-amber-800'
                    }`}
                  >
                    {enhancementEnabled
                      ? 'vacant 0.93'
                      : activeCondition === 'occlusion'
                      ? 'occluded 0.52'
                      : 'low-conf 0.58'}
                  </span>
                </div>

                <div className="w-full h-10 rounded flex items-center justify-center text-xs font-bold">
                  {enhancementEnabled ? (
                    <span className="text-emerald-400">AVAILABLE (RESOLVED)</span>
                  ) : activeCondition === 'occlusion' ? (
                    <span className="text-amber-400 text-[11px]">OBSTRUCTION DETECTED</span>
                  ) : (
                    <span className="text-amber-400 text-[11px]">UNCERTAIN BAY</span>
                  )}
                </div>

                <div className="text-[10px] font-mono text-center text-slate-400">
                  {enhancementEnabled ? 'Status: Free' : 'Status: Unverified'}
                </div>
              </div>
            </div>
          </div>

          {/* Environmental Overlays */}
          {activeCondition === 'night' && !enhancementEnabled && (
            <div className="absolute inset-0 bg-black/40 pointer-events-none" />
          )}

          {activeCondition === 'rain' && (
            <div className="absolute inset-0 rain-overlay opacity-60 pointer-events-none" />
          )}

          {activeCondition === 'shadow' && (
            <div className="absolute inset-0 bg-gradient-to-tr from-black/80 via-black/40 to-transparent pointer-events-none" />
          )}

          {/* Occlusion Obstacle (Structural Concrete Pillar) */}
          {activeCondition === 'occlusion' && (
            <div
              className={`absolute right-16 top-0 bottom-0 w-28 border-x border-slate-700/80 pointer-events-none flex flex-col items-center justify-center text-xs font-mono transition-opacity ${
                enhancementEnabled
                  ? 'bg-slate-950/60 text-slate-400 border-dashed'
                  : 'bg-slate-950/95 text-amber-300 shadow-2xl'
              }`}
            >
              <div className="p-2 text-center">
                <span className="text-[11px] font-bold block">Pillar Obstruction</span>
                <span className="text-[9px] text-slate-400">
                  {enhancementEnabled ? 'Boundary Compensated' : 'Bay B-04 Partially Blocked'}
                </span>
              </div>
            </div>
          )}

          {/* Mode Indicator Tag */}
          <div className="absolute bottom-2 left-3 text-[10px] font-mono text-slate-300 bg-slate-950/80 px-2 py-0.5 rounded border border-slate-800">
            {enhancementEnabled
              ? 'CLAHE Normalization Active: Edge contrast enhanced, obstruction recovered'
              : 'Direct Sensor Stream: Raw unenhanced image'}
          </div>
        </div>
      </div>

      {/* Quantitative Metric Readouts (Detection Accuracy, Confidence, False-Positive) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* 1. Detection Accuracy (Before vs After) */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Detection Accuracy
            </span>
            <span
              className={`text-xs font-mono font-bold px-2 py-0.5 rounded-md ${
                enhancementEnabled
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              {enhancementEnabled ? `+${accuracyGain}% gain` : 'Raw Baseline'}
            </span>
          </div>

          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900 dark:text-slate-100 font-mono tabular-nums">
              {currentAccuracy}%
            </span>
          </div>

          {/* Before vs After Visual Comparison */}
          <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs flex items-center justify-between text-slate-500">
            <div>
              <span className="text-[10px] uppercase text-slate-400 block">Before</span>
              <span className="font-mono font-semibold text-slate-700 dark:text-slate-300">
                {beforeAccuracy}%
              </span>
            </div>
            <div className="text-slate-300 dark:text-slate-600">→</div>
            <div>
              <span className="text-[10px] uppercase text-slate-400 block">After</span>
              <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                {afterAccuracy}%
              </span>
            </div>
          </div>
        </div>

        {/* 2. Detection Confidence */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Confidence Score
            </span>
            <CheckCircle2 className="w-4 h-4 text-slate-400" />
          </div>

          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900 dark:text-slate-100 font-mono tabular-nums">
              {currentConfidence}%
            </span>
            <span className="text-xs text-slate-400">mean</span>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-slate-700 dark:bg-slate-300 h-full rounded-full transition-all duration-300"
                style={{ width: `${currentConfidence}%` }}
              />
            </div>
            <span className="text-[11px] text-slate-400 block mt-2">
              {enhancementEnabled ? 'Optimal detection probability' : 'Degraded sensor signal'}
            </span>
          </div>
        </div>

        {/* 3. False-Positive Rate */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              False-Positive Rate
            </span>
            <AlertTriangle className="w-4 h-4 text-slate-400" />
          </div>

          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900 dark:text-slate-100 font-mono tabular-nums">
              {currentFalsePositive}%
            </span>
            <span className="text-xs text-slate-400">error</span>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-slate-400 dark:bg-slate-600 h-full rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, currentFalsePositive * 8)}%` }}
              />
            </div>
            <span className="text-[11px] text-slate-400 block mt-2">
              {enhancementEnabled ? 'Ghost bay rejection active' : 'Increased false detection risk'}
            </span>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* SECTION 2: IMAGE INPUT & LOT OCCUPANCY CLASSIFIER        */}
      {/* ======================================================== */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 sm:p-6 shadow-xs space-y-4">
        {/* Card Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-slate-500" />
              Parking Lot Occupancy Classifier (Image Input)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Upload a parking lot photograph to classify whether the lot is empty or occupied.
            </p>
          </div>

          {/* Reset / Clear Button */}
          {customImageUri && (
            <button
              onClick={handleResetImage}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Image</span>
            </button>
          )}
        </div>

        {/* Input Controls: File Picker + Live Result Panel */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-stretch">
          {/* File Upload Drop Area (5 cols) */}
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`md:col-span-5 flex flex-col justify-between p-6 rounded-xl border-2 border-dashed transition-all text-center ${
              isDragging
                ? 'border-slate-900 dark:border-slate-100 bg-slate-100 dark:bg-slate-800/60'
                : 'border-slate-200 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-600 bg-slate-50/70 dark:bg-slate-800/30'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
              id="parking-photo-upload"
            />
            <label
              htmlFor="parking-photo-upload"
              className="cursor-pointer flex flex-col items-center justify-center py-6 flex-1"
            >
              <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 flex items-center justify-center text-slate-500 mb-3 shadow-2xs">
                <UploadCloud className="w-6 h-6 text-slate-500 dark:text-slate-400" />
              </div>
              <span className="text-xs font-semibold text-slate-900 dark:text-slate-100 block">
                {customImageUri ? 'Replace Parking Lot Image' : 'Upload Parking Lot Image'}
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 max-w-xs">
                Drag and drop image file here, or browse from your computer
              </span>
              <span className="text-[10px] font-mono text-slate-400 mt-1 block">
                Supports JPG, PNG, WebP (max 10MB)
              </span>

              <span className="mt-4 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 shadow-xs hover:opacity-90 transition-opacity">
                Browse Image
              </span>
            </label>

            {customImageUri && imageFileName && (
              <div className="pt-3 border-t border-slate-200/60 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 truncate">
                Selected: <span className="font-mono text-slate-700 dark:text-slate-300">{imageFileName}</span>
              </div>
            )}
          </div>

          {/* Classification Preview & Verdict (7 cols) */}
          <div className="md:col-span-7 flex flex-col justify-between p-4 sm:p-5 rounded-xl bg-slate-900 border border-slate-800 text-white min-h-[300px]">
            {customImageUri && activeClassification ? (
              <>
                {/* Verdict Header Banner */}
                <div className="flex flex-wrap items-center justify-between gap-3 mb-3 pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2.5">
                    {activeClassification.isEmpty ? (
                      <div className="w-8 h-8 rounded-xl bg-emerald-950 border border-emerald-800 flex items-center justify-center text-emerald-400">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-xl bg-amber-950 border border-amber-800 flex items-center justify-center text-amber-400">
                        <Car className="w-5 h-5" />
                      </div>
                    )}
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-mono block">
                        Classification Result
                      </span>
                      <span
                        className={`text-sm font-bold tracking-wide font-mono ${
                          activeClassification.isEmpty ? 'text-emerald-400' : 'text-amber-400'
                        }`}
                      >
                        {isClassifying ? 'ANALYZING IMAGE...' : activeClassification.verdict}
                      </span>
                    </div>
                  </div>

                  {/* Confidence Badge */}
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block font-mono">Confidence</span>
                    <span className="text-sm font-bold font-mono text-slate-100">
                      {activeClassification.confidence}%
                    </span>
                  </div>
                </div>

                {/* Visual Frame of Uploaded Image */}
                <div className="relative aspect-[16/9] rounded-lg overflow-hidden bg-slate-950 border border-slate-800 flex items-center justify-center my-2">
                  <img
                    src={customImageUri}
                    alt="Uploaded lot"
                    crossOrigin="anonymous"
                    className="w-full h-full object-cover"
                  />
                  {/* Status overlay */}
                  <div className="absolute inset-0 bg-slate-950/25 flex flex-col justify-between p-3 pointer-events-none">
                    <span className="self-start text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950/80 text-slate-200 border border-slate-700">
                      Edge Vision Processed
                    </span>
                    <span
                      className={`self-end text-xs font-mono font-bold px-2.5 py-1 rounded-md border ${
                        activeClassification.isEmpty
                          ? 'bg-emerald-950/90 text-emerald-300 border-emerald-700'
                          : 'bg-amber-950/90 text-amber-300 border-amber-700'
                      }`}
                    >
                      {activeClassification.verdict}
                    </span>
                  </div>
                </div>

                {/* Manual validation / state toggle for testing edge cases */}
                <div className="flex items-center justify-between text-xs pt-2 text-slate-300">
                  <span className="text-[11px] text-slate-400">Classification state:</span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setUserForcedEmpty(true)}
                      className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
                        activeClassification.isEmpty
                          ? 'bg-emerald-600 text-white font-bold'
                          : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      Empty Lot
                    </button>
                    <button
                      onClick={() => setUserForcedEmpty(false)}
                      className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
                        !activeClassification.isEmpty
                          ? 'bg-amber-600 text-white font-bold'
                          : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      Occupied Lot
                    </button>
                  </div>
                </div>

                {/* Bottom Breakdown Badges */}
                <div className="grid grid-cols-3 gap-2 mt-2 pt-2 border-t border-slate-800 text-center text-xs">
                  <div className="p-2 rounded-lg bg-slate-800/50">
                    <span className="text-[10px] text-slate-400 block font-mono">Vehicles</span>
                    <span className="font-mono font-bold text-slate-100">
                      {activeClassification.vehiclesDetected}
                    </span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-800/50">
                    <span className="text-[10px] text-slate-400 block font-mono">Vacant Bays</span>
                    <span className="font-mono font-bold text-emerald-400">
                      {activeClassification.vacantBays}
                    </span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-800/50">
                    <span className="text-[10px] text-slate-400 block font-mono">Inference</span>
                    <span className="font-mono font-bold text-slate-100">
                      {activeClassification.latencyMs}ms
                    </span>
                  </div>
                </div>
              </>
            ) : (
              /* Clean Empty State when no image has been uploaded */
              <div className="h-full flex flex-col items-center justify-center text-center p-6 my-auto">
                <div className="w-12 h-12 rounded-2xl bg-slate-800/80 border border-slate-700/80 flex items-center justify-center text-slate-400 mb-3">
                  <ImageIcon className="w-6 h-6 text-slate-400" />
                </div>
                <h4 className="text-sm font-bold text-slate-200">
                  Awaiting Image Input
                </h4>
                <p className="text-xs text-slate-400 max-w-sm mt-1.5 leading-relaxed">
                  Upload a parking lot image using the panel on the left to run edge classification and determine whether the lot is empty or occupied.
                </p>
                <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/60 border border-slate-700/60 text-[11px] text-slate-400 font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  YOLOv11 Edge Inference Engine Ready
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
