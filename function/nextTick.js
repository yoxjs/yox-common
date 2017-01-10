
import * as env from '../util/env'
import * as char from '../util/char'

let nextTick

if (typeof MutationObserver === 'function') {
  nextTick = function (fn) {
    let observer = new MutationObserver(fn)
    let textNode = env.doc.createTextNode(char.CHAR_BLANK)
    observer.observe(
      textNode,
      {
        characterData: env.TRUE,
      }
    )
    textNode.data = char.CHAR_WHITESPACE
  }
}
else if (typeof setImmediate === 'function') {
  nextTick = setImmediate
}
else {
  nextTick = setTimeout
}

export default nextTick
