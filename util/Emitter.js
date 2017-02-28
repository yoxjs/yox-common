
import execute from '../function/execute'

import * as is from './is'
import * as env from './env'
import * as char from './char'
import * as array from './array'
import * as object from './object'
import * as string from './string'

import Event from './Event'

export default class Emitter {

  constructor(options) {
    object.extend(this, options)
    this.listeners = { }
  }

  on(type, listener) {

    let { listeners, afterAdd } = this
    let added = [ ]

    let addListener = function (listener, type) {
      if (is.func(listener)) {
        let list = listeners[ type ] || (listeners[ type ] = [ ])
        if (!list.length) {
          array.push(added, type)
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

    if (added.length && is.func(afterAdd)) {
      afterAdd(added)
    }

  }

  once(type, listener) {

    let instance = this
    let addOnce = function (listener, type) {
      if (is.func(listener)) {
        listener.$once = function () {
          instance.off(type, listener)
          delete listener.$once
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

    let { listeners, afterRemove } = this
    let removed = [ ]

    if (type == env.NULL) {
      object.each(
        listeners,
        function (list, type) {
          if (is.array(listeners[ type ])) {
            listeners[ type ].length = 0
            array.push(removed, type)
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
        if (!list.length) {
          array.push(removed, type)
        }
      }
    }

    if (removed.length && is.func(afterRemove)) {
      afterRemove(removed)
    }

  }

  fire(type, data, context) {

    if (arguments.length === 2) {
      context = env.NULL
    }

    let done = env.TRUE

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

              let { $once } = listener
              if (is.func($once)) {
                $once()
              }

              // 如果没有返回 false，而是调用了 event.stop 也算是返回 false
              if (data instanceof Event) {
                if (result === env.FALSE) {
                  data.prevent()
                  data.stop()
                }
                else if (data.isStoped) {
                  result = env.FALSE
                }
              }

              if (result === env.FALSE) {
                return done = env.FALSE
              }
            }
          )
        }
      }
    )

    return done

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
        else if (string.has(key, char.CHAR_ASTERISK)) {
          key = key
            .replace(/\./g, '\\.')
            .replace(/\*\*/g, '([\.\\w]+?)')
            .replace(/\*/g, '(\\w+)')
          let match = type.match(
            new RegExp(`^${key}$`)
          )
          if (match) {
            return handler(
              list,
              array.toArray(match).slice(1)
            )
          }
        }
      }
    )
  }

}
