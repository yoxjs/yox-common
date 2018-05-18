
import isDef from '../function/isDef'
import execute from '../function/execute'

import * as is from './is'
import * as env from './env'
import * as char from './char'
import * as array from './array'
import * as object from './object'
import * as string from './string'

import Event from './Event'

export default class Emitter {

  /**
   *
   * @param {boolean} namespace 是否需要命名空间
   */
  constructor(namespace) {
    this.namespace = namespace
    this.listeners = { }
  }

  fire(type, data, context) {

    let instance = this
    let { namespace, listeners } = instance
    let { name, space } = parseType(type, namespace)

    let isComplete = env.TRUE, list = listeners[ name ]
    if (list) {

      let event = is.array(data) ? data[ 0 ] : data, isEvent = Event.is(event)

      array.each(
        object.copy(list),
        function (item) {

          let index = array.indexOf(list, item)

          // 在 fire 过程中被移除了
          if (index < 0
            || (space && item.space && space !== item.space)
          ) {
            return
          }

          // 为 event 对象加上当前正在处理的 listener
          // 这样方便业务层移除事件绑定
          // 比如 on('xx', function) 这样定义了匿名 listener
          // 在这个 listener 里面获取不到当前 listener 的引用
          // 为了能引用到，有时候会先定义 var listener = function,
          // 然后再 on('xx', listener) 这样其实是没有必要的
          if (isEvent) {
            event.listener = item.func
          }

          let result = execute(
            item.func,
            isDef(context) ? context : item.context,
            data
          )

          // 执行次数
          if (item.count > 0) {
            item.count++
          }
          else {
            item.count = 1
          }

          // 注册的 listener 可以指定最大执行次数
          if (item.count === item.max) {
            instance.off(name, item)
          }

          // 如果没有返回 false，而是调用了 event.stop 也算是返回 false
          if (isEvent) {
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

  has(type, listener) {

    let { namespace, listeners } = this, { name, space } = parseType(type, namespace), result = env.TRUE

    let each = function (list) {
      array.each(
        list,
        function (item, index) {
          if ((!space || space === item.space)
            && (!listener || listener === item.func)
          ) {
            return result = env.FALSE
          }
        }
      )
      return result
    }

    if (name) {
      let list = listeners[ name ]
      if (list) {
        each(list)
      }
    }
    else if (space) {
      object.each(listeners, each)
    }

    return !result

  }

}

object.extend(
  Emitter.prototype,
  {
    on: on(),
    once: on({ max: 1 }),
    off(type, listener) {

      let instance = this, listeners = instance.listeners

      if (type) {

        let { name, space } = parseType(type, instance.namespace)

        let each = function (list, name) {
          if (is.object(listener)) {
            let index = array.indexOf(list, listener)
            if (index >= 0) {
              list.splice(index, 1)
            }
          }
          else {
            array.each(
              list,
              function (item, index) {
                if ((!space || space === item.space)
                  && (!listener || listener === item.func)
                ) {
                  list.splice(index, 1)
                }
              },
              env.TRUE,
            )
          }
          if (!list[ env.RAW_LENGTH ]) {
            delete listeners[ name ]
          }
        }

        if (name) {
          if (listeners[ name ]) {
            each(listeners[ name ], name)
          }
        }
        else if (space) {
          object.each(listeners, each)
        }

      }
      else {
        // 清空
        instance.listeners = { }
      }

    }
  }
)

function on(data) {
  return function (type, listener) {

    let { namespace, listeners } = this

    let addListener = function (item, type) {
      if (is.func(item)) {
        item = { func: item }
      }
      if (is.object(item) && is.func(item.func)) {
        if (data) {
          object.extend(item, data)
        }
        let { name, space } = parseType(type, namespace)
        item.space = space
        array.push(
          listeners[ name ] || (listeners[ name ] = [ ]),
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
}

function parseType(type, namespace) {
  let result = {
    name: type,
    space: char.CHAR_BLANK,
  }
  if (namespace) {
    let index = string.indexOf(type, char.CHAR_DOT)
    if (index >= 0) {
      result.name = string.slice(type, 0, index)
      result.space = string.slice(type, index + 1)
    }
  }
  return result
}
