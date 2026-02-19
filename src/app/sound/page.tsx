'use client';

import React, { useState, useEffect } from 'react';
import TopMenu from '@/components/shared/TopMenu';
import {
    Search, Star, Play, Pause, Mic, Music, Settings, Clock,
    ChevronRight, Plus, AudioLines, MessageSquare,
    FileText, AudioWaveform, Loader2, History, Sliders, Zap,
    MoreHorizontal, Download, Trash2, Volume2, ChevronDown
} from 'lucide-react';
import { cn } from '@/lib/utils';

// --- Shared Types ---
type ViewType = 'library' | 'speech';

type Voice = {
    id: string;
    name: string;
    description: string;
    avatar: string;
    tags: string[];
    gender: 'Male' | 'Female';
    language: string;
};

// ====================================================================
// RESTORED FULL 60 PERSONAS
// ====================================================================
const VOICES: Voice[] = [
    // Korean Female (1-25)
    { id: 'k1', name: '가란', description: '전장을 누비며 목소리마저 굳어버린 노련한 퇴역 여장군', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Garan', tags: ['거친', '묵직한', '연륜있는'], gender: 'Female', language: 'Korean' },
    { id: 'k2', name: '서연', description: '에너지 넘치는 목소리로 완판을 이끄는 전문 쇼호스트', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Seoyeon', tags: ['발랄한', '빠른', '설득력있는'], gender: 'Female', language: 'Korean' },
    { id: 'k3', name: '수진', description: '아이들의 눈높이에서 꿈과 희망을 들려주는 순수한 동화 구연가', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sujin', tags: ['순수한', '다정한', '동화같은'], gender: 'Female', language: 'Korean' },
    { id: 'k4', name: '유진', description: '차분하고 논리적인 어조로 깊이 있는 통찰을 전하는 지식 유튜버', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Yujin', tags: ['지적인', '차분한', '신뢰감있는'], gender: 'Female', language: 'Korean' },
    { id: 'k5', name: '미라', description: '신비롭고 몽환적인 분위기를 자아내는 매혹적인 타로 점술가', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mirra', tags: ['신비로운', '매혹적인', '중저음'], gender: 'Female', language: 'Korean' },
    { id: 'k6', name: '나영', description: '범죄자들을 압도하는 카리스마를 가진 베테랑 여형사', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Nayoung', tags: ['터프한', '카리스마', '단호한'], gender: 'Female', language: 'Korean' },
    { id: 'k7', name: '지수', description: '상냥하고 친절한 미소로 손님을 맞이하는 백화점 안내원', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jisu', tags: ['친절한', '정중한', '하이톤'], gender: 'Female', language: 'Korean' },
    { id: 'k8', name: '혜수', description: '냉철하고 예리한 시선으로 사건의 핵심을 짚는 시사 앵커', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Hyesu', tags: ['냉철한', '전문적인', '깔끔한'], gender: 'Female', language: 'Korean' },
    { id: 'k9', name: '소연', description: '상큼하고 발랄하게 게임 속 정보를 전달하는 게임 캐스터', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Soyeon', tags: ['활기찬', '경쾌한', '귀여운'], gender: 'Female', language: 'Korean' },
    { id: 'k10', name: '원희', description: '오랜 세월의 지혜와 따스함을 간직한 푸근한 욕쟁이 할머니', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Wonhee', tags: ['푸근한', '걸탈한', '사투리'], gender: 'Female', language: 'Korean' },
    { id: 'k11', name: '은비', description: '사랑스러운 애교로 시청자의 마음을 녹이는 인기 스트리머', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Eunbi', tags: ['애교섞인', '비음', '러블리'], gender: 'Female', language: 'Korean' },
    { id: 'k12', name: '하윤', description: '편안하고 따스한 목소리로 밤을 지켜주는 라디오 DJ', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Hayun', tags: ['감성적인', '편안한', '다정한'], gender: 'Female', language: 'Korean' },
    { id: 'k13', name: '선우', description: '무미건조하지만 완벽하게 업무를 처리하는 AI 비서', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sunwoo', tags: ['기계적인', '무감정한', '정확한'], gender: 'Female', language: 'Korean' },
    { id: 'k14', name: '윤아', description: '화려한 무대 위에서 당당함을 잃지 않는 독설가 패션 에디터', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Yuna', tags: ['까칠한', '도도한', '세련된'], gender: 'Female', language: 'Korean' },
    { id: 'k15', name: '민정', description: '수줍음이 많지만 노래할 때만큼은 진심을 다하는 소녀', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Minjung', tags: ['수줍은', '맑은', '청순한'], gender: 'Female', language: 'Korean' },
    { id: 'k16', name: '보라', description: '클럽의 열기를 주도하는 에너제틱한 여성 DJ', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bora', tags: ['힙한', '허스키', '자신감'], gender: 'Female', language: 'Korean' },
    { id: 'k17', name: '진희', description: '기업의 위기를 정면으로 돌파하는 강인한 여사장', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jinhee', tags: ['무거운', '단호한', '위엄있는'], gender: 'Female', language: 'Korean' },
    { id: 'k18', name: '가을', description: '문학적인 감수성으로 시를 읊는 듯한 나레이터', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Gaeul', tags: ['차분한', '우아한', '깊은'], gender: 'Female', language: 'Korean' },
    { id: 'k19', name: '초롱', description: '호기심 가득한 질문을 던지는 명랑한 유치원생', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Chorong', tags: ['하이톤', '천진난만한', '빠른'], gender: 'Female', language: 'Korean' },
    { id: 'k20', name: '해인', description: '바다의 자유로움을 사랑하는 서핑 강사', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Haein', tags: ['시원시원한', '건강한', '밝은'], gender: 'Female', language: 'Korean' },
    { id: 'k21', name: '정원', description: '식물들과 대화하듯 조근조근 이야기하는 정원사', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jungwon', tags: ['소박한', '평화로운', '나긋나긋한'], gender: 'Female', language: 'Korean' },
    { id: 'k22', name: '소담', description: '정성껏 요리한 음식을 설명해주는 요리 전문가', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sodam', tags: ['부드러운', '설득력있는', '온화한'], gender: 'Female', language: 'Korean' },
    { id: 'k23', name: '여진', description: '도서관의 정적을 깨지 않으려 조심스럽게 말하는 사서', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Yeojin', tags: ['속삭이는', '작은목소리', '차분한'], gender: 'Female', language: 'Korean' },
    { id: 'k24', name: '다은', description: '아픈 마음을 어루만지는 따스한 심리 클리닉 원장', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Daeun', tags: ['공감하는', '안정적인', '다정한'], gender: 'Female', language: 'Korean' },
    { id: 'k25', name: '세리', description: '비행기에서의 편안함을 약속하는 수석 승무원', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Seri', tags: ['정중한', '미소섞인', '전문적인'], gender: 'Female', language: 'Korean' },

    // Korean Male (26-50)
    { id: 'k26', name: '강철', description: '어떤 난관도 뚫고 나가는 강인한 의지의 특전사 장교', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Kangcheol', tags: ['단호한', '패기넘치는', '울림있는'], gender: 'Male', language: 'Korean' },
    { id: 'k27', name: '동석', description: '묵직한 주먹만큼이나 위협적인 중저음의 조직 보스', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Dongsuk', tags: ['거친', '위협적인', '중저음'], gender: 'Male', language: 'Korean' },
    { id: 'k28', name: '민우', description: '여심을 자극하는 감미롭고 부드러운 목소리의 카페 바리스타', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Minwoo', tags: ['감미로운', '달콤한', '부드러운'], gender: 'Male', language: 'Korean' },
    { id: 'k29', name: '성준', description: '신뢰감 있는 목소리로 소식을 전하는 저녁 뉴스 앵커', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sungjun', tags: ['신뢰감있는', '전문적인', '깔끔한'], gender: 'Male', language: 'Korean' },
    { id: 'k30', name: '대호', description: '투박하지만 정이 넘치는 부산 사나이 시장 상인', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Daeho', tags: ['활기찬', '투박한', '사투리'], gender: 'Male', language: 'Korean' },
    { id: 'k31', name: '진수', description: '안경 너머 지적인 매력이 넘치는 츤데레 대학 교수', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jinsu', tags: ['지적인', '까칠한', '냉철한'], gender: 'Male', language: 'Korean' },
    { id: 'k32', name: '태오', description: '자유로운 영혼을 가진 길거리 버스킹 아티스트', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Teao', tags: ['매력적인', '허스키', '트렌디'], gender: 'Male', language: 'Korean' },
    { id: 'k33', name: '병구', description: '동네 어디에나 있을 법한 친근하고 유쾌한 백수 형', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Byunggu', tags: ['유쾌한', '친근한', '코믹한'], gender: 'Male', language: 'Korean' },
    { id: 'k34', name: '찬영', description: '풋풋한 첫사랑의 설렘을 간직한 고등학교 농구부 주장', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Chanyoung', tags: ['청량한', '소년미', '맑은'], gender: 'Male', language: 'Korean' },
    { id: 'k35', name: '용식', description: '순박하고 일편단심인 시골 청년 매력의 순경', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Yongsik', tags: ['순박한', '어수룩한', '사투리'], gender: 'Male', language: 'Korean' },
    { id: 'k36', name: '서준', description: '냉정하지만 내 여자에게는 따뜻한 재벌 3세 본부장', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Seojun', tags: ['무게감있는', '세련된', '중저음'], gender: 'Male', language: 'Korean' },
    { id: 'k37', name: '명석', description: '사건의 실마리를 찾기 위해 밤낮없이 뛰는 베테랑 형사', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mungsuk', tags: ['터프한', '걸탈한', '단호한'], gender: 'Male', language: 'Korean' },
    { id: 'k38', name: '바다', description: '낚시의 즐거움을 온몸으로 표현하는 활기찬 어부', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bada', tags: ['호탕한', '우렁찬', '활기찬'], gender: 'Male', language: 'Korean' },
    { id: 'k39', name: '지후', description: '비오는 날 창가에서 책을 읽어주는 듯한 차분한 분위기의 남성', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jihu', tags: ['감성적인', '차분한', '부드러운'], gender: 'Male', language: 'Korean' },
    { id: 'k40', name: '박부장', description: '매일 아침 등산복을 입고 출근하는 꼰대(?) 부장님', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Park', tags: ['꼰대같은', '중년', '현실적인'], gender: 'Male', language: 'Korean' },
    { id: 'k41', name: '이박사', description: '복잡한 이론을 쉽게 설명해주는 친절한 과학 전문가', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lee', tags: ['전문적인', '신뢰감있는', '지적인'], gender: 'Male', language: 'Korean' },
    { id: 'k42', name: '김코치', description: '회원들의 한계를 끌어올리는 열정 넘치는 헬스 트레이너', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=KimCoach', tags: ['열정적인', '우렁찬', '단호한'], gender: 'Male', language: 'Korean' },
    { id: 'k43', name: '최기사', description: '라디오를 들으며 밤거리를 달리는 베테랑 택시 기사', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Choi', tags: ['친근한', '연륜있는', '투박한'], gender: 'Male', language: 'Korean' },
    { id: 'k44', name: '수혁', description: '다크한 과거를 숨긴 냉혈한 킬러', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Suhyuk', tags: ['냉혈한', '낮은목소리', '짧은말씨'], gender: 'Male', language: 'Korean' },
    { id: 'k45', name: '건우', description: '꿈을 향해 정진하는 노력파 아이돌 연습생', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Geonwoo', tags: ['미성', '밝은', '성실한'], gender: 'Male', language: 'Korean' },
    { id: 'k46', name: '만수', description: '로또 1등을 꿈꾸는 복권방 단골 아저씨', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mansu', tags: ['코믹한', '어리숙한', '친근한'], gender: 'Male', language: 'Korean' },
    { id: 'k47', name: '도진', description: '자신의 요리에 완벽을 기하는 까칠한 미슐랭 셰프', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Dojin', tags: ['날카로운', '전문적인', '까칠한'], gender: 'Male', language: 'Korean' },
    { id: 'k48', name: '태양', description: '아이들에게 웃음을 전해주는 열정 넘치는 키즈 유튜버', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Taeyang', tags: ['하이톤', '열정적인', '유치한'], gender: 'Male', language: 'Korean' },
    { id: 'k49', name: '정훈', description: '한 자락의 시로 영혼을 위로하는 고독한 문학가', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Junghun', tags: ['우울한', '깊은', '나긋나긋한'], gender: 'Male', language: 'Korean' },
    { id: 'k50', name: '한울', description: '지구를 지키는 용기 있는 영웅 주인공', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Hanul', tags: ['자신감넘치는', '단단한', '정의로운'], gender: 'Male', language: 'Korean' },

    // English (1-10)
    { id: 'e1', name: 'Oliver', description: 'A friendly and clear narrator for audiobooks.', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Oliver', tags: ['narrative', 'clean', 'soft'], gender: 'Male', language: 'English' },
    { id: 'e2', name: 'Sophia', description: 'An elegant and professional voice for presentations.', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sophia', tags: ['business', 'elegant', 'formal'], gender: 'Female', language: 'English' },
    { id: 'e3', name: 'Jack', description: 'A high-energy sports commentator style.', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jack', tags: ['energetic', 'loud', 'vibrant'], gender: 'Male', language: 'English' },
    { id: 'e4', name: 'Emma', description: 'A young and cheerful voice for kids animations.', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma', tags: ['cheerful', 'high-pitched', 'cute'], gender: 'Female', language: 'English' },
    { id: 'e5', name: 'Harry', description: 'A wise and deep-toned elderly professor.', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Harry', tags: ['wisdom', 'deep', 'slow'], gender: 'Male', language: 'English' },
    { id: 'e6', name: 'Mia', description: 'A mysterious and seductive voice for dramas.', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mia', tags: ['mysterious', 'sexy', 'whispering'], gender: 'Female', language: 'English' },
    { id: 'e7', name: 'Leo', description: 'A confident corporate leader for tech announcements.', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Leo', tags: ['confident', 'neutral', 'tech'], gender: 'Male', language: 'English' },
    { id: 'e8', name: 'Chloe', description: 'A trendy and fast-talking lifestyle influencer.', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Chloe', tags: ['trendy', 'fast', 'social'], gender: 'Female', language: 'English' },
    { id: 'e9', name: 'Noah', description: 'A calm and meditative yoga instructor.', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Noah', tags: ['zen', 'relaxing', 'breathy'], gender: 'Male', language: 'English' },
    { id: 'e10', name: 'Lily', description: 'A kind and empathetic customer support agent.', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=LilyVoice', tags: ['kind', 'helpful', 'professional'], gender: 'Female', language: 'English' },
];

export default function AISoundPage() {
    // --- Common States ---
    const [view, setView] = useState<ViewType>('speech');
    const [myVoiceIds, setMyVoiceIds] = useState<Set<string>>(new Set());
    const [selectedVoice, setSelectedVoice] = useState<Voice | null>(null);
    const [playingId, setPlayingId] = useState<string | null>(null);

    // --- Speech Editor States ---
    const [text, setText] = useState('');
    const [model, setModel] = useState<'v3' | 'flash'>('flash');
    const [settings, setSettings] = useState({
        stability: 0.5,
        similarity: 0.75,
        style: 0.3,
        speed: 1.0
    });
    const [isGenerating, setIsGenerating] = useState(false);
    const [history, setHistory] = useState<any[]>([]);

    // --- Library States ---
    const [searchQuery, setSearchQuery] = useState('');

    // --- MongoDB Persistence ---
    useEffect(() => {
        // Load on mount
        const loadSelections = async () => {
            try {
                const res = await fetch('/api/voice-selection?userId=default_user');
                if (res.ok) {
                    const data = await res.json();
                    if (data.myVoiceIds) {
                        setMyVoiceIds(new Set(data.myVoiceIds));
                    }
                    if (data.lastSelectedVoiceId) {
                        const voice = VOICES.find(v => v.id === data.lastSelectedVoiceId);
                        if (voice) setSelectedVoice(voice);
                    }
                }
            } catch (e) { console.error('Failed to load selections', e); }
        };
        loadSelections();
    }, []);

    const saveSelections = async (ids: string[], lastId?: string) => {
        try {
            await fetch('/api/voice-selection', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: 'default_user',
                    myVoiceIds: ids,
                    lastSelectedVoiceId: lastId
                })
            });
        } catch (e) { console.error('Failed to save selections', e); }
    };

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
                    language: selectedVoice.language
                }),
            });
            if (res.ok) {
                const blob = await res.blob();
                const url = URL.createObjectURL(blob);
                const newItem = {
                    id: Date.now().toString(),
                    text: text.substring(0, 30) + '...',
                    voiceName: selectedVoice?.name || 'Unknown',
                    url,
                    timestamp: new Date().toLocaleTimeString()
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
                        <span className="text-[9px] font-bold">음성 변환</span>
                    </button>

                    <div className="mt-auto">
                        <button className="text-slate-600 hover:text-slate-400 transition-colors">
                            <Settings className="w-5 h-5" />
                        </button>
                    </div>
                </aside>

                {view === 'speech' ? (
                    // ====================================================================
                    // SPEECH EDITOR VIEW
                    // ====================================================================
                    <div className="flex-1 flex overflow-hidden">

                        {/* Settings Sidebar */}
                        <aside className="w-[300px] bg-[#0d0d0d] border-r border-white/5 flex flex-col shrink-0 p-6 overflow-y-auto custom-scrollbar">
                            <h2 className="text-lg font-bold text-white mb-1">음성 변환</h2>
                            <p className="text-[11px] text-slate-500 font-bold mb-8 uppercase tracking-widest">Text to Speech Editor</p>

                            <div className="space-y-8">
                                {/* Sliders */}
                                <div className="space-y-6">
                                    {[
                                        { label: '안정감', key: 'stability', min: 0, max: 1, step: 0.1 },
                                        { label: '유사도', key: 'similarity', min: 0, max: 1, step: 0.1 },
                                        { label: '속도', key: 'speed', min: 0.5, max: 2, step: 0.1 },
                                    ].map((s) => (
                                        <div key={s.key} className="space-y-3">
                                            <div className="flex justify-between items-center">
                                                <label className="text-[10px] font-black text-slate-500 uppercase">{s.label}</label>
                                                <span className="text-[10px] font-mono text-cyan-500">{(settings as any)[s.key]}</span>
                                            </div>
                                            <input
                                                type="range"
                                                min={s.min}
                                                max={s.max}
                                                step={s.step}
                                                value={(settings as any)[s.key]}
                                                onChange={(e) => setSettings({ ...settings, [s.key]: parseFloat(e.target.value) })}
                                                className="w-full h-1 bg-[#1a1a1a] rounded-lg appearance-none cursor-pointer accent-cyan-500"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </aside>

                        {/* Main Editor Canvas */}
                        <main className="flex-1 bg-[#050505] flex flex-col relative overflow-hidden">
                            {/* Header - Acting Cast (ONLY Starring Voices) */}
                            <div className="h-20 shrink-0 flex items-center justify-between px-10 border-b border-white/5 bg-[#080808]">
                                <div className="flex-1 flex flex-col justify-center">
                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-tighter mb-2">Acting Cast Members</p>
                                    <div className="flex items-center gap-3 overflow-x-auto no-scrollbar py-1">
                                        <button
                                            onClick={() => setView('library')}
                                            className="w-8 h-8 rounded-full border border-dashed border-white/20 flex items-center justify-center hover:border-cyan-500/50 hover:bg-cyan-500/10 transition-all shrink-0"
                                        >
                                            <Plus size={14} className="text-slate-500" />
                                        </button>

                                        <div className="h-4 w-px bg-white/10 mx-1 shrink-0" />

                                        {/* 
                                            CRITICAL: This list ONLY shows voices that were selected (starred) 
                                            in the Voice Library menu.
                                        */}
                                        {VOICES.filter(v => myVoiceIds.has(v.id)).map(voice => (
                                            <button
                                                key={voice.id}
                                                onClick={() => {
                                                    setSelectedVoice(voice);
                                                    saveSelections(Array.from(myVoiceIds), voice.id);
                                                }}
                                                className={cn(
                                                    "flex items-center gap-2 pl-1.5 pr-4 py-1.5 rounded-full border transition-all shrink-0",
                                                    selectedVoice?.id === voice.id
                                                        ? "bg-cyan-500/20 border-cyan-500/50 text-white shadow-[0_4px_12px_rgba(6,182,212,0.15)]"
                                                        : "bg-[#141414] border-white/5 text-slate-500 hover:border-white/20"
                                                )}
                                            >
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img src={voice.avatar} alt="" className="w-5 h-5 rounded-full" />
                                                <span className="text-[11px] font-black">{voice.name}</span>
                                            </button>
                                        ))}

                                        {myVoiceIds.size === 0 && (
                                            <div className="flex items-center gap-2">
                                                <p className="text-[11px] text-red-500/70 font-bold italic py-1">보이스 메뉴에서 성우를 먼저 캐스팅해주세요</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Text Input Area */}
                            <div className="flex-1 flex flex-col p-10 pt-8">
                                <div className="mb-4 flex items-center gap-2">
                                    <div className="p-1.5 bg-cyan-500/20 rounded-lg">
                                        <MessageSquare className="w-4 h-4 text-cyan-400" />
                                    </div>
                                    <h2 className="text-sm font-black text-white tracking-tight uppercase">
                                        {selectedVoice ? `${selectedVoice.name}의 대사 입력` : '성우 선택 대기 중...'}
                                    </h2>
                                </div>

                                <div className={cn(
                                    "flex-1 relative group rounded-2xl border transition-all p-8 flex flex-col",
                                    !selectedVoice ? "bg-[#080808] border-white/5 border-dashed" : "bg-[#0d0d0d] border-white/5 focus-within:border-cyan-500/30 shadow-2xl shadow-black/50"
                                )}>
                                    <textarea
                                        placeholder={selectedVoice ? `${selectedVoice.name} 목소리로 변환할 내용을 입력하세요...` : "보이스 메뉴에서 캐스팅한 성우를 상단에서 선택해야 대사 입력을 할 수 있습니다."}
                                        disabled={!selectedVoice}
                                        value={text}
                                        onChange={(e) => setText(e.target.value)}
                                        className="w-full h-full bg-transparent text-xl text-slate-200 placeholder:text-slate-800 focus:outline-none resize-none leading-relaxed font-medium"
                                    />
                                    {selectedVoice && (
                                        <div className="absolute bottom-6 right-8 flex items-center gap-4 text-[10px] font-black text-slate-600 uppercase tracking-widest">
                                            <span>{text.length} / 5000 chars</span>
                                            <div className="w-px h-3 bg-white/10" />
                                            <span>1 segment</span>
                                        </div>
                                    )}
                                </div>

                                {/* Generate Button */}
                                <div className="mt-8 flex items-center justify-between">
                                    <div className="flex items-center gap-6">
                                        <div className="flex items-center gap-2">
                                            <div className={cn("w-2 h-2 rounded-full", selectedVoice ? "bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.5)]" : "bg-slate-800")} />
                                            <span className="text-[10px] font-black text-slate-500 uppercase">Ready</span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={handleGenerate}
                                        disabled={isGenerating || !text.trim() || !selectedVoice}
                                        className={cn(
                                            "px-10 py-4 rounded-2xl font-black text-sm flex items-center gap-3 transition-all",
                                            (isGenerating || !selectedVoice || !text.trim())
                                                ? "bg-[#1a1a1a] text-slate-600 cursor-not-allowed border border-white/5"
                                                : "bg-[#FFD700] text-black hover:bg-[#FFC83D] active:scale-95 shadow-xl shadow-yellow-500/10"
                                        )}
                                    >
                                        {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Zap className="w-5 h-5 fill-current" />}
                                        {!selectedVoice ? '성우 선택 필요' : (isGenerating ? '생성 중...' : '보이스 생성')}
                                    </button>
                                </div>
                            </div>
                        </main>

                    </div>
                ) : (
                    // ====================================================================
                    // LIBRARY VIEW (CASTING AREA)
                    // ====================================================================
                    <div className="flex-1 flex flex-col bg-[#050505]">
                        <div className="h-20 shrink-0 border-b border-white/5 flex items-center justify-between px-10">
                            <div>
                                <h1 className="text-xl font-bold text-white">Voice Library</h1>
                                <p className="text-[10px] font-bold text-slate-500 uppercase">캐스팅할 성우를 선택하세요</p>
                            </div>
                            <div className="relative w-72">
                                <input
                                    type="text"
                                    placeholder="성우 검색..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full h-11 bg-[#141414] border border-white/10 rounded-xl pl-11 pr-4 text-xs text-white focus:border-cyan-500/30 transition-colors focus:outline-none"
                                />
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                            </div>
                        </div>
                        <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                {VOICES.filter(v =>
                                    v.name.includes(searchQuery) ||
                                    v.tags.some(t => t.includes(searchQuery))
                                ).map(voice => (
                                    <div
                                        key={voice.id}
                                        onClick={() => {
                                            const newSet = new Set(myVoiceIds);
                                            let lastId = selectedVoice?.id;
                                            // Toggle casting status
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
                                            "bg-[#111111] border border-white/5 rounded-2xl p-5 hover:border-cyan-500/30 transition-all cursor-pointer group relative",
                                            myVoiceIds.has(voice.id) && "border-cyan-500/40 bg-cyan-500/5"
                                        )}
                                    >
                                        <div className={cn(
                                            "absolute top-4 right-4 p-2 rounded-full transition-all",
                                            myVoiceIds.has(voice.id) ? "bg-cyan-500 text-black scale-110" : "bg-white/5 text-slate-600 group-hover:bg-white/10"
                                        )}>
                                            <Star className={cn("w-3 h-3", myVoiceIds.has(voice.id) && "fill-current")} />
                                        </div>

                                        <div className="flex items-center gap-4 mb-4">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img src={voice.avatar} alt="" className="w-12 h-12 rounded-full border border-white/10" />
                                            <div>
                                                <h3 className="font-bold text-white text-sm">{voice.name}</h3>
                                                <span className="text-[10px] text-slate-500">{voice.gender} / {voice.language}</span>
                                            </div>
                                        </div>
                                        <p className="text-[11px] text-slate-500 line-clamp-2 italic mb-4">"{voice.description}"</p>
                                        <div className="flex flex-wrap gap-1">
                                            {voice.tags.map(t => <span key={t} className="px-2 py-0.5 rounded bg-white/5 text-[9px] font-bold text-slate-400">#{t}</span>)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
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
