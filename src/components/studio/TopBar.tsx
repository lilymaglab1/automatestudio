
import React, { memo } from 'react';
import { Play, Save, Settings, Share2, Undo2, Redo2 } from 'lucide-react';
import { useWorkflowStore } from '@/store/useWorkflowStore';
import { useShallow } from 'zustand/react/shallow';
import { cn } from '@/lib/utils';
// Removed Button import

export default function TopBar() {
    const { runWorkflow, isRunning } = useWorkflowStore(
        useShallow((state) => ({
            runWorkflow: state.runWorkflow,
            isRunning: state.isRunning
        }))
    );

    return (
        <div className="h-14 border-b border-slate-800 bg-slate-950/80 backdrop-blur-sm flex items-center justify-between px-6 z-20 absolute top-0 left-0 right-0 pointer-events-auto shadow-md">
            {/* Left: Workflow Info */}
            <div className="flex items-center gap-4">
                <h1 className="text-sm font-semibold text-slate-200">New Automation</h1>
                <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-400 border border-slate-700">
                    Draft
                </span>
            </div>

            {/* Middle: Actions */}
            <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-lg p-1">
                <button className="p-1.5 hover:bg-slate-800 rounded text-slate-400 hover:text-slate-200 transaction-colors">
                    <Undo2 className="w-4 h-4" />
                </button>
                <button className="p-1.5 hover:bg-slate-800 rounded text-slate-400 hover:text-slate-200 transaction-colors">
                    <Redo2 className="w-4 h-4" />
                </button>
            </div>

            {/* Right: Controls */}
            <div className="flex items-center gap-3">
                <button className="hidden sm:flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition-colors">
                    <Share2 className="w-4 h-4" />
                    Share
                </button>
                <button className="hidden sm:flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition-colors">
                    <Save className="w-4 h-4" />
                    Save
                </button>

                <div className="w-px h-6 bg-slate-800 mx-1" />

                <button
                    onClick={runWorkflow}
                    disabled={isRunning}
                    className={cn(
                        "flex items-center gap-2 px-4 py-1.5 text-xs font-bold text-white rounded-lg shadow-lg shadow-purple-500/20 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed",
                        isRunning
                            ? "bg-slate-700"
                            : "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 hover:shadow-purple-500/40"
                    )}
                >
                    {isRunning ? (
                        <>
                            <div className="w-3 h-3 rounded-full border-2 border-white/30 border-t-white animate-spin"></div>
                            Running...
                        </>
                    ) : (
                        <>
                            <Play className="w-3.5 h-3.5 fill-white" />
                            Run
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
