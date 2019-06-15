import ValueHolder from '../../../yox-type/src/interface/ValueHolder'
import * as env from './env'

/**
 * 全局 value holder，避免频繁的创建临时对象
 */
const valueHolder: ValueHolder = {
  value: env.UNDEFINED
}

export default valueHolder