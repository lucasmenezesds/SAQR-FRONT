import React, { Component } from 'react';
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
      zones: [], // TODO: aqui eu calculo o Z e METO O LOCO FAZENDO OS BAGUI FICAR BONITINHO
      //   {
      //     value: 114.54853768983546,
      //   },
      //   {
      //     value: 114.54853768983546,
      //     color: '#acf19d',
      //   },
      //   {
      //     value: 115.61940570351564,
      //     color: '#acf19d',
      //   },
      // ],
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

  componentDidMount() {


    axios.get(`${BASE_URL}/simulate_deliveries_list`, {
      headers: {
        'Accept': 'application/vnd.api+json',
      }
    })
      .then(resp => {
        this.setState({ simulatedDataList: resp.data.data })
      })
      .catch(err => {
        console.log("simulate_deliveries_list CATCH");
        console.log(err) //TODO: check it
      })
  }

  simulatedDataDropdown() {
    return (
      <div>
        <hr/>
        <HighchartsReact highcharts={Highcharts} options={this.state.graphOptions}/>
      </div>
    );
  }

  render() {
    if (!this.state.render) {
      return null;
    }

    return (
      <>
        {''}
        {this.simulatedDataDropdown()}
        {''}
      </>
    );
  }
}


export default SimulatedDataList;
