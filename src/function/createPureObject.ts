import {
  PureObject,
} from 'yox-type/src/type'

import isNative from './isNative'

import * as constant from '../util/constant'

let createPureObject = function (): PureObject {
  const obj = Object.create(constant.NULL)
  return {
    get(key: string): any {
      return obj[key]
    },
    set(key: string, value: any) {
      obj[key] = value
    },
    keys(): string[] {
      return Object.keys(obj)
    }
  }
}

// IE9+ 都已实现 Object.create
if (process.env.NODE_LEGACY) {
  if (!isNative(Object.create)) {
    createPureObject = function (): PureObject {
      const obj = {}
      return {
        get(key: string): any {
          return obj.hasOwnProperty(key)
            ? obj[key]
            : constant.UNDEFINED
        },
        set(key: string, value: any) {
          obj[key] = value
        },
        keys(): string[] {
          return Object.keys(obj)
        }
      }
    }
  }
}

/**
 * 创建纯净对象
 * 
 * @return 纯净对象
 */
export default createPureObject