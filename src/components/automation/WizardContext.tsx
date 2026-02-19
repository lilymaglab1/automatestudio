
'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

export type AspectRatio = '16:9' | '9:16' | '1:1' | '3:4';
export type OutputStyle = 'stickman' | 'anime' | 'infographic' | '3d' | 'cartoon' | 'movie' | 'american' | 'flat';

export interface Segment {
    id: string;
    text: string;
    duration: number; // in seconds
    prompt: string;
    imageUrl?: string;
    imageModel?: 'hyperreal' | 'seedream' | 'z-image' | 'qwen';
    voiceUrl?: string;
    videoUrl?: string; // for step 5
}

interface WizardState {
    step: number;
    settings: {
        ratio: AspectRatio;
        style: OutputStyle;
        durationPreset: number; // e.g. 20, 40, 600
        topic: string;
        scriptRaw: string;
        selectedVoice: string;
        videoModel: string; // e.g. 'seedance'
        includeSubtitles: boolean;
    };
    segments: Segment[];
}

interface WizardContextType extends WizardState {
    setStep: (step: number) => void;
    updateSettings: (newSettings: Partial<WizardState['settings']>) => void;
    setSegments: (segments: Segment[]) => void;
    updateSegment: (id: string, updates: Partial<Segment>) => void;
}

const WizardContext = createContext<WizardContextType | undefined>(undefined);

export function WizardProvider({ children }: { children: ReactNode }) {
    const [step, setStep] = useState(1);
    const [settings, setSettings] = useState<WizardState['settings']>({
        ratio: '16:9',
        style: 'stickman',
        durationPreset: 20,
        topic: '',
        scriptRaw: '',
        selectedVoice: '',
        videoModel: 'motion-v1',
        includeSubtitles: true,
    });
    const [segments, setSegments] = useState<Segment[]>([]);

    const updateSettings = (newSettings: Partial<WizardState['settings']>) => {
        setSettings(prev => ({ ...prev, ...newSettings }));
    };

    const updateSegment = (id: string, updates: Partial<Segment>) => {
        setSegments(prev => prev.map(seg => seg.id === id ? { ...seg, ...updates } : seg));
    };

    return (
        <WizardContext.Provider value={{ step, setStep, settings, updateSettings, segments, setSegments, updateSegment }}>
            {children}
        </WizardContext.Provider>
    );
}

export const useWizard = () => {
    const context = useContext(WizardContext);
    if (!context) throw new Error('useWizard must be used within a WizardProvider');
    return context;
};
