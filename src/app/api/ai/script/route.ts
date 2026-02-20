import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY || "");

export async function POST(request: Request) {
    try {
        const { topic, ratio, style } = await request.json();

        if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY === 'your_gemini_api_key_here') {
            return NextResponse.json({ error: "Gemini API Key is missing. Please set it in .env.local" }, { status: 401 });
        }

        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        // Style-specific instructions for better visual descriptions
        let styleInstruction = "";
        if (style === 'stickman') {
            styleInstruction = "Visual style is 'Cute Stickman'. All visual descriptions must involve simple black-and-white line-drawn stick figures on a clean white/paper background. Keep it minimalist, expressive, and funny.";
        } else if (style === 'real_photo') {
            styleInstruction = "Visual style is 'Hyper-realistic Photo'. Descriptions should focus on cinematic lighting, 8k resolution, and realistic human expressions.";
        } else {
            styleInstruction = `Visual style is '${style}'. Please ensure descriptions match this aesthetic.`;
        }

        const prompt = `
            You are a professional video script writer and storyboard artist. 
            Create a highly engaging video script for the following topic: "${topic}"
            Target Video Format: ${ratio}
            
            ${styleInstruction}
            
            The script should be in Korean.
            Include specific "Visual descriptions" for each segment. These descriptions will be used to generate AI images, so be descriptive.
            
            Format the response precisely as segments:
            [Segment 1]
            Visual: (Detailed image generation prompt in English)
            Text: (Narration in Korean)
            
            [Segment 2]
            ...
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        return NextResponse.json({ script: text });

    } catch (error: any) {
        console.error("Gemini Error:", error);
        return NextResponse.json({ error: error.message || "Failed to generate script" }, { status: 500 });
    }
}
