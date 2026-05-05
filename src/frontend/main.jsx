import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { PolicyProvider } from './context/PolicyContext.jsx';
import './styles.css';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <PolicyProvider>
          <App />
        </PolicyProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
