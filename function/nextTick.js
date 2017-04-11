
import * as env from '../util/env'
import * as char from '../util/char'

function byObserver(fn) {
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

function byImmediate(fn) {
  setImmediate(fn)
}

function byTimeout(fn) {
  setTimeout(fn)
}

let nextTick
if (typeof MutationObserver === 'function') {
  nextTick = byObserver
}
else if (typeof setImmediate === 'function') {
  nextTick = byImmediate
}
else {
  nextTick = byTimeout
}

export default function (fn) {
  // 移动端的输入法唤起时，貌似会影响 MutationObserver 的 nextTick 触发
  // 因此当输入框是激活状态时，改用 setTimeout
  if (env.doc) {
    let { activeElement } = env.doc
    if (activeElement && 'oninput' in activeElement) {
      byTimeout(fn)
      return
    }
  }
  nextTick(fn)
}
