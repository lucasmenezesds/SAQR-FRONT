import axios from 'axios';
import React, { Component } from 'react';
import Main from '../Template/Main';
import './SimulationData.css';
import DistributionParameters from "../Distribution/DistributionParameters";
import { BASE_URL } from "../../constants/api";
import { Dropdown } from "semantic-ui-react";

const headerProps = {
  icon: 'calculator',
  title: 'Simulate',
  subtitle: "Here is where you'll input the data to create the simulations you would like to generate",
};

// TODO: refactor
const initialPayload = {
  "data": {
    "number_of_simulations": 100,
    "number_of_samples": 5000,
    "steps": [
      {
        "delivery_step": "picking_time",
        "distribution_method": {
          "name": null,
          "parameters": []
        }
      },
      {
        "delivery_step": "load_time",
        "distribution_method": {
          "name": null,
          "parameters": []
        }
      },
      {
        "delivery_step": "transportation_time",
        "distribution_method": {
          "name": null,
          "parameters": []
        }
      },
      {
        "delivery_step": "receive_time",
        "distribution_method": {
          "name": null,
          "parameters": []
        }
      },
      {
        "delivery_step": "storage_time",
        "distribution_method": {
          "name": null,
          "parameters": []
        }
      }
    ]
  }
};

const initialState = {
  simulationPayload: initialPayload,
  listOfStatisticalMethods: [],
  stepsDistributionsParameters: {
    picking_time: { parameters: [] },
    load_time: { parameters: [] },
    transportation_time: { parameters: [] },
    receive_time: { parameters: [] },
    storage_time: { parameters: [] },
  }
};
export default class SimulationData extends Component {
  state = { ...initialState };

  updateSimulationPayloadStepsData(deliveryStep, distributionName, distributionParameters) {
    this.state.simulationPayload.data.steps.find((element, index) => {
      if (element.delivery_step === deliveryStep) {
        const deliveryStepObj = { ...this.state.simulationPayload.data.steps[index] };

        deliveryStepObj.name = distributionName;
        deliveryStepObj.parameters = distributionParameters;

        this.setState({ deliveryStepObj })
      }
    });
  }

  updateStepsDistributionsParameters(stepName, distributionName) {
    this.state.listOfStatisticalMethods.find((element, index) => {
      if (element.value === distributionName) {
        const stepsDistribution = { ...this.state.stepsDistributionsParameters };
        stepsDistribution[stepName].parameters = element.parameters;
        this.setState({ stepsDistribution })
      }

    });
  }

  componentDidMount() {
    axios.get(`${BASE_URL}/distribution_methods`, {
      headers: {
        'Accept': 'application/vnd.api+json',
      }
    })
      .then(resp => {
        this.setState({ listOfStatisticalMethods: resp.data.data })
      })
      .catch(err => {
        console.log("distribution_methods CATCH");
        console.log(err)
      })
  }

  sendRequest() {
    const { simulationPayload } = this.state;
    const url = `${BASE_URL}/simulate_deliveries`;
    axios.post(url, simulationPayload, {
      headers: {
        'Accept': 'application/vnd.api+json',
      }
    })
      .then((resp) => {
        console.log(resp)
      })
      .catch((err) => {
        alert(`Something Went Wrong\n\n${err}`)
      });
  }

  updateField(event) {
    const simulationData = { ...this.state.simulationPayload };
    simulationData['data'][event.target.name] = event.target.value;
    this.setState({ simulationData })
  }


