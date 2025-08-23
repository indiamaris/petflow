import React, { useState } from 'react';
import './App.css';
import FlowCanvas from './components/FlowCanvas';
import ControlPanel from './components/ControlPanel';
import { generateInitialNodes, generateInitialEdges } from './utils/flow-utils';

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
  };

  const handleAnimalUpdate = (animalId, animalData) => {
    setCanvases(prev => ({
      ...prev,
      [currentCanvasId]: {
        ...prev[currentCanvasId],
        nodes: prev[currentCanvasId].nodes.map(node => 
          node.id === animalId 
            ? { ...node, data: { ...node.data, ...animalData } }
            : node
        ),
        edges: prev[currentCanvasId].edges
      }
    }));
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
        />
      </div>
    </div>
  );
}

export default App;
