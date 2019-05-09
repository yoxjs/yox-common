import * as is from './is'
import * as env from './env'
import toString from '../function/toString'

/**
 * 是否有原生的日志特性，没有必要单独实现
 */
const nativeConsole: Console | null = typeof console !== env.RAW_UNDEFINED ? console : env.NULL,

/**
 * 当前是否是源码调试，如果开启了代码压缩，empty function 里的注释会被干掉
 */
useSource = /yox/.test(toString(env.EMPTY_FUNCTION)),

/**
 * console 样式前缀
 */
stylePrefix = '%c'

/**
 * 全局调试开关
 *
 * 比如开发环境，开了 debug 模式，但是有时候觉得看着一堆日志特烦，想强制关掉
 * 比如线上环境，关了 debug 模式，为了调试，想强制打开
 */
function isDebug() {
  if (env.WINDOW) {
    let debug = env.WINDOW['DEBUG']
    if (is.boolean(debug)) {
      return debug
    }
  }
  return useSource
}

function getStyle(backgroundColor: string) {
  return `background-color:${backgroundColor};color:#fff;padding:4px 8px;border-radius:20px;`
}

/**
 * 打印 debug 日志
 *
 * @param msg
 */
export function debug(msg: string, tag?: string): void {
  if (nativeConsole && isDebug()) {
    nativeConsole.log(stylePrefix + (tag || 'Yox debug'), getStyle('#888'), msg)
  }
}

/**
 * 打印 info 日志
 *
 * @param msg
 */
export function info(msg: string, tag?: string): void {
  if (nativeConsole && isDebug()) {
    nativeConsole.log(stylePrefix + (tag || 'Yox info'), getStyle('#2db7f5'), msg)
  }
}

/**
 * 打印 success 日志
 *
 * @param msg
 */
export function success(msg: string, tag?: string): void {
  if (nativeConsole && isDebug()) {
    nativeConsole.log(stylePrefix + (tag || 'Yox success'), getStyle('#19be6b'), msg)
  }
}

/**
 * 打印 warn 日志
 *
 * @param msg
 */
export function warn(msg: string, tag?: string): void {
  if (nativeConsole && isDebug()) {
    nativeConsole.warn(stylePrefix + (tag || 'Yox warn'), getStyle('#f90'), msg)
  }
}

/**
 * 打印 error 日志
 *
 * @param msg
 */
export function error(msg: string, tag?: string): void {
  if (nativeConsole) {
    nativeConsole.error(stylePrefix + (tag || 'Yox error'), getStyle('#ed4014'), msg)
  }
}

/**
 * 致命错误，中断程序
 *
 * @param msg
 */
export function fatal(msg: string): never {
  throw new Error(`[Yox fatal]: ${msg}`)
}
