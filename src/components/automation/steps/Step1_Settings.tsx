
'use client';

import React from 'react';
import { useWizard, OutputStyle, AspectRatio } from '@/components/automation/WizardContext';
import { LayoutTemplate, MonitorPlay, Smartphone, Box, Sparkles, Smile, PenTool, Film, Palette, Square } from 'lucide-react';
import { cn } from '@/lib/utils'; // Assuming basic className utility exists

export default function Step1_Settings() {
    const { settings, updateSettings, setStep } = useWizard();

    const styles: { id: OutputStyle; icon: React.ReactNode; label: string; desc: string }[] = [
        { id: 'stickman', icon: <Smile className="w-8 h-8 text-yellow-500" />, label: 'Cute Stickman', desc: 'Simple, engaging doodly style for high retention.' },
        { id: 'anime', icon: <Sparkles className="w-8 h-8 text-pink-500" />, label: 'Japanese Anime', desc: 'Vibrant colors and dramatic angles.' },
        { id: 'infographic', icon: <LayoutTemplate className="w-8 h-8 text-blue-500" />, label: 'Minimal Infographic', desc: 'Clean, professional style for B2B or explainer videos.' },
        { id: '3d', icon: <Box className="w-8 h-8 text-purple-500" />, label: '3D Animation', desc: 'Realistic 3D rendering for premium visuals.' },
        { id: 'cartoon', icon: <PenTool className="w-8 h-8 text-orange-500" />, label: 'Cartoon Explanation', desc: 'Educational style similar to Kurzgesagt.' },
        { id: 'movie', icon: <Film className="w-8 h-8 text-red-500" />, label: 'Movie Still', desc: 'Cinematic quality for storytelling.' },
        { id: 'american', icon: <Palette className="w-8 h-8 text-green-500" />, label: 'American Cartoon', desc: 'Bold lines and saturated colors.' },
        { id: 'flat', icon: <Square className="w-8 h-8 text-cyan-500" />, label: 'Flat Illustration', desc: 'Modern tech startup aesthetic.' },
    ];

    const ratios: { id: AspectRatio; icon: React.ReactNode; label: string }[] = [
        { id: '16:9', icon: <MonitorPlay className="w-8 h-8" />, label: 'Long Form (YouTube)' },
        { id: '9:16', icon: <Smartphone className="w-8 h-8" />, label: 'Shorts / TikTok' },
        { id: '1:1', icon: <Square className="w-8 h-8" />, label: 'Square (Instagram)' },
        { id: '3:4', icon: <LayoutTemplate className="w-8 h-8" />, label: 'Portrait (Feed)' },
    ];

    return (
        <div className="max-w-4xl mx-auto p-8">
            <h2 className="text-2xl font-bold mb-6 text-slate-800">Step 1: Video Format & Style</h2>

            {/* Aspect Ratio Selection */}
            <div className="mb-10">
                <h3 className="text-lg font-semibold text-slate-700 mb-4 flex items-center gap-2">
                    <span className="bg-slate-200 text-slate-600 rounded-full w-6 h-6 flex items-center justify-center text-xs">1</span>
                    Output Format
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {ratios.map((r) => (
                        <button
                            key={r.id}
                            onClick={() => updateSettings({ ratio: r.id })}
                            className={cn(
                                "flex flex-col items-center justify-center p-6 rounded-xl border-2 transition-all",
                                settings.ratio === r.id
                                    ? "border-indigo-600 bg-indigo-50 text-indigo-700 shadow-md transform scale-105"
                                    : "border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:bg-slate-50"
                            )}
                        >
                            <div className="mb-3 p-3 bg-white rounded-full shadow-sm">{r.icon}</div>
                            <span className="font-bold">{r.id}</span>
                            <span className="text-xs opacity-70 mt-1">{r.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Style Selection */}
            <div className="mb-10">
                <h3 className="text-lg font-semibold text-slate-700 mb-4 flex items-center gap-2">
                    <span className="bg-slate-200 text-slate-600 rounded-full w-6 h-6 flex items-center justify-center text-xs">2</span>
                    Creative Style
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {styles.map((s) => (
                        <button
                            key={s.id}
                            onClick={() => updateSettings({ style: s.id })}
                            className={cn(
                                "flex flex-col items-start text-left p-4 rounded-xl border-2 transition-all h-full relative overflow-hidden group",
                                settings.style === s.id
                                    ? "border-indigo-600 bg-indigo-50 ring-2 ring-indigo-200 ring-offset-2"
                                    : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                            )}
                        >
                            <div className="mb-3 transform group-hover:scale-110 transition-transform duration-300">{s.icon}</div>
                            <span className="font-bold text-slate-800 text-sm">{s.label}</span>
                            <p className="text-xs text-slate-500 mt-1 leading-snug">{s.desc}</p>

                            {/* Selection Indicator */}
                            {settings.style === s.id && (
                                <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-indigo-600 animate-pulse"></div>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex justify-end pt-6 border-t border-slate-200">
                <button
                    onClick={() => setStep(2)}
                    className="bg-black text-white px-8 py-3 rounded-lg font-bold hover:bg-slate-800 transition-colors flex items-center gap-2"
                >
                    Next Step
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                </button>
            </div>
        </div>
    );
}
