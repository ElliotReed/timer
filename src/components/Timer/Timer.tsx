import React, { Component } from 'react';
import { isEqual } from 'lodash';

import TimerSet from '../TimerSet';
import TimerDisplay from '../TimerDisplay';
import TimerFrequents from '../TimerFrequents';
// import Notification from '../../removedfromcheck/Notification';

import soundFile from '../../assets/sound/alarm.mp3';

import './Timer.css';

import { FrequentSettings } from "../../models";

interface StateProps {
	setTime: {
		numberOfHours: number;
		numberOfMinutes: number;
		numberOfSeconds: number;
	},
	displayTime: {
		numberOfHours: number;
		numberOfMinutes: number;
		numberOfSeconds: number;
	},
	timerIsRunning: boolean;
	timerHasRun: boolean;
	progress: number,
	isPaused: boolean;
	shouldClearTimeout: boolean;
	frequentSettings: FrequentSettings[] | [];
}

class Timer extends Component {
	state: StateProps = {
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
		shouldClearTimeout: false,
		frequentSettings: [],
	};

	stored: string | null = localStorage.getItem('frequentSettings');

	setFrequentSettingsFromLocalStorage() {
		if (this.stored) {
			this.setState({frequentSettings: JSON.parse(this.stored)});
		}
	}

	onSetTimerChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const { currentTarget } = e;
		let numberOf: string = getPropertyToChangeFromEventTarget(currentTarget);

