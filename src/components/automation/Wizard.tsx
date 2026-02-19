
'use client';

import React from 'react';
import { useWizard } from '@/components/automation/WizardContext';
import Step1_Settings from '@/components/automation/steps/Step1_Settings';
import Step2_Script from '@/components/automation/steps/Step2_Script';
import Step3_Voice from '@/components/automation/steps/Step3_Voice';
import Step4_Image from '@/components/automation/steps/Step4_Image';
import Step5_Video from '@/components/automation/steps/Step5_Video';
import Step6_Render from '@/components/automation/steps/Step6_Render';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

export default function Wizard() {
    const { step } = useWizard();

    const steps = [
        { num: 1, label: 'Settings' },
        { num: 2, label: 'Script' },
        { num: 3, label: 'Voice' },
        { num: 4, label: 'Storyboard' },
        { num: 5, label: 'Video Gen' },
        { num: 6, label: 'Render' },
    ];

    return (
        <div className="w-full flex-1 flex flex-col min-h-0 bg-white">
            {/* Stepper Header */}
            <div className="border-b border-slate-200 bg-slate-50 px-6 py-4">
                <div className="max-w-5xl mx-auto flex items-center justify-between">
                    {steps.map((s, idx) => {
                        const isCompleted = step > s.num;
                        const isCurrent = step === s.num;

                        return (
                            <div key={s.num} className="flex items-center">
                                <div className={cn(
                                    "flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-bold transition-colors",
                                    isCurrent ? "bg-indigo-600 text-white shadow-md" :
                                        isCompleted ? "text-indigo-600 bg-indigo-50" : "text-slate-400"
                                )}>
                                    <div className={cn(
                                        "w-6 h-6 rounded-full flex items-center justify-center text-xs border-2",
                                        isCurrent ? "border-white bg-transparent" :
                                            isCompleted ? "border-indigo-600 bg-indigo-600 text-white" : "border-slate-300"
                                    )}>
                                        {isCompleted ? <Check className="w-3 h-3" /> : s.num}
                                    </div>
                                    <span className="hidden md:inline">{s.label}</span>
                                </div>
                                {idx < steps.length - 1 && (
                                    <div className={cn("h-0.5 w-8 mx-2 hidden sm:block", isCompleted ? "bg-indigo-200" : "bg-slate-200")}></div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Step Content */}
            <div className="flex-1 overflow-y-auto bg-slate-50/50">
                {step === 1 && <Step1_Settings />}
                {step === 2 && <Step2_Script />}
                {step === 3 && <Step3_Voice />}
                {step === 4 && <Step4_Image />}
                {step === 5 && <Step5_Video />}
                {step === 6 && <Step6_Render />}
            </div>
        </div>
    );
}
