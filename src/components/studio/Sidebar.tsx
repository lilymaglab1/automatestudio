
import React from 'react';
import Link from 'next/link';
import { Home, Zap, Image as ImageIcon, Video, Box, Code, Play } from 'lucide-react';

export default function Sidebar() {
    return (
        <aside className="w-64 border-r border-slate-800 bg-slate-950 p-4 shrink-0 flex flex-col gap-4 text-slate-200">
            <Link href="/" className="font-bold text-lg mb-6 flex items-center gap-2 hover:text-purple-400 transition-colors">
                <Box className="w-6 h-6 text-purple-500" />
                BBANANA.AI
            </Link>

            <nav className="space-y-2">
                <Link href="/" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg hover:bg-slate-900 hover:text-white group transition-colors">
                    <Home className="w-4 h-4 text-slate-400 group-hover:text-purple-400" />
                    <span>Dashboard</span>
                </Link>
                <Link href="/studio" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg hover:bg-slate-900 hover:text-white group transition-colors">
                    <Zap className="w-4 h-4 text-slate-400 group-hover:text-yellow-400" />
                    <span>Automation Studio</span>
                </Link>
            </nav>

            <div className="mt-6 text-xs text-slate-500 font-medium uppercase tracking-wider mb-2 px-3">
                Tools
            </div>
            <nav className="space-y-2">
                <Link href="/image" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg hover:bg-slate-900 hover:text-white group transition-colors">
                    <ImageIcon className="w-4 h-4 text-slate-400 group-hover:text-pink-400" />
                    <span>Image Generation</span>
                </Link>
                <Link href="/video" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg hover:bg-slate-900 hover:text-white group transition-colors">
                    <Video className="w-4 h-4 text-slate-400 group-hover:text-orange-400" />
                    <span>Video Creation</span>
                </Link>
            </nav>


            <div className="mt-auto p-4 bg-slate-900 rounded-xl border border-slate-800">
                <div className="text-xs font-medium text-slate-400 mb-1">Current Plan</div>
                <div className="text-sm font-bold text-white mb-2">Pro Member</div>
                <div className="w-full bg-slate-800 rounded-full h-1.5 mb-2">
                    <div className="bg-purple-500 h-1.5 rounded-full w-3/4"></div>
                </div>
                <div className="text-xs text-slate-500 flex justify-between">
                    <span>Credits</span>
                    <span>750 / 1000</span>
                </div>
            </div>
        </aside>
    );
}
