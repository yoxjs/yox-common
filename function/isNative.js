
import * as is from '../util/is'
import * as string from '../util/string'

export default function (fn) {
  if (is.func(fn)) {
    return string.has(
      fn.toString(),
      '[native code]'
    )
  }
}
