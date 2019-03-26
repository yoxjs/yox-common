import * as is from './is';
import * as env from './env';
import execute from '../function/execute';
/**
 * 遍历数组
 *
 * @param array
 * @param callback 返回 false 可停止遍历
 * @param reversed 是否逆序遍历
 */
export function each(array, callback, reversed = env.FALSE) {
    let length = array[env.RAW_LENGTH];
    if (length) {
        if (reversed) {
            for (let i = length - 1; i >= 0; i--) {
                if (callback(array[i], i, array) === env.FALSE) {
                    break;
                }
            }
        }
        else {
            for (let i = 0; i < length; i++) {
                if (callback(array[i], i, array) === env.FALSE) {
                    break;
                }
            }
        }
    }
}
/**
 * 把数组合并成字符串
 *
 * @param array
 * @param separator
 * @return
 */
export function join(array, separator) {
    return array.join(separator);
}
function nativeAppend(array, item) {
    array[array[env.RAW_LENGTH]] = item;
}
function nativePrepend(array, item) {
    array.unshift(item);
}
/**
 * 添加
 *
 * @param array
 * @param value
 * @param action
 */
function addItem(array, value, action) {
    if (is.array(value)) {
        each(value, function (item) {
            action(array, item);
        });
    }
    else {
        action(array, value);
    }
}
/**
 * 往后加
 *
 * @param array
 * @param target
 */
export function push(array, target) {
    addItem(array, target, nativeAppend);
}
/**
 * 往前加
 *
 * @param array
 * @param target
 */
export function unshift(array, target) {
    addItem(array, target, nativePrepend);
}
/**
 * 把类数组转成数组
 *
 * @param array 类数组
 * @return
 */
export function toArray(array) {
    return is.array(array)
        ? array
        : execute([].slice, array);
}
/**
 * 把数组转成对象
 *
 * @param array 数组
 * @param {?string} key 数组项包含的字段名称，如果数组项是基本类型，可不传
 * @param {?*} value
 * @return {Object}
 */
export function toObject(array, key, value) {
    let result = {}, hasValue = arguments[env.RAW_LENGTH] === 3;
    each(array, function (item) {
        result[key ? item[key] : item] = hasValue ? value : item;
    });
    return result;
}
/**
 * 数组项在数组中的位置
 *
 * @param array 数组
 * @param target 数组项
 * @param strict 是否全等判断，默认是全等
 * @return 如果未找到，返回 -1
 */
export function indexOf(array, target, strict = env.TRUE) {
    let result = -1;
    each(array, function (item, index) {
        if (strict === env.FALSE ? item == target : item === target) {
            result = index;
            return env.FALSE;
        }
    });
    return result;
}
/**
 * 数组是否包含 item
 *
 * @param array 数组
 * @param target 可能包含的数组项
 * @param strict 是否全等判断，默认是全等
 * @return
 */
export function has(array, target, strict = env.TRUE) {
    return indexOf(array, target, strict) >= 0;
}
/**
 * 获取数组最后一项
 *
 * @param array 数组
 * @return
 */
export function last(array) {
    let length = array[env.RAW_LENGTH];
    if (length > 0) {
        return array[length - 1];
    }
}
/**
 * 弹出数组最后一项
 *
 * 项目里用的太多，仅用于节省字符...
 *
 * @param array 数组
 * @return 弹出的数组项
 */
export function pop(array) {
    return array.pop();
}
/**
 * 删除数组项
 *
 * @param array 数组
 * @param item 待删除项
 * @param strict 是否全等判断，默认是全等
 * @return 删除的数量
 */
export function remove(array, target, strict = env.TRUE) {
    let result = 0;
    each(array, function (item, index) {
        if (strict === env.FALSE ? item == target : item === target) {
            array.splice(index, 1);
            result++;
        }
    }, env.TRUE);
    return result;
}
/**
 * 用于判断长度大于 0 的数组
 *
 * @param array
 * @return
 */
export function falsy(array) {
    return !is.array(array) || !array[env.RAW_LENGTH];
}
