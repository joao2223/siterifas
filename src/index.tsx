import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './authContext'; // Importe o AuthProvider
import AppRouter from './routes'; // Importe o componente com as rotas
import styles from './App.module.scss';

// Renderize sua aplicação envolvendo-a apenas com o AuthProvider
ReactDOM.render(
  <React.StrictMode>
    <AuthProvider>
      <div className={styles.container}>
        <div className={styles.cor}>
          <AppRouter />
        </div>
      </div>
    </AuthProvider>
  </React.StrictMode>,
  document.getElementById('root')
);