
import execute from './execute'

import * as env from '../util/env'
import * as array from '../util/array'

/**
 * 节流调用
 *
 * @param {Function} fn 需要节制调用的函数
 * @param {number} delay 调用的时间间隔
 * @return {Function}
 */
export default function (fn, delay) {

  let timer

  return function () {

    if (!timer) {

      execute(
        fn,
        env.NULL,
        array.toArray(arguments)
      )

      timer = setTimeout(
        function () {
          timer = env.NULL
        },
        delay
      )

    }

  }
}
