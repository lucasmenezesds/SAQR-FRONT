import React from 'react';
import { Switch, Route, Redirect } from 'react-router';


import Home from '../components/Home';
import Simulate from '../components/Simulation/Simulate';
import SimulationHistory from '../components/Simulation/SimulationHistory/SimulationHistory';
import GraphPage from '../components/Graphs/GraphPage/GraphPage';

export default (props) => (
  <Switch>
    <Route exact path="/" component={Home} />
    <Route path="/simulate" component={Simulate} />
    <Route path="/previous_simulations" component={SimulationHistory} />
    <Route path="/Graph" component={GraphPage} />
    <Redirect from="*" to="/" />
  </Switch>
);
