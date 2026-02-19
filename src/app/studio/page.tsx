
'use client';

import React from 'react';
import FlowEditor from '@/components/studio/FlowEditor';
import PropertyPanel from '@/components/studio/PropertyPanel';
import TopBar from '@/components/studio/TopBar';
import StudioSidebar from '@/components/studio/StudioSidebar';
import { DnDProvider } from '@/components/studio/DnDContext';
import { useWorkflowStore } from '@/store/useWorkflowStore';
import { useShallow } from 'zustand/react/shallow';

const RightPanel = () => {
    const { selectedNodeId } = useWorkflowStore(useShallow((state) => ({ selectedNodeId: state.selectedNodeId })));
    if (!selectedNodeId) return null;
    return <PropertyPanel />;
}

export default function StudioPage() {
    return (
        <div className="flex h-screen w-screen bg-slate-950 text-slate-200 overflow-hidden font-sans">
            <DnDProvider>
                <StudioSidebar />
                <div className="flex-1 h-full relative flex flex-col">
                    <TopBar />
                    <div className="flex-1 overflow-hidden relative flex pt-14">
                        <div className="flex-1 h-full relative">
                            <FlowEditor />
                        </div>
                        <RightPanel />
                    </div>
                </div>
            </DnDProvider>
        </div>
    );
}
