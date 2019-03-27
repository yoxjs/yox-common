import execute from './execute';
import * as env from '../util/env';
import * as array from '../util/array';
/**
 * 节流调用
 *
 * @param fn 需要节制调用的函数
 * @param delay 调用的时间间隔，单位毫秒
 * @param sync 是否立即触发
 * @return 节流函数
 */
export default function (fn, delay, sync = env.FALSE) {
    let timer;
    return function () {
        if (!timer) {
            let args = array.toArray(arguments);
            if (sync) {
                execute(fn, env.NULL, args);
            }
            timer = setTimeout(function () {
                timer = 0;
                if (!sync) {
                    execute(fn, env.NULL, args);
                }
            }, delay);
        }
    };
}
//# sourceMappingURL=debounce.js.map