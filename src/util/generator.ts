import * as is from './is'
import * as array from './array'
import * as object from './object'
import * as string from './string'
import * as constant from './constant'


const QUOTE_DOUBLE = '"',

QUOTE_SINGLE = "'",

COMMA = ',',

RETURN = 'return '


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

export class List implements Base {

  private items: Base[]

  constructor(items?: Base[]) {
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

    const { items } = this, { length } = items

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

    return `[${BREAK_LINE}${nextIndentSize}${array.join(result, COMMA + BREAK_LINE + nextIndentSize)}${BREAK_LINE}${currentIndentSize}]`

  }

}

export class Map implements Base {

  private fields: Record<string, Base> = {}

  set(name: string, value: Base) {
    if (value instanceof Primitive
      && (value as Primitive).value === constant.UNDEFINED
    ) {
      return
    }
    this.fields[name] = value
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

export class Call implements Base {

  private name: string
  private args: Base[]

  constructor(name: string, args?: Base[]) {
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
      left = `(${left})`
    }
    if (this.rightGroup) {
      right = `(${right})`
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

  private returnValue: Base
  private args: Base[]

  constructor(returnValue: Base, args?: Base[]) {
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

export function toRaw(value: string) {
  return new Raw(value)
}

export function toPrimitive(value: any) {
  return new Primitive(value)
}

export function toList(items?: Base[]) {
  return new List(items)
}

export function toMap() {
  return new Map()
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

export function toAnonymousFunction(returnValue: Base, args?: Base[]) {
  return new AnonymousFunction(returnValue, args)
}

export function toOperator(base: Base, code: Base) {
  return new Operator(base, code)
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
  // 换行符会导致字符串语法错误
  return `${quote}${value.replace(/\n\s*/g, '\\n')}${quote}`
}

function toPair(key: string, value: string) {
  if (!/^[\w$]+$/.test(key)) {
    key = toStringLiteral(key)
  }
  return `${key}:${SPACE}${value}`
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
    toPrimitive
  )
}

export function generate(code: Base, vars: Record<string, Base>, args: string[]) {

  const currentTabSize = 0,
  nextTabSize = currentTabSize + 1,
  currentIndentSize = string.repeat(INDENT, currentTabSize),
  nextIndentSize = string.repeat(INDENT, nextTabSize),
  localVarMap: Record<string, Base> = { },
  localVarList: string[] = [ ],
  addLocalVar = function (value: Base, key: string) {
    array.push(
      localVarList,
      `${key}${SPACE}=${SPACE}${value.toString(nextTabSize)}`
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

  return `${currentIndentSize}${constant.RAW_FUNCTION}${SPACE}(${args.join(`${COMMA}${SPACE}`)})${SPACE}{`
       + `${BREAK_LINE}${nextIndentSize}var ${localVarList.join(`,${SPACE}`)};`
       + `${BREAK_LINE}${nextIndentSize}${RETURN}${code.toString(nextTabSize)}`
       + `${BREAK_LINE}${currentIndentSize}}`
}