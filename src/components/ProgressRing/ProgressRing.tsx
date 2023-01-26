import React from 'react';
import './ProgressRing.css';

interface Props {
  radius: number;
  stroke: number;
  progress: number;
}

export default function ProgressRing({
  radius, stroke, progress }: Props) {
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - progress / 100 * circumference;

  return (
    <div>
      <svg
        className="progress-ring"
        height={radius * 2}
        width={radius * 2}
      >
        <circle
          className="progress-ring__circle"
          stroke="white"
          fill="transparent"
          strokeWidth={stroke}
          strokeDasharray={circumference + ' ' + circumference}
          style={{ strokeDashoffset }}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
      </svg>
      <svg
        className="progress-ring__background"
        height={radius * 2}
        width={radius * 2}
      >
        <circle
          stroke="var(--blue)"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
      </svg>
    </div>
  )
}


