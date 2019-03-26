
import * as env from '../util/env'

let nextTick: Function

// IE (10+) 和 node
if (typeof setImmediate === env.RAW_FUNCTION) {
  nextTick = setImmediate
}
// 用 MessageChannel 去做 setImmediate 的 polyfill
// 原理是将新的 message 事件加入到原有的 dom events 之后
// 兼容性 IE10+ 和其他标准浏览器
if (typeof MessageChannel === env.RAW_FUNCTION) {
  nextTick = function (fn: Function) {
    let channel = new MessageChannel()
    channel.port1.onmessage = function () {
      fn()
    }
    channel.port2.postMessage(1)
  }
}
else {
  nextTick = setTimeout
}

export default nextTick
