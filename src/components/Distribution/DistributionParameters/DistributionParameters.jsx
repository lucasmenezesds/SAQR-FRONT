import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Input, Popup } from 'semantic-ui-react';
import './DistributionParameters.css';

const initialState = { parameters: {} };

// eslint-disable-next-line react/prefer-stateless-function
class DistributionParameters extends Component {
  state = { ...initialState };

  createParameterObj(receivedId, receivedName, receivedValue) {
    return {
      id: receivedId,
      name: receivedName,
      value: receivedValue,
    }
  }

  updateParametersList(receivedId, receivedName, receivedValue, stepName, distributionName) {
    const { parameters } = { ...this.state };
    const currentState = parameters;

    if (!currentState[stepName]) {
      currentState[stepName] = {};
    }

    if (!currentState[stepName][distributionName]) {
      currentState[stepName][distributionName] = { distributionName: distributionName, parametersData: [] }
    }

    const index = currentState[stepName][distributionName].parametersData.findIndex((parameterElement) => {
      return parameterElement.id === receivedId
    });

    if (index !== -1) {
      currentState[stepName][distributionName].parametersData[index].name = receivedName;
      currentState[stepName][distributionName].parametersData[index].value = receivedValue;

      this.setState({ parametersData: currentState })
    } else {
      const newParamObj = this.createParameterObj(receivedId, receivedName, receivedValue);
      const params = currentState[stepName][distributionName].parametersData;

      params.push(newParamObj);
      currentState[stepName][distributionName].parametersData = params;
    }

    this.setState({ parameters: currentState })
  }

  parameterDiv(param, index) {
    return (
      <div className="form-group" key={param.id}>
        <div className="form-group distribution-parameters text-center">
          <Popup
            content={param.meaning}
            trigger={(
              <p>{param.symbol}</p>
            )}
          />
          <Input
            type='number'
            id={param.id}
            className="parameterInput text-center"
            name={param.name}
            onChange={(event, { id, name, value }) => {
              const distributionNameToSend = this.props.parametersList.distributionName;
              const stepNameToSend = this.props.stepName;

              this.updateParametersList(id, name, value, stepNameToSend, distributionNameToSend);
              this.props.updateStepsParameters(this.props.stepName, distributionNameToSend, this.state.parameters[stepNameToSend][distributionNameToSend].parametersData);
            }}
          />
        </div>
      </div>
    );
  }

  render() {
    const { parametersList } = this.props;
    return (
      <>
        <div className="row">
          {' '}
          {
            parametersList.parameters.map((currentParam, index) => {
              return this.parameterDiv(currentParam, index)
            })
          }
          {' '}
        </div>
      </>
    );
  }
}

DistributionParameters.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  parametersList: PropTypes.object.isRequired,
};

export default DistributionParameters;
