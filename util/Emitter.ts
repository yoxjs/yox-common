import isDef from '../function/isDef'
import execute from '../function/execute'

import * as is from './is'
import * as env from './env'
import * as array from './array'
import * as object from './object'
import * as string from './string'

import CustomEvent from './Event'

const RAW_NAME = env.RAW_NAME
const RAW_SPACE = 'space'

export default class Emitter {

  /**
   * 是否开启命名空间
   *
   * 命名空间格式为  name.space
   *
   * 典型的场景是在一个组件创建时绑定全局事件，销毁时解绑事件，如下
   *
   * create:
   *
   *    component.on('a.space', listener)
   *    component.on('b.space', listener)
   *
   * destroy:
   *
   *    component.off('.space') // 无需依次解绑，费时费力
   *
   * a.space 会响应全局 a 事件，原因正如上面这个例子，否则无法实现快捷解绑
   * a 不会响应 a.space 事件，因为命名空间不匹配
   */
  namespace: boolean

  /**
   * 已注册的事件监听
   */
  listeners: Record<string, Record<string, any>[]>

  /**
   * 原生事件监听，一个事件对应一个 listener
   */
  nativeListeners?: Record<string, Function>

  constructor(namespace = env.FALSE) {
    this.namespace = namespace
    this.listeners = {}
  }

  /**
   * 发射事件
   *
   * @param bullet 事件或事件名称
   * @param data 事件数据
   */
  fire(bullet: string | CustomEvent, data?: Record<string, any> | any[], filter?: (item: Record<string, any>, data?: Record<string, any> | any[]) => boolean | void) {

    let event: CustomEvent | void, type: string

    if (bullet instanceof CustomEvent) {
      event = bullet
      type = bullet.type
    }
    else {
      type = bullet
    }

    let instance = this,
    target = instance.parse(type),
    name = target[RAW_NAME],
    space = target[RAW_SPACE],
    list = instance.listeners[name],
    isComplete = env.TRUE

    if (list) {

      array.each(
        object.copy(list),
        function (item: Record<string, any>, _: number, list: any[]) {

          // 传了 filter，则用 filter 测试是否继续往下执行
          if ((filter ? !filter(item, data) : !instance.matchSpace(space, item))
            // 在 fire 过程中被移除了
            || !array.has(list, item)
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
            event.listener = item.func
          }

          let result = execute(item.func, item.ctx, data)

          // 执行次数
          item.count = item.count > 0 ? (item.count + 1) : 1

          // 注册的 listener 可以指定最大执行次数
          if (item.count === item.max) {
            instance.off(type, item)
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
  has(type: string, listener?: Object | Function): boolean {

    let instance = this,
    listeners = instance.listeners,
    target = instance.parse(type),
    name = target[RAW_NAME],
    space = target[RAW_SPACE],
    result = env.TRUE,

    matchListener = instance.matchListener(listener),
    each = function (list: Object[]) {
      array.each(
        list,
        function (item) {
          if (matchListener(item) && instance.matchSpace(space, item)) {
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
    else if (space) {
      object.each(listeners, each)
    }

    return !result

  }

  /**
   * 注册监听
   *
   * @param type
   * @param listener
   * @param data
   */
  on(type: any, listener: Object | Function, data?: Object) {

    const instance = this,
    listeners = instance.listeners,
    addListener = function (item: any, type: string) {
      if (is.func(item)) {
        item = { func: item }
      }
      if (is.object(item) && is.func(item.func)) {
        if (data) {
          object.extend(item, data)
        }
        const target = instance.parse(type)
        item[RAW_SPACE] = target[RAW_SPACE]
        array.push(
          listeners[target[RAW_NAME]] || (listeners[target[RAW_NAME]] = []),
          item
        )
      }
    }

    if (is.object(type)) {
      object.each(type, addListener)
    }
    else if (is.string(type)) {
      addListener(listener, type)
    }

  }

  /**
   * 注册一次监听
   *
   * @param type
   * @param listener
   */
  once(type: any, listener: Object | Function) {
    this.on(type, listener, { max: 1 })
  }

  /**
   * 取消监听
   *
   * @param type
   * @param listener
   */
  off(type?: string, listener?: Object | Function) {

    const instance = this,
    listeners = instance.listeners

    if (type) {

      const target = instance.parse(type),
      name = target[RAW_NAME],
      space = target[RAW_SPACE],

      matchListener = instance.matchListener(listener),
      each = function (list: Object[], name: string) {
        array.each(
          list,
          function (item: any, index: number, array: any[]) {
            if (matchListener(item) && instance.matchSpace(space, item)) {
              array.splice(index, 1)
            }
          },
          env.TRUE
        )
        if (!list[env.RAW_LENGTH]) {
          delete listeners[name]
        }
      }

      if (name) {
        if (listeners[name]) {
          each(listeners[name], name)
        }
      }
      else if (space) {
        object.each(listeners, each)
      }

    }
    else {
      // 清空
      instance.listeners = {}
    }

  }

  /**
   * 把事件类型解析成命名空间格式
   *
   * @param type
   */
  private parse(type: string): Object {

    const result = {}
    result[RAW_NAME] = type
    result[RAW_SPACE] = env.EMPTY_STRING

    if (this.namespace) {
      const index = string.indexOf(type, '.')
      if (index >= 0) {
        result[RAW_NAME] = string.slice(type, 0, index)
        result[RAW_SPACE] = string.slice(type, index + 1)
      }
    }

    return result

  }

  private matchListener(listener?: any): Function {
    return is.object(listener)
      ? function (item: any) {
        return listener === item
      }
      : function (item: any) {
        return !listener || listener === item.func
      }
  }

  private matchSpace(space: string, item: Object): boolean {
    return !space || space === item[RAW_SPACE]
  }

}
