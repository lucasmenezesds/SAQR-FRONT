import React, { Component } from 'react';
import './BellChart.css';
import { Popup } from 'semantic-ui-react';

import axios from "axios";
import { BASE_URL } from "../../../constants/api";

import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import highchartBellCurve from 'highcharts/modules/histogram-bellcurve';

highchartBellCurve(Highcharts);

// const pointsInIntervalNumber = 5;
// const data = [3.5, 3, 3.2, 3.1, 3.6, 3.9, 3.4, 3.4, 2.9, 3.1, 3.7, 3.4, 3, 3, 4,
//   4.4, 3.9, 3.5, 3.8, 3.8, 3.4, 3.7, 3.6, 3.3, 3.4, 3, 3.4, 3.5, 3.4, 3.2,
//   3.1, 3.4, 4.1, 4.2, 3.1, 3.2, 3.5, 3.6, 3, 3.4, 3.5, 2.3, 3.2, 3.5, 3.8, 3,
//   3.8, 3.2, 3.7, 3.3, 3.2, 3.2, 3.1, 2.3, 2.8, 2.8, 3.3, 2.4, 2.9, 2.7, 2, 3,
//   2.2, 2.9, 2.9, 3.1, 3, 2.7, 2.2, 2.5, 3.2, 2.8, 2.5, 2.8, 2.9, 3, 2.8, 3,
//   2.9, 2.6, 2.4, 2.4, 2.7, 2.7, 3, 3.4, 3.1, 2.3, 3, 2.5, 2.6, 3, 2.6, 2.3,
//   2.7, 3, 2.9, 2.9, 2.5, 2.8, 3.3, 2.7, 3, 2.9, 3, 3, 2.5, 2.9, 2.5, 3.6,
//   3.2, 2.7, 3, 2.5, 2.8, 3.2, 3, 3.8, 2.6, 2.2, 3.2, 2.8, 2.8, 2.7, 3.3, 3.2,
//   2.8, 3, 2.8, 3, 2.8, 3.8, 2.8, 2.8, 2.6, 3, 3.4, 3.1, 3, 3.1, 3.1, 3.1, 2.7,
//   3.2, 3.3, 3, 2.5, 3, 3.4, 3];

const GRAPHS_BLUE = '#7cb5ec';
const GRAPHS_GREEN = '#90ed7d';
const GRAPHS_ORANGE = '#f7a35c';

const pointsInIntervalNumber = 5;
const defaultGraphOptions = {
  chart: {
    // margin: [50, 0, 50, 50],
    events: {
      load() {
        Highcharts.each(this.series[0].data, (point, i) => {
          const labels = ['4σ', '3σ', '2σ', 'σ', 'μ', 'σ', '2σ', '3σ', '4σ'];
          if (i % pointsInIntervalNumber === 0) {
            point.update({
              color: 'black',
              dataLabels: {
                enabled: true,
                format: labels[Math.floor(i / pointsInIntervalNumber)],
                overflow: 'none',
                crop: false,
                y: -2,
                style: {
                  fontSize: '13px',
                },
              },
            });
          }
        });
      },
    },
  },
  title: {
    text: 'Bell curve',
  },
  plotOptions: {
    column: {
      pointPlacement: 'between',
    },
  },
  tooltip: {
    shared: true,
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
    title: { text: 'Time (hours)' },
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
      marker: {
        enabled: true,
      },
      intervals: 4,
      pointsInInterval: pointsInIntervalNumber,
      zoneAxis: 'x',
      zones: null, // TODO: aqui eu calculo o Z e METO O LOCO FAZENDO OS BAGUI FICAR BONITINHO
      // //   {
      // //     value: 114.54853768983546,
      // //   },
      // //   {
      // //     value: 114.54853768983546,
      // //     color: '#acf19d',
      // //   },
      // //   {
      // //     value: 115.61940570351564,
      // //     color: '#acf19d',
      // //   },
      // // ],
    },
    {
      name: 'Data',
      type: 'scatter',
      data: [],
      accessibility: {
        exposeAsGroupOnly: true,
      },
      marker: {
        radius: 1.5,
      },
    },
  ],
};

const initialState = { render: false, bellOptions: defaultGraphOptions };

// eslint-disable-next-line react/prefer-stateless-function
class SimulatedDataList extends Component {
  state = { ...initialState };

  bellChartData() {
    const { bellOptions } = { ...this.state };
    const currentState = bellOptions;
    const simulationData = this.props.simulationData;

    // currentState.series[0]['zones'] = tsimulationData.zone;
    currentState.series[1]['data'] = simulationData.data;

    return (
      <div key={simulationData["graph-div-id"]}>
        <hr/>
        <div className='form'>
          <h3 className='add-left-padding-15'>Distribution Data</h3>
          <div className='row'>
            <div className='col-5 col-md-5'>
            <div className="form-group col-11 col-md-11">
              <div>
                <p><span className='span-text'>Mean:</span> {simulationData["mean"]}</p>
                <Popup
                  content='Standard Deviation'
                  trigger={(
                    <p><span className='span-text'>Std Dev:</span> {simulationData["std_dev"]}</p>
                  )}
                />
                <p><span className='span-text'>Variance:</span> {simulationData["variance"]}</p>
              </div>
            </div>
            </div>
            <div className='col-5 col-md-5'>
            <div className='form-group col-11 col-md-11'>
              <div>
                <Popup
                  content='Biggest value of the sample'
                  trigger={(
                    <p><span className='span-text'>Max Value:</span> {simulationData["max_value"]}</p>
                  )}
                />
                <Popup
                  content='Smallest value of the sample'
                  trigger={(
                    <p><span className='span-text'>Min Value:</span> {simulationData["min_value"]}</p>
                  )}
                />
                <Popup
                  content='Size of the sample'
                  trigger={(
                    <p><span className='span-text'>Data Size:</span> {simulationData["data_size"]}</p>
                  )}
                />
              </div>
            </div>
          </div>
          </div>
        </div>
        <hr/>
        <div className='form'>
          <HighchartsReact highcharts={Highcharts} options={currentState}/>
        </div>
      </div>
    );
  }

  render() {
    if (!this.props.render) {
      return null;
    }

    return (
      <>
        {''}
        {this.bellChartData()}
        {''}
      </>
    );
  }
}


export default SimulatedDataList;
