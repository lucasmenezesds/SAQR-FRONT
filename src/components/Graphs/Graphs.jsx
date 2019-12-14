import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import highchartBellCurve from 'highcharts/modules/histogram-bellcurve';

// My Components
import Main from '../Template/Main';



const data = [3.5, 3, 3.2, 3.1, 3.6, 3.9, 3.4, 3.4, 2.9, 3.1, 3.7, 3.4, 3, 3, 4,
  4.4, 3.9, 3.5, 3.8, 3.8, 3.4, 3.7, 3.6, 3.3, 3.4, 3, 3.4, 3.5, 3.4, 3.2,
  3.1, 3.4, 4.1, 4.2, 3.1, 3.2, 3.5, 3.6, 3, 3.4, 3.5, 2.3, 3.2, 3.5, 3.8, 3,
  3.8, 3.2, 3.7, 3.3, 3.2, 3.2, 3.1, 2.3, 2.8, 2.8, 3.3, 2.4, 2.9, 2.7, 2, 3,
  2.2, 2.9, 2.9, 3.1, 3, 2.7, 2.2, 2.5, 3.2, 2.8, 2.5, 2.8, 2.9, 3, 2.8, 3,
  2.9, 2.6, 2.4, 2.4, 2.7, 2.7, 3, 3.4, 3.1, 2.3, 3, 2.5, 2.6, 3, 2.6, 2.3,
  2.7, 3, 2.9, 2.9, 2.5, 2.8, 3.3, 2.7, 3, 2.9, 3, 3, 2.5, 2.9, 2.5, 3.6,
  3.2, 2.7, 3, 2.5, 2.8, 3.2, 3, 3.8, 2.6, 2.2, 3.2, 2.8, 2.8, 2.7, 3.3, 3.2,
  2.8, 3, 2.8, 3, 2.8, 3.8, 2.8, 2.8, 2.6, 3, 3.4, 3.1, 3, 3.1, 3.1, 3.1, 2.7,
  3.2, 3.3, 3, 2.5, 3, 3.4, 3];

const options = {
  title: {
    text: 'Bell curve',
  },
  xAxis: [{
    title: {
      text: 'Delivery Times',
    },
    alignTicks: false,
  }, {
    title: {
      text: 'Bell curve',
    },
    alignTicks: false,
    opposite: true,
  }],

  yAxis: [{
    title: { text: 'Data' },
  }, {
    title: { text: 'Bell curve' },
    opposite: true,
  }],
  series: [
    {
      name: 'Bell curve',
      type: 'bellcurve',
      xAxis: 1,
      yAxis: 1,
      baseSeries: 1,
      zIndex: -1,
    },
    {
      name: 'Data',
      type: 'scatter',
      data,
      accessibility: {
        exposeAsGroupOnly: true,
      },
      marker: {
        radius: 1.5,
      },
    },
  ],
};
highchartBellCurve(Highcharts);
function Graphs() {
  return (
    <Main
      icon="area-chart"
      title="Graphs"
      subtitle="SAQR - Sistema de Análise Quantitativa de Risco - Quantitative Risk Analysis System"
    >
      <div>
        <HighchartsReact highcharts={Highcharts} options={options} />
      </div>
      {/* <div className="display-4"> Welcome!</div> */}
      {/* <p> */}
      {/*  This system is a tool that will help you to make decisions */}
      {/*  based on Quantitative Risk Analysis */}
      {/* </p> */}
    </Main>
  );
}

export default Graphs;
