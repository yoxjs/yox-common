import * as constant from 'yox-type/src/constant'
import isNative from './isNative'

declare const setImmediate: Function

let nextTick: Function

// IE (10+) 和 node
if (typeof setImmediate === constant.RAW_FUNCTION && isNative(setImmediate)) {
  nextTick = setImmediate
}
// 用 MessageChannel 去做 setImmediate 的 polyfill
// 原理是将新的 message 事件加入到原有的 dom events 之后
// 兼容性 IE10+ 和其他标准浏览器
if (typeof MessageChannel === constant.RAW_FUNCTION && isNative(MessageChannel)) {
  nextTick = function (fn: any) {
    const channel = new MessageChannel()
    channel.port1.onmessage = fn
    channel.port2.postMessage(1)
  }
}
else {
  nextTick = setTimeout
}

export default nextTick
