
import isDef from '../../src/function/isDef'

test('all types', () => {

  expect(isDef(null)).toBe(true)
  expect(isDef(false)).toBe(true)
  expect(isDef('')).toBe(true)
  expect(isDef(0)).toBe(true)
  expect(isDef(NaN)).toBe(true)
  expect(isDef({})).toBe(true)
  expect(isDef([])).toBe(true)

  expect(isDef(undefined)).toBe(false)

})
