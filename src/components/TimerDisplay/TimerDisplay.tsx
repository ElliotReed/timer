import React from 'react';
import timeFormat from '../TimeFormat';
import ProgressRing from '../ProgressRing';
import './TimerDisplay.css';

interface Props {
	displayTime: {
		numberOfHours: number;
		numberOfMinutes: number;
		numberOfSeconds: number;
	};
	progress: number;
}

export default function TimerDisplay({ displayTime, progress }: Props) {
	return (
		<div className="display">
			<ProgressRing radius={180} stroke={6} progress={progress} />
			<div className="display-time">
				{`
      ${timeFormat(displayTime.numberOfHours)}:${timeFormat(displayTime.numberOfMinutes)}:${timeFormat(displayTime.numberOfSeconds)}
      `}
			</div>
		</div>
	);
};
