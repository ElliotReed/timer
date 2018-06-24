import React from 'react';
import './TimerFrequents.css';
import TimeFormat from '../TimeFormat';

const TimerFrequents = (props) => {
  const settings = props.frequentSettings;
  const settingItems = settings.map((setting) => 
    <li key={setting.id}>
      <TimeFormat time={ setting.numberOfHours } />
      :<TimeFormat time={ setting.numberOfMinutes } />
      :<TimeFormat time={ setting.numberOfSeconds } />
    </li>
  );
  return (
    <ul>{ settingItems }</ul>
  )
}

export default TimerFrequents;