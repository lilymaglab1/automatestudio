
import React, { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import {
    Type,
    Image as ImageIcon,
    Video,
    MessageSquare,
    Play,
    Save,
    CheckCircle2,
    AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { type NodeStatus } from '@/store/useWorkflowStore';

const NodeIcon = ({ type }: { type: string }) => {
    switch (type) {
        case 'input': return <MessageSquare className="w-4 h-4 text-blue-400" />;
        case 'text-gen': return <Type className="w-4 h-4 text-purple-400" />;
        case 'image-gen': return <ImageIcon className="w-4 h-4 text-pink-400" />;
        case 'video-gen': return <Video className="w-4 h-4 text-orange-400" />;
        case 'output': return <Save className="w-4 h-4 text-green-400" />;
        default: return <Play className="w-4 h-4 text-slate-400" />;
    }
};

const NodeLabel = ({ type }: { type: string }) => {
    switch (type) {
        case 'input': return 'User Input';
        case 'text-gen': return 'Text Gen';
        case 'image-gen': return 'Image Gen';
        case 'video-gen': return 'Video Gen';
        case 'output': return 'Result';
        default: return 'Node';
    }
};

const StatusBadge = ({ status }: { status?: NodeStatus }) => {
    if (!status || status === 'idle') return null;
    if (status === 'running') {
        return (
            <div className="absolute top-2 right-2 flex items-center gap-1.5 px-2 py-1 bg-blue-500/10 border border-blue-500/30 rounded-full">
                <div className="w-2 h-2 rounded-full border-2 border-blue-400 border-t-transparent animate-spin" />
                <span className="text-[10px] font-medium text-blue-300">Run</span>
            </div>
        );
    }
    if (status === 'completed') {
        return (
            <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 bg-green-500/10 border border-green-500/30 rounded-full">
                <CheckCircle2 className="w-3 h-3 text-green-400" />
                <span className="text-[10px] font-medium text-green-300">Done</span>
            </div>
        );
    }
    if (status === 'error') {
        return (
            <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 bg-red-500/10 border border-red-500/30 rounded-full">
                <AlertCircle className="w-3 h-3 text-red-400" />
                <span className="text-[10px] font-medium text-red-300">Err</span>
            </div>
        );
    }
    return null;
}

const CustomNode = ({ id, data, selected }: NodeProps) => {
    const type = (data.type as string) || 'default';
    const status = (data.status as NodeStatus) || 'idle';

    return (
        <div
            className={cn(
                "min-w-[200px] w-64 rounded-xl border bg-slate-900/90 backdrop-blur-md transition-all duration-300 shadow-xl overflow-hidden group/node relative",
                // status glow
                status === 'running' && "ring-2 ring-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.5)] border-blue-500",
                status === 'completed' && "border-green-500/50 shadow-[0_0_15px_rgba(34,197,94,0.3)]",
                status === 'error' && "border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.3)]",
                // selection overrides basic border
                selected && !(status === 'running') ? "border-purple-500 ring-2 ring-purple-500/20 shadow-purple-500/20 z-10" : "",
                (!selected && status === 'idle') ? "border-slate-800 hover:border-slate-600 hover:shadow-2xl" : ""
            )}
        >
            {/* Status Badge */}
            <StatusBadge status={status} />

            {/* Header */}
            <div
                className={cn(
                    "flex items-center justify-between px-3 py-2 border-b border-slate-800/50 transition-colors",
                    selected ? "bg-purple-500/10" : "bg-slate-950/50"
                )}
            >
                <div className="flex items-center gap-2">
                    <div className={cn("p-1.5 rounded-md bg-slate-900 border border-slate-800",
                        selected ? "border-purple-500/50" : ""
                    )}>
                        <NodeIcon type={type} />
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        {NodeLabel(type)}
                    </span>
                </div>
            </div>

            {/* Content */}
            <div className="p-3 space-y-3">
                {/* Title */}
                <div className="text-sm text-slate-200 font-semibold truncate leading-tight pr-12">
                    {(data.label as string) || 'Untitled Node'}
                </div>

                {/* Dynamic Content based on type */}
                {type === 'input' && (
                    <div className="relative group/input">
                        <div className="text-xs text-slate-400 italic line-clamp-3 bg-slate-950/50 p-2 rounded border border-slate-800/50 min-h-[60px]">
                            {(data.prompt as string) || "Waiting for prompts..."}
                        </div>
                    </div>
                )}

                {type === 'image-gen' && (
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-[10px] text-slate-500 font-mono bg-slate-950 px-2 py-1 rounded border border-slate-800 w-fit">
                            <span className="w-1.5 h-1.5 rounded-full bg-pink-500 animate-pulse"></span>
                            {(data.model as string) || 'Midjourney'}
                        </div>

                        <div className="relative w-full aspect-video bg-slate-950 rounded-lg overflow-hidden border border-slate-800 flex items-center justify-center group-hover/node:border-slate-700 transition-colors">
                            {data.preview ? (
                                <img src={data.preview as string} alt="preview" className="absolute inset-0 w-full h-full object-cover animate-in fade-in zoom-in duration-500" />
                            ) : (
                                <div className="flex flex-col items-center gap-1 text-slate-700">
                                    {status === 'running' ? (
                                        <div className="w-8 h-8 rounded-full border-2 border-slate-600 border-t-pink-500 animate-spin" />
                                    ) : (
                                        <ImageIcon className="w-6 h-6" />
                                    )}
                                    <span className="text-[10px]">{status === 'running' ? 'Generating...' : 'No Preview'}</span>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Similar for video-gen... */}
                {type === 'video-gen' && (
                    <div className="space-y-2">
                        <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-2 text-[10px] text-slate-500 font-mono bg-slate-950 px-2 py-1 rounded border border-slate-800 w-fit">
                                <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse"></span>
                                {(data.model as string) || 'Runway'}
                            </div>
                            <div className="flex items-center gap-1 text-[10px] text-slate-500 font-mono bg-slate-950 px-2 py-1 rounded border border-slate-800 w-fit">
                                ⏱ {(data.duration as number) || 3}s
                            </div>
                        </div>

                        <div className="relative w-full aspect-video bg-slate-950 rounded-lg overflow-hidden border border-slate-800 flex items-center justify-center group-hover/node:border-slate-700 transition-colors">
                            {data.preview ? (
                                <div className="w-full h-full">
                                    <img src={data.preview as string} className="w-full h-full object-cover opacity-80" />
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                        <Play className="w-8 h-8 text-white fill-white/80" />
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center gap-1 text-slate-700">
                                    {status === 'running' ? (
                                        <div className="w-8 h-8 rounded-full border-2 border-slate-600 border-t-orange-500 animate-spin" />
                                    ) : (
                                        <Video className="w-6 h-6" />
                                    )}
                                    <span className="text-[10px]">{status === 'running' ? 'Rendering...' : 'Video Preview'}</span>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Handles - Standard */}
            <Handle
                type="target"
                position={Position.Left}
                className="!w-3 !h-3 !-left-[9px] !border-2 !border-slate-950 !bg-slate-500 hover:!bg-purple-500 hover:!scale-125 transition-all outline-none"
            />
            <Handle
                type="source"
                position={Position.Right}
                className="!w-3 !h-3 !-right-[9px] !border-2 !border-slate-950 !bg-slate-500 hover:!bg-purple-500 hover:!scale-125 transition-all outline-none"
            />
        </div>
    );
};

export default memo(CustomNode);
