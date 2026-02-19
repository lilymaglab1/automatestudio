
import React from 'react';
import { useWorkflowStore } from '@/store/useWorkflowStore';
import { useShallow } from 'zustand/react/shallow';
import { X, Settings, Image as ImageIcon, Type, Video, Save } from 'lucide-react';
import { clsx } from 'clsx';

export default function PropertyPanel() {
    const { selectedNodeId, nodes, updateNodeData, selectNode } = useWorkflowStore(
        useShallow((state) => ({
            selectedNodeId: state.selectedNodeId,
            nodes: state.nodes,
            updateNodeData: state.updateNodeData,
            selectNode: state.selectNode,
        }))
    );

    const selectedNode = nodes.find((n) => n.id === selectedNodeId);

    if (!selectedNode) {
        return (
            <div className="w-80 h-full border-l border-slate-800 bg-slate-950 p-6 flex flex-col items-center justify-center text-slate-500">
                <Settings className="w-12 h-12 mb-4 text-slate-700" />
                <p className="text-center text-sm">Select a node to edit its properties</p>
            </div>
        );
    }

    const handleChange = (key: string, value: any) => {
        updateNodeData(selectedNode.id, { [key]: value });
    };

    const nodeType = selectedNode.data.type || selectedNode.type;

    return (
        <aside className="w-80 h-full border-l border-slate-800 bg-slate-950 flex flex-col shadow-2xl z-10">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/50">
                <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wide flex items-center gap-2">
                    <Settings className="w-4 h-4 text-purple-400" />
                    Properties
                </h3>
                <button
                    onClick={() => selectNode(null)}
                    className="text-slate-500 hover:text-slate-300 transition-colors"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">

                {/* Common: Label */}
                <div className="space-y-2">
                    <label className="text-xs font-medium text-slate-400">Node Name</label>
                    <input
                        type="text"
                        value={selectedNode.data.label as string || ''}
                        onChange={(e) => handleChange('label', e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-purple-500 transition-colors"
                    />
                </div>

                {/* Specific: Input Node */}
                {nodeType === 'input' && (
                    <div className="space-y-2">
                        <label className="text-xs font-medium text-slate-400">Prompt / Input Text</label>
                        <textarea
                            value={selectedNode.data.prompt as string || ''}
                            onChange={(e) => handleChange('prompt', e.target.value)}
                            rows={6}
                            className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-purple-500 transition-colors resize-none"
                            placeholder="Enter your prompt here..."
                        />
                    </div>
                )}

                {/* Specific: Image Gen Node */}
                {nodeType === 'image-gen' && (
                    <>
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-slate-400">Model</label>
                            <select
                                value={selectedNode.data.model as string || 'midjourney-v6'}
                                onChange={(e) => handleChange('model', e.target.value)}
                                className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-purple-500 transition-colors appearance-none cursor-pointer"
                            >
                                <option value="midjourney-v6">Midjourney V6</option>
                                <option value="flux-pro">Flux Pro</option>
                                <option value="stable-diffusion-xl">Stable Diffusion XL</option>
                                <option value="dall-e-3">DALL-E 3</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-medium text-slate-400">Aspect Ratio</label>
                            <div className="grid grid-cols-3 gap-2">
                                {['1:1', '16:9', '9:16', '4:3', '3:2'].map((ratio) => (
                                    <button
                                        key={ratio}
                                        onClick={() => handleChange('aspectRatio', ratio)}
                                        className={clsx(
                                            "px-2 py-1 text-xs rounded border transition-colors",
                                            selectedNode.data.aspectRatio === ratio
                                                ? "bg-purple-600 border-purple-500 text-white"
                                                : "bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-500"
                                        )}
                                    >
                                        {ratio}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-medium text-slate-400">Stylize</label>
                            <input
                                type="range"
                                min="0" max="1000"
                                value={selectedNode.data.stylize as number || 100}
                                onChange={(e) => handleChange('stylize', parseInt(e.target.value))}
                                className="w-full accent-purple-500 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer"
                            />
                            <div className="flex justify-between text-xs text-slate-500">
                                <span>Low</span>
                                <span>{selectedNode.data.stylize || 100}</span>
                                <span>High</span>
                            </div>
                        </div>
                    </>
                )}

                {/* Specific: Video Gen Node */}
                {nodeType === 'video-gen' && (
                    <>
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-slate-400">Model</label>
                            <select
                                value={selectedNode.data.model as string || 'runway-gen-2'}
                                onChange={(e) => handleChange('model', e.target.value)}
                                className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-purple-500 transition-colors"
                            >
                                <option value="runway-gen-2">Runway Gen-2</option>
                                <option value="pika-labs">Pika Labs</option>
                                <option value="luma-dream-machine">Luma Dream Machine</option>
                                <option value="kling-ai">Kling AI</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-medium text-slate-400">Duration (seconds)</label>
                            <input
                                type="number"
                                value={selectedNode.data.duration as number || 3}
                                onChange={(e) => handleChange('duration', parseInt(e.target.value))}
                                className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-purple-500 transition-colors"
                            />
                        </div>
                    </>
                )}

            </div>

            {/* Footer info */}
            <div className="p-4 border-t border-slate-800 bg-slate-900/30 text-xs text-slate-600 font-mono">
                ID: {selectedNode.id}
            </div>
        </aside>
    );
}
