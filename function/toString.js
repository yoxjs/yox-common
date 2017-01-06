
import * as string from '../util/string'

export default function (str, defaultValue = string.CHAR_BLANK) {
  try {
    return str.toString()
  }
  catch (e) {
    return defaultValue
  }
}
