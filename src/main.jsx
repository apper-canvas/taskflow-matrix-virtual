import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux'
import { store } from './store'
import { Provider } from 'react-redux';
import { store } from './store';
import App from './App';
import './index.css';
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
);