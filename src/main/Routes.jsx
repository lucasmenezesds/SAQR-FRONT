import React from 'react';
import { Switch, Route, Redirect } from 'react-router';


import Home from '../components/Home';
import SimulationData from '../components/SimulationData';

export default (props) => (
  <Switch>
    <Route exact path="/" component={Home} />
    <Route path="/simulate" component={SimulationData} />
    <Redirect from="*" to="/" />
  </Switch>
);
