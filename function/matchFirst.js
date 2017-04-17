
import * as env from '../util/env'
import * as array from '../util/array'
import * as string from '../util/string'

/**
 * 用前缀匹配数组中的第一个字符串
 *
 * @param {Array.<string>} list
 * @param {string} value
 * @return {Array}
 */
export default function (list, value) {
  let result = [ ]
  array.each(
    list,
    function (prefix) {
      if (string.startsWith(value, prefix)) {
        array.push(
          result,
          prefix,
          string.slice(value, prefix.length)
        )
        return env.FALSE
      }
    }
  )
  return result
}
