
'use client';

import React, { useState } from 'react';
import { useWizard } from '@/components/automation/WizardContext';
import { Bot, FileText, Loader2, Sparkles, Clock, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Step2_Script() {
    const { settings, updateSettings, setStep, setSegments } = useWizard();
    const [isGenerating, setIsGenerating] = useState(false);
    const [topicInput, setTopicInput] = useState(settings.topic || '');
    const [scriptInput, setScriptInput] = useState(settings.scriptRaw || '');

    const handleGenerate = () => {
        if (!topicInput) return;
        setIsGenerating(true);
        updateSettings({ topic: topicInput });

        // Simulate AI Delay
        setTimeout(() => {
            const fakeScript = `
${topicInput}

[Cut 1]
Opening shot: A dramatic view of the global economy board.
Narrator: "Have you heard the news? The exchange rate just hit 1,500 won."

[Cut 2]
Visual: Prices rising at a supermarket.
Narrator: "This isn't just a number. It means your coffee, gas, and groceries are about to get expensive."

[Cut 3]
Visual: Stock market crash graph.
Narrator: "Foreign investors are leaving. The market is flashing red signals everywhere."

[Cut 4]
Visual: A person looking worried at their bank account.
Narrator: "It's time to rethink your savings strategy. Cash might not be king anymore."

[Cut 5]
Visual: Gold and Dollar icons shining.
Narrator: "Experts say diversifying into dollars or gold could be your safety net."
            `;
            setScriptInput(fakeScript);
            setIsGenerating(false);
        }, 2000);
    };

    const handleNext = () => {
        updateSettings({ scriptRaw: scriptInput });
        // Parse segments from script (simple mock logic)
        // In a real app, this would be an API call to "segment" the text
        const mockSegments = [
            { id: '1', text: "Have you heard the news? The exchange rate just hit 1,500 won.", duration: 4, prompt: "A dramatic view of global economy board, red numbers", imageUrl: "/mock/news.jpg", voiceUrl: "/mock/voice1.mp3" },
            { id: '2', text: "This isn't just a number. It means your coffee, gas, and groceries are about to get expensive.", duration: 5, prompt: "Supermarket shelf with high price tags, worried shopper", imageUrl: "/mock/market.jpg", voiceUrl: "/mock/voice2.mp3" },
            { id: '3', text: "Foreign investors are leaving. The market is flashing red signals everywhere.", duration: 4, prompt: "Stock market graph crashing, red arrows down", imageUrl: "/mock/stock.jpg", voiceUrl: "/mock/voice3.mp3" },
            { id: '4', text: "It's time to rethink your savings strategy. Cash might not be king anymore.", duration: 5, prompt: "Person looking at empty wallet, worried face", imageUrl: "/mock/wallet.jpg", voiceUrl: "/mock/voice4.mp3" },
            { id: '5', text: "Experts say diversifying into dollars or gold could be your safety net.", duration: 4, prompt: "Gold bars and US dollar bills shining", imageUrl: "/mock/gold.jpg", voiceUrl: "/mock/voice5.mp3" },
        ];
        // Only set segments if empty, to avoid overwriting edits if user goes back (in a real app we'd preserve state better)
        setSegments(mockSegments);

        setStep(3);
    };

    return (
        <div className="max-w-4xl mx-auto p-8">
            <h2 className="text-2xl font-bold mb-6 text-slate-800 flex items-center gap-2">
                Step 2: Script & Story
                <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full font-medium">Powered by Gemini 3 Pro</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left: Auto Generation */}
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Topic or Keyword
                    </label>
                    <div className="relative">
                        <input
                            type="text"
                            value={topicInput}
                            onChange={(e) => setTopicInput(e.target.value)}
                            placeholder="e.g. Impact of AI on jobs..."
                            className="w-full p-4 pr-12 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm"
                        />
                        <Bot className="absolute right-4 top-4 text-slate-400 w-5 h-5" />
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-slate-500">
                            <Clock className="w-4 h-4" />
                            <span>Duration:</span>
                            <select
                                value={settings.durationPreset}
                                onChange={(e) => updateSettings({ durationPreset: Number(e.target.value) })}
                                className="bg-slate-100 border-none rounded-md py-1 px-2 text-slate-700 font-bold focus:ring-0 cursor-pointer"
                            >
                                <option value={20}>20s</option>
                                <option value={40}>40s</option>
                                <option value={60}>60s</option>
                                <option value={600}>10m (Long)</option>
                            </select>
                        </div>
                        <button
                            onClick={handleGenerate}
                            disabled={!topicInput || isGenerating}
                            className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center gap-2 shadow-md hover:shadow-lg"
                        >
                            {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                            Generate Script
                        </button>
                    </div>

                    <div className="mt-6 bg-blue-50 p-4 rounded-lg border border-blue-100 text-sm text-blue-800 flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 shrink-0" />
                        <p>
                            Gemini 3 Pro will analyze your topic and generate a structured script optimized for engagement. Limits apply for 600s videos.
                        </p>
                    </div>
                </div>

                {/* Right: Manual Edit */}
                <div className="flex flex-col h-full">
                    <label className="block text-sm font-semibold text-slate-700 mb-2 flex justify-between">
                        <span>Script Editor</span>
                        <span className="text-xs text-slate-400 font-normal">You can paste your own script here</span>
                    </label>
                    <textarea
                        value={scriptInput}
                        onChange={(e) => setScriptInput(e.target.value)}
                        placeholder="Your script will appear here..."
                        className="w-full flex-1 min-h-[300px] p-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all font-mono text-sm leading-relaxed resize-none shadow-inner"
                    />
                </div>
            </div>

            <div className="flex justify-between pt-8 mt-8 border-t border-slate-200">
                <button
                    onClick={() => setStep(1)}
                    className="text-slate-500 hover:text-slate-800 font-medium px-4 py-2"
                >
                    Back
                </button>
                <button
                    onClick={handleNext}
                    disabled={!scriptInput}
                    className="bg-black text-white px-8 py-3 rounded-lg font-bold hover:bg-slate-800 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Confirm & Next
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                </button>
            </div>
        </div>
    );
}
