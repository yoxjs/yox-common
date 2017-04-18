
import nextTick from '../function/nextTick'

import * as array from './array'

let nextTasks = [ ]

function add(name, task) {
  if (!nextTasks.length) {
    nextTick(run)
  }
  array[ name ](nextTasks, task)
}

/**
 * 在队尾添加异步任务
 *
 * @param {Function} task
 */
export function append(task) {
  add('push', task)
}

/**
 * 在队首添加异步任务
 *
 * @param {Function} task
 */
export function prepend(task) {
  add('unshift', task)
}

/**
 * 立即执行已添加的任务
 */
export function run() {
  let tasks = nextTasks
  nextTasks = [ ]
  array.each(
    tasks,
    function (task) {
      // 不设置 i 默认直接执行
      // 设置 i 会进行倒计时，当 i 变成 0 时执行
      if (!task.i) {
        task()
      }
      else {
        task.i--
        array.push(task)
      }
    }
  )
}
