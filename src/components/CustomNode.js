import React from 'react';
import { Handle } from '@xyflow/react';
import './CustomNode.css';

const CustomNode = ({ data, selected }) => {
  const { label, type, animalName, color, shape } = data;
  
  const getShapeStyle = () => {
    const baseStyle = {
      backgroundColor: color,
      border: selected ? '3px solid #61dafb' : '2px solid #fff',
      boxShadow: selected ? '0 0 0 3px rgba(97, 218, 251, 0.3)' : '0 2px 8px rgba(0, 0, 0, 0.15)'
    };

    switch (shape) {
      case 'circle':
        return { ...baseStyle, borderRadius: '50%' };
      case 'square':
        return { ...baseStyle, borderRadius: '8px' };
      case 'triangle':
        return { ...baseStyle, clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' };
      case 'diamond':
        return { ...baseStyle, transform: 'rotate(45deg)' };
      case 'hexagon':
        return { ...baseStyle, clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)' };
      case 'star':
        return { ...baseStyle, clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)' };
      default:
        return baseStyle;
    }
  };

  const getLabelStyle = () => {
    if (shape === 'triangle' || shape === 'diamond') {
      return { transform: 'rotate(-45deg)' };
    }
    return {};
  };

  return (
    <div className={`custom-node ${type} ${selected ? 'selected' : ''}`}>
      <Handle
        type="target"
        position="top"
        style={{ background: '#555' }}
      />
      
      <div className="node-content" style={getShapeStyle()}>
        <div className="node-label" style={getLabelStyle()}>
          {type === 'granja' ? label : animalName}
        </div>
        {type === 'animal' && (
          <div className="animal-type" style={getLabelStyle()}>
            {label}
          </div>
        )}
      </div>
      
      <Handle
        type="source"
        position="bottom"
        style={{ background: '#555' }}
      />
    </div>
  );
};

export default CustomNode;
