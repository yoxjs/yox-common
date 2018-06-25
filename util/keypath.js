
import * as is from './is'
import * as env from './env'
import * as char from './char'
import * as array from './array'
import * as string from './string'

export function startsWith(keypath, prefix) {
  if (keypath === prefix) {
    return prefix[ env.RAW_LENGTH ]
  }
  let temp
  if (string.startsWith(keypath, temp = prefix + env.KEYPATH_SEPARATOR)) {
    return temp[ env.RAW_LENGTH ]
  }
  return env.FALSE
}

export function each(keypath, callback) {
  if (string.falsy(keypath)) {
    callback(keypath, env.TRUE)
  }
  else {
    let startIndex = 0, endIndex = 0
    while (env.TRUE) {
      endIndex = string.indexOf(keypath, env.KEYPATH_SEPARATOR, startIndex)
      if (endIndex > 0) {
        callback(string.slice(keypath, startIndex, endIndex))
        startIndex = endIndex + 1
      }
      else {
        callback(string.slice(keypath, startIndex), env.TRUE)
        break
      }
    }
  }
}

export function join(keypath1, keypath2) {

  let keypath = is.number(keypath1) || is.string(keypath1)
    ? keypath1
    : char.CHAR_BLANK,
  isNumber,
  isString

  if ((isNumber = is.number(keypath2)) || (isString = is.string(keypath2))) {
    if (keypath === char.CHAR_BLANK) {
      return keypath2
    }
    if (isNumber || keypath2 !== char.CHAR_BLANK) {
      return keypath + env.KEYPATH_SEPARATOR + keypath2
    }
  }

  return keypath

}
