import * as is from './is'
import * as array from './array'
import * as object from './object'
import * as string from './string'
import * as constant from './constant'

const STRING_QUOTE = `'`,

UNDEFINED = '$0',

NULL = '$1',

TRUE = '$2',

FALSE = '$3',

COMMA = ',',

RETURN = 'return ',

// 空格
SPACE = ' ',

// 缩进
INDENT = '  ',

// 换行
BREAK_LINE = '\n'

export const EMPTY = string.repeat(STRING_QUOTE, 2)

export const DOT = '.'

export interface GBase {
  toString(tabSize?: number): string
}

class GRaw implements GBase {

  private value: string

  constructor(value: string) {
    this.value = value
  }

  toString() {
    return this.value
  }

}

class GPrimitive implements GBase {

  private value: string | number

  constructor(value: string | number) {
    this.value = value
  }

  toString() {
    const { value } = this
    return is.string(value)
      ? `${STRING_QUOTE}${value}${STRING_QUOTE}`
      : `${value}`
  }

}

class GArray implements GBase {

  private items: GBase[]

  join: string | void

  constructor(values?: GBase[], join?: string) {
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
      str += `.join(${join})`
    }

    return str

  }

}

class GObject implements GBase {

  private fields: Record<string, GBase> = {}

  set(name: string, value: GBase) {
    if (value !== GRAW_UNDEFINED) {
      this.fields[name] = value
    }
  }

  has(key: string) {
    return object.has(this.fields, key)
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

class GCall implements GBase {

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

class GUnary implements GBase {

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

class GBinary implements GBase {

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

class GTernary implements GBase {

  private test: GBase
  private yes: GBase
  private no: GBase

  constructor(test: GBase, yes: GBase, no: GBase) {
    this.test = test
    this.yes = yes
    this.no = no
  }

  toString(tabSize?: number) {
    return `${this.test.toString(tabSize)}${SPACE}?${SPACE}${this.yes.toString(tabSize)}${SPACE}:${SPACE}${this.no.toString(tabSize)}`
  }

}

class GAnonymousFunction implements GBase {

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

const GRAW_UNDEFINED = new GRaw(UNDEFINED)
const GRAW_NULL = new GRaw(NULL)
const GRAW_TRUE = new GRaw(TRUE)
const GRAW_FALSE = new GRaw(FALSE)

export function toRaw(value: string) {
  return new GRaw(value)
}

export function toPrimitive(value: any) {
  return value === constant.TRUE
    ? GRAW_TRUE
    : value === constant.FALSE
      ? GRAW_FALSE
      : value === constant.NULL
        ? GRAW_NULL
        : value === constant.UNDEFINED
          ? GRAW_UNDEFINED
          : new GPrimitive(value)
}

export function toArray(values?: GBase[], join?: string) {
  return new GArray(values, join)
}

export function toObject() {
  return new GObject()
}

export function toCall(name: string, args?: GBase[]) {
  return new GCall(name, args)
}

export function toUnary(operator: string, value: GBase) {
  return new GUnary(operator, value)
}

export function toBinary(left: GBase, operator: string, right: GBase) {
  return new GBinary(left, operator, right)
}

export function toTernary(test: GBase, yes: GBase, no: GBase) {
  return new GTernary(test, yes, no)
}

export function toAnonymousFunction(returnValue: GBase, args?: GBase[]) {
  return new GAnonymousFunction(returnValue, args)
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
    key = `${STRING_QUOTE}${key}${STRING_QUOTE}`
  }
  return `${key}:${SPACE}${value}`
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