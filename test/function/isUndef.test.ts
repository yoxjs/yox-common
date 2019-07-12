
import isUndef from '../../src/function/isUndef'

test('all types', () => {

  expect(isUndef(null)).toBe(false)
  expect(isUndef(false)).toBe(false)
  expect(isUndef('')).toBe(false)
  expect(isUndef(0)).toBe(false)
  expect(isUndef(NaN)).toBe(false)
  expect(isUndef({})).toBe(false)
  expect(isUndef([])).toBe(false)

  expect(isUndef(undefined)).toBe(true)

})
