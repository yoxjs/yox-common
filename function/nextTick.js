
import isNative from './isNative'

import * as env from '../util/env'
import * as char from '../util/char'

let nextTick

if (typeof setImmediate === env.RAW_FUNCTION) {
  nextTick = setImmediate
}
// 用 MessageChannel 去做 setImmediate 的 polyfill
// 原理是将新的 message 事件加入到原有的 dom events 之后
else if (typeof MessageChannel === env.RAW_FUNCTION) {
  nextTick = function (fn) {
    var channel = new MessageChannel()
    var port = channel.port2
    channel.port1.onmessage = fn
    port.postMessage(1)
  }
}
else if (typeof Promise === env.RAW_FUNCTION && isNative(Promise)) {
  nextTick = function (fn) {
    Promise.resolve().then(fn)
  }
}
else {
  nextTick = setTimeout
}

export default nextTick
