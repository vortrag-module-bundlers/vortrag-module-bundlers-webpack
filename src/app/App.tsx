// import codePage from 'codepage';
import React from 'react';

import styles from './App.module.scss';
import { Header } from './components/Header';

// console.log('now using codepage lib', codePage);

export const App = (): JSX.Element => (
  <div className={styles.container}>
    <Header></Header>
  </div>
);
