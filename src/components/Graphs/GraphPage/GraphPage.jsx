import React, { Component } from 'react';
import BellChart from '../BellChart'
import './GraphPage.css';

// My Components
import Main from '../../Template/Main';
import SimulatedDataList from '../../Simulation/SimulatedDataList';
import axios from "axios";
import { BASE_URL } from "../../../constants/api";
import { Dropdown, Input, Popup } from "semantic-ui-react";
import GraphInterval from "../../Distribution/GraphInterval";

const intervalOptionsState = [
  { key: 'until', value: 'until', text: 'Until' },
  { key: 'between', value: 'between', text: 'Between' },
];

const initialPayload = {
  data: {
    "simulation-id": null,
    "interval-option": { option: null, values: { from: null, to: null } }
  }

};

const initialState = {
  intervalOptions: intervalOptionsState,
  graphPayload: initialPayload,
  confidenceIntervalValue: 95,
  simulationData: {
    "confidence-interval-values": {},
    "graph-div-id": null,
    "data": [],
    "mean": null,
    "std-dev": null,
    "variance": null,
    "data-size": null,
    "max-value": null,
    "min-value": null,
    "number-of-samples": null,
    "number-of-simulations": null,
    "zones": []
  },
  renderGraph: false
};


class GraphPage extends Component {
  state = { ...initialState };

  constructor(props) {
    super(props);
    this.updateIntervalData = this.updateIntervalData.bind(this);
    this.updateSimulationIdState = this.updateSimulationIdState.bind(this);
  }


  componentWillUnmount() {
    this.setState({ state: initialState });
  }

  updateIntervalOptionState(intervalOptionValue) {
    const { graphPayload } = { ...this.state };
    const currentState = graphPayload;

    currentState['data']['interval-option']['option'] = intervalOptionValue;

    this.setState({ graphPayload: currentState })
  }

  updateSimulationIdState(simulateIdValue) {
    const { graphPayload } = { ...this.state };
    const currentState = graphPayload;

    currentState['data']['simulation-id'] = simulateIdValue;

    this.setState({ graphPayload: currentState })
  }

  updateIntervalData(intervalParametersObj) {
    const { graphPayload } = { ...this.state };
    const currentState = graphPayload;

    const option = currentState['data']['interval-option']['option'];

    if (option === 'between') {
      currentState['data']['interval-option'].values.from = intervalParametersObj[option][0]['value'];
      currentState['data']['interval-option'].values.to = intervalParametersObj[option][1]['value'];
    } else {
      currentState['data']['interval-option'].values.from = intervalParametersObj[option][0]['value'];
      currentState['data']['interval-option'].values.to = null;
    }

    this.setState({ graphPayload: currentState })
  }

  updateConfidenceIntervalState(receivedValue) {

    if (receivedValue > 100) {
      alert('The maximum value is 100, sorry');
      return
    }

    if (receivedValue < 1) {
      alert('The minimum value is 1, sorry');
      return
    }

    this.setState({ confidenceIntervalValue: receivedValue })
  }

  sendRequest() {
    const { graphPayload } = { ...this.state };
    const payloadData = graphPayload;
    const url = `${BASE_URL}/bell_chart_data`;
    const missingValueMessage = 'The value should be bigger than 0';
    const intervalOption = payloadData['data']['interval-option'];

    if (intervalOption.option === 'between') {
      if (!intervalOption.values.to) {
        alert(missingValueMessage);
        return;
      }

      if (intervalOption.values.from >= intervalOption.values.to) {
        alert('The value of "From" field should positive bigger than 0 and not be equal or bigger than "To"');
        return;
      }
    }
    if (intervalOption.values.from <= 0) {
      alert(missingValueMessage);
      return;
    }


    axios.post(url, payloadData, {
      headers: {
        'Accept': 'application/vnd.api+json',
      }
    })
      .then((resp) => {
        const currentState = resp.data.data;
        const intervalValues = this.state.graphPayload.data["interval-option"].values;

        currentState["simulation-id"] = this.state.graphPayload.data["simulation-id"];
        currentState["graph-div-id"] = `${this.state.graphPayload.data["simulation-id"]}-${intervalValues.from}-${intervalValues.to}`;

        this.setState({ simulationData: currentState });
        this.setState({ renderGraph: true });

      })
      .catch((err) => {
        console.log(err);
        this.setState({ renderGraph: false });

        alert(`Something Went Wrong\n\n${err}`);
      });

  }


  render() {
    return (
      <Main
        icon="area-chart"
        title="GraphPage"
        subtitle="SAQR - Sistema de Análise Quantitativa de Risco - Quantitative Risk Analysis System"
      >
        <div className="form">
          <div className="row simulation-data">
            <div className="col-5 col-md-5">
              <div className="form-group col-11 col-md-11">
                <SimulatedDataList onChangeActionFunction={this.updateSimulationIdState}
                />
              </div>
            </div>

            <div className="form-group  col-2 col-md-2">
              <h3>Graph Area</h3>
              <label>Choose an interval to highlight</label>
              <Dropdown
                name="intervalOption"
                placeholder="Until"
                fluid
                search
                selection
                options={this.state.intervalOptions}
                onChange={(event, { value }) => {
                  this.updateIntervalOptionState(value)
                }}
              />
              <div className={'top-padding-20'}>
                <Popup
                  content='If Empty, default is 95%'
                  trigger={(
                    <label>Confidence Interval for the μ</label>
                  )}
                />
                <Input
                  label={'α'}
                  type='number'
                  id={'confidenceInterval'}
                  className="confidenceInterval text-center"
                  placeholder={95}
                  name={'confidenceInterval'}
                  onChange={(event, { value }) => {
                    this.updateConfidenceIntervalState(value);
                  }}
                />
              </div>
            </div>
            <GraphInterval intervalOption={this.state.graphPayload.data["interval-option"].option}
                           updateIntervalParameter={this.updateIntervalData}> </GraphInterval>
          </div>
          <div className="row">
            <div className="col-12 d-flex justify-content-end">
              <button
                className="btn btn-primary"
                onClick={(e) => this.sendRequest(e)}
              >
                Show Data!
              </button>

            </div>
          </div>
        </div>

        <BellChart simulationData={this.state.simulationData}
                   render={this.state.renderGraph}/>

      </Main>
    );
  }
}

export default GraphPage;
