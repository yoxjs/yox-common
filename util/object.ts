import * as is from './is'
import * as env from './env'
import * as array from './array'
import * as keypathUtil from './keypath'

/**
 * 获取对象的 key 的数组
 *
 * @param object
 * @return
 */
export function keys(object: Object): string[] {
  return Object.keys(object)
}

function sortKeyByAsc(a: string, b: string): number {
  return a[env.RAW_LENGTH] - b[env.RAW_LENGTH]
}

function sortKeyByDesc(a: string, b: string): number {
  return b[env.RAW_LENGTH] - a[env.RAW_LENGTH]
}

/**
 * 排序对象的 key
 *
 * @param object
 * @param desc 是否逆序，默认从小到大排序
 * @return
 */
export function sort(object: Object, desc = env.FALSE): string[] {
  return keys(object).sort(
    desc ? sortKeyByDesc : sortKeyByAsc
  )
}

/**
 * 遍历对象
 *
 * @param object
 * @param callback 返回 false 可停止遍历
 */
export function each(object: Object, callback: (value: any, key: string) => boolean | void) {
  for (let key in object) {
    if (callback(object[key], key) === env.FALSE) {
      break
    }
  }
}

/**
 * 对象是否包含某个 key
 *
 * @param object
 * @param key
 * @return
 */
export function has(object: Object, key: string | number): boolean {
  return object.hasOwnProperty(key)
}

/**
 * 清空对象所有的键值对
 *
 * @param object
 */
export function clear(object: Object) {
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
export function extend(original: Object, ...objects: Object[]) {
  array.each(
    objects,
    function (object) {
      each(
        object,
        function (value, key) {
          original[key] = value
        }
      )
    }
  )
  return original
}

/**
 * 拷贝对象
 *
 * @param object
 * @param deep 是否需要深拷贝
 * @return
 */
export function copy(object: any, deep = env.FALSE): any {
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
 * 辅助 get 函数，持有最后找到的值，避免频繁的创建临时对象
 */
const valueHolder = { }

/**
 * 从对象中查找一个 keypath
 *
 * 返回值是空时，表示没找到值
 *
 * @param object
 * @param keypath
 * @return
 */
export function get(object: any, keypath: string | number): any {

  /**
   * 考虑以下情况:
   *
   * {
   *   'a.b.c.d': 1,
   *   'a.b.c': {
   *      d: 2
   *   }
   * }
   *
   * 此时 keypath 是 `a.b.c.d`，可以获取到 1
   * 如果没有这个 key，按 keypath 推进是取不到值的，因为没有 a.b.c 对象
   * 个人觉得没有必要支持字面量，情况实在太多，会把这个函数搞的性能很差
   */

  keypathUtil.each(
    keypath,
    function (key, isLast) {

      // 支持原型获取，如 {}.toString
      // 原型上的属性或方法无法通过 has 方法判断，因此用 in 操作符
      if (is.object(object) && key in object) {
        let value = object[key]
        if (value && is.func(value.get)) {
          value = value.get()
        }
        valueHolder[env.RAW_VALUE] = value
      }
      // 基本类型，如获取 ''.length 等
      else if (object != env.NULL && has(object, key)) {
        valueHolder[env.RAW_VALUE] = object[key]
      }
      else {
        object = env.UNDEFINED
        return env.FALSE
      }

      object = isLast ? valueHolder : valueHolder[env.RAW_VALUE]

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
export function set(object: Object, keypath: string | number, value: any, autofill = env.FALSE) {
  keypathUtil.each(
    keypath,
    function (key, isLast) {
      if (isLast) {
        object[key] = value
      }
      else if (object[key]) {
        object = object[key]
      }
      else if (autofill) {
        object = object[key] = {}
      }
      else {
        return env.FALSE
      }
    }
  )
}