		this.setState({
			setTime: {
				...this.state.setTime,
				[numberOf]: parseInt(currentTarget.value, 10),
			},
			timerHasRun: false,
		});
	};

	resetDisplay = (): void => {
		const { displayTime, setTime } = this.state;
		this.setState({
			displayTime: {
				...displayTime,
				numberOfHours: setTime.numberOfHours,
				numberOfMinutes: setTime.numberOfMinutes,
				numberOfSeconds: setTime.numberOfSeconds,
			},
		});
	};

	setProgress = (originalTime: number, time: number) => {
		this.setState({ progress: (time / originalTime) * 100 });
	};

	displayOutput = (time: number) => {
		const timeObj = convertMillisecondsToHMS(time);
		this.setState({
			displayTime: {
				...this.state.displayTime,
				numberOfHours: timeObj.hours,
				numberOfMinutes: timeObj.minutes,
				numberOfSeconds: timeObj.seconds,
			},
		});
	};

	startPauseClickHandler = () => {
		if (this.state.timerIsRunning) {
			if (this.state.isPaused) {
				this.setState({ isPaused: false });
			} else {
				this.setState({ isPaused: true });
			}
		} else {
			this.setState({ timerHasRun: false });
			this.runTimer();
		}
	};

	runTimer = () => {
		// get the current setting
		const setTime = this.state.setTime;
		let time = convertHMSToMilliseconds(
			setTime.numberOfHours,
			setTime.numberOfMinutes,
			setTime.numberOfSeconds
		);
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
			progress: 100,
		});
		// Use date for more accutrate timing
		const interval = 1000; // ms
		let expected = Date.now() + interval;
		let step: () => void;
		let timeout: number;

		step = () => {
			if (time > 0) {
				var dt = Date.now() - expected; // the drift (positive for overshooting)
				if (dt > interval) {
					// something really bad happened. Maybe the browser (tab) was inactive?
					// possibly special handling to avoid futile "catch up" run
				}
				// do what is to be done
				if (!this.state.isPaused && !this.state.shouldClearTimeout) {
					time -= interval;
					this.displayOutput(time);
					this.setProgress(originalTime, time);
				}

				if (this.state.shouldClearTimeout) {
					clearTimeout(timeout);
					this.setState({
						progress: 100,
						shouldClearTimeout: false,
					});
				} else {
					expected += interval;
					timeout = setTimeout(step, Math.max(0, interval - dt)); // take into account drift
				}
			} else {
				this.setState({
					timerHasRun: true,
					timerIsRunning: false,
					isPaused: false,
				});

				clearTimeout(timeout);
				this.playAlarm();
			}
		};

		setTimeout(step, interval);
	};

	stoptimer = () => {
		this.setState({
			timerIsRunning: false,
			shouldClearTimeout: true,
		});
	};

	playAlarm = () => {
		const alarm = new Audio(soundFile);
		alarm.loop = false;
		alarm.volume = 1;
		alarm.play();
		setTimeout(() => {
			this.resetDisplay();
		}, 5000);
	};

	updateFrequentSettings = () => {
		let newFrequentSettings: FrequentSettings[] =
			[...this.state.frequentSettings];

		let newSetting: FrequentSettings = {
			id: null,
			frequency: 1,
			numberOfHours: this.state.setTime.numberOfHours,
			numberOfMinutes: this.state.setTime.numberOfMinutes,
			numberOfSeconds: this.state.setTime.numberOfSeconds,
		};

		let matched = false;

		newFrequentSettings.forEach((setting, i) => {
			if (
				setting.numberOfHours === newSetting.numberOfHours &&
				setting.numberOfMinutes === newSetting.numberOfMinutes &&
				setting.numberOfSeconds === newSetting.numberOfSeconds
			) {
				setting.frequency++;
				matched = true;
			}
		});

		if (!matched) {
			if (newFrequentSettings.length < 5) {
				newSetting.id = newFrequentSettings.length + 1;
				newFrequentSettings.push(newSetting);
			} else {
				let minFrequency: number = 0;

				for (let i = 0; i < newFrequentSettings.length; i++) {
					if (minFrequency === 0) {
						minFrequency = newFrequentSettings[i].frequency;
					} else {
						if (newFrequentSettings[i].frequency < minFrequency) {
							minFrequency = newFrequentSettings[i].frequency;
						}
					}
				}

				let leastFrequent = newFrequentSettings.filter(
					(leastFrequentSettings) =>
						leastFrequentSettings.frequency === minFrequency
				).sort(function (a, b) {
					if (!(a.id && b.id)) return 0;
					return a.id - b.id;
				});

				let primedFrequentSettings = newFrequentSettings.filter(
					setting => setting.id !== leastFrequent[0].id
				).sort(function (a, b) {
					if (!(a.id && b.id)) return 0;
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
			frequentSettings: newFrequentSettings,
		});

		localStorage.setItem(
			'frequentSettings',
			JSON.stringify(newFrequentSettings)
		);
	};

	clickFrequentSetting = (e: React.MouseEvent<HTMLButtonElement>) => {
		const data = e.currentTarget.getAttribute('data-setting');

		if (!data) return;

		const frequentSettingData = JSON.parse(data);

		this.setState(
			{
				setTime: {
					...this.state.setTime,
					numberOfHours: frequentSettingData.numberOfHours,
					numberOfMinutes: frequentSettingData.numberOfMinutes,
					numberOfSeconds: frequentSettingData.numberOfSeconds,
				},
			},
			this.resetDisplay
		);
	};

	componentDidMount(): void {
		this.setFrequentSettingsFromLocalStorage()
	}

	componentDidUpdate() {
		let setTime = this.state.setTime;
		let displayTime = this.state.displayTime;
		if (!this.state.timerHasRun) {
			if (!isEqual(setTime, displayTime) && !this.state.timerIsRunning) {
				this.resetDisplay();
			}
		}
	}

	render() {
		return (
			<div>
				<TimerSet onChange={this.onSetTimerChange} />
				<TimerDisplay
					displayTime={this.state.displayTime}
					progress={this.state.progress}
				/>
				<div className="controls">
					<button onClick={this.startPauseClickHandler}>
						{!this.state.timerIsRunning
							? 'Start'
							: this.state.isPaused
								? 'Resume'
								: 'Pause'}
					</button>
					<button onClick={this.stoptimer}>Stop</button>
				</div>
				<hr />
				<TimerFrequents
					frequentSettings={this.state.frequentSettings}
					clickFrequentSetting={this.clickFrequentSetting}
				/>
				{/* <Notification /> */}
			</div>
		);
	}
}

function convertHMSToMilliseconds(hours: number, minutes: number, seconds: number): number {
	let time =
		hours * (1000 * 60 * 60) + minutes * (1000 * 60) + seconds * 1000;
	return time;
};

function convertMillisecondsToHMS(time: number): { hours: number, minutes: number, seconds: number } {
	let timeObj = {
		hours: 0,
		minutes: 0,
		seconds: 0,
	};

	timeObj.hours = Math.floor((time % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
	timeObj.minutes = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60));
	timeObj.seconds = Math.floor((time % (1000 * 60)) / 1000);
	return timeObj;
};

function getPropertyToChangeFromEventTarget(target: HTMLSelectElement) {
	let numberOf: string = '';

	switch (target.name) {
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

	return numberOf;
}

export default Timer;
