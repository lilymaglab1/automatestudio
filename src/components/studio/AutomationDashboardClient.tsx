'use client';

import { useState, useEffect } from 'react';
import { Settings, PlayCircle, Plus, Sparkles, FolderOpen, Video as VideoIcon, Tv, LayoutTemplate, SquarePlay, Wand2, Trash2, Clock, ChevronRight } from 'lucide-react';
import Link from 'next/link';
// import { formatDistanceToNow } from 'date-fns'; // Removed
// import { ko } from 'date-fns/locale'; // Removed

function timeAgo(dateString: string) {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);

    if (minutes < 1) return '방금 전';
    if (minutes < 60) return `${minutes}분 전`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}시간 전`;
    const days = Math.floor(hours / 24);
    return `${days}일 전`;
}

interface Project {
    _id: string;
    title: string;
    status: 'draft' | 'completed' | 'rendering';
    step: number;
    updatedAt: string;
    thumbnail?: string;
    settings?: any;
    script?: string;
}

export default function AutomationDashboardClient() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const res = await fetch('/api/projects?userId=default_user');
                if (res.ok) {
                    const data = await res.json();
                    setProjects(data);
                }
            } catch (error) {
                console.error('Failed to fetch projects:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);

    return (
        <div className="flex-1 bg-[#09090b] text-white p-12 overflow-y-auto">
            <div className="max-w-6xl mx-auto">
                {/* Header Area */}
                <div className="flex items-center justify-between mb-12">
                    <div>
                        <h1 className="text-4xl font-black tracking-tight mb-2">내 프로젝트</h1>
                        <p className="text-gray-500 font-medium">영상 자동화 프로젝트를 관리하세요.</p>
                    </div>

                    <div className="flex gap-4">
                        <button className="flex items-center gap-2 px-5 py-3 text-gray-400 hover:text-white font-bold bg-[#1a1a1f] border border-[#27272a] rounded-2xl transition-all text-sm">
                            <Settings className="w-4 h-4" />
                            설정
                        </button>

                        <Link href="/automation/autopilot" className="flex items-center gap-2 px-6 py-3 text-[#10b981] font-bold bg-[#10b981]/10 hover:bg-[#10b981]/20 border border-[#10b981]/20 rounded-2xl transition-all text-sm group">
                            <Sparkles className="w-4 h-4 fill-[#10b981]/20" />
                            오토파일럿
                        </Link>

                        <Link href="/automation/new" className="flex items-center gap-2 px-6 py-3 text-white font-bold bg-[#6d28d9] hover:bg-[#7c3aed] rounded-2xl shadow-[0_0_20px_rgba(109,40,217,0.3)] hover:shadow-[0_0_30px_rgba(109,40,217,0.5)] transition-all text-sm transform hover:-translate-y-1">
                            <Plus className="w-4 h-4" />
                            새 프로젝트
                        </Link>
                    </div>
                </div>

                {/* Empty State / Grid */}
                {loading ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="text-gray-500">불러오는 중...</div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* Add New Project Card (Matching Image 1) */}
                        <Link href="/automation/new" className="group bg-[#09090b] border border-[#1f1f23] hover:border-[#27272a] transition-all rounded-[24px] p-8 aspect-[4/3] flex flex-col items-center justify-center cursor-pointer relative overflow-hidden">
                            <div className="w-16 h-16 rounded-full bg-[#1a1a1f] flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-[#27272a] transition-all duration-300">
                                <Plus className="w-8 h-8 text-gray-500 group-hover:text-white transition-colors" />
                            </div>

                            <span className="text-lg font-bold text-gray-500 group-hover:text-white transition-colors">새 영상 만들기</span>
                        </Link>

                        {/* Projects List */}
                        {projects.map((project) => (
                            <div key={project._id} className="group bg-[#09090b] border border-[#1f1f23] hover:border-[#27272a] transition-all rounded-[24px] overflow-hidden flex flex-col relative aspect-[4/3]">
                                <div className="p-6 flex-1 flex flex-col">
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="px-2 py-1 bg-[#1a1a1f] rounded-lg text-[10px] font-bold text-gray-400 border border-[#27272a]">
                                            {project.step >= 6 ? 'Completed' : `Step ${project.step}/6`}
                                        </span>
                                        <button className="text-gray-600 hover:text-white transition-colors">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>

                                    <h3 className="font-bold text-lg leading-snug text-gray-200 group-hover:text-white transition-colors line-clamp-3 mb-auto">
                                        {project.title || '제목 없음'}
                                    </h3>

                                    <div className="mt-6 flex items-center justify-between pt-4 border-t border-[#1f1f23]">
                                        <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
                                            <Clock className="w-3 h-3" />
                                            <span>
                                                {timeAgo(project.updatedAt)}
                                            </span>
                                        </div>
                                        <span className="text-xs text-gray-600 font-mono">
                                            {project._id.slice(-6)}
                                        </span>
                                    </div>

                                    <Link href={`/automation/${project._id}`} className="absolute bottom-6 right-6 flex items-center gap-1 text-xs font-bold text-gray-500 hover:text-white transition-colors">
                                        편집 <ChevronRight className="w-3 h-3" />
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {!loading && projects.length > 0 && (
                    <div className="mt-12 text-center">
                        <span className="text-xs font-bold text-gray-600">모든 프로젝트를 불러왔습니다</span>
                    </div>
                )}
            </div>
        </div>
    );
}

