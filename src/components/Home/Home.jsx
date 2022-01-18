import React, { Component } from 'react';
import {
  Tab, Tabs, TabList, TabPanel,
} from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

// My Components
import Main from '../Template/Main';
import './Home.css';

const headerProps = {
  icon: 'home',
  title: 'Home',
  subtitle: 'SAQR - Sistema de Análise Quantitativa de Risco - Quantitative Risk Analysis System',
};

class Home extends Component {
  renderEnglish() {
    return (
      <>
        <h3>Sections Explanation</h3>
        <div className="col-8 col-md-8">
          <h4>Simulate</h4>
          <p>This section is where you&#39;ll be able to create a simulation passing the parameters</p>
          <p>
            To use it, please input:
            <br />
            - The Number of simulataions you&#39; would like to do;
            <br />
            - How many samples you&#39; would like to have on each simulation;
            <br />
            - The lowest value that the random number generate can reach.
            <br />
            - The biggest value that the random number generate can reach.
            <br />
            - The distribution type and it&#39;s parameters for each step
            <br />
            - And finally, click the button to start the simulation itself.
            {' '}
          </p>
          <p />
        </div>
        <div className="col-8 col-md-8">
          <h4>Previous Simulations</h4>
          <p>
            This section is where you&#39;ll be able to access the previous generated simulations data.
            <br />
            There, you&#39;ll be able to check how many samples and simulations were ordered to be generated, and also
            to
            know the distributions and values used on each step of the delivery process.
          </p>
          <p />
          <p>
            <b>Note: </b>
            You&#39;ll be able to list just the latest 25th simulations; one per time.
          </p>
          <p />
        </div>
        <div className="col-8 col-md-8">
          <h4>Graph</h4>
          <p>
            The last section, is where you&#39;ll be able to see the Bell&#39;s Curve graph.
            <br />
            To display the graph you&#39;ll need to:
            <br />
            - Select an existing simulation;
            <br />
            - Choose how you would like to highlight the areas of the graph, giving the probability&#39;s percentage
            <br />
            - Insert the confidence level for the mean (Default: 95%)
            <br />
            - And click on the button to show the data;
          </p>
          <p />
        </div>
      </>
    );
  }

  renderPortuguese() {
    return (
      <>
        <h3>Explicação das Secções</h3>
        <div className="col-8 col-md-8">
          <h4>Simulate</h4>
          <p>Esta secção será onde você poderá criar simulações passando seus devidos parâmetros</p>
          <p>
            Para utilizar, por favor insira os dados:
            <br />
            - O número de simulações que gostaria de realizar
            <i>(Number of Simulations)</i>
            <br />
            - Quantas amostras cada simulação terá
            <i>(Number of samples)</i>
            <br />
            - O valor mínimo que o gerador de números aleatórios pode ter
            <i>(Min Value for the Seed)</i>
            <br />
            - O valor máximo que o gerador de números aleatórios pode ter
            <i>(Max Value for the Seed)</i>
            <br />
            - O tipo de distribuição que será utilizado e seus parâmetros para cada um dos passos.
            <br />
            - E por último, clique no botão
            <i>Start Simulation!</i>
            para iniciar a simulação propriamente dita.
            {' '}
          </p>
          <p />
        </div>
        <div className="col-8 col-md-8">
          <h4>Previous Simulations</h4>
          <p>
            Esta secção é onde poderá acessar os dados das simulações realizadas previamente.
            <br />
            Aqui conseguirá verificar quantas amostras e numero de simulações foram requisitadas em determinada
            simulação realizada, além de
            verificar quais distribuições e valores foram utilizados em cada etapa do processo de entrega.
          </p>
          <p />
          <p>
            <b>Nota: </b>
            Você só poderá ver as últimas 25 simulações realizadas; uma por vez.
          </p>
          <p />
        </div>
        <div className="col-8 col-md-8">
          <h4>Graph</h4>
          <p>
            A última secção é onde você poderá visualizar o gráfico da distribuição normal.
            <br />
            Para exibir o gráfico você precisará de:
            <br />
            - Selecionar uma simulação existente;
            <br />
            - Escolher como você gostaria que as áreas do gráfico fiquem destacadas, dado a porcentagem da
            probabilidade;
            <br />
            - Inserir o nível de confiança para a média (Padrão: 95%)
            <br />
            - E clicar no botão para exibir os dados;
          </p>
          <p />
        </div>
      </>
    );
  }

  renderTabs() {
    return (
      <div className="add-padding-15 col-12 col-md-12">
        <Tabs>
          <TabList>
            <Tab>
              <i className="gb uk flag center" />
              {' '}
            </Tab>
            <Tab>
              {' '}
              <i className="br flag center" />
            </Tab>
          </TabList>

          <TabPanel>
            {this.renderEnglish()}
          </TabPanel>
          <TabPanel>
            {this.renderPortuguese()}
          </TabPanel>
        </Tabs>
      </div>
    );
  }

  render() {
    return (
      <Main {...headerProps}>
        <div className="display-4"> Welcome!</div>
        <div>
          <p>
            This system is a tool that will help you to make decisions
            based on Quantitative Risk Analysis...
            The explanation about it is right below!
          </p>
        </div>
        {this.renderTabs()}
      </Main>
    );
  }
}

export default Home;
