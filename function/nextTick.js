
import * as env from '../util/env'
import * as char from '../util/char'

let nextTick

if (typeof MutationObserver === 'function') {
  nextTick = function (fn) {
    let observer = new MutationObserver(fn)
    let textNode = env.doc.createTextNode(char.CHAR_BLANK)
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
