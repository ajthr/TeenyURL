import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import './index.scss'

import Home from './pages/Home'
import Redirect from './pages/Redirect'

ReactDOM.render(
  <Router>
      <Switch>
        <Route path='/' component={Home} exact />
        <Route path='/:url' component={Redirect} exact />
      </Switch>
    </Router>,
  document.getElementById('root')
);
