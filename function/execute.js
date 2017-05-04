
import * as is from '../util/is'

/**
 * 放肆的执行一个函数，不管它有没有
 *
 * @param {?Function} fn 调用的函数
 * @param {*} context 执行函数时的 this 指向
 * @param {*} args 调用函数的参数，多参数时传入数组
 * @return {*} 调用函数的返回值
 */
export default function (fn, context, args) {
  if (is.func(fn)) {
    return is.array(args)
      ? fn.apply(context, args)
      : fn.call(context, args)
  }
}
