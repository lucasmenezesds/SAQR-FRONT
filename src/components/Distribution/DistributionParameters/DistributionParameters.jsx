import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Input, Popup } from 'semantic-ui-react';
import './DistributionParameters.css';

const initialParametersState = { parameters: [] };

// eslint-disable-next-line react/prefer-stateless-function
class DistributionParameters extends Component {

  state = { ...initialParametersState };

  createParameterObj(receivedId, receivedName, receivedValue) {
    return {
      id: receivedId,
      name: receivedName,
      value: receivedValue,
    }
  }

  updateParametersList(receivedId, receivedName, receivedValue) {
    this.state.parameters.find((element, index) => {
      if (element.id === receivedId) {
        const deliveryStepObj = { ...this.state.parameters[index] };

        deliveryStepObj.name = receivedName;
        deliveryStepObj.value = receivedValue;

        this.setState({ deliveryStepObj })
      } else {
        const newParam = this.createParameterObj(receivedId, receivedName, receivedValue);
        const joinedArray = this.state.parameters.concat(newParam);

        this.setState({ parameters: joinedArray })
      }
    });

  }

  parameterDiv(param) {
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
            type={param.uppercase}
            id={param.id}
            className="parameterInput text-center"
            placeholder={10}
            name={param.name}
            onChange={(event, { id, name, value }) => {
              this.updateParametersList(id, name, value);
              this.props.updateStepsParameters(this.props.stepName, name, this.state.parameters);
            }}
          />
        </div>
      </div>
    );
  }

  render() {
    const { parameters } = this.props;
    return (
      <>
        {' '}
        {
          parameters.map((currentParam) => this.parameterDiv(currentParam))
        }
        {' '}
      </>
    );
  }
}

DistributionParameters.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  parameters: PropTypes.array.isRequired,
};

export default DistributionParameters;
