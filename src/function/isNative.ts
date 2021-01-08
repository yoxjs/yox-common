import toString from './toString'

import * as is from '../util/is'

export default function (target: any): boolean {
  return is.func(target)
    && toString(target).indexOf('[native code]') >= 0
}