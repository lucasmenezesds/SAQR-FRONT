import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Input } from 'semantic-ui-react';
import './ConfidenceInterval.css';

const initialState = {
  confidenceParameters: {
    until: [
      { id: 0, label: '', value: null, placeholder: 90, name: 'untilValue' }
    ],
    between: [
      { id: 1, label: 'From', value: null, placeholder: 50, name: 'betweenFrom' },
      { id: 2, label: 'To', value: null, placeholder: 85, name: 'betweenTo' }
    ]
  }
};

// eslint-disable-next-line react/prefer-stateless-function
class ConfidenceInterval extends Component {
  state = { ...initialState };

  componentWillUnmount() {
    this.setState({ state: initialState });
  }

  updateConfidenceParameterState(receivedValue, indexPos) {
    const currentState = { ...this.state };
    const confidenceOption = this.props.confidenceOption;
    const confidenceParameters = currentState.confidenceParameters;
    const confidenceOptionArray = confidenceParameters[confidenceOption];

    confidenceOptionArray[indexPos]['value'] = receivedValue;

    if (receivedValue > 95) {
      alert('The maximum value is 95, sorry');
      return
    }

    this.setState({ confidenceParameters })
  }

  confidenceIntervalDiv(param, index) {
    return (
      <div className="form-group" key={param.id}>
        <div className="form-group confidence-parameters text-center">
          <p>{`${param.label} %`}</p>
          <Input
            type='number'
            id={param.id}
            className="confidenceInput text-center"
            placeholder={param.placeholder}
            name={param.name}
            onChange={(event, { id, name, value }) => {
              this.updateConfidenceParameterState(value, index);
              this.props.updateConfidenceParameter(this.state.confidenceParameters)
            }}
          />
        </div>
      </div>
    );
  }

  render() {
    const { confidenceOption } = this.props;

    if (!confidenceOption) {
      return (<></>);
    }

    return (
      <>
        {' '}
        {
          this.state.confidenceParameters[confidenceOption].map((currentParam, index) => {
            return this.confidenceIntervalDiv(currentParam, index)
          })
        }
        {' '}
      </>
    );
  }
}

ConfidenceInterval.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  updateConfidenceParameter: PropTypes.func.isRequired,
};

export default ConfidenceInterval;
