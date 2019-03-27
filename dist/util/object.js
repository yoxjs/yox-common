import * as is from './is';
import * as env from './env';
import * as array from './array';
import * as keypathUtil from './keypath';
/**
 * 获取对象的 key 的数组
 *
 * @param object
 * @return
 */
export function keys(object) {
    return Object.keys(object);
}
function sortKeyByAsc(a, b) {
    return a[env.RAW_LENGTH] - b[env.RAW_LENGTH];
}
function sortKeyByDesc(a, b) {
    return b[env.RAW_LENGTH] - a[env.RAW_LENGTH];
}
/**
 * 排序对象的 key
 *
 * @param object
 * @param desc 是否逆序，默认从小到大排序
 * @return
 */
export function sort(object, desc = env.FALSE) {
    return keys(object).sort(desc ? sortKeyByDesc : sortKeyByAsc);
}
/**
 * 遍历对象
 *
 * @param object
 * @param callback 返回 false 可停止遍历
 */
export function each(object, callback) {
    array.each(keys(object), function (key) {
        return callback(object[key], key);
    });
}
/**
 * 对象是否包含某个 key
 *
 * @param object
 * @param key
 * @return
 */
export function has(object, key) {
    return object.hasOwnProperty(key);
}
/**
 * 清空对象所有的键值对
 *
 * @param object
 */
export function clear(object) {
    each(object, function (_, key) {
        delete object[key];
    });
}
/**
 * 扩展对象
 *
 * @return
 */
export function extend(original, ...objects) {
    array.each(objects, function (object) {
        each(object, function (value, key) {
            original[key] = value;
        });
    });
    return original;
}
/**
 * 拷贝对象
 *
 * @param object
 * @param deep 是否需要深拷贝
 * @return
 */
export function copy(object, deep = env.FALSE) {
    let result = object;
    if (is.array(object)) {
        if (deep) {
            result = [];
            array.each(object, function (item, index) {
                result[index] = copy(item, deep);
            });
        }
        else {
            result = object.slice();
        }
    }
    else if (is.object(object)) {
        result = {};
        each(object, function (value, key) {
            result[key] = deep ? copy(value, deep) : value;
        });
    }
    return result;
}
/**
 * 辅助 get 函数，持有最后找到的值
 */
export const holder = { value: 0 };
function getValue(object, key) {
    // 支持原型获取，如 {}.toString
    if (is.object(object) && key in object) {
        let value = object[key];
        if (value && is.func(value.get)) {
            value = value.get();
        }
        holder.value = value;
        return value;
    }
    // 基本类型
    else if (object != env.NULL && has(object, key)) {
        holder.value = object[key];
        return holder;
    }
}
/**
 * 从对象中查找一个 keypath
 *
 * 返回值是空时，表示没找到值
 *
 * @param object
 * @param keypath
 * @return
 */
export function get(object, keypath) {
    /**
     * 考虑以下情况:
     *
     * {
     *   'a.b.c.d': 1,
     *   'a.b.c': {
     *      d: 2
     *   }
     * }
     *
     * 此时 keypath 是 `a.b.c.d`，可以获取到 1
     * 如果没有这个 key，按 keypath 推进是取不到值的，因为没有 a.b.c 对象
     * 个人觉得没有必要支持字面量，情况实在太多，会把这个函数搞的性能很差
     */
    keypathUtil.each(keypath, function (key, isLast) {
        object = getValue(object, key);
        if (!isLast) {
            if (object === holder) {
                object = holder.value;
            }
            else {
                return env.FALSE;
            }
        }
    });
    return object;
}
/**
 * 为对象设置一个键值对
 *
 * @param object
 * @param keypath
 * @param value
 * @param autofill 是否自动填充不存在的对象，默认自动填充
 */
export function set(object, keypath, value, autofill = env.FALSE) {
    keypathUtil.each(keypath, function (key, isLast) {
        if (isLast) {
            object[key] = value;
        }
        else if (object[key]) {
            object = object[key];
        }
        else if (autofill) {
            object = object[key] = {};
        }
        else {
            return env.FALSE;
        }
    });
}
//# sourceMappingURL=object.js.map