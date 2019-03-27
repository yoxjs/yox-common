/**
 * 判断 keypath 是否以 prefix 开头，如果是，返回匹配上的前缀长度，否则返回 -1
 *
 * @param keypath
 * @param prefix
 * @return
 */
export declare function match(keypath: string, prefix: string): number;
/**
 * 遍历 keypath 的每个部分
 *
 * @param keypath
 * @param callback 返回 false 可中断遍历
 */
export declare function each(keypath: any, callback: (key: string | number, isLast: boolean) => boolean | void): void;
/**
 * 遍历 keypath 的每个部分
 *
 * @param keypath1
 * @param keypath2
 */
export declare function join(keypath1: string | number, keypath2: string | number): string | number;
//# sourceMappingURL=keypath.d.ts.map