// Configuração dos 12 artefatos com diferentes formas e cores
const ARTIFACTS_CONFIG = [
  {
    id: 'granja-1',
    type: 'granja',
    label: 'Granja Principal',
    color: '#ff6b6b',
    shape: 'square',
    position: { x: 400, y: 100 }
  },
  {
    id: 'cachorro',
    type: 'animal',
    label: 'Cachorro',
    animalName: 'Rex',
    color: '#4ecdc4',
    shape: 'circle',
    position: { x: 200, y: 250 }
  },
  {
    id: 'gato',
    type: 'animal',
    label: 'Gato',
    animalName: 'Mia',
    color: '#45b7d1',
    shape: 'triangle',
    position: { x: 400, y: 250 }
  },
  {
    id: 'passarinho',
    type: 'animal',
    label: 'Passarinho',
    animalName: 'Piu',
    color: '#96ceb4',
    shape: 'diamond',
    position: { x: 600, y: 250 }
  },
  {
    id: 'coelho',
    type: 'animal',
    label: 'Coelho',
    animalName: 'Bunny',
    color: '#feca57',
    shape: 'hexagon',
    position: { x: 200, y: 400 }
  },
  {
    id: 'hamster',
    type: 'animal',
    label: 'Hamster',
    animalName: 'Nibbles',
    color: '#ff9ff3',
    shape: 'star',
    position: { x: 400, y: 400 }
  },
  {
    id: 'peixe',
    type: 'animal',
    label: 'Peixe',
    animalName: 'Bubbles',
    color: '#54a0ff',
    shape: 'circle',
    position: { x: 600, y: 400 }
  },
  {
    id: 'tartaruga',
    type: 'animal',
    label: 'Tartaruga',
    animalName: 'Shelly',
    color: '#5f27cd',
    shape: 'square',
    position: { x: 200, y: 550 }
  },
  {
    id: 'porquinho',
    type: 'animal',
    label: 'Porquinho',
    animalName: 'Piggy',
    color: '#ff6348',
    shape: 'triangle',
    position: { x: 400, y: 550 }
  },
  {
    id: 'cavalo',
    type: 'animal',
    label: 'Cavalo',
    animalName: 'Thunder',
    color: '#8b4513',
    shape: 'diamond',
    position: { x: 600, y: 550 }
  },
  {
    id: 'vaca',
    type: 'animal',
    label: 'Vaca',
    animalName: 'Bessie',
    color: '#2c3e50',
    shape: 'hexagon',
    position: { x: 300, y: 700 }
  },
  {
    id: 'galinha',
    type: 'animal',
    label: 'Galinha',
    animalName: 'Cluck',
    color: '#f39c12',
    shape: 'star',
    position: { x: 500, y: 700 }
  }
];

// Configuração para granjas específicas (sub-canvases)
const GRANJA_CONFIGS = {
  '1': [
    {
      id: 'granja-1-sub',
      type: 'granja',
      label: 'Sub-Granja 1',
      color: '#e74c3c',
      shape: 'square',
      position: { x: 300, y: 100 }
    },
    {
      id: 'cachorro-sub',
      type: 'animal',
      label: 'Cachorro Filhote',
      animalName: 'Max',
      color: '#1abc9c',
      shape: 'circle',
      position: { x: 200, y: 250 }
    },
    {
      id: 'gato-sub',
      type: 'animal',
      label: 'Gato Filhote',
      animalName: 'Luna',
      color: '#3498db',
      shape: 'triangle',
      position: { x: 400, y: 250 }
    }
  ]
};

export const generateInitialNodes = (granjaId = null) => {
  if (granjaId && GRANJA_CONFIGS[granjaId]) {
    return GRANJA_CONFIGS[granjaId].map(artifact => ({
      id: artifact.id,
      type: 'custom',
      position: artifact.position,
      data: artifact
    }));
  }
  
  return ARTIFACTS_CONFIG.map(artifact => ({
    id: artifact.id,
    type: 'custom',
    position: artifact.position,
    data: artifact
  }));
};

export const generateInitialEdges = (granjaId = null) => {
  if (granjaId && GRANJA_CONFIGS[granjaId]) {
    return [
      {
        id: 'e1-sub',
        source: 'granja-1-sub',
        target: 'cachorro-sub',
        type: 'smoothstep',
        animated: true,
        style: { stroke: '#e74c3c', strokeWidth: 2 }
      },
      {
        id: 'e2-sub',
        source: 'granja-1-sub',
        target: 'gato-sub',
        type: 'smoothstep',
        animated: true,
        style: { stroke: '#e74c3c', strokeWidth: 2 }
      }
    ];
  }
  
  return [
    {
      id: 'e1',
      source: 'granja-1',
      target: 'cachorro',
      type: 'smoothstep',
      animated: true,
      style: { stroke: '#ff6b6b', strokeWidth: 3 }
    },
    {
      id: 'e2',
      source: 'granja-1',
      target: 'gato',
      type: 'smoothstep',
      animated: true,
      style: { stroke: '#ff6b6b', strokeWidth: 3 }
    },
    {
      id: 'e3',
      source: 'granja-1',
      target: 'passarinho',
      type: 'smoothstep',
      animated: true,
      style: { stroke: '#ff6b6b', strokeWidth: 3 }
    },
    {
      id: 'e4',
      source: 'cachorro',
      target: 'coelho',
      type: 'smoothstep',
      animated: false,
      style: { stroke: '#4ecdc4', strokeWidth: 2 }
    },
    {
      id: 'e5',
      source: 'gato',
      target: 'hamster',
      type: 'smoothstep',
      animated: false,
      style: { stroke: '#45b7d1', strokeWidth: 2 }
    },
    {
      id: 'e6',
      source: 'passarinho',
      target: 'peixe',
      type: 'smoothstep',
      animated: false,
      style: { stroke: '#96ceb4', strokeWidth: 2 }
    },
    {
      id: 'e7',
      source: 'coelho',
      target: 'tartaruga',
      type: 'smoothstep',
      animated: false,
      style: { stroke: '#feca57', strokeWidth: 2 }
    },
    {
      id: 'e8',
      source: 'hamster',
      target: 'porquinho',
      type: 'smoothstep',
      animated: false,
      style: { stroke: '#ff9ff3', strokeWidth: 2 }
    },
    {
      id: 'e9',
      source: 'peixe',
      target: 'cavalo',
      type: 'smoothstep',
      animated: false,
      style: { stroke: '#54a0ff', strokeWidth: 2 }
    },
    {
      id: 'e10',
      source: 'tartaruga',
      target: 'vaca',
      type: 'smoothstep',
      animated: false,
      style: { stroke: '#5f27cd', strokeWidth: 2 }
    },
    {
      id: 'e11',
      source: 'porquinho',
      target: 'galinha',
      type: 'smoothstep',
      animated: false,
      style: { stroke: '#ff6348', strokeWidth: 2 }
    }
  ];
};
