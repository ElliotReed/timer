import React, { Component } from 'react';
import TimeSelect from '../TimeSelect/TimeSelect';
import './TimerSet.css';

interface Props {
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

interface StateProps {
    numberOfHours: number[];
    numberOfMinutes: number[];
    numberOfSeconds: number[];
}

class TimerSet extends Component<Props, StateProps> {
    constructor(props: Props) {
        super(props);
        this.state = {
            numberOfHours: [...Array(24).keys()],
            numberOfMinutes: [...Array(60).keys()],
            numberOfSeconds: [...Array(60).keys()],
        }
    }

    render() {
        return (
            <div>
                <TimeSelect />
                <div className="element-container">
                    <div className="display-element">
                        <label htmlFor="select-hours">Hours</label>
                        <select
                            name="select-hours"
                            id="select-hours"
                            onChange={this.props.onChange}
                        >
                            {this.state.numberOfHours.map((number) =>
                                <option key={number}>{number}</option>
                            )}
                        </select>
                    </div>

                    <div className="display-element">
                        <label htmlFor="select-minutes">Minutes</label>
                        <select
                            name="select-minutes"
                            id="select-minutes"
                            onChange={this.props.onChange}
                        >
                            {this.state.numberOfMinutes.map((number) =>
                                <option key={number}>{number}</option>
                            )}
                        </select>
                    </div>

                    <div className="display-element">
                        <label htmlFor="select-seconds">Seconds</label>
                        <select
                            name="select-seconds"
                            id="select-seconds"
                            onChange={this.props.onChange}
                        >
                            {this.state.numberOfSeconds.map((number) =>
                                <option key={number}>{number}</option>
                            )}
                        </select>
                    </div>
                </div>
            </div>
        )
    }
}

export default TimerSet;