
import * as is from './is'
import * as env from './env'

export default class Event {

  constructor(event) {
    if (event.type) {
      this.type = event.type
      this.originalEvent = event
    }
    else {
      this.type = event
    }
  }

  prevent() {
    if (!this.isPrevented) {
      let { originalEvent } = this
      if (originalEvent) {
        if (is.func(originalEvent.prevent)) {
          originalEvent.prevent()
        }
        else if (is.func(originalEvent.preventDefault)) {
          originalEvent.preventDefault()
        }
      }
      this.isPrevented = env.TRUE
    }
  }

  stop() {
    if (!this.isStoped) {
      let { originalEvent } = this
      if (originalEvent) {
        if (is.func(originalEvent.stop)) {
          originalEvent.stop()
        }
        else if (is.func(originalEvent.stopPropagation)) {
          originalEvent.stopPropagation()
        }
      }
      this.isStoped = env.TRUE
    }
  }

}

Event.is = function (target) {
  return target instanceof Event
}
