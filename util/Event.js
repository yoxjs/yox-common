
import * as is from './is'
import * as env from './env'

export default class Event {

  constructor(event) {
    if (event[ env.RAW_TYPE ]) {
      this[ env.RAW_TYPE ] = event[ env.RAW_TYPE ]
      this.originalEvent = event
    }
    else {
      this[ env.RAW_TYPE ] = event
    }
  }

  prevent() {
    let instance = this
    if (!instance.isPrevented) {
      let { originalEvent } = instance
      if (originalEvent) {
        if (is.func(originalEvent.prevent)) {
          originalEvent.prevent()
        }
        else if (is.func(originalEvent.preventDefault)) {
          originalEvent.preventDefault()
        }
      }
      instance.isPrevented = env.TRUE
    }
    return instance
  }

  stop() {
    let instance = this
    if (!instance.isStoped) {
      let { originalEvent } = instance
      if (originalEvent) {
        if (is.func(originalEvent.stop)) {
          originalEvent.stop()
        }
        else if (is.func(originalEvent.stopPropagation)) {
          originalEvent.stopPropagation()
        }
      }
      instance.isStoped = env.TRUE
    }
    return instance
  }

}

Event.is = function (target) {
  return target instanceof Event
}
