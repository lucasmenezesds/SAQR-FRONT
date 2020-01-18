import axios from 'axios';
import React, { Component } from 'react';
import { BASE_URL } from "../../../constants/api";

import LoadingOverlay from 'react-loading-overlay';
import SyncLoader from 'react-spinners/SyncLoader'

import './SimulationHistory.css';
import Main from '../../Template/Main';
import SimulatedDataList from '../SimulatedDataList';
import SimulationSteps from '../SimulationSteps';


const headerProps = {
  icon: 'history',
  title: 'Simulation History',
  subtitle: "Here you'll be able to check the parameters used for the selected simulation",
};

const initialState = {
  overlay: false,
  "data": {
    "simulate_deliveries_id": null
  },
  "simulationToDisplay": {},
};

export default class SimulationHistory extends Component {
  state = { ...initialState };

  constructor(props) {
    super(props);
    this.updateSimulationIdState = this.updateSimulationIdState.bind(this)
  }

  updateSimulationResponseData(responseData) {

    this.setState({ simulationToDisplay: responseData })
  }

  sendRequest() {
    this.setState({ overlay: true });
    const { data } = this.state;
    const simulatDeliveryId = data['simulate_deliveries_id'];
    const url = `${BASE_URL}/simulate_deliveries/${simulatDeliveryId}`;
    axios.get(url, {
      headers: {
        'Accept': 'application/vnd.api+json',
      }
    })
      .then((resp) => {
        this.setState({ overlay: false });
        this.updateSimulationResponseData(resp.data.data);

        console.log(this.state.simulationToDisplay);
      })
      .catch((err) => {
        this.setState({ overlay: false });
        console.log(err);
        alert(`Something Went Wrong\n\n${err}`);
      });
  }

  updateSimulationIdState(simulateIdValue) {
    const currentState = { ...this.state };

    const currentStateData = currentState['data'];

    currentStateData['simulate_deliveries_id'] = simulateIdValue;

    this.setState({ data: currentStateData })
  }

  renderForm() {
    return (
      <div className="form">
        <div className="row simulation-data">
          <div className="col-5 col-md-5">
            <div className="form-group col-11 col-md-11">
              <SimulatedDataList onChangeActionFunction={this.updateSimulationIdState}
              />
            </div>
          </div>
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
        <SimulationSteps simulation={this.state.simulationToDisplay}> </SimulationSteps>
      </div>
    )
  }

  render() {
    return (
      <Main {...headerProps}>
        <LoadingOverlay
          active={this.state.overlay}
          spinner={<SyncLoader/>}
          text='Loading your data...'
          styles={{
            overlay: (base) => ({
              ...base,
              background: 'rgba(0, 0, 0, 0)',
              color: "#000000"
            }),
          }}
        >
          {this.renderForm()}
        </LoadingOverlay>
      </Main>
    );
  }
}
