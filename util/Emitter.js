
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
        listener.$once = function () {
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

    if (type == env.NULL) {
      this.listeners = { }
    }
    else {
      let { listeners } = this
      let list = listeners[ type ]
      if (list) {
        if (listener == env.NULL) {
          list.length = 0
        }
        else {
          array.remove(list, listener)
        }
        if (!list.length) {
          delete listeners[ type ]
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

    let { listeners } = this
    let list = listeners[ type ]
    if (list) {
      array.each(
        list,
        function (listener) {

          let result = execute(listener, context, data)

          let { $once } = listener
          if (is.func($once)) {
            $once()
            delete listener.$once
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

    return isComplete

  }

  has(type, listener) {

    let { listeners } = this
    let list = listeners[ type ]

    if (listener == env.NULL) {
      return !array.falsy(list)
    }
    else if (list) {
      return array.has(list, listener)
    }

  }

}
