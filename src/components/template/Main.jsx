import './Main.css';
import React from 'react';
import Header from './Header';

export default (props) => (
  // <React.Fragment>
  <>
    <Header {...props} />
    <main className="content">
      Content
    </main>

  </>
  // </React.Fragment>

);
