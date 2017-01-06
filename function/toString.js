
import * as env from '../util/env'

export default function (str, defaultValue = env.BLANK) {
  try {
    return str.toString()
  }
  catch (e) {
    return defaultValue
  }
}
