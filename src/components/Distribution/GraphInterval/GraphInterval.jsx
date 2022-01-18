import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Input } from 'semantic-ui-react';
import './GraphInterval.css';

const initialState = {
  intervalParameters: {
    until: [
      { id: 0, label: 'Value', value: 0, name: 'untilValue' }
    ],
    between: [
      { id: 1, label: 'From', value: 0, name: 'betweenFrom' },
      { id: 2, label: 'To', value: 0, name: 'betweenTo' }
    ]
  }
};

// eslint-disable-next-line react/prefer-stateless-function
class GraphInterval extends Component {
  state = { ...initialState };

  componentWillUnmount() {
    this.setState({ state: initialState });
  }

  updateIntervalParameterState(receivedValue, indexPos) {
    const currentState = { ...this.state };
    const intervalOption = this.props.intervalOption;
    const intervalParameters = currentState.intervalParameters;
    const intervalOptionArray = intervalParameters[intervalOption];

    intervalOptionArray[indexPos]['value'] = receivedValue;

    // if (receivedValue > 100) {
    //   alert('The maximum value is 100, sorry');
    //   return
    // }
    //
    // if (receivedValue < 1) {
    //   alert('The minimum value is 1, sorry');
    //   return
    // }

    this.setState({ intervalParameters })
  }


  intervalRangeDiv(param, index) {
    return (
      <div className="form-group" key={param.id}>
        <div className="form-group interval-parameters text-center">
          <p>{`${param.label}`}</p>
          <Input
            type='number'
            id={param.id}
            className="intervalInput text-center"
            name={param.name}
            onChange={(event, { id, name, value }) => {
              this.updateIntervalParameterState(value, index);
              this.props.updateIntervalParameter(this.state.intervalParameters)
            }}
          />
        </div>
      </div>
    );
  }

  render() {
    const { intervalOption } = this.props;

    if (!intervalOption) {
      return (<></>);
    }

    return (
      <>
        {' '}
        {
          this.state.intervalParameters[intervalOption].map((currentParam, index) => {
            return this.intervalRangeDiv(currentParam, index)
          })
        }
        {' '}
      </>
    );
  }
}

GraphInterval.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  updateIntervalParameter: PropTypes.func.isRequired,
};

export default GraphInterval;
