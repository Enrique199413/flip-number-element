const baseStyle = document.createElement('dom-module');
baseStyle.innerHTML = `
  <template>
    <style>
      paper-card[class="color-gray"] {
        --paper-card-background-color: var(--base-secondary-color);
        --paper-card-header-text: {
          color: var(--accent-color-dark);
          text-transform: uppercase;
          font-size: 13px;
          letter-spacing: .1rem;
        };
      
        --paper-card-actions: {
          border-top: none;
          display: flex;
          flex-direction: row;
          justify-content: flex-end;
        }
        --paper-card-content: {
          padding-top: 0;
        }
        margin-top: 10rem;
        width: 50%;
      }
      
      paper-card.color-gray > .card-actions > .center-button {
        width: 9rem;
      }
      
      paper-card.color-gray > .card-actions > paper-button {
        --paper-button: {
          color: var(--base-color);
          text-transform: uppercase;
        }
      }
      
      paper-card.color-gray > .card-actions > paper-button.dissmis-button {
        --paper-button: {
          color: var(--base-cancel-color);
          text-transform: uppercase;
        }
      }
      
      paper-card.color-gray > .card-content > paper-checkbox {
        --paper-checkbox-checked-color: var(--base-color);
      }
    </style>
  </template>
`;
baseStyle.register('colored-card-secondary');