
'use client';

import React from 'react';
import { Settings, PlayCircle, Plus, Sparkles, FolderOpen, Video as VideoIcon, Tv, LayoutTemplate, SquarePlay } from 'lucide-react';
import Link from 'next/link';

export default function AutomationDashboardClient() {
    return (
        <div className="max-w-[1280px] mx-auto py-12 px-6">
            {/* Header Area */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                        <Tv className="w-8 h-8 text-indigo-600" />
                        내 프로젝트
                    </h1>
                    <p className="text-slate-500 mt-1 pl-10">
                        지금까지 생성한 자동화 프로젝트들을 관리하세요.
                    </p>
                </div>

                <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-5 py-2.5 text-slate-600 hover:text-slate-900 font-bold border border-slate-200 rounded-full hover:border-slate-400 bg-white shadow-sm transition-all text-sm">
                        <Settings className="w-4 h-4" />
                        설정
                    </button>

                    <Link href="/automation/autopilot" className="flex items-center gap-2 px-6 py-2.5 text-indigo-600 font-bold bg-indigo-50 hover:bg-indigo-100 rounded-full transition-all text-sm group border border-indigo-100">
                        <Sparkles className="w-4 h-4 fill-indigo-200 text-indigo-500 group-hover:fill-indigo-300" />
                        오토파일럿
                    </Link>

                    <Link href="/automation/new" className="flex items-center gap-2 px-6 py-2.5 text-white font-bold bg-black hover:bg-gray-800 rounded-full shadow-lg hover:shadow-xl transition-all text-sm transform hover:-translate-y-0.5">
                        <Plus className="w-4 h-4" />
                        새 프로젝트
                    </Link>
                </div>
            </div>

            {/* Empty State / Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {/* Project Card Example 1 */}
                <div className="group bg-white rounded-xl overflow-hidden border border-slate-200 hover:border-indigo-400 transition-all shadow-sm hover:shadow-lg hover:shadow-indigo-50 cursor-pointer p-0 relative">
                    <div className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="bg-white/90 p-1.5 rounded-full hover:bg-white text-slate-500 hover:text-red-500 shadow-sm">
                            <span className="sr-only">Delete</span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></svg>
                        </button>
                    </div>
                    <div className="bg-slate-100 h-40 flex items-center justify-center relative overflow-hidden group-hover:scale-105 transition-transform duration-500">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-4">
                            <span className="bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-semibold border border-white/30 flex items-center gap-1">
                                <PlayCircle className="w-3 h-3 fill-white" />
                                미리보기
                            </span>
                        </div>
                        <VideoIcon className="w-12 h-12 text-slate-300 group-hover:text-indigo-500 transition-colors" />
                    </div>
                    <div className="p-5">
                        <div className="flex items-center justify-between mb-1">
                            <h3 className="font-bold text-slate-800 group-hover:text-indigo-600 transition-colors line-clamp-1">
                                환율 1500원 돌파, 경제 위기인가?
                            </h3>
                        </div>
                        <div className="text-xs text-slate-500 font-medium mb-3 flex items-center gap-2">
                            <span className="bg-green-100 text-green-700 px-1.5 py-0.5 rounded">완료됨</span>
                            <span>•</span>
                            <span>21분 전</span>
                        </div>
                        <div className="flex items-center justify-between text-xs text-slate-400 font-medium border-t border-slate-100 pt-3 mt-1">
                            <span className="flex items-center gap-1">
                                <LayoutTemplate className="w-3 h-3" />
                                16:9 롱폼
                            </span>
                            <span>20s</span>
                        </div>
                    </div>
                </div>

                {/* Add New Project Card */}
                <Link href="/automation/new" className="border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center h-[300px] text-slate-400 hover:text-indigo-500 hover:border-indigo-400 hover:bg-indigo-50/30 transition-all cursor-pointer group">
                    <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4 group-hover:bg-white group-hover:scale-110 transition-transform shadow-sm group-hover:shadow-md">
                        <Plus className="w-8 h-8 text-slate-400 group-hover:text-indigo-500" />
                    </div>
                    <span className="font-bold text-lg">새 프로젝트 시작하기</span>
                    <span className="text-xs mt-2 font-medium bg-indigo-100 text-indigo-600 px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                        빠르고 쉬운 6단계 마법사
                    </span>
                </Link>
            </div>
        </div>
    );
}

