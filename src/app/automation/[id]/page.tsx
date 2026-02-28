
import React from 'react';
import connectDB from '@/lib/mongodb';
import { WizardProvider } from '@/components/automation/WizardContext';
import Wizard from '@/components/automation/Wizard';
import TopMenu from '@/components/shared/TopMenu';
import WizardSidebar from '@/components/automation/WizardSidebar';
import { Project as ProjectModel } from '@/models/Project';

async function getProject(id: string) {
    try {
        await connectDB();
        const project = await ProjectModel.findById(id).lean();
        if (!project) return null;
        return JSON.parse(JSON.stringify(project));
    } catch (e) {
        console.warn("Failed to fetch project from DB, attempting fallback:", e);
        // If DB fails, return a temporary project structure so the UI still loads
        return {
            _id: id,
            title: 'Temporary Project (DB Offline)',
            step: 1,
            settings: {},
            segments: [],
            status: 'draft',
            userId: 'default_user',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            _fallback: true
        };
    }
}

export default async function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    let project = await getProject(id);

    // If still null (e.g. valid DB connection but ID not found), create a temporary fallback project
    // This allows the user to continue working even if the project wasn't saved to DB yet (e.g. memory-only mode)
    if (!project) {
        project = {
            _id: id,
            title: 'New Project',
            step: 1,
            settings: {},
            segments: [],
            status: 'draft',
            userId: 'default_user',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            _fallback: true
        };
    }

    const initialData = {
        step: project.step || 1,
        settings: project.settings || {},
        segments: project.segments || []
    };

    return (
        <div className="h-screen flex flex-col bg-[#09090b] text-white">
            <TopMenu />
            <WizardProvider initialData={initialData} initialProjectId={project._id.toString()}>
                <div className="flex-1 flex overflow-hidden">
                    <WizardSidebar />
                    <div className="flex-1 flex flex-col min-w-0 bg-[#09090b]">
                        <Wizard />
                    </div>
                </div>
            </WizardProvider>
        </div>
    );
}
