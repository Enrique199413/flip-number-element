const baseStyle = document.createElement('dom-module');
baseStyle.innerHTML = `
  <template>
    <style>
      :root {
        --base-color: #449dd1;
        --base-color-light: rgba(133,226,255,0.25);
      }
    </style>
  </template>
`;
baseStyle.register('base-style');