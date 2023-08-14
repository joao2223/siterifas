import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './authContext';
import { TemaProvider } from './temaContext'; // Importe o TemaProvider
import AppRouter from './routes';
import styles from './App.module.scss';

ReactDOM.render(
  <React.StrictMode>
    <AuthProvider>
      <TemaProvider> {/* Adicione o TemaProvider aqui */}
        <div className={styles.container}>
          <div className={styles.cor}>
            <AppRouter />
          </div>
        </div>
      </TemaProvider>
    </AuthProvider>
  </React.StrictMode>,
  document.getElementById('root')
);