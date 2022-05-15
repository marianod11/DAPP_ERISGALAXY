import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css'; 

import '../src/assets/css/Siderbar.css'
import '../src/assets/css/Topbar.css'
import '../src/assets/css/global.css'
import '../src/assets/css/WalletConnet.css'
import '../src/assets/css/Footer.css'
import '../src/assets/css/Workers.css'


ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
