'use client';

import React, { useState, useEffect, useRef } from 'react';
import TopMenu from '@/components/shared/TopMenu';
import {
    Search, Star, Play, Pause, Mic, Music, Settings, Clock,
    ChevronRight, Plus, AudioLines, MessageSquare,
    FileText, AudioWaveform, Loader2, History, Sliders, Zap,
    MoreHorizontal, Download, Trash2, Volume2, ChevronDown
} from 'lucide-react';
import { cn } from '@/lib/utils';

import { VOICES, type Voice } from '@/lib/voice_data';

type ViewType = 'library' | 'speech' | 'effects' | 'music' | 'transcribe';
type GenderFilter = 'All' | 'Male' | 'Female' | 'Neutral';
type LibraryTab = 'all' | 'my';

export default function AISoundPage() {
    // --- Common States ---
    const [view, setView] = useState<ViewType>('library');
    const [myVoiceIds, setMyVoiceIds] = useState<Set<string>>(new Set());
    const [selectedVoice, setSelectedVoice] = useState<Voice | null>(null);
    const [playingId, setPlayingId] = useState<string | null>(null);
    const [loadingPreviewId, setLoadingPreviewId] = useState<string | null>(null);

    // --- Speech Editor States ---
    const [text, setText] = useState('');
    const [settings, setSettings] = useState({
        stability: 0.5,
        similarity: 0.75,
        speed: 1.0
    });
    const [isGenerating, setIsGenerating] = useState(false);
    const [history, setHistory] = useState<any[]>([]);

    // --- Effects States ---
    const [effectDuration, setEffectDuration] = useState(5.0);
    const [effectCategory, setEffectCategory] = useState('전체 카테고리');
    const [effectPreset, setEffectPreset] = useState('');
    const [effectTags, setEffectTags] = useState<Set<string>>(new Set());
    const [effectStereo, setEffectStereo] = useState(true);
    const [effectPrompt, setEffectPrompt] = useState('');
    const [isGeneratingEffect, setIsGeneratingEffect] = useState(false);
    const [effectHistory, setEffectHistory] = useState<any[]>([]);
    const [playingEffectId, setPlayingEffectId] = useState<string | null>(null);
    const effectAudioRef = useRef<HTMLAudioElement | null>(null);

    // Generate a synthesized sound effect using Web Audio API
    const synthesizeEffect = async (duration: number, stereo: boolean, category: string, preset: string, prompt: string): Promise<string> => {
        const sampleRate = 44100;
        const length = Math.floor(sampleRate * duration);
        const ctx = new OfflineAudioContext(stereo ? 2 : 1, length, sampleRate);

        // Simple hash to get a pseudo-random seed from prompt text
        const getSeed = (str: string) => {
            let hash = 0;
            for (let i = 0; i < str.length; i++) hash = ((hash << 5) - hash) + str.charCodeAt(i);
            return Math.abs(hash);
        };
        const seed = getSeed(prompt + preset + category);
        const rand = (min: number, max: number) => min + (seed % 1000 / 1000) * (max - min);

        if (preset === '사이버펑크 인텐스' || category === '기계 & 로봇' || category === '무기 & 전투') {
            // Cyberpunk/Mechanical: Gritty, distorted, intense sweeps
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            const distortion = ctx.createWaveShaper();

            osc.type = (seed % 2 === 0) ? 'sawtooth' : 'square';
            const baseFreq = rand(40, 100);
            osc.frequency.setValueAtTime(baseFreq, 0);
            osc.frequency.exponentialRampToValueAtTime(baseFreq * rand(2, 5), duration * 0.4);
            osc.frequency.exponentialRampToValueAtTime(baseFreq * rand(0.5, 0.8), duration);

            // Distortion curve
            const k = rand(50, 200);
            const curve = new Float32Array(sampleRate);
            for (let i = 0; i < sampleRate; i++) {
                const x = (i * 2) / sampleRate - 1;
                curve[i] = (3 + k) * x * 20 * (Math.PI / 180) / (Math.PI + k * Math.abs(x));
            }
            distortion.curve = curve;

            gain.gain.setValueAtTime(0, 0);
            gain.gain.linearRampToValueAtTime(0.4, 0.05);
            gain.gain.exponentialRampToValueAtTime(0.01, duration);

            osc.connect(distortion).connect(gain).connect(ctx.destination);
            osc.start(); osc.stop(duration);
        } else if (preset === 'UI & 시스템' || category === 'UI & 시스템') {
            // UI/System: Clean, high-pitched, harmonic pings
            const count = 2;
            for (let i = 0; i < count; i++) {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = 'sine';
                const freq = rand(800, 2000) + (i * 400);
                osc.frequency.setValueAtTime(freq, 0);
                osc.frequency.exponentialRampToValueAtTime(freq * 0.5, duration * 0.8);

                gain.gain.setValueAtTime(0, 0);
                gain.gain.linearRampToValueAtTime(0.2, 0.01);
                gain.gain.exponentialRampToValueAtTime(0.001, duration * rand(0.5, 0.9));

                osc.connect(gain).connect(ctx.destination);
                osc.start(i * 0.05); osc.stop(duration);
            }
        } else if (preset === '자연 & 환경' || category === '환경 & 자연') {
            // Nature: Modulated noise, airy, slow
            const bufferSize = length;
            const noiseBuffer = ctx.createBuffer(stereo ? 2 : 1, bufferSize, sampleRate);
            for (let ch = 0; ch < noiseBuffer.numberOfChannels; ch++) {
                const data = noiseBuffer.getChannelData(ch);
                for (let i = 0; i < bufferSize; i++) {
                    data[i] = (Math.random() * 2 - 1) * 0.5;
                }
            }
            const noiseSrc = ctx.createBufferSource();
            noiseSrc.buffer = noiseBuffer;
            const filter = ctx.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(rand(400, 1000), 0);
            filter.frequency.linearRampToValueAtTime(rand(100, 300), duration);

            const lfo = ctx.createOscillator();
            const lfoGain = ctx.createGain();
            lfo.frequency.value = rand(0.5, 3);
            lfoGain.gain.value = 200;
            lfo.connect(lfoGain).connect(filter.frequency);

            const gain = ctx.createGain();
            gain.gain.setValueAtTime(0, 0);
            gain.gain.linearRampToValueAtTime(0.3, duration * 0.2);
            gain.gain.linearRampToValueAtTime(0, duration);

            noiseSrc.connect(filter).connect(gain).connect(ctx.destination);
            lfo.start(); noiseSrc.start(); noiseSrc.stop(duration); lfo.stop(duration);
        } else {
            // Default/Sports/Others: Triangle + Noise
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(rand(200, 600), 0);
            osc.frequency.linearRampToValueAtTime(rand(100, 300), duration);

            const noise = ctx.createBufferSource();
            const nBuffer = ctx.createBuffer(1, length, sampleRate);
            const nData = nBuffer.getChannelData(0);
            for (let i = 0; i < length; i++) nData[i] = Math.random() * 0.1;
            noise.buffer = nBuffer;

            gain.gain.setValueAtTime(0, 0);
            gain.gain.linearRampToValueAtTime(0.2, 0.1);
            gain.gain.exponentialRampToValueAtTime(0.01, duration);

            osc.connect(gain).connect(ctx.destination);
            noise.connect(gain).connect(ctx.destination);
            osc.start(); noise.start(); osc.stop(duration); noise.stop(duration);
        }

        const rendered = await ctx.startRendering();

        // Convert to WAV blob
        const wavLength = 44 + rendered.length * rendered.numberOfChannels * 2;
        const wavBuffer = new ArrayBuffer(wavLength);
        const view = new DataView(wavBuffer);
        const writeStr = (o: number, s: string) => { for (let i = 0; i < s.length; i++) view.setUint8(o + i, s.charCodeAt(i)); };
        writeStr(0, 'RIFF'); view.setUint32(4, wavLength - 8, true);
        writeStr(8, 'WAVE'); writeStr(12, 'fmt ');
        view.setUint32(16, 16, true); view.setUint16(20, 1, true);
        view.setUint16(22, rendered.numberOfChannels, true);
        view.setUint32(24, sampleRate, true);
        view.setUint32(28, sampleRate * rendered.numberOfChannels * 2, true);
        view.setUint16(32, rendered.numberOfChannels * 2, true);
        view.setUint16(34, 16, true);
        writeStr(36, 'data'); view.setUint32(40, rendered.length * rendered.numberOfChannels * 2, true);
        let offset = 44;
        for (let i = 0; i < rendered.length; i++) {
            for (let ch = 0; ch < rendered.numberOfChannels; ch++) {
                const sample = Math.max(-1, Math.min(1, rendered.getChannelData(ch)[i]));
                view.setInt16(offset, sample * 0x7fff, true);
                offset += 2;
            }
        }
        const blob = new Blob([wavBuffer], { type: 'audio/wav' });
        return URL.createObjectURL(blob);
    };

    const handleGenerateEffect = async () => {
        if (!effectPrompt.trim() || isGeneratingEffect) return;
        setIsGeneratingEffect(true);
        try {
            const audioUrl = await synthesizeEffect(effectDuration, effectStereo, effectCategory, effectPreset, effectPrompt);
            const newEffect = {
                id: Date.now().toString(),
                prompt: effectPrompt.substring(0, 60) + (effectPrompt.length > 60 ? '...' : ''),
                duration: effectDuration,
                stereo: effectStereo,
                category: effectCategory,
                tags: Array.from(effectTags),
                url: audioUrl,
                time: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
            };
            setEffectHistory([newEffect, ...effectHistory]);
            // Auto-play the newly generated effect
            if (effectAudioRef.current) { effectAudioRef.current.pause(); }
            const audio = new Audio(audioUrl);
            effectAudioRef.current = audio;
            setPlayingEffectId(newEffect.id);
            audio.onended = () => setPlayingEffectId(null);
            audio.play();
        } catch (e) {
            console.error('Effect generation failed:', e);
        } finally {
            setIsGeneratingEffect(false);
        }
    };

    const playEffect = (item: any) => {
        if (playingEffectId === item.id) {
            effectAudioRef.current?.pause();
            setPlayingEffectId(null);
            return;
        }
        if (effectAudioRef.current) { effectAudioRef.current.pause(); }
        const audio = new Audio(item.url);
        effectAudioRef.current = audio;
        setPlayingEffectId(item.id);
        audio.onended = () => setPlayingEffectId(null);
        audio.play();
    };

    // --- Library States ---
    const [searchQuery, setSearchQuery] = useState('');
    const [genderFilter, setGenderFilter] = useState<GenderFilter>('All');
    const [libraryTab, setLibraryTab] = useState<LibraryTab>('all');

    // --- Audio Refs ---
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const previewCacheRef = useRef<Map<string, string>>(new Map());

    // --- localStorage Persistence (no MongoDB needed) ---
    useEffect(() => {
        try {
            const saved = localStorage.getItem('voice_selections');
            if (saved) {
                const data = JSON.parse(saved);
                if (data.myVoiceIds) {
                    setMyVoiceIds(new Set(data.myVoiceIds));
                }
                if (data.lastSelectedVoiceId) {
                    const voice = VOICES.find(v => v.id === data.lastSelectedVoiceId);
                    if (voice) setSelectedVoice(voice);
                }
            }
        } catch (e) { console.error('Failed to load selections', e); }
    }, []);

    const saveSelections = (ids: string[], lastId?: string) => {
        try {
            localStorage.setItem('voice_selections', JSON.stringify({
                myVoiceIds: ids,
                lastSelectedVoiceId: lastId
            }));
        } catch (e) { console.error('Failed to save selections', e); }
    };

    // --- Audio Preview (TTS API for Korean voices, CDN for English voices) ---
    const playPreview = async (voice: Voice) => {
        if (playingId === voice.id) {
            // Stop playing
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
            setPlayingId(null);
            return;
        }

        // Stop previous audio
        if (audioRef.current) {
            audioRef.current.pause();
        }

        // If voice has a CDN preview URL, use it directly (free)
        if (voice.previewUrl) {
            const audio = new Audio(voice.previewUrl);
            audio.onended = () => setPlayingId(null);
            audio.onerror = () => setPlayingId(null);
            audio.play();
            audioRef.current = audio;
            setPlayingId(voice.id);
            return;
        }

        // Check cache first
        const cached = previewCacheRef.current.get(voice.id);
        if (cached) {
            const audio = new Audio(cached);
            audio.onended = () => setPlayingId(null);
            audio.onerror = () => setPlayingId(null);
            audio.play();
            audioRef.current = audio;
            setPlayingId(voice.id);
            return;
        }

        // Generate preview via TTS API (Korean voices)
        setLoadingPreviewId(voice.id);
        try {
            const res = await fetch('/api/tts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    text: voice.sampleText || `안녕하세요, 저는 ${voice.name}입니다. 이것은 제 목소리 미리듣기입니다.`,
                    voiceId: voice.id,
                }),
            });
            if (res.ok) {
                const blob = await res.blob();
                const url = URL.createObjectURL(blob);
                previewCacheRef.current.set(voice.id, url);
                const audio = new Audio(url);
                audio.onended = () => setPlayingId(null);
                audio.onerror = () => setPlayingId(null);
                audio.play();
                audioRef.current = audio;
                setPlayingId(voice.id);
            } else {
                // Handle API errors
                if (res.status === 402) {
                    alert('⚠️ ElevenLabs API 크레딧이 소진되었습니다. API 키를 확인해주세요.');
                } else {
                    alert(`⚠️ 미리듣기 생성 실패 (${res.status}). 나중에 다시 시도해주세요.`);
                }
            }
        } catch (e) {
            console.error('Preview generation failed:', e);
            alert('⚠️ 네트워크 오류. 인터넷 연결을 확인해주세요.');
        } finally {
            setLoadingPreviewId(null);
        }
    };

    // --- TTS Generate (uses API credits) ---
    const handleGenerate = async () => {
        if (!text.trim() || !selectedVoice) return;
        setIsGenerating(true);
        try {
            const res = await fetch('/api/tts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    text,
                    voiceId: selectedVoice.id,
                }),
            });
            if (res.ok) {
                const blob = await res.blob();
                const url = URL.createObjectURL(blob);
                const newItem = {
                    id: Date.now().toString(),
                    text: text.substring(0, 80) + (text.length > 80 ? '...' : ''),
                    voice: selectedVoice,
                    voiceName: selectedVoice?.name || 'Unknown',
                    url,
                    time: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
                    timestamp: new Date().toLocaleTimeString(),
                    duration: `00:${String(Math.max(2, Math.ceil(text.length / 10))).padStart(2, '0')}`,
                };
                setHistory([newItem, ...history]);
                setText('');
            }
        } catch (e) {
            console.error(e);
        } finally {
            setIsGenerating(false);
        }
    };

    // --- Filter Logic ---
    const filteredVoices = VOICES.filter(v => {
        // Tab filter
        if (libraryTab === 'my' && !myVoiceIds.has(v.id)) return false;
        // Gender filter
        if (genderFilter !== 'All' && v.gender !== genderFilter) return false;
        // Search
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            return v.name.toLowerCase().includes(q) ||
                v.nameEn.toLowerCase().includes(q) ||
                v.tags.some(t => t.toLowerCase().includes(q)) ||
                v.description.toLowerCase().includes(q);
        }
        return true;
    });

    return (
        <div className="flex flex-col h-screen bg-[#0a0a0a] text-slate-200 font-sans overflow-hidden">
            <TopMenu />

            <div className="flex flex-1 overflow-hidden">

                {/* Left Side Menu */}
                <aside className="w-[72px] bg-[#050505] border-r border-white/5 flex flex-col items-center py-6 gap-6 shrink-0 z-50">
                    <button
                        onClick={() => setView('library')}
                        className={cn(
                            "w-12 h-12 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all group",
                            view === 'library' ? "bg-cyan-500/20 text-cyan-400" : "text-slate-500 hover:text-slate-300"
                        )}
                    >
                        <AudioLines className={cn("w-6 h-6", view === 'library' && "text-cyan-400")} />
                        <span className="text-[9px] font-bold">보이스</span>
                    </button>

                    <button
                        onClick={() => setView('speech')}
                        className={cn(
                            "w-12 h-12 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all group",
                            view === 'speech' ? "bg-cyan-500/20 text-cyan-400" : "text-slate-500 hover:text-slate-300"
                        )}
                    >
                        <MessageSquare className={cn("w-6 h-6", view === 'speech' && "text-cyan-400")} />
                        <span className="text-[9px] font-bold">Speech</span>
                    </button>

                    <button
                        onClick={() => setView('effects')}
                        className={cn(
                            "w-12 h-12 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all group",
                            view === 'effects' ? "bg-cyan-500/20 text-cyan-400" : "text-slate-500 hover:text-slate-300"
                        )}
                    >
                        <Zap className={cn("w-6 h-6", view === 'effects' && "text-cyan-400")} />
                        <span className="text-[9px] font-bold">Effects</span>
                    </button>

                    <button
                        onClick={() => setView('music')}
                        className={cn(
                            "w-12 h-12 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all group",
                            view === 'music' ? "bg-cyan-500/20 text-cyan-400" : "text-slate-500 hover:text-slate-300"
                        )}
                    >
                        <Music className={cn("w-6 h-6", view === 'music' && "text-cyan-400")} />
                        <span className="text-[9px] font-bold">Music</span>
                    </button>

                    <button
                        onClick={() => setView('transcribe')}
                        className={cn(
                            "w-12 h-12 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all group",
                            view === 'transcribe' ? "bg-cyan-500/20 text-cyan-400" : "text-slate-500 hover:text-slate-300"
                        )}
                    >
                        <FileText className={cn("w-6 h-6", view === 'transcribe' && "text-cyan-400")} />
                        <span className="text-[9px] font-bold">Transcribe</span>
                    </button>

                    <div className="mt-auto">
                        <button className="text-slate-600 hover:text-slate-400 transition-colors">
                            <Settings className="w-5 h-5" />
                        </button>
                    </div>
                </aside>

                {view === 'speech' ? (
                    // ====================================================================
                    // SPEECH EDITOR VIEW (Bbanana-style)
                    // ====================================================================
                    <div className="flex-1 flex overflow-hidden">

                        {/* LEFT SIDEBAR — Voice Settings */}
                        <aside className="w-[260px] bg-[#0d0d0d] border-r border-white/5 flex flex-col shrink-0 overflow-y-auto custom-scrollbar">
                            <div className="p-5 pb-3 border-b border-white/5">
                                <h2 className="text-sm font-bold text-white mb-0.5">음성 변환</h2>
                                <p className="text-[10px] text-slate-500 font-medium">텍스트 음성 변환</p>
                            </div>

                            <div className="p-5 space-y-5">
                                {/* Voice Selector Dropdown */}
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">성우 선택</label>
                                    <div className="relative">
                                        <select
                                            value={selectedVoice?.id || ''}
                                            onChange={(e) => {
                                                const voice = VOICES.find(v => v.id === e.target.value);
                                                if (voice) {
                                                    setSelectedVoice(voice);
                                                    saveSelections(Array.from(myVoiceIds), voice.id);
                                                }
                                            }}
                                            className="w-full bg-[#141414] border border-white/10 rounded-xl px-4 py-3 text-sm text-white appearance-none cursor-pointer hover:border-cyan-500/30 focus:border-cyan-500/50 focus:outline-none transition-colors"
                                        >
                                            <option value="">성우를 선택하세요</option>
                                            {VOICES.filter(v => v.language === '한국어').length > 0 && (
                                                <optgroup label="🇰🇷 한국어">
                                                    {VOICES.filter(v => v.language === '한국어').map(v => (
                                                        <option key={v.id} value={v.id}>{v.name} ({v.nameEn}) — {v.gender === 'Female' ? '여성' : v.gender === 'Male' ? '남성' : '중성'}</option>
                                                    ))}
                                                </optgroup>
                                            )}
                                            {VOICES.filter(v => v.language === 'English').length > 0 && (
                                                <optgroup label="🇺🇸 English">
                                                    {VOICES.filter(v => v.language === 'English').map(v => (
                                                        <option key={v.id} value={v.id}>{v.nameEn} ({v.name}) — {v.gender}</option>
                                                    ))}
                                                </optgroup>
                                            )}
                                        </select>
                                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                                    </div>
                                </div>

                                {/* Model Info */}
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">모델</label>
                                    <div className="bg-cyan-500/15 border border-cyan-500/20 rounded-xl px-4 py-2.5 flex items-center gap-3">
                                        <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.6)]" />
                                        <div>
                                            <p className="text-xs font-bold text-cyan-400">Google TTS</p>
                                            <p className="text-[9px] text-cyan-500/60">Chirp3-HD / Neural2</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Selected Voice Info */}
                                {selectedVoice && (
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">선택된 성우</label>
                                        <div className="bg-[#141414] rounded-xl p-3 border border-white/5">
                                            <div className="flex items-center gap-3 mb-2">
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img src={selectedVoice.avatar} alt="" className="w-8 h-8 rounded-lg" />
                                                <div>
                                                    <p className="text-sm font-bold text-white">{selectedVoice.name}</p>
                                                    <p className="text-[10px] text-slate-500">{selectedVoice.nameEn} · {selectedVoice.gender === 'Female' ? '여성' : selectedVoice.gender === 'Male' ? '남성' : '중성'}</p>
                                                </div>
                                            </div>
                                            <p className="text-[10px] text-slate-600 leading-relaxed">{selectedVoice.description}</p>
                                            <div className="flex flex-wrap gap-1 mt-2">
                                                {selectedVoice.tags.map(tag => (
                                                    <span key={tag} className="text-[9px] px-2 py-0.5 rounded-full bg-white/5 text-slate-500 font-medium">#{tag}</span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Settings Sliders */}
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">설정</label>
                                    <div className="space-y-4 bg-[#141414] rounded-xl p-4 border border-white/5">
                                        {[
                                            { label: '안정감', key: 'stability', min: 0, max: 1, step: 0.1, color: '#f59e0b' },
                                            { label: '유사도', key: 'similarity', min: 0, max: 1, step: 0.1, color: '#f59e0b' },
                                            { label: '속도', key: 'speed', min: 0.5, max: 2, step: 0.1, color: '#f59e0b' },
                                        ].map((s) => (
                                            <div key={s.key} className="space-y-1.5">
                                                <div className="flex justify-between items-center">
                                                    <label className="text-[10px] font-bold text-slate-400">{s.label}</label>
                                                    <span className="text-[10px] font-mono text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-md">{(settings as any)[s.key]}</span>
                                                </div>
                                                <input
                                                    type="range"
                                                    min={s.min}
                                                    max={s.max}
                                                    step={s.step}
                                                    value={(settings as any)[s.key]}
                                                    onChange={(e) => setSettings({ ...settings, [s.key]: parseFloat(e.target.value) })}
                                                    className="w-full h-1 rounded-lg appearance-none cursor-pointer accent-amber-500"
                                                    style={{ background: `linear-gradient(to right, #f59e0b ${((((settings as any)[s.key]) - s.min) / (s.max - s.min)) * 100}%, #1a1a1a ${((((settings as any)[s.key]) - s.min) / (s.max - s.min)) * 100}%)` }}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </aside>

                        {/* MAIN CONTENT — Text Editor */}
                        <main className="flex-1 bg-[#050505] flex flex-col relative overflow-hidden">
                            {/* Header */}
                            <div className="px-10 pt-10 pb-6">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/15 flex items-center justify-center">
                                        <MessageSquare className="w-6 h-6 text-cyan-400" />
                                    </div>
                                    <div>
                                        <h1 className="text-2xl font-black text-white">Text to Speech</h1>
                                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Dialogue Editor</p>
                                    </div>
                                </div>

                                {/* Language Badge */}
                                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#141414] border border-white/5">
                                    <span className="text-sm">🇰🇷</span>
                                    <span className="text-xs font-bold text-slate-400">한국어</span>
                                </div>

                                {selectedVoice && (
                                    <p className="mt-3 text-sm text-slate-600">
                                        <span className="text-cyan-500 font-bold">{selectedVoice.name}</span> 목소리로 텍스트를 변환합니다
                                    </p>
                                )}
                            </div>

                            {/* Text Input Area */}
                            <div className="flex-1 px-10 pb-4 flex flex-col min-h-0">
                                <div className={cn(
                                    "flex-1 relative rounded-2xl border transition-all flex flex-col overflow-hidden",
                                    !selectedVoice
                                        ? "bg-[#080808] border-white/5 border-dashed"
                                        : "bg-[#0d0d0d] border-white/5 focus-within:border-cyan-500/30"
                                )}>
                                    <textarea
                                        placeholder={selectedVoice ? `"${selectedVoice.name}" 목소리로 변환할 텍스트를 입력하세요...` : "먼저 왼쪽에서 성우를 선택해주세요."}
                                        disabled={!selectedVoice}
                                        value={text}
                                        onChange={(e) => setText(e.target.value)}
                                        className="w-full flex-1 bg-transparent text-lg text-slate-200 placeholder:text-slate-700 focus:outline-none resize-none leading-relaxed font-medium p-8"
                                    />
                                </div>
                            </div>

                            {/* Bottom Action Bar */}
                            <div className="px-10 pb-8 pt-2">
                                <div className="flex items-center justify-between bg-[#0d0d0d] border border-white/5 rounded-2xl px-6 py-4">
                                    <div className="flex items-center gap-4">
                                        {/* Character Count */}
                                        <span className="text-[11px] font-mono text-slate-600">
                                            {text.length} / 5,000 자
                                        </span>
                                        <div className="w-px h-4 bg-white/10" />
                                        {/* Segments */}
                                        <span className="text-[11px] font-mono text-slate-600">
                                            {Math.ceil(text.length / 500) || 1} segment{text.length > 500 ? 's' : ''}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        {/* Model Badge */}
                                        <div className="flex items-center gap-2 px-3 py-1.5 bg-[#141414] rounded-lg border border-white/5">
                                            <span className="text-[10px] font-bold text-slate-400">
                                                {selectedVoice?.googleVoiceId?.includes('Chirp3') ? 'Chirp3 HD' : selectedVoice?.googleVoiceId?.includes('Neural2') ? 'Neural2' : 'Google TTS'}
                                            </span>
                                            <span className="text-[9px] text-slate-600">v3.0</span>
                                        </div>

                                        {/* Generate Button */}
                                        <button
                                            onClick={handleGenerate}
                                            disabled={isGenerating || !text.trim() || !selectedVoice}
                                            className={cn(
                                                "px-6 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all",
                                                (isGenerating || !selectedVoice || !text.trim())
                                                    ? "bg-[#1a1a1a] text-slate-600 cursor-not-allowed border border-white/5"
                                                    : "bg-cyan-500 text-black hover:bg-cyan-400 active:scale-95 shadow-lg shadow-cyan-500/20"
                                            )}
                                        >
                                            {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <AudioWaveform className="w-4 h-4" />}
                                            {!selectedVoice ? '성우 선택' : (isGenerating ? '생성 중...' : '생성')}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </main>

                        {/* RIGHT SIDEBAR — History */}
                        <aside className="w-[300px] bg-[#0d0d0d] border-l border-white/5 flex flex-col shrink-0 overflow-hidden">
                            <div className="p-5 pb-3 border-b border-white/5 flex items-center justify-between">
                                <h3 className="text-sm font-bold text-white">History</h3>
                                <div className="flex items-center gap-1">
                                    <button className="p-1.5 text-slate-500 hover:text-white transition-colors rounded-lg hover:bg-white/5">
                                        <ChevronRight className="w-4 h-4 rotate-180" />
                                    </button>
                                    <button className="p-1.5 text-slate-500 hover:text-white transition-colors rounded-lg hover:bg-white/5">
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            {/* Search */}
                            <div className="px-5 py-3">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-600" />
                                    <input
                                        type="text"
                                        placeholder="Search history..."
                                        className="w-full bg-[#141414] border border-white/5 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-300 placeholder:text-slate-700 focus:outline-none focus:border-cyan-500/30"
                                    />
                                </div>
                            </div>

                            {/* History List */}
                            <div className="flex-1 overflow-y-auto custom-scrollbar px-5 pb-5 space-y-3">
                                {history.length === 0 ? (
                                    <div className="text-center py-16">
                                        <Clock className="w-8 h-8 text-slate-700 mx-auto mb-3" />
                                        <p className="text-xs text-slate-600 font-medium">아직 생성 기록이 없습니다</p>
                                        <p className="text-[10px] text-slate-700 mt-1">텍스트를 입력하고 생성하면<br />여기에 기록이 표시됩니다</p>
                                    </div>
                                ) : (
                                    history.map((item, i) => (
                                        <div key={i} className="bg-[#141414] rounded-xl border border-white/5 p-4 hover:border-white/10 transition-colors group">
                                            {/* Waveform Visualization */}
                                            <div className="flex items-center gap-2 mb-2">
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img src={item.voice?.avatar || ''} alt="" className="w-6 h-6 rounded-md" />
                                                <span className="text-[11px] font-bold text-slate-400">{item.voice?.name || '알 수 없음'}</span>
                                                <span className="text-[9px] text-slate-600 ml-auto">{item.time}</span>
                                            </div>
                                            {/* Fake Waveform */}
                                            <div className="flex items-end gap-px h-8 mb-2">
                                                {Array.from({ length: 40 }).map((_, j) => (
                                                    <div
                                                        key={j}
                                                        className="flex-1 bg-cyan-500/30 rounded-t-sm"
                                                        style={{ height: `${Math.random() * 100}%` }}
                                                    />
                                                ))}
                                            </div>
                                            {/* Text Preview */}
                                            <p className="text-[10px] text-slate-500 truncate mb-3">&quot;{item.text}&quot;</p>
                                            {/* Actions */}
                                            <div className="flex items-center gap-2 text-slate-600">
                                                <span className="text-[9px] font-mono">{item.duration || '00:05'}</span>
                                                <div className="flex-1" />
                                                {item.url && (
                                                    <>
                                                        <button
                                                            onClick={() => {
                                                                const a = new Audio(item.url);
                                                                a.play();
                                                            }}
                                                            className="p-1.5 hover:text-cyan-400 hover:bg-cyan-500/10 rounded-lg transition-colors"
                                                        >
                                                            <Play className="w-3.5 h-3.5" />
                                                        </button>
                                                        <a
                                                            href={item.url}
                                                            download={`tts-${i}.mp3`}
                                                            className="p-1.5 hover:text-cyan-400 hover:bg-cyan-500/10 rounded-lg transition-colors"
                                                        >
                                                            <Download className="w-3.5 h-3.5" />
                                                        </a>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </aside>

                    </div>
                ) : view === 'library' ? (
                    // ====================================================================
                    // LIBRARY VIEW (CASTING AREA)
                    // ====================================================================
                    <div className="flex-1 flex overflow-hidden bg-[#050505]">

                        {/* 1. FILTER SIDEBAR (Left) */}
                        <aside className="w-64 border-r border-white/5 flex flex-col shrink-0 overflow-y-auto custom-scrollbar bg-[#080808] p-6">
                            <h2 className="text-sm font-bold text-white mb-6 uppercase tracking-wider">Voice Filter</h2>

                            <div className="space-y-8">
                                {/* Gender Filter */}
                                <div className="space-y-3">
                                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Gender</label>
                                    <div className="flex flex-col gap-2">
                                        {(['All', 'Male', 'Female', 'Neutral'] as GenderFilter[]).map(g => (
                                            <label key={g} className="flex items-center gap-3 cursor-pointer group" onClick={() => setGenderFilter(g)}>
                                                <div className={cn(
                                                    "w-4 h-4 rounded-full border flex items-center justify-center transition-all",
                                                    genderFilter === g ? "border-cyan-500 bg-cyan-500/20" : "border-slate-700 group-hover:border-slate-500"
                                                )}>
                                                    {genderFilter === g && <div className="w-2 h-2 rounded-full bg-cyan-500" />}
                                                </div>
                                                <span className={cn("text-xs font-medium transition-colors", genderFilter === g ? "text-white" : "text-slate-500 group-hover:text-slate-300")}>
                                                    {g === 'All' ? 'All Genders' : g}
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Use Case Tags */}
                                <div className="space-y-3">
                                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Use Case</label>
                                    <div className="flex flex-wrap gap-2">
                                        {['conversational', 'narrative', 'social_media', 'educational', 'character'].map(tag => (
                                            <button
                                                key={tag}
                                                onClick={() => setSearchQuery(searchQuery === tag ? '' : tag)}
                                                className={cn(
                                                    "px-2.5 py-1 rounded-md text-[10px] border transition-all",
                                                    searchQuery === tag
                                                        ? "bg-cyan-500/20 border-cyan-500/50 text-cyan-400"
                                                        : "bg-[#141414] border-white/5 text-slate-400 hover:text-white hover:border-white/20"
                                                )}
                                            >
                                                {tag}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Quick Stats */}
                                <div className="pt-4 border-t border-white/5 space-y-2">
                                    <div className="flex items-center justify-between text-[10px]">
                                        <span className="text-slate-600">Total Voices</span>
                                        <span className="text-cyan-500 font-bold">{VOICES.length}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-[10px]">
                                        <span className="text-slate-600">My Cast</span>
                                        <span className="text-cyan-500 font-bold">{myVoiceIds.size}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-[10px]">
                                        <span className="text-slate-600">Showing</span>
                                        <span className="text-white font-bold">{filteredVoices.length}</span>
                                    </div>
                                </div>
                            </div>
                        </aside>

                        {/* 2. MAIN GRID CONTENT */}
                        <div className="flex-1 flex flex-col min-w-0">
                            {/* Sticky Header */}
                            <div className="h-16 shrink-0 border-b border-white/5 flex items-center justify-between px-8 bg-[#050505]/80 backdrop-blur-md z-10 sticky top-0">
                                <div className="flex items-center gap-6">
                                    <h1 className="text-lg font-black text-white tracking-tight">Voice Library</h1>
                                    <div className="h-4 w-px bg-white/10" />
                                    <div className="flex items-center gap-1">
                                        <button
                                            onClick={() => setLibraryTab('all')}
                                            className={cn(
                                                "px-3 py-1.5 rounded-lg text-xs font-bold transition-all",
                                                libraryTab === 'all' ? "bg-white/5 text-white" : "text-slate-500 hover:text-slate-300 hover:bg-white/5"
                                            )}
                                        >
                                            All Voices
                                        </button>
                                        <button
                                            onClick={() => setLibraryTab('my')}
                                            className={cn(
                                                "px-3 py-1.5 rounded-lg text-xs font-bold transition-all",
                                                libraryTab === 'my' ? "bg-white/5 text-white" : "text-slate-500 hover:text-slate-300 hover:bg-white/5"
                                            )}
                                        >
                                            My Library ({myVoiceIds.size})
                                        </button>
                                    </div>
                                </div>

                                <div className="relative w-64 group">
                                    <input
                                        type="text"
                                        placeholder="Search voices..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full h-9 bg-[#111] border border-white/10 rounded-lg pl-9 pr-4 text-xs text-white focus:border-cyan-500/50 transition-colors focus:outline-none focus:bg-[#161616]"
                                    />
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-600 group-focus-within:text-cyan-500 transition-colors" />
                                </div>
                            </div>

                            {/* Scrollable Grid */}
                            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-[#050505]">
                                {filteredVoices.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center h-64 text-slate-600 gap-4">
                                        <AudioWaveform className="w-16 h-16 stroke-1 opacity-30" />
                                        <p className="text-sm font-bold">No voices found</p>
                                        <p className="text-xs text-slate-700">Try a different search or filter</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                        {filteredVoices.map(voice => (
                                            <div
                                                key={voice.id}
                                                onClick={() => {
                                                    const newSet = new Set(myVoiceIds);
                                                    let lastId = selectedVoice?.id;
                                                    if (newSet.has(voice.id)) {
                                                        newSet.delete(voice.id);
                                                        if (selectedVoice?.id === voice.id) {
                                                            setSelectedVoice(null);
                                                            lastId = undefined;
                                                        }
                                                    } else {
                                                        newSet.add(voice.id);
                                                    }
                                                    setMyVoiceIds(newSet);
                                                    saveSelections(Array.from(newSet), lastId);
                                                }}
                                                className={cn(
                                                    "group relative bg-[#0a0a0a] border rounded-xl p-4 transition-all hover:-translate-y-1 cursor-pointer overflow-hidden",
                                                    myVoiceIds.has(voice.id)
                                                        ? "border-cyan-500/40 bg-cyan-500/5 shadow-[0_0_20px_rgba(6,182,212,0.05)]"
                                                        : "border-white/5 hover:border-white/10 hover:bg-[#0f0f0f]"
                                                )}
                                            >
                                                {/* Top Row: Avatar & Play */}
                                                <div className="flex items-start justify-between mb-3">
                                                    <div className="relative">
                                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                                        <img src={voice.avatar} alt="" className="w-12 h-12 rounded-full border border-white/5 shadow-inner" />
                                                        {myVoiceIds.has(voice.id) && (
                                                            <div className="absolute -bottom-1 -right-1 bg-cyan-500 text-black p-0.5 rounded-full border-2 border-[#0a0a0a]">
                                                                <Star className="w-2.5 h-2.5 fill-current" />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            playPreview(voice);
                                                        }}
                                                        disabled={loadingPreviewId === voice.id}
                                                        className={cn(
                                                            "w-8 h-8 rounded-full flex items-center justify-center transition-all",
                                                            loadingPreviewId === voice.id ? "bg-yellow-500/20 text-yellow-400 animate-pulse" :
                                                                playingId === voice.id ? "bg-cyan-500 text-black" : "bg-white/5 text-slate-400 group-hover:bg-white/10 hover:text-white"
                                                        )}
                                                    >
                                                        {loadingPreviewId === voice.id ? <Loader2 size={12} className="animate-spin" /> : playingId === voice.id ? <Pause size={12} fill="currentColor" /> : <Play size={12} fill="currentColor" />}
                                                    </button>
                                                </div>

                                                {/* Info */}
                                                <div>
                                                    <div className="flex items-center justify-between mb-1">
                                                        <h3 className={cn("font-bold text-sm", myVoiceIds.has(voice.id) ? "text-cyan-400" : "text-white")}>{voice.name}</h3>
                                                        <span className={cn("text-[9px] font-bold uppercase px-1.5 py-0.5 rounded", voice.language === '한국어' ? "bg-cyan-500/10 text-cyan-400" : "bg-white/5 text-slate-600")}>{voice.language === '한국어' ? 'KR' : voice.accent.substring(0, 3)}</span>
                                                    </div>
                                                    <p className="text-[10px] text-slate-600 mb-1 font-medium">{voice.nameEn} · {voice.gender}</p>
                                                    <p className="text-[10px] text-slate-500 line-clamp-2 leading-relaxed mb-3 h-8">
                                                        {voice.description}
                                                    </p>

                                                    {/* Tags */}
                                                    <div className="flex flex-wrap gap-1">
                                                        {voice.tags.slice(0, 3).map((t, i) => (
                                                            <span key={i} className="text-[9px] px-1.5 py-0.5 rounded bg-[#161616] text-slate-500 border border-white/5">#{t}</span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* 3. HISTORY SIDEBAR (Right) */}
                        <aside className="w-80 border-l border-white/5 flex flex-col shrink-0 bg-[#080808]">
                            <div className="p-6 border-b border-white/5 flex items-center justify-between bg-[#080808]">
                                <div className="flex items-center gap-2">
                                    <History className="w-4 h-4 text-cyan-500" />
                                    <h2 className="text-sm font-bold text-white uppercase tracking-wider">History</h2>
                                </div>
                                <span className="text-[10px] text-slate-600 font-mono">{history.length} ITEMS</span>
                            </div>

                            <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                                {history.length === 0 ? (
                                    <div className="h-full flex flex-col items-center justify-center text-slate-600 gap-4 opacity-50">
                                        <AudioWaveform className="w-12 h-12 stroke-1" />
                                        <p className="text-xs text-center">No generated audio yet.<br />Select a voice and create one!</p>
                                    </div>
                                ) : (
                                    history.map((item) => (
                                        <div key={item.id} className="bg-[#111] border border-white/5 rounded-xl p-4 hover:border-white/10 transition-all group">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-[10px] font-bold text-cyan-500 bg-cyan-500/10 px-2 py-0.5 rounded-full">{item.voiceName}</span>
                                                <span className="text-[9px] text-slate-600">{item.timestamp}</span>
                                            </div>
                                            <p className="text-[11px] text-slate-400 line-clamp-2 mb-3 bg-[#080808] p-2 rounded-lg border border-white/5 italic">
                                                &ldquo;{item.text}&rdquo;
                                            </p>
                                            <div className="flex items-center justify-between gap-2">
                                                <button
                                                    onClick={() => {
                                                        if (item.url) {
                                                            const audio = new Audio(item.url);
                                                            audio.play();
                                                        }
                                                    }}
                                                    className="flex-1 h-8 rounded-lg bg-[#1a1a1a] flex items-center justify-center gap-2 text-[10px] font-bold text-slate-400 hover:text-white hover:bg-[#252525] transition-all"
                                                >
                                                    <Play size={10} /> Preview
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        if (item.url) {
                                                            const a = document.createElement('a');
                                                            a.href = item.url;
                                                            a.download = `${item.voiceName}_${item.id}.mp3`;
                                                            a.click();
                                                        }
                                                    }}
                                                    className="w-8 h-8 rounded-lg bg-[#1a1a1a] flex items-center justify-center text-slate-500 hover:text-white hover:bg-[#252525] transition-all"
                                                >
                                                    <Download size={12} />
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </aside>

                    </div>
                ) : view === 'effects' ? (
                    // ====================================================================
                    // EFFECTS VIEW (Bbanana-style Sound Effects)
                    // ====================================================================
                    <div className="flex-1 flex overflow-hidden">

                        {/* LEFT SIDEBAR — Effects Settings */}
                        <aside className="w-[260px] bg-[#0d0d0d] border-r border-white/5 flex flex-col shrink-0 overflow-y-auto custom-scrollbar">
                            <div className="p-5 pb-3 border-b border-white/5">
                                <h2 className="text-sm font-bold text-white mb-0.5">효과음</h2>
                                <p className="text-[10px] text-slate-500 font-medium">AI 효과 생성</p>
                            </div>

                            <div className="p-5 space-y-5">
                                {/* Category Dropdown */}
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">효과 카테고리</label>
                                    <div className="relative">
                                        <select
                                            value={effectCategory}
                                            onChange={(e) => setEffectCategory(e.target.value)}
                                            className="w-full bg-[#141414] border border-white/10 rounded-xl px-4 py-3 text-sm text-white appearance-none cursor-pointer hover:border-purple-500/30 focus:border-purple-500/50 focus:outline-none transition-colors"
                                        >
                                            <option>전체 카테고리</option>
                                            <option>환경 & 자연</option>
                                            <option>기계 & 로봇</option>
                                            <option>UI & 시스템</option>
                                            <option>무기 & 전투</option>
                                            <option>공포 & 서스펜스</option>
                                            <option>마법 & 판타지</option>
                                            <option>일상 & 생활</option>
                                        </select>
                                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                                    </div>
                                </div>

                                {/* Preset Categories */}
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">프리셋 카테고리들</label>
                                    <div className="space-y-1">
                                        {[
                                            { icon: '⚡', label: '사이버펑크 인텐스', prompt: '네온 조명이 깜박이는 사이버펑크 도시의 골목길, 전자음과 기계 소음이 뒤섞인 강렬한 분위기' },
                                            { icon: '🖥️', label: 'UI & 시스템', prompt: '부드러운 UI 알림음, 버튼 클릭, 시스템 시작 효과음' },
                                            { icon: '🌿', label: '자연 & 환경', prompt: '숲속에서 들려오는 새소리와 바람 소리, 시냇물 흐르는 잔잔한 자연 환경음' },
                                            { icon: '🏀', label: '스포츠 & 모먼트', prompt: '관중석의 환호성과 호루라기 소리, 경기장의 열기 넘치는 분위기' },
                                        ].map(p => (
                                            <button
                                                key={p.label}
                                                onClick={() => {
                                                    setEffectPreset(p.label);
                                                    setEffectPrompt(p.prompt);
                                                }}
                                                className={cn(
                                                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left text-xs transition-colors",
                                                    effectPreset === p.label
                                                        ? "bg-purple-500/15 text-purple-400 border border-purple-500/20"
                                                        : "text-slate-400 hover:text-white hover:bg-white/5"
                                                )}
                                            >
                                                <span>{p.icon}</span>
                                                <span className="font-medium">{p.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Model Info */}
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">모델</label>
                                    <div className="bg-purple-500/15 border border-purple-500/20 rounded-xl px-4 py-3">
                                        <p className="text-xs font-bold text-purple-400 mb-0.5">🎵 효과음</p>
                                        <p className="text-[9px] text-purple-400/60 leading-relaxed">고품질의 AI 기반 Sound FX 생성모델을 활용하여 효과음을 생성합니다.</p>
                                    </div>
                                </div>

                                {/* Upgrade */}
                                <div className="mt-4 bg-[#141414] rounded-xl border border-white/5 p-4 text-center">
                                    <p className="text-[10px] text-slate-600 mb-1">🎯 API 잔여 크레딧</p>
                                    <p className="text-[10px] text-slate-500 mb-3">효과음 생성에는 크레딧이 필요합니다</p>
                                    <button className="w-full py-2.5 rounded-xl bg-purple-500/20 border border-purple-500/30 text-purple-400 text-xs font-bold hover:bg-purple-500/30 transition-colors">
                                        플랜을 업그레이드
                                    </button>
                                </div>
                            </div>
                        </aside>

                        {/* MAIN CONTENT — Prompt Editor */}
                        <main className="flex-1 bg-[#050505] flex flex-col overflow-y-auto custom-scrollbar">
                            {/* Header */}
                            <div className="px-10 pt-10 pb-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/15 flex items-center justify-center">
                                        <Zap className="w-6 h-6 text-purple-400" />
                                    </div>
                                    <div>
                                        <h1 className="text-2xl font-black text-white">Sound Effects</h1>
                                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Neural Audio Synthesis</p>
                                    </div>
                                </div>
                            </div>

                            {/* Prompt Card */}
                            <div className="px-10 pb-6">
                                <div className="bg-[#0d0d0d] border border-white/5 rounded-2xl overflow-hidden">
                                    <div className="px-6 py-4 border-b border-white/5">
                                        <h3 className="text-sm font-bold text-white">사운드 인텐 프롬프트</h3>
                                    </div>
                                    <div className="p-6">
                                        <textarea
                                            placeholder="원하는 소리를 설명하세요 (예: 사막 행성에 착륙하는 무거운 우주선, 모달 히스 소리와 함께)"
                                            value={effectPrompt}
                                            onChange={(e) => setEffectPrompt(e.target.value)}
                                            className="w-full h-28 bg-transparent text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none resize-none leading-relaxed"
                                        />
                                    </div>
                                    {/* Tags */}
                                    <div className="px-6 pb-5 flex flex-wrap gap-2">
                                        {['시그널/기계', '이벤트', '스테이션', '기타'].map(tag => (
                                            <button
                                                key={tag}
                                                onClick={() => {
                                                    const next = new Set(effectTags);
                                                    if (next.has(tag)) next.delete(tag); else next.add(tag);
                                                    setEffectTags(next);
                                                }}
                                                className={cn(
                                                    "px-3 py-1.5 rounded-lg border text-[10px] font-medium transition-colors",
                                                    effectTags.has(tag)
                                                        ? "bg-purple-500/15 border-purple-500/30 text-purple-400"
                                                        : "bg-[#141414] border-white/5 text-slate-500 hover:border-purple-500/30 hover:text-purple-400"
                                                )}
                                            >
                                                {tag}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Controls */}
                            <div className="px-10 pb-6 flex gap-4">
                                {/* Duration */}
                                <div className="flex-1 bg-[#0d0d0d] border border-white/5 rounded-2xl p-5">
                                    <h4 className="text-xs font-bold text-slate-400 mb-4">재생 시간</h4>
                                    <div className="flex items-center gap-4">
                                        <input
                                            type="range"
                                            min={1}
                                            max={30}
                                            value={effectDuration}
                                            step={0.5}
                                            onChange={(e) => setEffectDuration(parseFloat(e.target.value))}
                                            className="flex-1 h-1 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                                            style={{ background: `linear-gradient(to right, #06b6d4 ${((effectDuration - 1) / 29) * 100}%, #1a1a1a ${((effectDuration - 1) / 29) * 100}%)` }}
                                        />
                                        <span className="text-xs font-mono text-cyan-500 bg-cyan-500/10 px-2 py-1 rounded-md min-w-[48px] text-center">{effectDuration.toFixed(1)}s</span>
                                    </div>
                                </div>

                                {/* Stereo Toggle */}
                                <div className="w-[250px] bg-[#0d0d0d] border border-white/5 rounded-2xl p-5">
                                    <div className="flex items-center justify-between">
                                        <h4 className="text-xs font-bold text-slate-400">스테레오 출력</h4>
                                        <button
                                            onClick={() => setEffectStereo(!effectStereo)}
                                            className={cn("relative w-11 h-6 rounded-full transition-colors", effectStereo ? "bg-cyan-500" : "bg-[#333]")}
                                        >
                                            <div className={cn("absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-md transition-all", effectStereo ? "right-0.5" : "left-0.5")} />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Generate Button */}
                            <div className="px-10 pb-10 flex justify-end">
                                <button
                                    onClick={handleGenerateEffect}
                                    disabled={!effectPrompt.trim() || isGeneratingEffect}
                                    className={cn(
                                        "px-8 py-3.5 rounded-2xl font-bold text-sm flex items-center gap-3 transition-all",
                                        effectPrompt.trim() && !isGeneratingEffect
                                            ? "bg-gradient-to-r from-purple-600 to-cyan-600 text-white shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 hover:scale-[1.02] active:scale-[0.98]"
                                            : "bg-[#1a1a1a] border border-white/5 text-slate-600 cursor-not-allowed"
                                    )}
                                >
                                    {isGeneratingEffect ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            <span>생성 중...</span>
                                        </>
                                    ) : (
                                        <>
                                            <span>1곡 효과 생성</span>
                                            <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/10 text-[10px] font-mono">
                                                <Zap className="w-3 h-3" />
                                                <span>1</span>
                                            </div>
                                        </>
                                    )}
                                </button>
                            </div>

                            {/* Effect History */}
                            {effectHistory.length > 0 && (
                                <div className="px-10 pb-10">
                                    <h3 className="text-sm font-bold text-white mb-4">생성 결과</h3>
                                    <div className="space-y-3">
                                        {effectHistory.map(item => (
                                            <div key={item.id} className={cn(
                                                "bg-[#0d0d0d] border rounded-xl p-4 flex items-center gap-4 group transition-colors",
                                                playingEffectId === item.id ? "border-purple-500/40 bg-purple-500/5" : "border-white/5 hover:border-purple-500/20"
                                            )}>
                                                <button
                                                    onClick={() => playEffect(item)}
                                                    className={cn(
                                                        "w-10 h-10 rounded-xl border flex items-center justify-center transition-colors shrink-0",
                                                        playingEffectId === item.id
                                                            ? "bg-purple-500/20 border-purple-500/40 text-purple-300"
                                                            : "bg-purple-500/10 border-purple-500/20 text-purple-400 hover:bg-purple-500/20"
                                                    )}
                                                >
                                                    {playingEffectId === item.id ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                                                </button>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-xs text-white font-medium truncate">{item.prompt}</p>
                                                    <div className="flex items-center gap-3 mt-1">
                                                        <span className="text-[10px] text-slate-600">{item.duration.toFixed(1)}s</span>
                                                        <span className="text-[10px] text-slate-600">{item.stereo ? '스테레오' : '모노'}</span>
                                                        <span className="text-[10px] text-slate-600">{item.time}</span>
                                                    </div>
                                                </div>
                                                <a
                                                    href={item.url}
                                                    download={`effect_${item.id}.wav`}
                                                    className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-slate-500 hover:text-white transition-colors opacity-0 group-hover:opacity-100"
                                                >
                                                    <Download className="w-3.5 h-3.5" />
                                                </a>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </main>

                    </div>
                ) : view === 'music' ? (
                    // ====================================================================
                    // MUSIC VIEW (Coming Soon)
                    // ====================================================================
                    <div className="flex-1 flex items-center justify-center bg-[#050505]">
                        <div className="text-center space-y-6 max-w-md">
                            <div className="w-24 h-24 mx-auto rounded-3xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/20 flex items-center justify-center">
                                <Music className="w-12 h-12 text-emerald-400" />
                            </div>
                            <h2 className="text-3xl font-black text-white">AI Music</h2>
                            <p className="text-slate-500 text-sm leading-relaxed">
                                AI로 배경 음악을 생성합니다.<br />
                                장르, 분위기, 길이를 설정하고 나만의 음악을 만들어보세요.
                            </p>
                            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-bold">
                                <Loader2 className="w-4 h-4" />
                                Coming Soon
                            </div>
                        </div>
                    </div>
                ) : view === 'transcribe' ? (
                    // ====================================================================
                    // TRANSCRIBE VIEW (Coming Soon)
                    // ====================================================================
                    <div className="flex-1 flex items-center justify-center bg-[#050505]">
                        <div className="text-center space-y-6 max-w-md">
                            <div className="w-24 h-24 mx-auto rounded-3xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/20 flex items-center justify-center">
                                <FileText className="w-12 h-12 text-amber-400" />
                            </div>
                            <h2 className="text-3xl font-black text-white">Transcribe</h2>
                            <p className="text-slate-500 text-sm leading-relaxed">
                                음성 파일을 텍스트로 변환합니다.<br />
                                음성 인식, 자막 생성, 번역까지 한 번에 처리하세요.
                            </p>
                            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm font-bold">
                                <Loader2 className="w-4 h-4" />
                                Coming Soon
                            </div>
                        </div>
                    </div>
                ) : null}
            </div>

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #222; border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #333; }
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
                input[type=range] { -webkit-appearance: none; background: transparent; }
                input[type=range]::-webkit-slider-runnable-track { background: #1a1a1a; height: 4px; border-radius: 2px; }
                input[type=range]::-webkit-slider-thumb { -webkit-appearance: none; height: 12px; width: 12px; border-radius: 50%; background: #06b6d4; margin-top: -4px; box-shadow: 0 0 10px rgba(6, 182, 212, 0.4); }
            `}</style>
        </div>
    );
}
