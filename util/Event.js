import * as is from './is';
import * as env from './env';
export default class Event {
    /**
     * target 是否是 Event 实例
     */
    static is(target) {
        return target instanceof Event;
    }
    /**
     * 构造函数
     *
     * 可以传事件名称，也可以传原生事件对象
     */
    constructor(event) {
        let instance = this;
        if (is.string(event)) {
            instance.type = event;
        }
        else {
            instance.type = event.type;
            instance.originalEvent = event;
        }
    }
    /**
     * 阻止事件的默认行为
     */
    prevent() {
        let instance = this;
        if (!instance.isPrevented) {
            let { originalEvent } = instance;
            if (originalEvent) {
                if (is.func(originalEvent.prevent)) {
                    originalEvent.prevent();
                }
                else if (is.func(originalEvent.preventDefault)) {
                    originalEvent.preventDefault();
                }
            }
            instance.isPrevented = env.TRUE;
        }
        return instance;
    }
    /**
     * 停止事件广播
     */
    stop() {
        let instance = this;
        if (!instance.isStoped) {
            let { originalEvent } = instance;
            if (originalEvent) {
                if (is.func(originalEvent.stop)) {
                    originalEvent.stop();
                }
                else if (is.func(originalEvent.stopPropagation)) {
                    originalEvent.stopPropagation();
                }
            }
            instance.isStoped = env.TRUE;
        }
        return instance;
    }
}
