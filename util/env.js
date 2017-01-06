
/**
 * 为了压缩，定义的常量
 *
 * @type {boolean}
 */
export const TRUE = true
export const FALSE = false
export const NULL = null
export const UNDEFINED = undefined

/**
 * 为了压缩，定义的常用字符
 *
 * @type {string}
 */
export const DOT = '.'
export const DASH = '-'
export const SLASH = '/'
export const COMMA = ','
export const COLON = ':'
export const SEMCOL = ';'
export const SQUOTE = "'"
export const DQUOTE = '"'
export const OPAREN = '('
export const CPAREN = ')'
export const OBRACK = '['
export const CBRACK = ']'
export const QUMARK = '?'

export const BLANK = ''
export const TAB = '\t'
export const BREAKLINE = '\n'
export const WHITESPACE = ' '

/**
 * 浏览器环境下的 window 对象
 *
 * @type {?Window}
 */
export const win = typeof window !== 'undefined' ? window : NULL

/**
 * 浏览器环境下的 document 对象
 *
 * @type {?Document}
 */
export const doc = typeof document !== 'undefined' ? document : NULL

/**
 * 空函数
 *
 * @return {Function}
 */
export const noop = function () { /** yox */ }
