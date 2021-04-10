import * as is from './is'
import * as array from './array'
import * as object from './object'
import * as string from './string'
import * as constant from './constant'

import toNumber from '../function/toNumber'


const QUOTE_DOUBLE = '"',

QUOTE_SINGLE = "'",

COMMA = ',',

OPAREN = '(',

CPAREN = ')'


// 下面这些值需要根据外部配置才能确定
let isUglify = constant.UNDEFINED,

isMinify = constant.UNDEFINED,

UNDEFINED = constant.EMPTY_STRING,

NULL = constant.EMPTY_STRING,

TRUE = constant.EMPTY_STRING,

FALSE = constant.EMPTY_STRING,

SPACE = constant.EMPTY_STRING,

INDENT = constant.EMPTY_STRING,

BREAK_LINE = constant.EMPTY_STRING

export interface Base {
  toString(tabSize?: number): string
}

export class Raw implements Base {

  private value: string

  constructor(value: string) {
    this.value = value
  }

  toString() {
    return this.value
  }

}

export class Primitive implements Base {

  value: string | number | boolean | null | undefined

  constructor(value: string | number) {
    this.value = value
  }

  toString() {
    const { value } = this
    return value === constant.TRUE
      ? TRUE
      : value === constant.FALSE
        ? FALSE
        : value === constant.NULL
          ? NULL
          : value === constant.UNDEFINED
            ? UNDEFINED
            : is.string(value)
              ? toStringLiteral(value as string)
              : `${value}`
  }

}

export class Tuple implements Base {

  private left: string
  private right: string
  private separator: string
  private breakLine: boolean
  private items: Base[]

  constructor(left: string, right: string, separator: string, breakLine: boolean, items?: Base[]) {
    this.left = left
    this.right = right
    this.separator = separator
    this.breakLine = breakLine
    this.items = items || []
  }

  unshift(value: Base) {
    array.unshift(
      this.items,
      value
    )
  }

  push(value: Base) {
    array.push(
      this.items,
      value
    )
  }

  toString(tabSize?: number) {

    let { left, right, separator, breakLine, items } = this, { length } = items

    if (!length) {
      return `${left}${right}`
    }

    const currentTabSize = tabSize || 0,
    nextTabSize = left ? currentTabSize + 1 : currentTabSize,
    currentIndentSize = string.repeat(INDENT, currentTabSize),
    nextIndentSize = string.repeat(INDENT, nextTabSize),

    result = items.map(
      function (item) {
        return item.toString(nextTabSize)
      }
    )

    if (left && breakLine) {
      left += BREAK_LINE + nextIndentSize
    }
    if (right && breakLine) {
      right = BREAK_LINE + currentIndentSize + right
    }

    return `${left}${
      array.join(
        result,
        breakLine
          ? separator + BREAK_LINE + nextIndentSize
          : separator + SPACE
      )
    }${right}`

  }

}

export class Map implements Base {

  private fields: Record<string, Base> = { }

  constructor(fields?: Record<string, Base>) {
    if (fields) {
      const instance = this
      object.each(
        fields,
        function (value, key) {
          instance.set(key, value)
        }
      )
    }
  }

  set(name: string, value: Base) {
    if (value instanceof Primitive
      && (value as Primitive).value === constant.UNDEFINED
    ) {
      return
    }
    this.fields[name] = value
  }

  isNotEmpty() {
    return object.keys(this.fields).length > 0
  }

  toString(tabSize?: number) {

    const items: Base[] = [ ]

    object.each(
      this.fields,
      function (value, key) {
        array.push(
          items,
          {
            toString(tabSize) {
              return toObjectPair(key, value.toString(tabSize))
            }
          }
        )
      }
    )

    return toTuple('{', '}', COMMA, constant.TRUE, items).toString(tabSize)

  }

}

export class Call implements Base {

  private name: string
  private args?: Base[]

  constructor(name: string, args?: Base[]) {
    this.name = name
    this.args = args
  }

  toString(tabSize?: number) {

    const { name, args } = this,

    tuple = args
      ? toTuple(OPAREN, CPAREN, COMMA, constant.TRUE, trimArgs(args)).toString(tabSize)
      : `${OPAREN}${CPAREN}`

    return `${name}${tuple}`

  }

}

