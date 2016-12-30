
import * as is from './is'
import * as env from './env'

/**
 * 是否有原生的日志特性，没有必要单独实现
 *
 * @param {boolean}
 */
const hasConsole = typeof console !== 'undefined'

const tester = function () { /** yox */ }
const debug = /yox/.test(tester.toString())

// 全局可覆盖
// 比如开发环境，开了 debug 模式，但是有时候觉得看着一堆日志特烦，想强制关掉
// 比如线上环境，关了 debug 模式，为了调试，想强制打开
function isDebug() {
  if (env.win) {
    let { DEBUG } = env.win
    if (is.boolean(DEBUG)) {
      return BEBUG
    }
  }
  return debug
}

/**
 * 打印普通日志
 *
 * @param {string} msg
 */
export function log(msg) {
  if (hasConsole && isDebug()) {
    console.log(`[Yox log]: ${msg}`)
  }
}

/**
 * 打印警告日志
 *
 * @param {string} msg
 */
export function warn(msg) {
  if (hasConsole && isDebug()) {
    console.warn(`[Yox warn]: ${msg}`)
  }
}

/**
 * 打印错误日志
 *
 * @param {string} msg
 */
export function error(msg) {
  if (hasConsole) {
    console.error(`[Yox error]: ${msg}`)
  }
}
