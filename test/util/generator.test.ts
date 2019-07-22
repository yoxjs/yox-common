
import * as generator from 'yox-common/src/util/generator'

test('toString', () => {

  expect(generator.toString(0)).toBe('0')
  expect(generator.toString(1)).toBe('1')
  expect(generator.toString(true)).toBe(generator.TRUE)
  expect(generator.toString(false)).toBe(generator.FALSE)
  expect(generator.toString('1')).toBe('"1"')
  expect(generator.toString(null)).toBe(undefined)
  expect(generator.toString(undefined)).toBe(undefined)

})

test('toObject', () => {

  expect(generator.toObject(['key1:value1', 'key2:value2'])).toBe('{key1:value1,key2:value2}')

  expect(generator.toObject([])).toBe('{}')

})

test('toArray', () => {

  expect(generator.toArray(['value1', 'value2'])).toBe('[value1,value2]')

  expect(generator.toArray([])).toBe('[]')

})

test('toCall', () => {

  expect(generator.toCall('name', [])).toBe('name()')
  expect(generator.toCall('name', ['a'])).toBe('name(a)')
  expect(generator.toCall('name', ['a', undefined, 'b'])).toBe(`name(a,${generator.UNDEFINED},b)`)
  expect(generator.toCall('name', ['a', undefined, 'b', undefined, undefined])).toBe(`name(a,${generator.UNDEFINED},b)`)

})

test('toCall', () => {

  expect(generator.toCall('name', [])).toBe('name()')
  expect(generator.toCall('name', [undefined])).toBe('name()')
  expect(generator.toCall('name', ['a'])).toBe('name(a)')
  expect(generator.toCall('name', ['a', undefined, 'b'])).toBe(`name(a,${generator.UNDEFINED},b)`)
  expect(generator.toCall('name', ['a', undefined, 'b', undefined, undefined])).toBe(`name(a,${generator.UNDEFINED},b)`)

})

test('toFunction', () => {

  expect(generator.toFunction('a', 'x')).toBe(`function(a){var ${generator.UNDEFINED}=void 0,${generator.TRUE}=!0,${generator.FALSE}=!1;${generator.RETURN}x}`)

})