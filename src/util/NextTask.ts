import {
  Task,
} from 'yox-type/src/type'

import * as array from './array'
import * as constant from './constant'

import execute from '../function/execute'
import nextTick from '../function/nextTick'

let shared: NextTask | void

type NextTaskHooks = {
  beforeTask?: Function,
  afterTask?: Function,
}

export default class NextTask {

  /**
   * 全局单例
   */
  public static shared() {
    return shared || (shared = new NextTask())
  }

  /**
   * 异步队列
   */
  private tasks: Task[]

  private hooks: NextTaskHooks

  constructor(hooks?: NextTaskHooks) {

    const instance = this

    instance.tasks = [ ]
    instance.hooks = hooks || constant.EMPTY_OBJECT

  }

  /**
   * 在队尾添加异步任务
   */
  append(func: Function, context?: any) {
    const instance = this, { tasks } = instance
    array.push(
      tasks,
      {
        fn: func,
        ctx: context
      }
    )
    if (tasks.length === 1) {
      nextTick(
        function () {
          instance.run()
        }
      )
    }
  }

  /**
   * 在队首添加异步任务
   */
  prepend(func: Function, context?: any) {
    const instance = this, { tasks } = instance
    array.unshift(
      tasks,
      {
        fn: func,
        ctx: context
      }
    )
    if (tasks.length === 1) {
      nextTick(
        function () {
          instance.run()
        }
      )
    }
  }

  /**
   * 清空异步队列
   */
  clear() {
    this.tasks.length = 0
  }

  /**
   * 立即执行异步任务，并清空队列
   */
  run() {
    const instance = this, { tasks, hooks } = instance, { length } = tasks
    if (length) {
      instance.tasks = [ ]
      if (hooks.beforeTask) {
        hooks.beforeTask()
      }
      for (let i = 0; i < length; i++) {
        execute(
          tasks[i].fn,
          tasks[i].ctx
        )
      }
      if (hooks.afterTask) {
        hooks.afterTask()
      }
    }
  }

}
