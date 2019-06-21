const baseStyle = document.createElement('dom-module');
baseStyle.innerHTML = `
  <template>
    <style>
      .card-general-container > .color-general {
        --paper-card-background-color: var(--white);
        --paper-card-header-text: {
          color: var(--accent-color-dark);
          text-transform: uppercase;
          font-size: 13px;
          letter-spacing: .1rem;
        };
      
        --paper-card-actions: {
          border-top: 1px solid #e8e8e8;
          display: flex;
          flex-direction: row;
          justify-content: flex-end;
        }
        --paper-card-content: {
          padding-top: 0;
        }
      }
      
      .card-general-container > .color-general > .card-actions > .center-button {
        width: 9rem;
      }
      
      .card-general-container > .color-general > .card-actions > paper-button {
        --paper-button: {
          color: var(--base-color);
          text-transform: uppercase;
        }
      }
      
      .card-general-container > .color-general > .card-actions > paper-button.dissmis-button {
        --paper-button: {
          color: var(--base-cancel-color);
          text-transform: uppercase;
        }
      }
      
      .card-general-container > .color-general > .card-content > paper-checkbox {
        --paper-checkbox-checked-color: var(--base-color);
      }
      
      .color-general > .card-content > paper-textarea {
        --paper-input-container-focus-color: var(--base-color);
        --paper-input-container-color: var(--base-color);
      } 
    </style>
  </template>
`;
baseStyle.register('colored-card-general');
