import {
  PUBLIC_CONFIG,
} from 'yox-config/src/config'

import * as is from './is'
import * as array from './array'
import * as object from './object'
import * as string from './string'
import * as constant from './constant'


const QUOTE_DOUBLE = '"',

QUOTE_SINGLE = "'",

COMMA = ',',

RETURN = 'return '

export const JOIN_EMPTY = string.repeat(QUOTE_SINGLE, 2)

export const JOIN_DOT = `${QUOTE_SINGLE}.${QUOTE_SINGLE}`


// 下面这些值需要根据外部配置才能确定
let isUglify = constant.UNDEFINED,

isMinify = constant.UNDEFINED,

UNDEFINED = constant.EMPTY_STRING,

NULL = constant.EMPTY_STRING,

TRUE = constant.EMPTY_STRING,

FALSE = constant.EMPTY_STRING,

// 空格
SPACE = constant.EMPTY_STRING,

// 缩进
INDENT = constant.EMPTY_STRING,

// 换行
BREAK_LINE = constant.EMPTY_STRING,

GRAW_UNDEFINED: GRaw,

GRAW_NULL: GRaw,

GRAW_TRUE: GRaw,

GRAW_FALSE: GRaw

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
      ? toStringLiteral(value as string)
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

  unshift(value: GBase) {
    array.unshift(
      this.items,
      value
    )
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
      if (length > 1) {
        str += `.join(${join})`
      }
      else {
        str = result[0]
      }
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

    argList = trimArgs(
      args.map(
        function (item) {
          return item.toString(nextTabSize)
        }
      )
    ),

    argCode = array.join(
      argList,
      COMMA + SPACE + BREAK_LINE + nextIndentSize
    )

    return argList.length > 0
      ? `${name}(${BREAK_LINE}${nextIndentSize}${argCode}${BREAK_LINE}${currentIndentSize})`
      : `${name}()`

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

function toStringLiteral(value: string) {
  // 优先用单引号
  const quote = string.has(value, QUOTE_SINGLE)
    ? QUOTE_DOUBLE
    : QUOTE_SINGLE
  return `${quote}${value}${quote}`
}

function toPair(key: string, value: string) {
  if (!/^[\w$]+$/.test(key)) {
    key = toStringLiteral(key)
  }
  return `${key}:${SPACE}${value}`
}

export function init() {

  if (isUglify !== PUBLIC_CONFIG.uglifyCompiled) {

    isUglify = PUBLIC_CONFIG.uglifyCompiled

    if (isUglify) {
      UNDEFINED = '$1'
      NULL = '$2'
      TRUE = '$3'
      FALSE = '$4'
    }
    else {
      UNDEFINED = '$undefined'
      NULL = '$null'
      TRUE = '$true'
      FALSE = '$false'
    }

    GRAW_UNDEFINED = new GRaw(UNDEFINED)
    GRAW_NULL = new GRaw(NULL)
    GRAW_TRUE = new GRaw(TRUE)
    GRAW_FALSE = new GRaw(FALSE)

  }

  if (isMinify !== PUBLIC_CONFIG.minifyCompiled) {

    isMinify = PUBLIC_CONFIG.minifyCompiled

    if (isMinify) {
      SPACE = INDENT = BREAK_LINE = constant.EMPTY_STRING
    }
    else {
      SPACE = ' '
      INDENT = '  '
      BREAK_LINE = '\n'
    }

  }

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