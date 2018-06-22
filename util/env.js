
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
export const RAW_TYPE = 'type'
export const RAW_TEXT = 'text'
export const RAW_EXPR = 'expr'
export const RAW_NAME = 'name'
export const RAW_VALUE = 'value'
export const RAW_LENGTH = 'length'
export const RAW_CHILDREN = 'children'
export const RAW_FUNCTION = 'function'

export const RAW_KEYPATH = 'keypath'
export const RAW_STATIC_KEYPATH = 'staticKeypath'
export const RAW_ABSOLUTE_KEYPATH = 'absoluteKeypath'

export const KEYPATH_SEPARATOR = '.'

export const KEYPATH_PUBLIC_PARENT = '..'
export const KEYPATH_PRIVATE_PARENT = '$parent'

export const KEYPATH_PUBLIC_CURRENT = RAW_THIS
export const KEYPATH_PRIVATE_CURRENT = '$this'

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
