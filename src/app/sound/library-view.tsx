'use client';

import React, { useState, useEffect } from 'react';
import TopMenu from '@/components/shared/TopMenu';
import {
    Search, Star, Play, Pause, Mic, Music, Settings, Clock,
    ChevronRight, ChevronLeft, Plus, AudioLines, MessageSquare,
    FileText, AudioWaveform, Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';

// --- Types ---
type Voice = {
    id: string;
    name: string;
    description: string;
    avatar: string;
    tags: string[];
    gender: 'Male' | 'Female';
    language: string;
    category: 'General' | 'Narration' | 'News' | 'Character';
};

// ====================================================================
// 60 voices — Native Korean (50) + English (10)
// ====================================================================
const VOICES: Voice[] = [
    // ===== KOREAN FEMALE (25) =====
    { id: 'k1', name: '지니', description: '지적이고 따뜻한 톤, 프리미엄 다큐멘터리 내레이터', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jini', tags: ['지적인', '프리미엄', '내레이션'], gender: 'Female', language: 'Korean', category: 'Narration' },
    { id: 'k2', name: '유라', description: '톡톡 튀는 명랑한 목소리, 광고 및 유튜브 인트로에 적합', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Yura', tags: ['명랑한', '광고', '유튜브'], gender: 'Female', language: 'Korean', category: 'General' },
    { id: 'k3', name: '지수', description: '신뢰감을 주는 아나운서 톤, 뉴스 보도 및 기업 안내', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jisoo', tags: ['신뢰감', '아나운서', '뉴스'], gender: 'Female', language: 'Korean', category: 'News' },
    { id: 'k4', name: '한나', description: '평범하지만 편안한 일상 대화체, 브이로그 성우', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Hanna', tags: ['편안한', '일상', '브이로그'], gender: 'Female', language: 'Korean', category: 'General' },
    { id: 'k5', name: '지영', description: '조근조근 가르쳐주는 친절한 선생님 목소리', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jiyoung', tags: ['교육', '친절한', '설명'], gender: 'Female', language: 'Korean', category: 'Narration' },
    { id: 'k6', name: '유나', description: '활기차고 긍정적인 에너지의 게임 캐릭터 성우', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Yuna2', tags: ['활발한', '게임', '캐릭터'], gender: 'Female', language: 'Korean', category: 'Character' },
    { id: 'k7', name: '로사', description: '세련되고 우아한 오디오북 낭독 성우', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rosa', tags: ['우아한', '오디오북', '감성'], gender: 'Female', language: 'Korean', category: 'Narration' },
    { id: 'k8', name: '안나', description: '여리고 감성적인 느낌의 시 창작 내레이터', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Anna', tags: ['여린', '감성적', '시'], gender: 'Female', language: 'Korean', category: 'General' },
    { id: 'k9', name: '지나', description: '차분하고 정확한 정규 뉴스 앵커', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jina', tags: ['정확한', '앵커', '뉴스'], gender: 'Female', language: 'Korean', category: 'News' },
    { id: 'k10', name: '하나리', description: '솔직하고 당당한 20대 대학생 대화체', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=HanaLee', tags: ['당당한', '20대', '솔직'], gender: 'Female', language: 'Korean', category: 'General' },
    { id: 'k11', name: '정아', description: '마음을 치유하는 명상 가이드 음성', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=JeongAh', tags: ['명상', '치유', '평온'], gender: 'Female', language: 'Korean', category: 'Narration' },
    { id: 'k12', name: '쩡', description: '친근한 동네 언니 같은 대화 스타일', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jjeong', tags: ['친근한', '수다', '언니'], gender: 'Female', language: 'Korean', category: 'General' },
    { id: 'k13', name: '오하나', description: '차분하고 신뢰도 높은 전문 강사', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ohana2', tags: ['전문가', '신뢰', '강의'], gender: 'Female', language: 'Korean', category: 'Narration' },
    { id: 'k14', name: '미소 최', description: '밝고 긍정적인 비즈니스 발표용 톤', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=MisoChoi', tags: ['발표', '긍정적', '피치'], gender: 'Female', language: 'Korean', category: 'General' },
    { id: 'k15', name: '충만', description: '깊은 울림이 있는 고요한 명상 음성', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Chungman', tags: ['고요한', '울림', '수면'], gender: 'Female', language: 'Korean', category: 'Narration' },
    { id: 'k16', name: '서연', description: '상냥하고 친절한 고객 서비스 안내', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Seoyeon', tags: ['CS', '안내', '상냥한'], gender: 'Female', language: 'Korean', category: 'General' },
    { id: 'k17', name: '솔라', description: '경쾌하고 정보 전달이 빠른 안내 방송', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sola', tags: ['안내', '경쾌한', '정보'], gender: 'Female', language: 'Korean', category: 'General' },
    { id: 'k18', name: '슬기', description: '나른한 오후를 깨우는 감성 보이스', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Seulki', tags: ['나른한', '감성', '오후'], gender: 'Female', language: 'Korean', category: 'General' },
    { id: 'k19', name: '지안 K', description: '신뢰감을 바탕으로 한 중저음 여성 톤', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=JianK', tags: ['중저음', '신뢰', '전문적'], gender: 'Female', language: 'Korean', category: 'Narration' },
    { id: 'k20', name: '혜인', description: '품격 있는 브랜드를 위한 내레이션', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Hyein', tags: ['품격', '브랜드', '성우'], gender: 'Female', language: 'Korean', category: 'Narration' },
    { id: 'k21', name: '애니', description: '사랑스러운 동화 구연 전문가', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Annie', tags: ['동화', '사랑스러운', '아이'], gender: 'Female', language: 'Korean', category: 'Character' },
    { id: 'k22', name: '마이클', description: '정감 있는 경상도 사투리 여성', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael2', tags: ['사투리', '정감', '재미'], gender: 'Female', language: 'Korean', category: 'Character' },
    { id: 'k23', name: '써니', description: '경건한 분위기의 기도 및 낭독 음성', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=SunnyF', tags: ['경건한', '기도', '종교'], gender: 'Female', language: 'Korean', category: 'Narration' },
    { id: 'k24', name: '스텔라', description: '밝고 쾌활한 쇼핑 호스트 스타일', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Stella', tags: ['쇼핑', '활기찬', '세일즈'], gender: 'Female', language: 'Korean', category: 'General' },
    { id: 'k25', name: '셀리 한', description: '깊이 있는 문학 작품 낭독 보이스', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=SellyHan', tags: ['문학', '낭독', '깊이'], gender: 'Female', language: 'Korean', category: 'Narration' },

    // ===== KOREAN MALE (25) =====
    { id: 'k26', name: '동이', description: '40대 전라도 사투리의 친근한 아저씨', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Dong', tags: ['전라도', '아저씨', '친근'], gender: 'Male', language: 'Korean', category: 'Character' },
    { id: 'k27', name: '딥케이브', description: '동굴 속에 있는 듯한 웅장하고 깊은 저음', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Midnight', tags: ['동굴보이스', '저음', '압도적'], gender: 'Male', language: 'Korean', category: 'Narration' },
    { id: 'k28', name: '써니 M', description: '차분하고 정돈된 비즈니스 맨', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=SunnyM', tags: ['정돈된', '비즈니스', '이성적'], gender: 'Male', language: 'Korean', category: 'General' },
    { id: 'k29', name: '이호', description: '다큐멘터리의 깊은 감동을 전하는 성우', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Leeho', tags: ['다큐', '울림', '내레이터'], gender: 'Male', language: 'Korean', category: 'Narration' },
    { id: 'k30', name: '제이 킴', description: '카페 음악처럼 부드러운 감성 보이스', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=JayKim', tags: ['부드러운', '카페', '감성'], gender: 'Male', language: 'Korean', category: 'General' },
    { id: 'k31', name: '팀 한', description: '지적이고 논리적인 교수님 목소리', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Teemothy', tags: ['지적인', '강의', '논리'], gender: 'Male', language: 'Korean', category: 'Narration' },
    { id: 'k32', name: '최성우', description: '감정 연기가 탁월한 드라마 성우', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Choi', tags: ['연기', '드라마', '감정'], gender: 'Male', language: 'Korean', category: 'Character' },
    { id: 'k33', name: '대혁 윤', description: '혈기 넘치는 20대 청년 보이스', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Daehyeok', tags: ['열정', '청년', '에너지'], gender: 'Male', language: 'Korean', category: 'General' },
    { id: 'k34', name: '태형', description: '트렌디한 쇼츠 및 유머 채널용 보이스', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Taehyung2', tags: ['트렌디', '쇼츠', '유머'], gender: 'Male', language: 'Korean', category: 'Character' },
    { id: 'k35', name: '카레이', description: '인내심 깊고 중후한 신사의 목소리', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Karaey', tags: ['중후한', '신사', '무게감'], gender: 'Male', language: 'Korean', category: 'General' },
    { id: 'k36', name: '세진', description: '신뢰감을 주는 전문적인 수사관 톤', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sejoin2', tags: ['수사관', '이성적', '단호'], gender: 'Male', language: 'Korean', category: 'General' },
    { id: 'k37', name: '진우 M', description: '깔끔하고 명확한 뉴스 보도 스타일', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=JinwooM', tags: ['뉴스', '명확한', '리포트'], gender: 'Male', language: 'Korean', category: 'News' },
    { id: 'k38', name: '상호', description: '진솔한 제품 리뷰 및 테크 채널 스타일', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=SangHo', tags: ['리뷰', '테크', '진솔'], gender: 'Male', language: 'Korean', category: 'General' },
    { id: 'k39', name: '성민', description: '긍정적인 에너지가 넘치는 MC 스타일', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Seongmin', tags: ['MC', '쾌활한', '진행'], gender: 'Male', language: 'Korean', category: 'General' },
    { id: 'k40', name: '현민', description: '달콤하고 로맨틱한 목소리의 주인공', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Hyunmin', tags: ['로맨틱', '달콤한', '연애'], gender: 'Male', language: 'Korean', category: 'Character' },
    { id: 'k41', name: '준혁', description: '외교적이고 정중한 국제 회의 매너 톤', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=JunHyuk', tags: ['정중한', '외교', '공적'], gender: 'Male', language: 'Korean', category: 'General' },
    { id: 'k42', name: '진건', description: '조용히 눈을 감게 만드는 수면 유도 보이스', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=JinGeon', tags: ['수면', 'ASMR', '치유'], gender: 'Male', language: 'Korean', category: 'Narration' },
    { id: 'k43', name: '네이슨', description: '심도 깊은 대화를 나누는 팟캐스트 패널', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Nathan', tags: ['팟캐스트', '대담', '심층'], gender: 'Male', language: 'Korean', category: 'Narration' },
    { id: 'k44', name: '제이슨', description: '모든 것을 들어주는 듬직한 집사 보이스', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jason', tags: ['집사', '듬직한', '충성'], gender: 'Male', language: 'Korean', category: 'Character' },
    { id: 'k45', name: '태민 M', description: '우수에 젖은 고뇌하는 예술가 목소리', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=TaeminM', tags: ['예술가', '고뇌', '감성'], gender: 'Male', language: 'Korean', category: 'Character' },
    { id: 'k46', name: '원문', description: '감정을 억제한 냉철한 정보 요원', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Wonmoon', tags: ['냉철한', '요원', '시크'], gender: 'Male', language: 'Korean', category: 'Character' },
    { id: 'k47', name: '민준 M', description: '사이다처럼 시원시원한 해결사의 말씨', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=MinjoonM', tags: ['해결사', '직설', '시원한'], gender: 'Male', language: 'Korean', category: 'General' },
    { id: 'k48', name: '남춘 할아버지', description: '옛날 이야기를 들려주는 인자한 할아버지', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Namchun', tags: ['할아버지', '옛날이야기', '훈훈'], gender: 'Male', language: 'Korean', category: 'Character' },
    { id: 'k49', name: '준', description: '스토리에 생명을 불어넣는 내레이션 전문가', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=June', tags: ['내레이션', '스토리', '전문'], gender: 'Male', language: 'Korean', category: 'Narration' },
    { id: 'k50', name: '덕팔', description: '거친 삶의 냄새가 묻어나는 투박한 아저씨', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Deokpal', tags: ['거친', '투박한', '인간적'], gender: 'Male', language: 'Korean', category: 'Character' },

    // ===== ENGLISH (10) =====
    { id: 'e1', name: 'Roger', description: 'Casual and resonant American male', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Roger', tags: ['American', 'Casual'], gender: 'Male', language: 'English', category: 'General' },
    { id: 'e2', name: 'Sarah', description: 'Reassuring and confident female voice', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah', tags: ['Confident', 'Reassuring'], gender: 'Female', language: 'English', category: 'General' },
    { id: 'e3', name: 'George', description: 'Warm and captivating British storyteller', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=George', tags: ['British', 'Narrative'], gender: 'Male', language: 'English', category: 'Narration' },
    { id: 'e4', name: 'Alice', description: 'Engaging British female educator', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alice', tags: ['British', 'Education'], gender: 'Female', language: 'English', category: 'Narration' },
    { id: 'e5', name: 'Matilda', description: 'Professional and knowledgeable voice', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Matilda', tags: ['Professional', 'Clear'], gender: 'Female', language: 'English', category: 'General' },
    { id: 'e6', name: 'Jessica', description: 'Bright and playful young female', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jessica', tags: ['Playful', 'Energetic'], gender: 'Female', language: 'English', category: 'Character' },
    { id: 'e7', name: 'Adam', description: 'Deep and authoritative American male', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Adam', tags: ['Deep', 'Commanding'], gender: 'Male', language: 'English', category: 'General' },
    { id: 'e8', name: 'Bill', description: 'Wise and mature grandfatherly voice', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bill', tags: ['Old', 'Wise'], gender: 'Male', language: 'English', category: 'Character' },
    { id: 'e9', name: 'Callum', description: 'Husky and charismatic male creator', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Callum', tags: ['Charismatic', 'Husky'], gender: 'Male', language: 'English', category: 'Character' },
    { id: 'e10', name: 'Lily', description: 'Velvety and expressive British actress', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lily', tags: ['Actress', 'British'], gender: 'Female', language: 'English', category: 'Character' },
];

export default function AISoundPage() {
    // --- States ---
    const [activeTab, setActiveTab] = useState<'All Voices' | 'My Library'>('All Voices');
    const [favorites, setFavorites] = useState<Set<string>>(new Set());
    const [playingId, setPlayingId] = useState<string | null>(null);
    const [isPlayingLoading, setIsPlayingLoading] = useState<boolean>(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [audioElement] = useState(() => (typeof window !== 'undefined' ? new Audio() : null));

    const [filterGender, setFilterGender] = useState<'All' | 'Male' | 'Female'>('All');
    const [filterLanguage, setFilterLanguage] = useState<'All' | 'Korean' | 'English'>('All');
    const [sortOption, setSortOption] = useState<'Name' | 'Newest' | 'Popular'>('Name');

    // --- Audio Logic ---
    useEffect(() => {
        return () => { if (audioElement) { audioElement.pause(); audioElement.src = ''; } };
    }, [audioElement]);

    const handlePlaySnippet = async (id: string, text: string, lang: string) => {
        if (!audioElement) return;
        if (playingId === id) { audioElement.pause(); setPlayingId(null); setIsPlayingLoading(false); return; }
        try {
            audioElement.pause();
            setPlayingId(id);
            setIsPlayingLoading(true);
            const res = await fetch('/api/tts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text, voiceId: id, language: lang }),
            });
            if (!res.ok) {
                console.warn("API TTS Failed.");
                setIsPlayingLoading(false);
                setPlayingId(null);
                return;
            }
            const audioBlob = await res.blob();
            const audioUrl = URL.createObjectURL(audioBlob);
            audioElement.src = audioUrl;
            await new Promise((resolve) => { audioElement.onloadedmetadata = resolve; audioElement.load(); });
            audioElement.play().catch(e => console.error("Play error:", e));
            setIsPlayingLoading(false);
            audioElement.onended = () => { setPlayingId(null); URL.revokeObjectURL(audioUrl); };
        } catch (error) {
            console.error("Audio fetch error:", error);
            setPlayingId(null);
            setIsPlayingLoading(false);
        }
    };

    const toggleFavorite = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setFavorites(prev => { const next = new Set(prev); if (next.has(id)) next.delete(id); else next.add(id); return next; });
    };

    // --- 인캐릭터 연기 대본 (60개 보이스 맞춤형) ---
    const DEMO_SCRIPTS: Record<string, string> = {
        // Korean Female
        'k1': '지식은 공유될 때 그 가치를 발합니다. 오늘 여러분과 함께 나눌 주제는, 보이지 않는 세계의 질서에 대한 이야기입니다.',
        'k2': '와~ 대박! 여러분 이거 보셨어요? 완전히 새로운 스타일의 라이프가 지금 시작됩니다! 놓치지 마세요!',
        'k3': '오늘의 주요 뉴스입니다. 정부는 새로운 경제 활성화 대책을 논의했으며, 이에 따른 시장의 반응은 긍정적입니다.',
        'k4': '오늘도 제 일상에 찾아와주셔서 감사해요. 별것 없는 하루지만, 소소한 행복을 나누고 싶어요.',
        'k5': '자, 오늘은 이 공식을 함께 풀어볼까요? 천천히 따라오면 누구나 이해할 수 있어요. 힘내세요!',
        'k6': '모험은 끝난 게 아니야! 내가 너와 끝까지 함께할게. 어서 서둘러, 적들이 다가오고 있어!',
        'k7': '차가운 밤바람이 창틀을 두드리고 있었다. 그녀는 마지막 책장을 덮으며 깊은 한숨을 내쉬었다.',
        'k8': '꽃잎이 떨어지는 속도가, 마치 누군가의 고백처럼 나른해서... 나는 그 자리에 멈춰 서고 말았어요.',
        'k9': '속보를 전해드립니다. 현재 사고 현장은 수습 중에 있으며, 통행에 불편을 겪을 것으로 예상됩니다.',
        'k10': '솔직히 말씀드리면, 전 그 말에 동의하지 않아요. 제 생각은 달라요. 우린 더 나은 길을 찾아야 해요.',
        'k11': '이제 깊게 숨을 들이쉬고... 당신의 마음속에 평화가 가득 차는 것을 느껴보세요. 당신은 충분히 소중합니다.',
        'k12': '어머 어머, 그 얘기 들었어? 아니 글쎄 세상에 그런 일이 있다지 뭐야! 근데 내 말이 맞아, 그건 좀 아니지.',
        'k13': '성공적인 리더십의 핵심은 공감입니다. 자, 이번 세션에서는 효율적인 커뮤니케이션 기법을 살펴보겠습니다.',
        'k14': '안녕하십니까, 오늘 저희 기획안의 핵심은 지속 가능한 성장입니다. 저희와 함께 미래를 설계하시죠!',
        'k15': '그곳에는 오직 빛만이... 평온한 침묵만이 흐르고 있습니다. 깊은 수면 속으로 당신을 안내합니다.',
        'k16': '문의하신 내용은 확인되었습니다. 잠시만 기다려주시면 바로 해결해 드리겠습니다. 감사합니다.',
        'k17': '잠시 후 열차가 들어오오니, 승객 여러분께서는 노란색 선 뒤로 물러나 주시기 바랍니다. 감사합니다.',
        'k18': '커피 한 잔의 여유가 필요한 시간... 창밖의 풍경을 보며 잠시 감성에 젖어보는 건 어떨까요?',
        'k19': '금융 데이터 분석 결과, 현재 투자 지표는 안정적인 상향 곡선을 보이고 있습니다. 세부 내용을 보시죠.',
        'k20': '프리미엄의 완성은 디테일입니다. 당신만을 위한 고품격 라이프스타일, 지금 경험해 보세요.',
        'k21': '옛날 옛적 아주 먼 나라에, 마음씨 착한 소녀가 살고 있었어요. 소녀는 매일 아침 새들에게 노래를 불러주었답니다.',
        'k22': '아이고 마, 그래 가지고 안 된다카이! 내 말 좀 들어보소, 그래 하면 훨씬 잘 될 거구만!',
        'k23': '하늘의 축복이 여러분과 함께하시길 바랍니다. 이 경건한 시간을 통해 우리 마음이 하나 되게 하소서.',
        'k24': '자, 지금 바로 전화 주세요! 이 가격은 다시 오지 않습니다! 매진 임박! 지금이 기회입니다!',
        'k25': '문학은 삶의 비틀거림을 아름답게 기록하는 예술입니다. 오늘 소개해드릴 작품은 박완서 작가의...',

        // Korean Male
        'k26': '어이 거시기! 밥은 먹고 다니냐? 아따 오늘 날씨 겁나게 거시기 해부러잉, 안 그려?',
        'k27': '어둠이 내려앉은 이곳... 당신의 가장 깊은 본능이 깨어납니다. 피할 수 없는 진실을 마주하세요.',
        'k28': '회의록 정리 끝났습니다. 다음 프로젝트 일정은 오후 3시에 다시 공유드리겠습니다. 수고하세요.',
        'k29': '이 장엄한 자연 앞에 인간은 얼마나 작은 존재인가요. 억겁의 시간을 견뎌온 대지의 숨결을 느낍니다.',
        'k30': '이 노래 어때요? 비 오는 날, 따뜻한 라떼 한 잔 마시면서 듣기에 딱인 것 같아요.',
        'k31': '이론적으로는 가능하지만, 실무적인 한계를 고려해야 합니다. 데이터가 말해주는 진실에 집중하십시오.',
        'k32': '내가... 내가 아니라면 누가 이 자리를 지키겠어! 죽어도 난 여기서 한 발짝도 안 물러나!',
        'k33': '운동은 배신하지 않습니다! 오늘 흘린 땀방울이 내일의 당신을 만들 거예요! 마지막 한 번 더!',
        'k34': '구독, 좋아요 부탁드려요! 여러분 오늘 제가 할 얘기는 진짜 소름 돋는 실화입니다. 바로 들어갑니다!',
        'k35': '품격을 아는 남자의 선택. 시간이 흘러도 변하지 않는 가치, 클래식은 영원합니다.',
        'k36': '이의 있습니다! 피고인이 제시한 알리바이는 조작되었습니다. 결정적인 증거를 보여드리죠.',
        'k37': '방금 들어온 소식입니다. 서울 외곽 순환 고속도로에서 4중 추돌 사고가 발생해 극심한 정체를 빚고 있습니다.',
        'k38': '테크는 역시 실사용기죠. 일주일 동안 써보니까 장단점이 확실히 갈립니다. 냉정하게 리뷰해 볼게요.',
        'k39': '자~ 현장의 열기가 정말 뜨겁습니다! 우리 참가자분들 박수 한번 크게 주세요! 가즈아~!',
        'k40': '너를 보고 있으면... 세상 모든 시간이 멈춘 것 같아. 내가 널 지켜줄게, 언제까지나.',
        'k41': '양국의 우호 협력을 위해 귀한 걸음 해주셔서 감사합니다. 오늘 회담을 통해 큰 진전을 이루길 기대합니다.',
        'k42': '숲속의 빗소리가 들리나요? 토닥토닥... 당신의 지친 마음을 어루만져 드릴게요. 편히 쉬세요.',
        'k43': '이번 에피소드에서는 인공지능이 인간의 창의성을 대체할 수 있을지에 대해 깊이 있게 논의해 봅니다.',
        'k44': '주인님, 요청하신 차를 준비했습니다. 더 필요하신 것이 있다면 언제든 말씀해 주십시오.',
        'k45': '화폭에 담을 수 없는 저 슬픔... 내 붓끝이 향하는 곳은 오직 당신의 그림자뿐입니다.',
        'k46': '타겟 확인. 현재 지점에서 500미터 전방입니다. 신호 대기 후 바로 진입하겠습니다. 이상.',
        'k47': '사이다 발언 한마디 하겠습니다! 그쪽 정치가 원래 그런 겁니까? 국민들 생각 좀 하세요!',
        'k48': '우허허... 우리 손주 왔구나! 할애비가 우리 강아지 주려고 맛있는 거 많이 숨겨놨다잉.',
        'k49': '스토리는 강력한 힘을 가집니다. 당신의 브랜드에 서사를 더하는 방법, 지금 바로 공개합니다.',
        'k50': '어이C, 누가 여기서 담배 피워! 당장 안 꺼?! 하여간 요즘 젊은 애들은 예의가 없어요.',

        // English
        'e1': 'Hey there! Just chilling in the backyard. Want to join for a drink?',
        'e2': 'You can do this. I believe in you, and I\'m here to support you every step of the way.',
        'e3': 'Once upon a time, in a land beyond the clouds, there lived a dragon who breathed starlight.',
        'e4': 'Welcome to the history lesson. Today, we delve into the secrets of the ancient pyramids.',
        'e5': 'According to our quarterly reports, we have exceeded all expectations in market growth.',
        'e6': 'Oh my gosh, look at this! It\'s so cute! I totally want to take it home right now!',
        'e7': 'This is your captain speaking. We are currently cruising at an altitude of thirty thousand feet.',
        'e8': 'Sit down, child. Let me tell you about the world as it used to be, long before the machines.',
        'e9': 'What\'s up guys! Today we are testing the crazier setups ever recorded. Let\'s go!',
        'e10': 'To be, or not to be, that is the question. Whether \'tis nobler in the mind to suffer...',
    };

    const togglePlay = (id: string, description: string, language: string, e: React.MouseEvent) => {
        e.stopPropagation();
        const script = DEMO_SCRIPTS[id] || (language === 'English'
            ? 'Hello, this is a preview of my voice.'
            : '안녕하세요, 이것은 제 목소리 미리듣기입니다.');
        handlePlaySnippet(id, script, language);
    };

    // --- Filter Logic ---
    const filteredVoices = VOICES.filter(voice => {
        if (activeTab === 'My Library' && !favorites.has(voice.id)) return false;
        if (searchQuery && !voice.name.toLowerCase().includes(searchQuery.toLowerCase()) && !voice.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())) && !voice.description.toLowerCase().includes(searchQuery.toLowerCase())) return false;
        if (filterGender !== 'All' && voice.gender !== filterGender) return false;
        if (filterLanguage !== 'All' && voice.language !== filterLanguage) return false;
        return true;
    });

    return (
        <div className="flex flex-col h-screen bg-[#0a0a0a] text-slate-200 font-sans overflow-hidden">
            <TopMenu />
            <div className="flex flex-1 overflow-hidden relative">

                {/* 1. Icon Sidebar */}
                <aside className="w-[72px] bg-[#050505] border-r border-white/5 flex flex-col items-center py-6 gap-8 shrink-0 z-40">
                    <div className="flex flex-col items-center gap-1 cursor-pointer">
                        <div className="w-12 h-12 rounded-2xl flex items-center justify-center relative bg-gradient-to-br from-cyan-500/20 to-transparent">
                            <div className="absolute inset-0 bg-cyan-500/10 rounded-2xl opacity-50" />
                            <AudioLines className="w-6 h-6 text-cyan-400 relative z-10" />
                        </div>
                        <span className="text-[10px] font-bold text-cyan-400">Voices</span>
                    </div>
                    {[{ icon: MessageSquare, label: 'Speech' }, { icon: Mic, label: 'Effects' }, { icon: Music, label: 'Music' }, { icon: FileText, label: 'Transcribe' }].map(({ icon: Icon, label }) => (
                        <div key={label} className="flex flex-col items-center gap-1 cursor-pointer group opacity-60 hover:opacity-100 transition-opacity">
                            <Icon className="w-6 h-6 text-slate-400 group-hover:text-white" />
                            <span className="text-[10px] font-medium text-slate-500 group-hover:text-slate-300">{label}</span>
                        </div>
                    ))}
                </aside>

                {/* 2. Filter Sidebar */}
                <aside className="w-[300px] bg-[#0d0d0d] border-r border-white/5 flex flex-col px-5 py-6 shrink-0 overflow-y-auto">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-xl font-bold text-white leading-none">AI 성우</h2>
                            <span className="text-[11px] font-bold text-cyan-500 mt-1 block">네이티브 보이스 60</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <button className="w-8 h-8 rounded-full bg-[#1F1F1F] flex items-center justify-center hover:bg-[#2a2a2a] transition-colors"><Plus className="w-4 h-4 text-slate-400" /></button>
                        </div>
                    </div>

                    <div className="mb-8">
                        <label className="text-xs font-bold text-slate-500 mb-3 block">언어 필터</label>
                        <div className="flex bg-[#141414] rounded-full p-1 border border-white/5 h-10 items-center">
                            {(['All', 'Korean', 'English'] as const).map(l => (
                                <button key={l} onClick={() => setFilterLanguage(l)} className={cn("flex-1 h-8 rounded-full text-xs font-bold transition-all", filterLanguage === l ? "bg-[#102a30] text-cyan-400 border border-cyan-900" : "text-slate-500 hover:text-slate-300")}>
                                    {l === 'All' ? '전체' : l === 'Korean' ? '한국어' : 'English'}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="mb-6">
                        <label className="text-xs font-bold text-slate-500 mb-3 block">성별 필터</label>
                        <div className="flex bg-[#141414] rounded-full p-1 border border-white/5 h-10 items-center">
                            {(['All', 'Male', 'Female'] as const).map(g => (
                                <button key={g} onClick={() => setFilterGender(g)} className={cn("flex-1 h-8 rounded-full text-xs font-bold transition-all", filterGender === g ? "bg-[#102a30] text-cyan-400 border border-cyan-900" : "text-slate-500 hover:text-slate-300")}>
                                    {g === 'All' ? '전체' : g === 'Male' ? '남성' : '여성'}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="mb-8">
                        <label className="text-xs font-bold text-slate-500 mb-3 block">컬렉션</label>
                        <div className="flex gap-2">
                            {(['All Voices', 'My Library'] as const).map(tab => (
                                <button key={tab} onClick={() => setActiveTab(tab)} className={cn("flex-1 py-3 rounded-lg text-xs font-bold transition-all border flex items-center justify-center gap-2", activeTab === tab ? "bg-[#102a30] text-cyan-400 border-cyan-500/30" : "bg-[#1a1a1a] text-slate-500 border-transparent hover:bg-[#202020]")}>
                                    {tab === 'All Voices' ? '전체 라이브러리' : '내 보관함'}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="mt-auto p-5 rounded-2xl bg-gradient-to-br from-cyan-950/20 to-black border border-cyan-500/20">
                        <p className="text-xs font-bold text-cyan-400 mb-4">ElevenLabs v3 모델 적용 중</p>
                        <p className="text-[10px] text-slate-500 leading-relaxed mb-4">한국어 네이티브 사운드와 자연스러운 감정 표현이 지원되는 최신 모델입니다.</p>
                        <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold"><Clock className="w-3 h-3" /> 2026.02.19 업데이트</div>
                    </div>
                </aside>

                {/* 3. Main Content */}
                <main className="flex-1 flex flex-col bg-[#0a0a0a] min-w-0">
                    <div className="h-20 shrink-0 border-b border-white/5 flex items-center justify-between px-8 bg-[#0a0a0a]/50 backdrop-blur z-30">
                        <div>
                            <h1 className="text-lg font-bold text-white">Voice Selection</h1>
                            <p className="text-xs text-slate-500">필터링된 성우: {filteredVoices.length}명</p>
                        </div>
                        <div className="relative w-72">
                            <input type="text" placeholder="성우 이름, 특성, 직업 검색..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full h-11 bg-[#141414] border border-white/10 rounded-xl pl-11 pr-4 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500/30 transition-colors" />
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto px-8 py-8 custom-scrollbar bg-[radial-gradient(circle_at_50%_0%,rgba(16,42,48,0.15),transparent_50%)]">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
                            {filteredVoices.map((voice) => (
                                <div key={voice.id} className="group relative bg-[#141414] hover:bg-[#1a1a1a] border border-white/5 hover:border-cyan-500/30 rounded-2xl p-5 transition-all duration-300">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-800 border-2 border-white/5 relative bg-gradient-to-br from-slate-700 to-slate-900 shadow-xl">
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img src={voice.avatar} alt={voice.name} className="w-full h-full object-cover" />
                                                <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer" onClick={(e) => togglePlay(voice.id, voice.description, voice.language, e)}>
                                                    {playingId === voice.id && isPlayingLoading ? <Loader2 className="w-5 h-5 text-white animate-spin" />
                                                        : playingId === voice.id ? <Pause className="w-5 h-5 text-white fill-white" />
                                                            : <Play className="w-5 h-5 text-white fill-white pl-0.5" />}
                                                </div>
                                            </div>
                                            <div className="flex flex-col">
                                                <h3 className="text-sm font-bold text-white group-hover:text-cyan-400 transition-colors">{voice.name}</h3>
                                                <span className="text-[10px] text-slate-500 font-bold uppercase mt-0.5 tracking-tighter">{voice.language} {voice.gender}</span>
                                            </div>
                                        </div>
                                        <button onClick={(e) => toggleFavorite(voice.id, e)} className="p-1.5 rounded-full hover:bg-white/10 transition-colors">
                                            <Star className={cn("w-4 h-4 transition-colors", favorites.has(voice.id) ? "text-yellow-500 fill-yellow-500" : "text-slate-600")} />
                                        </button>
                                    </div>
                                    <div className="flex flex-wrap gap-1.5 mb-3">
                                        {voice.tags.slice(0, 3).map(tag => (
                                            <span key={tag} className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-950/20 text-cyan-600 border border-cyan-500/10">#{tag}</span>
                                        ))}
                                    </div>
                                    <p className="text-[11px] text-slate-400 line-clamp-2 h-8 leading-relaxed italic">"{voice.description}"</p>

                                    {playingId === voice.id && !isPlayingLoading && (
                                        <div className="mt-4 h-12 flex items-center justify-center gap-1 bg-[#0a0a0a] rounded-xl overflow-hidden px-4">
                                            {[...Array(15)].map((_, i) => (
                                                <div key={i} className="w-1 bg-cyan-500/50 rounded-full animate-pulse" style={{ height: Math.random() * 20 + 5 + 'px', animationDuration: Math.random() * 0.5 + 0.2 + 's' }} />
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
