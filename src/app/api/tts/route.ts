import { NextResponse } from 'next/server';

type VoiceConfig = {
    elevenLabsId: string;
    stability: number;
    similarity_boost: number;
    style: number;
    use_speaker_boost: boolean;
};

// --- Guaranteed Working System Voice IDs for Free Tier ---
const ENGINE = {
    SARAH: 'EXAVITQu4vr4xnSDxMaL',
    LAURA: 'FGY2WhTYpPnrIDTdsKH5',
    ALICE: 'Xb7hH8MSUJpSbSDYk0k2',
    MATILDA: 'XrExE9yKIg1WjnnlVkGX',
    JESSICA: 'cgSgspJ2msm6clMCkdW9',
    BELLA: 'hpp4J3VqNfWAUOO0d1Us',
    LILY: 'pFZP5JQG7iQjIQuC4Bku',
    ADAM: 'pNInz6obpgDQGcFmaJgB',
    BILL: 'pqHfZKP75CvOlQylNhV4',
    GEORGE: 'JBFqnCBsd6RMkjVDRZzb',
    CALLUM: 'N2lVS1w4EtoT3dr4eOWO',
    CHARLIE: 'IKne3meq5aSn9XLyUdCD',
    ROGER: 'CwhRBWXzGAHq8TQ4Fs17',
    BRIAN: 'nPczCjzI2devNBz1zQrb',
    DANIEL: 'onwK4e9ZLuTAKqWW03F9',
    LIAM: 'TX3LPaxmHKxFdv7VOQHJ',
    WILL: 'bIHbv24MWmeRgasZH58o',
    ERIC: 'cjVigY5qzO86Huf0OWal',
    CHRIS: 'iP95p4xoKVk53GoZ742B',
    RIVER: 'SAz9YHcvj6GT2YYXdXww',
    HARRY: 'SOYHLrjzK2X1ezoPC6cr'
};

