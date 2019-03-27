
/**
 * 为了压缩，定义的常量
 */
export const TRUE = true
export const FALSE = false
export const NULL = null
export const UNDEFINED = undefined

export const NAN = NaN

export const RAW_TRUE = 'true'
export const RAW_FALSE = 'false'
export const RAW_NULL = 'null'
export const RAW_UNDEFINED = 'undefined'

export const RAW_KEY = 'key'
export const RAW_REF = 'ref'
export const RAW_TAG = 'tag'
export const RAW_SLOT = 'slot'

export const RAW_THIS = 'this'
export const RAW_TYPE = 'type'
export const RAW_TEXT = 'text'
export const RAW_EXPR = 'expr'
export const RAW_NAME = 'name'
export const RAW_VALUE = 'value'
export const RAW_INDEX = 'index'
export const RAW_LENGTH = 'length'
export const RAW_CHILDREN = 'children'
export const RAW_FUNCTION = 'function'
export const RAW_TEMPLATE = 'template'
export const RAW_COMPONENT = 'component'

export const RAW_KEYPATH = 'keypath'
export const RAW_STATIC_KEYPATH = 'staticKeypath'
export const RAW_ABSOLUTE_KEYPATH = 'absoluteKeypath'

export const KEYPATH_SEPARATOR = '.'

export const KEYPATH_PUBLIC_PARENT = '..'
export const KEYPATH_PRIVATE_PARENT = '$parent'

export const KEYPATH_PUBLIC_CURRENT = RAW_THIS
export const KEYPATH_PRIVATE_CURRENT = '$this'

/**
 * Single instance for window in browser
 */
export const win = typeof window !== RAW_UNDEFINED ? window : NULL

/**
 * Single instance for document in browser
 */
export const doc = typeof document !== RAW_UNDEFINED ? document : NULL

/**
 * Single instance for noop function
 */
export function noop() {
  /** yox */
}
