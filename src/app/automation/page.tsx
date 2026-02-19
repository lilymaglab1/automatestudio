
import React from 'react';
import AutomationDashboardClient from '@/components/studio/AutomationDashboardClient';
import TopMenu from '@/components/shared/TopMenu';

export default function AutomationPage() {
    return (
        <div className="min-h-screen bg-slate-50 font-sans">
            <TopMenu />
            <AutomationDashboardClient />
        </div>
    );
}
