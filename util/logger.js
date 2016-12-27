
/**
 * 是否有原生的日志特性，没有必要单独实现
 *
 * @param {boolean}
 */
const hasConsole = typeof console !== 'undefined'

const tester = function () { /** yox */ }
const isDebug = /yox/.test(tester.toString())

/**
 * 打印普通日志
 *
 * @param {string} msg
 */
export function log(msg) {
  if (hasConsole && isDebug) {
    console.log(`[Yox log]: ${msg}`)
  }
}

/**
 * 打印警告日志
 *
 * @param {string} msg
 */
export function warn(msg) {
  if (hasConsole && isDebug) {
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
