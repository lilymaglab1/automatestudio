'use client';

import React, { useState, useEffect } from 'react';
import { useWizard } from '@/components/automation/WizardContext';
import {
    ChevronLeft,
    ChevronRight,
    Pencil,
    Type,
    Upload,
    Sparkles,
    Timer as TimerIcon,
    Loader2,
    AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Step2_Script() {
    const { settings, updateSettings, setStep, setSegments } = useWizard();
    const [isGenerating, setIsGenerating] = useState(false);
    const [topicInput, setTopicInput] = useState(settings.scriptRaw || settings.topic || '');
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = async () => {
        if (!topicInput) return;
        setIsGenerating(true);
        setError(null);

        try {
            const response = await fetch('/api/ai/script', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    topic: topicInput,
                    ratio: settings.ratio,
                    style: settings.style
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to generate script');
            }

            // Simple parser for [Segment] format or just save as raw
            updateSettings({ scriptRaw: data.script, topic: topicInput });
            setTopicInput(data.script);

            // For now, let's keep the user on the same page to review the script
            // In a more advanced version, we'd auto-parse segments here
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleNext = () => {
        if (!settings.scriptRaw && !topicInput) return;

        // If they didn't generate but typed something, save it
        if (topicInput && !settings.scriptRaw) {
            updateSettings({ scriptRaw: topicInput, topic: topicInput });
        }

        // Mock segment parsing (we'll improve this later)
        const mockSegments = [
            { id: '1', text: "최근 환율이 급격히 오르며 1500원선을 위협하고 있습니다.", duration: 5, prompt: "Economic terminal with red numbers", imageUrl: "https://images.unsplash.com/photo-1611974717411-e60d0061e88a?w=400" },
        ];
        setSegments(mockSegments);
        setStep(3);
    };

    return (
        <div className="w-full h-full overflow-y-auto custom-scrollbar animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="max-w-4xl mx-auto px-6 py-12">
                {/* Header */}
                <div className="mb-10">
                    <h1 className="text-3xl font-black mb-2 text-white">어떤 영상을 만들고 싶으세요?</h1>
                    <p className="text-gray-500 font-bold">주제나 대본을 입력하면 구조화를 도와드립니다.</p>
                </div>

                <div className="space-y-6">
                    {/* Project Title Area (Matching Image 3) */}
                    <div className="bg-[#121217] border border-[#1f1f23] rounded-2xl p-4 flex items-center justify-between group">
                        <div className="flex items-center gap-3 w-full">
                            <span className="text-xs font-black text-gray-600 uppercase tracking-widest shrink-0">프로젝트:</span>
                            {isEditingTitle ? (
                                <input
                                    autoFocus
                                    type="text"
                                    value={settings.topic}
                                    onChange={(e) => updateSettings({ topic: e.target.value })}
                                    onBlur={() => setIsEditingTitle(false)}
                                    onKeyDown={(e) => e.key === 'Enter' && setIsEditingTitle(false)}
                                    className="bg-transparent border-b border-gray-600 text-sm font-bold text-white w-full outline-none pb-1"
                                />
                            ) : (
                                <span
                                    onClick={() => setIsEditingTitle(true)}
                                    className="text-sm font-bold text-gray-300 cursor-pointer hover:text-white transition-colors truncate"
                                >
                                    {settings.topic || "제목 없음 (클릭하여 수정)"}
                                </span>
                            )}
                        </div>
                        <button
                            onClick={() => setIsEditingTitle(!isEditingTitle)}
                            className="text-gray-600 group-hover:text-white transition-colors ml-4"
                        >
                            <Pencil className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Main Script Input (Matching Image 3) */}
                    <div className="relative group">
                        <div className="flex items-center gap-2 mb-3">
                            <Type className="w-4 h-4 text-[#6d28d9]" />
                            <span className="text-xs font-black text-gray-400 uppercase tracking-widest">대본 / 프롬프트</span>
                            <span className="text-[10px] text-gray-600 font-bold ml-2">* 영어나 일본어 등 주제를 외국어로 주시면 해당 언어로 대본을 작성합니다.</span>
                        </div>

                        <div className="relative bg-[#121217] border border-[#1f1f23] group-focus-within:border-[#6d28d9] rounded-[32px] transition-all p-8">
                            <textarea
                                value={topicInput}
                                onChange={(e) => setTopicInput(e.target.value)}
                                placeholder="이곳에 기획이나 대본을 입력해 주세요..."
                                className="w-full h-80 bg-transparent border-none text-white text-lg font-medium leading-relaxed outline-none resize-none custom-scrollbar"
                            />

                            {/* Status/Overlay for generation */}
                            {isGenerating && (
                                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm rounded-[32px] flex flex-col items-center justify-center z-10">
                                    <Loader2 className="w-12 h-12 text-[#6d28d9] animate-spin mb-4" />
                                    <p className="text-white font-black animate-pulse">Gemini 2.5 Flash가 명작을 작성 중입니다...</p>
                                </div>
                            )}
                        </div>

                        {/* Bottom Status Row (Matching Image 3) */}
                        <div className="mt-4 flex items-center justify-between">
                            <div className="text-[11px] font-black text-gray-600 tracking-widest">
                                {topicInput.length.toLocaleString()} / 7,200 자
                            </div>

                            <div className="flex items-center gap-4">
                                {/* Duration Input */}
                                <div className="flex items-center gap-3 bg-[#121217] border border-[#1f1f23] rounded-2xl px-4 py-2">
                                    <TimerIcon className="w-4 h-4 text-gray-600" />
                                    <input
                                        type="number"
                                        value={settings.durationPreset || 60}
                                        onChange={(e) => updateSettings({ durationPreset: Number(e.target.value) })}
                                        className="w-12 bg-transparent border-none text-white text-sm font-black text-center outline-none"
                                    />
                                    <span className="text-xs font-black text-gray-600">초</span>
                                </div>

                                {/* Audio Upload */}
                                <button className="flex items-center gap-2 bg-[#00c5a3] hover:bg-[#00e3bc] text-black px-6 py-3 rounded-2xl font-black transition-all shadow-lg hover:shadow-[#00c5a3]/20">
                                    <Upload className="w-4 h-4 stroke-[3px]" />
                                    음성 업로드
                                </button>

                                {/* Generate Button */}
                                <button
                                    onClick={handleGenerate}
                                    disabled={!topicInput || isGenerating}
                                    className="flex items-center gap-2 bg-[#4444a1] hover:bg-[#5555c2] text-white px-6 py-3 rounded-2xl font-black transition-all shadow-lg disabled:opacity-50"
                                >
                                    <Sparkles className="w-4 h-4 fill-white/20" />
                                    대본 생성하기 <span className="text-[10px] ml-1 opacity-60">✨ 2</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {error && (
                        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-500 text-sm font-bold animate-in fade-in slide-in-from-top-2">
                            <AlertCircle className="w-5 h-5 shrink-0" />
                            {error}
                        </div>
                    )}
                </div>

                {/* Footer Navigation (Matching Image 3) */}
                <div className="flex items-center justify-between mt-20 pt-10 border-t border-[#1f1f23]">
                    <button
                        onClick={() => setStep(1)}
                        className="flex items-center gap-2 text-gray-500 hover:text-white font-black transition-all"
                    >
                        <ChevronLeft className="w-5 h-5" />
                        이전 단계
                    </button>
                    <button
                        onClick={handleNext}
                        disabled={(!topicInput && !settings.scriptRaw) || isGenerating}
                        className="flex items-center gap-3 bg-[#3b3db1] hover:bg-[#4c4edf] text-white px-12 py-5 rounded-[24px] font-black shadow-[0_0_30px_rgba(59,61,177,0.4)] transition-all transform hover:-translate-y-1 active:translate-y-0 disabled:opacity-50"
                    >
                        다음 단계
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
}
