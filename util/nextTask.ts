import * as env from './env'
import * as array from './array'
import nextTick from '../function/nextTick'

/**
 * 异步队列
 */
let nextTasks: Function[] = []

/**
 * 在队尾添加异步任务
 *
 * @param task
 */
export function append(task: Function) {
  array.push(nextTasks, task)
  if (nextTasks[env.RAW_LENGTH] === 1) {
    nextTick(run)
  }
}

/**
 * 在队首添加异步任务
 *
 * @param task
 */
export function prepend(task: Function) {
  array.unshift(nextTasks, task)
  if (nextTasks[env.RAW_LENGTH] === 1) {
    nextTick(run)
  }
}

/**
 * 清空任务队列，立即执行
 */
export function run() {
  let currentTasks = nextTasks
  nextTasks = []
  array.each(
    currentTasks,
    function (task: Function) {
      task()
    }
  )
}
