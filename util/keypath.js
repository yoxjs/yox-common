
import * as env from './env'
import * as array from './array'
import * as string from './string'

export const SEPARATOR_KEY = string.CHAR_DOT
export const SEPARATOR_PATH = string.CHAR_SLASH
export const LEVEL_CURRENT = string.CHAR_DOT
export const LEVEL_PARENT = `${string.CHAR_DOT}${string.CHAR_DOT}`

export function normalize(str) {
  if (!string.falsy(str)
    && str.indexOf(string.CHAR_OBRACK) > 0
    && str.indexOf(string.CHAR_CBRACK) > 0
  ) {
    // array[0] => array.0
    // object['key'] => array.key
    return str.replace(
      /\[\s*?([\S]+)\s*?\]/g,
      function ($0, $1) {
        let firstChar = $1.charAt[0]
        if (firstChar === string.CHAR_DQUOTE || firstChar === string.CHAR_SQUOTE) {
          $1 = $1.slice(1, -1)
        }
        return `${SEPARATOR_KEY}${$1}`
      }
    )
  }
  return str
}

export function parse(str) {
  return str
    ? normalize(str).split(SEPARATOR_KEY)
    : [ ]
}

export function stringify(keypaths) {
  return keypaths
  .filter(
    function (term) {
      return term !== string.CHAR_BLANK && term !== LEVEL_CURRENT
    }
  )
  .join(SEPARATOR_KEY)
}

export function resolve(base, path) {
  let list = parse(base)
  array.each(
    path.split(SEPARATOR_PATH),
    function (term) {
      if (term === LEVEL_PARENT) {
        list.pop()
      }
      else {
        array.push(
          list,
          normalize(term)
        )
      }
    }
  )
  return stringify(list)
}
