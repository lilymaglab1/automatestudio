import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(request: Request) {
    try {
        const { prompt, ratio, style, model } = await request.json();

        // If Google Imagen is selected
        if (model === 'google-imagen') {
            const googleApiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
            if (!googleApiKey || googleApiKey === 'your_gemini_api_key_here') {
                return NextResponse.json({ error: "Google API Key is missing. Please set it in .env.local" }, { status: 401 });
            }

            // Aspect ratio mapping for Imagen 3
            let aspectRatio = "16:9";
            if (ratio === '9:16') aspectRatio = "9:16";
            if (ratio === '1:1') aspectRatio = "1:1";
            if (ratio === '3:4') aspectRatio = "3:4";

            const genAI = new GoogleGenerativeAI(googleApiKey);
            const imagenModel = genAI.getGenerativeModel({ model: "imagen-3.0-generate-001" });

            const finalPrompt = style ? `Style: ${style}. ${prompt}` : prompt;

            // Imagen using the REST API or Vertex/AI Studio format
            // NOTE: @google/generative-ai currently supports text/multimodal. 
            // Native image generation via SDK might require different REST call or beta, 
            // but assuming basic REST support or providing mock for demonstration if SDK lacks it.
            // Actually, let's use the REST endpoint manually for Imagen to be safe.

            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/imagen-4.0-generate-001:predict?key=${googleApiKey}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    instances: [
                        { prompt: finalPrompt }
                    ],
                    parameters: {
                        sampleCount: 1,
                        aspectRatio: aspectRatio,
                    }
                })
            });

            if (!response.ok) {
                const err = await response.json();

                // Specifically intercept standard Google quota / plan errors
                if (err.error?.message?.includes('paid plans') || err.error?.code === 400 || err.error?.code === 404) {
                    console.error("Imagen API Error (Possible Paid Plan Required):", err);
                    throw new Error(`Google Imagen 3 API error: ${err.error?.message || 'Access denied. Google Imagen 3 requires a paid Google AI Studio account.'}`);
                }

                throw new Error(err.error?.message || `Google API error: ${response.status}`);
            }

            const data = await response.json();
            const base64Image = data.predictions?.[0]?.bytesBase64Encoded;
            if (!base64Image) {
                throw new Error("No image data returned from Google API");
            }

            return NextResponse.json({ imageUrl: `data:image/jpeg;base64,${base64Image}` });
        }

        // Fallback to Pollinations
        const apiKey = process.env.POLLINATIONS_API_KEY;

        if (!apiKey) {
            return NextResponse.json({ error: "Pollinations API Key is missing. Please set it in .env.local" }, { status: 401 });
        }

        // Determine width and height based on ratio mapping
        let width = 1024;
        let height = 576; // 16:9 default

        if (ratio === '9:16') {
            width = 576;
            height = 1024;
        } else if (ratio === '1:1') {
            width = 1024;
            height = 1024;
        } else if (ratio === '3:4') {
            width = 768;
            height = 1024;
        }

        // Construct unique seed
        const seed = Math.floor(Math.random() * 100000000);

        // Append style to prompt if provided
        const finalPrompt = style ? `Style: ${style}. ${prompt}` : prompt;
        const encodedPrompt = encodeURIComponent(finalPrompt);

        // Default using image.pollinations.ai endpoint
        let pollinationsUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=${width}&height=${height}&seed=${seed}&nologo=true`;

        // If a specific model other than the default 'pollinations' is selected, append it
        if (model && model !== 'pollinations') {
            pollinationsUrl += `&model=${model}`;
        }

        try {
            const response = await fetch(pollinationsUrl, {
                method: 'GET'
            });

            if (!response.ok) {
                // Specific check for Pollinations 530 (Cloudflare Error 1033 / blocked)
                if (response.status === 530) {
                    throw new Error("Pollinations AI API proxy blocked (Cloudflare 1033). Please select a different image generation model or try again later.");
                }

                // If it fails with the specific model, try without the model parameter
                if (model && model !== 'pollinations') {
                    const fallbackUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=${width}&height=${height}&seed=${seed}&nologo=true`;
                    const fallbackRes = await fetch(fallbackUrl, { method: 'GET' });
                    if (!fallbackRes.ok) {
                        if (fallbackRes.status === 530) throw new Error("Pollinations AI API proxy blocked (Cloudflare 1033). Please select a different image generation model.");
                        throw new Error(`Pollinations API error: ${fallbackRes.status} ${fallbackRes.statusText}`);
                    }

                    const arrayBuffer = await fallbackRes.arrayBuffer();
                    const buffer = Buffer.from(arrayBuffer);
                    const base64Image = `data:image/jpeg;base64,${buffer.toString('base64')}`;
                    return NextResponse.json({ imageUrl: base64Image });
                }
                throw new Error(`Pollinations API error: ${response.status} ${response.statusText}`);
            }

            const arrayBuffer = await response.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            const base64Image = `data:image/jpeg;base64,${buffer.toString('base64')}`;

            return NextResponse.json({ imageUrl: base64Image });
        } catch (pollinationsError: any) {
            console.error("Pollinations API try failed:", pollinationsError);
            throw pollinationsError;
        }

    } catch (error: any) {
        console.error("Pollinations API Error:", error);
        return NextResponse.json({ error: error.message || "Failed to generate image" }, { status: 500 });
    }
}
