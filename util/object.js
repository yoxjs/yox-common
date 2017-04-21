
import * as is from './is'
import * as env from './env'
import * as char from './char'
import * as array from './array'
import * as string from './string'
import * as keypathUtil from './keypath'

/**
 * 获取对象的 key 的数组
 *
 * @param {Object} object
 * @return {Array}
 */
export function keys(object) {
  return Object.keys(object)
}

/**
 * 排序对象的 key
 *
 * @param {Object} object
 * @param {Object} desc 是否逆序，默认从小到大排序
 * @return {Array.<string>}
 */
export function sort(object, desc) {
  let sorter
  if (desc) {
    sorter = function (a, b) {
      return b.length - a.length
    }
  }
  else {
    sorter = function (a, b) {
      return a.length - b.length
    }
  }
  return keys(object).sort(sorter)
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
  return key in object
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
export function extend(original, object1, object2) {
  array.each(
    [ object1, object2 ],
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
    result = [ ]
    array.each(
      object,
      function (item, index) {
        result[ index ] = deep ? copy(item) : item
      }
    )
  }
  else if (is.object(object)) {
    result = { }
    each(
      object,
      function (value, key) {
        result[ key ] = deep ? copy(value) : value
      }
    )
  }
  return result
}


function getValue(value) {
  // 如果函数改写了 toString，就调用 toString() 求值
  if (is.func(value) && value.toString !== Function.prototype.toString) {
    value = value.toString()
  }
  return value
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

  if (!string.falsy(keypath)
    && !exists(object, keypath)
    // 不能以 . 开头
    && string.indexOf(keypath, char.CHAR_DOT) > 0
  ) {
    let list = keypathUtil.parse(keypath)
    for (let i = 0, len = list.length; i < len; i++) {
      if (i < len - 1) {
        object = getValue(object[ list[ i ] ])
        if (object == env.NULL) {
          return
        }
      }
      else {
        keypath = list[ i ]
      }
    }
  }

  if (exists(object, keypath)) {
    return {
      value: getValue(object[ keypath ])
    }
  }

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
  if (!string.falsy(keypath)
    && !exists(object, keypath)
    && string.indexOf(keypath, char.CHAR_DOT) > 0
  ) {
    let originalObject = object
    let list = keypathUtil.parse(keypath)
    let prop = array.pop(list)
    array.each(
      list,
      function (item, index) {
        if (object[ item ]) {
          object = object[ item ]
        }
        else if (autofill !== env.FALSE) {
          object = object[ item ] = { }
        }
        else {
          return object = env.FALSE
        }
      }
    )
    if (object && object !== originalObject) {
      object[ prop ] = value
    }
  }
  else {
    object[ keypath ] = value
  }
}
