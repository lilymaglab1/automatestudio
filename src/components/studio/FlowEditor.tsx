
import React, { useCallback, useRef } from 'react';
import {
    ReactFlow,
    Controls,
    Background,
    useReactFlow,
    BackgroundVariant,
    OnSelectionChangeParams,
    ReactFlowProvider, // Import provider locally
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useDnD } from './DnDContext';
import CustomNode from './CustomNode';
import CustomEdge from './CustomEdge';
import { useWorkflowStore } from '@/store/useWorkflowStore';
import { useShallow } from 'zustand/react/shallow';


const nodeTypes = {
    custom: CustomNode,
    input: CustomNode,
    'text-gen': CustomNode,
    'image-gen': CustomNode,
    'video-gen': CustomNode,
    output: CustomNode,
};

const edgeTypes = {
    custom: CustomEdge,
};

let id = 0;
const getId = () => `dndnode_${id++}`;

// Inner component that uses the hooks
const FlowEditorContent = () => {
    const reactFlowWrapper = useRef<HTMLDivElement>(null);
    const [type] = useDnD();
    const { screenToFlowPosition } = useReactFlow();

    // Zustand state and actions - explicit selection
    const nodes = useWorkflowStore(useShallow(state => state.nodes));
    const edges = useWorkflowStore(useShallow(state => state.edges));
    const onNodesChange = useWorkflowStore(state => state.onNodesChange);
    const onEdgesChange = useWorkflowStore(state => state.onEdgesChange);
    const onConnect = useWorkflowStore(state => state.onConnect);
    const addNode = useWorkflowStore(state => state.addNode);
    const selectNode = useWorkflowStore(state => state.selectNode);

    const onDragOver = useCallback((event: React.DragEvent) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    const onDrop = useCallback(
        (event: React.DragEvent) => {
            event.preventDefault();

            if (!type) {
                return;
            }

            const position = screenToFlowPosition({
                x: event.clientX,
                y: event.clientY,
            });

            const newNode = {
                id: getId(),
                type,
                position,
                data: { label: `${type} node`, type: type, status: 'idle' },
            };

            addNode(newNode);
        },
        [screenToFlowPosition, type, addNode],
    );

    const onSelectionChange = useCallback(({ nodes }: OnSelectionChangeParams) => {
        if (nodes.length > 0) {
            selectNode(nodes[0].id);
        } else {
            selectNode(null);
        }
    }, [selectNode]);

    return (
        <div className="w-full h-full" ref={reactFlowWrapper}>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                nodeTypes={nodeTypes}
                edgeTypes={edgeTypes}
                onDrop={onDrop}
                onDragOver={onDragOver}
                onSelectionChange={onSelectionChange}
                fitView
                className="bg-slate-950"
            >
                <Controls className="bg-slate-800 border-slate-700 text-slate-200 fill-slate-200" />
                <Background variant={BackgroundVariant.Dots} gap={12} size={1} color="#334155" />
            </ReactFlow>
        </div>
    );
};

// Exported wrapper
const FlowEditor = () => {
    return (
        <ReactFlowProvider>
            <FlowEditorContent />
        </ReactFlowProvider>
    );
};

export default FlowEditor;
