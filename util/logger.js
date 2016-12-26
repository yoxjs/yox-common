
/**
 * 是否有原生的日志特性，没有必要单独实现
 *
 * @param {boolean}
 */
const hasConsole = typeof console !== 'undefined'

/**
 * 打印警告日志
 *
 * @param {string} msg
 */
export function warn(msg) {
  if (hasConsole) {
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
