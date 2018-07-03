import React, {
  Component
} from 'react';
import './Timer.css';
import soundFile from '../../assets/sound/alarm.mp3';
import TimerSet from '../TimerSet';
import TimerDisplay from '../TimerDisplay';
import TimerFrequents from '../TimerFrequents';
import { isEqual } from 'lodash';

class Timer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      setTime: {
        numberOfHours: 0,
        numberOfMinutes: 0,
        numberOfSeconds: 0,
      },
      displayTime: {
        numberOfHours: 0,
        numberOfMinutes: 0,
        numberOfSeconds: 0,
      },
      timerIsRunning: false,
      timerHasRun: false,
      progress: 100,
      isPaused: false,
      shouldClearTimeout: false
    }

    const stored = localStorage.getItem('frequentSettings');
    if (stored) {
      this.state.frequentSettings = JSON.parse(stored);
    }
  }

  onSetTimerChange = (e) => {
    let numberOf;
    switch (e.target.name) {
      case 'select-hours':
        numberOf = 'numberOfHours';
        break;
      case 'select-minutes':
        numberOf = 'numberOfMinutes';
        break;
      case 'select-seconds':
        numberOf = 'numberOfSeconds';
        break;
      default:
        break;
    }

    this.setState({
      setTime: {
        ...this.state.setTime,
        [numberOf]: parseInt(e.target.value, 10)
      },
      timerHasRun: false
    });
  }
  
  componentDidUpdate() {
    let setTime = this.state.setTime;
    let displayTime = this.state.displayTime;
    if (!this.state.timerHasRun) {
      if ((!isEqual(setTime, displayTime)) && (!this.state.timerIsRunning)) {
        this.setState({
          displayTime: {
            ...this.state.displayTime,
            numberOfHours: setTime.numberOfHours,
            numberOfMinutes: setTime.numberOfMinutes,
            numberOfSeconds: setTime.numberOfSeconds
          }
        })
      }
    }
  }

  convertHMSToMilliseconds = (hours, minutes, seconds) => {
    let time = 
      hours * (1000 * 60 * 60) +
      minutes * (1000 * 60) +
      seconds * (1000);
    return time;
  }

  convertMillisecondsToHMS = (time) => {
    let timeObj = {};
    timeObj.hours = Math.floor((time % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    timeObj.minutes = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60));
    timeObj.seconds = Math.floor((time % (1000 * 60)) / 1000);
    return timeObj;
  }
  
  setProgress = (originalTime, time) => {
    this.setState({ progress: ((time)/originalTime) * 100 });
  }
  
  displayOut = (time) => {
    const timeObj = this.convertMillisecondsToHMS(time);
    this.setState({
      displayTime: {
        ...this.state.displayTime,
        numberOfHours: timeObj.hours,
        numberOfMinutes: timeObj.minutes,
        numberOfSeconds: timeObj.seconds
      }
    })
  }
  
  startPauseClickHandler = () => {
    if (this.state.timerIsRunning) {
      if (this.state.isPaused) {
        this.setState({ isPaused: false });
      } else {
        this.setState({ isPaused: true });
      }
    } else {
      this.runTimer();
    }
  }
  
  runTimer = () => {
    // get the current setting
    const setTime = this.state.setTime;
    let time = this.convertHMSToMilliseconds(setTime.numberOfHours, setTime.numberOfMinutes, setTime.numberOfSeconds );
    const originalTime = time;
    // test for no setting
    if (time === 0) {
      return;
    }
    // valid setting, update frequent settings
    this.updateFrequentSettings();
    // initialize progress
    this.setState({ 
      timerIsRunning: true, 
      isPaused: false,
      progress: 100
    });
    // Use date for more accutrate timing
    const interval = 1000; // ms
    let expected = Date.now() + interval;
    let step;
    let timeout;

    step = () => {
      if (time !== 0) {
        var dt = Date.now() - expected; // the drift (positive for overshooting)
        if (dt > interval) {
          // something really bad happened. Maybe the browser (tab) was inactive?
          // possibly special handling to avoid futile "catch up" run
        }
        // do what is to be done
        if (!this.state.isPaused && !this.state.shouldClearTimeout) {
          time -= interval
          this.displayOut(time);
          this.setProgress(originalTime, time);
        }

        if (this.state.shouldClearTimeout) {
          clearTimeout(timeout);
          this.setState({ 
            progress: 100,
            shouldClearTimeout: false });
        } else {
            expected += interval;
            timeout = setTimeout(step, Math.max(0, interval - dt)); // take into account drift
        }

      } else {
          this.setState({ 
            timerHasRun: true,
            timerIsRunning: false,
            isPaused: false
          });
          clearTimeout(timeout);
          this.timeIsUp();
      }
    }
    setTimeout(step, interval);
  }

  stoptimer = () => {
    this.setState({
      timerIsRunning: false,
      shouldClearTimeout: true
    });
  }

  timeIsUp = () => {
    const alarm = new Audio(soundFile);
    alarm.loop = false;
    alarm.volume = 1;
    alarm.play();
  }

  updateFrequentSettings = () => {
    let newFrequentSettings = [];
    this.state.frequentSettings.forEach((setting) => {
      newFrequentSettings.push(setting);
    });

    let newSetting = {
      id: null,
      frequency: 1,
      numberOfHours: this.state.setTime.numberOfHours,
      numberOfMinutes: this.state.setTime.numberOfMinutes,
      numberOfSeconds: this.state.setTime.numberOfSeconds
    }

    let matched = false;

    newFrequentSettings.forEach((setting, i) => {
      if ((setting.numberOfHours === newSetting.numberOfHours) && (setting.numberOfMinutes === newSetting.numberOfMinutes) && (setting.numberOfSeconds === newSetting.numberOfSeconds)) {
        setting.frequency++;
        matched = true;
      }
    });

    if (!matched) {
      if (newFrequentSettings.length < 5) {
        newSetting.id = newFrequentSettings.length + 1;
        newFrequentSettings.push(newSetting);
      } else {
        let minFrequency;
        for (let i = 0; i < newFrequentSettings.length; i++) {
          if (minFrequency === undefined) {
            minFrequency = newFrequentSettings[i].frequency;
          } else {
            if (newFrequentSettings[i].frequency < minFrequency) {
              minFrequency = newFrequentSettings[i].frequency;
            }
          }
        }
        let leastFrequent = newFrequentSettings.filter(leastFrequentSettings => leastFrequentSettings.frequency === minFrequency);
        leastFrequent.sort(function (a, b) {
          return a.id - b.id;
        });
        let primedFrequentSettings = newFrequentSettings.filter((setting) => setting.id !== leastFrequent[0].id);
        primedFrequentSettings.sort(function (a, b) {
          return a.id - b.id;
        });
        for (let p = 0; p < primedFrequentSettings.length; p++) {
          primedFrequentSettings[p].id = p + 1;
        }
        newSetting.id = 5;
        primedFrequentSettings.push(newSetting);
        newFrequentSettings = primedFrequentSettings;
      }
    }
    this.setState({
      frequentSettings: newFrequentSettings
    })
    localStorage.setItem("frequentSettings", JSON.stringify(newFrequentSettings));
  }

  clickFrequentSetting = (e) => {
    const frequentSettingData = JSON.parse(e.target.getAttribute("setting-data"));
    this.setState({
      setTime: {
        ...this.state.setTime,
        numberOfHours: frequentSettingData.numberOfHours,
        numberOfMinutes: frequentSettingData.numberOfMinutes,
        numberOfSeconds: frequentSettingData.numberOfSeconds
      }
    })
  }


  render() {
    return ( 
      <div>
        <TimerSet
          setTimerElement={ this.onSetTimerChange.bind(this) } />
        <TimerDisplay
          displayTime={ this.state.displayTime } 
          progress={ this.state.progress }
          />
        <div className = "controls">
          <button onClick={ this.startPauseClickHandler }>{ (!this.state.timerIsRunning) ?
            "Start" : (this.state.isPaused) ? "Resume" : "Pause" }
          </button> 
          <button onClick={ this.stoptimer }>Stop</button>
        </div>
        <hr />
        <TimerFrequents
          frequentSettings={ this.state.frequentSettings }
          clickFrequentSetting={ this.clickFrequentSetting }
          />
      </div>
    );
  }
}

export default Timer;