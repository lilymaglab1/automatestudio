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
import { Check, ChevronRight } from 'lucide-react';

export default function Wizard() {
    const { step } = useWizard();

    const steps = [
        { num: 1, label: '설정' },
        { num: 2, label: '대본 생성' },
        { num: 3, label: '음성 생성' },
        { num: 4, label: '이미지 생성' },
        { num: 5, label: '영상 생성' },
        { num: 6, label: '영상 렌더링' },
    ];

    return (
        <div className="w-full flex-1 flex flex-col min-h-0 bg-[#09090b] text-white">
            {/* Dashboard Link & Stepper Header */}
            <div className="border-b border-[#1f1f23] bg-[#09090b] px-6 py-8 relative">
                {/* Dashboard Back Button */}
                <div className="absolute top-8 left-8 z-20">
                    <a href="/automation" className="flex items-center gap-2 px-4 py-2 bg-[#18181b] hover:bg-[#27272a] text-gray-400 hover:text-white text-xs font-bold rounded-full transition-colors border border-[#27272a]">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M19 12H5M12 19l-7-7 7-7" />
                        </svg>
                        대시보드
                    </a>
                </div>

                <div className="max-w-4xl mx-auto flex items-center justify-between relative mt-4">
                    {/* Background Progress Line */}
                    <div className="absolute top-5 left-4 right-4 h-[2px] bg-[#1f1f23] -z-0"></div>
                    <div
                        className="absolute top-5 left-4 h-[2px] bg-[#6d28d9] transition-all duration-500 -z-0"
                        style={{ width: `${((step - 1) / (steps.length - 1)) * 100}%` }}
                    ></div>

                    {steps.map((s, idx) => {
                        const isCompleted = step > s.num;
                        const isCurrent = step === s.num;

                        return (
                            <div key={s.num} className="flex flex-col items-center gap-3 relative z-10 w-24">
                                <div className={cn(
                                    "w-10 h-10 rounded-full flex items-center justify-center text-sm font-black border-2 transition-all duration-300 bg-[#09090b]",
                                    isCurrent ? "border-[#6d28d9] text-[#6d28d9] shadow-[0_0_15px_rgba(109,40,217,0.5)] scale-110" :
                                        isCompleted ? "border-[#6d28d9] bg-[#6d28d9] text-white" : "border-[#27272a] text-gray-600"
                                )}>
                                    {isCompleted ? <Check className="w-4 h-4 stroke-[4px]" /> : s.num}
                                </div>
                                <span className={cn(
                                    "text-[10px] font-bold text-center mt-1 transition-colors",
                                    isCurrent ? "text-[#a78bfa]" : isCompleted ? "text-gray-400" : "text-gray-600"
                                )}>
                                    {s.label}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Step Content */}
            <div className="flex-1 overflow-hidden relative">
                {step === 1 && <Step1_Settings />}
                {step === 2 && <Step2_Script />} {/* Note: Mapping based on names in Step1's current imports */}
                {step === 3 && <Step3_Voice />}
                {step === 4 && <Step4_Image />}
                {step === 5 && <Step5_Video />}
                {step === 6 && <Step6_Render />}
            </div>
        </div>
    );
}
