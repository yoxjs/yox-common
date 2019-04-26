import * as env from '../util/env'
import isDef from './isDef'

export default function (target: any, defaultValue?: string): string {
  return target != env.NULL && target.toString
    ? target.toString()
    : isDef(defaultValue)
      ? defaultValue as string
      : env.EMPTY_STRING
}
