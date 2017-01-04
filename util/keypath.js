
import * as env from './env'
import * as array from './array'

export const SEPARATOR_KEY = '.'
export const SEPARATOR_PATH = '/'
export const LEVEL_CURRENT = '.'
export const LEVEL_PARENT = '..'

export function normalize(str) {
  if (str && str.indexOf('[') > 0 && str.indexOf(']') > 0) {
    // array[0] => array.0
    // object['key'] => array.key
    return str.replace(
      /\[\s*?([\S]+)\s*?\]/g,
      function ($0, $1) {
        let firstChar = $1.charAt[0]
        if (firstChar === '"' || firstChar === "'") {
          $1 = $1.slice(1, -1)
        }
        return `.${$1}`
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
      return term !== env.EMPTY && term !== LEVEL_CURRENT
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
