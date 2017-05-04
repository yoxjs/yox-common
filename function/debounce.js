
import execute from './execute'

import * as env from '../util/env'
import * as array from '../util/array'

/**
 * 节流调用
 *
 * @param {Function} fn 需要节制调用的函数
 * @param {number} delay 调用的时间间隔
 * @param {?boolean} sync 是否立即触发
 * @return {Function}
 */
export default function (fn, delay, sync) {

  let timer

  return function () {

    if (!timer) {

      let args = array.toArray(arguments)
      if (sync) {
        execute(fn, env.NULL, args)
      }

      timer = setTimeout(
        function () {
          timer = env.NULL
          if (!sync) {
            execute(fn, env.NULL, args)
          }
        },
        delay
      )

    }

  }
}
