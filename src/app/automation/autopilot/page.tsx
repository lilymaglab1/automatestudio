
'use client';

import React, { useState, useEffect } from 'react';
import { Bot, Sparkles, Youtube, ArrowRight, Loader2, CheckCircle, Terminal } from 'lucide-react';
import TopMenu from '@/components/shared/TopMenu';
import { cn } from '@/lib/utils';

export default function AutopilotPage() {
    const [topic, setTopic] = useState('');
    const [isRunning, setIsRunning] = useState(false);
    const [logs, setLogs] = useState<string[]>([]);
    const [resultUrl, setResultUrl] = useState<string | null>(null);

    const startAutopilot = () => {
        if (!topic) return;
        setIsRunning(true);
        setLogs(['Initializing Agent...']);

        // Mock Progress Sequence
        const sequence = [
            { text: "Analyzing Topic: " + topic, delay: 1000 },
            { text: "Generating Script with Gemini 3 Pro...", delay: 2500 },
            { text: "Selecting Voice: 'Narrator - Calm'", delay: 3500 },
            { text: "Synthesizing Audio (42s)...", delay: 5000 },
            { text: "Segmenting Script into 6 Cuts...", delay: 6000 },
            { text: "Generating Image for Cut 1 (Stickman Style)...", delay: 7500 },
            { text: "Generating Image for Cut 2...", delay: 9000 },
            { text: "Generating Image for Cut 3...", delay: 10500 },
            { text: "Generating Image for Cut 4...", delay: 12000 },
            { text: "Generating Image for Cut 5...", delay: 13500 },
            { text: "Generating Image for Cut 6...", delay: 15000 },
            { text: "Synthesizing Video Motion (Seedance V1)...", delay: 18000 },
            { text: "Compositing Final Video...", delay: 22000 },
            { text: "Rendering 1080p MP4...", delay: 25000 },
            { text: "DONE! Video is ready.", delay: 27000 },
        ];

        sequence.forEach(({ text, delay }) => {
            setTimeout(() => {
                setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${text}`]);
            }, delay);
        });

        setTimeout(() => {
            setIsRunning(false);
            setResultUrl("https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4"); // Dummy result
        }, 28000);
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
            <TopMenu />

            <div className="flex-1 flex flex-col items-center justify-center p-6 relative overflow-hidden">
                {/* Background Decor */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none opacity-30">
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
                    <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-yellow-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
                    <div className="absolute -bottom-8 left-1/3 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
                </div>

                {!isRunning && !resultUrl ? (
                    <div className="max-w-2xl w-full text-center">
                        <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full font-bold text-sm mb-6 shadow-sm">
                            <Sparkles className="w-4 h-4 fill-indigo-500" />
                            AI Autopilot Agent V2.0
                        </div>
                        <h1 className="text-5xl font-black text-slate-900 mb-6 tracking-tight">
                            One Topic. <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Full Video Automation.</span>
                        </h1>
                        <p className="text-slate-600 text-lg mb-10 leading-relaxed">
                            Just tell us what to make. The agent will handle script writing, voice casting, image generation, video synthesis, and editing automatically.
                        </p>

                        <div className="bg-white p-2 rounded-2xl shadow-2xl border border-indigo-100 flex items-center gap-2 transform transition-transform hover:scale-105 duration-300">
                            <div className="bg-slate-100 p-3 rounded-xl">
                                <Bot className="w-6 h-6 text-slate-500" />
                            </div>
                            <input
                                type="text"
                                value={topic}
                                onChange={(e) => setTopic(e.target.value)}
                                placeholder="Example: The future of space travel in 2050..."
                                className="flex-1 text-lg font-medium text-slate-800 placeholder:text-slate-300 border-none focus:ring-0 bg-transparent"
                                onKeyDown={(e) => e.key === 'Enter' && startAutopilot()}
                            />
                            <button
                                onClick={startAutopilot}
                                disabled={!topic}
                                className="bg-black hover:bg-indigo-600 text-white px-8 py-4 rounded-xl font-bold text-lg transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                            >
                                Start Agent
                                <ArrowRight className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="mt-8 flex justify-center gap-4 text-xs font-semibold text-slate-400 uppercase tracking-widest">
                            <span>Script • Genre • Voice • Visuals • SFX • Subtitles</span>
                        </div>
                    </div>
                ) : isRunning ? (
                    <div className="max-w-3xl w-full bg-black rounded-2xl shadow-2xl overflow-hidden border border-slate-800 text-green-400 font-mono text-sm flex flex-col h-[600px]">
                        {/* Terminal Header */}
                        <div className="bg-slate-900 px-4 py-3 flex items-center gap-2 border-b border-slate-800">
                            <div className="flex gap-2">
                                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                            </div>
                            <span className="text-slate-400 ml-2 text-xs">agent-runner — node environment</span>
                        </div>

                        {/* Terminal Body */}
                        <div className="flex-1 p-6 overflow-y-auto space-y-2 font-mono scroll-smooth" id="terminal-logs">
                            {logs.map((log, i) => (
                                <div key={i} className="flex gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                    <span className="text-slate-600 select-none">$</span>
                                    <span>{log}</span>
                                </div>
                            ))}
                            <div className="animate-pulse">_</div>
                        </div>

                        {/* Visualizer (Fake) */}
                        <div className="h-32 bg-slate-900 border-t border-slate-800 relative overflow-hidden flex items-center justify-center">
                            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>
                            <div className="flex items-center gap-8 opacity-50">
                                <Loader2 className="w-8 h-8 animate-spin text-green-500" />
                                <div className="h-2 w-48 bg-slate-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-green-500 animate-progress w-full origin-left duration-[28000ms] transition-all"></div>
                                </div>
                                <span className="text-green-500 font-bold blink">PROCESSING...</span>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="max-w-4xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden border border-indigo-100 p-8 text-center animate-in zoom-in duration-500">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600">
                            <CheckCircle className="w-10 h-10" />
                        </div>
                        <h2 className="text-3xl font-black text-slate-900 mb-2">Automation Complete!</h2>
                        <p className="text-slate-500 mb-8">Your video has been generated successfully using 4 AI models.</p>

                        <div className="aspect-video bg-black rounded-xl overflow-hidden shadow-lg mb-8 relative group cursor-pointer border-4 border-slate-100">
                            <video src={resultUrl!} controls className="w-full h-full object-cover" />
                        </div>

                        <div className="flex justify-center gap-4">
                            <button className="text-slate-600 hover:text-slate-900 font-bold px-6 py-3 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
                                Download SRT
                            </button>
                            <button className="bg-black hover:bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold transition-colors shadow-lg flex items-center gap-2">
                                <Youtube className="w-5 h-5 text-red-500 fill-red-500 bg-white rounded-full scale-110 border-2 border-white" />
                                Upload to YouTube
                            </button>
                            <button onClick={() => { setIsRunning(false); setResultUrl(null); setTopic(''); }} className="text-indigo-600 font-bold px-6 py-3 hover:bg-indigo-50 rounded-xl transition-colors">
                                Create Another
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
