const baseStyle = document.createElement('dom-module');
baseStyle.innerHTML = `
  <template>
    <style>
      :root {
        --base-color: #449DD1;  
      }
    </style>
  </template>
`;
console.log('camsads');
baseStyle.register('base-style');