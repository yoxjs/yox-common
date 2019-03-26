import * as env from './env'

/**
 * Check if value is a function.
 *
 * @param value
 * @return {boolean}
 */
export function func(value: any): boolean {
  return typeof value === env.RAW_FUNCTION
}

/**
 * Check if value is an array.
 *
 * @param value
 * @return {boolean}
 */
export function array(value: any): boolean {
  return Array.isArray(value)
}

/**
 * Check if value is an object.
 *
 * @param value
 * @return {boolean}
 */
export function object(value: any): boolean {
  // 低版本 IE 会把 null 和 undefined 当作 object
  return value !== env.NULL && typeof value === 'object'
}

/**
 * Check if value is a string.
 *
 * @param value
 * @return {boolean}
 */
export function string(value: any): boolean {
  return typeof value === 'string'
}

/**
 * Check if value is a number.
 *
 * @param value
 * @return {boolean}
 */
export function number(value: any): boolean {
  return typeof value === 'number'
}

/**
 * Check if value is boolean.
 *
 * @param value
 * @return {boolean}
 */
export function boolean(value: any): boolean {
  return typeof value === 'boolean'
}

/**
 * Check if value is numeric.
 *
 * @param value
 * @return {boolean}
 */
export function numeric(value: any): boolean {
  return number(value)
    || (string(value) && !isNaN(parseFloat(value)) && isFinite(value))
}

/**
 * Check if value is primitive.
 *
 * @param value
 * @return {boolean}
 */
export function primitive(value: any): boolean {
  return string(value)
    || number(value)
    || boolean(value)
    || value == env.NULL
}
