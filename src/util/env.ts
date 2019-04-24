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

export const RAW_KEY = 'key'
export const RAW_REF = 'ref'
export const RAW_TAG = 'tag'
export const RAW_SLOT = 'slot'
export const RAW_NAME = 'name'

export const RAW_FILTER = 'filter'
export const RAW_PARTIAL = 'partial'
export const RAW_TRANSITION = 'transition'
export const RAW_DIRECTIVE = 'directive'
export const RAW_COMPONENT = 'component'

export const RAW_THIS = 'this'
export const RAW_FUNCTION = 'function'
export const RAW_TEMPLATE = 'template'

export const RAW_KEYPATH = 'keypath'
export const RAW_STATIC_KEYPATH = 'staticKeypath'
export const RAW_ABSOLUTE_KEYPATH = 'absoluteKeypath'

export const KEYPATH_PARENT = '..'
export const KEYPATH_CURRENT = RAW_THIS

/**
 * Single instance for window in browser
 */
export const win = typeof window !== RAW_UNDEFINED ? window : UNDEFINED

/**
 * Single instance for document in browser
 */
export const doc = typeof document !== RAW_UNDEFINED ? document : UNDEFINED

/**
 * Single instance for noop function
 */
export function EMPTY_FUNCTION() {
  /** yox */
}

/**
 * 空对象，很多地方会用到，比如 `a || plain` 确保是个对象
 */
export const EMPTY_OBJECT = {}

/**
 * 空数组
 */
export const EMPTY_ARRAY = []

/**
 * 空字符串
 */
export const EMPTY_STRING = ''