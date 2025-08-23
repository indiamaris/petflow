import React, { useCallback, useRef, useState, useEffect } from 'react';
import {
  ReactFlow,
  addEdge,
  Controls,
  Background,
  MiniMap
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import './FlowCanvas.css';
import CustomNode from './CustomNode';
import { FLOW_CONFIG } from '../config/flow-config';

const nodeTypes = {
  custom: CustomNode
};

function FlowCanvas({ nodes: initialNodes, edges: initialEdges, onUpdate, onGranjaClick, canvasId }) {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);
  const reactFlowWrapper = useRef(null);

  const onNodesChange = useCallback((changes) => {
    setNodes((nds) => {
      const updatedNodes = nds.map(node => {
        const change = changes.find(c => c.id === node.id);
        if (change && change.type === 'position') {
          return { ...node, position: change.position };
        }
        return node;
      });
      return updatedNodes;
    });
  }, []);

  const onEdgesChange = useCallback((changes) => {
    setEdges((eds) => {
      const updatedEdges = eds.filter(edge => 
        !changes.some(change => change.id === edge.id && change.type === 'remove')
      );
      return updatedEdges;
    });
  }, []);

  const onConnect = useCallback(
    (params) => {
      setEdges((eds) => addEdge(params, eds));
    },
    []
  );

  const onNodeClick = useCallback((event, node) => {
    if (node.data.type === 'granja') {
      onGranjaClick(node.id);
    }
  }, [onGranjaClick]);

  // Atualizar o estado global quando os nós ou edges mudarem
  useEffect(() => {
    onUpdate(nodes, edges);
  }, [nodes, edges, onUpdate]);

  // Sincronizar com as mudanças externas
  useEffect(() => {
    setNodes(initialNodes);
    setEdges(initialEdges);
  }, [initialNodes, initialEdges]);

  return (
    <div className="flow-canvas" ref={reactFlowWrapper}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
        {...FLOW_CONFIG}
        attributionPosition="bottom-left"
      >
        <Controls />
        <Background color="#aaa" gap={16} />
        <MiniMap
          nodeColor={(node) => {
            switch (node.data.type) {
              case 'granja':
                return '#ff6b6b';
              case 'animal':
                return '#4ecdc4';
              default:
                return '#95a5a6';
            }
          }}
          nodeStrokeWidth={3}
        />
      </ReactFlow>
    </div>
  );
}

export default FlowCanvas;
