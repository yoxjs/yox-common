import * as env from '../util/env'

export default function (target: any): boolean {
  return target !== env.UNDEFINED
}
