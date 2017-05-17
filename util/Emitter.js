
import execute from '../function/execute'

import * as is from './is'
import * as env from './env'
import * as char from './char'
import * as array from './array'
import * as object from './object'

import Event from './Event'

export default class Emitter {

  constructor() {
    this.listeners = { }
  }

  fire(type, data, context) {

    let isComplete = env.TRUE, listeners = this.listeners, list = listeners[ type ]
    if (list) {

      // 简单支持一下 jquery 的事件命名空间，即 type.namespace
      // 不支持 a.b.namespace 这种多个 . 的情况
      let event = data, namespace = type.split(char.CHAR_DOT)[ 1 ]
      if (is.array(data)) {
        event = data[ 0 ]
      }

      let isEvent = Event.is(event), offQueue

      array.each(
        list,
        function (item, index) {

          if (namespace && item.namespace && namespace !== item.namespace) {
            return
          }

          let result = execute(
            item.func,
            context !== env.UNDEFINED ? context : item.context,
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
            array.push(offQueue || (offQueue = [ ]), index)
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

      if (offQueue) {
        array.each(
          offQueue,
          function (index) {
            list.splice(index, 1)
          },
          env.TRUE
        )
        if (!list.length) {
          delete listeners[ type ]
        }
      }
    }

    return isComplete

  }

  has(type, listener) {

    let list = this.listeners[ type ]
    if (listener == env.NULL) {
      return !array.falsy(list)
    }
    else if (list) {
      let result
      array.each(
        list,
        function (item) {
          if (result = item.func === listener) {
            return env.FALSE
          }
        }
      )
      return result
    }

  }

}

object.extend(
  Emitter.prototype,
  {
    on: on(),
    once: on({ max: 1 }),
    off(type, listener) {

      let instance = this

      if (type == env.NULL) {
        instance.listeners = { }
      }
      else {
        let { listeners } = instance
        let list = listeners[ type ]
        if (list) {
          if (listener == env.NULL) {
            list.length = 0
          }
          else {
            array.each(
              list,
              function (item, index) {
                if (item.func === listener) {
                  list.splice(index, 1)
                }
              },
              env.TRUE
            )
          }
          if (!list.length) {
            delete listeners[ type ]
          }
        }
      }

    }
  }
)

function on(data) {
  return function (type, listener) {

    let { listeners } = this

    let addListener = function (item, type) {
      if (is.func(item)) {
        item = { func: item }
      }
      if (is.object(item) && is.func(item.func)) {
        if (data) {
          object.extend(item, data)
        }
        array.push(
          listeners[ type ] || (listeners[ type ] = [ ]),
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
