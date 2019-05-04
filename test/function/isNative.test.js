
let isNative = require('../../dist/function/isNative').default

test('test all types', () => {

  expect(isNative(undefined)).toBe(false)
  expect(isNative(null)).toBe(false)
  expect(isNative(false)).toBe(false)
  expect(isNative('')).toBe(false)
  expect(isNative(0)).toBe(false)
  expect(isNative({})).toBe(false)
  expect(isNative([])).toBe(false)
  expect(isNative(function () { })).toBe(false)

  expect(isNative(Date)).toBe(true)
  expect(isNative(RegExp)).toBe(true)
  expect(isNative(Promise)).toBe(true)

})
