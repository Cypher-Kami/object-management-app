import React from 'react';
import ReactDOM from 'react-dom/client';
import ObjectProvider from './context/ObjectsContext'
import App from './App';
import "bootstrap/dist/css/bootstrap.min.css";


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <ObjectProvider>
    <App />
  </ObjectProvider>
);
