const TimeFormat = (props) => {
  if (props.time < 10) {
    return `0${props.time}`
  } else {
    return `${props.time}`
  }
}

export default TimeFormat;
