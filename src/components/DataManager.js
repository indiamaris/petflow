import React, { useState } from 'react';
import './DataManager.css';
import { exportAllData, importData, clearAllData } from '../utils/storage-utils';

const DataManager = () => {
  const [importFile, setImportFile] = useState(null);
  const [showConfirmClear, setShowConfirmClear] = useState(false);

  const handleExport = () => {
    const success = exportAllData();
    if (success) {
      alert('Dados exportados com sucesso!');
    } else {
      alert('Erro ao exportar dados. Tente novamente.');
    }
  };

  const handleImport = () => {
    if (!importFile) {
      alert('Selecione um arquivo para importar.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const success = importData(e.target.result);
        if (success) {
          alert('Dados importados com sucesso! Recarregue a página para aplicar as mudanças.');
          setImportFile(null);
        } else {
          alert('Erro ao importar dados. Verifique se o arquivo é válido.');
        }
      } catch (error) {
        alert('Erro ao processar arquivo. Verifique se é um JSON válido.');
      }
    };
    reader.readAsText(importFile);
  };

  const handleClearData = () => {
    if (showConfirmClear) {
      const success = clearAllData();
      if (success) {
        alert('Todos os dados foram removidos. Recarregue a página.');
        setShowConfirmClear(false);
      } else {
        alert('Erro ao limpar dados. Tente novamente.');
      }
    } else {
      setShowConfirmClear(true);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/json') {
      setImportFile(file);
    } else {
      alert('Por favor, selecione um arquivo JSON válido.');
      e.target.value = null;
    }
  };

  return (
    <div className="data-manager">
      <h4>Gerenciar Dados</h4>
      
      <div className="data-actions">
        <button className="export-btn" onClick={handleExport}>
          📤 Exportar Dados
        </button>
        
        <div className="import-section">
          <input
            type="file"
            accept=".json"
            onChange={handleFileChange}
            id="import-file"
            className="file-input"
          />
          <label htmlFor="import-file" className="import-btn">
            📥 Importar Dados
          </label>
          {importFile && (
            <button className="apply-import-btn" onClick={handleImport}>
              Aplicar Importação
            </button>
          )}
        </div>
        
        <button 
          className={`clear-btn ${showConfirmClear ? 'confirm' : ''}`}
          onClick={handleClearData}
        >
          {showConfirmClear ? '⚠️ Confirmar Limpeza' : '🗑️ Limpar Dados'}
        </button>
        
        {showConfirmClear && (
          <button 
            className="cancel-clear-btn"
            onClick={() => setShowConfirmClear(false)}
          >
            Cancelar
          </button>
        )}
      </div>
      
      <div className="data-info">
        <p>💾 Os dados são salvos automaticamente no navegador</p>
        <p>📁 Use exportar/importar para backup ou transferência</p>
      </div>
    </div>
  );
};

export default DataManager;
