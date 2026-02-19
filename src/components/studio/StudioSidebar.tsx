
'use client';

import React from 'react';
import { useDnD } from './DnDContext';
import { Type, Image as ImageIcon, Video, Box, Code, Play } from 'lucide-react';

export default function StudioSidebar() {
    const [_, setType] = useDnD();

    const onDragStart = (event: React.DragEvent, nodeType: string) => {
        setType(nodeType);
        event.dataTransfer.effectAllowed = 'move';
    };

    return (
        <aside className="w-64 border-r border-slate-800 bg-slate-950 p-4 shrink-0 flex flex-col gap-4 text-slate-200">
            <div className="font-bold text-lg mb-2 flex items-center gap-2">
                <Box className="w-5 h-5 text-purple-500" />
                Automation Studio
            </div>

            <div className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-2">
                Nodes
            </div>

            <div className="space-y-3">
                <div
                    className="bg-slate-900 border border-slate-800 p-3 rounded-lg hover:border-purple-500 cursor-grab active:cursor-grabbing transition-colors group flex items-center gap-3"
                    onDragStart={(event) => onDragStart(event, 'input')}
                    draggable
                >
                    <Code className="w-4 h-4 text-blue-400 group-hover:text-blue-300" />
                    <span className="text-sm font-medium">Input Node</span>
                </div>

                <div
                    className="bg-slate-900 border border-slate-800 p-3 rounded-lg hover:border-purple-500 cursor-grab active:cursor-grabbing transition-colors group flex items-center gap-3"
                    onDragStart={(event) => onDragStart(event, 'text-gen')}
                    draggable
                >
                    <Type className="w-4 h-4 text-purple-400 group-hover:text-purple-300" />
                    <span className="text-sm font-medium">Text Generator</span>
                </div>

                <div
                    className="bg-slate-900 border border-slate-800 p-3 rounded-lg hover:border-purple-500 cursor-grab active:cursor-grabbing transition-colors group flex items-center gap-3"
                    onDragStart={(event) => onDragStart(event, 'image-gen')}
                    draggable
                >
                    <ImageIcon className="w-4 h-4 text-pink-400 group-hover:text-pink-300" />
                    <span className="text-sm font-medium">Image Generator</span>
                </div>

                <div
                    className="bg-slate-900 border border-slate-800 p-3 rounded-lg hover:border-purple-500 cursor-grab active:cursor-grabbing transition-colors group flex items-center gap-3"
                    onDragStart={(event) => onDragStart(event, 'video-gen')}
                    draggable
                >
                    <Video className="w-4 h-4 text-orange-400 group-hover:text-orange-300" />
                    <span className="text-sm font-medium">Video Generator</span>
                </div>
            </div>

            <div className="mt-auto text-xs text-slate-600">
                v1.0.0 Alpha
            </div>
        </aside>
    );
}
