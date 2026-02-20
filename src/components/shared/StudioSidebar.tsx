'use client';

import React, { useState } from 'react';
import {
    Home,
    Folder,
    LayoutTemplate,
    Settings,
    ChevronLeft,
    ChevronRight,
    Search,
    PlusCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export default function StudioSidebar() {
    const [collapsed, setCollapsed] = useState(false);
    const [activeTab, setActiveTab] = useState('home');

    const tabs = [
        { id: 'home', icon: Home, label: '홈', href: '/automation' },
        { id: 'projects', icon: Folder, label: '내 프로젝트', href: '/automation' },
        { id: 'templates', icon: LayoutTemplate, label: '템플릿', href: '/automation/templates' },
    ];

    return (
        <div className={cn(
            "h-full flex bg-[#0f0f12] text-white border-r border-[#1f1f23] transition-all duration-300 relative",
            collapsed ? "w-[60px]" : "w-[240px]"
        )}>
            {/* Narrow Icon Bar (Always visible) */}
            <div className="w-[60px] flex flex-col items-center py-6 border-r border-[#1f1f23] z-10 shrink-0">
                <div className="flex flex-col gap-6">
                    {tabs.map((tab) => (
                        <Link
                            key={tab.id}
                            href={tab.href}
                            onClick={() => setActiveTab(tab.id)}
                            className={cn(
                                "p-3 rounded-xl transition-all flex flex-col items-center gap-1",
                                activeTab === tab.id
                                    ? "bg-[#6d28d9] text-white shadow-[0_0_15px_rgba(109,40,217,0.5)]"
                                    : "text-gray-500 hover:text-gray-300 hover:bg-[#1a1a1f]"
                            )}
                        >
                            <tab.icon className="w-5 h-5" />
                        </Link>
                    ))}
                </div>

                <div className="mt-auto flex flex-col gap-6">
                    <button className="text-gray-500 hover:text-gray-300 transition-all p-3">
                        <Settings className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Expanded Content Area (Menu Labels) */}
            {!collapsed && (
                <div className="flex-1 flex flex-col overflow-hidden animate-in fade-in slide-in-from-left-4 duration-300">
                    <div className="p-6">
                        <h2 className="text-lg font-bold tracking-tight mb-8 flex items-center gap-2">
                            <span>Studio</span>
                            <span className="text-[10px] bg-[#6d28d9] px-1.5 py-0.5 rounded text-white">BETA</span>
                        </h2>

                        <div className="space-y-2">
                            <Link href="/automation/new" className="flex items-center gap-3 p-3 bg-[#6d28d9] hover:bg-[#7c3aed] text-white rounded-xl transition-colors mb-6 shadow-lg group">
                                <PlusCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                <span className="font-bold text-sm">새 프로젝트 만들기</span>
                            </Link>

                            <div className="text-xs font-bold text-gray-500 uppercase mb-2 px-3 mt-8">Navigation</div>
                            {tabs.map((tab) => (
                                <Link
                                    key={tab.id}
                                    href={tab.href}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={cn(
                                        "flex items-center gap-3 p-3 rounded-lg transition-colors text-sm font-medium",
                                        activeTab === tab.id ? "bg-[#1a1a1f] text-white" : "text-gray-400 hover:text-white hover:bg-[#1a1a1f]"
                                    )}
                                >
                                    <tab.icon className="w-4 h-4" />
                                    {tab.label}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Toggle Button */}
            <button
                onClick={() => setCollapsed(!collapsed)}
                className="absolute -right-3 top-10 bg-[#1f1f23] border border-[#27272a] text-gray-400 p-1 rounded-full hover:text-white transition-colors z-20"
            >
                {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
            </button>
        </div>
    );
}
