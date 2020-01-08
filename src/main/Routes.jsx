import React from 'react';
import { Switch, Route, Redirect } from 'react-router';


import Home from '../components/Home';
import SimulationData from '../components/Simulation/Simulate';
import Graphs from '../components/Graphs/Graphs';

export default (props) => (
  <Switch>
    <Route exact path="/" component={Home} />
    <Route path="/simulate" component={SimulationData} />
    <Route path="/Graphs" component={Graphs} />
    <Redirect from="*" to="/" />
  </Switch>
);
