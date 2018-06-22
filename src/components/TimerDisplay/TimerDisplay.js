import React from 'react';
import './TimerDisplay.css';

const TimerDisplay = (props) => {
    return (
<div>
<div>Display time</div>
<div><span>Hours</span>:<span>Minutes</span>:<span>Seconds</span></div>
<div className="display">
  <span>{ props.numberOfHours }</span>
  :<span>{ props.numberOfMinutes }</span>
  :<span>{ props.numberOfSeconds }</span>
</div>
</div>
    )
}

export default TimerDisplay;