import axios from 'axios';
import React, { Component } from 'react';
import './SimulatedDataList.css';
import { BASE_URL } from "../../../constants/api";
import { Dropdown } from "semantic-ui-react";

const initialState = { simulatedDataList: [], placeholder: 'YYYY-MM-DD HH:MM' };

// eslint-disable-next-line react/prefer-stateless-function
class SimulatedDataList extends Component {
  state = { ...initialState };

  componentDidMount() {
    axios.get(`${BASE_URL}/simulate_deliveries_list`, {
      headers: {
        'Accept': 'application/vnd.api+json',
      }
    })
      .then(resp => {
        this.setState({ simulatedDataList: resp.data.data })
        if(this.props.redirected){
          const new_placeholder = this.state.simulatedDataList[0]['text']
          this.setState({placeholder: new_placeholder})
        }
      })
      .catch(err => {
        console.log("simulate_deliveries_list CATCH");
        console.log(err) //TODO: check it
      })
  }

  simulatedDataDropdown() {
    return (
      <div className="row simulation-steps" key='SimulatedDataDropdown'>
        <div className="col-6 col-md-6">
          <h3>Simulation Data</h3>
          <div className="form-group">
            <label>Select a simulation to display</label>
            <Dropdown
              name="simulatedDataList"
              placeholder={this.state.placeholder}
              fluid
              search
              selection
              options={this.state.simulatedDataList}
              onChange={(event, { name, value }) => {
                this.props.onChangeActionFunction(value)
              }}
            />
          </div>
        </div>
      </div>
    );
  }

  render() {
    return (
      <>
        {''}
        {this.simulatedDataDropdown()}
        {''}
      </>
    );
  }
}


export default SimulatedDataList;