const VOICE_CONFIGS: Record<string, VoiceConfig> = {
    // ===== KOREAN FEMALE (25) - Using System Engines =====
    'k1': { elevenLabsId: ENGINE.SARAH, stability: 0.6, similarity_boost: 0.8, style: 0.3, use_speaker_boost: true },
    'k2': { elevenLabsId: ENGINE.LAURA, stability: 0.4, similarity_boost: 0.7, style: 0.6, use_speaker_boost: true },
    'k3': { elevenLabsId: ENGINE.ALICE, stability: 0.7, similarity_boost: 0.8, style: 0.1, use_speaker_boost: true },
    'k4': { elevenLabsId: ENGINE.MATILDA, stability: 0.6, similarity_boost: 0.8, style: 0.2, use_speaker_boost: true },
    'k5': { elevenLabsId: ENGINE.JESSICA, stability: 0.45, similarity_boost: 0.75, style: 0.5, use_speaker_boost: true },
    'k6': { elevenLabsId: ENGINE.BELLA, stability: 0.55, similarity_boost: 0.8, style: 0.35, use_speaker_boost: true },
    'k7': { elevenLabsId: ENGINE.LILY, stability: 0.5, similarity_boost: 0.85, style: 0.45, use_speaker_boost: true },
    'k8': { elevenLabsId: ENGINE.SARAH, stability: 0.8, similarity_boost: 0.8, style: 0.1, use_speaker_boost: true }, // Variation
    'k9': { elevenLabsId: ENGINE.ALICE, stability: 0.3, similarity_boost: 0.6, style: 0.8, use_speaker_boost: true }, // Variation
    'k10': { elevenLabsId: ENGINE.JESSICA, stability: 0.65, similarity_boost: 0.8, style: 0.25, use_speaker_boost: true }, // Variation
    'k11': { elevenLabsId: ENGINE.MATILDA, stability: 0.75, similarity_boost: 0.9, style: 0.1, use_speaker_boost: true },
    'k12': { elevenLabsId: ENGINE.BELLA, stability: 0.4, similarity_boost: 0.7, style: 0.65, use_speaker_boost: true },
    'k13': { elevenLabsId: ENGINE.LILY, stability: 0.6, similarity_boost: 0.8, style: 0.2, use_speaker_boost: true },
    'k14': { elevenLabsId: ENGINE.SARAH, stability: 0.5, similarity_boost: 0.75, style: 0.55, use_speaker_boost: true },
    'k15': { elevenLabsId: ENGINE.LAURA, stability: 0.55, similarity_boost: 0.8, style: 0.4, use_speaker_boost: true },
    'k16': { elevenLabsId: ENGINE.ALICE, stability: 0.6, similarity_boost: 0.8, style: 0.3, use_speaker_boost: true },
    'k17': { elevenLabsId: ENGINE.JESSICA, stability: 0.35, similarity_boost: 0.7, style: 0.7, use_speaker_boost: true },
    'k18': { elevenLabsId: ENGINE.BELLA, stability: 0.7, similarity_boost: 0.85, style: 0.2, use_speaker_boost: true },
    'k19': { elevenLabsId: ENGINE.LILY, stability: 0.45, similarity_boost: 0.7, style: 0.5, use_speaker_boost: true },
    'k20': { elevenLabsId: ENGINE.MATILDA, stability: 0.5, similarity_boost: 0.75, style: 0.4, use_speaker_boost: true },
    'k21': { elevenLabsId: ENGINE.SARAH, stability: 0.65, similarity_boost: 0.8, style: 0.2, use_speaker_boost: true },
    'k22': { elevenLabsId: ENGINE.LAURA, stability: 0.4, similarity_boost: 0.8, style: 0.6, use_speaker_boost: true },
    'k23': { elevenLabsId: ENGINE.ALICE, stability: 0.8, similarity_boost: 0.9, style: 0.05, use_speaker_boost: true },
    'k24': { elevenLabsId: ENGINE.JESSICA, stability: 0.5, similarity_boost: 0.8, style: 0.45, use_speaker_boost: true },
    'k25': { elevenLabsId: ENGINE.BELLA, stability: 0.6, similarity_boost: 0.85, style: 0.3, use_speaker_boost: true },

    // ===== KOREAN MALE (25) - Using System Engines =====
    'k26': { elevenLabsId: ENGINE.ADAM, stability: 0.6, similarity_boost: 0.8, style: 0.4, use_speaker_boost: true },
    'k27': { elevenLabsId: ENGINE.BILL, stability: 0.75, similarity_boost: 0.9, style: 0.15, use_speaker_boost: true },
    'k28': { elevenLabsId: ENGINE.GEORGE, stability: 0.5, similarity_boost: 0.8, style: 0.4, use_speaker_boost: true },
    'k29': { elevenLabsId: ENGINE.CALLUM, stability: 0.55, similarity_boost: 0.8, style: 0.35, use_speaker_boost: true },
    'k30': { elevenLabsId: ENGINE.CHARLIE, stability: 0.65, similarity_boost: 0.85, style: 0.2, use_speaker_boost: true },
    'k31': { elevenLabsId: ENGINE.ROGER, stability: 0.6, similarity_boost: 0.8, style: 0.3, use_speaker_boost: true },
    'k32': { elevenLabsId: ENGINE.BRIAN, stability: 0.7, similarity_boost: 0.9, style: 0.2, use_speaker_boost: true },
    'k33': { elevenLabsId: ENGINE.DANIEL, stability: 0.6, similarity_boost: 0.8, style: 0.3, use_speaker_boost: true },
    'k34': { elevenLabsId: ENGINE.LIAM, stability: 0.4, similarity_boost: 0.75, style: 0.55, use_speaker_boost: true },
    'k35': { elevenLabsId: ENGINE.WILL, stability: 0.55, similarity_boost: 0.8, style: 0.4, use_speaker_boost: true },
    'k36': { elevenLabsId: ENGINE.ERIC, stability: 0.65, similarity_boost: 0.85, style: 0.25, use_speaker_boost: true },
    'k37': { elevenLabsId: ENGINE.CHRIS, stability: 0.5, similarity_boost: 0.8, style: 0.45, use_speaker_boost: true },
    'k38': { elevenLabsId: ENGINE.RIVER, stability: 0.6, similarity_boost: 0.8, style: 0.3, use_speaker_boost: true },
    'k39': { elevenLabsId: ENGINE.HARRY, stability: 0.3, similarity_boost: 0.7, style: 0.8, use_speaker_boost: true },
    'k40': { elevenLabsId: ENGINE.ADAM, stability: 0.8, similarity_boost: 0.9, style: 0.1, use_speaker_boost: true }, // Variation
    'k41': { elevenLabsId: ENGINE.BILL, stability: 0.6, similarity_boost: 0.8, style: 0.35, use_speaker_boost: true },
    'k42': { elevenLabsId: ENGINE.GEORGE, stability: 0.7, similarity_boost: 0.85, style: 0.2, use_speaker_boost: true },
    'k43': { elevenLabsId: ENGINE.CALLUM, stability: 0.45, similarity_boost: 0.75, style: 0.6, use_speaker_boost: true },
    'k44': { elevenLabsId: ENGINE.CHARLIE, stability: 0.5, similarity_boost: 0.8, style: 0.5, use_speaker_boost: true },
    'k45': { elevenLabsId: ENGINE.ROGER, stability: 0.45, similarity_boost: 0.7, style: 0.55, use_speaker_boost: true },
    'k46': { elevenLabsId: ENGINE.BRIAN, stability: 0.65, similarity_boost: 0.85, style: 0.3, use_speaker_boost: true },
    'k47': { elevenLabsId: ENGINE.DANIEL, stability: 0.5, similarity_boost: 0.8, style: 0.45, use_speaker_boost: true },
    'k48': { elevenLabsId: ENGINE.LIAM, stability: 0.35, similarity_boost: 0.7, style: 0.75, use_speaker_boost: true },
    'k49': { elevenLabsId: ENGINE.WILL, stability: 0.6, similarity_boost: 0.85, style: 0.3, use_speaker_boost: true },
    'k50': { elevenLabsId: ENGINE.ERIC, stability: 0.7, similarity_boost: 0.8, style: 0.2, use_speaker_boost: true },

    // ===== ENGLISH (10) =====
    'e1': { elevenLabsId: ENGINE.ROGER, stability: 0.6, similarity_boost: 0.8, style: 0.3, use_speaker_boost: true },
    'e2': { elevenLabsId: ENGINE.SARAH, stability: 0.7, similarity_boost: 0.85, style: 0.2, use_speaker_boost: true },
    'e3': { elevenLabsId: ENGINE.GEORGE, stability: 0.55, similarity_boost: 0.8, style: 0.4, use_speaker_boost: true },
    'e4': { elevenLabsId: ENGINE.ALICE, stability: 0.65, similarity_boost: 0.8, style: 0.3, use_speaker_boost: true },
    'e5': { elevenLabsId: ENGINE.MATILDA, stability: 0.7, similarity_boost: 0.85, style: 0.25, use_speaker_boost: true },
    'e6': { elevenLabsId: ENGINE.JESSICA, stability: 0.45, similarity_boost: 0.75, style: 0.55, use_speaker_boost: true },
    'e7': { elevenLabsId: ENGINE.ADAM, stability: 0.6, similarity_boost: 0.8, style: 0.4, use_speaker_boost: true },
    'e8': { elevenLabsId: ENGINE.BILL, stability: 0.8, similarity_boost: 0.85, style: 0.15, use_speaker_boost: true },
    'e9': { elevenLabsId: ENGINE.CALLUM, stability: 0.4, similarity_boost: 0.75, style: 0.6, use_speaker_boost: true },
    'e10': { elevenLabsId: ENGINE.LILY, stability: 0.55, similarity_boost: 0.85, style: 0.45, use_speaker_boost: true },
};

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { text, voiceId, language } = body;

        console.log(`[TTS] voiceId=${voiceId}, lang=${language}, model=multilingual_v2`);

        const apiKey = process.env.ELEVENLABS_API_KEY;
        if (!apiKey) {
            return NextResponse.json({ error: "ELEVENLABS_API_KEY missing" }, { status: 401 });
        }

        const config = VOICE_CONFIGS[voiceId] || VOICE_CONFIGS['k1'];

        const response = await fetch(
            `https://api.elevenlabs.io/v1/text-to-speech/${config.elevenLabsId}`,
            {
                method: 'POST',
                headers: {
                    'Accept': 'audio/mpeg',
                    'Content-Type': 'application/json',
                    'xi-api-key': apiKey,
                },
                body: JSON.stringify({
                    text: text,
                    // Use multilingual_v2 for best free tier support
                    model_id: 'eleven_multilingual_v2',
                    voice_settings: {
                        stability: config.stability,
                        similarity_boost: config.similarity_boost,
                        style: config.style,
                        use_speaker_boost: config.use_speaker_boost,
                    },
                }),
            }
        );

        if (!response.ok) {
            const errorText = await response.text();
            console.error('[TTS] Error:', response.status, errorText);
            return NextResponse.json({ error: errorText }, { status: response.status });
        }

        const audioBuffer = await response.arrayBuffer();
        return new NextResponse(audioBuffer, {
            headers: { 'Content-Type': 'audio/mpeg' },
        });

    } catch (error) {
        console.error('[TTS] Error:', error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
