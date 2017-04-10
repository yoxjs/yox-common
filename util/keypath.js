
import * as env from './env'
import * as char from './char'
import * as array from './array'
import * as string from './string'

export const SEPARATOR_KEY = '.'
export const SEPARATOR_PATH = '/'
export const LEVEL_CURRENT = '.'
export const LEVEL_PARENT = '..'

export function normalize(str) {
  if (!string.falsy(str)
    && string.indexOf(str, '[') > 0
    && string.indexOf(str, ']') > 0
  ) {
    return str.replace(
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

export function resolve(base, path) {
  let list = parse(base)
  if (base.length) {
    array.pop(list)
  }
  array.each(
    string.split(path, SEPARATOR_PATH),
    function (term) {
      if (term === LEVEL_PARENT) {
        array.pop(list)
      }
      else {
        array.push(list, parse(term))
      }
    }
  )
  return stringify(list)
}
