import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import VoiceSelection from '@/models/VoiceSelection';

export async function GET(request: Request) {
    try {
        await connectDB();
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId') || 'default_user';

        const selection = await VoiceSelection.findOne({ userId });
        return NextResponse.json(selection || { myVoiceIds: [] });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        await connectDB();
        const body = await request.json();
        const { userId, myVoiceIds, lastSelectedVoiceId } = body;

        const selection = await VoiceSelection.findOneAndUpdate(
            { userId: userId || 'default_user' },
            {
                myVoiceIds,
                lastSelectedVoiceId
            },
            { upsert: true, new: true }
        );

        return NextResponse.json(selection);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
