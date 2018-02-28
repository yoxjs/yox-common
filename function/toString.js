
import * as env from '../util/env'
import * as char from '../util/char'

export default function (str, defaultValue) {
  if (str != env.NULL && str.toString) {
    return str.toString()
  }
  return arguments[ env.RAW_LENGTH ] === 1
    ? char.CHAR_BLANK
    : defaultValue
}
