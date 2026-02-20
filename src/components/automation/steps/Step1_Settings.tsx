'use client';

import React, { useState } from 'react';
import { useWizard } from '@/components/automation/WizardContext';
import { cn } from '@/lib/utils';
import { MonitorPlay, Smartphone, Square, LayoutTemplate, Search, CheckCircle2, Zap, Clock, ArrowRight, ArrowLeft } from 'lucide-react';
import { styles } from '@/lib/automation-constants';
import { useRouter } from 'next/navigation';

export default function Step1_Settings() {
    const { settings, updateSettings, setStep } = useWizard();
    const [searchTerm, setSearchTerm] = useState('');
    const router = useRouter();

    const ratios = [
        { id: '16:9', label: '16:9', sub: '유튜브', icon: <MonitorPlay className="w-6 h-6" /> },
        { id: '9:16', label: '9:16', sub: '쇼츠/릴스', icon: <Smartphone className="w-6 h-6" /> },
        { id: '1:1', label: '1:1', sub: '인스타', icon: <Square className="w-6 h-6" /> },
        { id: '3:4', label: '3:4', sub: '피드', icon: <LayoutTemplate className="w-6 h-6" /> }
    ];

    const filteredStyles = styles.filter(s =>
        s.label.toLowerCase().includes(searchTerm.toLowerCase()) || s.desc.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="w-full h-full animate-in fade-in slide-in-from-bottom-4 duration-700 flex flex-col overflow-y-auto custom-scrollbar relative">

            <div className="max-w-7xl mx-auto w-full px-8 pt-10 pb-32">
                {/* Header */}
                <div className="mb-10">
                    <h1 className="text-3xl font-black mb-2 text-white tracking-tight">콘셉트 설정</h1>
                    <p className="text-gray-500 font-medium">영상의 비율, 속도, 그리고 스타일을 선택해주세요.</p>
                </div>

                {/* Top Controls Container: Ratio & Cut Speed */}
                <div className="flex flex-col gap-10 mb-12">

                    {/* 1. Ratio Selector (Centered) */}
                    <div className="flex flex-col items-center">
                        <h3 className="text-sm font-bold text-gray-400 mb-4 uppercase tracking-wider">화면 비율</h3>
                        <div className="flex gap-4">
                            {ratios.map((r) => (
                                <button
                                    key={r.id}
                                    onClick={() => updateSettings({ ratio: r.id as any })}
                                    className={cn(
                                        "flex flex-col items-center justify-center w-28 h-28 rounded-2xl border-2 transition-all duration-200 group relative bg-[#1a1a1f]",
                                        settings.ratio === r.id
                                            ? "border-[#6d28d9] bg-[#6d28d9]/10 text-white shadow-[0_0_20px_rgba(109,40,217,0.3)] z-10"
                                            : "border-[#27272a] text-gray-500 hover:border-gray-500 hover:bg-[#27272a]"
                                    )}
                                >
                                    <div className={cn(
                                        "mb-2 p-2 rounded-full transition-colors",
                                        settings.ratio === r.id ? "text-[#6d28d9] bg-[#6d28d9]/20" : "text-gray-500 group-hover:text-gray-300"
                                    )}>
                                        {r.icon}
                                    </div>
                                    <span className="font-black text-lg leading-none mb-1">{r.label}</span>
                                    <span className="text-[10px] font-medium opacity-60">{r.sub}</span>

                                    {settings.ratio === r.id && (
                                        <div className="absolute top-2 right-2 text-[#6d28d9]">
                                            <CheckCircle2 className="w-4 h-4 fill-current" />
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* 2. Cut Speed Selector (Centered) */}
                    <div className="flex flex-col items-center">
                        <h3 className="text-sm font-bold text-gray-400 mb-4 uppercase tracking-wider">컷전환 속도</h3>
                        <div className="flex gap-4">
                            <button
                                onClick={() => updateSettings({ cutSpeed: 'fast' })}
                                className={cn(
                                    "flex flex-col items-center justify-center w-40 h-24 rounded-2xl border-2 transition-all duration-200 relative bg-[#1a1a1f]",
                                    settings.cutSpeed === 'fast'
                                        ? "border-[#6d28d9] bg-[#6d28d9]/10 text-white shadow-[0_0_20px_rgba(109,40,217,0.3)]"
                                        : "border-[#27272a] text-gray-500 hover:border-gray-500 hover:bg-[#27272a]"
                                )}
                            >
                                <div className="flex items-center gap-2 mb-1">
                                    <Zap className={cn("w-5 h-5", settings.cutSpeed === 'fast' ? "text-[#6d28d9] fill-current" : "text-gray-600")} />
                                    <span className="font-black text-lg">빠르게</span>
                                </div>
                                <span className="text-xs font-medium opacity-60">~5초마다 전환</span>
                            </button>

                            <button
                                onClick={() => updateSettings({ cutSpeed: 'slow' })}
                                className={cn(
                                    "flex flex-col items-center justify-center w-40 h-24 rounded-2xl border-2 transition-all duration-200 relative bg-[#1a1a1f]",
                                    settings.cutSpeed === 'slow'
                                        ? "border-[#6d28d9] bg-[#6d28d9]/10 text-white shadow-[0_0_20px_rgba(109,40,217,0.3)]"
                                        : "border-[#27272a] text-gray-500 hover:border-gray-500 hover:bg-[#27272a]"
                                )}
                            >
                                <div className="flex items-center gap-2 mb-1">
                                    <Clock className={cn("w-5 h-5", settings.cutSpeed === 'slow' ? "text-[#6d28d9] fill-current" : "text-gray-600")} />
                                    <span className="font-black text-lg">느리게</span>
                                </div>
                                <span className="text-xs font-medium opacity-60">~3-4문장마다 전환</span>
                            </button>
                        </div>
                    </div>

                </div>

                {/* 3. Style Grid (Full Width) */}
                <div className="w-full">
                    <div className="flex items-center justify-between border-b border-[#27272a] pb-4 mb-6">
                        <h3 className="text-xl font-bold flex items-center gap-2 text-white">
                            <Search className="w-5 h-5 text-[#6d28d9]" />
                            스타일 (Mood)
                            <span className="text-xs bg-[#27272a] text-gray-400 px-2 py-0.5 rounded-full ml-2">{styles.length}</span>
                        </h3>

                        {/* Search Input */}
                        <div className="relative group">
                            <input
                                type="text"
                                placeholder="스타일 검색..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="bg-[#1a1a1f] border border-[#27272a] rounded-lg px-3 py-1.5 pl-9 text-xs focus:border-[#6d28d9] w-48 transition-all outline-none text-white placeholder:text-gray-600"
                            />
                            <Search className="w-3.5 h-3.5 text-gray-600 absolute left-3 top-1/2 -translate-y-1/2 group-focus-within:text-[#6d28d9] transition-colors" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                        {filteredStyles.map((s) => (
                            <button
                                key={s.id}
                                onClick={() => updateSettings({ style: s.id as any })}
                                className={cn(
                                    "flex flex-col rounded-xl overflow-hidden border-2 transition-all group text-left relative aspect-[4/5]",
                                    settings.style === s.id
                                        ? "border-[#6d28d9] scale-[1.02] shadow-[0_0_20px_rgba(109,40,217,0.4)] z-10 ring-1 ring-[#6d28d9]"
                                        : "border-[#1f1f23] bg-[#0f0f12] hover:border-[#6d28d9]/50 hover:scale-[1.01]"
                                )}
                            >
                                {/* Image Part */}
                                <div className="flex-1 relative overflow-hidden h-full bg-[#1a1a1f]">
                                    <img src={s.preview} alt={s.label} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-80 group-hover:opacity-100" />
                                    <div className={cn(
                                        "absolute inset-0 transition-all duration-300",
                                        settings.style === s.id ? "bg-[#6d28d9]/10" : "bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-40"
                                    )}></div>

                                    {settings.style === s.id && (
                                        <div className="absolute top-2 right-2 bg-[#6d28d9] text-white p-1 rounded-full shadow-lg z-20 animate-in zoom-in duration-200">
                                            <CheckCircle2 className="w-4 h-4" />
                                        </div>
                                    )}
                                </div>

                                {/* Text Part */}
                                <div className="p-4 bg-[#151518] border-t border-[#1f1f23] relative z-10">
                                    <h4 className={cn("font-bold text-sm mb-0.5 tracking-tight truncate", settings.style === s.id ? "text-[#a78bfa]" : "text-gray-200")}>
                                        {s.label}
                                    </h4>
                                    <p className="text-[10px] text-gray-500 font-medium line-clamp-1">{s.desc}</p>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

            </div>

            {/* Footer Navigation */}
            <div className="sticky bottom-0 left-0 right-0 p-6 bg-[#0f0f12]/90 backdrop-blur-xl border-t border-[#1f1f23] flex items-center justify-between z-50 mt-auto">
                <button
                    onClick={() => router.push('/automation')}
                    className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors font-medium px-4 py-2"
                >
                    <ArrowLeft className="w-4 h-4" />
                    대시보드로
                </button>

                <button
                    onClick={() => setStep(2)}
                    className="flex items-center gap-2 bg-[#6d28d9] hover:bg-[#7c3aed] text-white px-8 py-3 rounded-full font-bold shadow-[0_0_20px_rgba(109,40,217,0.3)] transition-all hover:-translate-y-0.5 active:translate-y-0"
                >
                    다음 단계
                    <ArrowRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}
