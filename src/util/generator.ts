import * as is from './is'
import * as array from './array'
import * as object from './object'
import * as string from './string'
import * as constant from './constant'

// 下面这些值需要根据外部配置才能确定
let isUglify = constant.UNDEFINED,

isMinify = constant.UNDEFINED,

// 保留字，避免 IE 出现 { class: 'xx' } 报错
reservedWords = string.toMap('abstract,goto,native,static,enum,implements,package,super,byte,export,import,private,protected,public,synchronized,char,extends,int,throws,class,final,interface,transient,yield,let,const,float,double,boolean,long,short,volatile,default'),

varId = 0,

varMap: Record<string, Base | void> = { },

varCache: Record<string, string> = { },

VAR_PREFIX = constant.EMPTY_STRING,

TEMP = constant.EMPTY_STRING,

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

export class Primitive implements Base {

  value: string | number | boolean | null | undefined

  constructor(value: any) {
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
  private offset: number
  private items: Base[]

  constructor(left: string, right: string, separator: string, breakLine: boolean, offset: number, items?: Base[]) {
    this.left = left
    this.right = right
    this.separator = separator
    this.breakLine = breakLine
    this.offset = offset
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

    let { left, right, separator, breakLine, offset, items } = this, { length } = items

    if (!length) {
      return `${left}${right}`
    }

    const currentTabSize = tabSize || 0,
    nextTabSize = currentTabSize + offset,
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

export class Statement implements Base {

  private items: Base[]

  constructor(items?: Base[]) {
    this.items = items || []
  }

  add(value: Base) {
    array.push(
      this.items,
      value
    )
  }

  toString(tabSize?: number) {

    const { items } = this

    if (items.length === 1) {
      return items[0].toString(tabSize)
    }

    return new Tuple(
      '(',
      ')',
      ',',
      constant.TRUE,
      1,
      items
    ).toString(tabSize)

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

    const { fields } = this,

    // 按字典排序显得比较有规律
    items: Base[] = object.keys(fields).sort().map(
      function (key) {
        return {
          toString(tabSize) {
            return toObjectPair(key, fields[key].toString(tabSize))
          }
        }
      }
    )

    return toTuple('{', '}', ',', constant.TRUE, 1, items).toString(tabSize)

  }

}

export class Call implements Base {

  private name: string | Base
  private args?: Base[]

  constructor(name: string | Base, args?: Base[]) {
    this.name = name
    this.args = args
  }

  toString(tabSize?: number) {

    const { name, args } = this,

    newArgs = args ? trimArgs(args) : [ ]

    return newArgs.length
      ? `${name.toString(tabSize)}${toTuple('(', ')', ',', constant.TRUE, 1, newArgs).toString(tabSize)}`
      : `${name.toString(tabSize)}()`

  }

}

export class Precedence implements Base {

  private value: Base

  constructor(value: Base) {
    this.value = value
  }

  toString(tabSize?: number) {
    return `(${this.value.toString(tabSize)})`
  }

}

export class StringBuffer implements Base {

  private buffer: Base | void

  append(text: Base) {
    const { buffer } = this
    if (buffer) {
      this.buffer = toBinary(
        buffer instanceof Ternary
          ? toPrecedence(buffer)
          : buffer,
        '+',
        text instanceof Ternary
          ? toPrecedence(text)
          : text
      )
    }
    else {
      this.buffer = text
    }
  }

  toString(tabSize?: number) {
    return (this.buffer as Base).toString(tabSize)
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

  constructor(left: Base, operator: string, right: Base) {
    this.left = left
    this.operator = operator
    this.right = right
  }

  toString(tabSize?: number) {
    return `${this.left.toString(tabSize)}${SPACE}${this.operator}${SPACE}${this.right.toString(tabSize)}`
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

    tuple = args ? toTuple(constant.EMPTY_STRING, constant.EMPTY_STRING, ',', constant.FALSE, 1, args).toString(currentTabSize) : constant.EMPTY_STRING,

    code: string[] = [ ]

    if (body) {
      array.push(
        code,
        body.toString(nextTabSize) + (returnValue ? ';' : constant.EMPTY_STRING)
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
        if (prop instanceof Primitive) {
          if (is.numeric(prop.value)) {
            result += `[${SPACE}${prop.value}${SPACE}]`
          }
          else {
            result += '.' + prop.value
          }
        }
        else {
          result += `[${SPACE}${prop.toString(tabSize)}${SPACE}]`
        }
      }
    )

    return result
  }

}

export class Assign implements Base {

  private name: Base
  private value: Base
  private isDeclaration?: boolean

  constructor(name: Base, value: Base, isDeclaration?: boolean) {
    this.name = name
    this.value = value
    this.isDeclaration = isDeclaration
  }

  toString(tabSize?: number) {
    const { name, value, isDeclaration } = this
    const statement = `${name.toString(tabSize)}${SPACE}=${SPACE}${value.toString(tabSize)}`
    return isDeclaration
      ? `var ${statement}`
      : statement
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
    return toCall(
      toMember(
        array,
        [
          toPrimitive('push')
        ]
      ),
      [
        item
      ]
    ).toString(tabSize)
  }

}

export class Typeof implements Base {

  private value: Base
  private type: string

  constructor(value: Base, type: string) {
    this.value = value
    this.type = type
  }

  toString(tabSize?: number) {
    const { value, type } = this
    return `typeof ${value.toString(tabSize)}${SPACE}===${SPACE}${toStringLiteral(type)}`
  }

}

export function toPrimitive(value: any) {
  return new Primitive(value)
}

export function toTuple(left: string, right: string, separator: string, breakLine: boolean, offset: number, items?: Base[]) {
  return new Tuple(left, right, separator, breakLine, offset, items)
}

export function toStatement(items?: Base[]) {
  return new Statement(items)
}

export function toList(items?: Base[], join?: string) {
  let result: Base = toTuple('[', ']', ',', constant.TRUE, 1, items)
  if (is.string(join)) {
    return {
      toString(tabSize?: number) {
        return `${result.toString(tabSize)}.join(${toPrimitive(join).toString()})`
      }
    }
  }
  return result
}

export function toMap(fields?: Record<string, Base>) {
  return new Map(fields)
}

export function toCall(name: string | Base, args?: Base[]) {
  return new Call(name, args)
}

export function toPrecedence(value: Base) {
  return new Precedence(value)
}

export function toStringBuffer() {
  return new StringBuffer()
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

export function toAssign(name: Base, value: Base, isDeclaration?: boolean) {
  return new Assign(name, value, isDeclaration)
}

export function toPush(array: string, item: Base) {
  return new Push(array, item)
}

export function toTypeof(value: Base, type: string) {
  return new Typeof(value, type)
}

export function getTempName() {
  return TEMP
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
  value = value
    .replace(/\\?'/g, "\\'")
    .replace(/\\?"/g, '\\"')
    // 换行符会导致字符串语法错误
    .replace(/\n\s*/g, '\\n')
  return `"${value}"`
}

function toObjectPair(key: string, value: string) {
  if (!/^[\w$]+$/.test(key) || reservedWords[key]) {
    key = toStringLiteral(key)
  }
  return `${key}:${SPACE}${value}`
}

function toVarPair(key: string, value: string | void) {
  return value !== constant.UNDEFINED
    ? `${key}${SPACE}=${SPACE}${value}`
    : key
}

export function init() {

  if (isUglify !== constant.PUBLIC_CONFIG.uglifyCompiled) {

    isUglify = constant.PUBLIC_CONFIG.uglifyCompiled

    VAR_PREFIX = isUglify ? '$' : 'var'

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

  varId = 0
  varMap = { }
  varCache = { }

  TEMP = addVar()
  UNDEFINED = addVar('void 0')
  NULL = addVar('null')
  TRUE = addVar('!0')
  FALSE = addVar('!1')

}

export function addVar(value?: Base, cache?: true) {

  const hash = value ? value.toString() : constant.UNDEFINED

  if (cache && hash && varCache[hash]) {
    return varCache[hash]
  }

  const key = VAR_PREFIX + (varId++)
  varMap[key] = value

  if (cache && hash) {
    varCache[hash] = key
  }

  return key

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

export function generate(args: Base[], code: Base) {

  const varList: Base[] = [ ]

  object.each(
    varMap,
    function (value: Base, key: string) {
      array.push(
        varList,
        {
          toString(tabSize) {
            return toVarPair(
              key,
              value
                ? value.toString(tabSize)
                : constant.UNDEFINED
            )
          }
        }
      )
    }
  )

  const result = toAnonymousFunction(
    constant.UNDEFINED,
    toTuple('var ', constant.EMPTY_STRING, ',', constant.FALSE, 0, varList),
    toAnonymousFunction(args, code)
  )

  return `(${result.toString()})()`

}