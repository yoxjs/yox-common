/**
 * 为了压缩，定义的常量
 */
export const TRUE = true
export const FALSE = false
export const NULL = null
export const UNDEFINED = void 0

export const RAW_TRUE = 'true'
export const RAW_FALSE = 'false'
export const RAW_NULL = 'null'
export const RAW_UNDEFINED = 'undefined'

export const RAW_KEY = 'key'
export const RAW_REF = 'ref'
export const RAW_SLOT = 'slot'
export const RAW_NAME = 'name'

export const RAW_FILTER = 'filter'
export const RAW_PARTIAL = 'partial'
export const RAW_COMPONENT = 'component'
export const RAW_DIRECTIVE = 'directive'
export const RAW_TRANSITION = 'transition'

export const RAW_THIS = 'this'
export const RAW_FUNCTION = 'function'
export const RAW_TEMPLATE = 'template'
export const RAW_WILDCARD = '*'
export const RAW_DOT = '.'
export const RAW_SLASH = '/'
export const RAW_DOLLAR = '$'

export const KEYPATH_ROOT= '~'
export const KEYPATH_PARENT = '..'
export const KEYPATH_CURRENT = RAW_THIS

/**
 * Single instance for window in browser
 */
export const WINDOW = typeof window !== RAW_UNDEFINED ? window : UNDEFINED

/**
 * Single instance for document in browser
 */
export const DOCUMENT = typeof document !== RAW_UNDEFINED ? document : UNDEFINED

/**
 * Single instance for global in nodejs or browser
 */
export const GLOBAL = typeof global !== RAW_UNDEFINED ? global : WINDOW

/**
 * tap 事件
 *
 * 非常有用的抽象事件，比如 pc 端是 click 事件，移动端是 touchend 事件
 *
 * 这样只需 on-tap="handler" 就可以完美兼容各端
 *
 * 框架未实现此事件，通过 Yox.dom.addSpecialEvent 提供给外部扩展
 *
 */
export const EVENT_TAP = 'tap'

/**
 * 点击事件
 */
export const EVENT_CLICK = 'click'

/**
 * 输入事件
 */
export const EVENT_INPUT = 'input'

/**
 * 变化事件
 */
export const EVENT_CHANGE = 'change'

/**
 * 唯一内置的特殊事件：model
 */
export const EVENT_MODEL = 'model'

/**
 * Single instance for noop function
 */
export const EMPTY_FUNCTION = function () {
  /** yox */
}

/**
 * 空对象，很多地方会用到，比如 `a || EMPTY_OBJECT` 确保是个对象
 */
export const EMPTY_OBJECT = Object.freeze({})

/**
 * 空数组
 */
export const EMPTY_ARRAY = Object.freeze([])

/**
 * 空字符串
 */
export const EMPTY_STRING = ''

/**
 * 日志等级
 */
export const LOG_LEVEL_DEBUG = 1
export const LOG_LEVEL_INFO = 2
export const LOG_LEVEL_WARN = 3
export const LOG_LEVEL_ERROR = 4
export const LOG_LEVEL_FATAL = 5

/**
 * 当前是否是源码调试，如果开启了代码压缩，empty function 里的注释会被干掉
 * 源码模式默认选 INFO，因为 DEBUG 输出的日志太多，会导致性能急剧下降
 */
export const LOG_LEVEL_DEFAULT = /yox/.test(EMPTY_FUNCTION.toString()) ? LOG_LEVEL_INFO : LOG_LEVEL_WARN

/**
 * 外部可配置的对象
 */
export const PUBLIC_CONFIG: Record<string, any> = {
  leftDelimiter: '{',
  rightDelimiter: '}',
  uglifyCompiled: FALSE,
  minifyCompiled: FALSE,
  logLevel: LOG_LEVEL_DEFAULT,
}