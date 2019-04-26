import * as is from '../util/is'
import isDef from './isDef'

export default function (target: any, defaultValue?: number): number {
  return is.numeric(target)
    ? +target
    : isDef(defaultValue)
      ? defaultValue as number
      : 0
}
