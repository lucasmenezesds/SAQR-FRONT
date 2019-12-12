import axios from 'axios';
import React, { Component } from 'react';
import Main from '../template/Main';
// import DropdownInput from "../dropdownInput";
import { Dropdown } from "semantic-ui-react";

const headerProps = {
  icon: 'calculator',
  title: 'Simulate',
  subtitle: "Here is where you'll input the data to create the simulations you would like to generate",
};

const baseUrl = 'http://localhost:3000/simulate';

const cityOptions = [
  { value: '1', displayValue: 'Uberlandia' },
  { value: '2', displayValue: 'Araguari' },
  { value: '3', displayValue: 'Uberaba' }
];
const citiesOptions = [
  { key: '1', value: '1', text: 'Araguari' },
  { key: '2', value: '2', text: 'São Paulo' },
  { key: '3', value: '3', text: 'Uberaba' },
  { key: '4', value: '4', text: 'Uberlândia' },
];


const initialState = {
  simulationParams: {
    numberOfSimulations: 1,
    numberOfTests: 500,
    originCity: '',
    destinationCity: '',
    deliveryDuration: 0,
    numberOfItemsToDeliver: 0,
    numberOfItemsTypes: 0
  },
  listOfCities: [],
};


export default class SimulationData extends Component {
  state = { ...initialState };

  componentWillMount() {
    axios(baseUrl)
      .then(resp => {
        this.setState({ listOfCities: resp.data })
      })
  }

  clear() {
    this.setState({ simualtionParams: initialState.simulationParams });
  }

  save() {
    const { simulationData } = this.state;
    const method = simulationData.id ? 'put' : 'post';
    const url = simulationData.id ? `${baseUrl}/${simulationData.id}` : baseUrl;
    axios[method](url, simulationData)
      .then((resp) => {
        const list = this.getUpdatedList(resp.data);
        this.setState({ simulationData: initialState.simulationParams, list })
      });
  }

  getUpdatedList(simulationData) {
    const list = this.state.list.filter(data => data.id !== simulationData.id);
    list.unshift(simulationData);
    return list
  }

  updateField(event) {
    console.log('evento ----');
    console.log(event.target);
    console.log('----');
    const simulationData = { ...this.state.simulationParams };
    simulationData[event.target.name] = event.target.value;
    this.setState({ simulationData })
  }


  renderForm() {
    return (
      <div className="form">
        <div className="row">
          <div className="col-6 col-md-3">
            <div className="form-group">
              <label>Number of Simulations</label>
              <input type="text" className="form-control text-center"
                     placeholder={this.state.simulationParams.numberOfSimulations}
                     name="numberOfSimulations"
                     onChange={e => this.updateField(e)}/>
            </div>
          </div>

          {/*<div className="col-3 col-md-2">*/}
          {/*  <div className="form-group">*/}
          {/*    <label>Number of Simulations</label>*/}
          {/*    <input type="text" className="form-control text-center"*/}
          {/*           name=""*/}
          {/*           value={this.state.simulationParams.numberOfSimulations}*/}
          {/*           onChange={e => this.updateField(e)}/>*/}
          {/*  </div>*/}
          {/*</div>*/}

          <div className="col-6 col-md-3">
            <div className="form-group">
              <label>Number of generations for each simulation</label>
              <input type="text" className="form-control text-center"
                     placeholder={this.state.simulationParams.numberOfTests}
                     name="numberOfTests"
                     onChange={e => this.updateField(e)}/>

            </div>
          </div>
          <hr/>
          <div className="col-6 col-md-6">
            <div className="form-group">
              <label>Origin City </label>
              <Dropdown
                name='originCity'
                placeholder='Select City'
                fluid
                search
                selection
                options={citiesOptions}
                onChange={e => this.updateField(e)}
              />
            </div>
          </div>

          <div className="col-6 col-md-6">
            <div className="form-group">
              <label>Destination City</label>
              <Dropdown
                name='destinationCity'
                placeholder='Select City'
                fluid
                search
                selection
                options={citiesOptions}
                onChange={e => this.updateField(e)}
              />
            </div>
          </div>

          <div className="col-6 col-md-6">
            <div className="form-group">
              <label>Delivery Duration (Hours)</label>
              <input type="text" className="form-control text-center"
                     placeholder={this.state.simulationParams.deliveryDuration}
                     name="deliveryDuration"
                     onChange={e => this.updateField(e)}/>
            </div>
          </div>

          <div className="col-6 col-md-6">
            <div className="form-group">
              <label>Number of Items to Deliver</label>
              <input type="text" className="form-control text-center"
                     placeholder={this.state.simulationParams.numberOfItemsToDeliver}
                     name="numberOfItemsToDeliver"
                     onChange={e => this.updateField(e)}/>
            </div>
          </div>

          <div className="col-6 col-md-6">
            <div className="form-group">
              <label>Number of Item's Types</label>
              <input type="text" className="form-control text-center"
                     placeholder={this.state.simulationParams.numberOfItemsTypes}
                     name="numberOfItemsTypes"
                     onChange={e => this.updateField(e)}/>
            </div>
          </div>

        </div>
        <hr/>
        <div className="row">
          <div className="col-12 d-flex justify-content-end">
            <button className="btn btn-primary"
                    onClick={e => this.save(e)}>
              Start Simulation!
            </button>

            <button className="btn btn-secondary ml-2"
                    onClick={e => this.clear(e)}>
              Cancel
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
