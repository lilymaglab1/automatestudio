'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Menu, X, ChevronDown, MonitorPlay, Sparkles, AudioWaveform, Wand2, LayoutGrid, Zap, Users } from 'lucide-react';

export default function TopMenu() {
    const pathname = usePathname();

    const menuItems = [
        { label: 'AI 생성', href: '/image', icon: Sparkles },
        { label: 'AI 사운드', href: '/sound', icon: AudioWaveform },
        { label: 'AI 자동화', href: '/automation', icon: Wand2 },
        { label: 'AI 보드', href: '/board', icon: LayoutGrid },
        { label: 'AI 바로가기', href: '/shortcuts', icon: Zap },
        { label: '크리에이터', href: '/creator', icon: Users },
    ];

    return (
        <nav className="w-full bg-[#0a0a0a] border-b border-white/5 sticky top-0 z-50">
            {/* Top Notice Banner (Yellow) - Updated Text */}
            <div className="bg-[#FFD700] text-black text-[11px] font-bold py-2 px-4 text-center relative">
                <span>📢 2월 18일 오후 9시부터 19일 하루 동안 생성 오류와 크레딧 차감 로직을 업데이트 합니다. 생성이 실패하는 모델이 있을 수 있으니 양해 부탁 드립니다.</span>
                <button className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-black/10 rounded">
                    <X className="w-3 h-3" />
                </button>
            </div>

            <div className="max-w-[1920px] mx-auto px-6 h-16 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 font-black text-xl tracking-tighter mr-8">
                    <div className="bg-[#FFD700] p-1.5 rounded-lg text-black">
                        <MonitorPlay className="w-5 h-5 fill-black" />
                    </div>
                    <span className="text-white">AI Studio</span>
                </Link>

                {/* Main Navigation - Dark Pill Filtering Style */}
                <div className="hidden md:flex items-center bg-[#1a1a1a] rounded-full p-1 gap-1 border border-white/5">
                    {menuItems.map((item) => {
                        // Creating active state logic
                        const isActive = pathname.startsWith(item.href);
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.label}
                                href={item.href}
                                className={cn(
                                    "text-[12px] font-bold px-4 py-2 rounded-full flex items-center gap-2 transition-all",
                                    isActive
                                        ? "text-black bg-white shadow-[0_0_10px_rgba(255,255,255,0.2)]"
                                        : "text-slate-400 hover:text-white hover:bg-white/5"
                                )}
                            >
                                <Icon className={cn("w-3.5 h-3.5", isActive ? "text-black fill-black" : "text-slate-500")} />
                                {item.label}
                            </Link>
                        );
                    })}
                </div>

                {/* Right Side: Login / Credits */}
                <div className="flex items-center gap-4">
                    <button className="text-xs font-bold text-slate-400 hover:text-white transition-colors">고객지원</button>
                    <button className="bg-[#FFB800] text-black text-xs font-black px-4 py-2 rounded-full hover:bg-[#FFC83D] transition-colors flex items-center gap-2">
                        <Zap className="w-3 h-3 fill-black" />
                        크레딧 충전
                    </button>
                    <div className="w-8 h-8 rounded-full bg-cyan-500/20 border border-cyan-500/50 flex items-center justify-center text-cyan-400 font-bold text-xs ring-2 ring-black">
                        L
                    </div>
                </div>
            </div>
        </nav>
    );
}
