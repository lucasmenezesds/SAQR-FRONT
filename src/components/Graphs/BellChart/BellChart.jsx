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
          const labels = ['-4σ', '-3σ (0.13%)', '-2σ (2.28%)', '-σ (15.87%)', 'μ (50.00%)', 'σ (84.13%)', '2σ (97.72%)', '3σ (99.87%)', '4σ'];
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
    text: 'Normal Distribution',
  },
  plotOptions: {
    bellcurve: {
      pointPlacement: 'between',
    }
  },
  tooltip: {
    shared: true,
    inside: true,
    valueDecimals: 4,
    crosshairs: [true, true],
    pointFormat: null,
    headerFormat: '<span style=\"color:{point.color}\">●</span> X Value: <b>{point.key:.4f}</b><br/>',
  },
  xAxis: [
    {
      title: {
        text: '',
      },
      alignTicks: false,
      opposite: true,
    },
    {
      title: {
        text: 'Delivery Time',
      },
      alignTicks: false,
      opposite: false,
    }],

  yAxis: [{
    title: { text: 'Data Value  ' },
    opposite: true
  }, {
    title: { text: 'f(x)' },
    opposite: false,
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
      visible: false,
      accessibility: {
        enabled: true,
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
                  <p><span className='span-text'>Mean:</span> {simulationData["mean"].toFixed(4)}</p>
                  <Popup
                    content='Standard Deviation'
                    trigger={(
                      <p><span className='span-text'>Std Dev:</span> {simulationData["std_dev"].toFixed(4)}</p>
                    )}
                  />
                  <p><span className='span-text'>Variance:</span> {simulationData["variance"].toFixed(4)}</p>
                </div>
              </div>
            </div>
            <div className='col-5 col-md-5'>
              <div className='form-group col-11 col-md-11'>
                <div>
                  <Popup
                    content='Smallest value of the sample'
                    trigger={(
                      <p><span className='span-text'>Min Value:</span> {simulationData["min_value"].toFixed(4)}</p>
                    )}
                  />
                  <Popup
                    content='Biggest value of the sample'
                    trigger={(
                      <p><span className='span-text'>Max Value:</span> {simulationData["max_value"].toFixed(4)}</p>
                    )}
                  />
                  <Popup
                    content='Confidence Interval; Probability of α to the μ be in this interval'
                    trigger={(
                      <p><span
                        className='span-text2'>C.I for the μ:</span> {`[ ${simulationData['mean_intervals']['min_interval'].toFixed(4)} ; ${simulationData['mean_intervals']['max_interval'].toFixed(4)} ]`}
                      </p>
                    )}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='form'>
          <h4 className='add-left-padding-15'>Probabilities</h4>
          <div className='row'>
            <div className='col-5 col-md-5'>
              <div className="form-group col-11 col-md-11">
                <div>
                  <Popup
                    content='Probability to happen'
                    trigger={(
                      <p><span
                        className='span-text-g'>Green Area:</span> {simulationData['probabilities']['success'].toFixed(2)} %
                      </p>
                    )}
                  />
                </div>
              </div>
            </div>
            <div className='col-5 col-md-5'>
              <Popup
                content='Probability to NOT happen'
                trigger={(
                  <p><span
                    className='span-text-b'>Blue Area:</span> {simulationData['probabilities']['failure'].toFixed(2)} %
                  </p>
                )}
              />

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
