import isDef from '../function/isDef';
import execute from '../function/execute';
import * as is from './is';
import * as env from './env';
import * as char from './char';
import * as array from './array';
import * as object from './object';
import * as string from './string';
import Event from './Event';
const RAW_NAME = env.RAW_NAME;
const RAW_SPACE = 'space';
export default class Emitter {
    constructor(namespace) {
        this.namespace = namespace;
        this.listeners = {};
    }
    /**
     * 发射事件
     *
     * @param type 事件名称
     * @param data 事件数据
     * @param context 执行事件处理函数的 context
     */
    fire(type, data, context) {
        let instance = this, target = instance.parse(type), name = target[RAW_NAME], space = target[RAW_SPACE], list = instance.listeners[name], isComplete = env.TRUE;
        if (list) {
            let event = is.array(data) ? data[0] : data, isEvent = Event.is(event);
            array.each(object.copy(list), function (item, _, list) {
                // 在 fire 过程中被移除了
                if (!array.has(list, item)
                    // 命名空间不匹配
                    || !instance.matchSpace(space, item)) {
                    return;
                }
                // 为 event 对象加上当前正在处理的 listener
                // 这样方便业务层移除事件绑定
                // 比如 on('xx', function) 这样定义了匿名 listener
                // 在这个 listener 里面获取不到当前 listener 的引用
                // 为了能引用到，有时候会先定义 var listener = function,
                // 然后再 on('xx', listener) 这样其实是没有必要的
                if (isEvent) {
                    event.listener = item.func;
                }
                let result = execute(item.func, isDef(context) ? context : item.context, data);
                // 执行次数
                item.count = item.count > 0 ? (item.count + 1) : 1;
                // 注册的 listener 可以指定最大执行次数
                if (item.count === item.max) {
                    instance.off(type, item);
                }
                // 如果没有返回 false，而是调用了 event.stop 也算是返回 false
                if (isEvent) {
                    if (result === env.FALSE) {
                        event.prevent().stop();
                    }
                    else if (event.isStoped) {
                        result = env.FALSE;
                    }
                }
                if (result === env.FALSE) {
                    return isComplete = env.FALSE;
                }
            });
        }
        return isComplete;
    }
    /**
     * 是否已监听某个事件
     *
     * @param type
     * @param listener
     */
    has(type, listener) {
        let instance = this, listeners = instance.listeners, target = instance.parse(type), name = target[RAW_NAME], space = target[RAW_SPACE], result = env.TRUE, matchListener = instance.matchListener(listener), each = function (list) {
            array.each(list, function (item) {
                if (matchListener(item) && instance.matchSpace(space, item)) {
                    return result = env.FALSE;
                }
            });
            return result;
        };
        if (name) {
            if (listeners[name]) {
                each(listeners[name]);
            }
        }
        else if (space) {
            object.each(listeners, each);
        }
        return !result;
    }
    /**
     * 注册监听
     *
     * @param type
     * @param listener
     * @param data
     */
    on(type, listener, data) {
        let instance = this, listeners = instance.listeners, addListener = function (item, type) {
            if (is.func(item)) {
                item = { func: item };
            }
            if (is.object(item) && is.func(item.func)) {
                if (data) {
                    object.extend(item, data);
                }
                let target = instance.parse(type);
                item[RAW_SPACE] = target[RAW_SPACE];
                array.push(listeners[target[RAW_NAME]] || (listeners[target[RAW_NAME]] = []), item);
            }
        };
        if (is.object(type)) {
            object.each(type, addListener);
        }
        else if (is.string(type)) {
            addListener(listener, type);
        }
    }
    /**
     * 注册一次监听
     *
     * @param type
     * @param listener
     */
    once(type, listener) {
        this.on(type, listener, { max: 1 });
    }
    /**
     * 取消监听
     *
     * @param type
     * @param listener
     */
    off(type, listener) {
        let instance = this, listeners = instance.listeners;
        if (type) {
            let target = instance.parse(type), name = target[RAW_NAME], space = target[RAW_SPACE], matchListener = instance.matchListener(listener), each = function (list, name) {
                array.each(list, function (item, index, array) {
                    if (matchListener(item) && instance.matchSpace(space, item)) {
                        array.splice(index, 1);
                    }
                }, env.TRUE);
                if (!list[env.RAW_LENGTH]) {
                    delete listeners[name];
                }
            };
            if (name) {
                if (listeners[name]) {
                    each(listeners[name], name);
                }
            }
            else if (space) {
                object.each(listeners, each);
            }
        }
        else {
            // 清空
            instance.listeners = {};
        }
    }
    /**
     * 把事件类型解析成命名空间格式
     *
     * @param type
     */
    parse(type) {
        let result = {};
        result[RAW_NAME] = type;
        result[RAW_SPACE] = char.CHAR_BLANK;
        if (this.namespace) {
            let index = string.indexOf(type, char.CHAR_DOT);
            if (index >= 0) {
                result[RAW_NAME] = string.slice(type, 0, index);
                result[RAW_SPACE] = string.slice(type, index + 1);
            }
        }
        return result;
    }
    matchListener(listener) {
        return is.object(listener)
            ? function (item) {
                return listener === item;
            }
            : function (item) {
                return !listener || listener === item.func;
            };
    }
    matchSpace(space, item) {
        return !space || space === item[RAW_SPACE];
    }
}
