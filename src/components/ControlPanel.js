import React, { useState } from 'react';
import './ControlPanel.css';
import DataManager from './DataManager';

const ControlPanel = ({ canvases, currentCanvasId, onCanvasSelect, onGranjaClick, onGranjaHighlight, onSaveSVG }) => {
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
            onClick={() => onCanvasSelect(canvasId)}
          >
            {canvas.name}
          </span>
          
          {canvas.parentId && (
            <button 
              className="granja-button"
              onClick={() => onGranjaClick(canvasId.replace('granja-', ''))}
              onMouseEnter={() => onGranjaHighlight(canvasId.replace('granja-', ''))}
              onMouseLeave={() => onGranjaHighlight(null)}
              title="Abrir Granja"
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
        <p>Artefatos Granjas</p>
      </div>
      
      <div className="tree-container">
        {renderTreeNode('main')}
      </div>
      
      <div className="granja-summary">
        <h4>Resumo das Granjas</h4>
        <div className="granja-count">
          Total de Granjas: {getGranjaNodes().length}
        </div>
        {getGranjaNodes().map(granja => (
          <div key={granja.id} className="granja-item">
            <span>{granja.name}</span>
            <button 
              className="open-granja-btn"
              onClick={() => onGranjaClick(granja.id.replace('granja-', ''))}
              onMouseEnter={() => onGranjaHighlight(granja.id.replace('granja-', ''))}
              onMouseLeave={() => onGranjaHighlight(null)}
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
