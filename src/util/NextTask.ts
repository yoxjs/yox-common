import * as array from './array'
import execute from '../function/execute'
import nextTick from '../function/nextTick'

let shared: NextTask | void

export default class NextTask {

  /**
   * 全局单例
   */
  public static shared(): NextTask {
    if (!shared) {
      shared = new NextTask()
    }
    return shared
  }

  /**
   * 异步队列
   */
  nextTasks: Function[]

  constructor() {
    this.nextTasks = []
  }

  /**
   * 在队尾添加异步任务
   */
  append(task: Function) {
    array.push(this.nextTasks, task)
    this.start()
  }

  /**
   * 在队首添加异步任务
   */
  prepend(task: Function) {
    array.unshift(this.nextTasks, task)
    this.start()
  }

  /**
   * 启动下一轮任务
   */
  start() {
    const instance = this
    if (instance.nextTasks.length === 1) {
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
    this.nextTasks.length = 0
  }

  /**
   * 立即执行异步任务，并清空队列
   */
  run() {
    const { nextTasks } = this
    if (nextTasks.length) {
      this.nextTasks = []
      array.each(
        nextTasks,
        execute
      )
    }
  }

}
