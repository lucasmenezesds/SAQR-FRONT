import './App.css';
import React from 'react';
import Logo from '../components/template/Logo';
import Main from '../components/template/Main';
import Nav from '../components/template/Nav';
import Footer from '../components/template/Footer';

function App() {
  return (
    <div className="App">
      <Logo />
      <Nav />
      <Main />
      <Footer />
    </div>
  );
}

export default App;
