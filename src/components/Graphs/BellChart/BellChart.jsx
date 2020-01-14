import React, { Component } from 'react';
import './BellChart.css';
import { Popup } from 'semantic-ui-react';

import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import highchartBellCurve from 'highcharts/modules/histogram-bellcurve';

highchartBellCurve(Highcharts);

const GRAPHS_BLUE = '#7cb5ec';
const GRAPHS_GREEN = '#90ed7d';
// const GRAPHS_ORANGE = '#f7a35c';

const pointsInIntervalNumber = 5;
const defaultGraphOptions = {
  chart: {
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
    text: 'Bell curve1',
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
      text: 'Bell curve2',
    },
    alignTicks: false,
    opposite: true,
  }],

  yAxis: [{
    title: { text: 'Time (hours)' },
  }, {
    title: { text: 'Bell curve (PDF)' },
    opposite: true,
  }],
  series: [
    {
      name: 'Bell curve(PDF)',
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
      zones: null
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

    const zones = simulationData.zones.map((zone) => {
      if (zone['color']) {
        zone['color'] = GRAPHS_GREEN;
      } else {
        zone['color'] = GRAPHS_BLUE;
      }
      return zone
    });

    currentState.series[0]['zones'] = zones;
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
                    content='Probability of α to the μ be in this interval'
                    trigger={(
                      <p><span
                        className='span-text2'>C.I for the μ:</span> {`[ ${simulationData['mean_intervals']['min_interval']} ; ${simulationData['mean_intervals']['max_interval']} ]`}
                      </p>
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
