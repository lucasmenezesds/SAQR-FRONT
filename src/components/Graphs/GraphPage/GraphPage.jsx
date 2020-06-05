import React, { Component } from 'react';
import BellChart from '../BellChart'
import './GraphPage.css';

// My Components
import Main from '../../Template/Main';
import SimulatedDataList from '../../Simulation/SimulatedDataList';
import axios from 'axios';
import { BASE_URL } from '../../../constants/api';
import { Dropdown, Input, Popup } from 'semantic-ui-react';
import GraphInterval from '../../Distribution/GraphInterval';

const intervalOptionsState = [
  { key: 'until', value: 'until', text: 'Until' },
  { key: 'between', value: 'between', text: 'Between' },
];

const initialPayload = {
  data: {
    'simulation-id': null,
    'interval-option': { option: null, values: { from: null, to: null } }
  }

};

const initialState = {
  redirectOptions: { 'status': false, 'simulation-id': null },
  intervalOptions: intervalOptionsState,
  graphPayload: initialPayload,
  confidenceIntervalValue: 95,
  simulationData: {
    'confidence-interval-values': {},
    'graph-div-id': null,
    'data': [],
    'mean': null,
    'std-dev': null,
    'variance': null,
    'data-size': null,
    'max-value': null,
    'min-value': null,
    'number-of-samples': null,
    'number-of-simulations': null,
    'zones': []
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

  componentDidMount(props) {
    const propsLocationState = this.props.location.state;
    console.log('propsLocationState')
    console.log(propsLocationState)
    if (propsLocationState){
      this.processRedirectionData(propsLocationState.redirectOptions);
    }
  }

  componentWillUnmount() {
    this.setState({ state: initialState });
  }

  processRedirectionData(redirectOptions) {
    // const redirectOptions = this.props.location.state.redirectOptions;
    console.log('bang veio que veio');

    if (!redirectOptions['status']) return;

    const simulationId = redirectOptions['simulation-id']
    // this.updateSimulationIdState(simulationId)
    this.updateSimulationIdState(simulationId)
    console.log('simulation id do rolezao')
    console.log(simulationId)
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
    const { graphPayload } = { ...this.state };
    const currentState = graphPayload;

    currentState['data']['alpha-value'] = receivedValue;

    if (receivedValue > 95) {
      alert('The maximum value is 95, sorry');
      return
    }

    if (receivedValue < 1) {
      alert('The minimum value is 1, sorry');
      return
    }

    this.setState({ graphPayload: currentState })
  }

  sendRequest() {
    const { graphPayload, redirectOptions } = { ...this.state };
    const payloadData = graphPayload;
    const url = `${BASE_URL}/bell_chart_data`;
    // const shouldBeANumberMessage = 'The value should be number, if float with . instead of ,';

    if (redirectOptions['status']) {
      graphPayload['data']['simulation-id'] = redirectOptions['"simulation-id"']
    }

    const intervalOption = payloadData['data']['interval-option'];

    if (!graphPayload['data']['simulation-id']) {
      alert('Please select a simulation from the list');
      return;
    }

    if (intervalOption.option === 'between') {
      // if (!intervalOption.values.to) {
      //   alert(missingValueMessage);
      //   return;
      // }


      if (intervalOption.values.from >= intervalOption.values.to) {
        alert("The value of 'From' field should positive bigger than 0 and not be equal or bigger than 'To'");
        return;
      }

    }
    // if (intervalOption.values.from <= 0) {
    //   alert(missingValueMessage);
    //   return;
    // }


    axios.post(url, payloadData, {
      headers: {
        'Accept': 'application/vnd.api+json',
      }
    })
      .then((resp) => {
        const currentState = resp.data.data;
        const intervalValues = this.state.graphPayload.data['interval-option'].values;

        currentState['simulation-id'] = this.state.graphPayload.data['simulation-id'];
        currentState['graph-div-id'] = `${this.state.graphPayload.data['simulation-id']}-${intervalValues.from}-${intervalValues.to}`;

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
        icon='area-chart'
        title='Graph Page'
        subtitle="Here you'll be able to check Bell's Chart Graph for the selected simulation"
      >
        <div className='form'>
          <div className='row simulation-data'>
            <div className='col-5 col-md-5'>
              <div className='form-group col-11 col-md-11'>
                <SimulatedDataList onChangeActionFunction={this.updateSimulationIdState}
                />
              </div>
            </div>

            <div className='form-group  col-2 col-md-2'>
              <h3>Graph Area</h3>
              <label>Choose an interval to highlight</label>
              <Dropdown
                name='intervalOption'
                placeholder='Select an option'
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
                  className='confidenceInterval text-center'
                  placeholder={95}
                  name={'confidenceInterval'}
                  onChange={(event, { value }) => {
                    this.updateConfidenceIntervalState(value);
                  }}
                />
              </div>
            </div>
            <GraphInterval intervalOption={this.state.graphPayload.data['interval-option'].option}
                           updateIntervalParameter={this.updateIntervalData}> </GraphInterval>
          </div>
          <div className='row'>
            <div className='col-12 d-flex justify-content-end'>
              <button
                className='btn btn-primary'
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
