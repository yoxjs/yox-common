import CustomEventInterface from 'yox-type/src/Event'

import * as env from './env'

export default class CustomEvent implements CustomEventInterface {

  // 事件名称
  type: string

  // 谁发出的事件
  target?: any

  // 原始事件，比如 dom 事件
  originalEvent?: CustomEventInterface | Event

  // 是否已阻止事件的默认行为
  isPrevented?: boolean

  // 事件是否已停止冒泡
  isStoped?: boolean

  // 处理当前事件的监听器
  listener?: Function

  /**
   * 构造函数
   *
   * 可以传事件名称，也可以传原生事件对象
   */
  constructor(type: string, originalEvent?: CustomEventInterface | Event) {
    this.type = type
    this.originalEvent = originalEvent
  }

  /**
   * 阻止事件的默认行为
   */
  preventDefault(): CustomEventInterface {
    const instance = this
    if (!instance.isPrevented) {
      const { originalEvent } = instance
      if (originalEvent) {
        originalEvent.preventDefault()
      }
      instance.isPrevented = env.TRUE
    }
    return instance
  }

  /**
   * 停止事件广播
   */
  stopPropagation(): CustomEventInterface {
    const instance = this
    if (!instance.isStoped) {
      const { originalEvent } = instance
      if (originalEvent) {
        originalEvent.stopPropagation()
      }
      instance.isStoped = env.TRUE
    }
    return instance
  }

  prevent(): CustomEventInterface {
    return this.preventDefault()
  }

  stop(): CustomEventInterface {
    return this.stopPropagation()
  }

}
