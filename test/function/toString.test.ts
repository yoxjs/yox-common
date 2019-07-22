
import toString from 'yox-common/src/function/toString'

test('default value', () => {
  expect(
    toString(null)
  )
  .toBe('')

  expect(
    toString(undefined)
  )
  .toBe('')
})

test('custom default value', () => {
  expect(
    toString(null, '1')
  )
  .toBe('1')

  expect(
    toString(undefined, '2')
  )
  .toBe('2')
})

test('type is string', () => {
  expect(
    toString('1')
  )
  .toBe('1')
})

test('type is number', () => {
  expect(
    toString(1.1)
  )
  .toBe('1.1')
})

test('type is boolean', () => {
  expect(
    toString(true)
  )
  .toBe('true')

  expect(
    toString(false)
  )
  .toBe('false')
})

test('type is object', () => {
  const object = { name: 'xx' }
  expect(
    toString(object)
  )
  .toBe(object.toString())
})

test('type is array', () => {
  const array = [1, 2, 3]
  expect(
    toString(array)
  )
  .toBe(array.toString())
})

test('type is Date', () => {
  const date = new Date()
  expect(
    toString(date)
  )
  .toBe(date.toString())
})
