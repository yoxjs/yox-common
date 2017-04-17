
import * as array from '../util/array'
import * as string from '../util/string'

/**
 * 用前缀匹配数组中的第一个字符串
 *
 * @param {Array.<string>} array
 * @param {string} value
 * @return {Array}
 */
export default function (array, value) {
  let result = [ ]
  array.each(
    array,
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