export class Unary implements Base {

  private operator: string
  private value: Base

  constructor(operator: string, value: Base) {
    this.operator = operator
    this.value = value
  }

  toString(tabSize?: number) {
    return `${this.operator}${this.value.toString(tabSize)}`
  }

}

export class Binary implements Base {

  private left: Base
  private operator: string
  private right: Base

  leftGroup: boolean | void
  rightGroup: boolean | void

  constructor(left: Base, operator: string, right: Base) {
    this.left = left
    this.operator = operator
    this.right = right
  }

  toString(tabSize?: number) {
    let left = this.left.toString(tabSize), right = this.right.toString(tabSize)
    if (this.leftGroup) {
      left = `${OPAREN}${left}${CPAREN}`
    }
    if (this.rightGroup) {
      right = `${OPAREN}${right}${CPAREN}`
    }
    return `${left}${SPACE}${this.operator}${SPACE}${right}`
  }

}

export class Ternary implements Base {

  private test: Base
  private yes: Base
  private no: Base

  constructor(test: Base, yes: Base, no: Base) {
    this.test = test
    this.yes = yes
    this.no = no
  }

  toString(tabSize?: number) {
    return `${this.test.toString(tabSize)}${SPACE}?${SPACE}${this.yes.toString(tabSize)}${SPACE}:${SPACE}${this.no.toString(tabSize)}`
  }

}

export class AnonymousFunction implements Base {

  private args: Base[] | void
  private body: Base | void
  private returnValue: Base | void

  constructor(args: Base[] | void, body: Base | void, returnValue: Base | void) {
    this.args = args
    this.body = body
    this.returnValue = returnValue
  }

  toString(tabSize?: number) {

    const { args, body, returnValue } = this,
    currentTabSize = tabSize || 0,
    nextTabSize = currentTabSize + 1,
    currentIndentSize = string.repeat(INDENT, currentTabSize),
    nextIndentSize = string.repeat(INDENT, nextTabSize),

    tuple = args ? toTuple(constant.EMPTY_STRING, constant.EMPTY_STRING, COMMA, constant.FALSE, args).toString(currentTabSize) : constant.EMPTY_STRING,

    code: string[] = [ ]

    if (body) {
      array.push(
        code,
        body.toString(nextTabSize)
      )
    }
    if (returnValue) {
      array.push(
        code,
        `return ${returnValue.toString(nextTabSize)}`
      )
    }

    return `${constant.RAW_FUNCTION}${SPACE}(${tuple})${SPACE}{${BREAK_LINE}${nextIndentSize}${array.join(code, BREAK_LINE + nextIndentSize)}${BREAK_LINE}${currentIndentSize}}`
  }

}

export class Member implements Base {

  private base: Base
  private props: Base[]

  constructor(base: Base, props: Base[]) {
    this.base = base
    this.props = props
  }

  toString(tabSize?: number) {
    const { base, props } = this

    let result = base.toString(tabSize)

    array.each(
      props,
      function (prop) {
        if (prop instanceof Primitive && is.string(prop.value)) {
          result += '.' + prop.value
        }
        else {
          result += `[${prop.toString(tabSize)}]`
        }
      }
    )

    return result
  }

}

export class Operator implements Base {

  private base: Base
  private code: Base

  constructor(base: Base, code: Base) {
    this.base = base
    this.code = code
  }

  toString(tabSize?: number) {
    const { base, code } = this
    return `${base.toString(tabSize)}.${code.toString(tabSize)}`
  }

}

export class Assign implements Base {

  private name: Base
  private value: Base

  constructor(name: Base, value: Base) {
    this.name = name
    this.value = value
  }

  toString(tabSize?: number) {
    const { name, value } = this
    return `${name.toString(tabSize)} = ${value.toString(tabSize)}`
  }

}

export class Push implements Base {

  private array: string
  private item: Base

  constructor(array: string, item: Base) {
    this.array = array
    this.item = item
  }

  toString(tabSize?: number) {
    const { array, item } = this
    return `${array}[${SPACE}${array}.length${SPACE}]${SPACE}=${SPACE}${item.toString(tabSize)}`
  }

}

export function toRaw(value: string) {
  return new Raw(value)
}

