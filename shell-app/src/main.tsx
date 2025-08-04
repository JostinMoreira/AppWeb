// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { registerApplication, start } from 'single-spa';
import { RootLayout } from './RootLayout';

// 1. Renderiza el layout principal que contiene la navegación
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RootLayout />
  </React.StrictMode>
);

// 2. Registra la aplicación de Angular
registerApplication({
  name: '@proyecto/campus-angular',
  app: () => System.import('@proyecto/campus-angular'), // <-- Cambiar de vuelta a System.import
  activeWhen: (location) => location.pathname.startsWith('/campus'),
});

// Registra la aplicación de React
registerApplication({
  name: '@proyecto/react-admin',
  app: () => System.import('@proyecto/react-admin'), // <-- Cambiar de vuelta a System.import
  activeWhen: (location) => location.pathname.startsWith('/admin'),
});

// 4. Inicia single-spa
start({
  urlRerouteOnly: true,
});
