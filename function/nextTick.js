
import * as env from '../util/env'

let nextTick

if (typeof MutationObserver === 'function') {
  nextTick = function (fn) {
    let observer = new MutationObserver(fn)
    let textNode = env.doc.createTextNode(env.EMPTY)
    observer.observe(textNode, {
      characterData: env.TRUE,
    })
    textNode.data = ' '
  }
}
else if (typeof setImmediate === 'function') {
  nextTick = function (fn) {
    setImmediate(fn)
  }
}
else {
  nextTick = function (fn) {
    setTimeout(fn)
  }
}

export default nextTick
