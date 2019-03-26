import * as is from '../util/is'

export default function (target: any, defaultValue = 0): number {
  return is.numeric(target)
    ? +target
    : defaultValue
}
