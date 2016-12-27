
export default function (str, defaultValue = '') {
  try {
    return str.toString()
  }
  catch (e) {
    return defaultValue
  }
}
