// src/main.jsx
import React from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import App from './App.jsx';
import './index.css'; // se non hai CSS, puoi rimuovere questa riga

// Garantisce che esista il container #root
let container = document.getElementById('root');
if (!container) {
  container = document.createElement('div');
  container.id = 'root';
  document.body.appendChild(container);
}

const root = createRoot(container);

root.render(
  <React.StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>
);

// ✅ Note:
// - React 18 usa createRoot (NON root.render su un oggetto ReactDOM vecchio).
// - Con HashRouter sei allineato a Vercel e alle tue route tipo "#/chat".
// - Se usi TypeScript, rinomina in main.tsx e i tipi si auto-adattano.
