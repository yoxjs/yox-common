/**
 * 获取对象的 key 的数组
 *
 * @param object
 * @return
 */
export declare function keys(object: Object): string[];
/**
 * 排序对象的 key
 *
 * @param object
 * @param desc 是否逆序，默认从小到大排序
 * @return
 */
export declare function sort(object: Object, desc?: boolean): string[];
/**
 * 遍历对象
 *
 * @param object
 * @param callback 返回 false 可停止遍历
 */
export declare function each(object: Object, callback: (value: any, key: string) => boolean | void): void;
/**
 * 对象是否包含某个 key
 *
 * @param object
 * @param key
 * @return
 */
export declare function has(object: Object, key: string | number): boolean;
/**
 * 清空对象所有的键值对
 *
 * @param object
 */
export declare function clear(object: Object): void;
/**
 * 扩展对象
 *
 * @return
 */
export declare function extend(original: Object, ...objects: Object[]): Object;
/**
 * 拷贝对象
 *
 * @param object
 * @param deep 是否需要深拷贝
 * @return
 */
export declare function copy(object: any, deep?: boolean): any;
/**
 * 辅助 get 函数，持有最后找到的值
 */
export declare const holder: {
    value: number;
};
/**
 * 从对象中查找一个 keypath
 *
 * 返回值是空时，表示没找到值
 *
 * @param object
 * @param keypath
 * @return
 */
export declare function get(object: any, keypath: string | number): any;
/**
 * 为对象设置一个键值对
 *
 * @param object
 * @param keypath
 * @param value
 * @param autofill 是否自动填充不存在的对象，默认自动填充
 */
export declare function set(object: Object, keypath: string | number, value: any, autofill?: boolean): void;
//# sourceMappingURL=object.d.ts.map