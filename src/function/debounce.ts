import execute from './execute'

import * as array from '../util/array'
import * as constant from '../util/constant'

/**
 * 节流调用
 *
 * @param fn 需要节制调用的函数
 * @param delay 调用的时间间隔，单位毫秒
 * @param immediate 是否立即触发
 * @return 节流函数
 */
export default function (fn: Function, delay: number, immediate?: boolean) {

  let timer: any

  return function () {

    if (!timer) {

      const args = array.toArray(arguments)
      if (immediate) {
        execute(fn, constant.UNDEFINED, args)
      }

      timer = setTimeout(
        function () {
          timer = constant.UNDEFINED
          if (!immediate) {
            execute(fn, constant.UNDEFINED, args)
          }
        },
        delay
      )

    }

  }
}
