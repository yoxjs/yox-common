import {
  YoxInterface,
  CustomEventInterface,
} from 'yox-type/src/yox'

import * as constant from './constant'

export default class CustomEvent implements CustomEventInterface {

  public static PHASE_CURRENT = 0

  public static PHASE_UPWARD = 1

  public static PHASE_DOWNWARD = -1

  public static is(event: any): boolean {
    return event instanceof CustomEvent
  }

  // 事件名称
  type: string

  // 事件当前阶段
  phase: number

  // 事件命名空间
  ns?: string

  // 哪个组件发出的事件
  target?: YoxInterface

  // 原始事件，比如 DOM 事件
  originalEvent?: CustomEventInterface | Event

  // 是否已阻止事件的默认行为
  isPrevented?: true

  // 是否已停止事件冒泡
  isStoped?: true

  /**
   * 构造函数
   *
   * 可以传事件名称，也可以传原生事件对象
   */
  constructor(type: string, originalEvent?: CustomEventInterface | Event) {
    // 这里不设置命名空间
    // 因为有没有命名空间取决于 Emitter 的构造函数有没有传 true
    // CustomEvent 自己无法决定
    this.type = type
    this.phase = CustomEvent.PHASE_CURRENT
    if (originalEvent) {
      this.originalEvent = originalEvent
    }
  }

  /**
   * 阻止事件的默认行为
   */
  preventDefault() {
    const instance = this
    if (!instance.isPrevented) {
      const { originalEvent } = instance
      if (originalEvent) {
        originalEvent.preventDefault()
      }
      instance.isPrevented = constant.TRUE
    }
    return instance
  }

  /**
   * 停止事件广播
   */
  stopPropagation() {
    const instance = this
    if (!instance.isStoped) {
      const { originalEvent } = instance
      if (originalEvent) {
        originalEvent.stopPropagation()
      }
      instance.isStoped = constant.TRUE
    }
    return instance
  }

  prevent() {
    return this.preventDefault()
  }

  stop() {
    return this.stopPropagation()
  }

}