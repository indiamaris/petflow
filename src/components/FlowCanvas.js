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
import AnimalDetailsPanel from './AnimalDetailsPanel';

const nodeTypes = {
  custom: CustomNode
};

function FlowCanvas({ nodes: initialNodes, edges: initialEdges, onUpdate, onGranjaClick, onAnimalUpdate, canvasId }) {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);
  const [selectedAnimal, setSelectedAnimal] = useState(null);
  const [isDetailsPanelOpen, setIsDetailsPanelOpen] = useState(false);
  const reactFlowWrapper = useRef(null);

  const onNodesChange = useCallback((changes) => {
    setNodes((nds) => {
      let updatedNodes = [...nds];
      
      changes.forEach(change => {
        if (change.type === 'position') {
          updatedNodes = updatedNodes.map(node => 
            node.id === change.id 
              ? { ...node, position: change.position }
              : node
          );
        } else if (change.type === 'remove') {
          updatedNodes = updatedNodes.filter(node => node.id !== change.id);
        } else if (change.type === 'add') {
          updatedNodes = [...updatedNodes, change.item];
        }
      });
      
      return updatedNodes;
    });
  }, []);

  const onEdgesChange = useCallback((changes) => {
    setEdges((eds) => {
      let updatedEdges = [...eds];
      
      changes.forEach(change => {
        if (change.type === 'remove') {
          updatedEdges = updatedEdges.filter(edge => edge.id !== change.id);
        } else if (change.type === 'add') {
          updatedEdges = [...updatedEdges, change.item];
        }
      });
      
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
    console.log('Node clicked:', node);
    if (node.data.type === 'granja') {
      onGranjaClick(node.id);
    } else if (node.data.type === 'animal') {
      setSelectedAnimal(node);
      setIsDetailsPanelOpen(true);
    }
  }, [onGranjaClick]);

  // Atualizar o estado global quando os nós ou edges mudarem
  useEffect(() => {
    onUpdate(nodes, edges);
  }, [nodes, edges, onUpdate]);

  // Sincronizar com as mudanças externas apenas na primeira renderização
  useEffect(() => {
    setNodes(initialNodes);
    setEdges(initialEdges);
  }, []); // Array vazio para executar apenas uma vez

  const handleSaveAnimal = useCallback((animalId, animalData) => {
    // Atualizar o estado local
    setNodes(prevNodes => 
      prevNodes.map(node => 
        node.id === animalId 
          ? { ...node, data: { ...node.data, ...animalData } }
          : node
      )
    );
    
    // Atualizar o estado global
    if (onAnimalUpdate) {
      onAnimalUpdate(animalId, animalData);
    }
    
    setIsDetailsPanelOpen(false);
    setSelectedAnimal(null);
  }, [onAnimalUpdate]);

  const handleCloseDetailsPanel = useCallback(() => {
    setIsDetailsPanelOpen(false);
    setSelectedAnimal(null);
  }, []);

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
      
      <AnimalDetailsPanel
        animal={selectedAnimal}
        isOpen={isDetailsPanelOpen}
        onClose={handleCloseDetailsPanel}
        onSave={handleSaveAnimal}
      />
    </div>
  );
}

export default FlowCanvas;
