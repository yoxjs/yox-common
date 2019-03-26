export default class Emitter {
    /**
     * 是否开启命名空间
     */
    namespace: boolean;
    /**
     * 已注册的事件监听
     */
    listeners: Object;
    constructor(namespace: boolean);
    /**
     * 发射事件
     *
     * @param type 事件名称
     * @param data 事件数据
     * @param context 执行事件处理函数的 context
     */
    fire(type: string, data: Object, context?: any): boolean;
    /**
     * 是否已监听某个事件
     *
     * @param type
     * @param listener
     */
    has(type: string, listener: any): boolean;
    /**
     * 注册监听
     *
     * @param type
     * @param listener
     * @param data
     */
    on(type: any, listener: any, data?: Object): void;
    /**
     * 注册一次监听
     *
     * @param type
     * @param listener
     */
    once(type: any, listener: any): void;
    /**
     * 取消监听
     *
     * @param type
     * @param listener
     */
    off(type: string, listener: any): void;
    /**
     * 把事件类型解析成命名空间格式
     *
     * @param type
     */
    private parse;
    private matchListener;
    private matchSpace;
}
