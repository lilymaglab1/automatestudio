
'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

export type AspectRatio = '16:9' | '9:16' | '1:1' | '3:4';
export type OutputStyle = 'stickman' | 'anime' | 'infographic' | '3d' | 'cartoon' | 'movie' | 'american' | 'flat' | 'real_photo' | 'docu' | 'pixel' | 'webtoon' | 'sketch' | 'yadam' | 'vlog' | 'clay' | 'custom' | 'cyberpunk' | 'watercolor' | 'horror' | 'disney' | 'noir' | 'papercut' | 'oil' | 'popart' | 'scifi' | 'fantasy' | 'isometric' | 'lowpoly' | 'neon' | 'vintage';

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
        cutSpeed: 'fast' | 'slow';
        topic: string;
        scriptRaw: string;
        selectedVoice: string;
        videoModel: string; // e.g. 'seedance'
        scriptModel?: string;
        includeSubtitles: boolean;
        imageModel?: string;
        voiceSpeed: number;
        subtitleSettings?: {
            font: string;
            size: string;
            color: string;
            bgColor: string;
            bgOpacity: number;
            shadow: string;
            outlineColor: string;
        };
    };
    segments: Segment[];
}

interface WizardContextType extends WizardState {
    setStep: (step: number) => void;
    updateSettings: (newSettings: Partial<WizardState['settings']>) => void;
    setSegments: (segments: Segment[]) => void;
    updateSegment: (id: string, updates: Partial<Segment>) => void;
    saveProject: () => Promise<void>;
    projectId: string | null;
}

const WizardContext = createContext<WizardContextType | undefined>(undefined);

interface WizardProviderProps {
    children: ReactNode;
    initialData?: Partial<WizardState>;
    initialProjectId?: string;
}

export function WizardProvider({ children, initialData, initialProjectId }: WizardProviderProps) {
    const [projectId, setProjectId] = useState<string | null>(initialProjectId || null);
    const [step, setStep] = useState(initialData?.step || 1);
    const [settings, setSettings] = useState<WizardState['settings']>({
        ratio: '16:9',
        style: 'stickman',
        durationPreset: 20,
        cutSpeed: 'fast',
        topic: '',
        scriptRaw: '',
        selectedVoice: '',
        videoModel: '',
        scriptModel: 'gemini',
        includeSubtitles: true,
        imageModel: 'z-image-turbo',
        voiceSpeed: 1,
        subtitleSettings: {
            font: 'Pretendard',
            size: 'large',
            color: '#FFFFFF',
            bgColor: '#000000',
            bgOpacity: 85,
            shadow: 'outline',
            outlineColor: '#000000'
        },
        ...initialData?.settings
    });
    const [segments, setSegments] = useState<Segment[]>(initialData?.segments || []);

    const saveProject = useCallback(async () => {
        try {
            const body = {
                title: settings.topic || 'Untitled Project',
                step,
                settings,
                script: settings.scriptRaw,
                segments,
                status: step >= 6 ? 'completed' : 'draft',
                id: projectId,
                userId: 'default_user'
            };

            const res = await fetch('/api/projects', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });

            if (res.ok) {
                const data = await res.json();
                if (!projectId && data._id) {
                    setProjectId(data._id);
                }
            }
        } catch (error) {
            console.error('Failed to save project:', error);
        }
    }, [settings, step, segments, projectId]);

    // Auto-save when step changes or settings indicate progress
    useEffect(() => {
        if (projectId || (step > 1 && settings.topic)) {
            const timer = setTimeout(() => {
                saveProject();
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [saveProject, step, settings.topic, projectId]);

    const updateSettings = (newSettings: Partial<WizardState['settings']>) => {
        setSettings(prev => {
            const updated = { ...prev, ...newSettings };
            return updated;
        });
    };

    const updateSegment = (id: string, updates: Partial<Segment>) => {
        setSegments(prev => prev.map(seg => seg.id === id ? { ...seg, ...updates } : seg));
    };

    return (
        <WizardContext.Provider value={{ step, setStep, settings, updateSettings, segments, setSegments, updateSegment, saveProject, projectId }}>
            {children}
        </WizardContext.Provider>
    );
}

export const useWizard = () => {
    const context = useContext(WizardContext);
    if (!context) throw new Error('useWizard must be used within a WizardProvider');
    return context;
};
