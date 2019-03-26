import * as array from './array';
import nextTick from '../function/nextTick';
/**
 * 异步队列
 */
let nextTasks = [];
/**
 * 在队尾添加异步任务
 *
 * @param task
 */
export function append(task) {
    array.push(nextTasks, task);
    if (nextTasks.length === 1) {
        nextTick(run);
    }
}
/**
 * 在队首添加异步任务
 *
 * @param task
 */
export function prepend(task) {
    array.unshift(nextTasks, task);
    if (nextTasks.length === 1) {
        nextTick(run);
    }
}
/**
 * 清空任务队列，立即执行
 */
export function run() {
    let currentTasks = nextTasks;
    nextTasks = [];
    array.each(currentTasks, function (task) {
        task();
    });
}
