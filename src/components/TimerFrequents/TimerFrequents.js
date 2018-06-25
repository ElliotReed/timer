import React from 'react';
import './TimerFrequents.css';
import TimeFormat from '../TimeFormat';

const TimerFrequents = (props) => {
  const settings = props.frequentSettings;
  const settingItems = settings.map((setting) => 
    <button
      key={ setting.id }
      onClick={ props.clickFrequentSetting }
      setting-data={ JSON.stringify(setting) }>
      <TimeFormat time={ setting.numberOfHours } />
      :<TimeFormat time={ setting.numberOfMinutes } />
      :<TimeFormat time={ setting.numberOfSeconds } />
    </button>
  );
  return (
    <ul>{ settingItems }</ul>
  )
}

export default TimerFrequents;