export function toPrimitive(value: any) {
  return new Primitive(value)
}

export function toTuple(left: string, right: string, separator: string, breakLine: boolean, items?: Base[]) {
  return new Tuple(left, right, separator, breakLine, items)
}

export function toList(items?: Base[]) {
  return new Tuple('[', ']', COMMA, constant.TRUE, items)
}

export function toMap(fields?: Record<string, Base>) {
  return new Map(fields)
}

export function toCall(name: string, args?: Base[]) {
  return new Call(name, args)
}

export function toUnary(operator: string, value: Base) {
  return new Unary(operator, value)
}

export function toBinary(left: Base, operator: string, right: Base) {
  return new Binary(left, operator, right)
}

export function toTernary(test: Base, yes: Base, no: Base) {
  return new Ternary(test, yes, no)
}

export function toAnonymousFunction(args: Base[] | void, body: Base | void, returnValue: Base | void) {
  return new AnonymousFunction(args, body, returnValue)
}

export function toMember(base: Base, props: Base[]) {
  return new Member(base, props)
}

export function toOperator(base: Base, code: Base) {
  return new Operator(base, code)
}

export function toAssign(name: Base, value: Base) {
  return new Assign(name, value)
}

export function toPush(array: string, item: Base) {
  return new Push(array, item)
}

/**
 * 目的是 保证调用参数顺序稳定，减少运行时判断
 *
 * [a, undefined, undefined] => [a]
 * [a, undefined, b, undefined] => [a, undefined, b]
 */
function trimArgs(list: Base[]) {

  let args: Base[] = [ ], removable = constant.TRUE

  array.each(
    list,
    function (arg) {

      const isDef = arg instanceof Primitive
        ? arg.value !== constant.UNDEFINED
        : constant.TRUE

      if (isDef) {
        removable = constant.FALSE
        array.unshift(args, arg)
      }
      else if (!removable) {
        array.unshift(args, toPrimitive(constant.UNDEFINED))
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
  // 换行符会导致字符串语法错误
  return `${quote}${value.replace(/\n\s*/g, '\\n')}${quote}`
}

function toObjectPair(key: string, value: string) {
  if (!/^[\w$]+$/.test(key)) {
    key = toStringLiteral(key)
  }
  return `${key}:${SPACE}${value}`
}

function toVarPair(key: string, value: string) {
  return `${key}${SPACE}=${SPACE}${value}`
}

export function init() {

  if (isUglify !== constant.PUBLIC_CONFIG.uglifyCompiled) {

    isUglify = constant.PUBLIC_CONFIG.uglifyCompiled

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

  }

  if (isMinify !== constant.PUBLIC_CONFIG.minifyCompiled) {

    isMinify = constant.PUBLIC_CONFIG.minifyCompiled

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

export function parse(keypath: string) {
  return keypath.split(constant.RAW_DOT)
  .filter(
    function (item) {
      return item.length > 0
    }
  )
  .map(
    function (item) {
      return toPrimitive(
        is.numeric(item)
          ? toNumber(item)
          : item
      )
    }
  )
}

export function generate(args: Base[], vars: Record<string, Base>, code: Base) {

  const localVarMap: Record<string, Base> = { },

  localVarList: Base[] = [ ],

  addLocalVar = function (value: Base, key: string) {
    array.push(
      localVarList,
      {
        toString(tabSize) {
          return toVarPair(key, value.toString(tabSize))
        }
      }
    )
  }

  localVarMap[UNDEFINED] = toRaw('void 0')
  localVarMap[NULL] = toRaw('null')
  localVarMap[TRUE] = toRaw('!0')
  localVarMap[FALSE] = toRaw('!1')

  object.each(
    localVarMap,
    addLocalVar
  )

  object.each(
    vars,
    addLocalVar
  )

  return toAnonymousFunction(
    args,
    toTuple(
      constant.EMPTY_STRING,
      constant.EMPTY_STRING,
      ';',
      constant.TRUE,
      [
        {
          toString(tabSize) {
            return `var ${toTuple(constant.EMPTY_STRING, constant.EMPTY_STRING, COMMA, constant.FALSE, localVarList).toString(tabSize)}`
          }
        },
        code
      ]
    )
  ).toString()

}