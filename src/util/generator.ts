import * as constant from 'yox-type/src/constant'

import isDef from '../function/isDef'

import * as array from './array'

export const UNDEFINED = '$0'

export const TRUE = '$1'

export const FALSE = '$2'

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

  let args: string[] = [], removable = constant.TRUE

  array.each(
    list,
    function (arg) {
      if (isDef(arg)) {
        removable = constant.FALSE
        array.unshift(args, arg as string)
      }
      else if (!removable) {
        array.unshift(args, UNDEFINED)
      }
    },
    constant.TRUE
  )

  return args

}

/**
 * 把 [ 'key1:value1', 'key2:value2' ] 格式转成 `{key1:value1,key2:value2}`
 */
export function toObject(fields: string[]): string {
  return `{${array.join(fields, COMMA)}}`
}

/**
 * 把 [ 'item1', 'item2' ] 格式转成 `['item1','item2']`
 */
export function toArray(items: string[]): string {
  return `[${array.join(items, COMMA)}]`
}

/**
 * 输出函数调用的格式
 */
export function toCall(name: string, args: (string | void)[]): string {
  return `${name}(${array.join(trimArgs(args), COMMA)})`
}

/**
 * 输出为字符串格式
 */
export function toString(value: string | number | boolean | undefined | null): string {
  return value === constant.TRUE
    ? TRUE
    : value === constant.FALSE
      ? FALSE
      // null 和 undefined 都视为 undefined
      : JSON.stringify(
          value == constant.NULL
          ? constant.UNDEFINED
          : value
        )
}

/**
 * 输出为匿名函数格式
 */
export function toFunction(args: string, code: string) {
  return `${constant.RAW_FUNCTION}(${args}){var ${UNDEFINED}=void 0,${TRUE}=!0,${FALSE}=!1;${RETURN}${code}}`
}