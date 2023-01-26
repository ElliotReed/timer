import React from 'react';

import timeFormat from '../TimeFormat';

import './TimerFrequents.css';

import { FrequentSettings } from "../../models";

interface Props {
  frequentSettings: FrequentSettings[];
  clickFrequentSetting: React.MouseEventHandler<HTMLButtonElement>;
}

const TimerFrequents = (props: Props) => {
  const settings = props.frequentSettings;
  const settingItems = settings.map((setting) =>
    <button
      key={setting.id}
      onClick={props.clickFrequentSetting}
      data-setting={JSON.stringify(setting)}>
      {`
      ${timeFormat(setting.numberOfHours)}:${timeFormat(setting.numberOfMinutes)}:${timeFormat(setting.numberOfSeconds)}
      `}

    </button>
  );
  return (
    <div className="frequentSetting__buttons">{settingItems}</div>
  )
}

export default TimerFrequents;