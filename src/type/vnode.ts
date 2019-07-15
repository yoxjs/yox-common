import {
  Data,
  Listener,
  LazyValue,
  PropertyHint,
} from './type'

import {
  DirectiveHooks,
  TransitionHooks,
} from './hooks'

import {
  YoxInterface,
} from './yox'

export interface Attribute {

  readonly name: string

  readonly value: string

}

export interface Property {

  readonly name: string

  readonly value: any

  readonly hint: PropertyHint

}

export interface Directive {

  key: string

  name: string

  ns: string

  // 指令修饰符
  readonly modifier: string | void

  // 指令的值，一般是字面量，比如 o-x="1" 中的 1
  // 如果不是字面量，则提供 getter 函数用于取值，同时 value 也会保留字面量
  readonly value?: string | number | boolean

  // 必须有 hooks
  readonly hooks: DirectiveHooks<YoxInterface>

  // 取值函数
  readonly getter?: () => any | void

  // 事件或函数调用式的指令会编译成 handler
  readonly handler?: Listener | void

  // 单向绑定：prop 的 hint，用于区分 attr 和 prop
  readonly hint?: PropertyHint | void

}

export interface VNode {

  data: Data

  // 真实节点
  node: Node

  // 组件实际的父组件
  parent?: YoxInterface

  // 插槽名称
  slot?: string

  // 渲染节点时的 keypath
  readonly keypath: string

  // 渲染该节点的组件
  readonly context: YoxInterface

  // 元素节点或组件节点的标签名称
  readonly tag?: string | void

  // 是否是 组件节点
  readonly isComponent?: boolean

  // 是否是 注释节点
  readonly isComment?: boolean

  // 是否是 文本节点
  readonly isText?: boolean

  // 是否是 svg 元素
  readonly isSvg?: boolean

  // 是否是 style 元素
  readonly isStyle?: boolean

  // 是否是 option 元素
  readonly isOption?: boolean

  readonly isStatic?: boolean

  readonly props?: Data

  readonly slots?: Record<string, VNode[]>

  readonly nativeProps?: Record<string, Property>

  readonly nativeAttrs?: Record<string, Attribute>

  readonly directives?: Record<string, Directive>

  // 如果 directives 有值，则 lazy 必有值
  readonly lazy?: Record<string, LazyValue>

  readonly transition?: TransitionHooks

  readonly ref?: string

  readonly key?: string

  readonly text?: string

  readonly html?: string

  readonly children?: VNode[]

}