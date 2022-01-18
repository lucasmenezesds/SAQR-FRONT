import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
import './App.css';
import React from 'react';
import { HashRouter } from 'react-router-dom';

// My Components
import Routes from './Routes';
import Logo from '../components/Template/Logo';
import Nav from '../components/Template/Nav';
import Footer from '../components/Template/Footer';

function App() {
  return (
    <HashRouter>
      <div className="App">
        <Logo />
        <Nav />
        <Routes />
        <Footer />
      </div>
    </HashRouter>

  );
}

export default App;
