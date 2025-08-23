// Configurações do React Flow
export const FLOW_CONFIG = {
  // Configurações de conexão
  connectionMode: 'loose',
  defaultEdgeOptions: {
    type: 'smoothstep',
    animated: false,
    style: {
      stroke: '#666',
      strokeWidth: 2
    }
  },
  
  // Configurações de seleção
  selectionMode: 'full',
  selectionOnDrag: true,
  
  // Configurações de zoom e pan
  minZoom: 0.1,
  maxZoom: 2,
  zoomOnScroll: true,
  panOnScroll: false,
  panOnScrollMode: 'free',
  
  // Configurações de snap
  snapToGrid: true,
  snapGrid: [15, 15],
  
  // Configurações de validação
  onConnectStart: () => {},
  onConnectEnd: () => {},
  
  // Configurações de acessibilidade
  ariaLabel: 'PetFlow - Canvas de Artefatos de Animais',
  
  // Configurações de performance
  nodesDraggable: true,
  nodesConnectable: true,
  elementsSelectable: true,
  
  // Configurações de estilo
  fitView: true,
  fitViewOptions: {
    padding: 0.1,
    includeHiddenNodes: false
  }
};

// Configurações dos nós personalizados
export const NODE_CONFIG = {
  granja: {
    minWidth: 120,
    minHeight: 80,
    draggable: true,
    selectable: true,
    deletable: false
  },
  animal: {
    minWidth: 100,
    minHeight: 60,
    draggable: true,
    selectable: true,
    deletable: true
  }
};

// Configurações das conexões
export const EDGE_CONFIG = {
  default: {
    type: 'smoothstep',
    animated: false,
    style: { stroke: '#666', strokeWidth: 2 }
  },
  granja: {
    type: 'smoothstep',
    animated: true,
    style: { stroke: '#ff6b6b', strokeWidth: 3 }
  },
  animal: {
    type: 'smoothstep',
    animated: false,
    style: { stroke: '#4ecdc4', strokeWidth: 2 }
  }
};
