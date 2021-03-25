import * as cache from './cache'
import * as string from './string'
import * as constant from './constant'

const dotPattern = /\./g,

asteriskPattern = /\*/g,

doubleAsteriskPattern = /\*\*/g

/**
 * 判断 keypath 是否以 prefix 开头，如果是，返回匹配上的前缀长度，否则返回 -1
 *
 * @param keypath
 * @param prefix
 * @return
 */
export const match = cache.createTwoKeyCache(
  function (keypath: string, prefix: string): number {
    if (keypath === prefix) {
      return prefix.length
    }
    prefix += constant.RAW_DOT
    return string.startsWith(keypath, prefix)
      ? prefix.length
      : -1
  }
)

const getKeypathTokens = cache.createOneKeyCache(
  function (keypath: string): string[] {
    return string.indexOf(keypath, constant.RAW_DOT) < 0
      ? [keypath]
      : keypath.split(constant.RAW_DOT)
  }
)

/**
 * 遍历 keypath 的每个部分
 *
 * @param keypath
 * @param callback 返回 false 可中断遍历
 */
export function each(keypath: string, callback: (key: string, index: number, lastIndex: number) => boolean | void) {
  const tokens: string[] = getKeypathTokens(keypath)
  for (let i = 0, lastIndex = tokens.length - 1; i <= lastIndex; i++) {
    if (callback(tokens[i], i, lastIndex) === constant.FALSE) {
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
export const join = cache.createTwoKeyCache(
  function (keypath1: string, keypath2: string): string {
    return keypath1 && keypath2
      ? keypath1 + constant.RAW_DOT + keypath2
      : keypath1 || keypath2
  }
)

/**
 * 是否模糊匹配
 *
 * @param keypath
 */
export const isFuzzy = cache.createOneKeyCache(
  function (keypath: string): boolean {
    return string.has(keypath, constant.RAW_WILDCARD)
  }
)

const getFuzzyPattern = cache.createOneKeyCache(
  function (pattern: string): RegExp {
    return new RegExp(`^${
      pattern
      .replace(dotPattern, '\\.')
      .replace(asteriskPattern, '(\\w+)')
      .replace(doubleAsteriskPattern, '([\.\\w]+?)')
    }$`)
  }
)

/**
 * 模糊匹配 keypath
 *
 * @param keypath
 * @param pattern
 */
export const matchFuzzy = cache.createTwoKeyCache(
  function (keypath: string, pattern: string): string | void {
    const result = keypath.match(
      getFuzzyPattern(pattern)
    )
    return result
      ? result[1]
      : constant.UNDEFINED
  }
)