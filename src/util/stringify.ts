import isDef from '../function/isDef'
import toJSON from '../function/toJSON'

import * as env from './env'
import * as array from './array'

const SEP_COMMA = ','

export const TRUE = '!0'

export const FALSE = '!1'

export const EMPTY = toJSON(env.EMPTY_STRING)

/**
 * 目的是 保证调用参数顺序稳定，减少运行时判断
 */
function trimArgs(list: (string | void)[]) {

  let args: string[] = [], removable = env.TRUE

  array.each(
    list,
    function (arg: string | void) {
      if (isDef(arg)) {
        removable = env.FALSE
        array.unshift(args, arg as string)
      }
      else if (!removable) {
        array.unshift(args, FALSE)
      }
    },
    env.TRUE
  )

  return args

}

export function toObject(fields: string[]): string {
  return `{${array.join(fields, SEP_COMMA)}}`
}

export function toArray(items: string[]): string {
  return `[${array.join(items, SEP_COMMA)}]`
}

export function toCall(name: string, args: (string | void)[]): string {
  return `${name}(${array.join(trimArgs(args), SEP_COMMA)})`
}

