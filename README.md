# PetFlow - Aplicação de Fluxogramas com Artefatos de Animais

Uma aplicação React com React Flow que permite criar e gerenciar fluxogramas interativos com artefatos representando animais e granjas.

## 🚀 Funcionalidades

- **Canvas Principal**: 2/3 da tela com React Flow interativo
- **12 Artefatos Únicos**: Diferentes formas geométricas e cores representando animais
- **Artefato Granja**: Nó raiz que pode abrir novos canvases
- **Painel de Controle**: 1/3 da tela com visualização em árvore dos artefatos
- **Navegação Hierárquica**: Abertura de sub-canvases para granjas específicas

## 🎨 Artefatos Disponíveis

### Formas Geométricas
- **Círculo**: Cachorro, Peixe
- **Quadrado**: Granja Principal, Tartaruga
- **Triângulo**: Gato, Porquinho
- **Diamante**: Passarinho, Cavalo
- **Hexágono**: Coelho, Vaca
- **Estrela**: Hamster, Galinha

### Cores
Cada artefato possui uma cor única e distinta para fácil identificação.

## 🏗️ Estrutura do Projeto

```
src/
├── components/
│   ├── FlowCanvas.js          # Canvas principal do React Flow
│   ├── CustomNode.js          # Nós personalizados
│   ├── ControlPanel.js        # Painel de controle em árvore
│   └── *.css                  # Estilos dos componentes
├── utils/
│   └── flow-utils.js          # Utilitárias para geração de nós/edges
├── App.js                     # Componente principal
└── index.js                   # Ponto de entrada
```

## 🚀 Como Executar

1. **Instalar dependências**:
   ```bash
   npm install
   ```

2. **Executar em modo desenvolvimento**:
   ```bash
   npm start
   ```

3. **Abrir no navegador**:
   ```
   http://localhost:3000
   ```

## 🎯 Como Usar

### Canvas Principal
- **Arrastar e Soltar**: Mover nós pelo canvas
- **Conectar Nós**: Arrastar de um nó para outro para criar conexões
- **Zoom e Pan**: Usar controles ou scroll do mouse
- **Mini-mapa**: Visualização geral do canvas no canto inferior direito

### Interação com Granjas
- **Clicar em Granja**: Abre um novo canvas específico para aquela granja
- **Navegação**: Botão "Voltar ao Canvas Principal" para retornar
- **Sub-canvases**: Cada granja pode ter seus próprios artefatos e conexões

### Painel de Controle
- **Visualização em Árvore**: Estrutura hierárquica dos canvases
- **Expansão/Colapso**: Botões ▶/▼ para expandir nós da árvore
- **Resumo das Granjas**: Lista rápida de todas as granjas disponíveis
- **Navegação Rápida**: Botões para abrir granjas diretamente

## 🔧 Tecnologias Utilizadas

- **React 18**: Framework principal
- **React Flow**: Biblioteca para fluxogramas interativos
- **CSS3**: Estilos modernos e responsivos
- **JavaScript ES6+**: Funcionalidades avançadas

## 📱 Responsividade

A aplicação é totalmente responsiva e funciona em:
- Desktop (layout horizontal)
- Tablet (layout adaptativo)
- Mobile (layout vertical)

## 🎨 Personalização

### Adicionar Novos Artefatos
Edite `src/utils/flow-utils.js` para adicionar novos artefatos:

```javascript
{
  id: 'novo-animal',
  type: 'animal',
  label: 'Novo Animal',
  animalName: 'Nome',
  color: '#cor-hex',
  shape: 'forma',
  position: { x: 100, y: 100 }
}
```

### Modificar Formas
As formas disponíveis são: `circle`, `square`, `triangle`, `diamond`, `hexagon`, `star`.

### Alterar Cores
Modifique o campo `color` com códigos hexadecimais válidos.

## 🐛 Solução de Problemas

### Erro de Dependências
```bash
npm install --force
```

### Problemas de Renderização
- Limpar cache do navegador
- Verificar console para erros JavaScript

### Performance
- Usar `npm run build` para versão otimizada
- Verificar número de nós no canvas (recomendado < 100)

## 📄 Licença

Este projeto é de código aberto e está disponível sob a licença MIT.

## 🤝 Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para:
- Reportar bugs
- Sugerir novas funcionalidades
- Enviar pull requests
- Melhorar a documentação
