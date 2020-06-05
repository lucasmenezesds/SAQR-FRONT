import axios from 'axios';
import React, { Component } from 'react';
import Main from '../../Template/Main';
import './Simulate.css';
import DistributionParameters from '../../Distribution/DistributionParameters';
import { BASE_URL } from '../../../constants/api';
import { Dropdown, Input } from 'semantic-ui-react';
import LoadingOverlay from 'react-loading-overlay';
import SyncLoader from 'react-spinners/SyncLoader'
import GraphPage from '../../Graphs/GraphPage/GraphPage';
import { Redirect } from "react-router";

const headerProps = {
  icon: 'calculator',
  title: 'Simulate',
  subtitle: "Here is where you'll input the data to create the simulations you would like to generate",
};


const initialDistributionMethodObj = () => {
  return {
    'name': null,
    'parameters': []
  }
};
// TODO: refactor - Duplicated
const stepsNames = {
  'picking_time': 'Picking Time',
  'load_time': 'Load Time',
  'transportation_time': 'Transportation Time',
  'receive_time': 'Receive Time',
  'storage_time': 'Storing Time',
};

// TODO: refactor
const initialPayload = {
  'data': {
    'number_of_simulations': 100,
    'number_of_samples': 5000,
    'start_seed_value': 120,
    'end_seed_value': 720,
    'steps': [
      {
        'delivery_step': 'picking_time',
        'distribution_method': initialDistributionMethodObj()
      },
      {
        'delivery_step': 'load_time',
        'distribution_method': initialDistributionMethodObj()
      },
      {
        'delivery_step': 'transportation_time',
        'distribution_method': initialDistributionMethodObj()
      },
      {
        'delivery_step': 'receive_time',
        'distribution_method': initialDistributionMethodObj()
      },
      {
        'delivery_step': 'storage_time',
        'distribution_method': initialDistributionMethodObj()
      }
    ]
  }
};


const initialState = {
  overlay: false,
  redirectToGraph: true,
  simulationPayload: initialPayload,
  listOfStatisticalMethods: [],
  stepsDistributionsParametersList: {
    picking_time: { distributionName: null, parameters: [] },
    load_time: { distributionName: null, parameters: [] },
    transportation_time: { distributionName: null, parameters: [] },
    receive_time: { distributionName: null, parameters: [] },
    storage_time: { distributionName: null, parameters: [] },
  }
};
export default class Simulate extends Component {
  state = { ...initialState };

  constructor() {
    super();
    this.updateSimulationPayloadStepsData = this.updateSimulationPayloadStepsData.bind(this)
  }

  componentWillUnmount() {
    const initialStepsDistrbutionsList = initialState['stepsDistributionsParametersList'];
    this.setState({ listOfStatisticalMethods: [] });
    this.setState({ stepsDistributionsParametersList: initialStepsDistrbutionsList });
  }

  componentDidMount() {
    const initialStepsDistrbutionsList = initialState['stepsDistributionsParametersList'];
    this.setState({ listOfStatisticalMethods: [] });
    this.setState({ stepsDistributionsParametersList: initialStepsDistrbutionsList });
    axios.get(`${BASE_URL}/distribution_methods`, {
      headers: {
        'Accept': 'application/vnd.api+json',
      }
    })
      .then(resp => {
        this.setState({ listOfStatisticalMethods: resp.data.data })
      })
      .catch(err => {
        console.log('distribution_methods CATCH');
        console.log(err) //TODO: check it
      })
  }

  clearStepDistributionMethodData(stepName) {
    const { simulationPayload } = { ...this.state };
    const currentState = simulationPayload;

    const index = currentState.data.steps.findIndex((element) => {
      return element.delivery_step === stepName
    });

    if (index !== -1) {

      currentState.data.steps[index].distribution_method = initialDistributionMethodObj();

      this.setState({ simulationPayload: currentState })
    }
  }

  updateSimulationPayloadStepsData(deliveryStep, distributionName, distributionParameters) {
    const { simulationPayload } = { ...this.state };
    const currentState = simulationPayload;

    const index = currentState.data.steps.findIndex((element) => {
      return element.delivery_step === deliveryStep
    });

    if (index !== -1) {
      currentState.data.steps[index].distribution_method.name = distributionName;
      currentState.data.steps[index].distribution_method.parameters = distributionParameters;

      this.setState({ simulationPayload: currentState })
    }
  }

  updateStepsDistributionsParametersList(stepName, distributionName) {
    this.clearStepDistributionMethodData(stepName);
    const { stepsDistributionsParametersList } = { ...this.state };
    const currentState = stepsDistributionsParametersList;

    const index = this.state.listOfStatisticalMethods.findIndex((element) => {
      return element.value === distributionName
    });

    if (index !== -1) {
      currentState[stepName].parameters = this.state.listOfStatisticalMethods[index].parameters;
      currentState[stepName].distributionName = distributionName;

      this.setState({ stepsDistributionsParametersList: currentState })
    }

  }

