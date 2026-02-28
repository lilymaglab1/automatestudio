
'use client';

import React, { useState } from 'react';
import { useWizard, Segment } from '@/components/automation/WizardContext';
import { imageModels } from '@/lib/automation-constants';
import { Image as ImageIcon, RefreshCw, Trash2, Plus, Play, Pause, Wand2, Clock, Check, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Step4_Image() {
    const { settings, updateSettings, segments, updateSegment, setStep, setSegments } = useWizard();
    const [generatingId, setGeneratingId] = useState<string | null>(null);
    const [autoGenerating, setAutoGenerating] = useState(false);

    const handleGenerateImage = async (id: string, delay = 0) => {
        if (delay > 0) {
            await new Promise((resolve) => setTimeout(resolve, delay));
        }

        setGeneratingId(id);
        const segment = segments.find(s => s.id === id);

        if (!segment) {
            setGeneratingId(null);
            return;
        }

        try {
            const res = await fetch('/api/ai/image', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    prompt: segment.prompt,
                    ratio: settings.ratio,
                    style: settings.style,
                    model: settings.imageModel || 'pollinations'
                })
            });

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                throw new Error(errorData.error || `Failed to generate image (${res.status})`);
            }

            const data = await res.json();
            if (data.imageUrl) {
                updateSegment(id, { imageUrl: data.imageUrl });
            }
        } catch (error: any) {
            console.error("Image generation error:", error);
            alert("이미지 생성 실패: " + error.message);
        } finally {
            setGeneratingId(null);
        }
    };

    const handleGenerateAll = () => {
        setAutoGenerating(true);
        let delay = 0;
        segments.forEach((seg, index) => {
            if (!seg.imageUrl) {
                setTimeout(() => handleGenerateImage(seg.id), delay);
                delay += 2500;
            }
        });
        setTimeout(() => setAutoGenerating(false), delay + 1000);
    };

    // Auto-parse script text into segments when we enter this step
    React.useEffect(() => {
        console.log("Step 4 useEffect triggered. scriptRaw:", settings.scriptRaw ? "Exists" : "Empty", "segments length:", segments.length);

        if (!settings.scriptRaw) return;

        // If segments already exist AND they are not just the default placeholder, don't overwrite
        // Let's assume a default placeholder has id '1' and text '최근...' as seen in the screenshot
        const hasOnlyDefaultPlaceholder = segments.length === 1 && segments[0].text.includes('최근 환율이');

        if (segments.length > 0 && !hasOnlyDefaultPlaceholder) {
            console.log("Segments already populated with real data, skipping parse.");
            return;
        }

        const rawText = settings.scriptRaw;
        console.log("Raw text to parse:", rawText.substring(0, 100) + "...");

        // Split by segment markers like **[Segment 1]**, [Segment 1], etc.
        const segmentBlocks = rawText.split(/(?:(?:\*\*|)\[Segment \d+\](?:\*\*|))/i).filter(s => s.trim().length > 0);
        console.log("Found segment blocks:", segmentBlocks.length);

        const newSegments: Segment[] = [];

        // If no segments found, at least add one generic block
        if (segmentBlocks.length === 0) {
            console.log("No segment blocks found by regex. Creating generic block.");
            newSegments.push({
                id: '1',
                text: rawText.substring(0, 150) + '...',
                prompt: 'Scene derived from text: ' + rawText.substring(0, 50),
                duration: 5,
                imageUrl: ''
            });
            setSegments(newSegments);
            return;
        }

        segmentBlocks.forEach((block, idx) => {
            const cutId = String(idx + 1);
            // Try to extract "Visual: ..." or "Prompt: ..."
            const visualMatch = block.match(/(?:Visual|Prompt|Visual Prompt):\s*(.+)/i);
            const textMatch = block.match(/(?:Text|Narration|Voice|대사|내레이션):\s*(.+)/i);

            let promptStr = visualMatch ? visualMatch[1].trim() : "Auto-generated prompt for scene " + cutId;
            let narrationStr = textMatch ? textMatch[1].trim() : block.trim().substring(0, 100);

            // Clean up Markdown asterisks if any
            narrationStr = narrationStr.replace(/\*\*/g, '').replace(/"/g, '');

            newSegments.push({
                id: cutId,
                text: narrationStr,
                prompt: promptStr,
                duration: 5,
                imageUrl: ''
            });
        });

        if (newSegments.length > 0) {
            setSegments(newSegments);
        }
    }, [settings.scriptRaw, segments.length, setSegments]);

    return (
        <div className="max-w-6xl mx-auto p-6">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                    Step 4: AI Storyboard
                    <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full font-medium">Auto-Segmented</span>
                </h2>
                <div className="flex gap-3">
                    <select
                        value={settings.imageModel || 'pollinations'}
                        onChange={(e) => updateSettings({ imageModel: e.target.value })}
                        className="bg-white border border-slate-300 text-slate-700 text-sm rounded-lg p-2.5"
                    >
                        {imageModels.map(m => (
                            <option key={m.id} value={m.id}>{m.label}</option>
                        ))}
                    </select>
                    <button
                        onClick={handleGenerateAll}
                        disabled={autoGenerating}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 disabled:opacity-70 transition-colors shadow-sm"
                    >
                        {autoGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
                        {autoGenerating ? "Auto-Generating..." : "Generate All Images"}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[600px] overflow-hidden">
                {/* Left: Timeline & Segments List */}
                <div className="overflow-y-auto pr-2 space-y-4 h-full pb-20">
                    {segments.map((seg, index) => (
                        <div key={seg.id} className={cn("bg-white border rounded-xl p-4 transition-all shadow-sm group hover:border-indigo-300", generatingId === seg.id ? "border-indigo-500 ring-1 ring-indigo-500" : "border-slate-200")}>
                            <div className="flex items-start justify-between mb-3">
                                <span className="bg-slate-100 text-slate-600 text-xs font-bold px-2 py-1 rounded">Cut {index + 1}</span>
                                <div className="flex items-center gap-2">
                                    <div className="flex items-center bg-slate-50 border border-slate-200 rounded px-2 py-1 text-xs text-slate-500 hover:border-indigo-300 focus-within:border-indigo-500 transition-colors">
                                        <Clock className="w-3 h-3 mr-1" />
                                        <input
                                            type="number"
                                            value={seg.duration}
                                            onChange={(e) => updateSegment(seg.id, { duration: Number(e.target.value) })}
                                            className="w-8 bg-transparent text-center focus:outline-none font-medium"
                                        />
                                        s
                                    </div>
                                    <button className="text-slate-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            <textarea
                                value={seg.text}
                                onChange={(e) => updateSegment(seg.id, { text: e.target.value })}
                                className="w-full text-sm text-slate-800 font-medium resize-none bg-transparent border-none focus:ring-0 p-0 mb-3"
                                rows={2}
                            />

                            <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
                                <label className="text-[10px] uppercase font-bold text-slate-400 mb-1 block">Image Prompt</label>
                                <textarea
                                    value={seg.prompt}
                                    onChange={(e) => updateSegment(seg.id, { prompt: e.target.value })}
                                    className="w-full text-xs text-slate-600 bg-transparent border-none resize-none focus:ring-0 p-0"
                                    rows={2}
                                />
                            </div>
                        </div>
                    ))}

                    <button
                        onClick={() => {
                            const newId = String(segments.length + 1);
                            setSegments([...segments, { id: newId, text: "", duration: 3, prompt: "New scene...", imageUrl: "" }]);
                        }}
                        className="w-full border-2 border-dashed border-slate-300 rounded-xl p-3 text-slate-400 hover:border-indigo-400 hover:text-indigo-500 hover:bg-slate-50 transition-all font-bold text-sm flex items-center justify-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        Add New Scene
                    </button>
                </div>

                {/* Right: Preview Area */}
                <div className="bg-black/5 rounded-xl border border-dashed border-slate-300 p-6 flex items-center justify-center relative overflow-hidden">
                    {/* Placeholder for selected/preview image */}
                    <div className="absolute inset-0 bg-slate-900 flex items-center justify-center text-slate-500">
                        {segments.find(s => !s.imageUrl) && autoGenerating ? (
                            <div className="text-center">
                                <Loader2 className="w-10 h-10 animate-spin text-purple-500 mx-auto mb-4" />
                                <p className="text-slate-400">Generative AI is dreaming...</p>
                                <div className="mt-4 flex gap-1 justify-center">
                                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce delay-75"></div>
                                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce delay-150"></div>
                                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce delay-300"></div>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center">
                                <ImageIcon className="w-16 h-16 opacity-20 mx-auto mb-4" />
                                <p>Select a scene to preview or generate images.</p>
                            </div>
                        )}
                    </div>

                    {/* Show first generated image for demo */}
                    {segments.some(s => s.imageUrl) && (
                        <div className="absolute inset-0 bg-black flex items-center justify-center">
                            {/* Just showing a grid of generated images for now */}
                            <div className="grid grid-cols-2 gap-2 p-4 w-full h-full overflow-y-auto">
                                {segments.filter(s => s.imageUrl).map(s => (
                                    <div key={s.id} className="relative aspect-video bg-slate-800 rounded-lg overflow-hidden border border-slate-700 group">
                                        <img src={s.imageUrl} alt={s.prompt} className="w-full h-full object-cover" />
                                        <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-2 text-white text-xs truncate opacity-0 group-hover:opacity-100 transition-opacity">
                                            Cut {s.id}
                                        </div>
                                        <button
                                            onClick={() => handleGenerateImage(s.id)}
                                            className="absolute top-2 right-2 p-1.5 bg-black/50 hover:bg-indigo-600 rounded-md text-white opacity-0 group-hover:opacity-100 transition-all"
                                        >
                                            <RefreshCw className="w-3 h-3" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex justify-between pt-6 mt-4 border-t border-slate-200">
                <button
                    onClick={() => setStep(3)}
                    className="text-slate-500 hover:text-slate-800 font-medium px-4 py-2"
                >
                    Back
                </button>
                <button
                    onClick={() => setStep(5)}
                    className="bg-black text-white px-8 py-3 rounded-lg font-bold hover:bg-slate-800 transition-colors flex items-center gap-2"
                >
                    Next Step
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                </button>
            </div>
        </div>
    );
}
