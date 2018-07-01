import React from 'react';
import './TimerDisplay.css';
import TimeFormat from '../TimeFormat';
import ProgressRing from '../ProgressRing';

const TimerDisplay = (props) => {
  const displayTime = props.displayTime;
  return (
    <div className="display">
      <ProgressRing
        radius={ 180 }
        stroke={ 6 }
        progress={ props.progress }
        />
      <div className="display-time">
        <TimeFormat time={ displayTime.numberOfHours } />
        :<TimeFormat time={ displayTime.numberOfMinutes } />
        :<TimeFormat time={ displayTime.numberOfSeconds } />
      </div>
    </div>
  )
}

export default TimerDisplay;