  updateField(event) {
    const { simulationPayload } = { ...this.state };
    const currentState = simulationPayload;

    const receivedValue = event.target.value

    if (receivedValue > 100) {
      alert('The maximum value is 100, sorry');
      return
    }

    if (receivedValue < 1) {
      alert('The minimum value is 1, sorry');
      return
    }


    currentState['data'][event.target.name] = receivedValue;


    this.setState({ simulationPayload: currentState })
  }

  updateCheckBox(event) {
    const redirectToGraphValue = event.target.checked
    this.setState({ redirectToGraph: redirectToGraphValue })
  }

  payloadValidation() {
    // TODO: Add more validations
    const { simulationPayload } = this.state;

    // TODO: refactor and put Form.Field validation later.
    let alertForTheStep = null;
    simulationPayload.data['steps'].forEach((step) => {
      if (!step['distribution_method']['name'] || step['distribution_method']['parameters'].length === 0) {
        alertForTheStep = step['delivery_step'];
      }
    });

    if (alertForTheStep) {
      this.setState({ overlay: false });
      alert(`Please check the values on the Step: ${stepsNames[alertForTheStep]}`);
      return false;
    }

    if (simulationPayload.data['number_of_simulations'] < 30) {
      this.setState({ overlay: false });
      alert('Please insert a value bigger than 30 for the number of simulations');
      return false;
    }

    return true;
  }

  sendRequest() {
    this.setState({ overlay: true });
    const { simulationPayload, redirectToGraph } = this.state;
    const url = `${BASE_URL}/simulate_deliveries`;
    if (redirectToGraph) {
      alert('The processing was successfully done! Select the First Simulation from the list!');
      // <Redirect to={{ pathname: '/order', state: { id: '123' } }}/>
      this.props.history.push({
        pathname: '/graph',
        state: { redirectOptions: { 'status': true, 'simulation-id': '28' } }
      });

      return;
    }

    if (!this.payloadValidation()) {
      this.setState({ overlay: false });
      return;
    }

    axios.post(url, simulationPayload, {
      headers: {
        'Accept': 'application/vnd.api+json',
      }
    })
      .then((resp) => {
        this.setState({ overlay: false });
        // console.log(resp);

        const simulation_id = resp['data']['data']['id']

        if (redirectToGraph) {
          alert('The processing was successfully done! Select the First Simulation from the list!')
          this.props.history.push({
            pathname: '/graph',
            state: { redirectOptions: { 'status': true, 'simulation-id': simulation_id } }
          });

          return;
        }
        alert("The processing was successfully done! Check the Graph's page!");
      })
      .catch((err) => {
        this.setState({ overlay: false });
        console.log(err);
        alert(`Something Went Wrong\n\n${err}`);
      });

  }

