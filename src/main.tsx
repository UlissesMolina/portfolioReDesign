import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import '@fontsource/jetbrains-mono/400.css';
import '@fontsource/jetbrains-mono/500.css';
import './index.css';
import { initTheme } from './components/Widgets';

// Set theme before first paint
initTheme();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
