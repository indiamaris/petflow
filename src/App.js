import React, { useState, useEffect } from 'react';
import './App.css';
import FlowCanvas from './components/FlowCanvas';
import ControlPanel from './components/ControlPanel';
import { generateInitialNodes, generateInitialEdges } from './utils/flow-utils';
import { getCanvasState, saveCanvasState, getAnimalsData } from './utils/storage-utils';

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

  const handleGranjaClick = (granjaId) => {
    const newCanvasId = `granja-${granjaId}`;
    
    if (!canvases[newCanvasId]) {
      // Criar novo canvas para esta granja
      const newCanvas = {
        id: newCanvasId,
        name: `Granja ${granjaId}`,
        nodes: generateInitialNodes(granjaId),
        edges: generateInitialEdges(granjaId),
        parentId: currentCanvasId
      };
      
      setCanvases(prev => ({
        ...prev,
        [newCanvasId]: newCanvas
      }));
    }
    
    setCurrentCanvasId(newCanvasId);
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
          onGranjaClick={handleGranjaClick}
          onAnimalUpdate={handleAnimalUpdate}
          canvasId={currentCanvasId}
        />
        <ControlPanel
          canvases={canvases}
          currentCanvasId={currentCanvasId}
          onCanvasSelect={setCurrentCanvasId}
          onGranjaClick={handleGranjaClick}
          onSaveSVG={() => handleSaveSVG(currentCanvasId)}
        />
      </div>
    </div>
  );
}

export default App;
