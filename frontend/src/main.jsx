import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './styles.css';
import App from './App.jsx';
import { AuthProvider } from './contexts/AuthContext.jsx';
import { ToastProvider } from './contexts/ToastContext.jsx';
ReactDOM.createRoot(document.getElementById('root')).render(<React.StrictMode><BrowserRouter><AuthProvider><ToastProvider><App/></ToastProvider></AuthProvider></BrowserRouter></React.StrictMode>);
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => navigator.serviceWorker.register('/sw.js'));
}
