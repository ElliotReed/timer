import React, { Component } from 'react';
import './ProgressRing.css';

class ProgressRing extends Component {
  constructor(props) {
    super(props);

    const { radius, stroke } = this.props;

    this.normalizedRadius = radius - stroke * 2;
    this.circumference = this.normalizedRadius * 2 * Math.PI;
  }

  render() {
    const { radius, stroke, progress } = this.props;
    const strokeDashoffset = this.circumference - progress / 100 * this.circumference;

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
            strokeWidth={ stroke }
            strokeDasharray={ this.circumference + ' ' + this.circumference }
            style={ { strokeDashoffset } }
            r={ this.normalizedRadius }
            cx={ radius }
            cy={ radius }
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
            strokeWidth={ stroke }
            r={ this.normalizedRadius }
            cx={ radius }
            cy={ radius }
            />
        </svg>
      </div>
    )
  }
}

export default ProgressRing;
