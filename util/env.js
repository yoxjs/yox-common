
/**
 * 为了压缩，定义的常量
 */
export const TRUE = true
export const FALSE = false
export const NULL = null
export const UNDEFINED = undefined

export const RAW_TRUE = 'true'
export const RAW_FALSE = 'false'
export const RAW_NULL = 'null'
export const RAW_UNDEFINED = 'undefined'

export const RAW_THIS = 'this'
export const RAW_FUNCTION = 'function'

/**
 * 浏览器环境下的 window 对象
 *
 * @type {?Window}
 */
export const win = typeof window !== RAW_UNDEFINED ? window : NULL

/**
 * 浏览器环境下的 document 对象
 *
 * @type {?Document}
 */
export const doc = typeof document !== RAW_UNDEFINED ? document : NULL

/**
 * 空函数
 *
 * @type {Function}
 */
export function noop() {
  /** yox */
}
