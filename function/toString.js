
import char from '../util/char'

export default function (str, defaultValue = char.CHAR_BLANK) {
  try {
    return str.toString()
  }
  catch (e) {
    return defaultValue
  }
}
