import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx'; // Import component App
import './index.css';

// Chỉ cần import BrowserRouter tại đây để bọc component App
import { BrowserRouter } from 'react-router-dom'; 


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* Chỉ bọc component App bằng BrowserRouter */}
    <BrowserRouter> 
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);