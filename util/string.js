
import * as is from './is'
import * as array from './array'

/**
 * 转成驼峰
 *
 * @param {string} str
 * @return {string}
 */
export function camelCase(str) {
  if (str.indexOf(CHAR_DASH) >= 0) {
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
  return charAt(str, 0).toUpperCase() + str.slice(1)
}

/**
 * 判断长度大于 0 的字符串
 *
 * @param {*} str
 * @return {boolean}
 */
export function falsy(str) {
  return !is.string(str) || str === CHAR_BLANK
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
 * 为了压缩而存在的几个方法
 */
export function trim(str) {
 return falsy(str) ? CHAR_BLANK : str.trim()
}
export function charAt(str, index = 0) {
  return str.charAt(index)
}
export function charCodeAt(str, index = 0) {
  return str.charCodeAt(index)
}
export function startsWith(str, part) {
  return str.indexOf(part) === 0
}
export function endsWith(str, part) {
  return str === part || str.lastIndexOf(part) === part.length
}


/**
 * 为了压缩，定义的常用字符
 *
 * @type {string}
 */

export const CHAR_BLANK = ''

export const CHAR_DOT = '.'
export const CODE_DOT = charCodeAt(CHAR_DOT)

export const CHAR_DASH = '-'
export const CODE_DASH = charCodeAt(CHAR_DASH)

export const CHAR_EQUAL = '='
export const CODE_EQUAL = charCodeAt(CHAR_EQUAL)

export const CHAR_SLASH = '/'
export const CODE_SLASH = charCodeAt(CHAR_SLASH)

export const CHAR_COMMA = ','
export const CODE_COMMA = charCodeAt(CHAR_COMMA)

export const CHAR_COLON = ':'
export const CODE_COLON = charCodeAt(CHAR_COLON)

export const CHAR_SEMCOL = ';'
export const CODE_SEMCOL = charCodeAt(CHAR_SEMCOL)

export const CHAR_SQUOTE = "'"
export const CODE_SQUOTE = charCodeAt(CHAR_SQUOTE)

export const CHAR_DQUOTE = '"'
export const CODE_DQUOTE = charCodeAt(CHAR_DQUOTE)

export const CHAR_OPAREN = '('
export const CODE_OPAREN = charCodeAt(CHAR_OPAREN)

export const CHAR_CPAREN = ')'
export const CODE_CPAREN = charCodeAt(CHAR_CPAREN)

export const CHAR_OBRACK = '['
export const CODE_OBRACK = charCodeAt(CHAR_OBRACK)

export const CHAR_CBRACK = ']'
export const CODE_CBRACK = charCodeAt(CHAR_CBRACK)

export const CHAR_LEFT = '<'
export const CODE_LEFT = charCodeAt(CHAR_LEFT)

export const CHAR_RIGHT = '>'
export const CODE_RIGHT = charCodeAt(CHAR_RIGHT)

export const CHAR_OBRACE = '{'
export const CODE_OBRACE = charCodeAt(CHAR_OBRACE)

export const CHAR_CBRACE = '}'
export const CODE_CBRACE = charCodeAt(CHAR_CBRACE)

export const CHAR_QUMARK = '?'
export const CODE_QUMARK = charCodeAt(CHAR_QUMARK)

export const CHAR_BACKSLASH = '\\'
export const CODE_BACKSLASH = charCodeAt(CHAR_BACKSLASH)

export const CHAR_TAB = '\t'
export const CODE_TAB = charCodeAt(CHAR_TAB)

export const CHAR_BREAKLINE = '\n'
export const CODE_BREAKLINE = charCodeAt(CHAR_BREAKLINE)

export const CHAR_WHITESPACE = ' '
export const CODE_WHITESPACE = charCodeAt(CHAR_WHITESPACE)


// export function replace(str, pattern, replacement) {
//   pattern = pattern.replace(/[$.]/g, '\\$&')
//   return str.replace(
//     new RegExp(`(?:^|\\b)${pattern}(?:$|\\b)`, 'g'),
//     replacement
//   )
// }
//
