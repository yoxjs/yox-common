
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
 * 删除两侧空白符
 *
 * @param {*} str
 * @return {boolean}
 */
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
  let offset = str.length - part.length
  return offset >= 0 && str.lastIndexOf(part) === offset
}
