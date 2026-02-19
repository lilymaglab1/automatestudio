
import { create } from 'zustand';
import {
    type Node,
    type Edge,
    type OnNodesChange,
    type OnEdgesChange,
    type OnConnect,
    applyNodeChanges,
    applyEdgeChanges,
    addEdge,
    getOutgoers,
} from '@xyflow/react';

// ... Status types ... 
export type NodeStatus = 'idle' | 'running' | 'completed' | 'error';
export type NodeData = {
    label?: string;
    type?: string;
    prompt?: string;
    model?: string;
    aspectRatio?: string;
    stylize?: number;
    duration?: number;
    preview?: string;
    status?: NodeStatus;
    [key: string]: any;
};

// ... Workflow State type ...
export type WorkflowState = {
    // ... existing
    nodes: Node[];
    edges: Edge[];
    selectedNodeId: string | null;
    isRunning: boolean;

    onNodesChange: OnNodesChange;
    onEdgesChange: OnEdgesChange;
    onConnect: OnConnect;
    addNode: (node: Node) => void;
    setNodes: (nodes: Node[]) => void;
    setEdges: (edges: Edge[]) => void;
    selectNode: (nodeId: string | null) => void;
    updateNodeData: (nodeId: string, data: Partial<NodeData>) => void;
    updateNodeStatus: (nodeId: string, status: NodeStatus) => void;
    runWorkflow: () => Promise<void>;

    exportWorkflow: () => string;
    loadWorkflow: (json: string) => void;
};

// ... mock data and sleep ...
const MOCK_IMAGES = [
    "https://images.unsplash.com/photo-1620641788421-7f1c91ade383?w=800&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1635322966219-b75ed3a90e2d?w=800&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1614726365722-405cb756a598?w=800&auto=format&fit=crop&q=60"
];

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

export const useWorkflowStore = create<WorkflowState>((set, get) => ({
    nodes: [
        {
            id: '1',
            type: 'input',
            position: { x: 100, y: 100 },
            data: { label: 'Start (Input)', type: 'input', prompt: 'A futuristic city with flying cars' },
        },
        {
            id: '2',
            type: 'image-gen',
            position: { x: 400, y: 200 },
            data: { label: 'Midjourney V6', type: 'image-gen', model: 'midjourney-v6', aspectRatio: '16:9' },
        },
    ],
    edges: [],
    selectedNodeId: null,
    isRunning: false,

    onNodesChange: (changes) => {
        set({
            nodes: applyNodeChanges(changes, get().nodes),
        });
    },
    onEdgesChange: (changes) => {
        set({
            edges: applyEdgeChanges(changes, get().edges),
        });
    },
    onConnect: (connection) => {
        // Ensure new edges use our custom type and have animated style
        const edge = { ...connection, type: 'custom', animated: true };
        set({
            edges: addEdge(edge, get().edges),
        });
    },
    addNode: (node) => {
        set({
            nodes: [...get().nodes, node],
        });
    },
    setNodes: (nodes) => {
        set({ nodes });
    },
    setEdges: (edges) => {
        set({ edges });
    },
    selectNode: (nodeId) => {
        set({ selectedNodeId: nodeId });
    },
    updateNodeData: (nodeId, newData) => {
        set({
            nodes: get().nodes.map((node) => {
                if (node.id === nodeId) {
                    return { ...node, data: { ...node.data, ...newData } };
                }
                return node;
            }),
        });
    },
    updateNodeStatus: (nodeId, status) => {
        set({
            nodes: get().nodes.map((node) => {
                if (node.id === nodeId) {
                    return { ...node, data: { ...node.data, status } };
                }
                return node;
            })
        });
    },
    runWorkflow: async () => {
        const { nodes, edges, updateNodeStatus, updateNodeData } = get();

        if (get().isRunning) return;
        set({ isRunning: true });

        // Reset logic
        nodes.forEach(n => updateNodeStatus(n.id, 'idle'));

        const inputNodes = nodes.filter(n => n.type === 'input');
        let queue = [...inputNodes];
        const visited = new Set<string>();

        while (queue.length > 0) {
            const currentNode = queue.shift();
            if (!currentNode) continue;

            if (visited.has(currentNode.id)) continue;
            visited.add(currentNode.id);

            // Execute Node
            updateNodeStatus(currentNode.id, 'running');

            // HIGHLIGHT ACTIVE EDGES: Find edges coming into this node and animate them explicitly? 
            // Or edges going OUT from this node?
            // ReactFlow 'animated' prop is permanent on edge. 
            // For advanced effect, we could change edge style dynamically here.

            await sleep(1500);

            // Mock Result
            if (currentNode.type === 'image-gen') {
                const randomImage = MOCK_IMAGES[Math.floor(Math.random() * MOCK_IMAGES.length)];
                updateNodeData(currentNode.id, { preview: randomImage });
            }
            if (currentNode.type === 'video-gen') {
                updateNodeData(currentNode.id, { preview: "https://images.unsplash.com/photo-1626814026160-22c7d93f33ca?w=800&auto=format&fit=crop&q=60" });
            }

            updateNodeStatus(currentNode.id, 'completed');

            // Find next nodes
            const outgoers = getOutgoers(currentNode, nodes, edges);
            outgoers.forEach(node => {
                queue.push(node);
            });
        }

        set({ isRunning: false });
    },
    // ... export/import
    exportWorkflow: () => {
        const { nodes, edges } = get();
        return JSON.stringify({ nodes, edges }, null, 2);
    },

    loadWorkflow: (json: string) => {
        try {
            const { nodes, edges } = JSON.parse(json);
            set({ nodes: nodes || [], edges: edges || [] });
        } catch (e) {
            console.error("Failed to load workflow", e);
        }
    }
}));
