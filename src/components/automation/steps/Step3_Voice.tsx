'use client';

import React, { useState } from 'react';
import { useWizard } from '@/components/automation/WizardContext';
import { cn } from '@/lib/utils';
import {
    ChevronLeft,
    ChevronRight,
    Play,
    RotateCcw,
    Sparkles,
    Volume2,
    CheckCircle2,
    Pause
} from 'lucide-react';
import { voices } from '@/lib/automation-constants';

export default function Step3_Voice() {
    const { settings, updateSettings, setStep } = useWizard();
    const [playingVoiceId, setPlayingVoiceId] = useState<string | null>(null);
    const audioRef = React.useRef<HTMLAudioElement | null>(null);
    const [speed, setSpeed] = useState<'normal' | 'fast'>('normal');

    const [isLoadingAudio, setIsLoadingAudio] = useState<string | null>(null);

    // Handle voice preview play
    const handlePlayPreview = async (voice: typeof voices[0]) => {
        // If clicking the same voice, stop it
        if (playingVoiceId === voice.id) {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
            setPlayingVoiceId(null);
            return;
        }

        // Stop any currently playing audio
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current = null;
        }

        // Check if we have a hardcoded preview URL first
        if (voice.previewUrl) {
            const audio = new Audio(voice.previewUrl);
            audioRef.current = audio;

            audio.play().catch(err => {
                console.warn("Audio preview failed:", err);
                speakFallback(voice);
            });

            audio.onended = () => {
                setPlayingVoiceId(null);
                audioRef.current = null;
            };

            setPlayingVoiceId(voice.id);
            return;
        }

        // Try hitting our API for TTS preview
        setIsLoadingAudio(voice.id);
        try {
            const response = await fetch('/api/tts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    text: voice.sampleText || `안녕하세요, 저는 ${voice.name}입니다. ${voice.desc}`,
                    voiceId: voice.id
                })
            });

            if (!response.ok) {
                throw new Error(`API Error: ${response.status}`);
            }

            const audioBlob = await response.blob();
            const url = URL.createObjectURL(audioBlob);

            const audio = new Audio(url);
            audioRef.current = audio;

            audio.onended = () => {
                setPlayingVoiceId(null);
                audioRef.current = null;
                URL.revokeObjectURL(url); // Clean up memory
            };

            await audio.play();
            setPlayingVoiceId(voice.id);
        } catch (error) {
            console.error("API TTS Preview failed, falling back to browser TTS", error);
            speakFallback(voice);
        } finally {
            setIsLoadingAudio(null);
        }
    };

    // Load voices on mount ensures they are ready
    React.useEffect(() => {
        const loadVoices = () => {
            window.speechSynthesis.getVoices();
        };
        loadVoices();
        window.speechSynthesis.onvoiceschanged = loadVoices;

        return () => {
            window.speechSynthesis.cancel();
            if (audioRef.current) {
                audioRef.current.pause();
            }
        };
    }, []);

    const speakFallback = (voice: typeof voices[0]) => {
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(
            voice.sampleText || `안녕하세요, 저는 ${voice.name}입니다. ${voice.desc}`
        );
        utterance.lang = voice.language === 'English' ? 'en-US' : 'ko-KR';
        utterance.rate = speed === 'fast' ? 1.2 : 1.0;

        // Robust voice selection
        const voicesList = window.speechSynthesis.getVoices();
        const langTarget = voice.language === 'English' ? 'en' : 'ko';

        const bestVoice = voicesList.find(v => v.name.includes('Google') && v.lang.includes(langTarget))
            || voicesList.find(v => v.lang.includes(langTarget) || v.lang.includes(langTarget.toUpperCase()));

        if (bestVoice) {
            utterance.voice = bestVoice;
        }

        utterance.onend = () => {
            setPlayingVoiceId(null);
        };

        utterance.onerror = (e) => {
            console.error("TTS Error:", e);
            setPlayingVoiceId(null);
        };

        setPlayingVoiceId(voice.id);
        window.speechSynthesis.speak(utterance);
    };

    return (
        <div className="w-full h-full animate-in fade-in slide-in-from-bottom-4 duration-700 flex flex-col">

            <div className="max-w-7xl mx-auto w-full px-8 pt-10 pb-20 flex-1 flex flex-col min-h-0">
                {/* Header */}
                <div className="mb-8 shrink-0">
                    <h1 className="text-3xl font-black mb-2 text-white tracking-tight">스크립트 & AI 보이스</h1>
                    <p className="text-gray-500 font-bold">스크립트를 편집하고 AI 음성을 생성하세요.</p>
                </div>

                <div className="flex-1 flex gap-8 min-h-0">
                    {/* Left: Script Editor */}
                    <div className="flex-1 flex flex-col min-h-0">
                        <div className="flex items-center justify-between mb-4 shrink-0">
                            <h3 className="text-lg font-bold text-white">스크립트 편집</h3>
                            <button
                                onClick={() => updateSettings({ scriptRaw: settings.scriptRaw })} // Just a refresh placeholder
                                className="text-xs text-[#a78bfa] hover:text-white flex items-center gap-1 transition-colors"
                            >
                                <RotateCcw className="w-3 h-3" />
                                재생성
                            </button>
                        </div>

                        <div className="flex-1 bg-[#121217] border border-[#1f1f23] rounded-2xl p-6 relative group focus-within:border-[#6d28d9] transition-all overflow-hidden flex flex-col">
                            <textarea
                                value={settings.scriptRaw || ''}
                                onChange={(e) => updateSettings({ scriptRaw: e.target.value })}
                                placeholder="생성된 스크립트가 없습니다."
                                className="w-full h-full bg-transparent border-none text-gray-200 text-lg font-medium leading-relaxed outline-none resize-none custom-scrollbar flex-1"
                            />

                            <div className="mt-4 flex justify-between items-center text-xs font-bold text-gray-600 shrink-0">
                                <span>{(settings.scriptRaw || '').length.toLocaleString()} / 7,200 자</span>
                                <span>~{(settings.scriptRaw?.length || 0) / 10}초 / 600초</span>
                            </div>
                        </div>
                    </div>

                    {/* Right: AI Voiceover */}
                    <div className="flex-1 flex flex-col min-h-0">
                        {/* Header Controls */}
                        <div className="flex items-center justify-between mb-4 shrink-0">
                            <h3 className="text-lg font-bold text-white">AI 보이스오버</h3>
                            <div className="flex items-center gap-3">
                                {/* Speed Toggle */}
                                <div className="bg-[#1f1f23] p-1 rounded-lg flex items-center">
                                    <button
                                        onClick={() => setSpeed('normal')}
                                        className={cn(
                                            "px-3 py-1 rounded-md text-xs font-bold transition-all",
                                            speed === 'normal' ? "bg-[#27272a] text-white shadow-sm" : "text-gray-500 hover:text-gray-300"
                                        )}
                                    >
                                        보통
                                    </button>
                                    <button
                                        onClick={() => setSpeed('fast')}
                                        className={cn(
                                            "px-3 py-1 rounded-md text-xs font-bold transition-all",
                                            speed === 'fast' ? "bg-[#27272a] text-white shadow-sm" : "text-gray-500 hover:text-gray-300"
                                        )}
                                    >
                                        빠르게
                                    </button>
                                </div>
                                <button className="bg-[#6d28d9] hover:bg-[#7c3aed] text-white px-4 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all shadow-[0_0_15px_rgba(109,40,217,0.3)] hover:-translate-y-0.5">
                                    <Sparkles className="w-3 h-3" />
                                    음성 생성
                                </button>
                            </div>
                        </div>

                        {/* Voice List */}
                        <div className="flex-1 bg-[#121217] border border-[#1f1f23] rounded-2xl overflow-hidden flex flex-col">
                            {/* Pro Tip / Add Voice - Placeholder */}
                            <button className="w-full py-4 border-b border-[#1f1f23] border-dashed text-gray-500 text-sm font-bold hover:text-gray-300 hover:bg-[#1a1a1f] transition-all flex items-center justify-center gap-2">
                                <span>+ 목소리 추가</span>
                            </button>

                            <div className="overflow-y-auto custom-scrollbar p-4 flex-1">
                                <div className="grid grid-cols-2 gap-4">
                                    {voices.map((voice) => (
                                        <div
                                            key={voice.id}
                                            onClick={() => updateSettings({ selectedVoice: voice.id })}
                                            className={cn(
                                                "p-4 rounded-xl border transition-all cursor-pointer group flex flex-col gap-3 hover:bg-[#1a1a1f] relative overflow-hidden",
                                                settings.selectedVoice === voice.id
                                                    ? "bg-[#1a1a1f] border-[#6d28d9] ring-1 ring-[#6d28d9] shadow-[0_0_15px_rgba(109,40,217,0.15)]"
                                                    : "bg-[#0f0f12] border-[#27272a] hover:border-[#3f3f46]"
                                            )}
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="flex items-center gap-3">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handlePlayPreview(voice);
                                                        }}
                                                        disabled={isLoadingAudio === voice.id}
                                                        className={cn(
                                                            "w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all z-10",
                                                            playingVoiceId === voice.id || isLoadingAudio === voice.id
                                                                ? "bg-[#6d28d9] text-white"
                                                                : "bg-[#27272a] text-gray-400 group-hover:bg-[#3f3f46] group-hover:text-white"
                                                        )}
                                                    >
                                                        {isLoadingAudio === voice.id ? (
                                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                        ) : playingVoiceId === voice.id ? (
                                                            <Pause className="w-4 h-4 fill-current" />
                                                        ) : (
                                                            <Play className="w-4 h-4 fill-current ml-0.5" />
                                                        )}
                                                    </button>

                                                    <div>
                                                        <h4 className={cn("font-bold text-sm", settings.selectedVoice === voice.id ? "text-[#a78bfa]" : "text-gray-200")}>
                                                            {voice.name}
                                                        </h4>
                                                        <span className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">
                                                            {voice.gender} / {voice.category}
                                                        </span>
                                                    </div>
                                                </div>

                                                {settings.selectedVoice === voice.id && (
                                                    <CheckCircle2 className="w-5 h-5 text-[#6d28d9]" />
                                                )}
                                            </div>

                                            <p className="text-xs text-gray-400 font-medium leading-relaxed line-clamp-2 min-h-[2.5em]">
                                                "{voice.desc}"
                                            </p>

                                            <div className="flex flex-wrap gap-1.5 mt-auto">
                                                {voice.tags?.map((tag, i) => (
                                                    <span key={i} className="text-[10px] bg-[#27272a] text-gray-400 px-2 py-0.5 rounded-full font-medium">
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            {/* Footer Navigation */}
            <div className="sticky bottom-0 left-0 right-0 p-6 bg-[#0f0f12]/90 backdrop-blur-xl border-t border-[#1f1f23] flex items-center justify-between z-50">
                <button
                    onClick={() => setStep(2)}
                    className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors font-medium px-4 py-2"
                >
                    <ChevronLeft className="w-4 h-4" />
                    이전 단계
                </button>

                <button
                    onClick={() => setStep(4)}
                    disabled={!settings.selectedVoice}
                    className="flex items-center gap-2 bg-[#6d28d9] hover:bg-[#7c3aed] text-white px-8 py-3 rounded-full font-bold shadow-[0_0_20px_rgba(109,40,217,0.3)] transition-all hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:hover:translate-y-0"
                >
                    다음 단계
                    <ChevronRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}
