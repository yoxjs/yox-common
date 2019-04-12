import * as env from '../util/env'

export default function (target: any, defaultValue = env.EMPTY_STRING): string {
  return target != env.NULL && target.toString
    ? target.toString()
    : defaultValue
}
