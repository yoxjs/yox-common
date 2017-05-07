
import execute from '../function/execute'

import * as is from './is'
import * as env from './env'
import * as array from './array'
import * as object from './object'

import Event from './Event'

export default class Emitter {

  constructor() {
    this.listeners = { }
  }

  on(type, listener) {

    let { listeners } = this, hasNew

    let addListener = function (listener, type) {
      if (is.func(listener)) {
        let list = listeners[ type ]
        if (!list) {
          list = listeners[ type ] = [ ]
          hasNew = env.TRUE
        }
        array.push(list, listener)
      }
    }

    if (is.object(type)) {
      object.each(type, addListener)
    }
    else if (is.string(type)) {
      addListener(listener, type)
    }

    return hasNew

  }

  once(type, listener) {

    let instance = this
    let addOnce = function (listener, type) {
      if (is.func(listener)) {
        let { $magic } = listener
        listener.$magic = function () {
          execute($magic)
          instance.off(type, listener)
          if ($magic) {
            listener.$magic = $magic
          }
          else {
            delete listener.$magic
          }
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

    let instance = this
    let { listeners } = instance
    let keys = object.keys(listeners)

    if (type == env.NULL) {
      listeners = instance.listeners = { }
    }
    else {
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

    return keys.length === object.keys(listeners).length

  }

  fire(type, data, context) {

    let isComplete = env.TRUE

    let list = this.listeners[ type ]
    if (list) {

      let event = data
      if (is.array(data)) {
        event = data[ 0 ]
      }

      let isEvent = Event.is(event)

      array.each(
        list,
        function (listener) {

          let result = execute(listener, context, data)

          execute(listener.$magic)

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

    let list = this.listeners[ type ]
    if (listener == env.NULL) {
      return !array.falsy(list)
    }
    else if (list) {
      return array.has(list, listener)
    }

  }

}
