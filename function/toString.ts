import * as env from '../util/env'
import * as char from '../util/char'

export default function (target: any, defaultValue = char.CHAR_BLANK): string {
  return target != env.NULL && target.toString
    ? target.toString()
    : defaultValue
}
