export const styles = [
    { id: 'stickman', label: '귀여운 졸라맨', desc: '초당 컷 전환 5초', preview: 'https://images.unsplash.com/photo-1620653457580-bafc093a213e?w=800&q=80' },
    { id: 'anime', label: '지브리 스타일', desc: '감성적인 셀 채색 스타일', preview: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&q=80' },
    { id: 'pixel', label: '레트로 픽셀', desc: '8비트 고전 게임 감성', preview: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=800&q=80' },
    { id: 'cyberpunk', label: '사이버펑크', desc: '미래지향적 네온 스타일', preview: 'https://images.unsplash.com/photo-1535378433864-8431764da1b2?w=800&q=80' },
    { id: 'watercolor', label: '수채화', desc: '부드러운 물감 번짐 효과', preview: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800&q=80' },
    { id: 'webtoon', label: 'K-웹툰', desc: '한국 웹툰 작화 스타일', preview: 'https://images.unsplash.com/photo-1611339555312-e607c8352fd7?w=800&q=80' },
    { id: 'horror', label: '호러/스릴러', desc: '어둡고 거친 펜 터치', preview: 'https://images.unsplash.com/photo-1509248961158-e54f6934749c?w=800&q=80' },
    { id: 'disney', label: '3D 애니', desc: '디즈니/픽사 스타일', preview: 'https://images.unsplash.com/photo-1633511090164-b43840ea1607?w=800&q=80' },
    { id: 'noir', label: '필름 느와르', desc: '흑백의 강렬한 대비', preview: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800&q=80' },
    { id: 'papercut', label: '진이 오리기', desc: '종이를 오려 붙인 듯한 느낌', preview: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=800&q=80' },
    { id: 'oil', label: '유화', desc: '두꺼운 붓터치 질감', preview: 'https://images.unsplash.com/photo-1549887552-93f8efb88132?w=800&q=80' },
    { id: 'sketch', label: '연필 스케치', desc: '사각사각 연필 드로잉', preview: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&q=80' },
    { id: 'popart', label: '팝아트', desc: '앤디 워홀 스타일', preview: 'https://images.unsplash.com/photo-1501472312651-726afe119ff1?w=800&q=80' },
    { id: 'scifi', label: 'SF 우주', desc: '광활한 우주와 메카닉', preview: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80' },
    { id: 'fantasy', label: '판타지', desc: '중세 판타지 게임풍', preview: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&q=80' },
    { id: 'isometric', label: '아이소메트릭', desc: '3D 입체 투시도', preview: 'https://images.unsplash.com/photo-1524169358666-79f22534bc6e?w=800&q=80' },
    { id: 'lowpoly', label: '로우 폴리', desc: '각진 3D 모델링', preview: 'https://images.unsplash.com/photo-1509635905149-08a6e87cb1cb?w=800&q=80' },
    { id: 'neon', label: '네온 사인', desc: '반짝이는 빛의 향연', preview: 'https://images.unsplash.com/photo-1563245372-f21724e3a8c9?w=800&q=80' },
    { id: 'vintage', label: '빈티지 레트로', desc: '7080 포스터 느낌', preview: 'https://images.unsplash.com/photo-1614730341194-75c60740a2d3?w=800&q=80' },
    { id: 'clay', label: '클레이 아트', desc: '점토 애니메이션 느낌', preview: 'https://images.unsplash.com/photo-1516961642265-531546e84af2?w=800&q=80' }
];

export const ratios = [
    { id: '16:9', label: '유튜브', sub: '16:9', iconName: 'MonitorPlay' },
    { id: '9:16', label: '쇼츠,릴스', sub: '9:16', iconName: 'Smartphone' },
    { id: '1:1', label: '인스타', sub: '1:1', iconName: 'Square' },
    { id: '3:4', label: '모바일', sub: '3:4', iconName: 'LayoutTemplate' }
];

export const videoModels = [
    { id: 'kling', label: 'Kling 1.6 (HighQ)', isPro: true },
    { id: 'minimax', label: 'Minimax (Fast)', isPro: false },
    { id: 'hailuo', label: 'Hailuo (Balanced)', isPro: true }
];

export const imageModels = [
    { id: 'midjourney', label: 'Midjourney v6', isPro: true },
    { id: 'dalle3', label: 'DALL-E 3', isPro: false },
    { id: 'stable-diffusion', label: 'Stable Diffusion XL', isPro: false },
    { id: 'flux', label: 'Flux 1.1 Pro', isPro: true },
    { id: 'ideogram', label: 'Ideogram 2.0', isPro: false }
];

// Voice Data based on user request and screenshots
export const voices = [
    // --- Featured/Character Voices (Top Row style) ---
    { id: 'garan', name: '가란', gender: 'female', lang: 'Korean', desc: '전장을 누비며 목소리마저 굳어버린 노련한 퇴역 장군', category: 'Character', tags: ['#거친', '#묵직한', '#연륜있는'], previewUrl: '' },
    { id: 'seoyeon', name: '서연', gender: 'female', lang: 'Korean', desc: '에너지 넘치는 목소리로 완판을 이끄는 전문 쇼호스트', category: 'Character', tags: ['#발랄한', '#빠른', '#설득력있는'], previewUrl: '' },
    { id: 'sujin', name: '수진', gender: 'female', lang: 'Korean', desc: '아이들의 눈높이에서 꿈과 희망을 들려주는 순수한 동화 구연가', category: 'Character', tags: ['#순수한', '#다정한', '#동화같은'], previewUrl: '' },
    { id: 'yujin', name: '유진', gender: 'female', lang: 'Korean', desc: '차분하고 논리적인 어조로 깊이 있는 통찰을 전하는 지식 유튜버', category: 'Character', tags: ['#지적인', '#차분한', '#신뢰감있는'], previewUrl: '' },

    // --- Professional Voices (from text file & screenshot) ---
    { id: 'mira', name: '미라', gender: 'female', lang: 'Korean', desc: '신비롭고 몽환적인 분위기를 자아내는 매혹적인 타로 점술가', category: 'Character', tags: ['#신비로운', '#매혹적인', '#중저음'], previewUrl: '' },
    { id: 'nayoung', name: '나영', gender: 'female', lang: 'Korean', desc: '범죄자들을 압도하는 카리스마를 가진 베테랑 형사', category: 'Character', tags: ['#단호한', '#카리스마', '#강인한'], previewUrl: '' },
    { id: 'jisoo_dept', name: '지수', gender: 'female', lang: 'Korean', desc: '상냥하고 친절한 미소로 손님을 맞이하는 백화점 안내원', category: 'Character', tags: ['#친절한', '#상냥한', '#하이톤'], previewUrl: '' },
    { id: 'haesu', name: '해수', gender: 'female', lang: 'Korean', desc: '냉철하고 예리한 시선으로 사건의 핵심을 짚는 시사 앵커', category: 'Character', tags: ['#냉철한', '#전문적인', '#깔끔한'], previewUrl: '' },

    // --- Real/Cloned Voices (High Quality) ---
    { id: '0oqpliV6dVSr9XomngOW', name: '지니 (Jini)', gender: 'female', lang: 'Korean', desc: '지적인 전문가, 차분하고 신뢰감 있는 목소리', category: 'Professional', tags: ['#전문적인', '#차분한'], previewUrl: '' },
    { id: 'F7wT70V3u09d2rY9pNa6', name: '유라 (Yura)', gender: 'female', lang: 'Korean', desc: '밝고 깨끗한 톤, 스토리텔링과 광고에 적합', category: 'Professional', tags: ['#밝은', '#깨끗한'], previewUrl: '' },
    { id: 'iWLjl1zCuqXRkW6494ve', name: '지수 (Jisoo)', gender: 'female', lang: 'Korean', desc: '초대하는 듯한, 뉴스 스타일의 명료한 목소리', category: 'Professional', tags: ['#뉴스', '#명료한'], previewUrl: '' },
    { id: 'zgDzx5jLLCqEp6Fl7Kl7', name: '한나 (Hanna)', gender: 'female', lang: 'Korean', desc: '자연스럽고 편안한, 브이로그와 내레이션', category: 'Professional', tags: ['#자연스러운', '#편안한'], previewUrl: '' },
    { id: 'AW5wrnG1jVizOYY7R1Oo', name: '지영 (Jiyoung)', gender: 'female', lang: 'Korean', desc: '따뜻하고 명료한, 친근하고 자연스러운 톤', category: 'Professional', tags: ['#따뜻한', '#친근한'], previewUrl: '' },
    { id: 'xi3rF0t7dg7uN2M0WUhr', name: '유나 (Yuna)', gender: 'female', lang: 'Korean', desc: '부드럽고 명랑한, 내레이션과 스토리텔링 전문', category: 'Professional', tags: ['#명랑한', '#스토리텔링'], previewUrl: '' },

    // --- Male Voices ---
    { id: 'LS3HmRGCXV8wxCAhUbTt', name: '동 (Dong)', gender: 'male', lang: 'Korean', desc: '따뜻하고 친근한 40대 남성, 다큐멘터리', category: 'Professional', tags: ['#따뜻한', '#중년'], previewUrl: '' },
    { id: 'aQzFKIjVemqRAhfd9est', name: '미드나잇 (Midnight)', gender: 'male', lang: 'Korean', desc: '깊고 울림이 있는 중저음, 럭셔리 브랜드', category: 'Professional', tags: ['#중저음', '#럭셔리'], previewUrl: '' },
    { id: 'm3gJBS8OofDJfycyA2Ip', name: '태형 (Taehyung)', gender: 'male', lang: 'Korean', desc: '자연스럽고 친근한 청년, 소셜 미디어', category: 'Professional', tags: ['#청년', '#자연스러운'], previewUrl: '' },
    { id: 'z2P4oCxSHhXan3ew4COv', name: '카레이 (Karaey)', gender: 'male', lang: 'Korean', desc: '차분하고 인내심 깊은 40대 남성', category: 'Professional', tags: ['#차분한', '#신뢰감'], previewUrl: '' }
];
