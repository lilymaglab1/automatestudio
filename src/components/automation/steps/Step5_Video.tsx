
'use client';

import React, { useState, useEffect } from 'react';
import { useWizard, Segment } from '@/components/automation/WizardContext';
import { Play, Loader2, CheckCircle2, AlertTriangle, AlertOctagon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { videoModels } from '@/lib/automation-constants';

export default function Step5_Video() {
    const { settings, updateSettings, segments, updateSegment, setStep } = useWizard();
    const [isGenerating, setIsGenerating] = useState(false);
    const [progress, setProgress] = useState<Record<string, number>>({});
    const [completedCount, setCompletedCount] = useState(0);

    const startGeneration = () => {
        setIsGenerating(true);
        setCompletedCount(0);

        segments.forEach((seg, index) => {
            let p = 0;
            const interval = setInterval(() => {
                p += Math.random() * 15;
                if (p > 100) {
                    p = 100;
                    clearInterval(interval);
                    setCompletedCount(prev => prev + 1);
                }
                setProgress(prev => ({ ...prev, [seg.id]: p }));
            }, 500 + (index * 200)); // Stagger slightly
        });
    };

    useEffect(() => {
        if (completedCount === segments.length && segments.length > 0) {
            setIsGenerating(false);
        }
    }, [completedCount, segments.length]);

    const allCompleted = segments.length > 0 && completedCount === segments.length;

    return (
        <div className="max-w-4xl mx-auto p-8 text-center">
            <h2 className="text-2xl font-bold mb-2 text-slate-800">Step 5: Motion Synthesis</h2>
            <p className="text-slate-500 mb-8">Transform your static storyboard into dynamic video clips.</p>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-8 mb-8">
                <div className="flex items-center justify-center gap-4 mb-6">
                    <label className="text-sm font-bold text-slate-700">Video Model:</label>
                    <select
                        value={settings.videoModel || videoModels[0].id}
                        onChange={(e) => updateSettings({ videoModel: e.target.value })}
                        className="bg-white border border-slate-300 rounded-lg px-4 py-2 text-slate-800 font-medium focus:ring-2 focus:ring-indigo-500"
                    >
                        {videoModels.map(m => (
                            <option key={m.id} value={m.id}>
                                {m.label} {m.isPro ? '(PRO)' : ''}
                            </option>
                        ))}
                    </select>
                </div>

                {!isGenerating && !allCompleted ? (
                    <button
                        onClick={startGeneration}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-10 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-indigo-200 transition-all flex items-center justify-center gap-3 w-full max-w-md mx-auto"
                    >
                        <Play className="w-6 h-6 fill-white" />
                        Start Video Generation ({segments.length * 5} Credits)
                    </button>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left max-h-[400px] overflow-y-auto">
                        {segments.map((seg) => (
                            <div key={seg.id} className="bg-white border border-slate-200 p-4 rounded-lg flex items-center gap-4 shadow-sm">
                                <div className="w-16 h-16 bg-slate-100 rounded-md shrink-0 overflow-hidden relative">
                                    {seg.imageUrl ? (
                                        <img src={seg.imageUrl} className="w-full h-full object-cover opacity-50" />
                                    ) : (
                                        <div className="w-full h-full bg-slate-200 animate-pulse"></div>
                                    )}
                                    <div className="absolute inset-0 flex items-center justify-center font-bold text-xs text-slate-500">
                                        Cut {seg.id}
                                    </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-xs font-bold text-slate-700 truncate">{seg.text}</span>
                                        <span className="text-xs font-mono text-slate-400">{Math.round(progress[seg.id] || 0)}%</span>
                                    </div>
                                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                                        <div
                                            className={cn("h-full transition-all duration-300", progress[seg.id] === 100 ? "bg-green-500" : "bg-indigo-500")}
                                            style={{ width: `${progress[seg.id] || 0}%` }}
                                        ></div>
                                    </div>
                                </div>
                                {progress[seg.id] === 100 && <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />}
                            </div>
                        ))}
                    </div>
                )}

                {isGenerating && (
                    <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800 text-sm flex items-start gap-3 text-left">
                        <AlertTriangle className="w-5 h-5 shrink-0" />
                        <div>
                            <span className="font-bold block mb-1">Do not close this tab!</span>
                            Generating video requires maintaining the session. Please wait until all clips are processed.
                        </div>
                    </div>
                )}
            </div>

            <div className="flex justify-between pt-6 border-t border-slate-200">
                <button
                    onClick={() => setStep(4)}
                    className="text-slate-500 hover:text-slate-800 font-medium px-4 py-2"
                    disabled={isGenerating}
                >
                    Back
                </button>
                <button
                    onClick={() => setStep(6)}
                    disabled={!allCompleted}
                    className="bg-black text-white px-8 py-3 rounded-lg font-bold hover:bg-slate-800 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Next: Final Render
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                </button>
            </div>
        </div>
    );
}
