import * as is from './is';
import * as env from './env';
import * as char from './char';
/**
 * 连字符转成驼峰
 *
 * @param str
 * @return 驼峰格式的字符串
 */
export function camelCase(str) {
    return has(str, char.CHAR_DASH)
        ? str.replace(/-([a-z])/gi, function ($0, $1) {
            return $1.toUpperCase();
        })
        : str;
}
/**
 * 清除两侧空白符
 *
 * @param str
 * @return 清除两侧空白符的字符串
 */
export function trim(str) {
    return falsy(str)
        ? char.CHAR_BLANK
        : str.trim();
}
/**
 * 截取字符串
 *
 * @param str
 * @param start
 * @param end
 * @return
 */
export function slice(str, start, end) {
    return is.number(end)
        ? str.slice(start, end)
        : str.slice(start);
}
/**
 * 获取子串的起始位置
 *
 * @param str
 * @param part
 * @param start
 * @return
 */
export function indexOf(str, part, start = 0) {
    return str.indexOf(part, start);
}
/**
 * 获取子串的起始位置
 *
 * @param str
 * @param part
 * @param end
 * @return
 */
export function lastIndexOf(str, part, end = str[env.RAW_LENGTH]) {
    return str.lastIndexOf(part, end);
}
/**
 * str 是否包含 part
 *
 * @param str
 * @param part
 * @return 是否包含
 */
export function has(str, part) {
    return indexOf(str, part) >= 0;
}
/**
 * str 是否以 part 开头
 *
 * @param str
 * @param part
 * @return
 */
export function startsWith(str, part) {
    return indexOf(str, part) === 0;
}
/**
 * str 是否以 part 结束
 *
 * @param str
 * @param part
 * @return
 */
export function endsWith(str, part) {
    let offset = str[env.RAW_LENGTH] - part[env.RAW_LENGTH];
    return offset >= 0 && lastIndexOf(str, part) === offset;
}
/**
 * 判断长度大于 0 的字符串
 *
 * @param str
 * @return
 */
export function falsy(str) {
    return !is.string(str) || !str[env.RAW_LENGTH];
}
