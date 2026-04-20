import * as React from 'react';
import './time-select.css';

export default function TimeSelect() {
  return (
    <div className="time-select">
      <ol className="fake-select" >
        {
          // this.state.numberOfHours.map((number) =>
          //   <li key={number} > {number} </li>
          // )
        }
      </ol>
      < label htmlFor="select-hours" > Hours </label>
      < select
        name="select-hours"
        id="select-hours"
      // onChange={this.props.onChange}
      >
        {
          // this.state.numberOfHours.map((number) =>
          //   <option key={number} > {number} </option>
          // )
        }
      </select>
    </div>
  )
}