import { valueHolder } from '../../../yox-type/src/type'
import * as env from './env'

/**
 * 全局 value holder，避免频繁的创建临时对象
 */
const holder: valueHolder = {
  value: env.UNDEFINED
}

export default holder