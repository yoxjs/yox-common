import {
  ComponentOptions,
} from './options'

import {
  Location,
  RouteTarget,
} from './router'

import CustomEvent from '../util/CustomEvent'

export type Data = Record<string, any>

export type LazyValue = number | true

export type PropTypeFunction = (key: string, value: any) => void

export type PropValueFunction = () => any

export type PropertyHint = 1 | 2 | 3

export type ComponentCallback = (options: ComponentOptions) => void

export type ComponentLoader = (callback: ComponentCallback) => Promise<ComponentOptions> | void

export type Component = ComponentOptions | ComponentLoader

export type FilterFunction = (this: any, ...args: any) => string | number | boolean

export type Filter = FilterFunction | Record<string, FilterFunction>

export type Watcher<T = any> = (this: T, newValue: any, oldValue: any, keypath: string) => void

export type Listener<T = any> = (this: T, event: CustomEvent, data?: Data) => false | void

export type NativeListener = (event: CustomEvent | Event) => false | void

export type ComputedGetter = () => any

export type ComputedSetter = (value: any) => void

export type OptionsBeforeCreateHook = (options: ComponentOptions) => void

export type OptionsOtherHook = () => void

export type RouterBeforeHook = (to: Location, from: Location | void, next: (value?: false | string | RouteTarget) => void) => void

export type RouterAfterHook = (to: Location, from: Location | void) => void

export type ValueHolder = {

  keypath?: string

  value: any

}

export type Task = {

  // 待执行的函数
  fn: Function

  // 执行函数的上下文对象
  ctx?: any

}

export type PropRule = {

  // 类型
  type: string | string[] | PropTypeFunction

  // 默认值
  value?: any | PropValueFunction

  // 是否必传
  required?: boolean

}
