
import * as is from './is'
import * as env from './env'
import * as char from './char'
import * as array from './array'
import * as object from './object'
import * as string from './string'

const normalizeCache = { }

export function normalize(str) {
  if (!string.falsy(str)) {
    let start = string.indexOf(str, char.CHAR_OBRACK)
    if (start > 0 && string.indexOf(str, char.CHAR_CBRACK) > start) {
      if (!normalizeCache[ str ]) {
        normalizeCache[ str ] = str.replace(
          /\[\s*?([^\]]+)\s*?\]/g,
          function ($0, $1) {
            let code = char.codeAt($1)
            if (code === char.CODE_SQUOTE || code === char.CODE_DQUOTE) {
              $1 = string.slice($1, 1, -1)
            }
            return `${env.KEYPATH_SEPARATOR}${$1}`
          }
        )
      }
      return normalizeCache[ str ]
    }
  }
  return str
}

function filter(term) {
  return term !== char.CHAR_BLANK
    && term !== env.RAW_THIS
}

export function startsWith(keypath, prefix) {
  let temp
  if (keypath === prefix) {
    return prefix[ env.RAW_LENGTH ]
  }
  else if (string.startsWith(keypath, temp = prefix + env.KEYPATH_SEPARATOR)) {
    return temp[ env.RAW_LENGTH ]
  }
  else {
    return env.FALSE
  }
}

export function join(keypath1, keypath2) {
  // keypath 可以是两种形式
  // 1. 非空字符串
  // 2. 数字
  let result = [ ]
  if (!string.falsy(keypath1) || is.number(keypath1)) {
    array.push(result, keypath1)
  }
  if (is.number(keypath2)) {
    array.push(result, keypath2)
  }
  else if (is.string(keypath2) && filter(keypath2)) {
    array.push(result, keypath2)
  }
  return array.join(result, env.KEYPATH_SEPARATOR)
}
