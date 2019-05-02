import execute from '../function/execute'

import * as is from './is'
import * as env from './env'
import * as array from './array'
import * as object from './object'
import * as string from './string'
import * as logger from './logger'

import * as type from 'yox-type/index'
import EmitterOptions from 'yox-type/src/options/Emitter'
import EmitterInterface from 'yox-type/src/Emitter'
import CustomEvent from './CustomEvent'

interface Namespace {
  name: string
  ns: string
}

export default class Emitter implements EmitterInterface {

  /**
   * 是否开启命名空间
   *
   * 命名空间格式为  name.namespace
   *
   * 典型的场景是在一个组件创建时绑定全局事件，销毁时解绑事件，如下
   *
   * create:
   *
   *    component.on('a.namespace', listener)
   *    component.on('b.namespace', listener)
   *
   * destroy:
   *
   *    component.off('.namespace') // 无需依次解绑，费时费力
   *
   * a.namespace 会响应全局 a 事件，原因正如上面这个例子，否则无法实现快捷解绑
   * a 不会响应 a.namespace 事件，因为命名空间不匹配
   */
  ns: boolean

  /**
   * 已注册的事件监听
   */
  listeners: Record<string, EmitterOptions[]>

  /**
   * 原生事件监听，一个事件对应一个 listener
   */
  nativeListeners?: Record<string, type.nativeEventListener>

  constructor(ns?: boolean) {
    this.ns = ns || env.FALSE
    this.listeners = {}
  }

  /**
   * 发射事件
   *
   * @param bullet 事件或事件名称
   * @param data 事件数据
   */
  fire(
    bullet: string | CustomEvent,
    data: type.eventData | any[] | void,
    filter?: (options: EmitterOptions, data: type.eventData | any[] | void) => boolean | void
  ): boolean {

    let event: CustomEvent | void, type: string, args: any

    if (bullet instanceof CustomEvent) {
      event = bullet
      type = bullet.type
      args = is.object(data) ? [event, data] : event
    }
    else {
      type = bullet
      if (data) {
        args = data
      }
    }

    let instance = this,

    { name, ns } = parseNamespace(instance.ns, type),

    list = instance.listeners[name],

    isComplete = env.TRUE

    if (list) {

      // 避免遍历过程中，数组发生变化，比如增删了
      list = object.copy(list)

      array.each(
        list,
        function (options: EmitterOptions, _: number) {

          // 传了 filter，则用 filter 测试是否继续往下执行
          if ((filter ? !filter(options, data) : !matchNamespace(ns, options))
            // 在 fire 过程中被移除了
            || !array.has(list, options)
          ) {
            return
          }

          // 为 event 对象加上当前正在处理的 listener
          // 这样方便业务层移除事件绑定
          // 比如 on('xx', function) 这样定义了匿名 listener
          // 在这个 listener 里面获取不到当前 listener 的引用
          // 为了能引用到，有时候会先定义 var listener = function,
          // 然后再 on('xx', listener) 这样其实是没有必要的
          if (event) {
            event.listener = options.fn
          }

          let result = execute(options.fn, options.ctx, args)

          if (event) {
            event.listener = env.UNDEFINED
          }

          // 执行次数
          options.num = options.num ? (options.num + 1) : 1

          // 注册的 listener 可以指定最大执行次数
          if (options.num === options.max) {
            instance.off(type, options)
          }

          // 如果没有返回 false，而是调用了 event.stop 也算是返回 false
          if (event) {
            if (result === env.FALSE) {
              event.prevent().stop()
            }
            else if (event.isStoped) {
              result = env.FALSE
            }
          }

          if (result === env.FALSE) {
            return isComplete = env.FALSE
          }
        }
      )

    }

    return isComplete

  }

  /**
   * 是否已监听某个事件
   *
   * @param type
   * @param listener
   */
  has(
    type: string,
    listener?: type.eventListener | EmitterOptions
  ): boolean {

    let instance = this,

    listeners = instance.listeners,

    { name, ns } = parseNamespace(instance.ns, type),

    result = env.TRUE,

    matchListener = createMatchListener(listener),

    each = function (list: EmitterOptions[]) {
      array.each(
        list,
        function (options: EmitterOptions) {
          if (matchListener(options) && matchNamespace(ns, options)) {
            return result = env.FALSE
          }
        }
      )
      return result
    }

    if (name) {
      if (listeners[name]) {
        each(listeners[name])
      }
    }
    else if (ns) {
      object.each(listeners, each)
    }

    return !result

  }

