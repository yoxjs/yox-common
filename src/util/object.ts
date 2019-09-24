import {
  Data,
  ValueHolder,
} from 'yox-type/src/type'

import * as is from './is'
import * as array from './array'
import * as constant from './constant'
import * as keypathUtil from './keypath'

import holder from './holder'

/**
 * 获取对象的 key 的数组
 *
 * @param object
 * @return
 */
export function keys(object: Data): string[] {
  return Object.keys(object)
}

/**
 * 遍历对象
 *
 * @param object
 * @param callback 返回 false 可停止遍历
 */
export function each(object: Data, callback: (value: any, key: string) => boolean | void): void {
  for (let key in object) {
    if (callback(object[key], key) === constant.FALSE) {
      break
    }
  }
}

/**
 * 清空对象所有的键值对
 *
 * @param object
 */
export function clear(object: Data): void {
  each(
    object,
    function (_, key) {
      delete object[key]
    }
  )
}

/**
 * 扩展对象
 *
 * @return
 */
export function extend(original: Data, object: Data): Data {
  each(
    object,
    function (value, key) {
      original[key] = value
    }
  )
  return original
}

/**
 * 合并对象
 *
 * @return
 */
export function merge(object1: Data | void, object2: Data | void): Data | void {
  return object1 && object2
    ? extend(extend({}, object1), object2)
    : object1 || object2
}

/**
 * 拷贝对象
 *
 * @param object
 * @param deep 是否需要深拷贝
 * @return
 */
export function copy(object: any, deep?: boolean): any {
  let result = object
  if (is.array(object)) {
    if (deep) {
      result = []
      array.each(
        object,
        function (item, index) {
          result[index] = copy(item, deep)
        }
      )
    }
    else {
      result = object.slice()
    }
  }
  else if (is.object(object)) {
    result = {}
    each(
      object,
      function (value, key) {
        result[key] = deep ? copy(value, deep) : value
      }
    )
  }
  return result
}

/**
 * 从对象中查找一个 keypath
 *
 * 返回值是空时，表示没找到值
 *
 * @param object
 * @param keypath
 * @return
 */
export function get(object: any, keypath: string): ValueHolder | undefined {

  keypathUtil.each(
    keypath,
    function (key, index, lastIndex) {

      if (object != constant.NULL) {

        // 先直接取值
        let value = object[key],

        // 紧接着判断值是否存在
        // 下面会处理计算属性的值，不能在它后面设置 hasValue
        hasValue = value !== constant.UNDEFINED

        // 如果是计算属性，取计算属性的值
        if (value && is.func(value.get)) {
          value = value.get()
        }

        if (index === lastIndex) {
          if (hasValue) {
            holder.value = value
            object = holder
          }
          else {
            object = constant.UNDEFINED
          }
        }
        else {
          object = value
        }
      }
      else {
        object = constant.UNDEFINED
        return constant.FALSE
      }

    }
  )

  return object

}

/**
 * 为对象设置一个键值对
 *
 * @param object
 * @param keypath
 * @param value
 * @param autofill 是否自动填充不存在的对象，默认自动填充
 */
export function set(object: Data, keypath: string, value: any, autofill?: boolean): void {
  keypathUtil.each(
    keypath,
    function (key, index, lastIndex) {
      if (index === lastIndex) {
        object[key] = value
      }
      else if (object[key]) {
        object = object[key]
      }
      else if (autofill) {
        object = object[key] = {}
      }
      else {
        return constant.FALSE
      }
    }
  )
}

/**
 * 对象是否包含某个 key
 *
 * @param object
 * @param key
 * @return
 */
export function has(object: Data, key: string | number): boolean {
  // 不用 hasOwnProperty，性能差
  return object[key] !== constant.UNDEFINED
}

/**
 * 是否是空对象
 *
 * @param object
 * @return
 */
export function falsy(object: any): boolean {
  return !is.object(object)
    || is.array(object)
    || !keys(object).length
}