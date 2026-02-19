'use client';

import React from 'react';
import TopMenu from '@/components/shared/TopMenu';
import Link from 'next/link';
import { Search, Sparkles, Box, ArrowRight, Zap } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">
      <TopMenu />

      <main className="flex flex-col">
        {/* Hero Section */}
        <section className="relative bg-slate-50 py-20 px-6 text-center border-b border-slate-200 overflow-hidden">
          <div className="max-w-4xl mx-auto relative z-10">
            <div className="inline-flex items-center gap-2 bg-yellow-100 text-yellow-800 px-4 py-1.5 rounded-full font-bold text-sm mb-6">
              <Sparkles className="w-4 h-4" />
              New Available: Nana Banana Pro
            </div>
            <h1 className="text-6xl font-black mb-6 tracking-tight text-slate-900 leading-tight">
              Everything AI, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-yellow-500">One Interface.</span>
            </h1>
            <p className="text-slate-500 text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
              No Subscriptions. Just Pay-as-you-go. <br />
              Access Midjourney, Kling, Gemini, and more in a single platform.
            </p>

            <div className="flex items-center justify-center gap-4">
              <Link href="/automation" className="bg-black text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-slate-800 transition-transform hover:-translate-y-1 shadow-lg flex items-center gap-2">
                <Zap className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                Start AI Automation
              </Link>
              <Link href="/studio" className="bg-white text-slate-900 border border-slate-200 px-8 py-4 rounded-xl font-bold text-lg hover:bg-slate-50 transition-colors flex items-center gap-2">
                <Box className="w-5 h-5" />
                Node Studio (Advanced)
              </Link>
            </div>
          </div>

          {/* Background decoration */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-tr from-yellow-200/20 to-orange-200/20 rounded-full blur-3xl -z-10"></div>
        </section>

        {/* Tools Grid matching screenshot tabs approximately */}
        <section className="max-w-7xl mx-auto px-6 py-20">
          <h2 className="text-2xl font-bold mb-10 text-center">Popular AI Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {['Midjourney V6', 'Kling Pro', 'Suno V3', 'Runway Gen-3'].map((tool, i) => (
              <div key={i} className="bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-xl hover:border-orange-300 transition-all cursor-pointer group">
                <div className="w-12 h-12 bg-slate-100 rounded-xl mb-4 flex items-center justify-center text-2xl group-hover:bg-yellow-100 transition-colors">
                  {['🎨', '🎬', '🎵', '🎥'][i]}
                </div>
                <h3 className="font-bold text-lg mb-2">{tool}</h3>
                <p className="text-slate-500 text-sm">Create stunning content with the world's best {['image', 'video', 'music', 'cinematic'][i]} model.</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
