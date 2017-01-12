
import * as is from './is'
import * as char from './char'
import * as array from './array'

/**
 * 转成驼峰
 *
 * @param {string} str
 * @return {string}
 */
export function camelCase(str) {
  if (has(str, char.CHAR_DASH)) {
    return str.replace(
      /-([a-z])/gi,
      function ($0, $1) {
        return $1.toUpperCase()
      }
    )
  }
  return str
}

/**
 * 首字母大写
 *
 * @param {string} str
 * @return {string}
 */
export function capitalize(str) {
  return char.charAt(str, 0).toUpperCase() + slice(str, 1)
}

/**
 * 判断长度大于 0 的字符串
 *
 * @param {*} str
 * @return {boolean}
 */
export function falsy(str) {
  return !is.string(str) || str === char.CHAR_BLANK
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
      split(str, separator),
      function (term) {
        terms = split(term, pair)
        key = terms[0]
        value = terms[1]
        if (key) {
          item = {
            key: trim(key),
          }
          if (is.string(value)) {
            item.value = trim(value)
          }
          array.push(result, item)
        }
      }
    )
  }
  return result
}

/**
 * 替换可正则可用的字符串
 *
 * @param {string} str
 * @param {string} pattern
 * @param {string} replacement
 * @return {string}
 */
// export function replace(str, pattern, replacement) {
//   pattern = pattern.replace(/[$.]/g, '\\$&')
//   return str.replace(
//     new RegExp(`(?:^|\\b)${pattern}(?:$|\\b)`, 'g'),
//     replacement
//   )
// }


export function trim(str) {
 return falsy(str) ? char.CHAR_BLANK : str.trim()
}
export function slice(str, start, end) {
  return is.number(end)
    ? str.slice(start, end)
    : str.slice(start)
}
export function split(str, delimiter) {
  return falsy(str)
    ? [ ]
    : str.split(
        new RegExp(`\\s*${delimiter.replace(/[.*?]/g, '\\$&')}\\s*`)
      )
}
export function indexOf(str, part) {
  return str.indexOf(part)
}
export function has(str, part) {
  return indexOf(str, part) >= 0
}
export function startsWith(str, part) {
  return indexOf(str, part) === 0
}
export function endsWith(str, part) {
  return str === part || str.lastIndexOf(part) === part.length
}
