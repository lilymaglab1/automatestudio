
'use client';

import React from 'react';
import { WizardProvider } from '@/components/automation/WizardContext';
import Wizard from '@/components/automation/Wizard';
import TopMenu from '@/components/shared/TopMenu';

export default function NewProjectPage() {
    return (
        <div className="h-screen flex flex-col bg-slate-50 font-sans overflow-hidden">
            <TopMenu />
            <WizardProvider>
                <Wizard />
            </WizardProvider>
        </div>
    );
}
