import * as is from '../util/is'
import * as string from '../util/string'
import toString from './toString'

export default function (target: any): boolean {
  return is.func(target)
    && string.has(toString(target), '[native code]')
}