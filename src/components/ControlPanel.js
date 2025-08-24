import React, { useState } from 'react';
import './ControlPanel.css';
import DataManager from './DataManager';

const ControlPanel = ({ canvases, currentCanvasId, onCanvasSelect, onMatilhaClick, onMatilhaHighlight, onSaveSVG }) => {
  const [expandedNodes, setExpandedNodes] = useState(new Set(['main']));

  const toggleNode = (nodeId) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId);
    } else {
      newExpanded.add(nodeId);
    }
    setExpandedNodes(newExpanded);
  };

  const renderTreeNode = (canvasId, level = 0) => {
    const canvas = canvases[canvasId];
    if (!canvas) return null;

    const isExpanded = expandedNodes.has(canvasId);
    const hasChildren = Object.keys(canvases).some(id => 
      id !== canvasId && canvases[id].parentId === canvasId
    );

    return (
      <div key={canvasId} className="tree-node">
        <div 
          className={`tree-item ${currentCanvasId === canvasId ? 'active' : ''}`}
          style={{ paddingLeft: `${level * 20 + 10}px` }}
        >
          {hasChildren && (
            <button 
              className={`expand-button ${isExpanded ? 'expanded' : ''}`}
              onClick={() => toggleNode(canvasId)}
            >
              {isExpanded ? '▼' : '▶'}
            </button>
          )}
          
          <span 
            className="canvas-name"
            onClick={() => {
              if (canvas.parentId) {
                // Se for uma matilha, aplicar highlight
                onMatilhaHighlight(canvasId.replace('matilha-', ''));
              } else {
                // Se for o canvas principal, selecionar
                onCanvasSelect(canvasId);
              }
            }}
          >
            {canvas.name}
          </span>
          
          {canvas.parentId && (
            <button 
              className="matilha-button"
              onClick={() => onMatilhaClick(canvasId.replace('matilha-', ''))}
              onMouseEnter={() => onMatilhaHighlight(canvasId.replace('matilha-', ''))}
              onMouseLeave={() => onMatilhaHighlight(null)}
              onMouseDown={() => onMatilhaHighlight(canvasId.replace('matilha-', ''))}
              title="Abrir Matilha"
            >
              🏠
            </button>
          )}
        </div>
        
        {isExpanded && hasChildren && (
          <div className="tree-children">
            {Object.keys(canvases)
              .filter(id => canvases[id].parentId === canvasId)
              .map(childId => renderTreeNode(childId, level + 1))
            }
          </div>
        )}
      </div>
    );
  };

  const getGranjaNodes = () => {
    return Object.values(canvases).filter(canvas => 
      canvas.parentId === 'main'
    );
  };

  return (
    <div className="control-panel">
      <div className="panel-header">
        <h3>Painel de Controle</h3>
        <p>Artefatos Matilhas</p>
      </div>
      
      <div className="tree-container">
        {renderTreeNode('main')}
      </div>
      
      <div className="matilha-summary">
        <h4>Resumo das Matilhas</h4>
        <div className="matilha-count">
          Total de Matilhas: {getGranjaNodes().length}
        </div>
        {getGranjaNodes().map(granja => (
          <div key={granja.id} className="matilha-item">
            <span 
              className="matilha-name"
              onClick={() => onMatilhaHighlight(granja.id.replace('matilha-', ''))}
              title="Clique para destacar no canvas"
            >
              {granja.name}
            </span>
            <button 
              className="open-matilha-btn"
              onClick={() => onMatilhaClick(granja.id.replace('matilha-', ''))}
              onMouseEnter={() => onMatilhaHighlight(granja.id.replace('matilha-', ''))}
              onMouseLeave={() => onMatilhaHighlight(null)}
              onMouseDown={() => onMatilhaHighlight(granja.id.replace('matilha-', ''))}
            >
              Abrir
            </button>
          </div>
        ))}
      </div>
      
      <DataManager onSaveSVG={onSaveSVG} />
    </div>
  );
};

export default ControlPanel;
