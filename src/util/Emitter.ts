import {
  NativeListener,
} from 'yox-type/src/type'

import {
  EmitterEvent,
  EmitterFilter,
  EmitterOptions,
} from 'yox-type/src/options'

import execute from '../function/execute'

import CustomEvent from './CustomEvent'

import * as is from './is'
import * as array from './array'
import * as object from './object'
import * as string from './string'
import * as logger from './logger'
import * as constant from './constant'

export default class Emitter {

  /**
   * 是否开启命名空间
   */
  ns: boolean

  /**
   * 已注册的事件监听
   */
  listeners: Record<string, EmitterOptions[]>

  /**
   * 原生事件监听，一个事件对应一个 listener
   */
  nativeListeners?: Record<string, NativeListener>

  constructor(ns?: boolean) {
    this.ns = ns || constant.FALSE
    this.listeners = {}
  }

  /**
   * 发射事件
   *
   * @param type 事件名称或命名空间
   * @param args 事件处理函数的参数列表
   * @param filter 自定义过滤器
   */
  fire(
    type: string | EmitterEvent,
    args: any[] | void,
    filter?: (
      event: EmitterEvent,
      args: any[] | void,
      options: EmitterOptions
    ) => boolean | void
  ): boolean {

    let instance = this,

    event = is.string(type) ? instance.toEvent(type as string) : type as EmitterEvent,

    list = instance.listeners[event.type],

    isComplete = constant.TRUE

    if (list) {

      // 避免遍历过程中，数组发生变化，比如增删了
      list = list.slice()

      // 判断是否是发射事件
      // 如果 args 的第一个参数是 CustomEvent 类型，表示发射事件
      // 因为事件处理函数的参数列表是 (event, data)
      const customEvent = args && CustomEvent.is(args[0])
        ? args[0] as CustomEvent
        : constant.UNDEFINED

      // 这里不用 array.each，减少函数调用
      for (let i = 0, length = list.length; i < length; i++) {

        let options = list[i]

        // 命名空间不匹配
        if (!matchNamespace(event.ns, options)
          // 在 fire 过程中被移除了
          || !array.has(list, options)
          // 传了 filter，则用 filter 判断是否过滤此 options
          || (filter && !filter(event, args, options))
        ) {
          continue
        }

        // 为 customEvent 对象加上当前正在处理的 listener
        // 这样方便业务层移除事件绑定
        // 比如 on('xx', function) 这样定义了匿名 listener
        // 在这个 listener 里面获取不到当前 listener 的引用
        // 为了能引用到，有时候会先定义 var listener = function
        // 然后再 on('xx', listener) 这样其实是没有必要的
        if (customEvent) {
          customEvent.listener = options.listener
        }

        let result = execute(options.listener, options.ctx, args)

        if (customEvent) {
          customEvent.listener = constant.UNDEFINED
        }

        // 执行次数
        options.num = options.num ? (options.num + 1) : 1

        // 注册的 listener 可以指定最大执行次数
        if (options.num === options.max) {
          instance.off(
            event.type,
            {
              ns: event.ns,
              listener: options.listener,
            }
          )
        }

        // 如果没有返回 false，而是调用了 customEvent.stop 也算是返回 false
        if (customEvent) {
          if (result === constant.FALSE) {
            customEvent.prevent().stop()
          }
          else if (customEvent.isStoped) {
            result = constant.FALSE
          }
        }

        if (result === constant.FALSE) {
          isComplete = constant.FALSE
          break
        }

      }

    }

    return isComplete

  }

  /**
   * 注册监听
   *
   * @param type
   * @param listener
   */
  on(
    type: string,
    listener: Function | EmitterOptions
  ): void {

    const instance = this,

    listeners = instance.listeners,

    options: EmitterOptions = is.func(listener)
      ? { listener: listener as Function }
      : listener as EmitterOptions

    if (is.object(options) && is.func(options.listener)) {
      if (!is.string(options.ns)) {
        const event = instance.toEvent(type)
        options.ns = event.ns
        type = event.type
      }
      array.push(
        listeners[type] || (listeners[type] = []),
        options
      )
    }
    else if (process.env.NODE_ENV === 'development') {
      logger.fatal(`emitter.on(type, listener) invoke failed：\n\n"listener" is expected to be a Function or an EmitterOptions.\n`)
    }

  }

