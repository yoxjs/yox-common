import * as constant from './constant'

/**
 * Check if value is a function.
 *
 * @param value
 * @return
 */
export function func(value: any): boolean {
  return typeof value === constant.RAW_FUNCTION
}

/**
 * Check if value is an array.
 *
 * @param value
 * @return
 */
export function array(value: any): boolean {
  return Array.isArray(value)
}

/**
 * Check if value is an object.
 *
 * @param value
 * @return
 */
export function object(value: any): boolean {
  // 低版本 IE 会把 null 当作 object
  return value !== constant.NULL && typeof value === 'object'
}

/**
 * Check if value is a string.
 *
 * @param value
 * @return
 */
export function string(value: any): boolean {
  return typeof value === 'string'
}

/**
 * Check if value is a number.
 *
 * @param value
 * @return
 */
export function number(value: any): boolean {
  return typeof value === 'number' && !isNaN(value)
}

/**
 * Check if value is boolean.
 *
 * @param value
 * @return
 */
export function boolean(value: any): boolean {
  return typeof value === 'boolean'
}

/**
 * Check if value is numeric.
 *
 * @param value
 * @return
 */
export function numeric(value: any): boolean {
  return number(value)
    || (string(value) && !isNaN(parseFloat(value)) && isFinite(value))
}
