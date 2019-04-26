import * as is from './is'
import * as env from './env'
import * as string from './string'

const SEPARATOR = '.', splitCache = {}, patternCache = {}

/**
 * 判断 keypath 是否以 prefix 开头，如果是，返回匹配上的前缀长度，否则返回 -1
 *
 * @param keypath
 * @param prefix
 * @return
 */
export function match(keypath: string, prefix: string): number {
  if (keypath === prefix) {
    return prefix.length
  }
  prefix += SEPARATOR
  return string.startsWith(keypath, prefix)
    ? prefix.length
    : -1
}

/**
 * 遍历 keypath 的每个部分
 *
 * @param keypath
 * @param callback 返回 false 可中断遍历
 */
export function each(keypath: string, callback: (key: string | number, isLast: boolean) => boolean | void) {
  // 判断字符串是因为 keypath 有可能是 toString
  // 而 splitCache.toString 是个函数
  const list = is.string(splitCache[keypath])
    ? splitCache[keypath]
    : (splitCache[keypath] = keypath.split(SEPARATOR))

  for (let i = 0, lastIndex = list.length - 1; i <= lastIndex; i++) {
    if (callback(list[i], i === lastIndex) === env.FALSE) {
      break
    }
  }
}

/**
 * 遍历 keypath 的每个部分
 *
 * @param keypath1
 * @param keypath2
 */
export function join(keypath1: string, keypath2: string): string {
  return keypath1 && keypath2
    ? keypath1 + SEPARATOR + keypath2
    : keypath1 || keypath2
}

/**
 * 是否模糊匹配
 *
 * @param keypath
 */
export function isFuzzy(keypath: string): boolean {
  return string.has(keypath, '*')
}

/**
 * 模糊匹配 keypath
 *
 * @param keypath
 * @param pattern
 */
export function matchFuzzy(keypath: string, pattern: string): string | void {
  let cache = patternCache[pattern]
  if (!cache) {
    cache = pattern
      .replace(/\./g, '\\.')
      .replace(/\*\*/g, '([\.\\w]+?)')
      .replace(/\*/g, '(\\w+)')
    cache = patternCache[pattern] = new RegExp(`^${cache}$`)
  }
  const result = keypath.match(cache)
  if (result) {
    return result[1]
  }
}