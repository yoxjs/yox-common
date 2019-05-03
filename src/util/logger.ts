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
useSource = /yox/.test(toString(env.EMPTY_FUNCTION))

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

/**
 * 打印普通日志
 *
 * @param msg
 */
export function log(msg: string): void {
  if (nativeConsole && isDebug()) {
    nativeConsole.log(`[Yox log]: ${msg}`)
  }
}

/**
 * 打印警告日志
 *
 * @param msg
 */
export function warn(msg: string): void {
  if (nativeConsole && isDebug()) {
    nativeConsole.warn(`[Yox warn]: ${msg}`)
  }
}

/**
 * 打印错误日志
 *
 * @param msg
 */
export function error(msg: string): void {
  if (nativeConsole) {
    nativeConsole.error(`[Yox error]: ${msg}`)
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
