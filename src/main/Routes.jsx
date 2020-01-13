import React from 'react';
import { Switch, Route, Redirect } from 'react-router';


import Home from '../components/Home';
import SimulationData from '../components/Simulation/Simulate';
import GraphPage from '../components/Graphs/GraphPage/GraphPage';

export default (props) => (
  <Switch>
    <Route exact path="/" component={Home} />
    <Route path="/simulate" component={SimulationData} />
    <Route path="/Graph" component={GraphPage} />
    <Redirect from="*" to="/" />
  </Switch>
);
