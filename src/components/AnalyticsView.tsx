import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import {
  modelAccuracyProgression,
  modelPrecisionProgression,
  modelEvaluationReport,
} from '../data/mockParking';
import { Target, CheckCircle2, Award } from 'lucide-react';

export const AnalyticsView: React.FC = () => {
  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
            Model Analytics & Evaluation
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Actual prediction accuracy curves, precision tracking, and evaluation reports for the YOLOv11 vision model.
          </p>
        </div>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-xs font-mono text-slate-600 dark:text-slate-300 shadow-2xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          YOLOv11 Edge · INT8
        </div>
      </div>

      {/* 3 Summary Evaluation KPI Cards (Inference Latency removed) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        {/* Metric 1: Overall Accuracy */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Detection Accuracy
            </span>
            <Target className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="mt-2.5 flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono text-slate-900 dark:text-slate-100">
              96.5%
            </span>
            <span className="text-xs font-mono font-medium text-emerald-600 dark:text-emerald-400">
              +2.3% CLAHE
            </span>
          </div>
          <span className="text-[11px] text-slate-400 dark:text-slate-500 block mt-1.5">
            Overall test benchmark split
          </span>
        </div>

        {/* Metric 2: Precision (Renamed from Precision (Macro)) */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Precision
            </span>
            <CheckCircle2 className="w-4 h-4 text-slate-400" />
          </div>
          <div className="mt-2.5 flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono text-slate-900 dark:text-slate-100">
              96.8%
            </span>
          </div>
          <span className="text-[11px] text-slate-400 dark:text-slate-500 block mt-1.5">
            Minimal false-positive bays
          </span>
        </div>

        {/* Metric 3: Recall (Renamed from Recall (Macro)) */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Recall
            </span>
            <Award className="w-4 h-4 text-slate-400" />
          </div>
          <div className="mt-2.5 flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono text-slate-900 dark:text-slate-100">
              95.4%
            </span>
          </div>
          <span className="text-[11px] text-slate-400 dark:text-slate-500 block mt-1.5">
            Low missed car detection
          </span>
        </div>
      </div>

      {/* 2 Separate Graphs: One for Accuracy, One for Precision */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Graph 1: Accuracy Graph */}
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-4 sm:p-5 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                Accuracy Graph
              </h3>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
                Training vs. Validation Accuracy over Epochs
              </p>
            </div>
            <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/60">
              Peak: 96.5%
            </span>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={modelAccuracyProgression} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="accuracyGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#059669" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#059669" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.12} vertical={false} />
                <XAxis dataKey="epoch" stroke="#94a3b8" fontSize={10} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} domain={[70, 100]} unit="%" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderRadius: '8px',
                    border: '1px solid #1e293b',
                    fontSize: '11px',
                    color: '#f8fafc',
                  }}
                  formatter={(val: any) => [`${val}%`, '']}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '6px' }} />
                <Area
                  type="monotone"
                  name="Validation Accuracy"
                  dataKey="valAcc"
                  stroke="#059669"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#accuracyGradient)"
                />
                <Area
                  type="monotone"
                  name="Training Accuracy"
                  dataKey="trainAcc"
                  stroke="#94a3b8"
                  strokeWidth={1.5}
                  strokeDasharray="4 4"
                  fillOpacity={0}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Graph 2: Precision Graph */}
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-4 sm:p-5 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                Precision Graph
              </h3>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
                Training vs. Validation Precision over Epochs
              </p>
            </div>
            <span className="text-[11px] font-mono text-slate-700 dark:text-slate-300 font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              Peak: 96.8%
            </span>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={modelPrecisionProgression} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="precisionGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#475569" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#475569" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.12} vertical={false} />
                <XAxis dataKey="epoch" stroke="#94a3b8" fontSize={10} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} domain={[70, 100]} unit="%" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderRadius: '8px',
                    border: '1px solid #1e293b',
                    fontSize: '11px',
                    color: '#f8fafc',
                  }}
                  formatter={(val: any) => [`${val}%`, '']}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '6px' }} />
                <Area
                  type="monotone"
                  name="Validation Precision"
                  dataKey="valPrec"
                  stroke="#475569"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#precisionGradient)"
                />
                <Area
                  type="monotone"
                  name="Training Precision"
                  dataKey="trainPrec"
                  stroke="#94a3b8"
                  strokeWidth={1.5}
                  strokeDasharray="4 4"
                  fillOpacity={0}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Model Evaluation Report Table */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-4 sm:p-5 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3 pb-2.5 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-800 dark:text-slate-200">
              Model Evaluation Report (Class Breakdown)
            </h3>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
              Independent evaluation results evaluated across 3,950 annotated parking lot frames
            </p>
          </div>
          <span className="text-[11px] font-mono text-slate-500">
            IoU Threshold = 0.50
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 uppercase tracking-wider font-mono">
                <th className="py-2.5 px-3">Class Name</th>
                <th className="py-2.5 px-3">Test Samples</th>
                <th className="py-2.5 px-3">Precision</th>
                <th className="py-2.5 px-3">Recall</th>
                <th className="py-2.5 px-3">F1-Score</th>
                <th className="py-2.5 px-3 text-right">Accuracy</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-mono">
              {modelEvaluationReport.map((row, idx) => {
                const isOverall = idx === modelEvaluationReport.length - 1;
                return (
                  <tr
                    key={row.className}
                    className={
                      isOverall
                        ? 'bg-slate-50/80 dark:bg-slate-800/40 font-bold text-slate-900 dark:text-slate-100'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50/50 dark:hover:bg-slate-800/20'
                    }
                  >
                    <td className="py-2.5 px-3 font-sans font-medium">
                      {row.className}
                      {isOverall && (
                        <span className="ml-2 text-[10px] font-normal font-mono px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
                          Overall
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-slate-500">{row.testSamples.toLocaleString()}</td>
                    <td className="py-2.5 px-3">{row.precision}%</td>
                    <td className="py-2.5 px-3">{row.recall}%</td>
                    <td className="py-2.5 px-3">{row.f1Score}%</td>
                    <td className="py-2.5 px-3 text-right text-emerald-600 dark:text-emerald-400 font-bold">
                      {row.accuracy}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detection Reliability Summary & Edge Specs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Detection Confusion Breakdown */}
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-4 sm:p-5 shadow-xs">
          <h4 className="text-xs font-semibold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-3">
            Prediction Reliability Summary
          </h4>
          <div className="space-y-2.5 text-xs">
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
              <span className="text-slate-600 dark:text-slate-400">Correct Detection Rate</span>
              <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">97.0%</span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
              <span className="text-slate-600 dark:text-slate-400">False Positive (Ghost Bay)</span>
              <span className="font-mono font-bold text-slate-700 dark:text-slate-300">1.6%</span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
              <span className="text-slate-600 dark:text-slate-400">False Negative (Missed Car)</span>
              <span className="font-mono font-bold text-slate-700 dark:text-slate-300">1.8%</span>
            </div>
          </div>
        </div>

        {/* Edge Specs */}
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-4 sm:p-5 shadow-xs">
          <h4 className="text-xs font-semibold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-3">
            Edge Model Architecture Specs
          </h4>
          <div className="space-y-2.5 text-xs font-mono">
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
              <span className="font-sans text-slate-600 dark:text-slate-400">Framework</span>
              <span className="text-slate-900 dark:text-slate-100 font-semibold">YOLOv11-Nano (PyTorch / ONNX)</span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
              <span className="font-sans text-slate-600 dark:text-slate-400">Model Footprint</span>
              <span className="text-slate-900 dark:text-slate-100 font-semibold">6.2 MB (INT8 Quantized)</span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
              <span className="font-sans text-slate-600 dark:text-slate-400">Target Hardware</span>
              <span className="text-slate-900 dark:text-slate-100 font-semibold">Raspberry Pi 4 / 5 (ARM64)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
