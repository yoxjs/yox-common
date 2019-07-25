import * as is from '../util/is'
import * as constant from '../util/constant'

export default function (target: any, defaultValue?: number): number {
  return is.numeric(target)
    ? +target
    : defaultValue !== constant.UNDEFINED
      ? defaultValue as number
      : 0
}
