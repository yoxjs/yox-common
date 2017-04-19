
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
  let { length } = array
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
 * 合并多个数组，不去重
 *
 * @return {Array}
 */
export function merge() {
  let args = toArray(arguments)
  let result = [ ]
  args.unshift(result)
  execute(push, env.NULL, args)
  return result
}

function add(action) {
  return function (original) {
    let args = arguments
    for (let i = 1, len = args.length; i < len; i++) {
      if (is.array(args[ i ])) {
        each(
          args[ i ],
          function (item) {
            original[ action ](item)
          }
        )
      }
      else {
        original[ action ](args[ i ])
      }
    }
  }
}

/**
 * push 数组
 *
 * @param {Array} original
 * @param {...}
 */
export let push = add('push')

/**
 * unshift 数组
 *
 * @param {Array} original
 * @param {...}
 */
export let unshift = add('unshift')

/**
 * 把类数组转成数组
 *
 * @param {Array|ArrayLike} array 类数组
 * @return {Array}
 */
export function toArray(array) {
  return is.array(array)
    ? array
    : execute(Array.prototype.slice, array)
}

/**
 * 把数组转成对象
 *
 * [ { key: 'key1', value: 'value1' }, { key: 'key2', value: 'value2' } ]
 * 可转成
 * { key1: value1, key2: value2 }
 *
 * @param {Array} array 数组
 * @param {?string} key 数组项包含的字段名称，如果数组项是基本类型，可不传
 * @param {?string} value 数组项包含的字段名称或值
 * @return {Object}
 */
export function toObject(array, key, value) {
  let result = { }, hasValue = arguments.length === 3
  each(
    array,
    function (item, index) {
      if (is.string(value)) {
        index = item[ value ]
      }
      else {
        index = hasValue ? value : item
      }
      result[ key ? item[ key ] : item ] = index
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
    for (let i = 0, len = array.length; i < len; i++) {
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
  return array[ array.length - 1 ]
}

/**
 * 弹出数组最后一项
 *
 * 项目里用的太多，节省点字符...
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
 * @return {boolean} 是否删除成功
 */
export function remove(array, item, strict) {
  let index = indexOf(array, item, strict)
  if (index >= 0) {
    array.splice(index, 1)
    return env.TRUE
  }
  return env.FALSE
}

/**
 * 用于判断长度大于 0 的数组
 *
 * @param {*} array
 * @return {boolean}
 */
export function falsy(array) {
  return !is.array(array) || array.length === 0
}
