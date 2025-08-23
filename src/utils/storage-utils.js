// Chaves para o localStorage
const STORAGE_KEYS = {
  ANIMALS_DATA: 'petflow_animals_data',
  GRANJAS_DATA: 'petflow_granjas_data',
  CANVAS_STATE: 'petflow_canvas_state'
};

// Função para salvar dados dos animais
export const saveAnimalData = (animalId, animalData) => {
  try {
    const existingData = getAnimalsData();
    existingData[animalId] = {
      ...existingData[animalId],
      ...animalData,
      lastUpdated: new Date().toISOString()
    };
    
    localStorage.setItem(STORAGE_KEYS.ANIMALS_DATA, JSON.stringify(existingData));
    return true;
  } catch (error) {
    console.error('Erro ao salvar dados do animal:', error);
    return false;
  }
};

// Função para obter dados dos animais
export const getAnimalsData = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.ANIMALS_DATA);
    return data ? JSON.parse(data) : {};
  } catch (error) {
    console.error('Erro ao obter dados dos animais:', error);
    return {};
  }
};

// Função para obter dados de um animal específico
export const getAnimalData = (animalId) => {
  const animalsData = getAnimalsData();
  return animalsData[animalId] || null;
};

// Função para salvar dados das granjas
export const saveGranjaData = (granjaId, granjaData) => {
  try {
    const existingData = getGranjasData();
    existingData[granjaId] = {
      ...existingData[granjaId],
      ...granjaData,
      lastUpdated: new Date().toISOString()
    };
    
    localStorage.setItem(STORAGE_KEYS.GRANJAS_DATA, JSON.stringify(existingData));
    return true;
  } catch (error) {
    console.error('Erro ao salvar dados da granja:', error);
    return false;
  }
};

// Função para obter dados das granjas
export const getGranjasData = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.GRANJAS_DATA);
    return data ? JSON.parse(data) : {};
  } catch (error) {
    console.error('Erro ao obter dados das granjas:', error);
    return {};
  }
};

// Função para salvar estado do canvas
export const saveCanvasState = (canvasId, nodes, edges) => {
  try {
    const existingData = getCanvasState();
    existingData[canvasId] = {
      nodes,
      edges,
      lastUpdated: new Date().toISOString()
    };
    
    localStorage.setItem(STORAGE_KEYS.CANVAS_STATE, JSON.stringify(existingData));
    return true;
  } catch (error) {
    console.error('Erro ao salvar estado do canvas:', error);
    return false;
  }
};

// Função para obter estado do canvas
export const getCanvasState = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.CANVAS_STATE);
    return data ? JSON.parse(data) : {};
  } catch (error) {
    console.error('Erro ao obter estado do canvas:', error);
    return {};
  }
};

// Função para limpar todos os dados
export const clearAllData = () => {
  try {
    localStorage.removeItem(STORAGE_KEYS.ANIMALS_DATA);
    localStorage.removeItem(STORAGE_KEYS.GRANJAS_DATA);
    localStorage.removeItem(STORAGE_KEYS.CANVAS_STATE);
    return true;
  } catch (error) {
    console.error('Erro ao limpar dados:', error);
    return false;
  }
};

// Função para exportar todos os dados
export const exportAllData = () => {
  try {
    const data = {
      animals: getAnimalsData(),
      granjas: getGranjasData(),
      canvas: getCanvasState(),
      exportedAt: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `petflow_data_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    return true;
  } catch (error) {
    console.error('Erro ao exportar dados:', error);
    return false;
  }
};

// Função para importar dados
export const importData = (jsonData) => {
  try {
    const data = JSON.parse(jsonData);
    
    if (data.animals) {
      localStorage.setItem(STORAGE_KEYS.ANIMALS_DATA, JSON.stringify(data.animals));
    }
    
    if (data.granjas) {
      localStorage.setItem(STORAGE_KEYS.GRANJAS_DATA, JSON.stringify(data.granjas));
    }
    
    if (data.canvas) {
      localStorage.setItem(STORAGE_KEYS.CANVAS_STATE, JSON.stringify(data.canvas));
    }
    
    return true;
  } catch (error) {
    console.error('Erro ao importar dados:', error);
    return false;
  }
};
