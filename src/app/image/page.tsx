'use client';

import React, { useState, useRef, useEffect } from 'react';
import TopMenu from '@/components/shared/TopMenu';
import {
    Sparkles,
    Settings,
    LayoutTemplate,
    Grid2X2,
    Clock,
    Image as ImageIcon,
    Video,
    User,
    PenTool,
    Plus,
    Search,
    ChevronDown,
    Wand2,
    RefreshCw,
    Maximize2,
    X,
    Upload,
    RotateCw,
    Move,
    Camera,
    Download,
    Cloud,
    Check,
    Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';

// --- Types & Data for Look Creator ---
const LOOK_TABS = ['COLOR GRADING', 'LENS & LIGHTING'];

type Preset = {
    id: string;
    title: string;
    desc: string;
    category: 'COLOR GRADING' | 'LENS & LIGHTING';
    image: string;
};

const PRESETS: Preset[] = [
    // --- COLOR GRADING ---
    { id: 'cinestill', title: 'CineStill 800T', desc: '도시의 야경, 네온 사인에 붉은 할레이션 효과', category: 'COLOR GRADING', image: 'https://images.unsplash.com/photo-1555685812-4b943f3db990?w=500&q=80' },
    { id: 'fuji', title: 'Fuji Superia 400', desc: '차분한 녹색조와 마젠타의 조화, 필름 감성', category: 'COLOR GRADING', image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500&q=80' },
    { id: 'kodachrome', title: 'Environment 160', desc: '다큐멘터리 스타일의 자연스러운 색감', category: 'COLOR GRADING', image: 'https://images.unsplash.com/photo-1533158388470-9a56699990c6?w=500&q=80' },
    { id: 'gotham', title: 'Gotham Noir', desc: '짙은 그림자와 높은 대비, 느와르 영화 스타일', category: 'COLOR GRADING', image: 'https://images.unsplash.com/photo-1542281286-9e0a16bb7366?w=500&q=80' },
    { id: 'lovely', title: 'Lovely Green', desc: '싱그러운 초록과 맑은 피부톤 표현', category: 'COLOR GRADING', image: 'https://images.unsplash.com/photo-1526661706240-a35940c61845?w=500&q=80' },
    { id: 'luxury', title: 'Luxury High Key', desc: '밝고 화사한 화이트 톤의 럭셔리 광고 느낌', category: 'COLOR GRADING', image: 'https://images.unsplash.com/photo-1505238680356-667503444316?w=500&q=80' },
    { id: 'moody', title: 'Moody Blue', desc: '새벽녘의 차갑고 고독한 푸른빛', category: 'COLOR GRADING', image: 'https://images.unsplash.com/photo-1502421897707-ca97027296f3?w=500&q=80' },
    { id: 'golden', title: 'Golden Hour', desc: '해질녘의 따스하고 감성적인 황금빛', category: 'COLOR GRADING', image: 'https://images.unsplash.com/photo-1472120435266-53107fd0c44a?w=500&q=80' },
    { id: 'vintage', title: 'Vintage Fade', desc: '빛바랜 사진첩 속 추억 같은 느낌', category: 'COLOR GRADING', image: 'https://images.unsplash.com/photo-1707572798604-03714b2cb5d2?w=500&q=80' },
    { id: 'neon', title: 'Neon Tech', desc: '사이버펑크 스타일의 강렬한 네온 컬러', category: 'COLOR GRADING', image: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=500&q=80' },
    { id: 'bleach', title: 'Bleach Bypass', desc: '채도를 낮추고 대비를 높인 거친 전쟁 영화 룩', category: 'COLOR GRADING', image: 'https://images.unsplash.com/photo-1595180470216-92887b4117b4?w=500&q=80' },
    { id: 'ektar', title: 'Ektar 100', desc: '선명하고 진득한 색감의 풍경 사진용', category: 'COLOR GRADING', image: 'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=500&q=80' },
    // --- LENS & LIGHTING ---
    { id: 'helios', title: 'Helios 44 Swirl', desc: '소용돌이 보케의 빈티지 소련 렌즈 효과', category: 'LENS & LIGHTING', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&q=80' },
    { id: 'rembrandt', title: 'Rembrandt Lighting', desc: '성스러운 명암대비의 클래식 포트레이트', category: 'LENS & LIGHTING', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=500&q=80' },
    { id: 'rim', title: 'Rim Backlight', desc: '피사체 외곽을 빛내는 극적인 역광', category: 'LENS & LIGHTING', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&q=80' },
    { id: 'butterfly', title: 'Butterfly Lighting', desc: '헐리우드 스타들의 뷰티 포트레이트 조명', category: 'LENS & LIGHTING', image: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=500&q=80' },
    { id: 'split', title: 'Split Lighting', desc: '얼굴을 반으로 나누는 강렬한 흑백 대비', category: 'LENS & LIGHTING', image: 'https://images.unsplash.com/photo-1504257432389-52343af06ae3?w=500&q=80' },
    { id: 'blueflare', title: 'Anamorphic Blue', desc: 'SF 영화 같은 수평 파란 플레어', category: 'LENS & LIGHTING', image: 'https://images.unsplash.com/photo-1621217646399-6f1763784157?w=500&q=80' },
    { id: 'amberflare', title: 'Anamorphic Amber', desc: '따뜻한 감성의 수평 엠버 플레어', category: 'LENS & LIGHTING', image: 'https://images.unsplash.com/photo-1532971578332-9446d32c525f?w=500&q=80' },
    { id: 'cctv', title: 'CCTV Security Cam', desc: '거친 노이즈, 보안 카메라 시점', category: 'LENS & LIGHTING', image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=500&q=80' },
];

const SidebarItem = ({ icon: Icon, label, active = false, onClick }: { icon: any, label?: string, active?: boolean, onClick?: () => void }) => (
    <div
        onClick={onClick}
        className={cn(
            "flex flex-col items-center justify-center p-3 rounded-xl cursor-pointer transition-all gap-1 group w-16 h-16 min-h-[4rem]",
            active ? "bg-slate-800 text-yellow-400" : "text-slate-500 hover:text-slate-300 hover:bg-slate-800/50"
        )}
    >
        <Icon className={cn("w-6 h-6", active && "fill-current")} />
        {label && <span className="text-[10px] font-medium">{label}</span>}
    </div>
);

const modes = [
    { id: 'image', label: 'IMAGE' },
    { id: 'video', label: 'VIDEO' },
    { id: 'avatar', label: 'AVATAR' },
    { id: 'modify', label: 'MODIFY' },
];

// --- Types & Data for Angle Creator ---
type AngleParams = {
    pan: number;
    tilt: number;
    distance: number;
};

const ANGLE_PRESETS = [
    { label: '정면', pan: 0, tilt: 0 },
    { label: '뒷면', pan: 180, tilt: 0 },
    { label: '좌 45°', pan: -45, tilt: 0 },
    { label: '우 45°', pan: 45, tilt: 0 },
    { label: '좌측 90°', pan: -90, tilt: 0 },
    { label: '우측 90°', pan: 90, tilt: 0 },
    { label: '하이 앵글', pan: 0, tilt: 35 },
    { label: '로우 앵글', pan: 0, tilt: -35 },
    { label: '항공샷', pan: 0, tilt: 85 },
    { label: '웜아이', pan: 0, tilt: -85 },
];

export default function AIImagePage() {
    const [activeSidebar, setActiveSidebar] = useState('creation'); // 'creation' | 'look' | 'angle'
    const [selectedLookTab, setSelectedLookTab] = useState('COLOR GRADING');
    const [selectedPreset, setSelectedPreset] = useState<string | null>(null);

    const [selectedMode, setSelectedMode] = useState('image');
    const [prompt, setPrompt] = useState('');

    // Angle States
    const [sourceImage, setSourceImage] = useState<string | null>(null);
    const [angleParams, setAngleParams] = useState<AngleParams>({ pan: 0, tilt: 0, distance: 1 });
    const [isGeneratingAngle, setIsGeneratingAngle] = useState(false);
    const [generatedAngleImage, setGeneratedAngleImage] = useState<string | null>(null);

    // Camera Control Interaction Refs
    const sphereRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const lastMousePos = useRef({ x: 0, y: 0 });

    const filteredPresets = PRESETS.filter(p => p.category === selectedLookTab);

    const handleMockUpload = () => {
        setSourceImage("https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&q=80");
        setGeneratedAngleImage(null); // Reset generated on new upload
    };

    // --- 3D Sphere Interaction Logic ---
    const handleMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true);
        lastMousePos.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging) return;
        const deltaX = e.clientX - lastMousePos.current.x;
        const deltaY = e.clientY - lastMousePos.current.y;
        lastMousePos.current = { x: e.clientX, y: e.clientY };

        setAngleParams(prev => {
            let newPan = prev.pan + deltaX * 0.5;
            let newTilt = prev.tilt - deltaY * 0.5;
            newTilt = Math.max(-90, Math.min(90, newTilt));
            if (newPan > 180) newPan -= 360;
            if (newPan < -180) newPan += 360;
            return { ...prev, pan: newPan, tilt: newTilt };
        });
    };

    useEffect(() => {
        const handleGlobalMouseUp = () => setIsDragging(false);
        window.addEventListener('mouseup', handleGlobalMouseUp);
        return () => window.removeEventListener('mouseup', handleGlobalMouseUp);
    }, []);

    // --- Generate Angle Function (Mock) ---
    const handleGenerateAngle = () => {
        if (!sourceImage) return;
        setIsGeneratingAngle(true);

        // Mock API Call delay
        setTimeout(() => {
            setIsGeneratingAngle(false);
            // Simulate that the rotated view is now "baked" into a new image
            // In a real app, this would be the URL from the backend
            setGeneratedAngleImage(sourceImage);
            // Also logic to save to Supabase would happen here
        }, 2000); // 2 second generation sim
    };


    return (
        <div className="flex flex-col h-screen bg-[#0a0a0a] text-slate-200 font-sans overflow-hidden">
            <TopMenu />

            <div className="flex flex-1 relative h-[calc(100vh-64px)] overflow-hidden">
                {/* 1. Left Sidebar */}
                <aside className="w-20 border-r border-slate-800 flex flex-col items-center py-6 gap-2 bg-[#0a0a0a] z-50 shrink-0">
                    <SidebarItem icon={Sparkles} label="생성" active={activeSidebar === 'creation'} onClick={() => setActiveSidebar('creation')} />
                    <SidebarItem icon={LayoutTemplate} label="LOOK" active={activeSidebar === 'look'} onClick={() => setActiveSidebar('look')} />
                    <SidebarItem icon={RefreshCw} label="ANGLE" active={activeSidebar === 'angle'} onClick={() => setActiveSidebar('angle')} />
                    <div className="flex-1" />
                    <button className="p-3 text-slate-500 hover:text-slate-300 transition-colors"><Settings className="w-6 h-6" /></button>
                </aside>

                {/* 2-A. Look Creator Panel */}
                {activeSidebar === 'look' && (
                    <div className="w-[400px] bg-[#0a0a0a] border-r border-slate-800 flex flex-col h-full shrink-0 animate-in slide-in-from-left-5 duration-200 z-40">
                        {/* Header */}
                        <div className="h-16 flex items-center px-6 border-b border-white/5 justify-between">
                            <div className="flex items-center gap-2">
                                <div className="p-1.5 rounded-full bg-yellow-500/10 text-yellow-500"><LayoutTemplate className="w-4 h-4" /></div>
                                <div><h2 className="text-sm font-bold text-slate-100">Look Creator</h2><p className="text-[10px] text-slate-500">클릭 한 번으로 시네마틱 컬러 그레이딩 적용</p></div>
                            </div>
                            <button onClick={() => setActiveSidebar('creation')} className="text-slate-500 hover:text-slate-300"><X className="w-4 h-4" /></button>
                        </div>
                        {/* Tabs & Grid */}
                        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                            <div className="flex bg-[#1a1a1a] rounded-lg p-1 mb-4">
                                {LOOK_TABS.map(tab => (
                                    <button key={tab} onClick={() => setSelectedLookTab(tab)} className={cn("flex-1 py-2 text-[10px] font-bold rounded-md transition-all", selectedLookTab === tab ? "bg-[#2a2a2a] text-slate-100 shadow-sm" : "text-slate-500 hover:text-slate-300")}>{tab}</button>
                                ))}
                            </div>
                            <div className="grid grid-cols-2 gap-3 pb-20">
                                {filteredPresets.map((preset) => (
                                    <div key={preset.id} onClick={() => setSelectedPreset(preset.id)} className={cn("group relative aspect-[16/9] rounded-lg overflow-hidden cursor-pointer border-2 transition-all", selectedPreset === preset.id ? "border-yellow-500 shadow-[0_0_15px_-3px_rgba(234,179,8,0.3)]" : "border-transparent hover:border-white/20")}>
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={preset.image} alt={preset.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                                        <div className="absolute inset-x-0 bottom-0 p-3 pt-6"><p className={cn("text-[11px] font-bold truncate transition-colors mb-0.5", selectedPreset === preset.id ? "text-yellow-500" : "text-white")}>{preset.title}</p></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* 2-B. Angle Creator Panel */}
                {activeSidebar === 'angle' && (
                    <div className="w-[400px] bg-[#0a0a0a] border-r border-slate-800 flex flex-col h-full shrink-0 animate-in slide-in-from-left-5 duration-200 z-40">
                        {/* Header */}
                        <div className="h-16 flex items-center px-6 border-b border-white/5 justify-between">
                            <div className="flex items-center gap-2">
                                <div className="p-1.5 rounded-full bg-yellow-500/10 text-yellow-500"><RefreshCw className="w-4 h-4" /></div>
                                <div><h2 className="text-sm font-bold text-slate-100">CineAngle Pro</h2><p className="text-[10px] text-slate-500">다양한 앵글 이미지 생성</p></div>
                            </div>
                            <button onClick={() => setActiveSidebar('creation')} className="text-slate-500 hover:text-slate-300"><X className="w-4 h-4" /></button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar flex flex-col gap-6">
                            {/* Source Image */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-500">소스 이미지</label>
                                {sourceImage ? (
                                    <div className="relative aspect-video rounded-lg overflow-hidden border border-white/10 group">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={sourceImage} className="w-full h-full object-cover opacity-80" alt="Source" />
                                        <button onClick={() => { setSourceImage(null); setGeneratedAngleImage(null); }} className="absolute top-2 right-2 p-1 bg-black/50 rounded-full text-slate-300 hover:text-white"><X className="w-3 h-3" /></button>
                                    </div>
                                ) : (
                                    <button onClick={handleMockUpload} className="w-full h-24 rounded-lg border border-white/10 border-dashed bg-[#1a1a1a] flex flex-col items-center justify-center gap-1 hover:bg-[#222] transition-colors"><Upload className="w-4 h-4 text-slate-500" /><span className="text-[10px] text-slate-500">이미지 업로드</span></button>
                                )}
                            </div>

                            {/* 3D Wireframe Sphere */}
                            <div className="space-y-4">
                                <label className="text-[10px] font-bold text-slate-500">카메라 앵글</label>
                                <div
                                    className="w-full aspect-square bg-[#080808] rounded-2xl border border-white/5 relative flex items-center justify-center overflow-hidden cursor-move select-none"
                                    ref={sphereRef}
                                    onMouseDown={handleMouseDown}
                                    onMouseMove={handleMouseMove}
                                    onMouseUp={() => setIsDragging(false)}
                                    onMouseLeave={() => setIsDragging(false)}
                                    style={{ perspective: '300px' }}
                                >
                                    {/* 3D Container - Rotates with state */}
                                    <div
                                        className="w-[200px] h-[200px] relative transition-transform duration-75 ease-out"
                                        style={{ transformStyle: 'preserve-3d', transform: `rotateX(${-angleParams.tilt}deg) rotateY(${angleParams.pan}deg)` }}
                                    >
                                        <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-purple-500 rounded-full -translate-x-1/2 -translate-y-1/2 shadow-[0_0_10px_#a855f7]" />
                                        {[0, 45, 90, 135].map(deg => (<div key={deg} className="absolute inset-0 rounded-full border border-slate-700/40" style={{ transform: `rotateY(${deg}deg)` }} />))}
                                        <div className="absolute inset-0 rounded-full border border-slate-600/60" style={{ transform: 'rotateX(90deg)' }} />
                                        <div className="absolute top-[25%] left-[2.5%] right-[2.5%] bottom-[25%] rounded-full border border-slate-800/30" style={{ transform: 'rotateX(90deg) scale(0.86)' }} />

                                        {/* Floating Camera Icon on Surface */}
                                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center" style={{ transform: `translateZ(100px)` }}>
                                            <div className="w-8 h-8 rounded-full border border-white/20 bg-black/50 backdrop-blur-sm flex items-center justify-center"><ImageIcon className="w-4 h-4 text-slate-500" /></div>
                                        </div>
                                    </div>
                                    <div className="absolute bottom-4 right-4 pointer-events-none"><div className="w-8 h-8 rounded-full bg-slate-800 border border-white/20 flex items-center justify-center shadow-lg"><Camera className="w-4 h-4 text-white" /></div></div>
                                    <div className="absolute top-2 left-2 pointer-events-none text-[9px] text-slate-600 font-mono">ROT: {Math.round(angleParams.pan)} / {Math.round(angleParams.tilt)}</div>
                                </div>
                            </div>

                            {/* Sliders */}
                            <div className="space-y-4">
                                <div className="space-y-1">
                                    <div className="flex justify-between text-[10px] uppercase font-bold text-slate-400"><span>Pan</span><span className="text-yellow-500">{Math.round(angleParams.pan)}°</span></div>
                                    <input type="range" min="-180" max="180" value={angleParams.pan} onChange={(e) => setAngleParams(prev => ({ ...prev, pan: Number(e.target.value) }))} className="w-full h-1.5 bg-slate-800 rounded-full appearance-none cursor-pointer accent-yellow-500" />
                                </div>
                                <div className="space-y-1">
                                    <div className="flex justify-between text-[10px] uppercase font-bold text-slate-400"><span>Tilt</span><span className="text-yellow-500">{Math.round(angleParams.tilt)}°</span></div>
                                    <input type="range" min="-90" max="90" value={angleParams.tilt} onChange={(e) => setAngleParams(prev => ({ ...prev, tilt: Number(e.target.value) }))} className="w-full h-1.5 bg-slate-800 rounded-full appearance-none cursor-pointer accent-yellow-500" />
                                </div>
                                <div className="space-y-1">
                                    <div className="flex justify-between text-[10px] uppercase font-bold text-slate-400"><span>Distance</span><span className="text-yellow-500">{angleParams.distance.toFixed(1)}</span></div>
                                    <input type="range" min="0.5" max="2" step="0.1" value={angleParams.distance} onChange={(e) => setAngleParams(prev => ({ ...prev, distance: Number(e.target.value) }))} className="w-full h-1.5 bg-slate-800 rounded-full appearance-none cursor-pointer accent-yellow-500" />
                                </div>
                            </div>

                            {/* Presets */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-500">앵글 프리셋</label>
                                <div className="grid grid-cols-2 gap-2">
                                    {ANGLE_PRESETS.map((p) => (
                                        <button key={p.label} onClick={() => setAngleParams({ pan: p.pan, tilt: p.tilt, distance: 1 })} className="py-2.5 rounded-lg bg-[#1f1f1f] hover:bg-[#2a2a2a] border border-white/5 text-[10px] font-bold text-slate-400 hover:text-slate-200 transition-colors">{p.label}</button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Bottom Action */}
                        <div className="p-4 border-t border-white/5 bg-[#0a0a0a]">
                            <button
                                onClick={handleGenerateAngle}
                                disabled={!sourceImage || isGeneratingAngle}
                                className={cn(
                                    "w-full py-3 rounded-xl text-xs font-black flex items-center justify-center gap-2 transition-all",
                                    isGeneratingAngle
                                        ? "bg-slate-800 text-slate-400 cursor-not-allowed"
                                        : "bg-[#FFB800] hover:bg-[#FFC83D] text-black active:translate-y-0.5"
                                )}
                            >
                                {isGeneratingAngle ? (
                                    <>
                                        <Loader2 className="w-3 h-3 animate-spin" />
                                        생성 중...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="w-3 h-3 fill-black" />
                                        앵글 생성 (1크레딧)
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                )}


                {/* 3. Main Canvas Area */}
                <main className="flex-1 relative flex flex-col bg-black overflow-hidden z-0">

                    {/* Angle 3D Preview Mode */}
                    {activeSidebar === 'angle' ? (
                        <div className="flex-1 relative flex items-center justify-center overflow-hidden bg-[#050505] perspective-1000">
                            {/* 3D Grid Floor */}
                            <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
                                <div
                                    className="w-[200%] h-[200%] absolute top-[-50%] left-[-50%]"
                                    style={{
                                        backgroundSize: '40px 40px',
                                        backgroundImage: 'linear-gradient(to right, #333 1px, transparent 1px), linear-gradient(to bottom, #333 1px, transparent 1px)',
                                        transform: `rotateX(60deg) translateY(${angleParams.distance * 50}px) rotateZ(${angleParams.pan / 5}deg)`,
                                        transformOrigin: 'center center'
                                    }}
                                />
                            </div>

                            {sourceImage ? (
                                <div className="relative">
                                    {/* 3D PREVIEW (Shown before generation) */}
                                    {!generatedAngleImage && !isGeneratingAngle && (
                                        <div
                                            className="relative transition-all duration-100 ease-out shadow-2xl"
                                            style={{
                                                transform: `scale(${angleParams.distance}) rotateY(${angleParams.pan}deg) rotateX(${angleParams.tilt * -1}deg)`,
                                                transformStyle: 'preserve-3d'
                                            }}
                                        >
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img src={sourceImage} className="max-w-[600px] max-h-[600px] object-contain shadow-2xl rounded-sm opacity-80" alt="3D Preview" />
                                            <div className="absolute inset-0 border-2 border-yellow-500/50 rounded-sm pointer-events-none" />
                                            <div className="absolute top-4 left-4 px-2 py-1 bg-black/60 backdrop-blur    rounded text-[10px] text-yellow-500 font-bold border border-yellow-500/20">PREVIEW MODE</div>
                                        </div>
                                    )}

                                    {/* GENERATING STATE */}
                                    {isGeneratingAngle && (
                                        <div className="flex flex-col items-center justify-center gap-4">
                                            <div className="w-16 h-16 rounded-full border-4 border-yellow-500/30 border-t-yellow-500 animate-spin" />
                                            <p className="text-sm font-bold text-yellow-500 animate-pulse">AI가 새로운 앵글을 그리는 중...</p>
                                        </div>
                                    )}

                                    {/* COMPLETED RESULT (Simulated Result) */}
                                    {generatedAngleImage && (
                                        <div className="flex flex-col items-center gap-4 animate-in zoom-in-95 duration-300">
                                            <div className="relative shadow-2xl shadow-purple-500/20 rounded-lg overflow-hidden border border-white/10 group">
                                                {/* For demo, we just show the original image but implying it's new. In reality this would be the new URL */}
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img src={generatedAngleImage} className="max-w-[600px] max-h-[600px] object-contain" alt="Generated Result" />

                                                {/* Result Actions Overlay */}
                                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 backdrop-blur-sm">
                                                    <button className="flex flex-col items-center gap-2 text-white hover:text-yellow-500 transition-colors">
                                                        <div className="p-3 rounded-full bg-white/10 hover:bg-white/20"><Download className="w-6 h-6" /></div>
                                                        <span className="text-xs font-bold">다운로드</span>
                                                    </button>
                                                    <button className="flex flex-col items-center gap-2 text-white hover:text-yellow-500 transition-colors">
                                                        <div className="p-3 rounded-full bg-white/10 hover:bg-white/20"><Cloud className="w-6 h-6" /></div>
                                                        <span className="text-xs font-bold">클라우드 저장</span>
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2 text-green-500 text-xs font-bold bg-green-500/10 px-4 py-2 rounded-full border border-green-500/20">
                                                <Check className="w-3 h-3" />
                                                <span>성공적으로 생성되었습니다 (Supabase 자동 저장)</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                /* Default Upload Prompt */
                                <div className="flex flex-col items-center justify-center gap-6 opacity-60 z-10">
                                    <div className="w-20 h-20 rounded-3xl bg-[#1a1a1a] border border-white/10 flex items-center justify-center shadow-lg animate-pulse"><RefreshCw className="w-8 h-8 text-slate-500" /></div>
                                    <p className="text-sm text-slate-400">소스 이미지를 업로드하여 각도를 조절해보세요</p>
                                    <button onClick={handleMockUpload} className="px-6 py-3 rounded-full bg-[#FFB800] text-black text-xs font-bold hover:bg-[#FFC83D] transition-colors flex items-center gap-2"><Upload className="w-3.5 h-3.5" />의상 불러오기</button>
                                </div>
                            )}
                        </div>
                    ) : (
                        /* Default / Look Creator View - Kept same */
                        <div className="flex-1 flex items-center justify-center relative p-8">
                            {/* ... (Existing Look Creator View Logic - Kept same) ... */}
                            {(!selectedPreset) ? (
                                <div className="flex flex-col items-center justify-center gap-6 opacity-80">
                                    <div className="w-20 h-20 rounded-3xl bg-[#1a1a1a] border border-white/10 flex items-center justify-center shadow-lg"><ImageIcon className="w-8 h-8 text-slate-500" /></div>
                                    <div className="text-center space-y-2"><p className="text-sm text-slate-400">소스 이미지를 드래그하거나 아래 버튼으로 선택하세요</p></div>
                                    <div className="flex gap-3">
                                        <button className="px-5 py-2.5 rounded-full bg-[#1a1a1a] border border-yellow-500/30 text-yellow-500 text-xs font-bold hover:bg-yellow-500/10 transition-colors flex items-center gap-2"><Upload className="w-3.5 h-3.5" />내 PC 불러오기</button>
                                        <button className="px-5 py-2.5 rounded-full bg-[#1a1a1a] border border-white/10 text-slate-400 text-xs font-bold hover:bg-white/5 transition-colors flex items-center gap-2"><Upload className="w-3.5 h-3.5" />업로드 스토리지</button>
                                    </div>
                                </div>
                            ) : (
                                <div className="relative w-full max-w-5xl aspect-video bg-[#111] rounded-lg overflow-hidden shadow-2xl border border-white/5 animate-in fade-in duration-500 group">
                                    {selectedPreset && (() => {
                                        const p = PRESETS.find(p => p.id === selectedPreset);
                                        if (!p) return null;
                                        return (
                                            <>
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img src={p.image} alt="Preview" className="w-full h-full object-cover opacity-90" />
                                                <div className="absolute bottom-6 left-6 px-4 py-2 bg-black/80 backdrop-blur-md rounded-full border border-white/10 flex items-center gap-2 shadow-lg"><div className="w-2.5 h-2.5 rounded-full bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.5)]" /><span className="text-xs font-bold text-slate-200">{p.title}</span></div>
                                                <button onClick={() => setSelectedPreset(null)} className="absolute top-4 right-4 bg-black/50 p-2 rounded-full text-slate-300 hover:text-white hover:bg-black/70 transition-all opacity-0 group-hover:opacity-100"><X className="w-5 h-5" /></button>
                                            </>
                                        );
                                    })()}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Bottom Floating Control Panel - Show only in Creation Mode */}
                    {activeSidebar === 'creation' && ( /* ... Kept same ... */
                        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-full max-w-4xl px-4 z-30 animate-in slide-in-from-bottom-10 fade-in duration-300">
                            <div className="bg-[#141414] border border-white/10 rounded-[2rem] p-5 shadow-2xl backdrop-blur-xl ring-1 ring-white/5">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-2">
                                        <button className="flex items-center gap-2 bg-[#1f1f1f] hover:bg-[#2a2a2a] px-4 py-2 rounded-full border border-white/5 text-xs font-bold text-slate-300 transition-all group"><div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 animate-pulse" /><span>HyperReal Pro</span><ChevronDown className="w-3 h-3 text-slate-500 group-hover:text-slate-300" /></button>
                                        <button className="flex items-center gap-2 bg-[#1f1f1f] hover:bg-[#2a2a2a] px-4 py-2 rounded-full border border-white/5 text-xs font-bold text-slate-300 transition-all gap-1.5"><Maximize2 className="w-3 h-3" /><span>1K · 16:9</span></button>
                                    </div>
                                    <div className="bg-[#1f1f1f] rounded-full p-1 flex items-center border border-white/5">{modes.map((mode) => (<button key={mode.id} onClick={() => setSelectedMode(mode.id)} className={cn("px-5 py-1.5 rounded-full text-[10px] font-bold transition-all", selectedMode === mode.id ? "bg-[#2a2a2a] text-yellow-500 shadow-sm" : "text-slate-500 hover:text-slate-300")}>{mode.label}</button>))}</div>
                                    <div className="w-20"></div>
                                </div>
                                <div className="flex items-center gap-3 mb-4">
                                    <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1f1f1f] hover:bg-[#2a2a2a] text-[10px] font-bold text-slate-400 border border-white/5 transition-colors group"><span className="bg-white/10 px-1.5 py-0.5 rounded text-[9px] group-hover:bg-white/20">MAIN</span><ImageIcon className="w-3.5 h-3.5" /></button>
                                    <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1f1f1f] hover:bg-[#2a2a2a] text-[10px] font-bold text-slate-400 border border-white/5 transition-colors group"><span className="bg-white/10 px-1.5 py-0.5 rounded text-[9px] group-hover:bg-white/20">REF</span><Grid2X2 className="w-3.5 h-3.5" /></button>
                                </div>
                                <div className="flex items-end gap-3">
                                    <div className="flex-1 bg-[#1f1f1f] rounded-2xl p-4 min-h-[5rem] border border-white/5 focus-within:border-white/10 focus-within:bg-[#252525] transition-all relative group">
                                        <div className="absolute top-4 left-4"><Wand2 className="w-4 h-4 text-slate-600 group-focus-within:text-yellow-500 transition-colors" /></div>
                                        <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="상상하는 장면을 묘사해보세요..." className="w-full h-full bg-transparent border-none focus:ring-0 text-slate-200 text-sm placeholder:text-slate-600 pl-8 resize-none py-0 leading-relaxed font-medium" rows={2} />
                                        <div className="absolute bottom-3 right-3 flex items-center gap-2"><button className="p-1.5 rounded-lg hover:bg-white/10 text-slate-500 transition-colors"><Wand2 className="w-3.5 h-3.5" /></button><button className="p-1.5 rounded-lg hover:bg-white/10 text-slate-500 transition-colors"><Settings className="w-3.5 h-3.5" /></button></div>
                                    </div>
                                    <div className="flex flex-col gap-2 min-w-[140px]">
                                        <button className="w-full py-2 rounded-xl bg-[#1f1f1f] hover:bg-[#2a2a2a] text-slate-400 text-xs font-bold border border-white/5 transition-colors flex items-center justify-center gap-2"><Clock className="w-3 h-3" />LOOK</button>
                                        <button className="w-full py-3.5 rounded-xl bg-[#FFB800] hover:bg-[#FFC83D] active:translate-y-0.5 text-black text-sm font-black shadow-lg shadow-orange-500/10 transition-all flex items-center justify-center gap-2"><span>GENERATE</span><div className="flex items-center gap-1 bg-black/10 px-1.5 py-0.5 rounded text-[10px]"><Sparkles className="w-2.5 h-2.5 fill-black" /><span>4 크레딧</span></div></button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