  /**
   * 取消监听
   *
   * @param type
   * @param listener
   */
  off(
    type?: string,
    listener?: Function | EmitterFilter
  ): void {

    const instance = this,

    listeners = instance.listeners

    if (type) {

      const filter = instance.toFilter(type, listener),

      each = function (list: EmitterOptions[], name: string) {
        array.each(
          list,
          function (item, index) {
            if (matchListener(filter.listener, item) && matchNamespace(filter.ns, item)) {
              list.splice(index, 1)
            }
          },
          constant.TRUE
        )
        if (!list.length) {
          delete listeners[name]
        }
      }

      if (filter.type) {
        if (listeners[filter.type]) {
          each(listeners[filter.type], filter.type)
        }
      }
      // 按命名空间过滤，如 type 传入 .ns
      else if (filter.ns) {
        object.each(listeners, each)
      }

      if (process.env.NODE_ENV === 'development') {
        // 在开发阶段进行警告，比如传了 listener 进来，listener 是个空值
        // 但你不知道它是空值
        if (arguments.length > 1 && listener == constant.NULL) {
          logger.warn(`emitter.off(type, listener) is invoked, but "listener" is ${listener}.`)
        }
      }

    }
    else {
      // 清空
      instance.listeners = {}
      if (process.env.NODE_ENV === 'development') {
        // 在开发阶段进行警告，比如传了 type 进来，type 是个空值
        // 但你不知道它是空值
        if (arguments.length > 0) {
          logger.warn(`emitter.off(type) is invoked, but "type" is ${type}.`)
        }
      }
    }

  }

  /**
   * 是否已监听某个事件
   *
   * @param type
   * @param listener
   */
  has(
    type: string,
    listener?: Function | EmitterFilter
  ): boolean {

    let instance = this,

    listeners = instance.listeners,

    filter = instance.toFilter(type, listener),
    
    result = constant.TRUE,

    each = function (list: EmitterOptions[]) {
      array.each(
        list,
        function (item) {
          if (matchListener(filter.listener, item) && matchNamespace(filter.ns, item)) {
            return result = constant.FALSE
          }
        }
      )
      return result
    }

    if (filter.type) {
      if (listeners[filter.type]) {
        each(listeners[filter.type])
      }
    }
    else if (filter.ns) {
      object.each(listeners, each)
    }

    return !result

  }

  /**
   * 把事件类型解析成命名空间格式
   *
   * @param type
   */
  toEvent(type: string): EmitterEvent {

    // 这里 ns 必须为字符串
    // 用于区分 event 对象是否已完成命名空间的解析
    const event = {
      type,
      ns: constant.EMPTY_STRING,
    }

    // 是否开启命名空间
    if (this.ns) {
      const index = string.indexOf(type, constant.RAW_DOT)
      if (index >= 0) {
        event.type = string.slice(type, 0, index)
        event.ns = string.slice(type, index + 1)
      }
    }

    return event

  }

  toFilter(
    type: string, 
    listener?: Function | EmitterFilter
  ): EmitterFilter {

    let filter: EmitterFilter
  
    if (listener) {
      filter = is.func(listener)
        ? { listener: listener as Function }
        : listener as EmitterFilter
    }
    else {
      filter = {}
    }
  
    if (is.string(filter.ns)) {
      filter.type = type
    }
    else {
      const event = this.toEvent(type)
      filter.type = event.type
      filter.ns = event.ns
    }
  
    return filter
    
  }

}

/**
 * 判断 options 是否能匹配 listener
 *
 * @param listener
 * @param options
 */
function matchListener(listener: Function | void, options: EmitterOptions): boolean {
  return listener
    ? listener === options.listener
    : constant.TRUE
}

/**
 * 判断 options 是否能匹配命名空间
 *
 * 如果 namespace 和 options.ns 都不为空，则需完全匹配
 *
 * 如果他们两个其中任何一个为空，则不判断命名空间
 *
 * @param namespace
 * @param options
 */
function matchNamespace(namespace: string | void, options: EmitterOptions): boolean {
  const { ns } = options
  return ns && namespace
    ? ns === namespace
    : constant.TRUE
}