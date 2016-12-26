
import * as is from './is'
import * as array from './array'

/**
 * 转成驼峰
 *
 * @param {string} str
 * @return {string}
 */
export function camelCase(str) {
  return str.replace(
    /-([a-z])/gi,
    function ($0, $1) {
      return $1.toUpperCase()
    }
  )
}

/**
 * 首字母大写
 *
 * @param {string} str
 * @return {string}
 */
export function capitalize(str) {
  return charAt(str, 0).toUpperCase() + str.slice(1)
}

/**
 * 把字符串解析成对象形式
 *
 * 为了给外部去重的机会，返回的是数组而不是对象
 *
 * @param {string} str
 * @param {string} separator 分隔符，如 & ;
 * @param {string} pair 键值对分隔符，如 = :
 * @return {Array}
 */
export function parse(str, separator, pair) {
  let result = [ ]
  if (is.string(str)) {
    let terms, key, value, item
    array.each(
      str.split(separator),
      function (term) {
        terms = term.split(pair)
        key = terms[0]
        value = terms[1]
        if (key) {
          item = {
            key: key.trim(),
          }
          if (is.string(value)) {
            item.value = value.trim()
          }
          result.push(item)
        }
      }
    )
  }
  return result
}

/**
 * 为了压缩而存在的两个方法
 */
export function charAt(str, index) {
  return str.charAt(index)
}
export function charCodeAt(str, index) {
  return str.charCodeAt(index)
}

// export function replace(str, pattern, replacement) {
//   pattern = pattern.replace(/[$.]/g, '\\$&')
//   return str.replace(
//     new RegExp(`(?:^|\\b)${pattern}(?:$|\\b)`, 'g'),
//     replacement
//   )
// }
//
// export function falsy(str) {
//   return !is.string(str) || str === ''
// }
