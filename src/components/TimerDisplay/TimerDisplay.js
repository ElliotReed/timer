import React from 'react';
import './TimerDisplay.css';
import TimeFormat from '../TimeFormat';

const TimerDisplay = (props) => {
  const displayTime = props.displayTime;
  return (
    <div>
      <div className="display">
        <TimeFormat time={ displayTime.numberOfHours } />
        :<TimeFormat time={ displayTime.numberOfMinutes } />
        :<TimeFormat time={ displayTime.numberOfSeconds } />
      </div>
    </div>
  )
}

export default TimerDisplay;