
import * as env from './env'
import * as char from './char'
import * as array from './array'
import * as string from './string'

export const SEPARATOR_KEY = char.CHAR_DOT
export const SEPARATOR_PATH = char.CHAR_SLASH
export const LEVEL_CURRENT = char.CHAR_DOT
export const LEVEL_PARENT = `${char.CHAR_DOT}${char.CHAR_DOT}`

export function normalize(str) {
  if (!string.falsy(str)
    && string.indexOf(str, char.CHAR_OBRACK) > 0
    && string.indexOf(str, char.CHAR_CBRACK) > 0
  ) {
    // array[0] => array.0
    // object['key'] => array.key
    return str.replace(
      /\[\s*?([\S]+)\s*?\]/g,
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

export function parse(str) {
  return string.falsy(str)
    ? [ ]
    : normalize(str).split(SEPARATOR_KEY)
}

export function stringify(keypaths) {
  return keypaths
  .filter(
    function (term) {
      return term !== char.CHAR_BLANK && term !== LEVEL_CURRENT
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