  /**
   * 注册监听
   *
   * @param type
   * @param listener
   * @param extra
   */
  on(
    type: string | Record<string, type.eventListener | EmitterOptions>,
    listener?: type.eventListener | EmitterOptions,
    extra?: EmitterOptions
  ): void {

    const instance = this,

    listeners = instance.listeners,

    addListener = function (item: type.eventListener | EmitterOptions | void, type: string) {
      if (item) {
        const options: EmitterOptions = is.func(item) ? { fn: item as type.eventListener } : item as EmitterOptions
        if (is.object(options) && is.func(options.fn)) {
          if (extra) {
            object.extend(options, extra)
          }
          const { name, ns } = parseNamespace(instance.ns, type)
          options.ns = ns
          array.push(
            listeners[name] || (listeners[name] = []),
            options
          )
          return
        }
      }
      if (process.env.NODE_ENV === 'dev') {
        logger.fatal(`注册 ${type} 事件失败`)
      }
    }

    if (is.string(type)) {
      addListener(listener, type as string)
    }
    else {
      object.each(type, addListener)
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
    listener?: type.eventListener | EmitterOptions
  ): void {

    const instance = this,

    listeners = instance.listeners

    if (type) {

      const { name, ns } = parseNamespace(instance.ns, type),

      matchListener = createMatchListener(listener),

      each = function (list: EmitterOptions[], name: string) {
        array.each(
          list,
          function (options: EmitterOptions, index: number) {
            if (matchListener(options) && matchNamespace(ns, options)) {
              list.splice(index, 1)
            }
          },
          env.TRUE
        )
        if (!list.length) {
          delete listeners[name]
        }
      }

      if (name) {
        if (listeners[name]) {
          each(listeners[name], name)
        }
      }
      else if (ns) {
        object.each(listeners, each)
      }

    }
    else {
      // 清空
      instance.listeners = {}
      // 在开发阶段进行警告，比如传了 type 进来，type 是个空值
      // 但你不知道它是空值
      if (process.env.NODE_ENV === 'dev') {
        if (arguments.length > 0) {
          logger.warn(`调用 emitter.off(type) 时，type 为空`)
        }
      }
    }

  }

}

/**
 * 把事件类型解析成命名空间格式
 *
 * @param ns
 * @param type
 */
function parseNamespace(ns: boolean, type: string): Namespace {

  const result = {
    name: type,
    ns: env.EMPTY_STRING,
  }

  if (ns) {
    const index = string.indexOf(type, '.')
    if (index >= 0) {
      result.name = string.slice(type, 0, index)
      result.ns = string.slice(type, index + 1)
    }
  }

  return result

}

/**
 * 外部会传入 type.eventListener 或 EmitterOptions 或 空
 *
 * 这里根据传入值的不同类型，创建不同的判断函数
 *
 * 如果传入的是 EmitterOptions，则全等判断
 *
 * 如果传入的是 type.eventListener，则判断函数是否全等
 *
 * 如果传入的是空，则直接返回 true
 *
 * @param listener
 */
function createMatchListener(listener: type.eventListener | EmitterOptions | void): (options: EmitterOptions) => boolean {
  return is.object(listener)
    ? function (options: EmitterOptions) {
        return listener === options
      }
    : is.func(listener)
      ? function (options: EmitterOptions) {
          return listener === options.fn
        }
      : function (options: EmitterOptions) {
          return env.TRUE
        }
}

/**
 * 判断 options 是否能匹配命名空间
 *
 * 如果 options 未指定命名空间，或 options.ns 和 namespace 一致，返回 true
 *
 * @param namespace
 * @param options
 */
function matchNamespace(namespace: string, options: EmitterOptions): boolean {
  return !namespace.length || namespace === options.ns
}