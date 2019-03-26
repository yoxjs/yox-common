
import isDef from '../../function/isDef'

test('test all types', () => {

  expect(isDef(undefined)).toBe(false)
  expect(isDef(null)).toBe(true)
  expect(isDef(false)).toBe(true)
  expect(isDef('')).toBe(true)
  expect(isDef(0)).toBe(true)
  expect(isDef({})).toBe(true)
  expect(isDef([])).toBe(true)

})
