
'use client';

import React, { useState } from 'react';
import { useWizard } from '@/components/automation/WizardContext';
import { PlayCircle, PauseCircle, Mic, CheckCircle, Volume2, User2, Download } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Voice {
    id: string;
    name: string;
    gender: 'male' | 'female';
    desc: string;
    sampleUrl: string; // Mock URL
}

const mockVoices: Voice[] = [
    { id: 'v1', name: 'James', gender: 'male', desc: 'Deep, authoritative newscaster', sampleUrl: '#' },
    { id: 'v2', name: 'Sophia', gender: 'female', desc: 'Clear, modern AI assistant', sampleUrl: '#' },
    { id: 'v3', name: 'Dr. Kim', gender: 'male', desc: 'Professor, educational tone', sampleUrl: '#' },
    { id: 'v4', name: 'Yuna', gender: 'female', desc: 'Friendly, casual storyteller', sampleUrl: '#' },
    { id: 'v5', name: 'Reporter Park', gender: 'male', desc: 'Fast-paced reporting', sampleUrl: '#' },
    { id: 'v6', name: 'Grandma Story', gender: 'female', desc: 'Warm, elderly narration', sampleUrl: '#' },
];

export default function Step3_Voice() {
    const { settings, updateSettings, setStep, segments, updateSegment } = useWizard();
    const [selectedVoiceId, setSelectedVoiceId] = useState<string>(settings.selectedVoice || 'v1');
    const [isGenerating, setIsGenerating] = useState(false);
    const [audioReady, setAudioReady] = useState(false);
    const [isPlaying, setIsPlaying] = useState<string | null>(null);

    const handleGenerate = () => {
        setIsGenerating(true);
        // Simulate API call
        setTimeout(() => {
            setIsGenerating(false);
            setAudioReady(true);
            updateSettings({ selectedVoice: selectedVoiceId });
        }, 2000);
    };

    const togglePlay = (id: string) => {
        if (isPlaying === id) {
            setIsPlaying(null);
        } else {
            setIsPlaying(id);
            setTimeout(() => setIsPlaying(null), 3000); // Mock stop
        }
    };

    return (
        <div className="max-w-6xl mx-auto p-8 h-[calc(100vh-200px)] flex flex-col">
            <h2 className="text-2xl font-bold mb-6 text-slate-800 flex items-center gap-2">
                Step 3: AI Voice Casting
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">150+ Voices</span>
            </h2>

            <div className="flex gap-8 flex-1 min-h-0">
                {/* Left: Script Preview */}
                <div className="w-1/3 bg-slate-50 border border-slate-200 rounded-xl p-6 overflow-y-auto">
                    <h3 className="text-sm font-bold text-slate-500 uppercase mb-4">Script Preview</h3>
                    <div className="space-y-4">
                        {segments.map((seg, idx) => (
                            <div key={seg.id} className="text-sm text-slate-700 leading-relaxed border-l-2 border-slate-200 pl-3">
                                <span className="text-xs text-slate-400 block mb-1">Cut {idx + 1} ({seg.duration}s)</span>
                                {seg.text}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right: Voice Selection */}
                <div className="flex-1 flex flex-col">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto pr-2 pb-4">
                        {mockVoices.map((voice) => (
                            <div
                                key={voice.id}
                                onClick={() => setSelectedVoiceId(voice.id)}
                                className={cn(
                                    "p-4 rounded-xl border transition-all cursor-pointer relative group hover:shadow-md",
                                    selectedVoiceId === voice.id
                                        ? "border-indigo-500 bg-indigo-50 ring-1 ring-indigo-500"
                                        : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                                )}
                            >
                                <div className="flex items-start justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <div className={cn("p-2 rounded-full", voice.gender === 'male' ? "bg-blue-100 text-blue-600" : "bg-pink-100 text-pink-600")}>
                                            <User2 className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <div className="font-bold text-slate-800">{voice.name}</div>
                                            <div className="text-xs text-slate-500">{voice.desc}</div>
                                        </div>
                                    </div>
                                    {selectedVoiceId === voice.id && <CheckCircle className="w-5 h-5 text-indigo-600" />}
                                </div>

                                <button
                                    onClick={(e) => { e.stopPropagation(); togglePlay(voice.id); }}
                                    className="w-full mt-3 bg-white border border-slate-200 rounded-lg py-2 flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors"
                                >
                                    {isPlaying === voice.id ? <PauseCircle className="w-4 h-4 text-indigo-600" /> : <PlayCircle className="w-4 h-4 text-slate-400" />}
                                    <span className="text-xs font-medium text-slate-600">{isPlaying === voice.id ? "Playing..." : "Sample"}</span>
                                </button>
                            </div>
                        ))}
                        {/* Mock Add Voice Plus Button */}
                        <div className="border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center p-4 text-slate-400 hover:border-slate-400 hover:text-slate-600 cursor-pointer transition-colors">
                            <Mic className="w-6 h-6 mb-2" />
                            <span className="text-sm font-medium">Clone User Voice</span>
                        </div>
                    </div>

                    <div className="mt-auto pt-6 border-t border-slate-200">
                        {isGenerating ? (
                            <div className="w-full bg-slate-100 p-4 rounded-xl flex items-center justify-center gap-3 animate-pulse border border-slate-200">
                                <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                                <span className="text-slate-600 font-medium">Synthesizing audio (Neural Text-to-Speech)...</span>
                            </div>
                        ) : audioReady ? (
                            <div className="w-full bg-green-50 p-4 rounded-xl border border-green-200 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="bg-green-100 p-2 rounded-full text-green-600">
                                        <Volume2 className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <span className="text-green-800 font-bold block">Audio Generated!</span>
                                        <span className="text-xs text-green-600">Total Duration: 22.4s • {segments.length} Segments</span>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button className="p-2 hover:bg-green-100 rounded-lg text-green-700" title="Listen Full">
                                        <PlayCircle className="w-5 h-5" />
                                    </button>
                                    <button className="p-2 hover:bg-green-100 rounded-lg text-green-700" title="Download">
                                        <Download className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <button
                                onClick={handleGenerate}
                                className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-indigo-700 transition-colors shadow-lg hover:shadow-indigo-200 flex items-center justify-center gap-2"
                            >
                                <Sparkles className="w-5 h-5" />
                                Generate Full Audio
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex justify-between pt-6 mt-4 border-t border-slate-200">
                <button
                    onClick={() => setStep(2)}
                    className="text-slate-500 hover:text-slate-800 font-medium px-4 py-2"
                >
                    Back
                </button>
                <button
                    onClick={() => setStep(4)}
                    disabled={!audioReady}
                    className="bg-black text-white px-8 py-3 rounded-lg font-bold hover:bg-slate-800 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Next Step
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                </button>
            </div>
        </div>
    );
}
