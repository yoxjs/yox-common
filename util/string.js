
import * as is from './is'
import * as env from './env'
import * as char from './char'
import * as array from './array'

/**
 * 连字符转成驼峰
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
 * 删除两侧空白符
 *
 * @param {*} str
 * @return {string}
 */
export function trim(str) {
 return falsy(str) ? char.CHAR_BLANK : str.trim()
}

/**
 * 截取字符串
 *
 * @param {string} str
 * @param {number} start
 * @param {?number} end
 * @return {string}
 */
export function slice(str, start, end) {
  return is.number(end)
    ? str.slice(start, end)
    : str.slice(start)
}

/**
 * 分割字符串
 *
 * @param {string} str
 * @param {string} delimiter
 * @return {Array}
 */
export function split(str, delimiter) {
  return falsy(str)
    ? [ ]
    : str.split(
        new RegExp(`\\s*${delimiter.replace(/[.*?]/g, '\\$&')}\\s*`)
      )
}

/**
 * 获取子串的起始位置
 *
 * @param {string} str
 * @param {string} part
 * @param {?number} startIndex
 * @return {number}
 */
export function indexOf(str, part, startIndex) {
  return is.number(startIndex)
    ? str.indexOf(part, startIndex)
    : str.indexOf(part)
}

/**
 * 获取子串的起始位置
 *
 * @param {string} str
 * @param {string} part
 * @param {?number} endIndex
 * @return {number}
 */
export function lastIndexOf(str, part, endIndex) {
  return is.number(endIndex)
    ? str.lastIndexOf(part, endIndex)
    : str.lastIndexOf(part)
}

/**
 * str 是否包含 part
 *
 * @param {string} str
 * @param {string} part
 * @return {boolean}
 */
export function has(str, part) {
  return indexOf(str, part) >= 0
}

/**
 * str 是否以 part 开始
 *
 * @param {string} str
 * @param {string} part
 * @return {boolean}
 */
export function startsWith(str, part) {
  return indexOf(str, part) === 0
}

/**
 * str 是否以 part 结束
 *
 * @param {string} str
 * @param {string} part
 * @return {boolean}
 */
export function endsWith(str, part) {
  let offset = str[ env.RAW_LENGTH ] - part[ env.RAW_LENGTH ]
  return offset >= 0 && lastIndexOf(str, part) === offset
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
