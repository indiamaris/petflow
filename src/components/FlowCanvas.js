import {
    addEdge,
    Background,
    Controls,
    MiniMap,
    ReactFlow,
    ReactFlowProvider,
    useReactFlow
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { FLOW_CONFIG } from '../config/flow-config';
import { saveAnimalData } from '../utils/storage-utils';
import AnimalDetailsPanel from './AnimalDetailsPanel';
import ContextMenu from './ContextMenu';
import CustomNode from './CustomNode';
import './FlowCanvas.css';

const nodeTypes = {
  custom: CustomNode
};

// Componente interno que usa useReactFlow
function FlowCanvasInner({ nodes: initialNodes, edges: initialEdges, onUpdate, onGranjaClick, onAnimalUpdate, canvasId }) {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);
  const [selectedAnimal, setSelectedAnimal] = useState(null);
  const [isDetailsPanelOpen, setIsDetailsPanelOpen] = useState(false);
  const [contextMenu, setContextMenu] = useState({ show: false, position: null, sourceNode: null });
  const reactFlowWrapper = useRef(null);
  const reactFlowInstance = useReactFlow();

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

  const onNodeContextMenu = useCallback((event, node) => {
    event.preventDefault();
    setContextMenu({
      show: true,
      position: { x: event.clientX, y: event.clientY },
      sourceNode: node
    });
  }, []);

  const onPaneContextMenu = useCallback((event) => {
    event.preventDefault();
    setContextMenu({
      show: true,
      position: { x: event.clientX, y: event.clientY },
      sourceNode: null
    });
  }, []);

  // Atualizar o estado global quando os nós ou edges mudarem
  useEffect(() => {
    if (onUpdate) {
      onUpdate(nodes, edges);
    }
  }, [nodes, edges, onUpdate]);

  // Sincronizar com as mudanças externas apenas na primeira renderização
  useEffect(() => {
    setNodes(initialNodes);
    setEdges(initialEdges);
  }, []); // Array vazio para executar apenas uma vez

  const handleSaveAnimal = useCallback((animalId, animalData) => {
    // Atualizar o estado local dos nós imediatamente
    setNodes(prevNodes => 
      prevNodes.map(node => 
        node.id === animalId 
          ? { 
              ...node, 
              data: { 
                ...node.data, 
                ...animalData,
                // Atualizar o animalName para refletir no canvas
                animalName: animalData.nome || node.data.animalName
              } 
            }
          : node
      )
    );
    
    // Atualizar o estado global
    if (onAnimalUpdate) {
      onAnimalUpdate(animalId, animalData);
    }
    
    // Fechar o painel
    setIsDetailsPanelOpen(false);
    setSelectedAnimal(null);
  }, [onAnimalUpdate]);

  const handleCloseDetailsPanel = useCallback(() => {
    setIsDetailsPanelOpen(false);
    setSelectedAnimal(null);
  }, []);

  const handleCloseContextMenu = useCallback(() => {
    setContextMenu({ show: false, position: null, sourceNode: null });
  }, []);

  const handleSaveSVG = useCallback(() => {
    if (reactFlowInstance) {
      try {
        // Obter o elemento SVG do React Flow
        const svgElement = reactFlowWrapper.current?.querySelector('.react-flow__viewport svg');
        
        if (svgElement) {
          // Criar uma cópia do SVG
          const clonedSvg = svgElement.cloneNode(true);
          
          // Ajustar o viewBox para incluir todos os nós
          const bounds = reactFlowInstance.getNodes().reduce((bounds, node) => {
            bounds.minX = Math.min(bounds.minX, node.position.x);
            bounds.maxX = Math.max(bounds.maxX, node.position.x + 120);
            bounds.minY = Math.min(bounds.minY, node.position.y);
            bounds.maxY = Math.max(bounds.maxY, node.position.y + 80);
            return bounds;
          }, { minX: 0, maxX: 0, minY: 0, maxY: 0 });
          
          // Adicionar padding
          const padding = 50;
          const width = bounds.maxX - bounds.minX + padding * 2;
          const height = bounds.maxY - bounds.minY + padding * 2;
          
          clonedSvg.setAttribute('viewBox', `${bounds.minX - padding} ${bounds.minY - padding} ${width} ${height}`);
          clonedSvg.setAttribute('width', width);
          clonedSvg.setAttribute('height', height);
          
          // Converter para string SVG
          const svgData = new XMLSerializer().serializeToString(clonedSvg);
          const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
          
          // Criar link de download
          const url = URL.createObjectURL(svgBlob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `petflow_canvas_${canvasId}_${new Date().toISOString().split('T')[0]}.svg`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
          
          alert('Canvas salvo como SVG com sucesso!');
        } else {
          alert('Erro: Não foi possível encontrar o elemento SVG.');
        }
      } catch (error) {
        console.error('Erro ao salvar SVG:', error);
        alert('Erro ao salvar SVG. Tente novamente.');
      }
    }
  }, [reactFlowInstance, canvasId]);

  // Expor função de salvar SVG globalmente
  useEffect(() => {
    window.saveCanvasAsSVG = handleSaveSVG;
    
    return () => {
      delete window.saveCanvasAsSVG;
    };
  }, [handleSaveSVG]);

  const handleCreateArtifact = useCallback((artifactType, position) => {
    const newNodeId = `${artifactType.id}-${Date.now()}`;
    
    // Gerar nome único para animais
    let animalName = artifactType.label;
    if (artifactType.type === 'animal') {
      const randomIndex = Math.floor(Math.random() * 24);
      const names = ['Buddy', 'Max', 'Luna', 'Rocky', 'Bella', 'Charlie', 'Lucy', 'Cooper', 'Daisy', 'Bear', 'Molly', 'Duke', 'Sophie', 'Jack', 'Ruby', 'Oliver', 'Chloe', 'Tucker', 'Penny', 'Winston', 'Lola', 'Murphy', 'Zoe', 'Finn'];
      animalName = names[randomIndex];
    }
    
    // Calcular posição do novo nó baseada no nó de origem
    let newNodePosition;
    if (contextMenu.sourceNode) {
      const sourcePos = contextMenu.sourceNode.position;
      newNodePosition = {
        x: sourcePos.x + 200, // 200px à direita do nó de origem
        y: sourcePos.y + 100  // 100px abaixo do nó de origem
      };
    } else {
      // Se não houver nó de origem, usar a posição do clique
      newNodePosition = { x: position.x - 100, y: position.y - 50 };
    }
    
    const newNode = {
      id: newNodeId,
      type: 'custom',
      position: newNodePosition,
      data: {
        ...artifactType,
        animalName: artifactType.type === 'animal' ? animalName : artifactType.label,
        apelido: '',
        peso: '',
        idade: '',
        responsavel: ''
      }
    };

    // Criar uma nova conexão se houver um nó de origem
    let newEdge = null;
    if (contextMenu.sourceNode) {
      const edgeId = `${contextMenu.sourceNode.id}-${newNodeId}`;
      newEdge = {
        id: edgeId,
        source: contextMenu.sourceNode.id,
        target: newNodeId,
        type: 'smoothstep',
        animated: false,
        style: { 
          stroke: contextMenu.sourceNode.data.color || '#666', 
          strokeWidth: 3,
          strokeDasharray: '5,5' // Linha tracejada para destacar
        },
        label: 'Novo', // Label para identificar a conexão
        labelStyle: {
          fill: contextMenu.sourceNode.data.color || '#666',
          fontWeight: 'bold',
          fontSize: '12px'
        }
      };
    }

    // Adicionar o novo nó e edge
    setNodes(prevNodes => [...prevNodes, newNode]);
    if (newEdge) {
      setEdges(prevEdges => [...prevEdges, newEdge]);
    }
    
    // Atualizar o estado global
    if (onUpdate) {
      const updatedNodes = [...nodes, newNode];
      const updatedEdges = newEdge ? [...edges, newEdge] : edges;
      onUpdate(updatedNodes, updatedEdges);
    }
    
    // Se for um animal, salvar dados iniciais no localStorage e abrir painel
    if (artifactType.type === 'animal') {
      const initialData = {
        nome: animalName,
        apelido: '',
        peso: '',
        idade: '',
        responsavel: ''
      };
      
      saveAnimalData(newNodeId, initialData);
      setSelectedAnimal(newNode);
      setIsDetailsPanelOpen(true);
    }
  }, [nodes, edges, onUpdate, contextMenu.sourceNode]);

  return (
    <div className="flow-canvas" ref={reactFlowWrapper}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        onNodeContextMenu={onNodeContextMenu}
        onPaneContextMenu={onPaneContextMenu}
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
      
      <ContextMenu
        position={contextMenu.position}
        onClose={handleCloseContextMenu}
        onCreateArtifact={handleCreateArtifact}
        sourceNode={contextMenu.sourceNode}
      />
    </div>
  );
}

// Componente principal que envolve com ReactFlowProvider
function FlowCanvas(props) {
  return (
    <ReactFlowProvider>
      <FlowCanvasInner {...props} />
    </ReactFlowProvider>
  );
}

export default FlowCanvas;
