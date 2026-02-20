import { NextResponse } from 'next/server';
import { VOICES } from '@/lib/voice_data';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { text, voiceId } = body;

        // Find voice to determine which TTS engine to use
        const voice = VOICES.find(v => v.id === voiceId);

        // Determine Google TTS voice name
        // Map our voice IDs to Google Cloud TTS voice names
        const googleVoiceId = voice?.googleVoiceId || 'ko-KR-Neural2-A';
        const languageCode = googleVoiceId.startsWith('ko-') ? 'ko-KR' : 'en-US';

        const apiKey = process.env.GOOGLE_TTS_API_KEY;
        if (!apiKey) {
            return NextResponse.json({ error: "GOOGLE_TTS_API_KEY missing" }, { status: 401 });
        }

        console.log(`[TTS] voiceId=${voiceId}, googleVoice=${googleVoiceId}, text=${text.substring(0, 50)}...`);

        const response = await fetch(
            `https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    input: { text },
                    voice: {
                        languageCode,
                        name: googleVoiceId,
                    },
                    audioConfig: {
                        audioEncoding: 'MP3',
                        speakingRate: 1.0,
                        pitch: 0,
                        effectsProfileId: ['small-bluetooth-speaker-class-device'],
                    },
                }),
            }
        );

        if (!response.ok) {
            const errorText = await response.text();
            console.error('[TTS] Google TTS Error:', response.status, errorText);
            return NextResponse.json({ error: errorText }, { status: response.status });
        }

        const data = await response.json();
        // Google TTS returns base64-encoded audio
        const audioBuffer = Buffer.from(data.audioContent, 'base64');

        return new NextResponse(audioBuffer, {
            headers: { 'Content-Type': 'audio/mpeg' },
        });

    } catch (error) {
        console.error('[TTS] Error:', error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
