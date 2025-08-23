import React, { useState, useEffect } from 'react';
import './AnimalDetailsPanel.css';
import { saveAnimalData, getAnimalData } from '../utils/storage-utils';

const AnimalDetailsPanel = ({ animal, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    nome: '',
    apelido: '',
    peso: '',
    idade: '',
    responsavel: ''
  });

  const responsaveis = ['India', 'Judith', 'James', 'Adilson'];

  useEffect(() => {
    if (animal) {
      // Tentar carregar dados salvos do localStorage
      const savedData = getAnimalData(animal.id);
      
      setFormData({
        nome: savedData?.nome || animal.data.animalName || '',
        apelido: savedData?.apelido || animal.data.apelido || '',
        peso: savedData?.peso || animal.data.peso || '',
        idade: savedData?.idade || animal.data.idade || '',
        responsavel: savedData?.responsavel || animal.data.responsavel || ''
      });
    }
  }, [animal]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (animal) {
      // Salvar no localStorage
      const success = saveAnimalData(animal.id, formData);
      
      if (success) {
        // Atualizar o estado global
        if (onSave) {
          onSave(animal.id, formData);
        }
        
        // Mostrar mensagem de sucesso
        alert('Dados salvos com sucesso!');
      } else {
        alert('Erro ao salvar dados. Tente novamente.');
      }
    }
  };

  const handleClose = () => {
    onClose();
  };

  if (!isOpen || !animal) {
    return null;
  }

  return (
    <div className="animal-details-panel">
      <div className="panel-header">
        <h3>Detalhes do {animal.data.label}</h3>
        <button className="close-button" onClick={handleClose}>
          ×
        </button>
      </div>
      
      <div className="animal-info">
        <div className="animal-avatar" style={{ backgroundColor: animal.data.color }}>
          <span>{animal.data.animalName?.charAt(0) || 'A'}</span>
        </div>
        <h4>{animal.data.animalName}</h4>
        <p className="animal-type">{animal.data.label}</p>
      </div>

      <form onSubmit={handleSubmit} className="animal-form">
        <div className="form-group">
          <label htmlFor="nome">Nome:</label>
          <input
            type="text"
            id="nome"
            name="nome"
            value={formData.nome}
            onChange={handleInputChange}
            placeholder="Digite o nome do animal"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="apelido">Apelido:</label>
          <input
            type="text"
            id="apelido"
            name="apelido"
            value={formData.apelido}
            onChange={handleInputChange}
            placeholder="Digite o apelido"
          />
        </div>

        <div className="form-group">
          <label htmlFor="peso">Peso (kg):</label>
          <input
            type="number"
            id="peso"
            name="peso"
            value={formData.peso}
            onChange={handleInputChange}
            placeholder="0.0"
            step="0.1"
            min="0"
          />
        </div>

        <div className="form-group">
          <label htmlFor="idade">Idade (anos):</label>
          <input
            type="number"
            id="idade"
            name="idade"
            value={formData.idade}
            onChange={handleInputChange}
            placeholder="0"
            min="0"
            max="50"
          />
        </div>

        <div className="form-group">
          <label htmlFor="responsavel">Responsável:</label>
          <select
            id="responsavel"
            name="responsavel"
            value={formData.responsavel}
            onChange={handleInputChange}
            required
          >
            <option value="">Selecione um responsável</option>
            {responsaveis.map(responsavel => (
              <option key={responsavel} value={responsavel}>
                {responsavel}
              </option>
            ))}
          </select>
        </div>

        <div className="form-actions">
          <button type="submit" className="save-button">
            Salvar
          </button>
          <button type="button" className="cancel-button" onClick={handleClose}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default AnimalDetailsPanel;
