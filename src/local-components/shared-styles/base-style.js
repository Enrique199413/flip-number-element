const baseStyle = document.createElement('dom-module');
baseStyle.innerHTML = `
  <template>
    <style>
      :root {
        --base-color: #b5006e;
        --base-secondary-color: #FAFAFA;
        --base-cancel-color: #858585;
        --white: #FFFFFF;
        --dark: #000000;
        --accent-color-white: var(--white);
        --accent-color-dark: var(--dark);
        --base-color-light: rgba(133,226,255,0.25);
        --primary-color: var(--base-color);
      }
      
      paper-button.blue-button {
        background: var(--base-color);
        color: var(--white);
      }
      
      paper-collapse-item {
        --paper-collapse-item-header: {
          cursor: pointer;
        }
      }
      
      .loading-container {
        height: 100px;
      }
      
      paper-spinner {
        --paper-spinner-layer-1-color: var(--base-color);
        --paper-spinner-layer-2-color: var(--base-color-light);
        --paper-spinner-layer-3-color: var(--base-color);
        --paper-spinner-layer-4-color: var(--base-color-light);
      }
      
      paper-card {
        width: 100%;
        
      }
      @media screen and (max-width: 992px) {
        paper-card {
          width: auto;
        }
      }
    </style>
  </template>
`;
baseStyle.register('base-style');
