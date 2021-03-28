import * as constant from './constant'

/**
 * 外部可用这些常量
 */
export const DEBUG = constant.LOG_LEVEL_DEBUG
export const INFO = constant.LOG_LEVEL_INFO
export const WARN = constant.LOG_LEVEL_WARN
export const ERROR = constant.LOG_LEVEL_ERROR
export const FATAL = constant.LOG_LEVEL_FATAL

/**
 * 是否有原生的日志特性，没有必要单独实现
 */
const nativeConsole: Console | null = typeof console !== constant.RAW_UNDEFINED ? console : constant.NULL,

/**
 * console 样式前缀
 * ie 和 edge 不支持 console.log 样式
 */
stylePrefix = constant.WINDOW && /edge|msie|trident/i.test(constant.WINDOW.navigator.userAgent)
  ? constant.EMPTY_STRING
  : '%c',

/**
 * 日志打印函数
 */
printLog = nativeConsole
  ? stylePrefix
    ? function (tag: string, msg: string, style: string) {
      nativeConsole.log(stylePrefix + tag, style, msg)
    }
    : function (tag: string, msg: string) {
      nativeConsole.log(tag, msg)
    }
  : constant.EMPTY_FUNCTION

/**
 * 全局调试开关
 */
function getLogLevel() {
  const { logLevel } = constant.PUBLIC_CONFIG
  if (logLevel >= DEBUG && logLevel <= FATAL) {
    return logLevel as number
  }
  return constant.LOG_LEVEL_DEFAULT
}

function getStyle(backgroundColor: string) {
  return `background-color:${backgroundColor};border-radius:12px;color:#fff;font-size:10px;padding:3px 6px;`
}

/**
 * 打印 debug 日志
 *
 * @param msg
 */
export function debug(msg: string, tag?: string): void {
  if (getLogLevel() <= DEBUG) {
    printLog(tag || 'Yox debug', msg, getStyle('#999'))
  }
}

/**
 * 打印 info 日志
 *
 * @param msg
 */
export function info(msg: string, tag?: string): void {
  if (getLogLevel() <= INFO) {
    printLog(tag || 'Yox info', msg, getStyle('#2db7f5'))
  }
}

/**
 * 打印 warn 日志
 *
 * @param msg
 */
export function warn(msg: string, tag?: string): void {
  if (getLogLevel() <= WARN) {
    printLog(tag || 'Yox warn', msg, getStyle('#f90'))
  }
}

/**
 * 打印 error 日志
 *
 * @param msg
 */
export function error(msg: string, tag?: string): void {
  if (getLogLevel() <= ERROR) {
    printLog(tag || 'Yox error', msg, getStyle('#ed4014'))
  }
}

/**
 * 致命错误，中断程序
 *
 * @param msg
 */
export function fatal(msg: string, tag?: string): void {
  if (getLogLevel() <= FATAL) {
    throw new Error(`[${tag || 'Yox fatal'}]: ${msg}`)
  }
}
