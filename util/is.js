
import * as env from './env'

export function is(value, type) {
  return type === 'numeric'
    ? numeric(value)
    : Object.prototype.toString.call(value).toLowerCase() === `[object ${type}]`
}

export function func(value) {
  return is(value, env.RAW_FUNCTION)
}

export function array(value) {
  return is(value, 'array')
}

export function object(value) {
  // 低版本 IE 会把 null 和 undefined 当作 object
  return value && is(value, 'object')
}

export function string(value) {
  return is(value, 'string')
}

export function number(value) {
  return is(value, 'number')
}

export function boolean(value) {
  return is(value, 'boolean')
}

export function numeric(value) {
  return !isNaN(parseFloat(value)) && isFinite(value)
}

export function primitive(value) {
  return string(value) || number (value) || boolean(value) || value == env.NULL
}
