import React from 'react';

export const AboutProjectView: React.FC = () => {
  const pipelineSteps = [
    { step: 1, title: 'Data Collection', tech: 'CCTV Stream', desc: '1080p surveillance video input' },
    { step: 2, title: 'Image Enhancement', tech: 'OpenCV CLAHE', desc: 'Contrast and shadow normalization' },
    { step: 3, title: 'Detection', tech: 'YOLOv11', desc: 'Slot bounding boxes & classification' },
    { step: 4, title: 'Processing', tech: 'Edge Inference', desc: 'Quantized real-time execution' },
    { step: 5, title: 'Navigation', tech: 'Graph Solver', desc: 'Shortest path along lot lanes' },
    { step: 6, title: 'Display', tech: 'Web Dashboard', desc: 'Live occupancy & driver guidance' },
  ];

  return (
    <div className="space-y-4">
      {/* Project Header */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 sm:p-6 shadow-xs">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 block mb-1">
          Cornerstone Project · CSE (AI & ML)
        </span>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          Smart Parking Management System Using Computer Vision and Edge AI
        </h1>
        <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 max-w-3xl leading-relaxed">
          Real-time parking slot occupancy detection and intelligent bay guidance using computer vision and YOLOv11.
        </p>

        {/* Tech Chips */}
        <div className="flex flex-wrap gap-1.5 mt-3.5">
          {['Python', 'OpenCV', 'YOLOv11', 'React', 'TypeScript', 'Tailwind CSS'].map((chip) => (
            <span
              key={chip}
              className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60"
            >
              {chip}
            </span>
          ))}
        </div>
      </div>

      {/* Team & Guide Credentials */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Project Team */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 block mb-3">
            Project Team
          </span>
          <div className="space-y-2">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
              <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                Pranav Kumar Dugutta
              </h4>
              <p className="text-[11px] text-slate-500 mt-0.5">
                CSE (AI & ML)
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
              <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                Kasipeta Sharoon
              </h4>
              <p className="text-[11px] text-slate-500 mt-0.5">
                CSE (AI & ML)
              </p>
            </div>
          </div>
        </div>

        {/* Project Guide */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 block mb-3">
              Project Guide
            </span>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
              <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                Mr. M Seshanna
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                Assistant Professor
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Department of Computer Science & Engineering (AI & ML)
              </p>
            </div>
          </div>
          <p className="text-[11px] text-slate-400 mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800">
            Cornerstone Project · Academic Evaluation
          </p>
        </div>
      </div>

      {/* 6-Step Pipeline Architecture */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">
          Pipeline Architecture
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {pipelineSteps.map((s) => (
            <div
              key={s.step}
              className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="w-5 h-5 rounded-md bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 font-mono font-bold text-[10px] flex items-center justify-center">
                    {s.step}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    {s.tech}
                  </span>
                </div>
                <h4 className="text-xs font-semibold text-slate-900 dark:text-slate-100 mb-0.5">
                  {s.title}
                </h4>
                <p className="text-[11px] text-slate-500 leading-snug">
                  {s.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
