import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Router from './routes';
import styles from './App.module.scss'

ReactDOM.render(
  <React.StrictMode>
    <div className={styles.cor}>
      <Router />
    </div>
  </React.StrictMode>,
  document.getElementById('root')
);
