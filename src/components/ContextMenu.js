import React from 'react';
import './ContextMenu.css';

const ARTIFACT_TYPES = [
  { id: 'granja', type: 'granja', label: 'Granja', color: '#ff6b6b', shape: 'square' },
  { id: 'cachorro', type: 'animal', label: 'Cachorro', color: '#4ecdc4', shape: 'circle' },
  { id: 'gato', type: 'animal', label: 'Gato', color: '#45b7d1', shape: 'triangle' },
  { id: 'passarinho', type: 'animal', label: 'Passarinho', color: '#96ceb4', shape: 'diamond' },
  { id: 'coelho', type: 'animal', label: 'Coelho', color: '#feca57', shape: 'hexagon' },
  { id: 'hamster', type: 'animal', label: 'Hamster', color: '#ff9ff3', shape: 'star' },
  { id: 'peixe', type: 'animal', label: 'Peixe', color: '#54a0ff', shape: 'circle' },
  { id: 'tartaruga', type: 'animal', label: 'Tartaruga', color: '#5f27cd', shape: 'square' },
  { id: 'porquinho', type: 'animal', label: 'Porquinho', color: '#ff6348', shape: 'triangle' },
  { id: 'cavalo', type: 'animal', label: 'Cavalo', color: '#8b4513', shape: 'diamond' },
  { id: 'vaca', type: 'animal', label: 'Vaca', color: '#2c3e50', shape: 'hexagon' },
  { id: 'galinha', type: 'animal', label: 'Galinha', color: '#f39c12', shape: 'star' }
];

const ContextMenu = ({ position, onClose, onCreateArtifact, sourceNode }) => {
  if (!position) return null;

  const handleCreateArtifact = (artifactType) => {
    if (onCreateArtifact) {
      onCreateArtifact(artifactType, position);
    }
    onClose();
  };

  const handleClickOutside = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="context-menu-overlay" onClick={handleClickOutside}>
      <div 
        className="context-menu"
        style={{ 
          left: position.x, 
          top: position.y 
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="context-menu-header">
          <h4>Criar Novo Artefato</h4>
          <button className="close-context-menu" onClick={onClose}>
            ×
          </button>
        </div>
        
        <div className="context-menu-content">
          <p className="context-menu-description">
            {sourceNode 
              ? `Criar novo artefato conectado a "${sourceNode.data.label || sourceNode.data.animalName}":`
              : 'Criar novo artefato:'
            }
          </p>
          
          <div className="artifact-types-grid">
            {ARTIFACT_TYPES.map((artifact) => (
              <div
                key={artifact.id}
                className="artifact-type-item"
                onClick={() => handleCreateArtifact(artifact)}
              >
                <div 
                  className="artifact-preview"
                  style={{ 
                    backgroundColor: artifact.color,
                    clipPath: getShapeClipPath(artifact.shape)
                  }}
                >
                  <span className="artifact-icon">
                    {artifact.id === 'granja' ? '🏠' : '🐾'}
                  </span>
                </div>
                <span className="artifact-label">{artifact.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Função para gerar o clip-path baseado na forma
const getShapeClipPath = (shape) => {
  switch (shape) {
    case 'circle':
      return 'circle(50% at 50% 50%)';
    case 'square':
      return 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)';
    case 'triangle':
      return 'polygon(50% 0%, 0% 100%, 100% 100%)';
    case 'diamond':
      return 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)';
    case 'hexagon':
      return 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)';
    case 'star':
      return 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)';
    default:
      return 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)';
  }
};

export default ContextMenu;
