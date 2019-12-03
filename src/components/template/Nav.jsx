import './Nav.css';
import React from 'react';

export default (props) => (
  <aside className="menu-area">
    <nav className="menu">
      <a href="#/">
        <i className="fa fa-home" />
        {' '}
        Home
      </a>
      <a href="#/simulate">
        <i className="fa fa-calculator" aria-hidden="true" />
        {' '}
        Simulate
      </a>
      <a href="#/graphs">
        <i className="fa fa-area-chart" aria-hidden="true" />
        {' '}
        Graphs
      </a>
      <a href="#/previous_simulations">
        <i className="fa fa-database" aria-hidden="true" />
        {' '}
        Previous Simulations
      </a>
    </nav>
  </aside>
);
