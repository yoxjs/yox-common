
import * as generator from 'yox-common/src/util/generator'

test('toGroup', () => {

  expect(generator.toGroup('x')).toBe('x')
  expect(generator.toGroup('+x')).toBe('+x')
  expect(generator.toGroup('-x')).toBe('-x')
  expect(generator.toGroup('~x')).toBe('~x')
  expect(generator.toGroup('!x')).toBe('!x')
  expect(generator.toGroup('!$1')).toBe('!$1')
  expect(generator.toGroup('!!x')).toBe('!!x')

  expect(generator.toGroup('!x+y')).toBe('(!x+y)')

  expect(generator.toGroup('x+y')).toBe('(x+y)')
  expect(generator.toGroup('x-y')).toBe('(x-y)')
  expect(generator.toGroup('x*y')).toBe('(x*y)')
  expect(generator.toGroup('x/y')).toBe('(x/y)')
  expect(generator.toGroup('x&&y')).toBe('(x&&y)')
  expect(generator.toGroup('x||y')).toBe('(x||y)')
  expect(generator.toGroup('x&y')).toBe('(x&y)')
  expect(generator.toGroup('x|y')).toBe('(x|y)')
  expect(generator.toGroup('x^y')).toBe('(x^y)')
  expect(generator.toGroup('x,y')).toBe('(x,y)')
  expect(generator.toGroup('x?y:z')).toBe('(x?y:z)')


  expect(generator.toGroup('(x,y)')).toBe('(x,y)')
  expect(generator.toGroup('(x),(y)')).toBe('((x),(y))')

  expect(generator.toGroup('[x,y]')).toBe('[x,y]')
  expect(generator.toGroup('[x],[y]')).toBe('([x],[y])')

  expect(generator.toGroup('{x,y}')).toBe('{x,y}')
  expect(generator.toGroup('{x},{y}')).toBe('({x},{y})')

  expect(generator.toGroup('"1-2"')).toBe('"1-2"')
  expect(generator.toGroup('"1","2"')).toBe('("1","2")')

  expect(generator.toGroup('aa("1", 2)')).toBe('aa("1", 2)')
  expect(generator.toGroup('a(),b()')).toBe('(a(),b())')

})

test('toString', () => {

  expect(generator.toString(0)).toBe('0')
  expect(generator.toString(1)).toBe('1')
  expect(generator.toString(true)).toBe(generator.TRUE)
  expect(generator.toString(false)).toBe(generator.FALSE)
  expect(generator.toString('1')).toBe('"1"')
  expect(generator.toString(null)).toBe(generator.NULL)
  expect(generator.toString(undefined)).toBe(generator.UNDEFINED)

})

test('toObject', () => {

  const object = new generator.GeneratorObject()
  object.set('key1', 'value1')
  object.set('key2', 'value2')

  expect(object.toString()).toBe('{key1:value1,key2:value2}')

})

test('toList', () => {

  expect(generator.toList(['value1', 'value2'])).toBe('[value1,value2]')

  expect(generator.toList([])).toBe('[]')

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

  expect(generator.toFunction('a', 'x')).toBe(`function(a){var ${generator.UNDEFINED}=void 0,${generator.NULL}=null,${generator.TRUE}=!0,${generator.FALSE}=!1;${generator.RETURN}x}`)

})