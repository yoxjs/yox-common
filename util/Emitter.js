
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

  constructor() {
    this.listeners = { }
  }

  fire(type, data, context) {

    let { name, space } = parseType(type)

    let isComplete = env.TRUE, listeners = this.listeners, list = listeners[ name ]
    if (list) {

      let event = is.array(data) ? data[ 0 ] : data,
      isEvent = Event.is(event),
      i = -1, item, result

      while (item = list[ ++i ]) {
        if (space && space !== item.space) {
          continue
        }

        result = execute(
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
          list.splice(i--, 1)
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

      if (!list.length) {
        delete listeners[ name ]
      }
    }

    return isComplete

  }

  has(type, listener) {

    let { name, space } = parseType(type), { listeners } = this, result = env.TRUE

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

      let instance = this

      if (type == env.NULL) {
        instance.listeners = { }
      }
      else {
        let { name, space } = parseType(type)
        let each = function (list, name) {
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
          if (!list.length) {
            delete listeners[ name ]
          }
        }

        let { listeners } = instance
        if (name) {
          let list = listeners[ name ]
          if (list) {
            each(list, name)
          }
        }
        else if (space) {
          object.each(listeners, each)
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
        let { name, space } = parseType(type)
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

function parseType(type) {
  let index = string.indexOf(type, char.CHAR_DOT)
  if (index >= 0) {
    return {
      name: string.slice(type, 0, index),
      space: string.slice(type, index + 1),
    }
  }
  else {
    return {
      name: type,
      space: char.CHAR_BLANK,
    }
  }
}
