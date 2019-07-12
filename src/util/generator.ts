import isDef from '../function/isDef'

import * as env from './env'
import * as array from './array'

export const UNDEFINED = '$'

export const TRUE = '!0'

export const FALSE = '!1'

export const COMMA = ','

export const COLON = ':'

export const PLUS = '+'

export const AND = '&&'

export const QUESTION = '?'

export const NOT = '!'

export const EMPTY = '""'

export const RETURN = 'return '

/**
 * 目的是 保证调用参数顺序稳定，减少运行时判断
 *
 * [a, undefined, undefined] => [a]
 * [a, undefined, b, undefined] => [a, undefined, b]
 */
function trimArgs(list: (string | void)[]) {

  let args: string[] = [], removable = env.TRUE

  array.each(
    list,
    function (arg) {
      if (isDef(arg)) {
        removable = env.FALSE
        array.unshift(args, arg as string)
      }
      else if (!removable) {
        array.unshift(args, UNDEFINED)
      }
    },
    env.TRUE
  )

  return args

}

export function toObject(fields: string[]): string {
  return `{${array.join(fields, COMMA)}}`
}

export function toArray(items: string[]): string {
  return `[${array.join(items, COMMA)}]`
}

export function toCall(name: string, args: (string | void)[]): string {
  return `${name}(${array.join(trimArgs(args), COMMA)})`
}

export function toString(value: any): string {
  return JSON.stringify(value)
}

export function toFunction(args: string, code: string) {
  return `${env.RAW_FUNCTION}(${args}){var ${UNDEFINED}=void 0;${RETURN}${code}}`
}