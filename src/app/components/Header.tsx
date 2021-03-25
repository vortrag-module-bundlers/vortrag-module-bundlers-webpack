import { AppBar, IconButton, List, ListItem, ListItemText, Toolbar } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Home } from '@material-ui/icons';
import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Link, Route, Switch } from 'react-router-dom';

import { HomePage } from '../pages/HomePage';
import styles from './Header.module.scss';

const AboutUs = lazy(() => import('../pages/AboutUs'));
const Deserts = lazy(() => import('../pages/Deserts'));
const Contact = lazy(() => import('../pages/Contact'));

const useStyles = makeStyles({
  navbarDisplayFlex: {
    display: `flex`,
    justifyContent: `space-between`,
  },
  navDisplayFlex: {
    display: `flex`,
    justifyContent: `space-between`,
  },
  linkText: {
    textDecoration: `none`,
    textTransform: `uppercase`,
    color: `white`,
  },
});

const navLinks = [
  { title: `about us`, path: `/about-us` },
  { title: `deserts`, path: `/deserts` },
  { title: `contact`, path: `/contact` },
];

export const Header = (): JSX.Element => {
  const classes = useStyles();

  return (
    <Router>
      <AppBar position="static">
        <Toolbar className={classes.navbarDisplayFlex}>
          <Link to="/" className={classes.linkText}>
            <IconButton edge="start" color="inherit" aria-label="home">
              <Home fontSize="large" />
            </IconButton>
          </Link>
          <List component="nav" aria-labelledby="main navigation" className={classes.navDisplayFlex}>
            {navLinks.map(({ title, path }) => (
              <Link to={path} key={title} className={classes.linkText}>
                <ListItem button>
                  <ListItemText primary={title} />
                </ListItem>
              </Link>
            ))}
          </List>
        </Toolbar>
      </AppBar>

      <div className={styles.content}>
        <Suspense fallback={<div>Loading...</div>}>
          <Switch>
            <Route exact path="/">
              <HomePage />
            </Route>
            <Route path="/about-us">
              <AboutUs />
            </Route>
            <Route path="/deserts">
              <Deserts />
            </Route>
            <Route path="/contact">
              <Contact />
            </Route>
          </Switch>
        </Suspense>
      </div>
    </Router>
  );
};
