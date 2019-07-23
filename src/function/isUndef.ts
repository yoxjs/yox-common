import * as constant from '../util/constant'

export default function (target: any): boolean {
  return target === constant.UNDEFINED
}
