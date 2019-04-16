import * as is from './is'
import * as env from './env'
import * as string from './string'
import toString from '../function/toString'

/**
 * 判断 keypath 是否以 prefix 开头，如果是，返回匹配上的前缀长度，否则返回 -1
 *
 * @param keypath
 * @param prefix
 * @return
 */
export function match(keypath: string, prefix: string): number {
  if (keypath === prefix) {
    return prefix[env.RAW_LENGTH]
  }
  prefix += env.KEYPATH_SEPARATOR
  return string.startsWith(keypath, prefix)
    ? prefix[env.RAW_LENGTH]
    : -1
}

/**
 * 遍历 keypath 的每个部分
 *
 * @param keypath
 * @param callback 返回 false 可中断遍历
 */
export function each(keypath: any, callback: (key: string | number, isLast: boolean) => boolean | void) {
  if (string.falsy(keypath)) {
    callback(
      keypath,
      env.TRUE
    )
  }
  else {
    let startIndex = 0, endIndex = 0
    while (env.TRUE) {
      endIndex = string.indexOf(keypath, env.KEYPATH_SEPARATOR, startIndex)
      if (endIndex > 0) {
        if (
          callback(
            string.slice(keypath, startIndex, endIndex),
            env.FALSE
          ) === env.FALSE
        ) {
          break
        }
        startIndex = endIndex + 1
      }
      else {
        callback(
          string.slice(keypath, startIndex),
          env.TRUE
        )
        break
      }
    }
  }
}


function formatKeypath(keypath: any): string {
  return is.string(keypath)
    ? keypath
    : is.number(keypath)
      ? toString(keypath)
      : env.EMPTY_STRING
}

/**
 * 遍历 keypath 的每个部分
 *
 * @param keypath1
 * @param keypath2
 */
export function join(keypath1: any, keypath2: any): string {

  keypath1 = formatKeypath(keypath1)
  keypath2 = formatKeypath(keypath2)

  return keypath1 === env.EMPTY_STRING
    ? keypath2
    : keypath2 !== env.EMPTY_STRING
      ? keypath1 + env.KEYPATH_SEPARATOR + keypath2
      : keypath1

}

/**
 * 是否模糊匹配
 *
 * @param keypath
 */
export function isFuzzy(keypath: string): boolean {
  return string.has(keypath, '*')
}

const patternCache = {}

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