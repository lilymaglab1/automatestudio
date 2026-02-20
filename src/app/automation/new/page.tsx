'use client';

import React from 'react';
import { WizardProvider } from '@/components/automation/WizardContext';
import Wizard from '@/components/automation/Wizard';
import TopMenu from '@/components/shared/TopMenu';
import WizardSidebar from '@/components/automation/WizardSidebar';

export default function NewProjectPage() {
    return (
        <div className="h-screen flex flex-col bg-[#09090b] text-white font-sans overflow-hidden">
            <TopMenu />
            <div className="flex-1 flex overflow-hidden">
                <WizardProvider>
                    <div className="flex w-full h-full">
                        <WizardSidebar />
                        <div className="flex-1 flex flex-col min-w-0 bg-[#09090b]">
                            <Wizard />
                        </div>
                    </div>
                </WizardProvider>
            </div>
        </div>
    );
}
