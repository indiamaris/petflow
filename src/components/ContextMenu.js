import React from 'react';
import './ContextMenu.css';

const ARTIFACT_TYPES = [
  { id: 'matilha', type: 'matilha', label: 'Matilha', color: '#ff6b6b', shape: 'square' },
  { id: 'chihuahua', type: 'animal', label: 'Chihuahua', color: '#4ecdc4', shape: 'circle' },
  { id: 'labrador', type: 'animal', label: 'Labrador', color: '#45b7d1', shape: 'triangle' },
  { id: 'golden', type: 'animal', label: 'Golden Retriever', color: '#96ceb4', shape: 'diamond' },
  { id: 'bulldog', type: 'animal', label: 'Bulldog', color: '#feca57', shape: 'hexagon' },
  { id: 'poodle', type: 'animal', label: 'Poodle', color: '#ff9ff3', shape: 'star' },
  { id: 'beagle', type: 'animal', label: 'Beagle', color: '#54a0ff', shape: 'circle' },
  { id: 'rottweiler', type: 'animal', label: 'Rottweiler', color: '#5f27cd', shape: 'square' },
  { id: 'doberman', type: 'animal', label: 'Doberman', color: '#ff6348', shape: 'triangle' },
  { id: 'husky', type: 'animal', label: 'Husky Siberiano', color: '#8b4513', shape: 'diamond' },
  { id: 'pastor-alemao', type: 'animal', label: 'Pastor Alemão', color: '#2c3e50', shape: 'hexagon' },
  { id: 'boxer', type: 'animal', label: 'Boxer', color: '#f39c12', shape: 'star' }
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
                    {artifact.id === 'matilha' ? '🏠' : '🐕'}
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
