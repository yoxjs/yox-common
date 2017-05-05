
import * as env from '../util/env'
import * as char from '../util/char'

export default function (str, defaultValue = char.CHAR_BLANK) {
  if (str != env.NULL && str.toString) {
    return str.toString()
  }
  return defaultValue
}
