import React from 'react';
import AutomationDashboardClient from '@/components/studio/AutomationDashboardClient';
import TopMenu from '@/components/shared/TopMenu';
import StudioSidebar from '@/components/shared/StudioSidebar';

export default function AutomationPage() {
    return (
        <div className="h-screen flex flex-col bg-[#09090b] text-white">
            <TopMenu />
            <div className="flex-1 flex overflow-hidden">
                <StudioSidebar />
                <AutomationDashboardClient />
            </div>
        </div>
    );
}
