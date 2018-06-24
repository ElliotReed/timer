import React, { Component } from 'react';
import './TimerSet.css';

class TimerSet extends Component {
  constructor(props) {
    super(props);
    this.state.setTimeOptions.numberOfHours = Array.from(new Array(100),(val,index)=>index);
    this.state.setTimeOptions.numberOfMinutes = Array.from(new Array(60),(val,index)=>index);
    this.state.setTimeOptions.numberOfSeconds = Array.from(new Array(60),(val,index)=>index);
  }

  state = {
    setTimeOptions: {
      numberOfHours: [],
      numberOfMinutes: [],
      numberOfSeconds: [],
    }
  }

  render() {
    return (
      <div>
        <div>Set timer</div>
          <div>
          <label htmlFor="select-hours">Hours</label>
          <select 
            name="select-hours"
            onChange={this.props.setTimerElement}>
              {  this.state.setTimeOptions.numberOfHours.map((number) =>
              <option key={number}>{number}</option>
              )}
          </select>
          <label htmlFor="select-minutes">Minutes</label>
          <select name="select-minutes" onChange={this.props.setTimerElement}>
            {  this.state.setTimeOptions.numberOfMinutes.map((number) =>
              <option key={number}>{number}</option>
            )}
          </select>
          <label htmlFor="select-seconds">Seconds</label>
          <select name="select-seconds" onChange={this.props.setTimerElement}>
            {  this.state.setTimeOptions.numberOfSeconds.map((number) =>
              <option key={number}>{number}</option>
            )}
          </select>
        </div>
      </div>
    )
  }
}

export default TimerSet;