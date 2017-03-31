
import * as env from './env'

export function is(arg, type) {
  return type === 'numeric'
    ? numeric(arg)
    : Object.prototype.toString.call(arg).toLowerCase() === `[object ${type}]`
}

export function func(arg) {
  return is(arg, 'function')
}

export function array(arg) {
  return is(arg, 'array')
}

export function object(arg) {
  // 低版本 IE 会把 null 和 undefined 当作 object
  return arg && is(arg, 'object') ? env.TRUE : env.FALSE
}

export function string(arg) {
  return is(arg, 'string')
}

export function number(arg) {
  return is(arg, 'number')
}

export function boolean(arg) {
  return is(arg, 'boolean')
}

export function primitive(arg) {
  return string(arg) || number (arg) || boolean(arg) || arg == env.NULL
}

export function numeric(arg) {
  return !isNaN(parseFloat(arg)) && isFinite(arg)
}
