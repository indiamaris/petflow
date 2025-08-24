// Configuração dos 12 artefatos com diferentes formas e cores
const ARTIFACTS_CONFIG = [
  {
    id: 'matilha-1',
    type: 'matilha',
    label: 'Matilha Principal',
    color: '#ff6b6b',
    shape: 'square',
    position: { x: 400, y: 100 }
  },
  {
    id: 'chihuahua',
    type: 'animal',
    label: 'Chihuahua',
    animalName: 'Tiny',
    apelido: 'Tininho',
    peso: '2.5',
    idade: '2',
    responsavel: 'India',
    color: '#4ecdc4',
    shape: 'circle',
    position: { x: 200, y: 250 }
  },
  {
    id: 'labrador',
    type: 'animal',
    label: 'Labrador',
    animalName: 'Buddy',
    apelido: 'Buddy',
    peso: '28.0',
    idade: '4',
    responsavel: 'Judith',
    color: '#45b7d1',
    shape: 'triangle',
    position: { x: 400, y: 250 }
  },
  {
    id: 'golden',
    type: 'animal',
    label: 'Golden Retriever',
    animalName: 'Max',
    color: '#96ceb4',
    shape: 'diamond',
    position: { x: 600, y: 250 }
  },
  {
    id: 'bulldog',
    type: 'animal',
    label: 'Bulldog',
    animalName: 'Rocky',
    color: '#feca57',
    shape: 'hexagon',
    position: { x: 200, y: 400 }
  },
  {
    id: 'poodle',
    type: 'animal',
    label: 'Poodle',
    animalName: 'Luna',
    color: '#ff9ff3',
    shape: 'star',
    position: { x: 400, y: 400 }
  },
  {
    id: 'beagle',
    type: 'animal',
    label: 'Beagle',
    animalName: 'Charlie',
    color: '#54a0ff',
    shape: 'circle',
    position: { x: 600, y: 400 }
  },
  {
    id: 'rottweiler',
    type: 'animal',
    label: 'Rottweiler',
    animalName: 'Bear',
    color: '#5f27cd',
    shape: 'square',
    position: { x: 200, y: 550 }
  },
  {
    id: 'doberman',
    type: 'animal',
    label: 'Doberman',
    animalName: 'Shadow',
    color: '#ff6348',
    shape: 'triangle',
    position: { x: 400, y: 550 }
  },
  {
    id: 'husky',
    type: 'animal',
    label: 'Husky Siberiano',
    animalName: 'Storm',
    color: '#8b4513',
    shape: 'diamond',
    position: { x: 600, y: 550 }
  },
  {
    id: 'pastor-alemao',
    type: 'animal',
    label: 'Pastor Alemão',
    animalName: 'Rex',
    color: '#2c3e50',
    shape: 'hexagon',
    position: { x: 300, y: 700 }
  },
  {
    id: 'boxer',
    type: 'animal',
    label: 'Boxer',
    animalName: 'Tyson',
    color: '#f39c12',
    shape: 'star',
    position: { x: 500, y: 700 }
  }
];

// Nomes únicos para novos cachorros
const ANIMAL_NAMES = [
  'Buddy', 'Max', 'Luna', 'Rocky', 'Bella', 'Charlie', 'Lucy', 'Cooper',
  'Daisy', 'Bear', 'Molly', 'Duke', 'Sophie', 'Jack', 'Ruby', 'Oliver',
  'Chloe', 'Tucker', 'Penny', 'Winston', 'Lola', 'Murphy', 'Zoe', 'Finn',
  'Shadow', 'Storm', 'Tyson', 'Rex', 'Tiny', 'Apollo', 'Nova', 'Zeus'
];

// Configuração para matilhas específicas (sub-canvases)
const MATILHA_CONFIGS = {
  '1': [
    {
      id: 'matilha-1-sub',
      type: 'matilha',
      label: 'Sub-Matilha 1',
      color: '#e74c3c',
      shape: 'square',
      position: { x: 300, y: 100 }
    },
    {
      id: 'chihuahua-sub',
      type: 'animal',
      label: 'Chihuahua Filhote',
      animalName: 'Tiny',
      color: '#1abc9c',
      shape: 'circle',
      position: { x: 200, y: 250 }
    },
    {
      id: 'labrador-sub',
      type: 'animal',
      label: 'Labrador Filhote',
      animalName: 'Buddy',
      color: '#3498db',
      shape: 'triangle',
      position: { x: 400, y: 250 }
    }
  ]
};

export const generateInitialNodes = (matilhaId = null) => {
  if (matilhaId && MATILHA_CONFIGS[matilhaId]) {
    return MATILHA_CONFIGS[matilhaId].map(artifact => ({
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

export const generateInitialEdges = (matilhaId = null) => {
  if (matilhaId && MATILHA_CONFIGS[matilhaId]) {
    return [
      {
        id: 'e1-sub',
        source: 'matilha-1-sub',
        target: 'chihuahua-sub',
        type: 'smoothstep',
        animated: true,
        style: { stroke: '#e74c3c', strokeWidth: 2 }
      },
      {
        id: 'e2-sub',
        source: 'matilha-1-sub',
        target: 'labrador-sub',
        type: 'smoothstep',
        animated: true,
        style: { stroke: '#e74c3c', strokeWidth: 2 }
      }
    ];
  }
  
  return [
    {
      id: 'e1',
      source: 'matilha-1',
      target: 'chihuahua',
      type: 'smoothstep',
      animated: true,
      style: { stroke: '#ff6b6b', strokeWidth: 3 }
    },
    {
      id: 'e2',
      source: 'matilha-1',
      target: 'labrador',
      type: 'smoothstep',
      animated: true,
      style: { stroke: '#ff6b6b', strokeWidth: 3 }
    },
    {
      id: 'e3',
      source: 'matilha-1',
      target: 'golden',
      type: 'smoothstep',
      animated: true,
      style: { stroke: '#ff6b6b', strokeWidth: 3 }
    },
    {
      id: 'e4',
      source: 'chihuahua',
      target: 'bulldog',
      type: 'smoothstep',
      animated: false,
      style: { stroke: '#4ecdc4', strokeWidth: 2 }
    },
    {
      id: 'e5',
      source: 'labrador',
      target: 'poodle',
      type: 'smoothstep',
      animated: false,
      style: { stroke: '#45b7d1', strokeWidth: 2 }
    },
    {
      id: 'e6',
      source: 'golden',
      target: 'beagle',
      type: 'smoothstep',
      animated: false,
      style: { stroke: '#96ceb4', strokeWidth: 2 }
    },
    {
      id: 'e7',
      source: 'bulldog',
      target: 'rottweiler',
      type: 'smoothstep',
      animated: false,
      style: { stroke: '#feca57', strokeWidth: 2 }
    },
    {
      id: 'e8',
      source: 'poodle',
      target: 'doberman',
      type: 'smoothstep',
      animated: false,
      style: { stroke: '#ff9ff3', strokeWidth: 2 }
    },
    {
      id: 'e9',
      source: 'beagle',
      target: 'husky',
      type: 'smoothstep',
      animated: false,
      style: { stroke: '#54a0ff', strokeWidth: 2 }
    },
    {
      id: 'e10',
      source: 'rottweiler',
      target: 'pastor-alemao',
      type: 'smoothstep',
      animated: false,
      style: { stroke: '#5f27cd', strokeWidth: 2 }
    },
    {
      id: 'e11',
      source: 'doberman',
      target: 'boxer',
      type: 'smoothstep',
      animated: false,
      style: { stroke: '#ff6348', strokeWidth: 2 }
    }
  ];
};
