/* eslint-disable no-console */
import './styles.scss';

import React from 'react';
import * as ReactDOM from 'react-dom';

import { App } from './app/App';

if ('serviceWorker' in navigator && process.env['mode'] === 'production') {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/service-worker.js')
      .then((registration) => {
        console.log('SW registered: ', registration);
      })
      .catch((registrationError) => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}

ReactDOM.render(<App />, document.getElementById('application'));
