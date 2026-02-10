import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import TestPage from './TestPage';

const root = ReactDOM.createRoot(document.getElementById('root'));
const isTestPage = /\/test\/?$/.test(window.location.pathname);

root.render(
  <React.StrictMode>
    {isTestPage ? <TestPage /> : <App />}
  </React.StrictMode>
);
