import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './SimulationSteps.css';

const initialState = { parameters: {} };

const distributionNames = {
  'exp': 'Exponential',
  'lognorm': 'LogNormal',
  'gamma': 'Gamma',
  'weibull': 'Weibull'
};

const stepsNames = {
  'picking_time': 'Picking Time',
  'load_time': 'Load Time',
  'transportation_time': 'Transsportation Time',
  'receive_time': 'Receive Time',
  'storage_time': 'Store Time',
};

const parameterSymbols = {
  'alpha': 'α',
  'mu': 'μ',
  'sigma': 'σ',
  'beta': 'Β',
  'theta': 'θ',
  'zeta': 'Ζ'
};

// eslint-disable-next-line react/prefer-stateless-function
class SimulationSteps extends Component {
  state = { ...initialState };

  stepParamDiv(param, index, simulationId) {
    return (
      <div className='col-4 col-md-4'>
        <div className="form-group">
          <div key={`simulationId-${simulationId}-paramId-${param.id}`}>
            <h5>{`${parameterSymbols[param['name']]}:  ${param['value']}`}</h5>
          </div>
        </div>
      </div>
    );
  }

  stepDiv(param, index, simulationId) {
    return (
      <div className="row simulation-steps" key={`simualtion-${simulationId}-step-${index}`}>
        <div className="col-3 col-md-3">
          <h3>{`Step: ${stepsNames[param['delivery-step']]}`}</h3>
          <div className="form-group">
            <h4>{`Distribution: ${distributionNames[param['distribution-method']['name']]}`}</h4>
            <div className='row'>

              {
                param['distribution-method']['parameters'].map((currentParam, indx) => {
                  return this.stepParamDiv(currentParam, indx, simulationId)
                })
              }
            </div>
          </div>
        </div>
      </div>
    );
  }

  simulationDataDiv(simulationData) {
    return (
      <div className='form col-10 col-md-10'>
        <h3>Distribution Data</h3>
        <div className='row'>
          <div className='col-4 col-md-4'>
            <div className="form-group">
              <div>
                <h5>Simulation's Info</h5>
                <p><span className='span-text'>Number of Samples:</span> {simulationData["number-of-samples"]}</p>
                <p><span className='span-text'>Number of Simulations :</span> {simulationData["number-of-simulations"]}
                </p>
              </div>
            </div>
          </div>
          <div className='col-4 col-md-4'>
            <div className="form-group">
              <div>
                <h5>Seed's Info</h5>
                <p><span className='span-text'>Seed Start Range Value:</span> {simulationData[""]}</p>
                <p><span className='span-text'>Seed Final Range Value:</span> {simulationData[""]}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  render() {
    const { simulation } = this.props;

    if (!simulation || !simulation['attributes'] || !simulation['attributes']['simulation-data'] || !simulation['attributes']['steps']) {
      if ((simulation['attributes'] && !simulation['attributes']['simulation-data'])) {
        alert("Something wrong happened with this simulation, and I cant access it's data")
      }
      return (<></>);
    }

    const attributes = simulation['attributes'];

    return (
      <>
        <hr/>
        <div className="row" key={`simulation-data-div-${attributes.id}`}>
          {
            this.simulationDataDiv(attributes['simulation-data'])
          }
        </div>
        <hr/>
        <div className='form' key={`simulation-steps-div-${attributes.id}`}>
          <h3>Steps Data</h3>
          <div className='row'>
            <div className='col-8 col-md-8'>
              <div>
                {
                  attributes.steps.map((currentParam, index) => {
                    return this.stepDiv(currentParam, index, attributes.id)
                  })
                }
              </div>
            </div>
          </div>
        </div>
      </>

    );
  }
}

SimulationSteps.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  simulation: PropTypes.object.isRequired,
};

export default SimulationSteps;
