
import * as env from '../util/env'

export default function (str, defaultValue = env.EMPTY) {
  try {
    return str.toString()
  }
  catch (e) {
    return defaultValue
  }
}
