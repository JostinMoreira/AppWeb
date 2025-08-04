import React from 'react';
import ReactDOM from 'react-dom/client';
import singleSpaReact from 'single-spa-react';
import type { AppProps } from 'single-spa';
import App from './App.tsx';
import type { Root } from 'react-dom/client';

// Extiende AppProps para incluir la propiedad opcional 'root' que añadiremos
interface CustomAppProps extends AppProps {
  domElement?: HTMLElement;
  root?: Root;
}

// 1. Crea el objeto base de ciclos de vida
const reactLifecycles = singleSpaReact({
  React,
  ReactDOMClient: ReactDOM,
  rootComponent: App,
  errorBoundary(err: Error) {
    return <div>Error: {err.message}</div>;
  },
});

// 2. Crea el objeto final, sobreescribiendo mount y unmount
export const { bootstrap } = reactLifecycles;

export function mount(props: CustomAppProps): Promise<void> {
  return new Promise(resolve => {
    const root = ReactDOM.createRoot(props.domElement!);
    // Guardamos la instancia del root en las props para usarla en unmount
    props.root = root;
    root.render(
      <React.StrictMode>
        {/* CORRECCIÓN: Se renderiza App sin pasarle las props de single-spa */}
        <App />
      </React.StrictMode>
    );
    resolve();
  });
}

export function unmount(props: CustomAppProps): Promise<void> {
  return new Promise(resolve => {
    // Llama a unmount en el root que guardamos
    props.root?.unmount();
    resolve();
  });
}