import './Nav.css';
import React from 'react';
import { Link } from 'react-router-dom';

export default (props) => (
  <aside className="menu-area">
    <nav className="menu">
      <Link to="/">
        <i className="fa fa-home" />
        {' '}
        Home
      </Link>
      <Link to="/simulate">
        <i className="fa fa-calculator" aria-hidden="true" />
        {' '}
        Simulate
      </Link>
      <Link to="/graphs">
        <i className="fa fa-area-chart" aria-hidden="true" />
        {' '}
        Graphs
      </Link>
      {/* <Link to="/previous_simulations"> */}
      {/*  <i className="fa fa-database" aria-hidden="true" /> */}
      {/*  {' '} */}
      {/*  Previous Simulations */}
      {/* </Link> */}
    </nav>
  </aside>
);
