import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Disable strict mode cuz from React v18, pages are rendered twice
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
