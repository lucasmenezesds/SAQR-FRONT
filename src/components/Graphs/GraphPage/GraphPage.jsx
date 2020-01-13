import React, { Component } from 'react';
import BellChart from '../BellChart'
import './GraphPage.css';

// My Components
import Main from '../../Template/Main';
import SimulatedDataList from '../../Simulation/SimulatedDataList';
import axios from "axios";
import { BASE_URL } from "../../../constants/api";
import { Dropdown } from "semantic-ui-react";
import ConfidenceInterval from "../../Distribution/ConfidenceInterval";

const confidenceOptions = [
  { key: 'until', value: 'until', text: 'Until' },
  { key: 'between', value: 'between', text: 'Between' },
];

const initialPayload = {
  data: {
    "simulation-id": null,
    "confidence-option": { option: null, values: { from: null, to: null } }
  }

};

const initialState = {
  confidenceOptions: confidenceOptions,
  graphPayload: initialPayload,
  simulationData: {
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
    this.updateConfidenceData = this.updateConfidenceData.bind(this);
    this.updateSimulationIdState = this.updateSimulationIdState.bind(this);
  }


  componentWillUnmount() {
    this.setState({ state: initialState });
  }

  updateConfidenceOptionState(confidenceOptionValue) {
    const { graphPayload } = { ...this.state };
    const currentState = graphPayload;

    currentState['data']['confidence-option']['option'] = confidenceOptionValue;

    this.setState({ graphPayload: currentState })
  }

  updateSimulationIdState(simulateIdValue) {
    const { graphPayload } = { ...this.state };
    const currentState = graphPayload;

    currentState['data']['simulation-id'] = simulateIdValue;

    this.setState({ graphPayload: currentState })
  }

  updateConfidenceData(confidenceParametersObj) {
    const { graphPayload } = { ...this.state };
    const currentState = graphPayload;

    const option = currentState['data']['confidence-option']['option'];

    if (option === 'between') {
      currentState['data']['confidence-option'].values.from = confidenceParametersObj[option][0]['value'];
      currentState['data']['confidence-option'].values.to = confidenceParametersObj[option][1]['value'];
    } else {
      currentState['data']['confidence-option'].values.from = confidenceParametersObj[option][0]['value'];
      currentState['data']['confidence-option'].values.to = null;
    }

    this.setState({ graphPayload: currentState })
  }

  sendRequest() {
    const { graphPayload } = { ...this.state };
    const payloadData = graphPayload;
    const url = `${BASE_URL}/bell_chart_data`;
    const missingValueMessage = 'The value should be bigger than 0';
    const confidenceOption = payloadData['data']['confidence-option'];

    if (confidenceOption.option === 'between') {
      if (!confidenceOption.values.to) {
        alert(missingValueMessage);
        return;
      }

      if (confidenceOption.values.from >= confidenceOption.values.to) {
        alert('The value of "From" field should positive bigger than 0 and not be equal or bigger than "To"');
        return;
      }
    }
    if (confidenceOption.values.from <= 0) {
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
        const confidenceValues = this.state.graphPayload.data["confidence-option"].values;

        currentState["simulation-id"] = this.state.graphPayload.data["simulation-id"];
        currentState["graph-div-id"] = `${this.state.graphPayload.data["simulation-id"]}-${confidenceValues.from}-${confidenceValues.to}`;

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
              <h3>Confidence Interval</h3>
              <label>Choose an Interval</label>
              <Dropdown
                name="confidenceOption"
                placeholder="Until"
                fluid
                search
                selection
                options={this.state.confidenceOptions}
                onChange={(event, { value }) => {
                  this.updateConfidenceOptionState(value)
                }}
              />
            </div>
            <ConfidenceInterval confidenceOption={this.state.graphPayload.data["confidence-option"].option}
                                updateConfidenceParameter={this.updateConfidenceData}> </ConfidenceInterval>
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
