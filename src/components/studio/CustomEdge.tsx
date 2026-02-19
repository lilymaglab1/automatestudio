
import React from 'react';
import {
    BaseEdge,
    EdgeLabelRenderer,
    EdgeProps,
    getBezierPath,
    useReactFlow,
} from '@xyflow/react';

export default function CustomEdge({
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    style = {},
    markerEnd,
    selected,
    animated,
}: EdgeProps) {
    const [edgePath, labelX, labelY] = getBezierPath({
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition,
    });

    return (
        <>
            <BaseEdge
                path={edgePath}
                markerEnd={markerEnd}
                style={{
                    ...style,
                    strokeWidth: selected ? 3 : 2,
                    stroke: selected ? '#a855f7' : '#475569',
                    transition: 'stroke 0.3s ease',
                }}
            />
            {animated && (
                <circle r="4" fill="#a855f7">
                    <animateMotion dur="2s" repeatCount="indefinite" path={edgePath} />
                </circle>
            )}
        </>
    );
}
