import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
// import App from './App';
import {BrowserRouter as Router} from "react-router-dom";
import { Provider } from 'react-redux';
import store from 'redux/store'

import ChatApp from 'components/ChatApp'

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <Router>
        <ChatApp />
      </Router>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

