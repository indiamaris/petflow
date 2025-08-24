import React, { useEffect, useState } from 'react';
import './App.css';
import ControlPanel from './components/ControlPanel';
import FlowCanvas from './components/FlowCanvas';
import { generateInitialEdges, generateInitialNodes } from './utils/flow-utils';
import { getAnimalsData, getCanvasState, saveCanvasState } from './utils/storage-utils';

function App() {
  const [currentCanvasId, setCurrentCanvasId] = useState('main');
  const [canvases, setCanvases] = useState({
    main: {
      id: 'main',
      name: 'Canvas Principal',
      nodes: generateInitialNodes(),
      edges: generateInitialEdges(),
      parentId: null
    }
  });
  const [highlightedNodes, setHighlightedNodes] = useState(new Set());

  // Carregar dados salvos do localStorage na inicialização
  useEffect(() => {
    const savedCanvasState = getCanvasState();
    const savedAnimalsData = getAnimalsData();
    
    if (Object.keys(savedCanvasState).length > 0) {
      setCanvases(prev => {
        const updated = { ...prev };
        
        Object.keys(savedCanvasState).forEach(canvasId => {
          if (updated[canvasId]) {
            updated[canvasId] = {
              ...updated[canvasId],
              nodes: savedCanvasState[canvasId].nodes || updated[canvasId].nodes,
              edges: savedCanvasState[canvasId].edges || updated[canvasId].edges
            };
          }
        });
        
        return updated;
      });
    }
    
    // Aplicar dados salvos dos animais aos nós existentes
    if (Object.keys(savedAnimalsData).length > 0) {
      setCanvases(prev => {
        const updated = { ...prev };
        
        Object.keys(updated).forEach(canvasId => {
          updated[canvasId] = {
            ...updated[canvasId],
            nodes: updated[canvasId].nodes.map(node => {
              if (savedAnimalsData[node.id]) {
                return {
                  ...node,
                  data: {
                    ...node.data,
                    ...savedAnimalsData[node.id]
                  }
                };
              }
              return node;
            })
          };
        });
        
        return updated;
      });
    }
  }, []);

  const handleMatilhaClick = (matilhaId) => {
    const newCanvasId = `matilha-${matilhaId}`;
    
    if (!canvases[newCanvasId]) {
      // Criar novo canvas para esta matilha
      const newCanvas = {
        id: newCanvasId,
        name: `Matilha ${matilhaId}`,
        nodes: generateInitialNodes(matilhaId),
        edges: generateInitialEdges(matilhaId),
        parentId: currentCanvasId
      };
      
      setCanvases(prev => ({
        ...prev,
        [newCanvasId]: newCanvas
      }));
    }
    
    setCurrentCanvasId(newCanvasId);
  };

  const handleMatilhaHighlight = (matilhaId) => {
    if (!matilhaId) {
      setHighlightedNodes(new Set());
      return;
    }
    
    // Encontrar todos os nós filhos da matilha (conectados a ela)
    const currentCanvas = canvases[currentCanvasId];
    if (!currentCanvas) return;
    
    const nodesToHighlight = new Set();
    nodesToHighlight.add(matilhaId); // Adicionar a própria matilha
    
    // Encontrar nós conectados diretamente à matilha
    currentCanvas.edges.forEach(edge => {
      if (edge.source === matilhaId) {
        nodesToHighlight.add(edge.target);
      }
      if (edge.target === matilhaId) {
        nodesToHighlight.add(edge.source);
      }
    });
    
    // Encontrar nós conectados indiretamente (filhos dos filhos)
    let hasChanges = true;
    while (hasChanges) {
      hasChanges = false;
      currentCanvas.edges.forEach(edge => {
        if (nodesToHighlight.has(edge.source) && !nodesToHighlight.has(edge.target)) {
          nodesToHighlight.add(edge.target);
          hasChanges = true;
        }
        if (nodesToHighlight.has(edge.target) && !nodesToHighlight.has(edge.source)) {
          nodesToHighlight.add(edge.source);
          hasChanges = true;
        }
      });
    }
    
    setHighlightedNodes(nodesToHighlight);
  };

  const handleBackToMain = () => {
    setCurrentCanvasId('main');
  };

  const handleCanvasUpdate = (nodes, edges) => {
    setCanvases(prev => ({
      ...prev,
      [currentCanvasId]: {
        ...prev[currentCanvasId],
        nodes,
        edges
      }
    }));
    
    // Salvar estado do canvas no localStorage
    saveCanvasState(currentCanvasId, nodes, edges);
  };

  const handleAnimalUpdate = (animalId, animalData) => {
    setCanvases(prev => {
      const updatedCanvas = {
        ...prev[currentCanvasId],
        nodes: prev[currentCanvasId].nodes.map(node => 
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
        ),
        edges: prev[currentCanvasId].edges
      };
      
      // Salvar estado atualizado no localStorage
      saveCanvasState(currentCanvasId, updatedCanvas.nodes, updatedCanvas.edges);
      
      return {
        ...prev,
        [currentCanvasId]: updatedCanvas
      };
    });
  };

  const handleSaveSVG = (canvasId) => {
    // Esta função será implementada no FlowCanvas
    // Por enquanto, vamos apenas passar a referência
    if (window.saveCanvasAsSVG) {
      window.saveCanvasAsSVG(canvasId);
    }
  };

  const currentCanvas = canvases[currentCanvasId];

  // Verificar se o canvas atual existe
  if (!currentCanvas) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>PetFlow</h1>
        {currentCanvasId !== 'main' && (
          <button className="back-button" onClick={handleBackToMain}>
            ← Voltar ao Canvas Principal
          </button>
        )}
      </header>
      
      <div className="main-container">
        <FlowCanvas
          nodes={currentCanvas.nodes}
          edges={currentCanvas.edges}
          onUpdate={handleCanvasUpdate}
          onMatilhaClick={handleMatilhaClick}
          onAnimalUpdate={handleAnimalUpdate}
          canvasId={currentCanvasId}
          highlightedNodes={highlightedNodes}
        />
        {/* Debug */}
        {console.log('App - highlightedNodes:', highlightedNodes)}
        <ControlPanel
          canvases={canvases}
          currentCanvasId={currentCanvasId}
          onCanvasSelect={setCurrentCanvasId}
          onMatilhaClick={handleMatilhaClick}
          onMatilhaHighlight={handleMatilhaHighlight}
          onSaveSVG={() => handleSaveSVG(currentCanvasId)}
        />
      </div>
    </div>
  );
}

export default App;
