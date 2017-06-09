
import nextTick from '../function/nextTick'

import * as array from './array'

let nextTasks = [ ]

function runTasks() {
  let currentTasks = nextTasks
  nextTasks = [ ]
  array.each(
    currentTasks,
    function (task) {
      task()
    }
  )
}

function addTask(name, task) {
  if (!nextTasks.length) {
    nextTick(runTasks)
  }
  array[ name ](nextTasks, task)
}

/**
 * 在队尾添加异步任务
 *
 * @param {Function} task
 */
export function append(task) {
  addTask('push', task)
}

/**
 * 在队首添加异步任务
 *
 * @param {Function} task
 */
export function prepend(task) {
  addTask('unshift', task)
}
