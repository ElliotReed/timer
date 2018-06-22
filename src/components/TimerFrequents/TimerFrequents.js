import React from 'react';
import './TimerFrequents.css';

const TimerFrequents = (props) => {
  const settings = props.frequentSettings;
  const settingItems = settings.map((setting) => 
    <li key={setting.id}>
      <span>{ setting.numberOfHours }</span>
      :<span>{ setting.numberOfMinutes }</span>
      :<span>{ setting.numberOfSeconds }</span>
    </li>
  );
  return (
    <ul>{ settingItems }</ul>
  )
}

export default TimerFrequents;