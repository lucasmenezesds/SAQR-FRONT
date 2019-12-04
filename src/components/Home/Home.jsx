import React from 'react';

// My Components
import Main from '../template/Main';

function Home() {
  return (
    <Main
      icon="home"
      title="Home"
      subtitle="SAQR - Sistema de Análise Quantitativa de Risco - Quantitative Risk Analysis System"
    >
      <div className="display-4"> Welcome!</div>
      <p>
        This system is a tool that will help you to make decisions
        based on Quantitative Risk Analysis
      </p>
    </Main>
  );
}

export default Home;
