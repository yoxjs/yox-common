
import * as env from './env'
import * as char from './char'
import * as array from './array'
import * as object from './object'
import * as string from './string'

export const SEPARATOR_KEY = '.'
export const SEPARATOR_PATH = '/'
export const LEVEL_CURRENT = '.'
export const LEVEL_PARENT = '..'

const normalizeCache = { }

export function normalize(str) {
  if (!string.falsy(str)
    && string.indexOf(str, '[') > 0
    && string.indexOf(str, ']') > 0
  ) {
    if (!object.has(normalizeCache, str)) {
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
  return str
}

function filter(term) {
  return term !== char.CHAR_BLANK
    && term !== env.THIS
    && term !== LEVEL_CURRENT
}

export function parse(str) {
  return string
    .split(normalize(str), SEPARATOR_KEY)
    .filter(filter)
}

export function stringify(keypaths) {
  return keypaths
    .filter(filter)
    .join(SEPARATOR_KEY)
}

export function join(keypath1, keypath2) {
  if (keypath1 && keypath2) {
    return keypath1 + SEPARATOR_KEY + keypath2
  }
  else if (keypath1) {
    return keypath1
  }
  else {
    return keypath2 || char.CHAR_BLANK
  }
}
