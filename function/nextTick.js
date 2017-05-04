
import * as env from '../util/env'
import * as char from '../util/char'
import * as object from '../util/object'

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

export default function (fn) {
  // 移动端的输入法唤起时，貌似会影响 MutationObserver 的 nextTick 触发
  // 因此当输入框是激活状态时，改用 setTimeout
  if (env.doc) {
    let { activeElement } = env.doc
    if (activeElement && object.exists(activeElement, 'autofocus')) {
      setTimeout(fn)
      return
    }
  }
  nextTick(fn)
}
