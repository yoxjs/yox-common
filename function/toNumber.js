
import * as is from '../util/is'
import * as env from '../util/env'

export default function (str, defaultValue) {
  if (is.numeric(str)) {
    return +str
  }
  return arguments[ env.RAW_LENGTH ] === 1
    ? 0
    : defaultValue
}
