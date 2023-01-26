export default function timeFormat(time: number) {
  if (time < 10) {
    return `0${time}`
  } else {
    return `${time}`
  }
}