  renderForm() {
    // TODO: Refactor to re-use dropdown component
    return (
      <div className="form">
        <div className="row simulation-steps">
          <div className="col-2 col-md-2">
            <div className="form-group">
              <label>Number of Simulations</label>
              <input type="text" className="form-control text-center"
                     placeholder={this.state.simulationPayload.data.number_of_simulations}
                     name="number_of_simulations"
                     onChange={e => this.updateField(e)}/>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="form-group">
              <label>Number of generations for each simulation</label>
              <input type="text" className="form-control text-center"
                     placeholder={this.state.simulationPayload.data.number_of_samples}
                     name="number_of_samples"
                     onChange={e => this.updateField(e)}/>

            </div>
          </div>
        </div>
        <hr/>
        <div className="row simulation-steps">
          <div className="col-3 col-md-3">
            <h3>Step: Picking Time</h3>
            <div className="form-group">
              <label>Select a distribution for this step</label>
              <Dropdown
                name="picking_time"
                placeholder="Exponential"
                fluid
                search
                selection
                options={this.state.listOfStatisticalMethods}
                onChange={(event, { name, value }) => {
                  this.updateStepsDistributionsParameters(name, value)
                }}
              />
            </div>
          </div>
          <DistributionParameters parameters={this.state.stepsDistributionsParameters.picking_time.parameters}
                                  stepName={'picking_time'}
                                  updateStepsParameters={this.updateSimulationPayloadStepsData}> </DistributionParameters>
        </div>
        <hr/>
        <div className="row simulation-steps">
          <div className="col-3 col-md-3">
            <h3>Step: Loading Time</h3>
            <div className="form-group">
              <label>Select a distribution for this step</label>
              <Dropdown
                name="load_time"
                placeholder="Exponential"
                fluid
                search
                selection
                options={this.state.listOfStatisticalMethods}
                onChange={(event, { name, value }) => {
                  this.updateStepsDistributionsParameters(name, value)
                }}
              />
            </div>
          </div>
          <DistributionParameters parameters={this.state.stepsDistributionsParameters.load_time.parameters}
                                  stepName={'load_time'}
                                  updateStepsParameters={this.updateSimulationPayloadStepsData}> </DistributionParameters>
        </div>
        <hr/>
        <div className="row simulation-steps">
          <div className="col-3 col-md-3">
            <h3>Step: Transportation Time</h3>
            <div className="form-group">
              <label>Select a distribution for this step</label>
              <Dropdown
                name="transportation_time"
                placeholder="Exponential"
                fluid
                search
                selection
                options={this.state.listOfStatisticalMethods}
                onChange={(event, { name, value }) => {
                  this.updateStepsDistributionsParameters(name, value)
                }}
              />
            </div>
          </div>
          <DistributionParameters parameters={this.state.stepsDistributionsParameters.transportation_time.parameters}
                                  stepName={'transportation_time'}
                                  updateStepsParameters={this.updateSimulationPayloadStepsData}> </DistributionParameters>
        </div>
        <hr/>
        <div className="row simulation-steps">
          <div className="col-3 col-md-3">
            <h3>Step: Receiving Time</h3>
            <div className="form-group">
              <label>Select a distribution for this step</label>
              <Dropdown
                name="receive_time"
                placeholder="Exponential"
                fluid
                search
                selection
                options={this.state.listOfStatisticalMethods}
                onChange={(event, { name, value }) => {
                  this.updateStepsDistributionsParameters(name, value)
                }}
              />
            </div>
          </div>
          <DistributionParameters parameters={this.state.stepsDistributionsParameters.receive_time.parameters}
                                  stepName={'receive_time'}
                                  updateStepsParameters={this.updateSimulationPayloadStepsData}> </DistributionParameters>
        </div>
        <hr/>
        <div className="row simulation-steps">
          <div className="col-3 col-md-3">
            <h3>Step: Storing Time</h3>
            <div className="form-group">
              <label>Select a distribution for this step</label>
              <Dropdown
                name="storage_time"
                placeholder="Exponential"
                fluid
                search
                selection
                options={this.state.listOfStatisticalMethods}
                onChange={(event, { name, value }) => {
                  this.updateStepsDistributionsParameters(name, value)
                }}
              />
            </div>
          </div>
          <DistributionParameters parameters={this.state.stepsDistributionsParameters.storage_time.parameters}
                                  stepName={'storage_time'}
                                  updateStepsParameters={this.updateSimulationPayloadStepsData}> </DistributionParameters>
        </div>
        <hr/>
        <div className="row">
          <div className="col-12 d-flex justify-content-end">
            <button className="btn btn-primary"
                    onClick={e => this.sendRequest(e)}>
              Start Simulation!
            </button>

          </div>
        </div>
      </div>
    )
  }

  render() {
    return (
      <Main {...headerProps}>
        {this.renderForm()}
      </Main>

    );
  }
}
