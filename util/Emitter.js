
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
    let handle = function (list, data) {
      if (is.array(list)) {
        array.each(
          list,
          function (listener) {
            let result = execute(listener, context, data)

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

    let { listeners } = this
    handle(listeners[ type ], data)

    // user.* 能响应 user.name
    // *.* 能响应 user.name
    // * 能响应 user.name
    //
    // ** 可以响应所有数据变化，是一个超级通配符的存在
    if (done) {
      object.each(
        listeners,
        function (list, key) {
          if (key !== type || string.has(key, char.CHAR_ASTERISK)) {
            key = [
              '^',
              key
                .replace(/\./g, '\\.')
                .replace(/\*\*/g, '([\.\\w]+?)')
                .replace(/\*/g, '(\\w+)'),
              string.endsWith(key, `${char.CHAR_ASTERISK}${char.CHAR_ASTERISK}`) ? char.CHAR_BLANK : '$'
            ]
            let match = type.match(
              new RegExp(key.join(char.CHAR_BLANK))
            )
            if (match) {
              handle(
                list,
                array.merge(data, array.toArray(match).slice(1))
              )
            }
            return done
          }
        }
      )
    }

    return done

  }

  has(type, listener) {
    let list = this.listeners[ type ]
    if (listener == env.NULL) {
      return !array.falsy(list)
    }
    return is.array(list)
      ? array.has(list, listener)
      : env.FALSE
  }
}
