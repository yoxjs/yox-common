import * as constant from '../util/constant'

export default function (target: any, defaultValue?: string): string {
  return target != constant.NULL && target.toString
    ? target.toString()
    : defaultValue !== constant.UNDEFINED
      ? defaultValue as string
      : constant.EMPTY_STRING
}
