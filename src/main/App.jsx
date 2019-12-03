import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
import './App.css';
import React from 'react';

// My Components
import Logo from '../components/template/Logo';
import Main from '../components/template/Main';
import Nav from '../components/template/Nav';
import Footer from '../components/template/Footer';

function App() {
  return (
    <div className="App">
      <Logo />
      <Nav />
      <Main
        icon="home"
        title="Home"
        subtitle="SAQR System's Main Page"
      />
      <Footer />
    </div>
  );
}

export default App;
