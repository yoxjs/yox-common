import {
  ValueHolder,
} from 'yox-type/src/type'

import * as constant from './constant'

/**
 * 全局 value holder，避免频繁的创建临时对象
 */
const holder: ValueHolder = {
  value: constant.UNDEFINED
}

export default holder