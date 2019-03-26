import * as is from './is'
import * as env from './env'
import * as char from './char'
import * as string from './string'

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


function formatKeypath(keypath: string | number): string | number {
  return is.number(keypath) || is.string(keypath)
    ? keypath
    : char.CHAR_BLANK
}

/**
 * 遍历 keypath 的每个部分
 *
 * @param keypath1
 * @param keypath2
 */
export function join(keypath1: string | number, keypath2: string | number): string | number {

  keypath1 = formatKeypath(keypath1)
  keypath2 = formatKeypath(keypath2)

  return keypath1 === char.CHAR_BLANK
    ? keypath2
    : keypath2 !== char.CHAR_BLANK
      ? keypath1 + env.KEYPATH_SEPARATOR + keypath2
      : keypath1

}
