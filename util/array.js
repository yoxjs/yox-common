
import * as is from './is'
import * as env from './env'

import execute from '../function/execute'

/**
 * 遍历数组
 *
 * @param {Array} array
 * @param {Function} callback 返回 false 可停止遍历
 * @param {?boolean} reversed 是否逆序遍历
 */
export function each(array, callback, reversed) {
  let length = array[ env.RAW_LENGTH ]
  if (length) {
    if (reversed) {
      for (let i = length - 1; i >= 0; i--) {
        if (callback(array[ i ], i) === env.FALSE) {
          break
        }
      }
    }
    else {
      for (let i = 0; i < length; i++) {
        if (callback(array[ i ], i) === env.FALSE) {
          break
        }
      }
    }
  }
}

/**
 * 把数组合并成字符串
 *
 * @param {Array} array
 * @param {string} separator
 * @return {string}
 */
export function join(array, separator) {
  return array.join(separator)
}

function nativePush(array, item) {
  array[ array[ env.RAW_LENGTH ] ] = item
}

function nativeUnshift(array, item) {
  array.unshift(item)
}

/**
 * 添加
 *
 * @param {Array} array
 * @param {*} value
 * @param {Function} action
 */
function addItem(array, value, action) {
  if (is.array(value)) {
    each(
      value,
      function (item) {
        action(array, item)
      }
    )
  }
  else {
    action(array, value)
  }
}

/**
 * 往后加
 *
 * @param {Array} array
 * @param {*} item
 */
export function push(array, item) {
  addItem(array, item, nativePush)
}

/**
 * 往前加
 *
 * @param {Array} array
 * @param {*} item
 */
export function unshift(array, item) {
  addItem(array, item, nativeUnshift)
}

/**
 * 把类数组转成数组
 *
 * @param {Array|ArrayLike} array 类数组
 * @return {Array}
 */
export function toArray(array) {
  return is.array(array)
    ? array
    : execute([ ].slice, array)
}

/**
 * 把数组转成对象
 *
 * @param {Array} array 数组
 * @param {?string} key 数组项包含的字段名称，如果数组项是基本类型，可不传
 * @param {?*} value
 * @return {Object}
 */
export function toObject(array, key, value) {
  let result = { }, hasValue = arguments[ env.RAW_LENGTH ] === 3
  each(
    array,
    function (item, index) {
      result[ key ? item[ key ] : item ] = hasValue ? value : item
    }
  )
  return result
}

/**
 * 数组项在数组中的位置
 *
 * @param {Array} array 数组
 * @param {*} item 数组项
 * @param {?boolean} strict 是否全等判断，默认是全等
 * @return {number} 如果未找到，返回 -1
 */
export function indexOf(array, item, strict) {
  if (strict !== env.FALSE) {
    return array.indexOf(item)
  }
  else {
    for (let i = 0, len = array[ env.RAW_LENGTH ]; i < len; i++) {
      if (array[ i ] == item) {
        return i
      }
    }
    return -1
  }
}

/**
 * 数组是否包含 item
 *
 * @param {Array} array 数组
 * @param {*} item 可能包含的数组项
 * @param {?boolean} strict 是否全等判断，默认是全等
 * @return {boolean}
 */
export function has(array, item, strict) {
  return indexOf(array, item, strict) >= 0
}

/**
 * 获取数组最后一项
 *
 * @param {Array} array 数组
 * @return {*}
 */
export function last(array) {
  return array[ array[ env.RAW_LENGTH ] - 1 ]
}

/**
 * 弹出数组最后一项
 *
 * 项目里用的太多，仅用于节省字符...
 *
 * @param {Array} array 数组
 * @return {*}
 */
export function pop(array) {
  return array.pop()
}

/**
 * 删除数组项
 *
 * @param {Array} array 数组
 * @param {*} item 待删除项
 * @param {?boolean} strict 是否全等判断，默认是全等
 * @return {number} 删除的数量
 */
export function remove(array, item, strict) {
  let result = 0
  each(
    array,
    function (value, index) {
      if (strict === env.FALSE ? value == item : value === item) {
        array.splice(index, 1)
        result++
      }
    },
    env.TRUE
  )
  return result
}

/**
 * 用于判断长度大于 0 的数组
 *
 * @param {*} array
 * @return {boolean}
 */
export function falsy(array) {
  return !is.array(array) || array[ env.RAW_LENGTH ] === 0
}
