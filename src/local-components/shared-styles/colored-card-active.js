const baseStyle = document.createElement('dom-module');
baseStyle.innerHTML = `
  <template>
    <style>
      paper-card[class="color-card"] {
        --paper-card-background-color: var(--base-color);
        --paper-card-header-text: {
          color: var(--accent-color-white);
          text-transform: uppercase;
          font-size: 13px;
        };
      
        --paper-card-actions: {
          border-top: none;
          margin-bottom: 20%;
        }
        --paper-card-content: {
          margin-top: 20%;
          padding-bottom: 0;
          justify-content: center;
          align-items: center;
          display: flex;
          flex-direction: column;
        }
        width: 20%;
      }
      
      paper-card.color-card > .card-actions > .center-button {
        width: 10rem;
      }
      
      paper-card.color-card > .card-actions > paper-button {
        --paper-button: {
          color: var(--accent-color-white);
          text-transform: uppercase;
        }
      }
      
      paper-card.color-card > .card-content > paper-input {
        width: 70%;
        --paper-input-container: {
          color: var(--accent-color-white);
        };
        --paper-input-container-input: {
          color: var(--accent-color-white);
        };
        --paper-input-container-focus-color: var(--accent-color-white);
        --paper-input-container-color: var(--accent-color-white);
      } 
    </style>
  </template>
`;
baseStyle.register('colored-card-active');