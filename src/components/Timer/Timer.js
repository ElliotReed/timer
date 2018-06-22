import React, { Component } from 'react';
import './Timer.css';
import soundFile from '../../assets/sound/alarm.mp3';
import TimerSet from '../TimerSet';
import TimerDisplay from '../TimerDisplay';
import TimerFrequents from '../TimerFrequents';

class Timer extends Component {
  state = {
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
    frequentSettings: [{
      id: 1,
      frequency: 1,
      numberOfHours: 0,
      numberOfMinutes: 5,
      numberOfSeconds: 0
    }]
  }

  formatTime = (time) => {
    if (time < 10) {
      return `0${time}`
    } else {
      return `${time}`
    }
  }

  onSetTimerChange = (e) => {
    let numberOf;
    switch(e.target.name) {
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
        [numberOf]: parseInt(e.target.value, 10)}})

    if (!this.state.timerIsRunning) {
      this.displayToCurrentSetting();
    }
  }
  
  displayToCurrentSetting() {
    this.setState({
      displayTime: {
        ...this.state.displayTime,
        numberOfSeconds: this.state.setTime.numberOfSeconds,
        numberOfMinutes: this.state.setTime.numberOfMinutes,
        numberOfHours: this.state.setTime.numberOfHours,
      }
    });
  }

  runTimer = () => {
    console.log('timer started');
    let seconds = this.state.setTime.numberOfSeconds;
    let minutes = this.state.setTime.numberOfMinutes;
    let hours = this.state.setTime.numberOfHours;
    
    if (seconds === 0 && minutes === 0 && hours === 0) {
      return;
    }

    this.updateFrequentSettings();
    this.displayToCurrentSetting();

    this.timeInterval = setInterval(() => {
      if (seconds !== 0 || minutes !== 0 || hours !== 0 ) {
        this.setState({ timerIsRunning: true });
        if (seconds !== 0) {
          seconds--;
          this.setState({
            displayTime: {
              ...this.state.displayTime,
              numberOfSeconds: seconds}})
        } else {
          if (minutes !== 0) {
            minutes--;
            seconds = 59;
            this.setState({
              displayTime: {
                ...this.state.displayTime,
                numberOfMinutes: minutes,
                numberOfSeconds: seconds}})
          } else {
            if (hours !== 0) {
              hours--;
              minutes = 59;
              this.setState({
                displayTime: {
                  ...this.state.displayTime,
                  numberOfHours: hours,
                  numberOfMinutes: minutes,
                  numberOfSeconds: seconds}})
            } 
          }
        }
      } else {
        this.setState({ timerIsRunning: false });
        clearInterval(this.timeInterval);
        this.timeIsUp();
      }
    }, 1000);
  }
  
  stoptimer = () => {
    clearInterval(this.timeInterval);
    this.setState({ timerIsRunning: false });
    // console.log(this.state.timerIsRunning);
  }

  timeIsUp = () => {
    const alarm = new Audio(soundFile);
    alarm.loop = false;
    alarm.volume = 1;
    alarm.play();
  }
  
  updateFrequentSettings = () => {
    let newFrequentSettings = this.state.frequentSettings;
    let newSetting = {
      id: null,
      frequency: 0,
      numberOfHours: this.state.setTime.numberOfHours,
      numberOfMinutes: this.state.setTime.numberOfMinutes,
      numberOfSeconds: this.state.setTime.numberOfSeconds
    }
  
    // console.log(newFrequentSettings);
    // console.log(newSetting);

    newFrequentSettings.map((setting, i) => {
      if ((setting.numberOfHours === newSetting.numberOfHours) && (setting.numberOfMinutes === newSetting.numberOfMinutes) && (setting.numberOfSeconds === newSetting.numberOfSeconds)) {
        // console.log(newSetting);
        setting.frequency++;
        return true;
      } else {
        if (newFrequentSettings.length < 5) {
          newSetting.id = newFrequentSettings.length + 1;
        }
        newFrequentSettings.push(newSetting);
        console.log(newFrequentSettings);
        return false;
      }
    })
    // this.setState({frequentSettings: newFrequentSettings})
  }

  render() {
    return (
      <center>
        <TimerSet setTimerElement={this.onSetTimerChange.bind(this)}/>
        <TimerDisplay 
          numberOfHours={this.formatTime(this.state.displayTime.numberOfHours)}
          numberOfMinutes={this.formatTime(this.state.displayTime.numberOfMinutes)}
          numberOfSeconds={this.formatTime(this.state.displayTime.numberOfSeconds)}
        />
        <div>
          <div>Controls</div>
          <button onClick={this.runTimer}>Start</button>
          <button onClick={this.stoptimer}>Stop</button>
          <button>Pause</button>
          <button>Continue</button>
          <button>Reset</button>
        </div>
        <TimerFrequents frequentSettings={this.state.frequentSettings} />
      </center>
    );
  }
}

export default Timer;