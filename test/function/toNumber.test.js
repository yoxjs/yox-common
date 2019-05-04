
let toNumber = require('../../dist/function/toNumber').default

it('defaultValue is 0', () => {
  expect(
    toNumber(null)
  )
  .toBe(0)
  expect(
    toNumber(undefined)
  )
  .toBe(0)
})
it('custom defaultValue', () => {
  expect(
    toNumber(null, 1)
  )
  .toBe(1)
})
it('string int to number', () => {
  expect(
    toNumber('1')
  )
  .toBe(1)
})
it('string float to number', () => {
  expect(
    toNumber('1.1')
  )
  .toBe(1.1)
})
it('int to number', () => {
  expect(
    toNumber(1)
  )
  .toBe(1)
})
it('float to number', () => {
  expect(
    toNumber(1.1)
  )
  .toBe(1.1)
})
it('number + string', () => {
  expect(
    toNumber('1str')
  )
  .toBe(0)
})
it('boolean to defaultValue', () => {
  expect(
    toNumber(true)
  )
  .toBe(0)
  expect(
    toNumber(false)
  )
  .toBe(0)
})
it('object to defaultValue', () => {
  expect(
    toNumber({})
  )
  .toBe(0)
})
it('array to defaultValue', () => {
  expect(
    toNumber([])
  )
  .toBe(0)
})
