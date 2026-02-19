
'use client';

import React, { useState } from 'react';
import { useWizard, Segment } from '@/components/automation/WizardContext';
import { Download, FileText, ImageIcon, PlayCircle, Loader2, CheckCircle2 } from 'lucide-react';

export default function Step6_Render() {
    const { settings, segments } = useWizard();
    const [rendering, setRendering] = useState(false);
    const [finalVideoUrl, setFinalVideoUrl] = useState<string | null>(null);
    const [thumbnail, setThumbnail] = useState<string | null>(null);

    const handleRender = () => {
        setRendering(true);
        // Simulate ffmpeg rendering
        setTimeout(() => {
            setRendering(false);
            setFinalVideoUrl("https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"); // Reliable sample video
        }, 3000);
    };

    const handleGenerateThumbnail = () => {
        // Simulate thumbnail generation
        setThumbnail(`https://placehold.co/1280x720/EEE/31343C?text=${settings.topic || 'Video Thumbnail'}&font=opensans`);
    };

    return (
        <div className="max-w-6xl mx-auto p-8 h-[calc(100vh-120px)] overflow-y-auto">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Final Export</h2>
                    <p className="text-slate-500">Combine all generated assets into a complete video.</p>
                </div>
                <div className="flex gap-4">
                    <button className="text-slate-500 hover:text-slate-800 font-medium px-4 py-2 border border-slate-200 rounded-lg bg-white">
                        Export SRT
                    </button>
                    <button className="text-white bg-black hover:bg-slate-800 font-bold px-6 py-2 rounded-lg shadow-lg flex items-center gap-2">
                        <Download className="w-4 h-4" />
                        Download Project
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left: Video Preview */}
                <div className="lg:col-span-2">
                    <div className="bg-black rounded-xl aspect-video relative overflow-hidden flex items-center justify-center shadow-xl group border border-slate-800">
                        {finalVideoUrl ? (
                            <video
                                src={finalVideoUrl}
                                controls
                                autoPlay
                                className="w-full h-full object-contain"
                            />
                        ) : rendering ? (
                            <div className="text-center text-white">
                                <Loader2 className="w-12 h-12 animate-spin text-indigo-500 mx-auto mb-4" />
                                <p className="font-medium animate-pulse">Rendering Final Compilation...</p>
                                <p className="text-xs text-slate-500 mt-2">Merging audio, video, and subtitles</p>
                            </div>
                        ) : (
                            <div className="text-center text-slate-500 group-hover:text-white transition-colors cursor-pointer" onClick={handleRender}>
                                <PlayCircle className="w-20 h-20 mx-auto mb-4 opacity-50 group-hover:opacity-100 transition-opacity" />
                                <p className="font-bold">Click to Render Preview</p>
                            </div>
                        )}
                    </div>

                    <div className="mt-6 bg-white border border-slate-200 rounded-xl p-6">
                        <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <ImageIcon className="w-5 h-5 text-indigo-600" />
                            Smart Thumbnail Generator
                        </h3>
                        <div className="flex gap-6">
                            <div className="w-48 aspect-video bg-slate-100 rounded-lg overflow-hidden border border-slate-200 relative shrink-0">
                                {thumbnail ? (
                                    <img src={thumbnail} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">No Thumbnail</div>
                                )}
                            </div>
                            <div className="flex-1">
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Title Text</label>
                                <input
                                    type="text"
                                    defaultValue={settings.topic || "My Awesome Video"}
                                    className="w-full border border-slate-300 rounded-lg p-2.5 text-sm mb-3"
                                />
                                <button
                                    onClick={handleGenerateThumbnail}
                                    className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100 px-4 py-2 rounded-lg text-sm font-bold transition-colors w-full"
                                >
                                    Generate with NanoBanana Pro
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right: Asset List */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 h-full flex flex-col">
                    <h3 className="font-bold text-slate-800 mb-4 text-sm uppercase tracking-wide">Included Assets</h3>

                    <div className="space-y-3 mb-6 bg-white rounded-lg p-2 border border-slate-200">
                        <div className="flex items-center justify-between p-2 border-b border-slate-100">
                            <span className="text-sm font-medium text-slate-600">Video Clips</span>
                            <span className="text-xs font-bold bg-slate-100 text-slate-500 px-2 py-0.5 rounded">{segments.length} Files</span>
                        </div>
                        <div className="flex items-center justify-between p-2 border-b border-slate-100">
                            <span className="text-sm font-medium text-slate-600">Audio Voiceover</span>
                            <span className="text-xs font-bold bg-green-100 text-green-600 px-2 py-0.5 rounded">Mastered</span>
                        </div>
                        <div className="flex items-center justify-between p-2">
                            <span className="text-sm font-medium text-slate-600">Subtitles (.srt)</span>
                            <div className="flex items-center gap-2">
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" checked={settings.includeSubtitles} className="sr-only peer" readOnly />
                                    <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="mt-auto">
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-xs text-yellow-800 mb-4">
                            <span className="font-bold block mb-1">Estimated Cost:</span>
                            {segments.length * 5} Credits will be deducted from your account balance upon final download.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
