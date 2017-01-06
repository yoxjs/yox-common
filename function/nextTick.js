
import * as env from '../util/env'
import * as string from '../util/string'

let nextTick

if (typeof MutationObserver === 'function') {
  nextTick = function (fn) {
    let observer = new MutationObserver(fn)
    let textNode = env.doc.createTextNode(string.CHAR_BLANK)
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
