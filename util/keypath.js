
import * as is from './is'
import * as env from './env'
import * as char from './char'
import * as array from './array'
import * as object from './object'
import * as string from './string'

const SEPARATOR_KEY = '.'

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
            return `${SEPARATOR_KEY}${$1}`
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

export function parse(str, filterable = env.TRUE) {
  let result = normalize(str).split(SEPARATOR_KEY)
  return filterable ? result.filter(filter) : result
}

export function stringify(keypaths, filterable = env.TRUE) {
  if (filterable) {
    keypaths = keypaths.filter(filter)
  }
  return keypaths.join(SEPARATOR_KEY)
}

export function startsWith(keypath, prefix) {
  let temp
  if (keypath === prefix) {
    return prefix.length
  }
  else if (string.startsWith(keypath, temp = prefix + SEPARATOR_KEY)) {
    return temp.length
  }
  else {
    return env.FALSE
  }
}

export function has(keypath, part) {
  return keypath === part
    || string.has(keypath, SEPARATOR_KEY + part)
    || string.has(keypath, part + SEPARATOR_KEY)
}

export function join(keypath1, keypath2) {
  // keypath 可以是两种形式
  // 1. 非空字符串
  // 2. 数字
  let result = [ ]
  if (!string.falsy(keypath1) || is.number(keypath1)) {
    array.push(result, keypath1)
  }
  if (!string.falsy(keypath2) || is.number(keypath2)) {
    array.push(result, keypath2)
  }
  return stringify(result, env.FALSE)
}
