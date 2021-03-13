import * as array from './array'
import * as object from './object'
import * as string from './string'
import * as constant from './constant'

export const UNDEFINED = '$0'

export const NULL = '$1'

export const TRUE = '$2'

export const FALSE = '$3'

export const COMMA = ','

export const COLON = ':'

export const PLUS = '+'

export const AND = '&&'

export const QUESTION = '?'

export const NOT = '!'

export const EMPTY = '""'

export const RETURN = 'return '

// 空格
export const SPACE = ' '

// 缩进
export const INDENT = '  '

// 换行
export const BREAK_LINE = '\n'

export interface GBase {
  toString(tabSize?: number): string
}

export class GRaw implements GBase {

  private value: string

  constructor(value: string) {
    this.value = value
  }

  toString() {
    return this.value
  }

}

export const GRAW_UNDEFINED = new GRaw(UNDEFINED)
export const GRAW_TRUE = new GRaw(TRUE)

export class GPrimitive implements GBase {

  private value: any

  constructor(value: any) {
    this.value = value
  }

  toString() {
    return toString(this.value)
  }

}

export class GArray implements GBase {

  private items: GBase[]

  join: boolean | void

  constructor(values?: GBase[], join?: boolean) {
    this.items = values || []
    this.join = join
  }

  push(value: GBase) {
    array.push(
      this.items,
      value
    )
  }

  toString(tabSize?: number) {

    const { items, join } = this, { length } = items

    if (!length) {
      return `[${SPACE}]`
    }

    if (!tabSize) {
      tabSize = 0
    }

    const currentIndentSize = string.repeat(INDENT, tabSize),

    nextIndentSize = string.repeat(INDENT, tabSize + 1),

    result = items.map(
      function (item) {
        return item.toString(tabSize as number + 1)
      }
    )

    let str = `[${BREAK_LINE}${nextIndentSize}${array.join(result, COMMA + BREAK_LINE + nextIndentSize)}${BREAK_LINE}${currentIndentSize}]`
    if (join) {
      str += `.join(${EMPTY})`
    }

    return str

  }

}

export class GObject implements GBase {

  private fields: Record<string, GBase> = {}

  set(name: string, value: GBase) {
    if (value !== GRAW_UNDEFINED) {
      this.fields[name] = value
    }
  }

  isNotEmpty() {
    return object.keys(this.fields).length > 0
  }

  toString(tabSize?: number) {

    const { fields } = this,
    currentTabSize = tabSize || 0,
    nextTabSize = currentTabSize + 1,
    currentIndentSize = string.repeat(INDENT, currentTabSize),
    nextIndentSize = string.repeat(INDENT, nextTabSize),
    result: string[] = []

    object.each(
      fields,
      function (value, key) {
        array.push(
          result,
          toPair(key, value.toString(nextTabSize))
        )
      }
    )

    if (!result.length) {
      return `{${SPACE}}`
    }

    return `{${BREAK_LINE}${nextIndentSize}${array.join(result, COMMA + BREAK_LINE + nextIndentSize)}${BREAK_LINE}${currentIndentSize}}`

  }

}

export class GCall implements GBase {

  private name: string
  private args: GBase[]

  constructor(name: string, args?: GBase[]) {
    this.name = name
    this.args = args || []
  }

  toString(tabSize?: number) {

    const { name, args } = this,
    currentTabSize = tabSize || 0,
    nextTabSize = currentTabSize + 1,
    currentIndentSize = string.repeat(INDENT, currentTabSize),
    nextIndentSize = string.repeat(INDENT, nextTabSize),

    result = trimArgs(
      args.map(
        function (item) {
          return item.toString(nextTabSize)
        }
      )
    )

    return `${name}(${BREAK_LINE}${nextIndentSize}${array.join(result, COMMA + SPACE + BREAK_LINE + nextIndentSize)}${BREAK_LINE}${currentIndentSize})`

  }

}

export class GUnary implements GBase {

  private operator: string
  private value: GBase

  constructor(operator: string, value: GBase) {
    this.operator = operator
    this.value = value
  }

  toString(tabSize?: number) {
    return `${this.operator}${this.value.toString(tabSize)}`
  }

}

export class GBinary implements GBase {

  private left: GBase
  private operator: string
  private right: GBase

  leftGroup: boolean | void
  rightGroup: boolean | void

  constructor(left: GBase, operator: string, right: GBase) {
    this.left = left
    this.operator = operator
    this.right = right
  }

  toString(tabSize?: number) {
    let left = this.left.toString(tabSize), right = this.right.toString(tabSize)
    if (this.leftGroup) {
      left = `(${left})`
    }
    if (this.rightGroup) {
      right = `(${right})`
    }
    return `${left}${SPACE}${this.operator}${SPACE}${right}`
  }

}

export class GTernary implements GBase {

  private test: GBase
  private yes: GBase
  private no: GBase

  constructor(test: GBase, yes: GBase, no: GBase) {
    this.test = test
    this.yes = yes
    this.no = no
  }

  toString(tabSize?: number) {
    return `${this.test.toString(tabSize)}${SPACE}${QUESTION}${SPACE}${this.yes.toString(tabSize)}${SPACE}${COLON}${SPACE}${this.no.toString(tabSize)}`
  }

}

export class GAnonymousFunction implements GBase {

  private returnValue: GBase
  private args: GBase[]

  constructor(returnValue: GBase, args?: GBase[]) {
    this.returnValue = returnValue
    this.args = args || []
  }

  toString(tabSize?: number) {

    const { returnValue, args } = this,
    currentTabSize = tabSize || 0,
    nextTabSize = currentTabSize + 1,
    currentIndentSize = string.repeat(INDENT, currentTabSize),
    nextIndentSize = string.repeat(INDENT, nextTabSize),

    result = args.map(
      function (item) {
        return item.toString(currentTabSize)
      }
    )

    return `${constant.RAW_FUNCTION}${SPACE}(${result.join(`${COMMA}${SPACE}`)})${SPACE}{${BREAK_LINE}${nextIndentSize}${RETURN}${returnValue.toString(nextTabSize)}${BREAK_LINE}${currentIndentSize}}`
  }

}

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
      if (arg !== UNDEFINED) {
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

function toPair(key: string, value: string) {
  if (!/^[\w$]+$/.test(key)) {
    key = `"${key}"`
  }
  return `${key}${COLON}${SPACE}${value}`
}

/**
 * 输出为字符串格式
 */
function toString(value: string | number | boolean | null | void): string {
  return value === constant.TRUE
    ? TRUE
    : value === constant.FALSE
      ? FALSE
      : value === constant.NULL
        ? NULL
        : value === constant.UNDEFINED
          ? UNDEFINED
          : JSON.stringify(value)
}

export function generate(code: GBase, args: string[]) {

  const currentTabSize = 0,
  nextTabSize = currentTabSize + 1,
  currentIndentSize = string.repeat(INDENT, currentTabSize),
  nextIndentSize = string.repeat(INDENT, nextTabSize)

  return `${currentIndentSize}${constant.RAW_FUNCTION}${SPACE}(${args.join(`${COMMA}${SPACE}`)})${SPACE}{`
       + `${BREAK_LINE}${nextIndentSize}var ${UNDEFINED}${SPACE}=${SPACE}void 0,${SPACE}${NULL}${SPACE}=${SPACE}null,${SPACE}${TRUE}${SPACE}=${SPACE}!0,${SPACE}${FALSE}${SPACE}=${SPACE}!1;`
       + `${BREAK_LINE}${nextIndentSize}${RETURN}${code.toString(nextTabSize)}`
       + `${BREAK_LINE}${currentIndentSize}}`
}