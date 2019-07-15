import {
  ComponentOptions,
} from './options'

import CustomEvent from '../util/CustomEvent'

export type Data = Record<string, any>

export type LazyValue = number | true

export type PropTypeFunction = (key: string, value: any) => void

export type PropValueFunction = () => any

export type PropertyHint = 1 | 2 | 3

export type ComponentCallback = (options: ComponentOptions) => void

export type ComponentLoader = (callback: ComponentCallback) => Promise<ComponentOptions> | void

export type Component = ComponentOptions | ComponentLoader

export type FilterFunction<This = any> = (this: This, ...args: any) => string | number | boolean

export type Filter<This = any> = FilterFunction<This> | Record<string, FilterFunction<This>>

export type Watcher<This = any> = (this: This, newValue: any, oldValue: any, keypath: string) => void

export type Listener<This = any> = (this: This, event: CustomEvent, data?: Data) => false | void

export type NativeListener = (event: CustomEvent | Event) => false | void

export type ComputedGetter = () => any

export type ComputedSetter = (value: any) => void

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
