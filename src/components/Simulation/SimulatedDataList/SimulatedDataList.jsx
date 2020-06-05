import axios from 'axios';
import React, { Component } from 'react';
import './SimulatedDataList.css';
import { BASE_URL } from "../../../constants/api";
import { Dropdown } from "semantic-ui-react";

const initialState = { simulatedDataList: [] };

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
      })
      .catch(err => {
        console.log("simulate_deliveries_list CATCH");
        console.log(err) //TODO: check it
      })
  }

  setPlaceholder(){
    if(this.props.redirected){
      ''
    }

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
              placeholder="YYYY-MM-DD HH:MM"
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
