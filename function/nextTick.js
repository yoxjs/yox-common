
import isNative from './isNative'

import * as env from '../util/env'
import * as char from '../util/char'

let nextTick
if (typeof Promise === env.RAW_FUNCTION && isNative(Promise)) {
  let promise = Promise.resolve()
  nextTick = function (fn) {
    promise.then(fn)
    setTimeout(env.noop)
  }
}
else if (typeof MutationObserver === env.RAW_FUNCTION) {
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
else if (typeof setImmediate === env.RAW_FUNCTION) {
  nextTick = setImmediate
}
else {
  nextTick = setTimeout
}

export default function (fn) {
  nextTick(fn)
}
