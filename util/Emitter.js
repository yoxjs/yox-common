
import execute from '../function/execute'

import * as is from './is'
import * as env from './env'
import * as char from './char'
import * as array from './array'
import * as object from './object'
import * as string from './string'

import Event from './Event'

export default class Emitter {

  constructor() {
    this.listeners = { }
  }

  on(type, listener) {

    let { listeners } = this

    let addListener = function (listener, type) {
      if (is.func(listener)) {
        array.push(
          listeners[ type ] || (listeners[ type ] = [ ]),
          listener
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

  once(type, listener) {

    let instance = this
    let addOnce = function (listener, type) {
      if (is.func(listener)) {
        listener.$magic = function () {
          instance.off(type, listener)
        }
      }
    }

    if (is.object(type)) {
      object.each(type, addOnce)
    }
    else if (is.string(type)) {
      addOnce(listener, type)
    }

    instance.on(type, listener)

  }

  off(type, listener) {

    let { listeners } = this

    if (type == env.NULL) {
      object.each(
        listeners,
        function (list, type) {
          if (is.array(listeners[ type ])) {
            listeners[ type ].length = 0
          }
        }
      )
    }
    else {
      let list = listeners[ type ]
      if (is.array(list)) {
        if (listener == env.NULL) {
          list.length = 0
        }
        else {
          array.remove(list, listener)
        }
      }
    }

  }

  fire(type, data, context) {

    if (arguments.length === 2) {
      context = env.NULL
    }

    let event = data
    if (is.array(data)) {
      event = data[ 0 ]
    }

    let isEvent = Event.is(event), isComplete = env.TRUE

    this.match(
      type,
      function (list, extra) {
        if (is.array(list)) {
          array.each(
            list,
            function (listener) {

              let result = execute(
                listener,
                context,
                extra ? array.merge(data, extra) : data
              )

              let { $magic } = listener
              if (is.func($magic)) {
                $magic()
                delete listener.$magic
              }

              // 如果没有返回 false，而是调用了 event.stop 也算是返回 false
              if (isEvent) {
                if (result === env.FALSE) {
                  event.prevent()
                  event.stop()
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
      }
    )

    return isComplete

  }

  has(type, listener) {
    let result = env.FALSE
    this.match(
      type,
      function (list) {
        if (listener == env.NULL) {
          result = !array.falsy(list)
        }
        else if (is.array(list)) {
          result = array.has(list, listener)
        }
        if (result) {
          return env.FALSE
        }
      }
    )
    return result
  }

  match(type, handler) {
    let { listeners } = this
    object.each(
      listeners,
      function (list, key) {
        if (key === type) {
          return handler(list)
        }
        else if (string.has(key, '*')) {
          key = key
            .replace(/\./g, '\\.')
            .replace(/\*\*/g, '([\.\\w]+?)')
            .replace(/\*/g, '(\\w+)')
          key = type.match(
            new RegExp(`^${key}$`)
          )
          if (key) {
            return handler(
              list,
              array.toArray(key).slice(1)
            )
          }
        }
      }
    )
  }

}
