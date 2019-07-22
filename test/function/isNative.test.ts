
import isNative from 'yox-common/src/function/isNative'

test('all types', () => {

  expect(isNative(undefined)).toBe(false)
  expect(isNative(null)).toBe(false)
  expect(isNative(false)).toBe(false)
  expect(isNative('')).toBe(false)
  expect(isNative(0)).toBe(false)
  expect(isNative({})).toBe(false)
  expect(isNative([])).toBe(false)
  expect(isNative(function () { })).toBe(false)

  // 简单的伪造是不行的
  const faker1 = function () {
    // this is native code
  }
  expect(isNative(faker1)).toBe(false)

  // 要是这么伪造，我也没辙，用更严格的判断也没啥意义
  const faker2 = function () {
    // this is [native code]
  }
  expect(isNative(faker2)).toBe(true)

  expect(isNative(Date)).toBe(true)
  expect(isNative(RegExp)).toBe(true)
  expect(isNative(Promise)).toBe(true)

})
