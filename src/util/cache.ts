import createPureObject from '../function/createPureObject'

import * as constant from './constant'

/**
 * 缓存一个参数的函数调用结果
 *
 * @param fn 需要缓存的函数
 * @return 带缓存功能的函数
 */
export function createOneKeyCache(fn: (key: string) => any): (key: string) => any {

  const cache = createPureObject()

  return function (key: string) {

    const hit = cache.get(key)
    if (hit !== constant.UNDEFINED) {
      return hit
    }

    const value = fn(key)
    cache.set(key, value)

    return value

  }
}

/**
 * 缓存两个参数的函数调用结果
 *
 * @param fn 需要缓存的函数
 * @return 带缓存功能的函数
 */
export function createTwoKeyCache(fn: (key1: string, key2: string) => any): (key1: string, key2: string) => any {

  const cache = createPureObject()

  return function (key1: string, key2: string) {

    let hit1 = cache.get(key1)
    if (hit1) {
      const hit2 = hit1.get(key2)
      if (hit2) {
        return hit2
      }
    }
    else {
      hit1 = createPureObject()
      cache.set(key1, hit1)
    }

    const value = fn(key1, key2)
    hit1.set(key2, value)

    return value

  }
}