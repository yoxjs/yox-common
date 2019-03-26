export default class Event {
    type: string;
    originalEvent?: any;
    isPrevented: boolean;
    isStoped: boolean;
    listener?: Function;
    /**
     * target 是否是 Event 实例
     */
    static is(target: any): boolean;
    /**
     * 构造函数
     *
     * 可以传事件名称，也可以传原生事件对象
     */
    constructor(event: any);
    /**
     * 阻止事件的默认行为
     */
    prevent(): this;
    /**
     * 停止事件广播
     */
    stop(): this;
}