  renderForm() {
    // TODO: Refactor to re-use dropdown component
    return (
      <div className='form'>
        <div className='row simulation-steps'>
          <div className='col-2 col-md-2'>
            <div className='form-group text-center'>
              <label>Number of Simulations</label>
              <Input inputMode='numeric' type='number' className='text-center'
                     placeholder={this.state.simulationPayload.data.number_of_simulations}
                     name='number_of_simulations'
                     onChange={e => this.updateField(e)}/>
            </div>
          </div>
          <div className='col-3 col-md-3'>
            <div className='form-group text-center'>
              <label>Number of samples for each simulation</label>
              <Input inputMode='numeric' type='number' className='col-11 col-md-11 text-center'
                     placeholder={this.state.simulationPayload.data.number_of_samples}
                     name='number_of_samples'
                     onChange={e => this.updateField(e)}/>

            </div>
          </div>
          <div className='col-2 col-md-2'>
            <div className='form-group text-center'>
              <label>Min. value for the seed</label>
              <Input inputMode='numeric' type='number' className='text-center'
                     placeholder={this.state.simulationPayload.data.start_seed_value}
                     name='start_seed_value'
                     onChange={e => this.updateField(e)}/>

            </div>
          </div>
          <div className='col-2 col-md-2'>
            <div className='form-group text-center'>
              <label>Max. value for the seed</label>
              <Input inputMode='numeric' type='number' className='text-center'
                     placeholder={this.state.simulationPayload.data.end_seed_value}
                     name='end_seed_value'
                     onChange={e => this.updateField(e)}/>

            </div>
          </div>

          <div className='col-2 col-md-2'>
            <div className='form-group text-center'>
              <label>Redirect to Graph Page?</label>
              <Input type='checkbox' className='checkbox-center'
                     defaultChecked={this.state.redirectToGraph}
                     name='redirectToGraph'
                     onChange={e => {
                       this.updateCheckBox(e);
                     }}/>
            </div>
          </div>
        </div>
        <hr/>
        <div className='row simulation-steps'>
          <div className='col-3 col-md-3'>
            <h3>Step: Picking Time</h3>
            <div className='form-group'>
              <label>Select a distribution for this step</label>
              <Dropdown
                name='picking_time'
                placeholder='Choose an distribution...'
                fluid
                search
                selection
                options={this.state.listOfStatisticalMethods}
                onChange={(event, { name, value }) => {
                  this.updateStepsDistributionsParametersList(name, value)
                }}
              />
            </div>
          </div>
          <DistributionParameters parametersList={this.state.stepsDistributionsParametersList.picking_time}
                                  stepName={'picking_time'}
                                  updateStepsParameters={this.updateSimulationPayloadStepsData}> </DistributionParameters>
        </div>
        <hr/>
        <div className='row simulation-steps'>
          <div className='col-3 col-md-3'>
            <h3>Step: Loading Time</h3>
            <div className='form-group'>
              <label>Select a distribution for this step</label>
              <Dropdown
                name='load_time'
                placeholder='Choose an distribution...'
                fluid
                search
                selection
                options={this.state.listOfStatisticalMethods}
                onChange={(event, { name, value }) => {
                  this.updateStepsDistributionsParametersList(name, value)
                }}
              />
            </div>
          </div>
          <DistributionParameters parametersList={this.state.stepsDistributionsParametersList.load_time}
                                  stepName={'load_time'}
                                  updateStepsParameters={this.updateSimulationPayloadStepsData}> </DistributionParameters>
        </div>
        <hr/>
        <div className='row simulation-steps'>
          <div className='col-3 col-md-3'>
            <h3>Step: Transportation Time</h3>
            <div className='form-group'>
              <label>Select a distribution for this step</label>
              <Dropdown
                name='transportation_time'
                placeholder='Choose an distribution...'
                fluid
                search
                selection
                options={this.state.listOfStatisticalMethods}
                onChange={(event, { name, value }) => {
                  this.updateStepsDistributionsParametersList(name, value)
                }}
              />
            </div>
          </div>
          <DistributionParameters parametersList={this.state.stepsDistributionsParametersList.transportation_time}
                                  stepName={'transportation_time'}
                                  updateStepsParameters={this.updateSimulationPayloadStepsData}> </DistributionParameters>
        </div>
        <hr/>
        <div className='row simulation-steps'>
          <div className='col-3 col-md-3'>
            <h3>Step: Receiving Time</h3>
            <div className='form-group'>
              <label>Select a distribution for this step</label>
              <Dropdown
                name='receive_time'
                placeholder='Choose an distribution...'
                fluid
                search
                selection
                options={this.state.listOfStatisticalMethods}
                onChange={(event, { name, value }) => {
                  this.updateStepsDistributionsParametersList(name, value)
                }}
              />
            </div>
          </div>
          <DistributionParameters parametersList={this.state.stepsDistributionsParametersList.receive_time}
                                  stepName={'receive_time'}
                                  updateStepsParameters={this.updateSimulationPayloadStepsData}> </DistributionParameters>
        </div>
        <hr/>
        <div className='row simulation-steps'>
          <div className='col-3 col-md-3'>
            <h3>Step: Storing Time</h3>
            <div className='form-group'>
              <label>Select a distribution for this step</label>
              <Dropdown
                name='storage_time'
                placeholder='Choose an distribution...'
                fluid
                search
                selection
                options={this.state.listOfStatisticalMethods}
                onChange={(event, { name, value }) => {
                  this.updateStepsDistributionsParametersList(name, value)
                }}
              />
            </div>
          </div>
          <DistributionParameters parametersList={this.state.stepsDistributionsParametersList.storage_time}
                                  stepName={'storage_time'}
                                  updateStepsParameters={this.updateSimulationPayloadStepsData}> </DistributionParameters>
        </div>
        <hr/>
        <div className='row'>
          <div className='col-12 d-flex justify-content-end'>
            <button className='btn btn-primary'
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
        <LoadingOverlay
          active={this.state.overlay}
          spinner={<SyncLoader/>}
          text='Processing your simulation...'
          styles={{
            overlay: (base) => ({
              ...base,
              background: 'rgba(0, 0, 0, 0)',
              color: '#000000'
            }),
          }}
        >
          {this.renderForm()}
        </LoadingOverlay>
      </Main>
    );
  }
}
