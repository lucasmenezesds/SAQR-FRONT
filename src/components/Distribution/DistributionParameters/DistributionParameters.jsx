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
    const currentState = { ...this.state };
    const deliveryStepObj = currentState.parameters;

    if (!deliveryStepObj[stepName]) {
      deliveryStepObj[stepName] = {};
    }

    if (!deliveryStepObj[stepName][distributionName]) {
      deliveryStepObj[stepName][distributionName] = { distributionName: distributionName, parametersData: [] }
    }

    const index = deliveryStepObj[stepName][distributionName].parametersData.findIndex((parameterElement) => {
      return parameterElement.id === receivedId
    });

    if (index !== -1) {
      deliveryStepObj[stepName][distributionName].parametersData[index].name = receivedName;
      deliveryStepObj[stepName][distributionName].parametersData[index].value = receivedValue;

      this.setState({ parametersData: deliveryStepObj })
    } else {
      const newParamObj = this.createParameterObj(receivedId, receivedName, receivedValue);
      const params = deliveryStepObj[stepName][distributionName].parametersData;

      params.push(newParamObj);
      deliveryStepObj[stepName][distributionName].parametersData = params;
    }

    this.setState({ parameters: deliveryStepObj })
  }

  parameterDiv(param, index) {
    return (
      // <div className="form-group" >
      <div className="" key={param.id}>
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
          placeholder={10}
          name={param.name}
          onChange={(event, { id, name, value }) => {
            const distributionNameToSend = this.props.parametersList.distributionName;
            const stepNameToSend = this.props.stepName;

            this.updateParametersList(id, name, value, stepNameToSend, distributionNameToSend);
            this.props.updateStepsParameters(this.props.stepName, distributionNameToSend, this.state.parameters[stepNameToSend][distributionNameToSend].parametersData);
          }}
        />
      </div>
      // </div>
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
