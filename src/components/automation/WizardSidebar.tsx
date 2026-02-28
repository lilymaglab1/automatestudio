'use client';

import React, { useState, useRef } from 'react';
import {
    Settings,
    ChevronLeft,
    ChevronRight,
    Volume2,
    Video,
    Sparkles,
    Wand2,
    Play,
    Info,
    CheckCircle2,
    ChevronDown,
    MonitorPlay,
    Smartphone,
    Square,
    LayoutTemplate
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useWizard, AspectRatio } from '@/components/automation/WizardContext';
import { styles, videoModels, imageModels } from '@/lib/automation-constants';
import { VOICES } from '@/lib/voice_data';

export default function WizardSidebar() {
    const { settings, updateSettings, setStep } = useWizard();
    const [collapsed, setCollapsed] = useState(false);
    const [activeTab, setActiveTab] = useState('narr');
    const [showAllStyles, setShowAllStyles] = useState(false);

    const activeStyle = styles.find(s => s.id === settings.style) || styles[0];

    // Helper for Voice Speed Display
    const getVoiceSpeedLabel = (val: number) => {
        if (val === 1) return '보통';
        if (val > 1) return '빠르게';
        return '느리게';
    };

    const [isPreviewing, setIsPreviewing] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const playPreviewVoice = async () => {
        if (!settings.selectedVoice || isPreviewing) return;

        const voice = VOICES.find(v => v.id === settings.selectedVoice);
        if (!voice) return;

        try {
            setIsPreviewing(true);

            // Stop existing audio if any
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }

            const res = await fetch('/api/tts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    text: voice.sampleText || '안녕하세요, 반갑습니다.',
                    voiceId: voice.id
                })
            });

            if (!res.ok) throw new Error('TTS Failed');

            const blob = await res.blob();
            const url = URL.createObjectURL(blob);
            const audio = new Audio(url);

            audioRef.current = audio;
            audio.onended = () => setIsPreviewing(false);
            audio.onerror = () => setIsPreviewing(false);

            await audio.play();
        } catch (error) {
            console.error('Play preview error:', error);
            setIsPreviewing(false);

            // Fallback to browser TTS
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(voice.sampleText || '안녕하세요');
            utterance.lang = voice.googleVoiceId.startsWith('en') ? 'en-US' : 'ko-KR';
            window.speechSynthesis.speak(utterance);
        }
    };

    const tabs = [
        { id: 'narr', icon: Volume2, label: '나레이션' },
        { id: 'prod', icon: Video, label: '영상 소스' },
        { id: 'fash', icon: Sparkles, label: '스타일' },
    ];

    const getRatioIcon = (ratio: AspectRatio) => {
        switch (ratio) {
            case '16:9': return MonitorPlay;
            case '9:16': return Smartphone;
            case '1:1': return Square;
            case '3:4': return LayoutTemplate;
            default: return MonitorPlay;
        }
    };

    return (
        <div className={cn(
            "h-full flex bg-[#0f0f12] text-white border-r border-[#1f1f23] transition-all duration-300 relative rounded-tr-3xl rounded-br-3xl overflow-hidden shadow-2xl z-50",
            collapsed ? "w-[60px]" : "w-[360px]"
        )}>
            {/* Narrow Icon Bar */}
            <div className="w-[60px] flex flex-col items-center py-6 border-r border-[#1f1f23] z-10 shrink-0 bg-[#0f0f12]">
                <div className="flex flex-col gap-6">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={cn(
                                "p-3 rounded-xl transition-all flex flex-col items-center gap-1",
                                activeTab === tab.id
                                    ? "bg-[#6d28d9] text-white shadow-[0_0_15px_rgba(109,40,217,0.5)]"
                                    : "text-gray-500 hover:text-gray-300 hover:bg-[#1a1a1f]"
                            )}
                        >
                            <tab.icon className="w-5 h-5" />
                            {!collapsed && <span className="text-[10px] font-bold uppercase">{tab.id}</span>}
                        </button>
                    ))}
                </div>

                <div className="mt-auto flex flex-col gap-6">
                    <button className="text-gray-500 hover:text-gray-300 transition-all p-3">
                        <Settings className="w-5 h-5" />
                    </button>
                    <button className="text-gray-500 hover:text-gray-300 transition-all p-3">
                        <Info className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Expanded Content Area */}
            {!collapsed && (
                <div className="flex-1 flex flex-col overflow-hidden animate-in fade-in slide-in-from-left-4 duration-300 bg-[#0f0f12]">
                    <div className="p-6 overflow-y-auto custom-scrollbar flex-1 pb-20">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h2 className="text-xl font-black tracking-tight mb-1">나레이션 설정</h2>
                                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">GLOBAL CONFIGURATOR</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="bg-[#6d28d9]/20 text-[#6d28d9] text-[10px] px-2 py-0.5 rounded-full font-bold border border-[#6d28d9]/30">PRO</span>
                                <button onClick={() => setCollapsed(true)} className="text-gray-500 hover:text-white p-1">
                                    <ChevronLeft className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        <div className="space-y-10">

                            {/* === 음성 파라미터 Section (Screenshot 1) === */}
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase mb-4 block">음성 파라미터</label>

                                {/* Voice Speed */}
                                <div className="mb-6">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-bold text-gray-300">음성 빠르기</span>
                                    </div>
                                    <div className="flex bg-[#1a1a1f] p-1.5 rounded-2xl border border-[#27272a]">
                                        {[1, 1.2].map((sped) => (
                                            <button
                                                key={sped}
                                                onClick={() => updateSettings({ voiceSpeed: sped })}
                                                className={cn(
                                                    "flex-1 py-3 text-sm font-bold rounded-xl transition-all",
                                                    settings.voiceSpeed === sped
                                                        ? "bg-[#5b21b6] text-white shadow-lg shadow-purple-900/50"
                                                        : "text-gray-500 hover:text-gray-300"
                                                )}
                                            >
                                                {getVoiceSpeedLabel(sped)}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Default Voice Selector */}
                                <div className="mb-6">
                                    <span className="text-sm font-bold text-gray-300 mb-2 block">기본 음성 (마이 보이스)</span>
                                    <div className="flex items-center gap-2">
                                        <div className="relative flex-1">
                                            <select
                                                value={settings.selectedVoice || ''}
                                                onChange={(e) => updateSettings({ selectedVoice: e.target.value })}
                                                className="w-full bg-[#1a1a1f] border border-[#27272a] rounded-2xl px-4 py-4 pr-10 text-sm font-medium text-white appearance-none cursor-pointer hover:border-[#6d28d9] focus:outline-none focus:border-[#6d28d9] transition-all"
                                            >
                                                <option value="" disabled className="bg-[#1a1a1f] text-gray-500">
                                                    음성 선택
                                                </option>
                                                {VOICES.map(v => (
                                                    <option key={v.id} value={v.id} className="bg-[#1a1a1f] text-white">
                                                        {v.name} ({v.tags.join(', ')})
                                                    </option>
                                                ))}
                                            </select>
                                            <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none">
                                                <ChevronDown className="w-4 h-4 text-gray-600" />
                                            </div>
                                        </div>
                                        <button
                                            onClick={playPreviewVoice}
                                            disabled={!settings.selectedVoice || isPreviewing}
                                            className={cn(
                                                "p-4 rounded-2xl border transition-all",
                                                !settings.selectedVoice ? "bg-[#1a1a1f] border-[#27272a] text-gray-600 cursor-not-allowed" :
                                                    isPreviewing ? "bg-[#6d28d9] border-[#6d28d9] text-white animate-pulse" :
                                                        "bg-[#1a1a1f] border-[#27272a] hover:border-[#6d28d9] text-gray-400 hover:text-[#6d28d9]"
                                            )}
                                        >
                                            <Play className="w-4 h-4 fill-current" />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Cut Speed (Screenshot 1) */}
                            <div className="mb-6">
                                <span className="text-sm font-bold text-gray-300 mb-2 block">컷전환 속도</span>
                                <div className="flex bg-[#1a1a1f] p-1.5 rounded-2xl border border-[#27272a]">
                                    {['fast', 'slow'].map((speed) => (
                                        <button
                                            key={speed}
                                            onClick={() => updateSettings({ cutSpeed: speed as 'fast' | 'slow' })}
                                            className={cn(
                                                "flex-1 py-3 text-sm font-bold rounded-xl transition-all",
                                                settings.cutSpeed === speed
                                                    ? "bg-[#5b21b6] text-white shadow-lg shadow-purple-900/50"
                                                    : "text-gray-500 hover:text-gray-300"
                                            )}
                                        >
                                            {speed === 'fast' ? '빠르게' : '느리게'}
                                        </button>
                                    ))}
                                </div>
                                <p className="text-xs text-gray-500 mt-2 ml-1">
                                    {settings.cutSpeed === 'fast' ? '~5초마다 컷 전환' : '~3-4문장마다 컷 전환'}
                                </p>
                            </div>

                            {/* Duration (Screenshot 1) */}
                            <div className="mb-8">
                                <span className="text-sm font-bold text-gray-300 mb-2 block">영상 길이 (자동 생성 목표)</span>
                                <div className="flex bg-[#1a1a1f] p-1.5 rounded-2xl border border-[#27272a] mb-3">
                                    {[30, 60, 90].map((sec) => (
                                        <button
                                            key={sec}
                                            onClick={() => updateSettings({ durationPreset: sec })}
                                            className={cn(
                                                "flex-1 py-3 text-sm font-bold rounded-xl transition-all",
                                                settings.durationPreset === sec
                                                    ? "bg-[#5b21b6] text-white shadow-lg shadow-purple-900/50"
                                                    : "text-gray-500 hover:text-gray-300"
                                            )}
                                        >
                                            {sec}초
                                        </button>
                                    ))}
                                </div>
                                <div className="flex items-center justify-between px-4 py-3 bg-[#1a1a1f] rounded-2xl border border-[#27272a]">
                                    <span className="text-xs font-bold text-gray-500">직접 입력</span>
                                    <div className="flex items-center gap-2">
                                        <span className="text-lg font-black text-white">{settings.durationPreset}</span>
                                        <span className="text-xs font-bold text-gray-600">sec</span>
                                    </div>
                                </div>
                            </div>

                            {/* AI Engine Section */}
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase mb-4 block">AI 생성 엔진</label>

                                {/* Script Model */}
                                <div className="mb-4">
                                    <span className="text-sm font-bold text-gray-500 mb-2 block text-[10px]">대본 생성 모델</span>
                                    <div className="relative">
                                        <select
                                            value={settings.scriptModel || 'gemini'}
                                            onChange={(e) => updateSettings({ scriptModel: e.target.value })}
                                            className="w-full bg-[#1a1a1f] border border-[#27272a] rounded-2xl px-4 py-4 pr-10 text-sm font-medium text-white appearance-none cursor-pointer hover:border-[#6d28d9] focus:outline-none focus:border-[#6d28d9] transition-all"
                                        >
                                            <option value="gemini" className="bg-[#1a1a1f] text-white py-2">Google Gemini 2.5</option>
                                            <option value="grok" className="bg-[#1a1a1f] text-white py-2">xAI Grok-2</option>
                                        </select>
                                        <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none">
                                            <ChevronDown className="w-4 h-4 text-gray-600" />
                                        </div>
                                    </div>
                                </div>

                                {/* Image Model */}
                                <div className="mb-4">
                                    <span className="text-sm font-bold text-gray-500 mb-2 block text-[10px]">이미지 생성 모델</span>
                                    <div className="relative">
                                        <select
                                            value={settings.imageModel || imageModels[0].id}
                                            onChange={(e) => updateSettings({ imageModel: e.target.value })}
                                            className="w-full bg-[#1a1a1f] border border-[#27272a] rounded-2xl px-4 py-4 pr-10 text-sm font-medium text-white appearance-none cursor-pointer hover:border-[#6d28d9] focus:outline-none focus:border-[#6d28d9] transition-all"
                                        >
                                            {imageModels.map(m => (
                                                <option key={m.id} value={m.id} className="bg-[#1a1a1f] text-white py-2">
                                                    {m.label} {m.isPro ? '(PRO)' : ''}
                                                </option>
                                            ))}
                                        </select>
                                        <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none">
                                            <ChevronDown className="w-4 h-4 text-gray-600" />
                                        </div>
                                    </div>
                                </div>

                                {/* Video Model */}
                                <div className="mb-6">
                                    <span className="text-sm font-bold text-gray-500 mb-2 block text-[10px]">영상 생성 모델</span>
                                    <div className="relative">
                                        <select
                                            value={settings.videoModel || ""}
                                            onChange={(e) => updateSettings({ videoModel: e.target.value })}
                                            className={cn(
                                                "w-full bg-[#1a1a1f] border rounded-2xl px-4 py-4 pr-10 text-sm font-medium appearance-none cursor-pointer focus:outline-none transition-all",
                                                !settings.videoModel
                                                    ? "text-gray-500 border-[#27272a] hover:border-gray-500"
                                                    : "text-white border-[#6d28d9] bg-[#5b21b6]/10"
                                            )}
                                        >
                                            <option value="" disabled className="bg-[#1a1a1f] text-gray-500">
                                                모델 선택 (기본값 없음)
                                            </option>
                                            {videoModels.map(m => (
                                                <option key={m.id} value={m.id} className="bg-[#1a1a1f] text-white">
                                                    {m.label} {m.isPro ? '(PRO)' : ''}
                                                </option>
                                            ))}
                                        </select>
                                        <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none">
                                            {!settings.videoModel ? <ChevronDown className="w-4 h-4 text-gray-600" /> : <CheckCircle2 className="w-4 h-4 text-[#6d28d9]" />}
                                        </div>
                                    </div>
                                </div>
                            </div>


                            {/* Ratio Selector (Screenshot 1 Bottom) */}
                            <div className="mb-8">
                                <label className="text-xs font-bold text-gray-500 uppercase mb-4 block">화면 비율</label>
                                <div className="grid grid-cols-4 gap-3">
                                    {['16:9', '9:16', '1:1', '3:4'].map((ratio) => {
                                        const Icon = getRatioIcon(ratio as AspectRatio);
                                        const isSelected = settings.ratio === ratio;
                                        return (
                                            <button
                                                key={ratio}
                                                onClick={() => updateSettings({ ratio: ratio as AspectRatio })}
                                                className={cn(
                                                    "flex flex-col items-center justify-center p-3 rounded-2xl border transition-all aspect-square",
                                                    isSelected
                                                        ? "bg-[#5b21b6]/20 border-[#6d28d9] text-[#a78bfa] ring-1 ring-[#6d28d9]"
                                                        : "bg-[#1a1a1f] border-[#27272a] text-gray-500 hover:bg-[#27272a]"
                                                )}
                                            >
                                                <Icon className="w-5 h-5 mb-1" />
                                                <span className="text-[10px] font-bold">{ratio}</span>
                                            </button>
                                        )
                                    })}
                                </div>
                            </div>

                            {/* Style Minimap (Screenshot 2 Top) */}
                            <div className="mb-8 p-4 bg-[#1a1a1f] rounded-3xl border border-[#27272a]">
                                <div className="flex items-center justify-between mb-4 px-1">
                                    <span className="text-xs font-bold text-gray-400">추천 스타일</span>
                                    <button
                                        onClick={() => setShowAllStyles(true)}
                                        className="text-[10px] text-[#6d28d9] font-bold hover:underline"
                                    >
                                        모두보기
                                    </button>
                                </div>
                                <div className="grid grid-cols-3 gap-3">
                                    {styles.slice(0, 6).map((s) => (
                                        <button
                                            key={s.id}
                                            onClick={() => updateSettings({ style: s.id as any })}
                                            className={cn(
                                                "aspect-square rounded-xl overflow-hidden relative border-2 transition-all",
                                                settings.style === s.id ? "border-[#6d28d9] opacity-100 ring-2 ring-[#6d28d9]" : "border-transparent opacity-60 hover:opacity-100"
                                            )}
                                        >
                                            <img src={s.preview} alt={s.label} className="w-full h-full object-cover" />
                                        </button>
                                    ))}
                                </div>
                            </div>


                            {/* Rendering / Subtitles (Screenshot 2) */}
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase mb-4 block">렌더링 설정</label>

                                {/* Subtitle Toggle */}
                                <div className="flex items-center justify-between bg-[#1a1a1f] p-4 rounded-2xl border border-[#27272a] mb-6">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold text-white">자막 포함</span>
                                        <span className="text-[10px] text-gray-500">영상에 자막을 자동으로 합성합니다</span>
                                    </div>
                                    <button
                                        onClick={() => updateSettings({ includeSubtitles: !settings.includeSubtitles })}
                                        className={cn(
                                            "w-12 h-7 rounded-full relative transition-colors duration-300",
                                            settings.includeSubtitles ? "bg-[#6d28d9]" : "bg-[#27272a]"
                                        )}
                                    >
                                        <div className={cn(
                                            "absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform duration-300 shadow-md",
                                            settings.includeSubtitles && "translate-x-5"
                                        )} />
                                    </button>
                                </div>

                                {/* Detailed Subtitle Settings */}
                                {settings.includeSubtitles && (
                                    <div className="space-y-4 px-1 animate-in fade-in slide-in-from-top-2 duration-300">
                                        <div className="flex items-center gap-2 mb-2">
                                            <TypeIcon className="w-4 h-4 text-gray-500" />
                                            <span className="text-xs font-bold text-gray-400">자막 스타일</span>
                                        </div>

                                        {/* Font */}
                                        <div className="bg-[#1a1a1f] border border-[#27272a] rounded-xl p-3">
                                            <span className="text-[10px] font-bold text-gray-500 block mb-2">폰트</span>
                                            <div className="relative">
                                                <select
                                                    value={settings.subtitleSettings?.font || 'Pretendard'}
                                                    onChange={(e) => updateSettings({
                                                        subtitleSettings: { ...settings.subtitleSettings!, font: e.target.value }
                                                    })}
                                                    className="w-full bg-transparent text-sm font-medium text-white appearance-none cursor-pointer focus:outline-none"
                                                >
                                                    <option value="Pretendard" className="bg-[#1a1a1f]">Pretendard</option>
                                                    <option value="NanumGothic" className="bg-[#1a1a1f]">나눔고딕</option>
                                                    <option value="GmarketSansBold" className="bg-[#1a1a1f]">G마켓 산스</option>
                                                    <option value="NotoSansKR" className="bg-[#1a1a1f]">Noto Sans KR</option>
                                                </select>
                                                <div className="absolute inset-y-0 right-0 flex items-center pointer-events-none">
                                                    <ChevronDown className="w-4 h-4 text-gray-600" />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Size */}
                                        <div className="bg-[#1a1a1f] border border-[#27272a] rounded-xl p-3">
                                            <span className="text-[10px] font-bold text-gray-500 block mb-2">크기</span>
                                            <div className="relative">
                                                <select
                                                    value={settings.subtitleSettings?.size || 'medium'}
                                                    onChange={(e) => updateSettings({
                                                        subtitleSettings: { ...settings.subtitleSettings!, size: e.target.value }
                                                    })}
                                                    className="w-full bg-transparent text-sm font-medium text-white appearance-none cursor-pointer focus:outline-none"
                                                >
                                                    <option value="small" className="bg-[#1a1a1f]">작게</option>
                                                    <option value="medium" className="bg-[#1a1a1f]">보통</option>
                                                    <option value="large" className="bg-[#1a1a1f]">크게</option>
                                                    <option value="xlarge" className="bg-[#1a1a1f]">매우 크게</option>
                                                </select>
                                                <div className="absolute inset-y-0 right-0 flex items-center pointer-events-none">
                                                    <ChevronDown className="w-4 h-4 text-gray-600" />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Shadow & Outline Settings */}
                                        <div className="flex gap-3">
                                            {/* Shadow */}
                                            <div className="flex-1 bg-[#1a1a1f] border border-[#27272a] rounded-xl p-3">
                                                <span className="text-[10px] font-bold text-gray-500 block mb-2">테두리/그림자</span>
                                                <div className="relative">
                                                    <select
                                                        value={settings.subtitleSettings?.shadow || 'outline'}
                                                        onChange={(e) => updateSettings({
                                                            subtitleSettings: { ...settings.subtitleSettings!, shadow: e.target.value }
                                                        })}
                                                        className="w-full bg-transparent text-sm font-medium text-white appearance-none cursor-pointer focus:outline-none"
                                                    >
                                                        <option value="none" className="bg-[#1a1a1f]">없음</option>
                                                        <option value="soft" className="bg-[#1a1a1f]">기본 그림자</option>
                                                        <option value="hard" className="bg-[#1a1a1f]">진한 그림자</option>
                                                        <option value="outline" className="bg-[#1a1a1f]">텍스트 겉선 (외곽선)</option>
                                                    </select>
                                                    <div className="absolute inset-y-0 right-0 flex items-center pointer-events-none">
                                                        <ChevronDown className="w-4 h-4 text-gray-600" />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Outline Color */}
                                            {settings.subtitleSettings?.shadow === 'outline' && (
                                                <div className="flex-1 bg-[#1a1a1f] border border-[#27272a] rounded-xl p-3 animate-in zoom-in-95 duration-200">
                                                    <span className="text-[10px] font-bold text-gray-500 block mb-2">외곽선 색상</span>
                                                    <div className="flex items-center gap-3">
                                                        <input
                                                            type="color"
                                                            value={settings.subtitleSettings?.outlineColor || '#000000'}
                                                            onChange={(e) => updateSettings({
                                                                subtitleSettings: { ...settings.subtitleSettings!, outlineColor: e.target.value }
                                                            })}
                                                            className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0 p-0"
                                                        />
                                                        <span className="text-xs font-mono text-gray-400">
                                                            {(settings.subtitleSettings?.outlineColor || '#000000').toUpperCase()}
                                                        </span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Colors */}
                                        <div className="flex gap-3">
                                            <div className="flex-1 bg-[#1a1a1f] border border-[#27272a] rounded-xl p-3">
                                                <span className="text-[10px] font-bold text-gray-500 block mb-2">글자 색상</span>
                                                <div className="flex items-center gap-3">
                                                    <input
                                                        type="color"
                                                        value={settings.subtitleSettings?.color || '#FFFFFF'}
                                                        onChange={(e) => updateSettings({
                                                            subtitleSettings: { ...settings.subtitleSettings!, color: e.target.value }
                                                        })}
                                                        className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0 p-0"
                                                    />
                                                    <span className="text-xs font-mono text-gray-400">
                                                        {(settings.subtitleSettings?.color || '#FFFFFF').toUpperCase()}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="flex-1 bg-[#1a1a1f] border border-[#27272a] rounded-xl p-3">
                                                <span className="text-[10px] font-bold text-gray-500 block mb-2">배경 색상</span>
                                                <div className="flex items-center gap-3">
                                                    <input
                                                        type="color"
                                                        value={settings.subtitleSettings?.bgColor || '#000000'}
                                                        onChange={(e) => updateSettings({
                                                            subtitleSettings: { ...settings.subtitleSettings!, bgColor: e.target.value }
                                                        })}
                                                        className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0 p-0"
                                                    />
                                                    <span className="text-xs font-mono text-gray-400">
                                                        {(settings.subtitleSettings?.bgColor || '#000000').toUpperCase()}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Fixed Bottom Save Button */}
                    <div className="p-6 border-t border-[#1f1f23] bg-[#0f0f12]">
                        <button
                            onClick={() => console.log('Settings Saved', settings)}
                            className="w-full py-4 bg-[#6d28d9] hover:bg-[#7c3aed] text-white font-bold rounded-2xl shadow-[0_0_20px_rgba(109,40,217,0.3)] transition-all flex items-center justify-center gap-2 transform hover:-translate-y-1 active:translate-y-0 text-lg"
                        >
                            <Wand2 className="w-5 h-5" />
                            설정 완료
                        </button>
                    </div>
                </div>
            )}

            {/* Small handle to re-expand when collapsed */}
            {collapsed && (
                <button
                    onClick={() => setCollapsed(false)}
                    className="absolute -right-3 top-1/2 -translate-y-1/2 bg-[#6d28d9] text-white p-1 rounded-full shadow-lg z-20 hover:scale-110 transition-transform"
                >
                    <ChevronRight className="w-3 h-3" />
                </button>
            )}

            {/* All Styles Modal */}
            {showAllStyles && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-6 animate-in fade-in duration-200">
                    <div className="bg-[#121217] border border-[#1f1f23] rounded-3xl w-full max-w-5xl max-h-[85vh] flex flex-col shadow-[0_0_50px_rgba(0,0,0,0.5)]">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-8 border-b border-[#1f1f23]">
                            <div>
                                <h2 className="text-3xl font-black text-white mb-2">모든 스타일 보기</h2>
                                <p className="text-gray-400 font-medium">원하는 시각적 분위기를 선택해 주세요.</p>
                            </div>
                            <button
                                onClick={() => setShowAllStyles(false)}
                                className="bg-[#1a1a1f] hover:bg-[#27272a] text-gray-400 hover:text-white p-3 rounded-2xl transition-all"
                            >
                                닫기
                            </button>
                        </div>

                        {/* Modal Body - Grid of all styles */}
                        <div className="p-8 overflow-y-auto custom-scrollbar flex-1">
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                {styles.map((styleOpt) => (
                                    <button
                                        key={styleOpt.id}
                                        onClick={() => {
                                            updateSettings({ style: styleOpt.id as any });
                                            setShowAllStyles(false);
                                        }}
                                        className={cn(
                                            "relative group rounded-3xl overflow-hidden aspect-video border-4 transition-all duration-300",
                                            settings.style === styleOpt.id
                                                ? "border-[#6d28d9] shadow-[0_0_30px_rgba(109,40,217,0.4)] scale-105"
                                                : "border-transparent opacity-80 hover:opacity-100 hover:scale-105"
                                        )}
                                    >
                                        <img
                                            src={styleOpt.preview}
                                            alt={styleOpt.label}
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-5">
                                            <span className="text-white font-black text-lg shadow-black drop-shadow-md text-left leading-tight mb-1">
                                                {styleOpt.label}
                                            </span>
                                            <span className="text-gray-300 text-xs font-bold text-left line-clamp-1">
                                                {styleOpt.desc}
                                            </span>

                                            {/* Active Checkmark */}
                                            {settings.style === styleOpt.id && (
                                                <div className="absolute top-4 right-4 bg-[#6d28d9] text-white p-1 rounded-full shadow-lg">
                                                    <CheckCircle2 className="w-5 h-5" />
                                                </div>
                                            )}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function TypeIcon({ className }: { className?: string }) {
    return (
        <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="4 7 4 4 20 4 20 7"></polyline>
            <line x1="9" y1="20" x2="15" y2="20"></line>
            <line x1="12" y1="4" x2="12" y2="20"></line>
        </svg>
    )
}
