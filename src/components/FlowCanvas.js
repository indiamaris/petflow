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
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FLOW_CONFIG } from '../config/flow-config';
import { saveAnimalData } from '../utils/storage-utils';
import AnimalDetailsPanel from './AnimalDetailsPanel';
import ContextMenu from './ContextMenu';
import CustomNode from './CustomNode';
import './FlowCanvas.css';

// Remover o wrapper estático

// Componente interno que usa useReactFlow
function FlowCanvasInner({ nodes: initialNodes, edges: initialEdges, onUpdate, onMatilhaClick, onAnimalUpdate, canvasId, highlightedNodes }) {
  // Debug: verificar se highlightedNodes está sendo passado
  console.log('FlowCanvasInner - highlightedNodes:', highlightedNodes);
  console.log('FlowCanvasInner - typeof highlightedNodes:', typeof highlightedNodes);
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
    if (node.data.type === 'matilha') {
      onMatilhaClick(node.id);
    } else if (node.data.type === 'animal') {
      setSelectedAnimal(node);
      setIsDetailsPanelOpen(true);
    }
  }, [onMatilhaClick]);

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

  // Removido useEffect que causava loop infinito
  // onUpdate é chamado manualmente quando necessário

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

  const handleDeleteNode = useCallback((nodeId) => {
    // Remover o nó do estado local
    setNodes(prevNodes => {
      const updatedNodes = prevNodes.filter(node => node.id !== nodeId);
      
      // Remover todas as edges conectadas a este nó
      setEdges(prevEdges => {
        const updatedEdges = prevEdges.filter(edge => 
          edge.source !== nodeId && edge.target !== nodeId
        );
        
        // Atualizar o estado global
        if (onUpdate) {
          onUpdate(updatedNodes, updatedEdges);
        }
        
        return updatedEdges;
      });
      
      return updatedNodes;
    });
    
    // Fechar painel de detalhes se o nó deletado era o selecionado
    if (selectedAnimal && selectedAnimal.id === nodeId) {
      setIsDetailsPanelOpen(false);
      setSelectedAnimal(null);
    }
  }, [onUpdate, selectedAnimal]);

  // Criar nodeTypes dinamicamente com a função de deletar
  const nodeTypes = useMemo(() => ({
    custom: (props) => <CustomNode {...props} onDelete={handleDeleteNode} />
  }), [handleDeleteNode]);

  const handleSaveSVG = useCallback(() => {
    if (reactFlowInstance) {
      try {
        // Obter todos os nós para calcular bounds
        const allNodes = reactFlowInstance.getNodes();
        
        if (allNodes.length === 0) {
          alert('Não há nós para exportar.');
          return;
        }
        
        // Calcular bounds dos nós
        const bounds = allNodes.reduce((bounds, node) => {
          const nodeWidth = node.data.type === 'granja' ? 120 : 100;
          const nodeHeight = node.data.type === 'granja' ? 80 : 60;
          
          bounds.minX = Math.min(bounds.minX, node.position.x);
          bounds.maxX = Math.max(bounds.maxX, node.position.x + nodeWidth);
          bounds.minY = Math.min(bounds.minY, node.position.y);
          bounds.maxY = Math.max(bounds.maxY, node.position.y + nodeHeight);
          return bounds;
        }, { 
          minX: allNodes[0].position.x, 
          maxX: allNodes[0].position.x, 
          minY: allNodes[0].position.y, 
          maxY: allNodes[0].position.y 
        });
        
        // Adicionar padding
        const padding = 100;
        const width = bounds.maxX - bounds.minX + padding * 2;
        const height = bounds.maxY - bounds.minY + padding * 2;
        
        // Criar um novo SVG
        const newSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        newSvg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
        newSvg.setAttribute('viewBox', `${bounds.minX - padding} ${bounds.minY - padding} ${width} ${height}`);
        newSvg.setAttribute('width', width);
        newSvg.setAttribute('height', height);
        newSvg.setAttribute('style', 'background-color: #f8f9fa;');
        
        // Adicionar background
        const background = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        background.setAttribute('width', '100%');
        background.setAttribute('height', '100%');
        background.setAttribute('fill', '#f8f9fa');
        newSvg.appendChild(background);
        
        // Adicionar nós como retângulos representativos
        allNodes.forEach(node => {
          const nodeElement = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
          const nodeWidth = node.data.type === 'matilha' ? 120 : 100;
          const nodeHeight = node.data.type === 'matilha' ? 80 : 60;
          
          nodeElement.setAttribute('x', node.position.x);
          nodeElement.setAttribute('y', node.position.y);
          nodeElement.setAttribute('width', nodeWidth);
          nodeElement.setAttribute('height', nodeHeight);
          nodeElement.setAttribute('fill', node.data.color || '#666');
          nodeElement.setAttribute('stroke', '#333');
          nodeElement.setAttribute('stroke-width', '2');
          nodeElement.setAttribute('rx', '8');
          
          // Adicionar texto do nó
          const textElement = document.createElementNS('http://www.w3.org/2000/svg', 'text');
          textElement.setAttribute('x', node.position.x + nodeWidth / 2);
          textElement.setAttribute('y', node.position.y + nodeHeight / 2 + 5);
          textElement.setAttribute('text-anchor', 'middle');
          textElement.setAttribute('fill', 'white');
          textElement.setAttribute('font-size', '12');
          textElement.setAttribute('font-weight', 'bold');
          textElement.textContent = node.data.animalName || node.data.label;
          
          newSvg.appendChild(nodeElement);
          newSvg.appendChild(textElement);
        });
        
        // Adicionar conexões
        const allEdges = reactFlowInstance.getEdges();
        allEdges.forEach(edge => {
          const sourceNode = allNodes.find(n => n.id === edge.source);
          const targetNode = allNodes.find(n => n.id === edge.target);
          
          if (sourceNode && targetNode) {
            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            const sourceX = sourceNode.position.x + (sourceNode.data.type === 'matilha' ? 60 : 50);
            const sourceY = sourceNode.position.y + (sourceNode.data.type === 'matilha' ? 60 : 30);
            const targetX = targetNode.position.x + (targetNode.data.type === 'matilha' ? 60 : 50);
            const targetY = targetNode.position.y + (targetNode.data.type === 'matilha' ? 60 : 30);
            
            line.setAttribute('x1', sourceX);
            line.setAttribute('y1', sourceY);
            line.setAttribute('x2', targetX);
            line.setAttribute('y2', targetY);
            line.setAttribute('stroke', '#666');
            line.setAttribute('stroke-width', '2');
            line.setAttribute('marker-end', 'url(#arrowhead)');
            
            newSvg.appendChild(line);
          }
        });
        
        // Adicionar definição de seta
        const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
        const marker = document.createElementNS('http://www.w3.org/2000/svg', 'marker');
        marker.setAttribute('id', 'arrowhead');
        marker.setAttribute('markerWidth', '10');
        marker.setAttribute('markerHeight', '7');
        marker.setAttribute('refX', '9');
        marker.setAttribute('refY', '3.5');
        marker.setAttribute('orient', 'auto');
        
        const polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
        polygon.setAttribute('points', '0 0, 10 3.5, 0 7');
        polygon.setAttribute('fill', '#666');
        
        marker.appendChild(polygon);
        defs.appendChild(marker);
        newSvg.appendChild(defs);
        
        // Converter para string SVG
        const svgData = new XMLSerializer().serializeToString(newSvg);
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
    
    // Gerar nome único para cachorros
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
    
    // Se for um cachorro, salvar dados iniciais no localStorage e abrir painel
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
        nodes={nodes.map(node => ({
          ...node,
          data: {
            ...node.data,
            highlightedNodes: highlightedNodes && typeof highlightedNodes === 'object' ? highlightedNodes : new Set()
          }
        }))}
        edges={edges.map(edge => {
          // Destacar apenas edges entre nós destacados (hierarquia descendente)
          const isHighlighted = highlightedNodes && 
            highlightedNodes.has(edge.source) && 
            highlightedNodes.has(edge.target);
          
          return {
            ...edge,
            style: {
              ...edge.style,
              stroke: isHighlighted ? '#ffd700' : edge.style?.stroke || '#666',
              strokeWidth: isHighlighted ? 4 : edge.style?.strokeWidth || 2,
              strokeDasharray: isHighlighted ? '8,4' : edge.style?.strokeDasharray || 'none'
            }
          };
        })}
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
              case 'matilha':
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
