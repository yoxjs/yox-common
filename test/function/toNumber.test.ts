
import toNumber from 'yox-common/src/function/toNumber'

test('defaultValue', () => {
  expect(
    toNumber(null)
  )
  .toBe(0)
  expect(
    toNumber(undefined)
  )
  .toBe(0)
})

test('custom defaultValue', () => {
  expect(
    toNumber(null, 1)
  )
  .toBe(1)
  expect(
    toNumber(undefined, 2)
  )
  .toBe(2)
})

test('string int', () => {
  expect(
    toNumber('1')
  )
  .toBe(1)
})

test('string float', () => {
  expect(
    toNumber('1.1')
  )
  .toBe(1.1)
})

test('int', () => {
  expect(
    toNumber(1)
  )
  .toBe(1)
})

test('float', () => {
  expect(
    toNumber(1.1)
  )
  .toBe(1.1)
})

test('number + string to defaultValue', () => {
  expect(
    toNumber('1str', 10)
  )
  .toBe(10)
})

test('boolean to defaultValue', () => {
  expect(
    toNumber(true, 10)
  )
  .toBe(10)
  expect(
    toNumber(false, 10)
  )
  .toBe(10)
})

test('object to defaultValue', () => {
  expect(
    toNumber({}, 10)
  )
  .toBe(10)
})

test('array to defaultValue', () => {
  expect(
    toNumber([], 10)
  )
  .toBe(10)
})
