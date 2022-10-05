import React from 'react';
import { Provider } from 'react-redux';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import store from './store';
import  {disableReactDevTools} from '@fvilers/disable-react-devtools'

if (process.env.NODE_ENV === 'production') disableReactDevTools()

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>, document.getElementById('root'));

