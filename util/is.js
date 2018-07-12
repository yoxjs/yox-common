
import * as env from './env'

const { toString } = Object.prototype

export function is(value, type) {
  return type === 'numeric'
    ? numeric(value)
    // 这个函数比较慢，所以下面都不用它
    : toString.call(value).toLowerCase() === `[object ${type}]`
}

export function func(value) {
  return value && typeof value === env.RAW_FUNCTION
}

export function array(value) {
  return value && Array.isArray(value)
}

export function object(value) {
  // 低版本 IE 会把 null 和 undefined 当作 object
  return value && typeof value === 'object'
}

export function string(value) {
  return typeof value === 'string'
}

export function number(value) {
  return typeof value === 'number'
}

export function boolean(value) {
  return typeof value === 'boolean'
}

export function numeric(value) {
  return number(value) || (string(value) && !isNaN(parseFloat(value)) && isFinite(value))
}

export function primitive(value) {
  return string(value) || number (value) || boolean(value) || value == env.NULL
}
