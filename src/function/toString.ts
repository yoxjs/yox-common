import * as constant from 'yox-type/src/constant'
import isDef from './isDef'

export default function (target: any, defaultValue?: string): string {
  return target != constant.NULL && target.toString
    ? target.toString()
    : isDef(defaultValue)
      ? defaultValue as string
      : constant.EMPTY_STRING
}
