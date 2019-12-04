import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
import './App.css';
import React from 'react';
import { HashRouter } from 'react-router-dom';

// My Components
import Routes from './Routes';
import Logo from '../components/template/Logo';
import Nav from '../components/template/Nav';
import Footer from '../components/template/Footer';

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
