import * as is from './is'
import * as env from './env'

/**
 * 连字符转成驼峰
 *
 * @param str
 * @return 驼峰格式的字符串
 */
export function camelCase(str: string): string {
  return has(str, '-')
    ? str.replace(
      /-([a-z])/gi,
      function ($0, $1) {
        return $1.toUpperCase()
      }
    )
    : str
}

/**
 * 清除两侧空白符
 *
 * @param str
 * @return 清除两侧空白符的字符串
 */
export function trim(str: any): string {
  return falsy(str)
    ? env.EMPTY_STRING
    : str.trim()
}

/**
 * 截取字符串
 *
 * @param str
 * @param start
 * @param end
 * @return
 */
export function slice(str: string, start: number, end?: number) {
  return is.number(end)
    ? start === end
      ? env.EMPTY_STRING
      : str.slice(start, end)
    : str.slice(start)
}

/**
 * 获取子串的起始位置
 *
 * @param str
 * @param part
 * @param start
 * @return
 */
export function indexOf(str: string, part: string, start = 0): number {
  return str.indexOf(part, start)
}

/**
 * 获取子串的起始位置
 *
 * @param str
 * @param part
 * @param end
 * @return
 */
export function lastIndexOf(str: string, part: string, end = str[env.RAW_LENGTH]): number {
  return str.lastIndexOf(part, end)
}

/**
 * str 是否包含 part
 *
 * @param str
 * @param part
 * @return 是否包含
 */
export function has(str: string, part: string): boolean {
  return indexOf(str, part) >= 0
}

/**
 * str 是否以 part 开头
 *
 * @param str
 * @param part
 * @return
 */
export function startsWith(str: string, part: string): boolean {
  return indexOf(str, part) === 0
}

/**
 * str 是否以 part 结束
 *
 * @param str
 * @param part
 * @return
 */
export function endsWith(str: string, part: string): boolean {
  let offset = str[env.RAW_LENGTH] - part[env.RAW_LENGTH]
  return offset >= 0 && lastIndexOf(str, part) === offset
}

/**
 * 获取某个位置的字符
 */
export function charAt(str: string, index?: number): string {
  return str.charAt(index || 0)
}

/**
 * 获取某个位置的字符编码
 */
export function codeAt(str: string, index?: number): number {
  return str.charCodeAt(index || 0)
}

/**
 * 判断长度大于 0 的字符串
 *
 * @param str
 * @return
 */
export function falsy(str: any): boolean {
  return !is.string(str) || !str[env.RAW_LENGTH]
}
