
import * as is from './is'
import * as env from './env'
import * as char from './char'
import * as array from './array'
import * as string from './string'

/**
 * 获取对象的 key 的数组
 *
 * @param {Object} object
 * @return {Array}
 */
export function keys(object) {
  return Object.keys(object)
}

function sortByAsc(a, b) {
  return a[ env.RAW_LENGTH ] - b[ env.RAW_LENGTH ]
}

function sortByDesc(a, b) {
  return b[ env.RAW_LENGTH ] - a[ env.RAW_LENGTH ]
}

/**
 * 排序对象的 key
 *
 * @param {Object} object
 * @param {Object} desc 是否逆序，默认从小到大排序
 * @return {Array.<string>}
 */
export function sort(object, desc) {
  return keys(object).sort(
    desc ? sortByDesc : sortByAsc
  )
}

/**
 * 遍历对象
 *
 * @param {Object} object
 * @param {Function} callback 返回 false 可停止遍历
 */
export function each(object, callback) {
  array.each(
    keys(object),
    function (key) {
      return callback(object[ key ], key)
    }
  )
}

/**
 * 对象是否包含某个 key
 *
 * @param {Object} object
 * @param {string} key
 * @return {boolean}
 */
export function has(object, key) {
  return object.hasOwnProperty(key)
}

/**
 * 本来想用 in，无奈关键字...
 *
 * @param {Object} object
 * @param {string} key
 * @return {boolean}
 */
export function exists(object, key) {
  return is.primitive(object)
    ? has(object, key)
    : (key in object)
}

/**
 * 清空对象所有的值
 *
 * @param {Object} object
 */
export function clear(object) {
  each(
    object,
    function (value, key) {
      delete object[ key ]
    }
  )
}

/**
 * 扩展对象
 *
 * @return {Object}
 */
export function extend(original, object1, object2, object3) {
  // 尽量不用 arguments
  // 提供三个扩展对象足够了吧...
  array.each(
    [ object1, object2, object3 ],
    function (object) {
      if (is.object(object)) {
        each(
          object,
          function (value, key) {
            original[ key ] = value
          }
        )
      }
    }
  )
  return original
}

/**
 * 拷贝对象
 *
 * @param {*} object
 * @param {?boolean} deep 是否需要深拷贝
 * @return {*}
 */
export function copy(object, deep) {
  let result = object
  if (is.array(object)) {
    if (deep) {
      result = [ ]
      array.each(
        object,
        function (item, index) {
          result[ index ] = copy(item, deep)
        }
      )
    }
    else {
      result = object.slice()
    }
  }
  else if (is.object(object)) {
    result = { }
    each(
      object,
      function (value, key) {
        result[ key ] = deep ? copy(value, deep) : value
      }
    )
  }
  return result
}

function eachKeypath(keypath, callback) {
  if (string.falsy(keypath)) {
    callback(keypath, env.TRUE)
  }
  else {
    let startIndex = 0, endIndex = 0
    while (env.TRUE) {
      endIndex = string.indexOf(keypath, env.KEYPATH_SEPARATOR, startIndex)
      if (endIndex > 0) {
        callback(string.slice(keypath, startIndex, endIndex))
        startIndex = endIndex + 1
      }
      else {
        callback(string.slice(keypath, startIndex), env.TRUE)
        break
      }
    }
  }
}

function getValue(object, key) {
  if (object != env.NULL) {
    let value = object[ key ]
    if (value != env.NULL) {
      if (is.object(value) && value.get) {
        value = value.get()
      }
      return {
        value,
      }
    }
  }
}

/**
 * 从对象中查找一个 keypath
 *
 * 返回值是对象时，表示找了值
 * 返回值是空时，表示没找到值
 *
 * @param {Object} object
 * @param {string|number} keypath
 * @return {?Object}
 */
export function get(object, keypath) {

  if (exists(object, keypath)) {
    return getValue(object, keypath)
  }

  eachKeypath(
    keypath,
    function (key, isLast) {
      object = getValue(object, key)
      if (!isLast) {
        if (object) {
          object = object.value
        }
        else {
          return env.FALSE
        }
      }
    }
  )

  return object

}

/**
 * 为对象设置一个键值对
 *
 * @param {Object} object
 * @param {string|number} keypath
 * @param {*} value
 * @param {?boolean} autofill 是否自动填充不存在的对象，默认自动填充
 */
export function set(object, keypath, value, autofill) {
  eachKeypath(
    keypath,
    function (key, isLast) {
      if (isLast) {
        object[ key ] = value
      }
      else {
        if (object[ key ]) {
          object = object[ key ]
        }
        else if (autofill !== env.FALSE) {
          object = object[ key ] = { }
        }
        else {
          return env.FALSE
        }
      }
    }
  )
}
